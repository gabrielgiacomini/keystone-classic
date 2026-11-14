import { expect } from 'chai';
import mongoose from 'mongoose';
import init from 'keystone/lib/core/init';
import { options, set } from 'keystone/lib/core/options';
import type { Keystone } from 'keystone';
import type { KeystoneGlobalOptions } from '../../../../lib/core/options-types.js';

const setOption = set as unknown as (this: InitHarness, key: string, value: unknown) => InitHarness;
const applyOptions = options as unknown as (
	this: InitHarness,
	value?: Partial<KeystoneGlobalOptions>
) => KeystoneGlobalOptions | InitHarness;

interface InitHarness {
	_options: Partial<KeystoneGlobalOptions>;
	app?: unknown;
	mongoose?: unknown;
	get(key: string): unknown;
	set(key: string, value: unknown): InitHarness;
	options(value?: Partial<KeystoneGlobalOptions>): KeystoneGlobalOptions | InitHarness;
	expandPath(pathValue: string): string;
}

function createHarness(): InitHarness {
	const harness: InitHarness = {
		_options: {},
		get(key: string) {
			return this._options[key as keyof KeystoneGlobalOptions];
		},
		set(key: string, value: unknown) {
			setOption.call(this, key, value);
			return this;
		},
		options(value?: Partial<KeystoneGlobalOptions>) {
			return applyOptions.call(this, value);
		},
		expandPath(pathValue: string) {
			return pathValue;
		},
	};
	return harness;
}

describe('core init compatibility', function () {
	it('accepts the Consumer Core boot option blob and preserves load-bearing keys', function () {
		const keystone = createHarness();
		const consumerCoreOptions: Partial<KeystoneGlobalOptions> = {
			env: 'development',
			port: 3000,
			name: 'Consumer Core',
			brand: 'Consumer Core',
			favicon: 'public/favicon-keystone.ico',
			views: '/tmp/consumer/templates/views',
			'auto update': true,
			'view engine': 'pug',
			mongoose,
			mongo: 'mongodb://127.0.0.1:27017/consumer?maxPoolSize=20&minPoolSize=1',
			updates: '/tmp/consumer/updates',
			'mongo options': {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				autoIndex: true,
				useFindAndModify: false,
			},
			session: true,
			'session store': 'mongo',
			auth: true,
			'user model': 'Administrator',
			headless: false,
			'cookie secret': 'cookie-secret',
			'model prefix': 'consumer_',
			'file limit': '10MB',
			compress: false,
			'session options': {
				key: 'consumer.sid',
			},
			'cloudinary config': {
				cloud_name: 'consumer-cloud',
				api_key: 'cloudinary-key',
				api_secret: 'cloudinary-secret',
			},
			'cloudinary secure': true,
			'cloudinary prefix': 'consumer-prefix',
			'cloudinary folders': true,
			locals: {
				env: 'development',
				utils: { keyToLabel: function keyToLabel(key: string) { return key; } },
			},
		};

		const result = init.call(keystone as unknown as Keystone, consumerCoreOptions);

		expect(result).to.equal(keystone);
		expect(keystone.get('user model')).to.equal('Administrator');
		expect(keystone.get('view engine')).to.equal('pug');
		expect(keystone.get('updates')).to.equal('/tmp/consumer/updates');
		expect(keystone.get('session options')).to.deep.equal({ key: 'consumer.sid' });
		expect(keystone.get('compress')).to.equal(false);
		expect(keystone.get('auto update')).to.equal(true);
		expect(keystone.mongoose).to.equal(mongoose);
	});
});
