import express from 'express';
import type { Request, RequestHandler } from 'express';
import type { Session, SessionData } from 'express-session';
import mongoose from 'mongoose';
import { expect } from 'chai';
import request from 'supertest';

import initExpressSession from 'keystone/lib/core/initExpressSession';

interface KeystoneSessionHarness {
	expressSession?: RequestHandler;
	sessionStorePromise?: Promise<void>;
	values: Map<string, unknown>;
	get(key: string): unknown;
	set(key: string, value: unknown): KeystoneSessionHarness;
}

type MutableSession = Session & Partial<SessionData> & { smoke?: string };

function createHarness(values: Record<string, unknown> = {}): KeystoneSessionHarness {
	const store = new Map<string, unknown>(Object.entries({
		'cookie secret': 'session-secret',
		...values,
	}));
	return {
		values: store,
		get(key: string) {
			return store.get(key);
		},
		set(key: string, value: unknown) {
			store.set(key, value);
			return this;
		},
	};
}

describe('initExpressSession', function () {
	it('returns synchronously and exposes configured session middleware plus cookie parser', function () {
		const keystone = createHarness({
			'session options': { key: 'cloom.sid' },
		});

		const result = initExpressSession.call(keystone as unknown as import('keystone').Keystone, mongoose);
		const sessionOptions = keystone.values.get('session options') as {
			cookie?: Record<string, unknown>;
			cookieParser?: RequestHandler;
			key?: string;
			resave?: boolean;
			saveUninitialized?: boolean;
			secret?: unknown;
		};

		expect(result).to.equal(keystone);
		expect(keystone.expressSession).to.be.a('function');
		expect(keystone.sessionStorePromise).to.equal(undefined);
		expect(sessionOptions.key).to.equal('cloom.sid');
		expect(sessionOptions.secret).to.equal('session-secret');
		expect(sessionOptions.resave).to.equal(false);
		expect(sessionOptions.saveUninitialized).to.equal(false);
		expect(sessionOptions.cookieParser).to.be.a('function');
		expect(sessionOptions.cookie).to.deep.include({
			httpOnly: true,
			maxAge: 86400000,
			sameSite: 'lax',
			secure: 'auto',
		});
	});

	it('honors a cloom.sid session cookie name end-to-end', async function () {
		const keystone = createHarness({
			'session options': { key: 'cloom.sid' },
		});
		initExpressSession.call(keystone as unknown as import('keystone').Keystone, mongoose);
		const sessionOptions = keystone.values.get('session options') as { cookieParser?: RequestHandler };
		if (!sessionOptions.cookieParser || !keystone.expressSession) {
			throw new Error('Expected initExpressSession to expose cookieParser and expressSession');
		}

		const app = express();
		app.use(sessionOptions.cookieParser);
		app.use(keystone.expressSession);
		app.get('/touch', function (req: Request, res) {
			(req.session as MutableSession).smoke = 'cloom-session-cookie';
			res.json({ ok: true });
		});

		await request(app)
			.get('/touch')
			.expect(200)
			.expect(function (res) {
				const setCookie = res.headers['set-cookie'];
				const cookies = Array.isArray(setCookie) ? setCookie : setCookie ? [setCookie] : [];
				expect(cookies).to.not.have.lengthOf(0);
				expect(cookies.some(cookie => cookie.startsWith('cloom.sid='))).to.equal(true);
				expect(cookies.some(cookie => cookie.startsWith('keystone.sid='))).to.equal(false);
				expect(cookies.some(cookie => cookie.startsWith('connect.sid='))).to.equal(false);
			});
	});

	it('initializes the Cloom-style mongo session store path without blocking middleware setup', async function () {
		const originalExit = process.exit.bind(process);
		const originalError = console.error;
		const exitError = new Error('process.exit intercepted');
		const errorMessages: string[] = [];
		process.exit = function (status?: number) {
			expect(status).to.equal(1);
			throw exitError;
		} as typeof process.exit;
		console.error = function (...args: unknown[]) {
			errorMessages.push(args.map(String).join(' '));
		};
		const sessionStoreOptions = {};
		const keystone = createHarness({
			'session options': { key: 'cloom.sid' },
			'session store': 'mongo',
			'session store options': sessionStoreOptions,
		});

		try {
			initExpressSession.call(keystone as unknown as import('keystone').Keystone, mongoose);
			const sessionOptions = keystone.values.get('session options') as {
				cookieParser?: RequestHandler;
				key?: string;
			};

			expect(keystone.expressSession).to.be.a('function');
			expect(keystone.sessionStorePromise).to.be.instanceOf(Promise);
			expect(sessionOptions.key).to.equal('cloom.sid');
			expect(sessionOptions.cookieParser).to.be.a('function');
			expect(sessionStoreOptions).to.deep.include({
				collection: 'app_sessions',
				mongooseConnection: mongoose.connection,
			});
			await keystone.sessionStorePromise?.then(
				function () {
					throw new Error('Expected missing connect-mongo to reject in the test environment');
				},
				function (err: unknown) {
					expect(err).to.equal(exitError);
				}
			);
			expect(errorMessages.join('\n')).to.contain('To use mongo as a `session store` option install connect-mongo');
		} finally {
			process.exit = originalExit;
			console.error = originalError;
		}
	});
});
