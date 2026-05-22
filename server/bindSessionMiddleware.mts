import type { Keystone } from '../index.mjs';
import type { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import connectFlash from 'connect-flash';

export default function bindSessionMiddleware(keystone: Keystone, app: Application): void {
	const sessionOptions = keystone.get('session options') as Record<string, unknown>;
	app.use(sessionOptions.cookieParser as Parameters<typeof app.use>[0]);

	if (typeof keystone.get('pre:session') === 'function') {
		(keystone.get('pre:session') as (app: Application) => void)(app);
	}
	app.use(function (req: Request, res: Response, next: NextFunction) {
		keystone.callHook('pre:session', req, res, next);
	});

	if (!keystone.expressSession) {
		throw new Error('expressSession not initialized — call initExpressSession() before bindSessionMiddleware()');
	}
	app.use(keystone.expressSession);
	app.use(connectFlash());

	if (keystone.get('session') === true) {
		app.use(function persistSession(req, res, next) { keystone.session.persist(req, res, next); });
	} else if (typeof keystone.get('session') === 'function') {
		app.use(keystone.get('session') as RequestHandler);
	}
}
