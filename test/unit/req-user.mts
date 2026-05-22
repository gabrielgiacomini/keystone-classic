import keystone from 'keystone';
import request from 'supertest';
import { expect } from 'chai';
import type { Application, Request, Response } from 'express';
import getExpressApp from '../helpers/getExpressApp.mts';
import removeModel from '../helpers/removeModel.mts';

// keystone.List is typed `unknown` on the public interface; cast through
// `unknown` to get a concrete duck-type usable in test assertions.
interface KsList {
	add(fields: Record<string, unknown>): void;
	register(): void;
	schema: {
		pre(event: string, fn: (this: Record<string, unknown>, next: () => void, done?: unknown) => void): void;
		post(event: string, fn: (this: Record<string, unknown>) => void): void;
	};
	model: {
		new(data?: Record<string, unknown>): { getUpdateHandler(req: Request): { process(body: Record<string, unknown>, cb: (err: Error | null) => void): void }; save(): Promise<unknown> };
		deleteMany(q: Record<string, unknown>): Promise<unknown>;
	};
}
interface KsListConstructor {
	new(key: string, options?: Record<string, unknown>): KsList;
}

function ksListFactory(): KsListConstructor {
	return (keystone as unknown as { List: KsListConstructor }).List;
}

describe('List schema pre/post save hooks', function () {
	let app: Application;
	const dummyUser = { _id: 'USERID' };
	let Test: KsList;
	let pre: unknown;
	let post: unknown;

	before(async function () {
		app = await getExpressApp();
		removeModel('Test');
		Test = new (ksListFactory())('Test', {});
		Test.add({ name: { type: String } });
		Test.schema.pre('save', function (this: Record<string, unknown>, next: () => void, _done: unknown) {
			pre = this['_req_user'];
			next();
		});
		Test.schema.post('save', function (this: Record<string, unknown>) {
			post = this['_req_user'];
		});
		Test.register();
	});

	after(function () { removeModel('Test'); });

	describe('when using UpdateHandler()', function () {
		it('should receive ._req_user', function (done) {
			pre = undefined;
			post = undefined;
			app.post('/using-update-handler', function (req: Request, res: Response) {
				const item = new Test.model();
				req.user = dummyUser as unknown as Request['user'];
				const updateHandler = item.getUpdateHandler(req);
				updateHandler.process(req.body as Record<string, unknown>, function (err: Error | null) {
					if (err) { res.send('BAD'); } else { res.send('GOOD'); }
				});
			});
			request(app).post('/using-update-handler').send({ name: 'test' }).expect('GOOD')
				.end(function (err: Error | null) {
					if (err) return done(err);
					expect(pre).to.equal(dummyUser);
					expect(post).to.equal(dummyUser);
					done();
				});
		});
	});

	describe('when using .save()', function () {
		it('should not receive ._req_user', function (done) {
			pre = undefined;
			post = undefined;
			app.post('/using-save', function (req: Request, res: Response) {
				req.user = dummyUser as unknown as Request['user'];
				const item = new Test.model(req.body as Record<string, unknown>);
				item.save().then(function () {
					res.send('GOOD');
				}).catch(function () {
					res.send('BAD');
				});
			});
			request(app).post('/using-save').send({ name: 'test' }).expect('GOOD')
				.end(function (err: Error | null) {
					if (err) return done(err);
					expect(pre).to.be.undefined;
					expect(post).to.be.undefined;
					done();
				});
		});
	});
});
