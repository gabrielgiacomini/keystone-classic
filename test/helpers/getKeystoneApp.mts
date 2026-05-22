import keystone from 'keystone';
import request from 'supertest';
import type { Express, Application } from 'express';

// keystone.app, keystone.httpServer, keystone.httpsServer, keystone.mongoose
// are internal properties not exposed on the public Keystone interface;
// cast through `unknown` to avoid `any`.
interface KsInternal {
	app: unknown;
	mongoose: unknown;
	httpServer: { close(): void };
	httpsServer: { close(): void };
	init(opts: Record<string, unknown>): KsInternal;
	set(key: string, value: unknown): KsInternal;
	start(opts: Record<string, unknown>): void;
}

function ks(): KsInternal {
	return keystone as unknown as KsInternal;
}

function testApp(
	req: ReturnType<typeof request>,
	page: string | false,
	server: { close(): void },
	done: (err?: Error) => void,
) {
	const path: string = page || '/';
	(req as unknown as { get(p: string): { expect(code: number): { end(cb: (err: Error | null) => void): void } } })
		.get(path)
		.expect(200)
		.end(function (err: Error | null) {
			if (err) return done(err);
			server.close();
			done();
		});
}

const routes = function (app: Application) {
	app.get('*', function (_req, res) {
		res.sendStatus(200);
	});
};

export function startHttp(cb?: (ok: boolean) => void) {
	ks().app = false;
	ks().mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'auth': false,
		// 4001 — secondary tool, avoids reserved 4000 (port-cluster rule)
		'port': '4001',
	})
		.set('routes', routes)
		.start({
			onStart: function () {
				if (typeof cb === 'function') {
					testApp(request('http://@:4001'), false, ks().httpServer, function (err?: Error) {
						if (err) {
							console.log(err);
							return cb(false);
						}
						return cb(true);
					});
				}
			},
		});
}

export function startHttps(cb?: (ok: boolean) => void) {
	ks().app = false;
	ks().mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'ssl': 'only',
		'ssl key': './certs/server.ca.key',
		'ssl cert': './certs/server.crt',
		'auth': false,
		// 4002 — secondary tool, avoids reserved 4000 (port-cluster rule)
		'ssl port': '4002',
	})
		.set('routes', routes)
		.start({
			onStart: function () {
				if (typeof cb === 'function') {
					testApp(request('https://@:4002'), '/', ks().httpsServer, function (err?: Error) {
						if (err) {
							return cb(false);
						}
						return cb(true);
					});
				}
			},
		});
}

export function startSocket(cb?: (ok: boolean) => void) {
	ks().app = false;
	ks().mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'unix socket': '/tmp/testKeystoneUnixSocket',
		'auth': false,
		'name': 'Test Site',
	})
		.set('routes', routes)
		.start({
			onStart: function () {
				testApp(request(ks().app as Express), '/', ks().httpServer, function (err?: Error) {
					if (err) {
						return cb?.(false);
					}
					return cb?.(true);
				});
			},
		});
}
