import type { Keystone } from '../../index.mjs';
import type { Application } from 'express';
import createApp from '../../server/createApp.mjs';
import { initExpressSessionCore } from './initExpressSession.mjs';

export default function initExpressApp(this: Keystone, customApp?: Application): Keystone {
	if (this.app) return this;

	this.initDatabaseConfig();
	initExpressSessionCore.call(this, this.mongoose);

	if (customApp) {
		this.app = customApp;
		createApp(this);
	} else {
		this.app = createApp(this);
	}

	return this;
}
