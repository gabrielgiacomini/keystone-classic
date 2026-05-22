import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import debugModule from 'debug';
import safeRequire from '../lib/safeRequire.mjs';

const debug = debugModule('keystone:core:bindStylusMiddleware');

/**
 * Registers Stylus CSS compilation middleware for Keystone.
 * @param keystone - The keystone instance.
 * @param app - The Express application.
 */
export default async function bindStylusMiddleware(keystone: Keystone, app: Application): Promise<void> {
	let stylusPaths = keystone.get('stylus');
	const stylusOptions = keystone.get('stylus options') ?? {};

	if (typeof stylusPaths === 'string') {
		stylusPaths = [stylusPaths];
	}

	if (Array.isArray(stylusPaths)) {
		debug('adding stylus');
		type StylusModule = { middleware(opts: Record<string, unknown>): import('express').RequestHandler };
		const stylusNs = await safeRequire('stylus', 'stylus') as Record<string, unknown>;
		const stylusModule = (stylusNs['default'] ?? stylusNs) as StylusModule;

		stylusPaths.forEach(function (path: string) {
			app.use(stylusModule.middleware(Object.assign({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				compress: keystone.get('env') === 'production',
			}, stylusOptions)));
		});
	}
}
