import { expect } from 'chai';
import start, { registerShutdownHandlers } from 'keystone/lib/core/start';

function createKeystone(overrides: Record<string, unknown> = {}) {
	const settings: Record<string, unknown> = {
		name: 'Test App',
		ssl: false,
		'unix socket': false,
		logger: false,
		...overrides,
	};
	return {
		version: 'test',
		app: {},
		closeCalled: false,
		get(key: string) {
			return settings[key];
		},
		initExpressApp() {
			this.app = {};
		},
		openDatabaseConnection(callback: () => void) {
			callback();
		},
		closeDatabaseConnection(callback: () => void) {
			this.closeCalled = true;
			callback();
			return this;
		},
	};
}

describe('core start', function () {
	it('closes the database before exiting on SIGTERM', function () {
		const keystone = createKeystone();
		const closeOrder: string[] = [];
		(keystone as unknown as Record<string, unknown>)['httpServer'] = {
			close(callback: (err?: Error) => void) {
				closeOrder.push('http');
				callback();
			},
			closeIdleConnections() {
				closeOrder.push('httpIdle');
			},
		};
		(keystone as unknown as Record<string, unknown>)['httpsServer'] = {
			close(callback: (err?: Error) => void) {
				closeOrder.push('https');
				callback();
			},
		};
		keystone.closeDatabaseConnection = function (callback: () => void) {
			closeOrder.push('db');
			this.closeCalled = true;
			callback();
			return this;
		};
		const previousTermListeners = new Set(process.listeners('SIGTERM'));
		const previousIntListeners = new Set(process.listeners('SIGINT'));
		const originalExit: typeof process.exit = process.exit.bind(process);
		let exitCode: string | number | null | undefined;
		let shutdownSignal: NodeJS.Signals | undefined;

		process.exit = function (code?: string | number | null): never {
			exitCode = code;
			return undefined as never;
		};

		const cleanup = function () {
			process.exit = originalExit;
			process.listeners('SIGTERM').forEach(function (listener) {
				if (!previousTermListeners.has(listener)) {
					process.removeListener('SIGTERM', listener);
				}
			});
			process.listeners('SIGINT').forEach(function (listener) {
				if (!previousIntListeners.has(listener)) {
					process.removeListener('SIGINT', listener);
				}
			});
		};

		registerShutdownHandlers(keystone as unknown as import('keystone').Keystone, {
			onShutdown(signal) {
				closeOrder.push('shutdown');
				shutdownSignal = signal;
			},
		});

		const termHandler = process.listeners('SIGTERM').find(listener => !previousTermListeners.has(listener));
		try {
			expect(termHandler).to.be.a('function');
			(termHandler as () => void)();
			expect(shutdownSignal).to.equal('SIGTERM');
			expect(keystone.closeCalled).to.equal(true);
			expect(closeOrder.indexOf('http')).to.be.lessThan(closeOrder.indexOf('db'));
			expect(closeOrder.indexOf('https')).to.be.lessThan(closeOrder.indexOf('db'));
			expect(closeOrder.indexOf('db')).to.be.lessThan(closeOrder.indexOf('shutdown'));
			expect(exitCode).to.equal(0);
		} catch (error) {
			cleanup();
			throw error;
		}
		cleanup();
	});

	it('routes server startup failures through onError instead of an unhandled rejection', function (done) {
		const keystone = createKeystone();

		start.call(keystone as unknown as import('keystone').Keystone, {
			onError(err) {
				try {
					expect(err).to.be.instanceOf(Error);
					expect((err as Error).message).to.contain('keystone "host" config is required');
					done();
				} catch (error) {
					done(error);
				}
			},
		});
	});
});
