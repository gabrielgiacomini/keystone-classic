import type { Keystone } from '../../index.mjs';
import type { Request, Response, NextFunction } from 'express';
import type { Mongoose } from 'mongoose';
import _ from 'lodash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import debugLib from 'debug';
import safeRequire from '../safeRequire.mjs';

/** express-session options extended with the Keystone-internal `cookieParser` middleware. */
type KeystoneSessionOptions = session.SessionOptions & { cookieParser?: ReturnType<typeof cookieParser> };

const debug = debugLib('keystone:core:initExpressSession');

function formatSessionStoreName(value: unknown): string {
	if (typeof value === 'string') return value;
	return Object.prototype.toString.call(value);
}

/**
 * Internal (non-deprecated) implementation. Performs all session setup synchronously.
 * Internal callers should use this directly to avoid triggering the TS 6385 deprecation
 * diagnostic on the public-facing `initExpressSession` wrapper.
 */
export function initExpressSessionCore(this: Keystone, mongoose: Mongoose): Keystone {

	if (this.expressSession) return this;

	let sessionStorePromise: Promise<void> | undefined;

	if (!this.get('cookie secret')) {
		console.error('\nKeystoneJS Configuration Error:\n\nPlease provide a `cookie secret` value for session encryption.\n');
		process.exit(1);
	}

	const sessionOptions: KeystoneSessionOptions = (this.get('session options') as unknown as KeystoneSessionOptions | null) ?? ({} as KeystoneSessionOptions);
	_.defaults(sessionOptions, {
		key: 'keystone.sid',
		resave: false,
		saveUninitialized: false,
		secret: this.get('cookie secret'),
		cookie: {
			secure: 'auto' as const,
			sameSite: 'lax' as const,
			httpOnly: true,
			maxAge: (this.get('session age') as number | undefined) ?? 86400000,
		},
	});

	sessionOptions.cookieParser = cookieParser(this.get('cookie secret'));

	let sessionStore: unknown = this.get('session store');

	if (typeof sessionStore === 'function') {
		// User-supplied Store factory — synchronous path.
		type StoreFactory = (session: typeof import('express-session')) => session.Store;
		sessionOptions.store = (sessionStore as StoreFactory)(session);
		this.set('session options', sessionOptions);
		this.expressSession = session(sessionOptions);
		this.sessionStorePromise = undefined;
		return this;
	}

	if (sessionStore) {
		const sessionStoreOptions: Record<string, unknown> = (this.get('session store options') as Record<string, unknown> | null) ?? {};

		if (sessionStore === 'mongo') {
			sessionStore = 'connect-mongo';
		} else if (sessionStore === 'redis') {
			sessionStore = 'connect-redis';
		}

		switch (sessionStore) {
			case 'connect-mongo':
				debug('using connect-mongo session store');
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions',
					mongooseConnection: mongoose.connection,
				});
				break;

			case 'connect-mongostore':
				debug('using connect-mongostore session store');
				_.defaults(sessionStoreOptions, { collection: 'app_sessions' });
				if (!sessionStoreOptions.db) {
					console.error('\nERROR: connect-mongostore requires `session store options` to be set.\n');
					process.exit(1);
				}
				break;

			case 'connect-redis':
				debug('using connect-redis session store');
				break;

			default:
				console.error('\nERROR: unsupported session store ' + formatSessionStoreName(sessionStore) + '.\n');
				process.exit(1);
		}

		// Build a proxy middleware synchronously. The proxy forwards to `inner` which
		// starts as a MemoryStore-backed session and gets swapped to the real middleware
		// once the async store package loads. express-session captures the store at
		// construction time (not at request time), so we cannot simply mutate
		// sessionOptions.store — we must replace the entire middleware via the proxy.
		let inner: (req: Request, res: Response, next: NextFunction) => void = session(sessionOptions);

		const proxyMiddleware = function (req: Request, res: Response, next: NextFunction) {
			inner(req, res, next);
		};

		// eslint-disable-next-line @typescript-eslint/no-base-to-string
		const sessionStoreLabel = String(this.get('session store')) + ' as a `session store` option';
		sessionStorePromise = safeRequire(sessionStore as string, sessionStoreLabel).then(function (sessionStoreNs: unknown) {
			type StoreConstructor = new (options: Record<string, unknown>, cb?: () => void) => session.Store & { on(event: string, listener: () => void): void };
			type StoreNs = { default?: (s: typeof session) => StoreConstructor } & ((s: typeof session) => StoreConstructor);
			const ns = sessionStoreNs as StoreNs;
			const SessionStore: StoreConstructor = (ns.default || ns)(session);
			return new Promise<void>(function (resolve) {
				const storeInstance = new SessionStore(sessionStoreOptions, resolve);
				storeInstance.on('connect', resolve);
				storeInstance.on('connected', resolve);
				storeInstance.on('disconnect', function () {
					console.error('\nThere was an error connecting to the ' + String(sessionStore) + ' session store.\n');
					process.exit(1);
				});
				// Reconstruct the real session middleware now that the store is available.
				const realSessionOptions: session.SessionOptions = Object.assign({}, sessionOptions, { store: storeInstance });
				inner = session(realSessionOptions);
			});
		});

		this.set('session options', sessionOptions);
		this.expressSession = proxyMiddleware;
		this.sessionStorePromise = sessionStorePromise;
		return this;
	}

	// No session store configured — default MemoryStore path.
	this.set('session options', sessionOptions);
	this.expressSession = session(sessionOptions);
	this.sessionStorePromise = undefined;

	return this;
}

/**
 * Public wrapper delegating to `initExpressSessionCore`. Deprecated at the Keystone interface
 * level (`index.mts`) — external callers using `keystone.initExpressSession(...)` will see the
 * deprecation strikethrough via the interface method JSDoc.
 */
export default function initExpressSession(this: Keystone, mongoose: Mongoose): Keystone {
	return initExpressSessionCore.call(this, mongoose);
}
