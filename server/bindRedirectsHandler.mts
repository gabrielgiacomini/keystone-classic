import type { Keystone } from '../index.mjs';
import type { Application, Request, Response, NextFunction } from 'express';

export default function bindRedirectsHandler(keystone: Keystone, app: Application): void {
	if (Object.keys(keystone._redirects).length) {
		app.use(function (req: Request, res: Response, next: NextFunction) {
			const target = keystone._redirects[req.path];
			if (target) {
				res.redirect(target);
			} else {
				next();
			}
		});
	}
}
