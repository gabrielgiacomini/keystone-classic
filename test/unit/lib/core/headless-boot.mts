import { expect } from 'chai';
import type { RequestHandler } from 'express';

import initDatabaseConfig from 'keystone/lib/core/initDatabaseConfig';
import initExpressSession from 'keystone/lib/core/initExpressSession';
import openDatabaseConnection from 'keystone/lib/core/openDatabaseConnection';
import type { Keystone } from 'keystone';

interface ConnectionHarness {
	emit(event: string, ...args: unknown[]): void;
	on(event: string, listener: (...args: unknown[]) => void): ConnectionHarness;
	once(event: string, listener: (...args: unknown[]) => void): ConnectionHarness;
}

interface HeadlessHarness {
	app?: unknown;
	connectCalls: Array<{ options?: Record<string, unknown>; uri: string }>;
	expressSession?: RequestHandler;
	httpServer?: unknown;
	sessionStorePromise?: Promise<void>;
	values: Map<string, unknown>;
	mongoose: {
		connect(uri: string, options?: Record<string, unknown>): Promise<void>;
		connection: ConnectionHarness;
	};
	get(key: string): unknown;
	set(key: string, value: unknown): HeadlessHarness;
	initDatabaseConfig(): HeadlessHarness;
	initExpressSession(mongooseInstance: HeadlessHarness['mongoose']): HeadlessHarness;
	openDatabaseConnection(callback: (err?: Error | null) => void): HeadlessHarness;
}

function createConnectionHarness(): ConnectionHarness {
	const listeners: Record<string, Array<(...args: unknown[]) => void>> = {};

	return {
		emit(event: string, ...args: unknown[]) {
			for (const listener of listeners[event] ?? []) {
				listener(...args);
			}
		},
		on(event: string, listener: (...args: unknown[]) => void) {
			listeners[event] = listeners[event] ?? [];
			listeners[event]!.push(listener);
			return this;
		},
		once(event: string, listener: (...args: unknown[]) => void) {
			listeners[event] = listeners[event] ?? [];
			listeners[event]!.push(listener);
			return this;
		},
	};
}

function createHeadlessHarness(): HeadlessHarness {
	const values = new Map<string, unknown>(Object.entries({
		'cookie secret': 'headless-secret',
		'headless': true,
		'name': 'Cloom Headless Smoke',
		'session options': { key: 'cloom.sid' },
	}));
	const connection = createConnectionHarness();
	const connectCalls: Array<{ options?: Record<string, unknown>; uri: string }> = [];
	const harness: HeadlessHarness = {
		connectCalls,
		values,
		mongoose: {
			connect(uri: string, options?: Record<string, unknown>) {
				connectCalls.push({ uri, options });
				return Promise.resolve();
			},
			connection,
		},
		get(key: string) {
			return values.get(key);
		},
		set(key: string, value: unknown) {
			values.set(key, value);
			return this;
		},
		initDatabaseConfig() {
			return initDatabaseConfig.call(this as unknown as Keystone) as unknown as HeadlessHarness;
		},
		initExpressSession(mongooseInstance: HeadlessHarness['mongoose']) {
			return initExpressSession.call(
				this as unknown as Keystone,
				mongooseInstance as unknown as Parameters<typeof initExpressSession>[0]
			) as unknown as HeadlessHarness;
		},
		openDatabaseConnection(callback: (err?: Error | null) => void) {
			return openDatabaseConnection.call(this as unknown as Keystone, callback) as unknown as HeadlessHarness;
		},
	};
	return harness;
}

describe('headless Cloom-style boot sequence', function () {
	it('runs initDatabaseConfig -> initExpressSession -> openDatabaseConnection without an Express app', function () {
		const keystone = createHeadlessHarness();
		let callbackCalled = false;

		expect(keystone.app).to.equal(undefined);
		expect(keystone.httpServer).to.equal(undefined);

		expect(keystone.initDatabaseConfig()).to.equal(keystone);
		expect(keystone.values.get('mongo')).to.equal('mongodb://localhost/cloom-headless-smoke');

		expect(keystone.initExpressSession(keystone.mongoose)).to.equal(keystone);
		const sessionOptions = keystone.values.get('session options') as {
			cookieParser?: RequestHandler;
			key?: string;
		};
		expect(sessionOptions.key).to.equal('cloom.sid');
		expect(sessionOptions.cookieParser).to.be.a('function');
		expect(keystone.expressSession).to.be.a('function');

		const result = keystone.openDatabaseConnection(function (err?: Error | null) {
			expect(err).to.equal(undefined);
			callbackCalled = true;
		});

		expect(result).to.equal(keystone);
		expect(callbackCalled).to.equal(false);
		expect(keystone.connectCalls).to.have.lengthOf(1);
		expect(keystone.connectCalls[0]?.uri).to.equal('mongodb://localhost/cloom-headless-smoke');
		expect(keystone.app).to.equal(undefined);
		expect(keystone.httpServer).to.equal(undefined);

		keystone.mongoose.connection.emit('open');

		expect(callbackCalled).to.equal(true);
		expect(keystone.app).to.equal(undefined);
		expect(keystone.httpServer).to.equal(undefined);
	});
});
