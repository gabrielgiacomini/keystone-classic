import type { Keystone } from '../index.mjs';
import type { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { textToHTML } from '../lib/utils/html.mjs';

const dashes = '\n------------------------------------------------\n';

function stringifyNonObjectError(value: unknown): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
	if (typeof value === 'symbol' || typeof value === 'function') return value.toString();
	return '';
}

/**
 * Registers Express 404 and 500 error handlers for Keystone.
 * @param keystone - The keystone instance.
 * @param app - The Express application.
 */
export default function bindErrorHandlers(keystone: Keystone, app: Application): void {

	const default404Handler = function (req: Request, res: Response) {
		if (req.headers.accept === 'application/json') {
			return res.status(404).json({ error: 'not found' });
		}
		return res.status(404).send(keystone.wrapHTMLError('Sorry, no page could be found at this address (404)'));
	};

	app.use(function (req: Request, res: Response, next: NextFunction) {
		const err404 = keystone.get('404');
		if (err404) {
			try {
				if (typeof err404 === 'function') {
					return (err404)(req, res, next);
				} else if (typeof err404 === 'string') {
					if (req.headers.accept === 'application/json') {
						return res.status(404).json({ error: 'not found' });
					}
					return res.status(404).render(err404);
				} else {
					if (keystone.get('logger')) {
						console.log(dashes + 'Error handling 404 (not found): Invalid type (' + (typeof err404) + ') for 404 setting.' + dashes);
					}
					return default404Handler(req, res);
				}
			} catch (e) {
				if (keystone.get('logger')) {
					console.log(dashes + 'Error handling 404 (not found):');
					console.log(e);
					console.log(dashes);
				}
				return default404Handler(req, res);
			}
		} else {
			return default404Handler(req, res);
		}
	});

	// Express error handlers receive an `unknown` error value at runtime.
	// We narrow it with type guards before accessing specific properties.
	/** Error subtype with an optional type field used for logging. */
type TypedError = Error & { type?: string };
	const default500Handler: ErrorRequestHandler = function (err: unknown, req: Request, res: Response, _next: NextFunction) {
		if (keystone.get('logger')) {
			if (err instanceof Error) {
				const typed = err as TypedError;
				console.log((typed.type ? typed.type + ' ' : '') + 'Error thrown for request: ' + req.url);
			} else {
				console.log('Error thrown for request: ' + req.url);
			}
			console.log((err instanceof Error ? err.stack : undefined) ?? err);
		}
		if (req.headers.accept === 'application/json') {
			return res.status(500).json({ error: 'unknown error' });
		}
		let msg = '';
		if (keystone.get('env') === 'development') {
			if (err instanceof Error) {
				const typed = err as TypedError;
				if (typed.type) {
					msg += '<h2>' + typed.type + '</h2>';
				}
				msg += textToHTML(err.message);
				} else if (typeof err === 'object' && err !== null) {
					msg += '<code>' + JSON.stringify(err) + '</code>';
				} else if (err) {
					msg += stringifyNonObjectError(err);
				}
		}
		return res.status(500).send(keystone.wrapHTMLError('Sorry, an error occurred loading the page (500)', msg));
	};

	app.use(function (err: unknown, req: Request, res: Response, next: NextFunction) {
		const err500 = keystone.get('500');
		if (err500) {
			try {
				if (typeof err500 === 'function') {
					return (err500)(err, req, res, next);
				} else if (typeof err500 === 'string') {
					if (req.headers.accept === 'application/json') {
						return res.status(500).json({ error: 'unknown error' });
					}
					res.locals.err = err;
					return res.status(500).render(err500);
				} else {
					if (keystone.get('logger')) {
						console.log(dashes + 'Error handling 500 (error): Invalid type (' + (typeof err500) + ') for 500 setting.' + dashes);
					}
					return default500Handler(err, req, res, next);
				}
			} catch (e) {
				if (keystone.get('logger')) {
					console.log(dashes + 'Error handling 500 (error):');
					console.log(e);
					console.log(dashes);
				}
				return default500Handler(err, req, res, next);
			}
		} else {
			return default500Handler(err, req, res, next);
		}
	} as ErrorRequestHandler);
}
