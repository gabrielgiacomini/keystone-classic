import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import express from 'express';

export default function bindStaticMiddleware(keystone: Keystone, app: Application): void {
	let staticPaths = keystone.get('static');
	const staticOptions = keystone.get('static options');

	if (typeof staticPaths === 'string') {
		staticPaths = [staticPaths];
	}

	if (Array.isArray(staticPaths)) {
		staticPaths.forEach(function (value: string) {
			app.use(express.static(keystone.expandPath(value), staticOptions));
		});
	}
}
