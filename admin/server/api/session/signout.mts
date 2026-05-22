import type { Request, Response } from 'express';
import type { Keystone } from '../../../../index.mjs';

interface CookieSigninOptions {
	signed: boolean;
	httpOnly: boolean;
	secure?: boolean;
	sameSite?: boolean | 'lax' | 'strict' | 'none';
	maxAge?: number;
	[key: string]: unknown;
}

function getCookieSigninOptions(keystone: Keystone): CookieSigninOptions {
	const configured = keystone.get('cookie signin options');
	const options = configured && typeof configured === 'object' && !Array.isArray(configured)
		? configured
		: {};
	return {
		signed: true,
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		...options,
		maxAge: 0,
	};
}

function sendSignoutInternalError(res: Response, error: string): void {
	res.status(500).json({ error });
}

/**
 * Signs the current user out after verifying the CSRF token.
 * Clears the session cookie and fires `pre:signout` / `post:signout` hooks.
 */
function signout(req: Request, res: Response): void {
	const keystone = req.keystone;
	if (!keystone) {
		res.status(500).json({ error: 'keystone not initialised' });
		return;
	}
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	const user = req.user ?? {};
	keystone.callHook(user, 'pre:signout', function (err: unknown): void {
		if (err) { sendSignoutInternalError(res, 'pre:signout error'); return; }
		res.clearCookie('keystone.uid', getCookieSigninOptions(keystone));
		req.user = null;
		req.session.regenerate(function (sessionErr: unknown): void {
			if (sessionErr) { sendSignoutInternalError(res, 'session error'); return; }
			keystone.callHook(user, 'post:signout', function (postErr: unknown): void {
				if (postErr) { sendSignoutInternalError(res, 'post:signout error'); return; }
				res.json({ success: true });
			});
		});
	});
}

export default signout;
