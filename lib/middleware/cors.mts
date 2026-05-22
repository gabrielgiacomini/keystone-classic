import type { RequestHandler } from 'express';
import type { Keystone } from '../../index.mjs';

function resolveAllowedOrigin(origin: unknown, requestOrigin: unknown): string | undefined {
	if (origin === true) {
		throw new Error('The option "cors allow origin" must be an explicit origin string or string array; boolean true is not supported.');
	}
	if (typeof origin === 'string') return origin;
	if (Array.isArray(origin) && typeof requestOrigin === 'string' && origin.includes(requestOrigin)) {
		return requestOrigin;
	}
	return undefined;
}

export default function cors (keystone: Keystone): RequestHandler {
	return function corsMiddleware (req, res, next) {
		const origin = keystone.get('cors allow origin');
		if (origin) {
			const allowedOrigin = resolveAllowedOrigin(origin, req.headers.origin);
			if (allowedOrigin) {
				res.header('Access-Control-Allow-Origin', allowedOrigin);
			}
		}
		res.header('Access-Control-Allow-Methods', keystone.get('cors allow methods') ?? 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', keystone.get('cors allow headers') ?? 'Content-Type, Authorization');
		next();
	};
}
