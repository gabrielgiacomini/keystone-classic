import type { Keystone } from '../index.mjs';
import type { Application, Request, Response, NextFunction } from 'express';

export default function initSslRedirect(keystone: Keystone, app: Application): void {
	let portString: string;

	function sslRedirect(req: Request, res: Response, next: NextFunction): void {
		if (req.secure) {
			return next();
		}
		if (req.ip === '127.0.0.1') {
			return next();
		}
		res.redirect(302, 'https://' + req.hostname + portString + req.originalUrl);
	}

	if (keystone.get('ssl') === 'force') {
		const port = keystone.get('ssl public port') || keystone.get('ssl port');
		if (Number(port) === 443) {
			portString = '';
		} else {
			portString = ':' + Number(port);
		}
		app.use(sslRedirect);
	}
}
