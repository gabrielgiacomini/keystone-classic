import type { Request, Response, NextFunction } from 'express';

function stringifyError(val: unknown): string {
	if (val instanceof Error) {
		return val.name !== 'Error' ? val.name + ': ' + val.message : val.message;
	}
	if (typeof val === 'object' && val !== null) {
		return JSON.stringify(val);
	}
	return String(val);
}

export default function (_req: Request, res: Response, next: NextFunction): void {
	res.apiError = function apiError(statusOrKey: number | string, errorOrDetail?: unknown, msg?: string, _code?: number) {
		let statusCode: number;
		let error: unknown;
		let detail: unknown;

		// Overload: apiError(statusCode, error, detail?) — numeric first arg
		if (typeof statusOrKey === 'number') {
			statusCode = statusOrKey;
			error = errorOrDetail;
			detail = msg;
		} else {
			// Overload: apiError(error) — no status code passed; shift args
			statusCode = 500;
			error = statusOrKey;
			detail = errorOrDetail;
		}

		if (statusCode) {
			res.status(statusCode);
		}

			// Unwrap {error, detail} shaped objects
			if (!detail && typeof error === 'object' && error !== null
				&& !Array.isArray(error)
				&& Object.prototype.toString.call(error) === '[object Object]') {
				const rec = error as Record<string, unknown>;
				if (rec['error'] !== undefined && rec['detail'] !== undefined) {
					detail = rec['detail'];
				error = rec['error'];
			}
		}

		// Flatten Error instances to message strings
		if (error instanceof Error) {
			error = stringifyError(error);
		}
		if (detail instanceof Error) {
			detail = stringifyError(detail);
		}

			const data: unknown =
				typeof error === 'string' || (error && detail)
					? { error, detail }
					: error;

		res.json(data);
	};
	next();
}
