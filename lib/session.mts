import crypto from 'crypto';
import { isEmail } from './utils/email.mjs';
import { escapeRegExp } from './utils/regexp.mjs';

function scmp (a: string | number, b: string | number): boolean {
	const sa = String(a), sb = String(b);
	if (sa.length !== sb.length) return false;
	return crypto.timingSafeEqual(Buffer.from(sa), Buffer.from(sb));
}
import _ from 'lodash';
import keystone from '../index.mjs';
import type { Request, Response, NextFunction } from 'express';
import type { SessionUser } from '../types/express.js';
import { getAdminLegacyPath } from './core/adminSurfacePathUtils.mjs';
import { userCanAccessKeystone } from './canAccessKeystone.mjs';

// ---------------------------------------------------------------------------
// Augment express-session's SessionData so req.session.userId is typed.
// ---------------------------------------------------------------------------
declare module 'express-session' {
	interface SessionData {
		userId?: string | null;
	}
}

// ---------------------------------------------------------------------------
// Minimal typed surface for the session module itself (used in postHookedSignin).
// ---------------------------------------------------------------------------
/**
 * KeystoneSessionModule.
 *
 */
export interface KeystoneSessionModule {
	signinWithUser(user: SessionUser, req: Request, res: Response, onSuccess: (user: SessionUser) => void): void;
	signin(lookup: SigninLookup, req: Request, res: Response, onSuccess: (user: SessionUser) => void, onFail: (err: Error | null) => void): void;
	signout(req: Request, res: Response, next: NextFunction): void;
	persist(req: Request, res: Response, next: NextFunction): void;
	keystoneAuth(req: Request, res: Response, next: NextFunction): void;
}

// ---------------------------------------------------------------------------
// Keystone user document as returned by Mongoose — adds the framework's
// field-accessor property `_` that exposes typed field helpers such as
// `password.compare`.  This is a local extension of SessionUser; callers
// outside this file receive the narrower SessionUser interface.
// ---------------------------------------------------------------------------
interface KeystoneUserDoc extends SessionUser {
	_: {
		password: {
			compare(plain: string, callback: (err: Error | null, isMatch: boolean) => void): void;
		};
	};
}

// ---------------------------------------------------------------------------
// Cookie options type — maxAge is optional because signout sets it to 0.
// ---------------------------------------------------------------------------
interface CookieSigninOptions {
	signed: boolean;
	httpOnly: boolean;
	secure?: boolean;
	sameSite?: boolean | 'lax' | 'strict' | 'none';
	maxAge?: number;
}

function getCookieSigninOptions(defaults: Partial<CookieSigninOptions> = {}): CookieSigninOptions {
	return _.defaults({}, keystone.get('cookie signin options'), defaults, {
		signed: true,
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
	});
}

function hash(str: string): string {
	str = str.slice(0, Math.round(str.length / 2));
	const cookieSecret = keystone.get('cookie secret');
	if (!cookieSecret) throw new Error('session.hash: keystone "cookie secret" config is required');
	return crypto
		.createHmac('sha256', cookieSecret)
		.update(str)
		.digest('base64')
		.replace(/=+$/, '');
}

/**
 * signinWithUser.
 *
 * @param user - Description
 * @param req - Description
 * @param res - Description
 * @param onSuccess - Description
 */
export function signinWithUser(user: SessionUser, req: Request, res: Response, onSuccess: (user: SessionUser) => void): void {
	if (arguments.length < 4) {
		throw new Error('keystone.session.signinWithUser requires user, req and res objects, and an onSuccess callback.');
	}
	if (typeof user !== 'object') {
		throw new Error('keystone.session.signinWithUser requires user to be an object.');
	}
	if (typeof req !== 'object') {
		throw new Error('keystone.session.signinWithUser requires req to be an object.');
	}
	if (typeof res !== 'object') {
		throw new Error('keystone.session.signinWithUser requires res to be an object.');
	}
	if (typeof onSuccess !== 'function') {
		throw new Error('keystone.session.signinWithUser requires onSuccess to be a function.');
	}
	req.session.regenerate(function () {
		req.user = user;
		req.session.userId = user.id;
		if (keystone.get('cookie signin') && user.password) {
			const userToken = user.id + ':' + hash(user.password);
			const cookieOpts = getCookieSigninOptions({
				maxAge: 10 * 24 * 60 * 60 * 1000,
			});
			const sessionCookie = (req.session as unknown as { cookie?: { maxAge?: number } }).cookie;
			if (sessionCookie) {
				sessionCookie.maxAge = cookieOpts.maxAge;
			}
			res.cookie('keystone.uid', userToken, cookieOpts);
		}
		onSuccess(user);
	});
}

const postHookedSigninWithUser = function (user: SessionUser, req: Request, res: Response, onSuccess: (user: SessionUser) => void, onFail: (err: Error | null) => void) {
	keystone.callHook(user, 'post:signin', req, function (err?: Error) {
		if (err) {
			return onFail(err);
		}
		(keystone.session as KeystoneSessionModule).signinWithUser(user, req, res, onSuccess);
	});
};

/** Credentials for email/password login, or a string token / user-id for cookie-based login. */
type SigninLookup = { email: string; password: string } | string;

const doSignin = function (lookup: SigninLookup, req: Request, res: Response, onSuccess: (user: SessionUser) => void, onFail: (err: Error | null) => void) {
	if (!lookup) {
		return onFail(new Error('session.signin requires a User ID or Object as the first argument'));
	}
	const userModel = keystone.get('user model');
	if (!userModel) throw new Error('session.doSignin: keystone "user model" config is required');
	const User = keystone.lists[userModel];
	if (!User) throw new Error('session.doSignin: user model ' + userModel + ' is not registered');
	if (typeof lookup === 'object' && typeof lookup.email === 'string' && typeof lookup.password === 'string') {
		if (!isEmail(lookup.email)) {
			return onFail(new Error('Incorrect email or password'));
		}
		const emailRegExp = new RegExp('^' + escapeRegExp(lookup.email) + '$', 'i');
		(User.model.findOne({ email: emailRegExp }).exec() as Promise<KeystoneUserDoc | null>).then(function (user: KeystoneUserDoc | null) {
			if (user) {
				user._.password.compare(lookup.password, function (err: Error | null, isMatch: boolean) {
					if (!err && isMatch) {
						postHookedSigninWithUser(user, req, res, onSuccess, onFail);
					} else {
						onFail(err ?? new Error('Incorrect email or password'));
					}
				});
			} else {
				onFail(new Error('Incorrect email or password'));
			}
		}, onFail);
	} else {
		if (typeof lookup !== 'string') {
			return onFail(new Error('session.signin requires a User ID or string token as the first argument'));
		}
		const lookupStr = lookup;
		const userId = (lookupStr.indexOf(':') > 0) ? lookupStr.slice(0, lookupStr.indexOf(':')) : lookupStr;
		const passwordCheck = (lookupStr.indexOf(':') > 0) ? lookupStr.slice(lookupStr.indexOf(':') + 1) : false;
		(User.model.findById(userId).exec() as Promise<KeystoneUserDoc | null>).then(function (user: KeystoneUserDoc | null) {
			if (user && (!passwordCheck || scmp(passwordCheck, hash(String(user.password))))) {
				postHookedSigninWithUser(user, req, res, onSuccess, onFail);
			} else {
				onFail(new Error('Incorrect user or password'));
			}
		}, onFail);
	}
};

/**
 * signin.
 *
 * @param lookup - Description
 * @param req - Description
 * @param res - Description
 * @param onSuccess - Description
 * @param onFail - Description
 */
export function signin(lookup: SigninLookup, req: Request, res: Response, onSuccess: (user: SessionUser) => void, onFail: (err: Error | null) => void): void {
	keystone.callHook({}, 'pre:signin', req, function (err?: Error) {
		if (err) {
			return onFail(err);
		}
		doSignin(lookup, req, res, onSuccess, onFail);
	});
}

export const signout = function (req: Request, res: Response, next: NextFunction): void {
	keystone.callHook(req.user ?? {}, 'pre:signout', function (err?: Error) {
		if (err) {
			return next(err);
		}
		const cookieOpts = getCookieSigninOptions();
		cookieOpts.maxAge = 0;
		res.clearCookie('keystone.uid', cookieOpts);
		req.user = null;
		req.session.userId = null;
		req.session.regenerate(function (sessionErr: Error | null) {
			if (sessionErr) {
				return next(sessionErr);
			}
			keystone.callHook({}, 'post:signout', function (postErr?: Error) {
				if (postErr) {
					console.log("An error occurred in signout 'post' middleware", postErr);
				}
				next();
			});
		});
	});
};

export const persist = function (req: Request, res: Response, next: NextFunction): void {
	const userModel = keystone.get('user model');
	if (!userModel) throw new Error('session.persist: keystone "user model" config is required');
	const User = keystone.lists[userModel];
	if (!User) throw new Error('session.persist: user model ' + userModel + ' is not registered');
	if (keystone.get('cookie signin') && !req.session.userId && req.signedCookies['keystone.uid'] && String(req.signedCookies['keystone.uid']).indexOf(':') > 0) {
		signin(String(req.signedCookies['keystone.uid']), req, res, function () {
			next();
		}, function () {
			const cookieOpts = getCookieSigninOptions();
			cookieOpts.maxAge = 0;
			res.clearCookie('keystone.uid', cookieOpts);
			req.user = null;
			next();
		});
	} else if (req.session.userId) {
		(User.model.findById(req.session.userId).exec() as Promise<SessionUser | null>).then(function (user: SessionUser | null) {
			req.user = user;
			next();
		}, next);
	} else {
		next();
	}
};

export const keystoneAuth = function (req: Request, res: Response, next: NextFunction): void {
	if (!userCanAccessKeystone(req.user)) {
		if (req.headers.accept === 'application/json') {
			if (req.user) {
				res.status(403).json({ error: 'not authorised' });
			} else {
				res.status(401).json({ error: 'not signed in' });
			}
			return;
		}
		const adminLegacyPath = getAdminLegacyPath(keystone);
		const regex = new RegExp('^' + adminLegacyPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/?$', 'i');
		const from = regex.test(req.originalUrl) ? '' : '?from=' + req.originalUrl;
		const signinUrl = keystone.get('signin url');
		if (!signinUrl) throw new Error('session.keystoneAuth: keystone "signin url" config is required');
		res.redirect(signinUrl + from);
		return;
	}
	next();
};

export default { signinWithUser, signin, signout, persist, keystoneAuth };
