import keystone from 'keystone';
import { expect } from 'chai';
import sinon from 'sinon';
import utils from 'keystone-utils';
import autokey from 'keystone/lib/schemaPlugins/autokey';
import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import '../../../models/Post.mts';

const Post = (keystone as unknown as { list(key: string): PostList }).list('Post');
interface PostDoc {
	slug: unknown;
	title: unknown;
	content: string | undefined;
	save(): Promise<PostDoc>;
	_id?: unknown;
}
interface FindOneQuery {
	select(fields: string): FindOneQuery;
	exec(): Promise<PostDoc | null>;
}
interface PostList {
	model: {
		find(q?: Record<string, unknown>): unknown;
		findOne(q?: Record<string, unknown>): FindOneQuery;
		deleteMany(q?: Record<string, unknown>): Promise<unknown>;
		new(data?: Record<string, unknown>): { save(): Promise<PostDoc>; slug?: unknown; _id?: unknown; content?: string };
	};
}

let mongoose: unknown;
before(async function () {
	mongoose = await getMongooseConnection();
	(keystone as unknown as { mongoose: unknown }).mongoose = mongoose;
});

function createAutokeyList(options: Record<string, unknown>) {
	return createAutokeyHarness(options).list;
}

function createAutokeyHarness(options: Record<string, unknown>, overrides: Record<string, unknown> = {}) {
	const preHooks: Array<{ name: string; handler: unknown }> = [];
	const postHooks: Array<{ name: string; handler: unknown }> = [];
	const list: {
		key: string;
		get(name: string): unknown;
		fields: Record<string, unknown>;
		model: unknown;
		schema: {
			add(): void;
			pre(name: string, handler: unknown): void;
			post(name: string, handler: unknown): void;
			pathType(): string;
		};
		autokey?: { ignoreIncompleteSource?: boolean; ingoreIncompleteSource?: boolean };
	} = {
		key: 'AutokeyOptionTest',
		get(name: string) {
			expect(name).to.equal('autokey');
			return options;
		},
		fields: {},
		model: overrides.model,
		schema: {
			add() {},
			pre(name: string, handler: unknown) {
				preHooks.push({ name, handler });
			},
			post(name: string, handler: unknown) {
				postHooks.push({ name, handler });
			},
			pathType() {
				return 'real';
			},
		},
	};

	autokey.call(list as unknown as import('keystone/lib/list').KeystoneList);

	expect(preHooks).to.have.length(1);
	expect(preHooks[0]?.name).to.equal('save');
	return {
		list,
		saveHook: preHooks[0]?.handler as (this: unknown, next: (err?: unknown) => void) => void,
		postHooks,
	};
}

function createAutokeyDoc(id: string, title: string) {
	const values: Record<string, unknown> = { id, title };
	return {
		id,
		$locals: {},
		get(path: string) {
			return values[path];
		},
		set(path: string, value: unknown) {
			values[path] = value;
		},
		isModified(path: string) {
			return path === 'title';
		},
		isSelected() {
			return true;
		},
	};
}

async function flushMicrotasks(): Promise<void> {
	for (let i = 0; i < 10; i++) {
		await Promise.resolve();
	}
}

describe('Test autokey', function () {

	it('generate an autokey value from another field', async function () {
		const post = new Post.model({ title: 'Foo Bar', content: 'Foo bar bar baz bar bar' });
		await post.save();
		const found = await Post.model.findOne({ title: 'Foo Bar' }).exec();
		expect(found?.slug).to.equal(utils.slug('Foo Bar'));
	});

	it('not try to generate an autokey value if from field is not selected', async function () {
		const post = new Post.model({ title: 'Foo Bar 2', content: 'Foo bar bar baz bar bar' });
		await post.save();
		const partial = await Post.model.findOne({ title: 'Foo Bar 2' }).select('content').exec();
		expect(partial?.title).to.equal(undefined);
		if (partial) { partial.content = 'narf narf narf'; }
		await partial?.save();
		const refetched = await Post.model.findOne({ slug: utils.slug('Foo Bar 2') }).exec();
		expect(refetched).to.be.an('object');
		expect(refetched?.slug).to.equal(utils.slug('Foo Bar 2'));
	});

	it('accepts the correctly spelled ignoreIncompleteSource option', function () {
		const list = createAutokeyList({
			from: 'title',
			path: 'slug',
			ignoreIncompleteSource: true,
		});

		expect(list.autokey?.ignoreIncompleteSource).to.equal(true);
	});

	it('keeps the legacy ingoreIncompleteSource option as an alias', function () {
		const list = createAutokeyList({
			from: 'title',
			path: 'slug',
			ingoreIncompleteSource: true,
		});

		expect(list.autokey?.ignoreIncompleteSource).to.equal(true);
		expect(list.autokey?.ingoreIncompleteSource).to.equal(true);
	});

	it('serializes unique autokey generation until the prior save completes', async function () {
		const storedSlugs = new Map<string, string>();
		interface MockQuery {
			slug: string;
			where(path: string, value: string): MockQuery;
			exec(): Promise<Array<{ id: string }> | []>;
		}
		const model = {
			find(): MockQuery {
				const query: MockQuery = {
					slug: '',
					where(path: string, value: string): MockQuery {
						if (path === 'slug') {
							query.slug = value;
						}
						return query;
					},
					exec(): Promise<Array<{ id: string }> | []> {
						const id = storedSlugs.get(query.slug);
						return Promise.resolve(id ? [{ id }] : []);
					},
				};
				return query;
			},
		};
		const harness = createAutokeyHarness({
			from: 'title',
			path: 'slug',
			unique: true,
		}, { model });
		const firstDoc = createAutokeyDoc('first-id', 'Concurrent Title');
		const secondDoc = createAutokeyDoc('second-id', 'Concurrent Title');
		const firstNext = sinon.spy();
		const secondNext = sinon.spy();

		harness.saveHook.call(firstDoc, firstNext);
		await flushMicrotasks();
		sinon.assert.calledOnce(firstNext);
		expect(firstDoc.get('slug')).to.equal('concurrent-title');

		harness.saveHook.call(secondDoc, secondNext);
		await flushMicrotasks();
		sinon.assert.notCalled(secondNext);

		storedSlugs.set(String(firstDoc.get('slug')), firstDoc.id);
		(harness.postHooks[0]?.handler as (this: unknown, doc: unknown, next: () => void) => void)
			.call(firstDoc, firstDoc, function () {});
		await flushMicrotasks();

		sinon.assert.calledOnce(secondNext);
		expect(secondDoc.get('slug')).to.equal('concurrent-title-1');
	});

	after(function (done) {
		Post.model.deleteMany({}).then(function () { done(); }, done);
	});
});
