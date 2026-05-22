import type { Request, Response, NextFunction } from 'express';

function stringifyLogValue(value: unknown): string {
	if (typeof value === 'object' && value !== null) {
		return JSON.stringify(value);
	}
	return String(value);
}

export default function (_req: Request, res: Response, next: NextFunction): void {
	res.logError = function logError(endpoint: string, description: string, err?: unknown) {
		let msg = '[' + endpoint + ']';
		msg += description ? ' ' + description + ':' : ' error:';
		if (err instanceof Error) {
			console.log(msg, err.message, '\n' + (err.stack ?? ''));
		} else if (err !== undefined) {
			console.log(msg, stringifyLogValue(err));
		} else {
			console.log(msg);
		}
	};
	next();
}
