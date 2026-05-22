import type { Keystone } from '../index.mjs';
import type { Application } from 'express';

export default function initTrustProxy(keystone: Keystone, app: Application): void {
	if (keystone.get('trust proxy') === true) {
		app.enable('trust proxy');
	} else {
		app.disable('trust proxy');
	}
}
