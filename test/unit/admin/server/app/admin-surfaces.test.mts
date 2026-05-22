import express from 'express';
import type { Application, NextFunction, Request, RequestHandler, Response } from 'express';
import http from 'node:http';
import { expect } from 'chai';
import request from 'supertest';

import type { Keystone } from 'keystone';

let createApp: typeof import('keystone/server/createApp').default;
let keystoneSingleton: typeof import('keystone').default;

interface ManualMountInternals {
	app?: unknown;
	expressSession: RequestHandler;
	httpServer?: unknown;
	lists: Record<string, { model: { findOne(query: unknown): { exec(): Promise<unknown> } } } | undefined>;
	security: {
		csrf: {
			validate(req: Request): boolean;
		};
	};
	session: {
		persist: RequestHandler;
		keystoneAuth: RequestHandler;
		signinWithUser(user: unknown, req: Request, res: Response, next: () => void): void;
	};
	start?(): unknown;
	get(key: 'session options'): { cookieParser: RequestHandler };
	get(key: string): unknown;
}

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
		'user model': 'User',
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
		lists: {},
		nav: undefined,
		nativeApp: false,
		security: {
			csrf: {
				CSRF_HEADER_KEY: 'x-keystone-csrf',
				getToken() {
					return 'test-admin-csrf';
				},
				validate() {
					return true;
				},
			},
		},
		session: {
			persist(_req: Request, _res: Response, next: NextFunction) {
				next();
			},
			keystoneAuth(_req: Request, _res: Response, next: NextFunction) {
				next();
			},
			signinWithUser(user: unknown, req: Request, _res: Response, next: () => void) {
				req.user = user as Request['user'];
				next();
			},
		},
		callHook(...args: unknown[]) {
			const next = args[args.length - 1];
			if (typeof next === 'function') next();
		},
		createKeystoneHash() {
			return 'test-admin-surfaces';
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
		getOrphanedLists() {
			return [];
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

describe('admin surface mounting', function () {
	before(async function () {
		keystoneSingleton = (await import('keystone')).default;
		({ default: createApp } = await import('keystone/server/createApp'));
	});

	it('mounts the canonical admin API and admin legacy alias for the default legacy UI process', async function () {
		const app: Application = createApp(createKeystoneMock(), express);

		await request(app)
			.get('/keystone-api/session')
			.expect(200)
			.expect('content-type', /json/);

		await request(app)
			.get('/keystone/api/session')
			.expect(200)
			.expect('content-type', /json/);
	});

	it('honors custom admin API paths and legacy API aliases', async function () {
		const app: Application = createApp(createKeystoneMock({
			'admin legacy path': 'manage',
			'admin next path': 'manage-next',
			'admin api path': 'manage-api',
			'auth': true,
			'session': true,
		}), express);

		await request(app)
			.get('/manage-api/session')
			.expect(200)
			.expect('content-type', /json/);
		await request(app)
			.get('/manage/api/session')
			.expect(200)
			.expect('content-type', /json/);
		await request(app)
			.get('/manage/signin')
			.expect(200)
			.expect('content-type', /html/)
			.expect(function (res) {
				expect(res.text).to.contain('"adminLegacyPath":"/manage"');
				expect(res.text).to.contain('"adminApiPath":"/manage/api"');
			});
		await request(app).get('/keystone-api/session').expect(404);
		await request(app).get('/keystone/api/session').expect(404);
	});

	it('can disable the legacy admin API alias while keeping the canonical admin API', async function () {
		const app: Application = createApp(createKeystoneMock({
			'admin ui': 'next',
			'admin legacy api alias': false,
		}), express);

		await request(app).get('/keystone-api/session').expect(200);
		await request(app).get('/keystone/api/session').expect(404);
	});

	it('supports the legacy manual static/session/dynamic admin mounting sequence', async function () {
		let cookieParserHits = 0;
		let expressSessionHits = 0;
		let persistHits = 0;
		const keystone = createKeystoneMock({
			'auth': true,
			'session': true,
			'session options': {
				cookieParser(_req: Request, _res: Response, next: NextFunction) {
					cookieParserHits += 1;
					next();
				},
			},
		});
		const internals = keystone as unknown as ManualMountInternals;
		internals.expressSession = function expressSession(req: Request, _res: Response, next: NextFunction) {
			expressSessionHits += 1;
			(req as unknown as { session?: Record<string, unknown> }).session = { mounted: true };
			next();
		};
		internals.session.persist = function persist(_req: Request, _res: Response, next: NextFunction) {
			persistHits += 1;
			next();
		};
		internals.session.keystoneAuth = function keystoneAuth(req: Request, _res: Response, next: NextFunction) {
			req.user = { id: 'test-user' } as Request['user'];
			next();
		};

		const app = express();
		const adminRouter = express.Router();
		adminRouter.use(keystoneSingleton.Admin.Server.createStaticRouter(keystone));
		adminRouter.use(internals.get('session options').cookieParser);
		adminRouter.use(internals.expressSession);
		adminRouter.use(internals.session.persist);
		adminRouter.use(keystoneSingleton.Admin.Server.createDynamicRouter(keystone));
		app.use('/keystone', adminRouter);

		await request(app)
			.get('/keystone/api/session')
			.expect(200)
			.expect('content-type', /json/);
		await request(app)
			.get('/keystone/signin')
			.expect(200)
			.expect('content-type', /html/)
			.expect(function (res) {
				expect(res.text).to.contain('"adminLegacyPath":"/keystone"');
				expect(res.text).to.contain('"adminApiPath":"/keystone/api"');
			});
		await request(app)
			.get('/keystone/')
			.expect(200)
			.expect('content-type', /html/)
			.expect(function (res) {
				expect(res.text).to.contain('"adminLegacyPath":"/keystone"');
				expect(res.text).to.contain('"adminApiPath":"/keystone/api"');
			});
		expect(cookieParserHits).to.equal(3);
		expect(expressSessionHits).to.equal(3);
		expect(persistHits).to.be.at.least(3);
	});

	it('exposes the named legacy admin router factories used by manual Cloom mounting', async function () {
		const keystone = createKeystoneMock({
			'auth': true,
			'session': true,
		});
		const internals = keystone as unknown as ManualMountInternals;
		const staticRouter = keystoneSingleton.Admin.Server.createAdminLegacyStaticRouter(keystone);
		const compatRouter = keystoneSingleton.Admin.Server.createAdminLegacyCompatRouter(keystone);

		expect(keystoneSingleton.Admin.Server.createAdminLegacyStaticRouter).to.equal(keystoneSingleton.Admin.Server.createStaticRouter);
		expect(keystoneSingleton.Admin.Server.createAdminLegacyCompatRouter).to.equal(keystoneSingleton.Admin.Server.createDynamicRouter);
		expect(staticRouter).to.be.a('function');
		expect(compatRouter).to.be.a('function');

		const app = express();
		const adminRouter = express.Router();
		adminRouter.use(staticRouter);
		adminRouter.use(internals.get('session options').cookieParser);
		adminRouter.use(internals.expressSession);
		adminRouter.use(internals.session.persist);
		adminRouter.use(compatRouter);
		app.use('/keystone', adminRouter);

		await request(app)
			.get('/keystone/api/session')
			.expect(200)
			.expect('content-type', /json/);
		await request(app)
			.get('/keystone/signin')
			.expect(200)
			.expect('content-type', /html/);
	});

	it('supports a Cloom-owned Express app and HTTP listener without keystone.start()', async function () {
		let startCalled = false;
		const keystone = createKeystoneMock({
			'auth': true,
			'session': true,
		});
		const internals = keystone as unknown as ManualMountInternals;
		internals.start = function start() {
			startCalled = true;
			throw new Error('keystone.start should not be called by a Cloom-owned listener');
		};

		const app = express();
		app.get('/', function (_req, res) {
			res.redirect('/keystone');
		});
		const adminRouter = express.Router();
		adminRouter.use(keystoneSingleton.Admin.Server.createAdminLegacyStaticRouter(keystone));
		adminRouter.use(internals.get('session options').cookieParser);
		adminRouter.use(internals.expressSession);
		adminRouter.use(internals.session.persist);
		adminRouter.use(keystoneSingleton.Admin.Server.createAdminLegacyCompatRouter(keystone));
		app.use('/keystone', adminRouter);

		const server = http.createServer(app);
		await new Promise<void>(function (resolve) {
			server.listen(0, '127.0.0.1', resolve);
		});
		try {
			await request(server)
				.get('/keystone/api/session')
				.expect(200)
				.expect('content-type', /json/);
			await request(server)
				.get('/')
				.expect(302)
				.expect('location', '/keystone');
		} finally {
			await new Promise<void>(function (resolve, reject) {
				server.close(function (err) {
					if (err) reject(err);
					else resolve();
				});
			});
		}

		expect(startCalled).to.equal(false);
		expect(internals.app).to.equal(undefined);
		expect(internals.httpServer).to.equal(undefined);
	});

	it('supports sign-in through the legacy manual admin API alias', async function () {
		const findOneQueries: unknown[] = [];
		const validPassword = ['correct', 'password'].join('-');
		const user = {
			id: 'admin-1',
			email: 'admin@example.test',
			_: {
				password: {
					compare(password: string, callback: (error: Error | null, isMatch: boolean) => void) {
						callback(null, password === validPassword);
					},
				},
			},
		};
		const keystone = createKeystoneMock({
			'auth': true,
			'session': true,
			'user model': 'Administrator',
		});
		const internals = keystone as unknown as ManualMountInternals;
		internals.lists.Administrator = {
			model: {
				findOne(query: unknown) {
					findOneQueries.push(query);
					return {
						exec() {
							return Promise.resolve(user);
						},
					};
				},
			},
		};

		const app = express();
		const adminRouter = express.Router();
		adminRouter.use(keystoneSingleton.Admin.Server.createStaticRouter(keystone));
		adminRouter.use(internals.get('session options').cookieParser);
		adminRouter.use(internals.expressSession);
		adminRouter.use(internals.session.persist);
		adminRouter.use(keystoneSingleton.Admin.Server.createDynamicRouter(keystone));
		app.use('/keystone', adminRouter);

		await request(app)
			.post('/keystone/api/session/signin')
			.send({ email: 'ADMIN@example.test', password: validPassword })
			.expect(200)
			.expect(function (res) {
				expect(res.body.success).to.equal(true);
				expect(res.body.user.email).to.equal('admin@example.test');
			});

		const query = findOneQueries[0] as { email?: RegExp };
		expect(query.email).to.be.instanceOf(RegExp);
		expect(query.email?.test('admin@example.test')).to.equal(true);
		expect(query.email?.test('xadmin@example.test')).to.equal(false);
		expect(query.email?.flags).to.contain('i');
	});

	it('mounts API-only mode without admin legacy or admin next UI routes when admin ui is false', async function () {
		const app = createApp(createKeystoneMock({
			'admin ui': false,
			'admin api': true,
		}), express);

		await request(app).get('/keystone-api/session').expect(200);
		await request(app).get('/keystone/signin').expect(404);
		await request(app).get('/keystone-next/').expect(404);
		await request(app).get('/keystone/api/session').expect(404);
	});

	it('mounts explicit headless admin API without UI or alias routes', async function () {
		const app = createApp(createKeystoneMock({
			'admin api': true,
			headless: true,
		}), express);

		await request(app).get('/keystone-api/session').expect(200);
		await request(app).get('/keystone/signin').expect(404);
		await request(app).get('/keystone/api/session').expect(404);
	});

	it('can disable the admin API independently of UI configuration', async function () {
		const app = createApp(createKeystoneMock({
			'admin ui': false,
			'admin api': false,
		}), express);

		await request(app).get('/keystone-api/session').expect(404);
		await request(app).get('/keystone/signin').expect(404);
	});

	it('serves prebuilt legacy admin browser bundles without runtime bundling enabled', async function () {
		const originalDev = process.env.KEYSTONE_DEV;
		const originalPrebuild = process.env.KEYSTONE_PREBUILD_ADMIN;
		const originalRuntimeBundler = process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER;
		delete process.env.KEYSTONE_DEV;
		delete process.env.KEYSTONE_PREBUILD_ADMIN;
		delete process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER;
		try {
			const app = createApp(createKeystoneMock(), express);

			await request(app).get('/keystone/js/admin.js').expect(200).expect('content-type', /javascript/);
			await request(app).get('/keystone/js/signin.js').expect(200).expect('content-type', /javascript/);
			await request(app).get('/keystone/js/fields.js').expect(200).expect('content-type', /javascript/);
		} finally {
			if (originalDev === undefined) delete process.env.KEYSTONE_DEV;
			else process.env.KEYSTONE_DEV = originalDev;
			if (originalPrebuild === undefined) delete process.env.KEYSTONE_PREBUILD_ADMIN;
			else process.env.KEYSTONE_PREBUILD_ADMIN = originalPrebuild;
			if (originalRuntimeBundler === undefined) delete process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER;
			else process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER = originalRuntimeBundler;
		}
	});

	it('serves prebuilt legacy admin browser bundles when cache admin bundles is enabled', async function () {
		const originalDev = process.env.KEYSTONE_DEV;
		const originalPrebuild = process.env.KEYSTONE_PREBUILD_ADMIN;
		const originalRuntimeBundler = process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER;
		delete process.env.KEYSTONE_DEV;
		delete process.env.KEYSTONE_PREBUILD_ADMIN;
		delete process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER;
		try {
			const app = createApp(createKeystoneMock({
				'cache admin bundles': true,
			}), express);

			await request(app).get('/keystone/js/admin.js').expect(200).expect('content-type', /javascript/);
			await request(app).get('/keystone/js/signin.js').expect(200).expect('content-type', /javascript/);
			await request(app).get('/keystone/js/fields.js').expect(200).expect('content-type', /javascript/);
		} finally {
			if (originalDev === undefined) delete process.env.KEYSTONE_DEV;
			else process.env.KEYSTONE_DEV = originalDev;
			if (originalPrebuild === undefined) delete process.env.KEYSTONE_PREBUILD_ADMIN;
			else process.env.KEYSTONE_PREBUILD_ADMIN = originalPrebuild;
			if (originalRuntimeBundler === undefined) delete process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER;
			else process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER = originalRuntimeBundler;
		}
	});

	it('fails startup when configured surfaces collide after normalization', function () {
		expect(() => createApp(createKeystoneMock({
			'admin legacy path': '/keystone/',
			'admin api path': 'keystone',
		}), express)).to.throw("Keystone: 'admin legacy path' and 'admin api path' must be distinct");
	});
});
