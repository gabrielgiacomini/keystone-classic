import type { Keystone } from '../../index.mjs';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export default function api (keystone: Keystone): RequestHandler {
	return function initAPI (req: Request, res: Response, next: NextFunction) {
		res.apiResponse = function (data: unknown) {
			if (req.query.callback) {
				res.jsonp(data);
			} else {
				res.json(data);
			}
		};

		res.apiError = function (statusOrKey: number | string, errorOrDetail?: unknown, msg?: string, code?: number) {
			const key = String(statusOrKey);
			msg = msg || 'Error';
			const fullMsg = msg + ' (' + key + ')';
			if (keystone.get('logger')) {
				console.log(fullMsg + (errorOrDetail ? ':' : ''));
				if (errorOrDetail) console.log(errorOrDetail);
			}
			res.status(code || 500);
			let detail: unknown = errorOrDetail;
			if (errorOrDetail instanceof Error) {
				detail = errorOrDetail.name !== 'Error' ? errorOrDetail.name + ': ' + errorOrDetail.message : errorOrDetail.message;
			}
			res.apiResponse({ error: key || 'error', detail });
		};

		res.apiNotFound = function (err?: unknown, msg?: string) {
			res.apiError('data not found', err, msg || 'not found', 404);
		};

		res.apiNotAllowed = function (err?: unknown, msg?: string) {
			res.apiError('access not allowed', err, msg || 'not allowed', 403);
		};

		next();
	};
}
