import type { NextFunction, Request, RequestHandler, Response } from 'express';

const HEADER_NAME = 'x-http-method-override';
const POST_METHOD = 'POST';
const ALLOWED_METHODS = new Set(['DELETE', 'PATCH', 'POST', 'PUT']);

type OverrideRequest = Request & {
	originalMethod?: string;
};

function firstHeaderValue(value: string | string[] | undefined): string {
	return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function normalizedOverrideMethod(req: Request): string {
	const header = firstHeaderValue(req.headers[HEADER_NAME]);
	return header.trim().toUpperCase();
}

/**
 * Creates Keystone's HTTP method override middleware.
 *
 * This preserves the default `method-override` package behavior Keystone used:
 * only POST requests may be overridden, and the override value is read from the
 * `X-HTTP-Method-Override` header.
 *
 * @returns Express middleware that updates `req.method` for valid override headers.
 */
export default function createMethodOverrideMiddleware(): RequestHandler {
	return function methodOverride(req: OverrideRequest, _res: Response, next: NextFunction): void {
		const originalMethod = req.method.toUpperCase();
		const overrideMethod = normalizedOverrideMethod(req);
		if (originalMethod === POST_METHOD && ALLOWED_METHODS.has(overrideMethod)) {
			req.originalMethod = req.method;
			req.method = overrideMethod;
		}
		next();
	};
}
