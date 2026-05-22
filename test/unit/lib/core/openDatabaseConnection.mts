import { expect } from 'chai';
import openDatabaseConnection from 'keystone/lib/core/openDatabaseConnection';

const DEFAULT_TIMEOUTS = {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 30000,
	connectTimeoutMS: 10000,
};

function createKeystone(overrides: Record<string, unknown> = {}) {
	const settings: Record<string, unknown> = {
		name: 'Test App',
		mongo: 'mongodb://localhost/test',
		...overrides,
	};
	const connectCalls: Array<{ uri: string; options: Record<string, unknown> | undefined }> = [];
	const listeners: Record<string, Array<(...args: unknown[]) => void>> = {};
	const connection = {
		emit(event: string, ...args: unknown[]) {
			for (const listener of listeners[event] ?? []) {
				listener(...args);
			}
		},
		on(event: string, listener: (...args: unknown[]) => void) {
			listeners[event] = listeners[event] ?? [];
			listeners[event].push(listener);
			return connection;
		},
		once(event: string, listener: (...args: unknown[]) => void) {
			listeners[event] = listeners[event] ?? [];
			listeners[event].push(listener);
			return connection;
		},
	};
	return {
		connection,
		connectCalls,
		get(key: string) {
			return settings[key];
		},
		initDatabaseConfig() {},
		mongoose: {
			connect(uri: string, options?: Record<string, unknown>) {
				connectCalls.push({ uri, options });
				return Promise.resolve();
			},
			connection,
		},
	};
}

function withEnv(overrides: Record<string, string>, fn: () => void): void {
	const previous: Record<string, string | undefined> = {};
	Object.keys(overrides).forEach(function (key) {
		previous[key] = process.env[key];
		process.env[key] = overrides[key];
	});
	try {
		fn();
	} finally {
		Object.keys(overrides).forEach(function (key) {
			if (previous[key] === undefined) {
				Reflect.deleteProperty(process.env, key);
			} else {
				process.env[key] = previous[key];
			}
		});
	}
}

describe('openDatabaseConnection', function () {
	it('returns synchronously and invokes the callback from the connection open event', function () {
		const keystone = createKeystone();
		let callbackCalled = false;

		const result = openDatabaseConnection.call(keystone as unknown as import('keystone').Keystone, function (err?: Error | null) {
			expect(err).to.equal(undefined);
			callbackCalled = true;
		});

		expect(result).to.equal(keystone);
		expect(callbackCalled).to.equal(false);
		keystone.connection.emit('open');
		expect(callbackCalled).to.equal(true);
	});

	it('applies bounded timeout defaults to normal mongo connections', function () {
		const keystone = createKeystone();

		openDatabaseConnection.call(keystone as unknown as import('keystone').Keystone, function () {});

		expect(keystone.connectCalls).to.have.lengthOf(1);
		expect(keystone.connectCalls[0]?.uri).to.equal('mongodb://localhost/test');
		expect(keystone.connectCalls[0]?.options).to.deep.include(DEFAULT_TIMEOUTS);
	});

	it('allows mongo timeout defaults to be tuned through environment variables', function () {
		withEnv({
			KEYSTONE_MONGO_SERVER_SELECTION_TIMEOUT_MS: '7000',
			KEYSTONE_MONGO_SOCKET_TIMEOUT_MS: '31000',
			KEYSTONE_MONGO_CONNECT_TIMEOUT_MS: '11000',
		}, function () {
			const keystone = createKeystone();

			openDatabaseConnection.call(keystone as unknown as import('keystone').Keystone, function () {});

			expect(keystone.connectCalls[0]?.options).to.deep.include({
				serverSelectionTimeoutMS: 7000,
				socketTimeoutMS: 31000,
				connectTimeoutMS: 11000,
			});
		});
	});

	it('lets explicit mongo options override timeout defaults', function () {
		const keystone = createKeystone({
			'mongo options': {
				serverSelectionTimeoutMS: 250,
				bufferCommands: false,
			},
		});

		openDatabaseConnection.call(keystone as unknown as import('keystone').Keystone, function () {});

		expect(keystone.connectCalls[0]?.options).to.deep.include({
			...DEFAULT_TIMEOUTS,
			serverSelectionTimeoutMS: 250,
			bufferCommands: false,
		});
	});

	it('applies bounded timeout defaults to replica set connections', function () {
		const keystone = createKeystone({
			'mongo replica set': {
				username: 'user',
				password: 'pass',
				authSource: 'admin',
				db: {
					name: 'app',
					servers: [{ host: 'db1', port: 27017 }, { host: 'db2', port: 27018 }],
					replicaSetOptions: {
						rs_name: 'rs0',
						readPreference: 'secondaryPreferred',
					},
				},
			},
		});

		openDatabaseConnection.call(keystone as unknown as import('keystone').Keystone, function () {});

		expect(keystone.connectCalls[0]?.uri).to.equal('mongodb://user:pass@db1:27017/app,mongodb://user:pass@db2:27018/app,');
		expect(keystone.connectCalls[0]?.options).to.deep.include({
			...DEFAULT_TIMEOUTS,
			authSource: 'admin',
			replicaSet: 'rs0',
			readPreference: 'secondaryPreferred',
		});
	});
});
