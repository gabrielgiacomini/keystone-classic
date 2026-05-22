import { expect } from 'chai';
import initDatabaseConfig from 'keystone/lib/core/initDatabaseConfig';

interface KeystoneSettingsHarness {
	values: Map<string, unknown>;
	get(name: string): unknown;
	set(name: string, value: unknown): void;
}

function createHarness(values: Record<string, unknown> = {}): KeystoneSettingsHarness {
	const store = new Map<string, unknown>(Object.entries(values));
	return {
		values: store,
		get(name: string) {
			return store.get(name);
		},
		set(name: string, value: unknown) {
			store.set(name, value);
		},
	};
}

function restoreEnv(name: string, value: string | undefined): void {
	if (value === undefined) {
		Reflect.deleteProperty(process.env, name);
	} else {
		process.env[name] = value;
	}
}

describe('initDatabaseConfig', function () {
	const originalMongoUri = process.env['MONGO_URI'];
	const originalMongodbUri = process.env['MONGODB_URI'];
	const originalMongoUrl = process.env['MONGO_URL'];
	const originalMongodbUrl = process.env['MONGODB_URL'];
	const originalMongolabUri = process.env['MONGOLAB_URI'];
	const originalMongolabUrl = process.env['MONGOLAB_URL'];
	const originalOpenshiftUrl = process.env['OPENSHIFT_MONGODB_DB_URL'];

	afterEach(function () {
		restoreEnv('MONGO_URI', originalMongoUri);
		restoreEnv('MONGODB_URI', originalMongodbUri);
		restoreEnv('MONGO_URL', originalMongoUrl);
		restoreEnv('MONGODB_URL', originalMongodbUrl);
		restoreEnv('MONGOLAB_URI', originalMongolabUri);
		restoreEnv('MONGOLAB_URL', originalMongolabUrl);
		restoreEnv('OPENSHIFT_MONGODB_DB_URL', originalOpenshiftUrl);
	});

	it('derives the default database URL from the configured app name', function () {
		delete process.env['MONGO_URI'];
		delete process.env['MONGODB_URI'];
		delete process.env['MONGO_URL'];
		delete process.env['MONGODB_URL'];
		delete process.env['MONGOLAB_URI'];
		delete process.env['MONGOLAB_URL'];
		delete process.env['OPENSHIFT_MONGODB_DB_URL'];
		const keystone = createHarness({ name: 'Café Blog' });

		const result = initDatabaseConfig.call(keystone as unknown as import('keystone').Keystone);

		expect(result).to.equal(keystone);
		expect(keystone.values.get('mongo')).to.equal('mongodb://localhost/cafe-blog');
	});

	it('honors an explicit database name and existing mongo setting', function () {
		delete process.env['MONGO_URI'];
		const existing = createHarness({ mongo: 'mongodb://configured/existing', name: 'Ignored App' });
		const explicitName = createHarness({ 'db name': 'explicit-db', name: 'Ignored App' });

		initDatabaseConfig.call(existing as unknown as import('keystone').Keystone);
		initDatabaseConfig.call(explicitName as unknown as import('keystone').Keystone);

		expect(existing.values.get('mongo')).to.equal('mongodb://configured/existing');
		expect(explicitName.values.get('mongo')).to.equal('mongodb://localhost/explicit-db');
	});

	it('prefers environment connection URLs before generated defaults', function () {
		process.env['MONGO_URI'] = 'mongodb://env/primary';
		const keystone = createHarness({ name: 'Ignored App' });

		initDatabaseConfig.call(keystone as unknown as import('keystone').Keystone);

		expect(keystone.values.get('mongo')).to.equal('mongodb://env/primary');
	});
});
