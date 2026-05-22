import type { Request, Response } from 'express';
import type { SessionUser } from '../../../../types/express.js';
import type { Keystone } from '../../../../index.mjs';
import { isEmail } from '../../../../lib/utils/email.mjs';
import { escapeRegExp } from '../../../../lib/utils/regexp.mjs';
import {
	clearSigninFailures,
	recordSigninFailure,
	sendSigninSecurityBlock,
} from './signinSecurity.mjs';

function sendSigninInternalError(res: Response, error: string): void {
	res.status(500).json({ error });
}

/**
 * Authenticates a user with email + password after verifying the CSRF token.
 * Fires `pre:signin` and `post:signin` hooks around the bcrypt comparison.
 */
function signin(req: Request, res: Response): void {
	const keystone = req.keystone as Keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	const signinBody = req.body as Record<string, unknown>;
	const email = signinBody['email'];
	const password = signinBody['password'];
	if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
		res.status(401).json({ error: 'email and password required' });
		return;
	}
	if (!isEmail(email)) {
		const block = recordSigninFailure(req, email);
		if (block) {
			sendSigninSecurityBlock(res, block);
			return;
		}
		res.status(401).json({ error: 'invalid details' });
		return;
	}
	const userModel = keystone.get('user model');
	const User = userModel ? keystone.lists[userModel] : undefined;
	if (!User) return sendSigninInternalError(res, 'user model not configured');
	const emailRegExp = new RegExp('^' + escapeRegExp(email) + '$', 'i');
	User.model.findOne({ email: emailRegExp }).exec().then(function (userDoc: unknown): void {
		if (userDoc) {
			// Cast once to SessionUser — Keystone guarantees findOne returns a user doc
			// with at least `id` and the password field helper (`_`).
			const user = userDoc as SessionUser & { _: { password: { compare(pwd: string, cb: (err: Error | null, isMatch: boolean) => void): void } } };
			keystone.callHook(user, 'pre:signin', req, function (err: unknown): void {
				if (err) { sendSigninInternalError(res, 'pre:signin error'); return; }
				user._.password.compare(password, function (compareErr: Error | null, isMatch: boolean): void {
					if (isMatch) {
						clearSigninFailures(email);
						keystone.session.signinWithUser(user, req, res, function (): void {
							keystone.callHook(user, 'post:signin', req, function (postErr: unknown): void {
								if (postErr) { sendSigninInternalError(res, 'post:signin error'); return; }
								res.json({ success: true, user });
							});
						});
					} else if (compareErr) {
						sendSigninInternalError(res, 'bcrypt error');
					} else {
						const block = recordSigninFailure(req, email);
						if (block) {
							sendSigninSecurityBlock(res, block);
							return;
						}
						res.status(401).json({ error: 'invalid details' });
					}
				});
			});
		} else {
			const block = recordSigninFailure(req, email);
			if (block) {
				sendSigninSecurityBlock(res, block);
				return;
			}
			res.status(401).json({ error: 'invalid details' });
		}
	}, function (_err: unknown): void {
		sendSigninInternalError(res, 'database error');
	});
}

export default signin;
