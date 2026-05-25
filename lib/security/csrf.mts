import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

function scmp (a: string | number, b: string | number): boolean {
	const sa = String(a), sb = String(b);
	if (sa.length !== sb.length) return false;
	return crypto.timingSafeEqual(Buffer.from(sa), Buffer.from(sb));
}

const DISABLE_CSRF = process.env['DISABLE_CSRF'] === 'true';

if (DISABLE_CSRF && process.env['NODE_ENV'] === 'production') {
	throw new Error('DISABLE_CSRF must not be set in NODE_ENV=production');
}

export const TOKEN_KEY = '_csrf';
export const LOCAL_KEY = 'csrf_token_key';
export const LOCAL_VALUE = 'csrf_token_value';
export const SECRET_KEY = TOKEN_KEY + '_secret';
export const SECRET_LENGTH = 10;
export const CSRF_HEADER_KEY = 'x-csrf-token';
export const XSRF_HEADER_KEY = 'x-xsrf-token';
export const XSRF_COOKIE_KEY = 'XSRF-TOKEN';

function tokenize (salt: string, secret: string): string {
	// SHA-1 is intentional here — CSRF token generation, not password/data hashing.
	return salt + crypto.createHash('sha1').update(salt + secret).digest('hex');
}

/** Generates a new random CSRF secret string. */
export function createSecret (): string {
	return crypto.randomBytes(SECRET_LENGTH).toString('base64');
}

/**
 * Returns the session's CSRF secret, creating and storing one if absent.
 */
export function getSecret (req: Request): string {
	const session = req.session as unknown as Record<string, string>;
	return session[SECRET_KEY] || (session[SECRET_KEY] = createSecret());
}

/**
 * Creates a new signed CSRF token tied to the current session secret.
 */
export function createToken (req: Request): string {
	const salt = crypto.randomBytes(SECRET_LENGTH).toString('hex').slice(0, SECRET_LENGTH);
	return tokenize(salt, getSecret(req));
}

/**
 * Returns the per-request CSRF token, creating one if needed, and sets the
 * XSRF-TOKEN cookie so JavaScript clients can read it.
 */
export function getToken (req: Request, res: Response): string {
	res.locals[LOCAL_VALUE] = res.locals[LOCAL_VALUE] || createToken(req);
	res.cookie(XSRF_COOKIE_KEY, res.locals[LOCAL_VALUE], {
		secure: req.secure,
		sameSite: 'lax',
		httpOnly: false, // intentionally readable by the SPA for the XSRF token pattern
	});
	return res.locals[LOCAL_VALUE];
}

/**
 * Extracts the CSRF token from the request body, query string, or one of the
 * recognised CSRF/XSRF headers.
 */
export function requestToken (req: Partial<Request>): string {
	const body = req.body as Record<string, string> | undefined;
	const query = req.query as Record<string, string> | undefined;
	const headers = req.headers as Record<string, string> | undefined;
	if (body?.[TOKEN_KEY]) {
		return body[TOKEN_KEY];
	} else if (query?.[TOKEN_KEY]) {
		return query[TOKEN_KEY];
	} else if (headers?.[XSRF_HEADER_KEY]) {
		return headers[XSRF_HEADER_KEY];
	} else if (headers?.[CSRF_HEADER_KEY]) {
		return headers[CSRF_HEADER_KEY];
	}
	return '';
}

/**
 * Validates a CSRF token against the session secret using a timing-safe comparison.
 * Accepts an explicit token or reads one from the request when called with one argument.
 */
export function validate (req: Request, token?: string): boolean {
	if (DISABLE_CSRF) return true;
	if (arguments.length === 1) {
		token = requestToken(req);
	}
	if (typeof token !== 'string') {
		return false;
	}
	const secret = (req.session as unknown as Record<string, string>)[SECRET_KEY];
	if (typeof secret !== 'string') return false;
	return scmp(
		token,
		tokenize(
			token.slice(0, SECRET_LENGTH),
			secret
		)
	);
}

/** Express middleware helpers for CSRF protection (`init` injects the token; `validate` enforces it). */
export const middleware = {
	init: function (req: Request, res: Response, next: NextFunction) {
		res.locals[LOCAL_KEY] = LOCAL_VALUE;
		getToken(req, res);
		next();
	},
	validate: function (req: Request, res: Response, next: NextFunction) {
		if (DISABLE_CSRF) return next();
		if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
			return next();
		}
		if (validate(req)) {
			next();
		} else {
			res.statusCode = 403;
			next(new Error('CSRF token mismatch'));
		}
	},
};

export default {
	TOKEN_KEY, LOCAL_KEY, LOCAL_VALUE, SECRET_KEY, SECRET_LENGTH,
	CSRF_HEADER_KEY, XSRF_HEADER_KEY, XSRF_COOKIE_KEY,
	createSecret, getSecret, createToken, getToken, requestToken, validate, middleware,
};
