import keystone from 'keystone';
import request from 'supertest';
import { expect } from 'chai';
import type { Application, Request, Response } from 'express';
import getExpressApp from '../helpers/getExpressApp.mts';
import removeModel from '../helpers/removeModel.mts';

// Minimal duck-types for keystone List instances used in this test.
// `keystone.List` is typed `unknown` on the public Keystone interface;
// these interfaces give us safe, non-`any` local types for test assertions.
interface KsDoc extends Record<string, unknown> {
	get(path: string): unknown;
	set(path: string, value: unknown): void;
	save(): Promise<KsDoc>;
	getUpdateHandler(req: Request): {
		process(body: Record<string, unknown>, cb: (err: Error | null) => void): void;
	};
}

interface KsModel {
	new(data?: Record<string, unknown>): KsDoc;
	find(q?: Record<string, unknown>): unknown;
	findById(id: unknown): { exec(): Promise<KsDoc | null> };
	deleteMany(q: Record<string, unknown>): Promise<unknown>;
}

interface KsList {
	add(fields: Record<string, unknown>): void;
	register(): void;
	field(name: string): Record<string, unknown> | undefined;
	model: KsModel;
	schema: {
		post(event: string, fn: (this: KsDoc) => void): void;
	};
}

interface KsListConstructor {
	new(key: string, options?: Record<string, unknown>): KsList;
}

/** Cast keystone to expose its runtime `.List` constructor without using `any`. */
function ksListFactory(): KsListConstructor {
	return (keystone as unknown as { List: KsListConstructor }).List;
}

describe('List "track" option', function () {
	let app: Application;
	const userModelName = 'User';
	const testModelName = 'Test';
	let User: KsList;
	let Test: KsList;
	let dummyUser1: KsDoc;
	let dummyUser2: KsDoc;
	let post: KsDoc;

	before(async function () {
		app = await getExpressApp();

		removeModel(userModelName);
		removeModel(testModelName);

		keystone.set('user model', userModelName);
		User = new (ksListFactory())(userModelName, {});
		User.add({ name: { type: String, required: true, index: true } });
		User.register();

		async function getItem(id: unknown): Promise<KsDoc> {
			if (id) {
				const found = await Test.model.findById(id).exec();
				if (!found) { throw new Error('test document not found'); }
				return found;
			} else {
				return new Test.model();
			}
		}

		app.post('/using-update-handler/:id?', function (req: Request, res: Response) {
			getItem(req.params['id']).then(function (item) {
				req.user = (req.params['id'] ? dummyUser2 : dummyUser1) as unknown as Request['user'];
				const updateHandler = item.getUpdateHandler(req);
				updateHandler.process(req.body as Record<string, unknown>, function (err: Error | null) {
					res.send(err ? 'BAD' : 'GOOD');
				});
			}).catch(function () { res.send('BAD'); });
		});

		app.post('/using-save/:id?', function (req: Request, res: Response) {
			getItem(req.params['id']).then(function (item) {
				item['_req_user'] = req.params['id'] ? dummyUser2 : dummyUser1;
				(item as unknown as { set(data: Record<string, unknown>): void }).set(req.body as Record<string, unknown>);
				return item.save();
			}).then(function () {
				res.send('GOOD');
			}).catch(function () {
				res.send('BAD');
			});
		});

		await User.model.deleteMany({});
		dummyUser1 = await new User.model({ name: 'John Doe' }).save();
		dummyUser2 = await new User.model({ name: 'Jane Doe' }).save();
	});

	describe('when "track" option is not valid', function () {
		afterEach(function () { removeModel(testModelName); });

		it('should throw an error if "track" is not a boolean or an object', function () {
			function badList() {
				Test = new (ksListFactory())(testModelName, { track: 'bad setting' });
				Test.add({ name: { type: String } });
				Test.register();
			}
			expect(badList).to.throw(/"track" must be a boolean or an object/);
		});

		it('should throw an error if "track" fields are not booleans or strings', function () {
			function badList() {
				Test = new (ksListFactory())(testModelName, { track: { createdBy: 5 } });
				Test.add({ name: { type: String } });
				Test.register();
			}
			expect(badList).to.throw(/must be a boolean or a string/);
		});

		it('should throw an error if "track" has an invalid field name', function () {
			function badList() {
				Test = new (ksListFactory())(testModelName, { track: { createdAt: true, badfield: true } });
				Test.add({ name: { type: String } });
				Test.register();
			}
			expect(badList).to.throw(/valid field options are/);
		});

		it('should not register the plugin if all fields are false', function () {
			Test = new (ksListFactory())(testModelName, { track: { createdAt: false, createdBy: false, updatedAt: false, updatedBy: false } });
			Test.add({ name: { type: String } });
			Test.register();
			expect(Test.field('createdAt')).to.be.undefined;
			expect(Test.field('createdBy')).to.be.undefined;
			expect(Test.field('updatedAt')).to.be.undefined;
			expect(Test.field('updatedBy')).to.be.undefined;
		});
	});

	describe('when "track" option is set to true', function () {
		describe('using updateHandler()', function () {
			before(function () {
				Test = new (ksListFactory())(testModelName, { track: true });
				Test.add({ name: { type: String } });
				Test.schema.post('save', function (this: KsDoc) { post = this; });
				Test.register();
			});
			after(function (done) {
				Test.model.deleteMany({}).then(function () { removeModel(testModelName); done(); }, done);
			});

			it('should have all the default fields', function () {
				expect(Test.field('createdAt')).to.be.an('object');
				expect(Test.field('createdBy')).to.be.an('object');
				expect(Test.field('updatedAt')).to.be.an('object');
				expect(Test.field('updatedBy')).to.be.an('object');
			});

			it('should updated all fields when adding a document', function (done) {
				request(app).post('/using-update-handler').send({ name: 'test1' }).expect('GOOD')
					.end(function (err: Error | null) {
						if (err) { return done(err); }
						expect(post.get('name')).to.equal('test1');
						expect(String(post.get('createdBy'))).to.equal(String(dummyUser1.get('id')));
						expect(String(post.get('updatedBy'))).to.equal(String(dummyUser1.get('id')));
						expect(post.get('createdAt')).to.be.an.instanceof(Date);
						expect(post.get('updatedAt')).to.be.an.instanceof(Date);
						expect(post.get('createdAt')).to.equal(post.get('updatedAt'));
						done();
					});
			});

			it('should updated "updatedAt/updatedBy" when modifying a document', function (done) {
				setTimeout(function () {
					request(app).post('/using-update-handler/' + String(post.get('id')))
						.send({ name: 'test2', 'updatedBy': dummyUser2.get('id'), 'createdBy': dummyUser1.get('id') })
						.expect('GOOD')
						.end(function (err: Error | null) {
							if (err) { return done(err); }
							expect(post.get('name')).to.equal('test2');
							expect(String(post.get('createdBy'))).to.equal(String(dummyUser1.get('id')));
							expect(String(post.get('updatedBy'))).to.equal(String(dummyUser2.get('id')));
							expect((post.get('updatedAt') as Date).getTime()).to.be.greaterThan((post.get('createdAt') as Date).getTime());
							done();
						});
				}, 250);
			});
		});

		describe('using .save()', function () {
			before(function () {
				Test = new (ksListFactory())(testModelName, { track: true });
				Test.add({ name: { type: String } });
				Test.schema.post('save', function (this: KsDoc) { post = this; });
				Test.register();
			});
			after(function (done) {
				Test.model.deleteMany({}).then(function () { removeModel(testModelName); done(); }, done);
			});

			it('should have all the default fields', function () {
				expect(Test.field('createdAt')).to.be.an('object');
				expect(Test.field('createdBy')).to.be.an('object');
				expect(Test.field('updatedAt')).to.be.an('object');
				expect(Test.field('updatedBy')).to.be.an('object');
			});

			it('should updated all fields when adding a document', function (done) {
				request(app).post('/using-save').send({ name: 'test1' }).expect('GOOD')
					.end(function (err: Error | null) {
						if (err) { return done(err); }
						expect(post.get('name')).to.equal('test1');
						expect(String(post.get('createdBy'))).to.equal(String(dummyUser1.get('id')));
						expect(String(post.get('updatedBy'))).to.equal(String(dummyUser1.get('id')));
						done();
					});
			});

			it('should updated "updatedAt/updatedBy" when modifying a document', function (done) {
				setTimeout(function () {
					request(app).post('/using-save/' + String(post['_id'])).send({ name: 'test2' }).expect('GOOD')
						.end(function (err: Error | null) {
							if (err) { return done(err); }
							expect((post.get('updatedAt') as Date).getTime()).to.be.greaterThan((post.get('createdAt') as Date).getTime());
							done();
						});
				}, 250);
			});
		});
	});

	describe('when "track" option fields are selectively enabled', function () {
		let previousUpdatedAt: Date;

		describe('using updateHandler()', function () {
			before(function () {
				Test = new (ksListFactory())(testModelName, { track: { updatedAt: true, updatedBy: true } });
				Test.add({ name: { type: String } });
				Test.schema.post('save', function (this: KsDoc) { post = this; });
				Test.register();
			});
			after(function (done) {
				Test.model.deleteMany({}).then(function () { removeModel(testModelName); done(); }, done);
			});

			it('should have only updatedAt and updatedBy fields', function () {
				expect(Test.field('createdAt')).to.be.undefined;
				expect(Test.field('createdBy')).to.be.undefined;
				expect(Test.field('updatedAt')).to.be.an('object');
				expect(Test.field('updatedBy')).to.be.an('object');
			});

			it('should update enabled fields when adding a document', function (done) {
				request(app).post('/using-update-handler').send({ name: 'test1' }).expect('GOOD')
					.end(function (err: Error | null) {
						if (err) { return done(err); }
						expect(String(post.get('updatedBy'))).to.equal(String(dummyUser1.get('id')));
						previousUpdatedAt = post.get('updatedAt') as Date;
						done();
					});
			});

			it('should update "updatedAt/updatedBy" when modifying a document', function (done) {
				setTimeout(function () {
					request(app).post('/using-update-handler/' + String(post['_id'])).send({ name: 'test2' }).expect('GOOD')
						.end(function (err: Error | null) {
							if (err) { return done(err); }
							expect((post.get('updatedAt') as Date).getTime()).to.be.greaterThan(previousUpdatedAt.getTime());
							done();
						});
				}, 250);
			});
		});

		describe('using .save()', function () {
			before(function () {
				Test = new (ksListFactory())(testModelName, { track: { updatedAt: true, updatedBy: true } });
				Test.add({ name: { type: String } });
				Test.schema.post('save', function (this: KsDoc) { post = this; });
				Test.register();
			});
			after(function (done) {
				Test.model.deleteMany({}).then(function () { removeModel(testModelName); done(); }, done);
			});

			it('should update all enabled fields when adding a document', function (done) {
				request(app).post('/using-save').send({ name: 'test1' }).expect('GOOD')
					.end(function (err: Error | null) {
						if (err) { return done(err); }
						previousUpdatedAt = post.get('updatedAt') as Date;
						done();
					});
			});

			it('should update "updatedAt/updatedBy" when modifying a document', function (done) {
				setTimeout(function () {
					request(app).post('/using-save/' + String(post['_id'])).send({ name: 'test2' }).expect('GOOD')
						.end(function (err: Error | null) {
							if (err) { return done(err); }
							expect((post.get('updatedAt') as Date).getTime()).to.be.greaterThan(previousUpdatedAt.getTime());
							done();
						});
				}, 250);
			});
		});
	});

	describe('when "track" option has custom field names', function () {
		let previousUpdatedAt: Date;

		describe('using updateHandler()', function () {
			before(function () {
				Test = new (ksListFactory())(testModelName, { track: { createdAt: 'customCreatedAt', createdBy: 'customCreatedBy', updatedAt: 'customUpdatedAt', updatedBy: 'customUpdatedBy' } });
				Test.add({ name: { type: String } });
				Test.schema.post('save', function (this: KsDoc) { post = this; });
				Test.register();
			});
			after(function (done) {
				Test.model.deleteMany({}).then(function () { removeModel(testModelName); done(); }, done);
			});

			it('should no have any of the default fields', function () {
				expect(Test.field('createdAt')).to.be.undefined;
				expect(Test.field('createdBy')).to.be.undefined;
				expect(Test.field('updatedAt')).to.be.undefined;
				expect(Test.field('updatedBy')).to.be.undefined;
			});

			it('should have all custom fields', function () {
				expect(Test.field('customCreatedAt')).to.be.an('object');
				expect(Test.field('customCreatedBy')).to.be.an('object');
				expect(Test.field('customUpdatedAt')).to.be.an('object');
				expect(Test.field('customUpdatedBy')).to.be.an('object');

				expect(Test.field('customCreatedAt')?.['type']).to.equal('datetime');
				expect(Test.field('customCreatedBy')?.['type']).to.equal('relationship');
				expect(Test.field('customUpdatedAt')?.['type']).to.equal('datetime');
				expect(Test.field('customUpdatedBy')?.['type']).to.equal('relationship');
			});

			it('should update all custom fields when adding a document', function (done) {
				request(app).post('/using-update-handler').send({ name: 'test1' }).expect('GOOD')
					.end(function (err: Error | null) {
						if (err) { return done(err); }
						expect(String(post['customCreatedBy'])).to.equal(String(dummyUser1.get('id')));
						previousUpdatedAt = post['customUpdatedAt'] as Date;
						done();
					});
			});

			it('should update custom "updatedAt/updatedBy" when modifying', function (done) {
				setTimeout(function () {
					request(app).post('/using-update-handler/' + String(post['_id'])).send({ name: 'test2' }).expect('GOOD')
						.end(function (err: Error | null) {
							if (err) { return done(err); }
							expect((post['customUpdatedAt'] as Date).getTime()).to.be.greaterThan(previousUpdatedAt.getTime());
							done();
						});
				}, 250);
			});
		});

		describe('using save()', function () {
			before(function () {
				Test = new (ksListFactory())(testModelName, { track: { createdAt: 'customCreatedAt', createdBy: 'customCreatedBy', updatedAt: 'customUpdatedAt', updatedBy: 'customUpdatedBy' } });
				Test.add({ name: { type: String } });
				Test.schema.post('save', function (this: KsDoc) { post = this; });
				Test.register();
			});
			after(function (done) {
				Test.model.deleteMany({}).then(function () { removeModel(testModelName); done(); }, done);
			});

			it('should no have any of the default fields', function () {
				expect(Test.field('createdAt')).to.be.undefined;
				expect(Test.field('createdBy')).to.be.undefined;
				expect(Test.field('updatedAt')).to.be.undefined;
				expect(Test.field('updatedBy')).to.be.undefined;
			});

			it('should have all the custom fields', function () {
				expect(Test.field('customCreatedAt')).to.be.an('object');
				expect(Test.field('customCreatedBy')).to.be.an('object');
				expect(Test.field('customUpdatedAt')).to.be.an('object');
				expect(Test.field('customUpdatedBy')).to.be.an('object');

				expect(Test.field('customCreatedAt')?.['type']).to.equal('datetime');
				expect(Test.field('customCreatedBy')?.['type']).to.equal('relationship');
				expect(Test.field('customUpdatedAt')?.['type']).to.equal('datetime');
				expect(Test.field('customUpdatedBy')?.['type']).to.equal('relationship');
			});

			it('should update all custom fields when adding a document', function (done) {
				request(app).post('/using-save').send({ name: 'test1' }).expect('GOOD')
					.end(function (err: Error | null) {
						if (err) { return done(err); }
						previousUpdatedAt = post['customUpdatedAt'] as Date;
						done();
					});
			});

			it('should update custom "updatedAt/updatedBy" when modifying', function (done) {
				setTimeout(function () {
					request(app).post('/using-save/' + String(post['_id'])).send({ name: 'test2' }).expect('GOOD')
						.end(function (err: Error | null) {
							if (err) { return done(err); }
							expect((post['customUpdatedAt'] as Date).getTime()).to.be.greaterThan(previousUpdatedAt.getTime());
							done();
						});
				}, 250);
			});
		});
	});
});
