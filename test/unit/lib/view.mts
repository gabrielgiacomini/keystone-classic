import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import keystone from 'keystone';
import type { Express, Request, Response, NextFunction } from 'express';
import createMethodOverrideMiddleware from '../../../server/methodOverride.mts';

// keystone.View is typed `unknown` on the public interface; this cast gives us
// a non-`any` local shape for the constructor and render method used in tests.
interface KsView {
	render(cb: (err?: Error | null, req?: Request, res?: Response) => void): void;
	on(
		eventOrMatch: string | Record<string, string | boolean>,
		matchOrFn?: Record<string, string | boolean> | ((next: NextFunction) => void),
		fn?: (next: NextFunction) => void,
	): void;
	query(
		key: string,
		query: { exec(): Promise<unknown> },
		options?: {
			none?: (next: NextFunction) => void;
			then?: (err: Error | null, results: unknown, next: NextFunction) => void;
		} | string,
	): void;
}
type KsViewConstructor = new (req: Request, res: Response) => KsView;

function ksViewCtor(): KsViewConstructor {
	return (keystone as unknown as { View: KsViewConstructor }).View;
}

const getApp = function (): Express {
	const app = (keystone as unknown as { express(): Express }).express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(createMethodOverrideMiddleware());
	return app;
};

describe('Keystone.View', function () {

	describe('new', function () {
		it('must be an instance of View', function (done) {
			const app = getApp();
			app.get('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				expect(view).to.be.an.instanceof(ksViewCtor());
				res.send('OK');
			});
			request(app).get('/').expect('OK', done);
		});
	});

	describe('.render(callback)', function () {
		it('must call the callback function', function (done) {
			const app = getApp();
			app.get('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				view.render(function () { res.send('OK'); });
			});
			request(app).get('/').expect('OK', done);
		});
	});

	describe('.render(callback)', function () {
		it('must pass (err, req, res) to the callback', function (done) {
			const app = getApp();
			app.get('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				view.render(function (err?: Error | null, req2?: Request, res2?: Response) {
					expect(err).to.not.exist;
					expect(req2).to.equal(req);
					expect(res2).to.equal(res);
					res.send('OK');
				});
			});
			request(app).get('/').expect('OK', done);
		});
	});

	describe('.on(event, [match,] fn)', function () {

		it('must call init methods first', function (done) {
			const app = getApp();
			app.get('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				let status = 'NOT OK';
				view.on('init', function (next: NextFunction) { status = 'OK'; next(); });
				view.render(function () { res.send(status); });
			});
			request(app).get('/').expect('OK', done);
		});

		function getApp_getAndPost(): Express {
			const app = getApp();
			app.all('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				let status = 'OK';
				view.on('get', function (next: NextFunction) { status = 'OK GET'; next(); });
				view.on('post', function (next: NextFunction) { status = 'OK POST'; next(); });
				view.render(function () { res.send(status); });
			});
			return app;
		}

		it('must call get actions correctly', function (done) {
			request(getApp_getAndPost()).get('/').expect('OK GET', done);
		});

		it('must call post actions correctly', function (done) {
			request(getApp_getAndPost()).post('/').expect('OK POST', done);
		});

		function getApp_conditionalGet(): Express {
			const app = getApp();
			app.get('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				let status = 'OK';
				view.on('get', { test: 'yes' }, function (next: NextFunction) { status = 'OK GET'; next(); });
				view.render(function () { res.send(status); });
			});
			return app;
		}

		it('must invoke get actions with matching query parameters', function (done) {
			request(getApp_conditionalGet()).get('/?test=yes').expect('OK GET', done);
		});

		it('must skip get actions without matching query parameters', function (done) {
			request(getApp_conditionalGet()).get('/').expect('OK', done);
		});

		function getApp_conditionalPostValue(): Express {
			const app = getApp();
			app.post('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				let status = 'OK';
				view.on('post', { test: 'yes' }, function (next: NextFunction) { status = 'OK POST'; next(); });
				view.render(function () { res.send(status); });
			});
			return app;
		}

		it('must invoke post actions with matching body data', function (done) {
			request(getApp_conditionalPostValue()).post('/').send({ test: 'yes' }).expect('OK POST', done);
		});

		it('must skip post actions with non-matching body data', function (done) {
			request(getApp_conditionalPostValue()).post('/').send({ test: 'no' }).expect('OK', done);
		});

		function getApp_conditionalPostTruthy(): Express {
			const app = getApp();
			app.post('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				let status = 'OK';
				view.on('post', { test: true }, function (next: NextFunction) { status = 'OK POST'; next(); });
				view.render(function () { res.send(status); });
			});
			return app;
		}

		it('must invoke post actions with body data present', function (done) {
			request(getApp_conditionalPostTruthy()).post('/').send({ test: 'yes' }).expect('OK POST', done);
		});

		it('must skip post actions without matching body data', function (done) {
			request(getApp_conditionalPostTruthy()).post('/').expect('OK', done);
		});

		function getApp_extRequest(): Express {
			const app = getApp();
			app.get('/', function (req: Request, res: Response) {
				(req as Request & { ext?: Record<string, string> }).ext = { prop: 'value' };
				const view = new (ksViewCtor())(req, res);
				let status = 'NOT OK';
				view.on({ 'ext.prop': 'value' }, function (next: NextFunction) { status = 'OK'; next(); });
				view.render(function () { res.send(status); });
			});
			return app;
		}

		it('must invoke actions based on req properties', function (done) {
			request(getApp_extRequest()).get('/').expect('OK', done);
		});
	});

	describe('.query(key, query, options)', function () {
		it('must call the none callback for empty array results', function (done) {
			const app = getApp();
			app.get('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				let status = 'NOT OK';
				view.query('items', {
					exec() {
						return Promise.resolve([]);
					},
				}, {
					none(next: NextFunction) {
						status = 'OK NONE';
						next();
					},
				});
				view.render(function () { res.send(status); });
			});
			request(app).get('/').expect('OK NONE', done);
		});

		it('must call the then callback for successful results', function (done) {
			const app = getApp();
			app.get('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				let status = 'NOT OK';
				const results = [{ id: 'item-1' }];
				view.query('items', {
					exec() {
						return Promise.resolve(results);
					},
				}, {
					then(err: Error | null, queryResults: unknown, next: NextFunction) {
						expect(err).to.equal(null);
						expect(queryResults).to.equal(results);
						status = 'OK THEN';
						next();
					},
				});
				view.render(function () { res.send(status); });
			});
			request(app).get('/').expect('OK THEN', done);
		});

		it('must populate related paths when options is a string', function (done) {
			const app = getApp();
			const keystoneWithPopulate = keystone as unknown as {
				populateRelated: (results: unknown, paths: string, callback: (err?: Error | null) => void) => void;
			};
			const originalPopulateRelated = keystoneWithPopulate.populateRelated;

			app.get('/', function (req: Request, res: Response) {
				const view = new (ksViewCtor())(req, res);
				let status = 'NOT OK';
				const results = [{ id: 'item-1' }];
				keystoneWithPopulate.populateRelated = function (queryResults, paths, callback) {
					expect(queryResults).to.equal(results);
					expect(paths).to.equal('author tags');
					status = 'OK POPULATED';
					callback(null);
				};
				view.query('items', {
					exec() {
						return Promise.resolve(results);
					},
				}, 'author tags');
				view.render(function () {
					keystoneWithPopulate.populateRelated = originalPopulateRelated;
					res.send(status);
				});
			});

			request(app).get('/').expect('OK POPULATED', function (err) {
				keystoneWithPopulate.populateRelated = originalPopulateRelated;
				done(err);
			});
		});
	});
});
