import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { expect } from 'chai';
import request from 'supertest';

import type { Keystone } from 'keystone';

let createApp: typeof import('keystone/server/createApp').default;

function createKeystoneMock(overrides: Record<string, unknown> = {}): Keystone {
	const options: Record<string, unknown> = {
		'admin legacy path': 'keystone',
		'admin next path': 'keystone-next',
		'admin api path': 'keystone-api',
		'admin legacy api alias': true,
		'auth': false,
		'cache admin bundles': false,
		'compress': false,
		'handle uploads': false,
		'headless': false,
		'language options': { disable: true },
		'logger': false,
		'session': false,
		'session options': {
			cookieParser(_req: Request, _res: Response, next: NextFunction) {
				next();
			},
		},
		'ssl': false,
		'ssl port': 443,
		'trust proxy': false,
		...overrides,
	};

	return {
		_redirects: {},
		app: undefined,
		expressSession(req: Request, _res: Response, next: NextFunction) {
			(req as unknown as { session?: Record<string, unknown> }).session = {};
			next();
		},
		fieldTypes: {},
		nav: undefined,
		nativeApp: false,
		session: {
			persist(_req: Request, _res: Response, next: NextFunction) {
				next();
			},
			keystoneAuth(_req: Request, _res: Response, next: NextFunction) {
				next();
			},
		},
		callHook(...args: unknown[]) {
			const next = args[args.length - 1];
			if (typeof next === 'function') next();
		},
		createKeystoneHash() {
			return 'test-security-headers';
		},
		expandPath(value: string) {
			return value;
		},
		get(key: string) {
			return options[key];
		},
		getPath() {
			return undefined;
		},
		initDatabaseConfig() {},
		initExpressSession() {},
		initNav() {
			return { sections: [] };
		},
		set(key: string, value: unknown) {
			options[key] = value;
			return this;
		},
		wrapHTMLError(title: string, err: unknown) {
			const errorText = typeof err === 'string' ? err : err instanceof Error ? err.message : '';
			return `<h1>${title}</h1>${errorText}`;
		},
	} as unknown as Keystone;
}

describe('createApp security headers', function () {
	before(async function () {
		await import('keystone');
		({ default: createApp } = await import('keystone/server/createApp'));
	});

	it('emits Helmet nosniff, frameguard, and CSP headers on admin API responses', async function () {
		await request(createApp(createKeystoneMock(), express))
			.get('/keystone-api/session')
			.expect(200)
			.expect(function (res) {
				const csp = res.headers['content-security-policy'];

				expect(res.headers['x-content-type-options']).to.equal('nosniff');
				expect(res.headers['x-frame-options']).to.equal('SAMEORIGIN');
				expect(csp).to.be.a('string');
				expect(csp).to.include("default-src 'self'");
				expect(csp).to.match(/script-src 'self' 'nonce-[A-Za-z0-9+/=]+'/);
				expect(csp).to.include("frame-ancestors 'self'");
			});
	});

	it('emits HSTS on admin API responses when force SSL is configured', async function () {
		await request(createApp(createKeystoneMock({
			ssl: 'force',
			'trust proxy': true,
		}), express))
			.get('/keystone-api/session')
			.set('x-forwarded-proto', 'https')
			.expect(200)
			.expect(function (res) {
				expect(res.headers['strict-transport-security']).to.equal('max-age=31536000; includeSubDomains');
			});
	});
});
