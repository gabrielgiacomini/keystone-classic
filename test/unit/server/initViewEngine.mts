import express from 'express';
import type { Application } from 'express';
import { expect } from 'chai';

import initViewEngine from 'keystone/server/initViewEngine';
import type { Keystone } from 'keystone';

function createKeystone(values: Record<string, unknown>): Keystone {
	return {
		get(key: string) {
			return values[key];
		},
		getPath(key: string) {
			return values[key];
		},
	} as unknown as Keystone;
}

describe('initViewEngine', function () {
	it('honors Cloom-style pug view engine and views options', function () {
		const app = express();
		const keystone = createKeystone({
			'view engine': 'pug',
			views: '/tmp/cloom/templates/views',
		});

		initViewEngine(keystone, app);

		expect(app.get('view engine')).to.equal('pug');
		expect(app.get('views')).to.equal('/tmp/cloom/templates/views');
	});

	it('defaults views to the Express views directory when no path is configured', function () {
		const app = express();
		const keystone = createKeystone({
			'view engine': 'pug',
		});

		initViewEngine(keystone, app);

		expect(app.get('views')).to.equal('views');
		expect(app.get('view engine')).to.equal('pug');
	});

	it('registers a custom engine and custom view constructor when configured', function () {
		const app = express();
		const customEngine = function (_path: string, _options: object, callback: (err: Error | null, output?: string) => void) {
			callback(null, 'custom');
		};
		const CustomView = function CustomView(this: unknown) {};
		const keystone = createKeystone({
			'custom engine': customEngine,
			'view engine': '.jsx',
			view: CustomView,
			views: '/tmp/custom/views',
		});

		initViewEngine(keystone, app);

		expect((app as unknown as { engines: Record<string, unknown> }).engines['.jsx']).to.equal(customEngine);
		expect(app.get('view')).to.equal(CustomView);
		expect(app.get('views')).to.equal('/tmp/custom/views');
		expect(app.get('view engine')).to.equal('.jsx');
	});

	it('fails fast when a custom engine is configured without a view engine key', function () {
		const app: Application = express();
		const keystone = createKeystone({
			'custom engine'(_path: string, _options: object, callback: (err: Error | null) => void) {
				callback(null);
			},
		});

		expect(function () {
			initViewEngine(keystone, app);
		}).to.throw('initViewEngine: keystone "view engine" config is required when "custom engine" is set');
	});
});
