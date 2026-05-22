import type { Keystone } from '../../index.mjs';
import startHTTPServer from '../../server/startHTTPServer.mjs';
import startSecureServer from '../../server/startSecureServer.mjs';
import startSocketServer from '../../server/startSocketServer.mjs';

const dashes = '\n------------------------------------------------\n';

let _uncaughtExceptionRegistered = false;
let _shutdownHandlersRegistered = false;
let _shutdownInProgress = false;
let _shutdownKeystone: Keystone | null = null;
let _shutdownEvents: StartEvents | null = null;

interface CloseableServer {
	close(callback: (err?: Error) => void): void;
	closeIdleConnections?: () => void;
}

export interface StartEvents {
	onMount?: () => void;
	onStart?: () => void;
	onHttpServerCreated?: () => void;
	onHttpsServerCreated?: () => void;
	onSocketServerCreated?: () => void;
	onShutdown?: (signal: NodeJS.Signals) => void;
	onError?: (err: unknown) => void;
}

export function handleStartError(events: StartEvents, err: unknown): void {
	if (typeof events.onError === 'function') {
		events.onError(err);
		return;
	}
	setImmediate(function throwUnhandledStartError() {
		throw err;
	});
}

function getShutdownServers(keystone: Keystone): CloseableServer[] {
	const servers: CloseableServer[] = [
		keystone.httpServer,
		keystone.httpsServer,
	].filter((server): server is NonNullable<typeof server> => server != null);
	return Array.from(new Set(servers));
}

function closeServers(keystone: Keystone, events: StartEvents, callback: () => void): void {
	const servers = getShutdownServers(keystone);
	if (!servers.length) {
		callback();
		return;
	}

	let pending = servers.length;
	servers.forEach(function closeServer(server) {
		const finish = function (err?: Error) {
			if (typeof server.closeIdleConnections === 'function') {
				server.closeIdleConnections();
			}
			if (err) handleStartError(events, err);
			pending -= 1;
			if (pending === 0) callback();
		};
		try {
			server.close(finish);
		} catch (err) {
			finish(err as Error);
		}
	});
}

export function registerShutdownHandlers(keystone: Keystone, events: StartEvents): void {
	_shutdownKeystone = keystone;
	_shutdownEvents = events;
	if (_shutdownHandlersRegistered) return;
	_shutdownHandlersRegistered = true;

	function shutdown(signal: NodeJS.Signals): void {
		if (_shutdownInProgress) return;
		_shutdownInProgress = true;
		const activeKeystone = _shutdownKeystone;
		const activeEvents = _shutdownEvents ?? {};
		const finish = function () {
			if (typeof activeEvents.onShutdown === 'function') {
				activeEvents.onShutdown(signal);
			}
			process.exit(0);
		};

		try {
			if (!activeKeystone) {
				finish();
				return;
			}
			closeServers(activeKeystone, activeEvents, function closeDatabaseAfterServers() {
				activeKeystone.closeDatabaseConnection(finish);
			});
		} catch (err) {
			handleStartError(activeEvents, err);
		}
	}

	process.once('SIGTERM', function handleSigterm() { shutdown('SIGTERM'); });
	process.once('SIGINT', function handleSigint() { shutdown('SIGINT'); });
}

export default function start(this: Keystone, events?: StartEvents | (() => void)): Keystone {

	if (typeof events === 'function') {
		events = { onStart: events };
	}
	events ??= {};

	const eventsObj = events;
	registerShutdownHandlers(this, eventsObj);

	function fireEvent(name: keyof StartEvents) {
		if (typeof eventsObj[name] === 'function') {
			(eventsObj[name] as () => void)();
		}
	}

	if (!_uncaughtExceptionRegistered) {
		_uncaughtExceptionRegistered = true;
		process.on('uncaughtException', function (e: NodeJS.ErrnoException) {
			if (e.code === 'EADDRINUSE') {
				console.log(dashes
					+ keystone.get('name') + ' failed to start: address already in use\n'
					+ 'Please check you are not already running a server on the specified port.\n');
				process.exit();
			} else {
				console.log(e.stack || e);
				process.exit(1);
			}
		});
	}

	this.initExpressApp();

	const keystone = this;
	const app = keystone.app;
	if (!app) throw new Error('start: keystone.app is not initialised after initExpressApp()');

	this.openDatabaseConnection(function () {

		fireEvent('onMount');

		const ssl = keystone.get('ssl');
		const unixSocket = keystone.get('unix socket');
		const startupMessages: string[] = [`KeystoneJS v${keystone.version} started:`];

		Promise.all([
			new Promise<void>(function (resolve, reject) {
				if (ssl === 'only' || unixSocket) { resolve(); return; }
				startHTTPServer(keystone, app, function (err: Error | null, msg?: string) {
					fireEvent('onHttpServerCreated');
					if (msg) startupMessages.push(msg);
					if (err) reject(err); else resolve();
				});
			}),
			new Promise<void>(function (resolve, reject) {
				if (!ssl || unixSocket) { resolve(); return; }
				startSecureServer(keystone, app, function () {
					fireEvent('onHttpsServerCreated');
				}, function (err: Error | null, msg?: string) {
					if (msg) startupMessages.push(msg);
					if (err) reject(err); else resolve();
				});
			}),
			new Promise<void>(function (resolve, reject) {
				if (!unixSocket) { resolve(); return; }
				startSocketServer(keystone, app, function (err: Error | null, msg?: string) {
					fireEvent('onSocketServerCreated');
					if (msg) startupMessages.push(msg);
					if (err) reject(err); else resolve();
				});
			}),
		]).then(function serversStarted() {
			if (keystone.get('logger')) {
				console.log(dashes + startupMessages.join('\n') + dashes);
			}
			fireEvent('onStart');
		}).catch(function (err: unknown) { handleStartError(eventsObj, err); });
	});

	return this;
}
