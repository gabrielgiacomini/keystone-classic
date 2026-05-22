import type { Keystone } from '../index.mjs';
import type { Application } from 'express';

export default function initViewLocals(keystone: Keystone, app: Application): void {
	if (typeof keystone.get('locals') === 'object') {
		Object.assign(app.locals, keystone.get('locals') as object);
	}
	if (app.locals.pretty === undefined && keystone.get('env') !== 'production') {
		app.locals.pretty = true;
	}
}
