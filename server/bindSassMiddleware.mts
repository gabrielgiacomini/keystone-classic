import type { Keystone } from '../index.mjs';
import type { Application } from 'express';
import debugModule from 'debug';
import safeRequire from '../lib/safeRequire.mjs';

const debug = debugModule('keystone:core:bindSassMiddleware');

export default async function bindSassMiddleware(keystone: Keystone, app: Application): Promise<void> {
	let sassPaths = keystone.get('sass');
	const sassOptions = keystone.get('sass options') ?? {};

	if (typeof sassPaths === 'string') {
		sassPaths = [sassPaths];
	}

	if (Array.isArray(sassPaths)) {
		debug('adding sass');
		const sassNs = await safeRequire('node-sass-middleware', 'sass') as Record<string, unknown>;
		const sassMiddleware = (sassNs['default'] ?? sassNs) as (opts: Record<string, unknown>) => import('express').RequestHandler;

		const outputStyle = keystone.get('env') === 'production' ? 'compressed' : 'nested';

		sassPaths.forEach(function (path: string) {
			app.use(sassMiddleware(Object.assign({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				outputStyle: outputStyle,
			}, sassOptions)));
		});
	}
}
