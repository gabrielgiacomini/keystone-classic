import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import createLessMiddleware from '../lib/middleware/less.mjs';

export default function bindLessMiddleware(keystone: Keystone, app: Application): void {
	let lessPaths = keystone.get('less');
	const lessOptions = keystone.get('less options') ?? {};

	if (typeof lessPaths === 'string') {
		lessPaths = [lessPaths];
	}

	if (Array.isArray(lessPaths)) {
		lessPaths.forEach(function (lessPath: string) {
			app.use(createLessMiddleware(keystone.expandPath(lessPath), lessOptions));
		});
	}
}
