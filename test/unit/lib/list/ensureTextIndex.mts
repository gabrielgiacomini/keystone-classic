import { expect } from 'chai';
import sinon from 'sinon';
import keystone from 'keystone';
import mongoose from 'mongoose';
import { inspect } from 'node:util';
import ensureTextIndex from 'keystone/lib/list/ensureTextIndex';
import addSearchToQuery from 'keystone/lib/list/addSearchToQuery';
import getSearchFilters from 'keystone/lib/list/getSearchFilters';
import { canSearchWithTextIndex } from 'keystone/lib/list/buildSearchTextIndex';
import type { KeystoneList } from 'keystone/lib/list';
import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import removeModel from '../../../helpers/removeModel.mts';

const textIndex = { title: 'text' };

function hashString(string: string): number {
	let hash = 0;
	if (string.length === 0) return hash;
	for (let i = 0; i < string.length; i++) {
		const char = string.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash;
}

function indexNameFor(index: Record<string, string>): string {
	const fieldsHash = Math.abs(hashString(Object.keys(index).sort((a, b) => a.localeCompare(b)).join(';')));
	return 'keystone_searchFields_textIndex_' + fieldsHash;
}

function createList(collection: Record<string, unknown>, buildSearchTextIndex: () => Record<string, string> | false = () => textIndex): KeystoneList {
	return {
		key: 'Post',
		model: { collection },
		buildSearchTextIndex,
	} as unknown as KeystoneList;
}

function run(list: KeystoneList): Promise<Error | null | undefined> {
	return new Promise((resolve) => {
		ensureTextIndex.call(list, resolve);
	});
}

describe('ensureTextIndex', function () {
	it('passes createIndex errors to the callback', async function () {
		const error = new Error('create failed');
		const createIndex = sinon.stub().rejects(error);
		const collection = { indexes: sinon.stub().resolves([{ name: '_id_', key: { _id: 1 } }]), createIndex };

		expect(await run(createList(collection))).to.equal(error);
		sinon.assert.calledOnce(createIndex);
		sinon.assert.calledWithExactly(createIndex, textIndex, { name: indexNameFor(textIndex) });
	});

	it('passes index listing errors to the callback', async function () {
		const error = new Error('index list failed');
		const collection = { indexes: sinon.stub().rejects(error) };

		expect(await run(createList(collection))).to.equal(error);
	});

	it('creates the index when the collection does not exist yet', async function () {
		const createIndex = sinon.stub().resolves('ok');
		const collection = { indexes: sinon.stub().rejects(Object.assign(new Error('ns does not exist'), { code: 26 })), createIndex };

		expect(await run(createList(collection))).to.equal(undefined);
		sinon.assert.calledOnce(createIndex);
	});

	it('calls back without creating an index when the generated text index already exists', async function () {
		const createIndex = sinon.spy();
		const dropIndex = sinon.spy();
		const collection = {
			indexes: sinon.stub().resolves([{ name: indexNameFor(textIndex), key: { _fts: 'text', _ftsx: 1 }, weights: { title: 1 } }]),
			createIndex,
			dropIndex,
		};

		expect(await run(createList(collection))).to.equal(undefined);
		sinon.assert.notCalled(createIndex);
		sinon.assert.notCalled(dropIndex);
	});

	it('recreates a generated index whose name matches but whose definition differs', async function () {
		const createIndex = sinon.stub().resolves('ok');
		const dropIndex = sinon.stub().resolves();
		const collection = {
			indexes: sinon.stub().resolves([{ name: indexNameFor(textIndex), key: { _fts: 'text', _ftsx: 1 }, weights: { title: 1, resetKey: 1 } }]),
			createIndex,
			dropIndex,
		};

		expect(await run(createList(collection))).to.equal(undefined);
		sinon.assert.calledOnce(dropIndex);
		sinon.assert.calledWithExactly(dropIndex, indexNameFor(textIndex));
		sinon.assert.calledOnce(createIndex);
		sinon.assert.calledWithExactly(createIndex, textIndex, { name: indexNameFor(textIndex) });
	});

	it('passes generated-index drop errors to the callback', async function () {
		const error = new Error('drop failed');
		const createIndex = sinon.spy();
		const dropIndex = sinon.stub().rejects(error);
		const collection = {
			indexes: sinon.stub().resolves([{ name: 'keystone_searchFields_textIndex_1', key: { _fts: 'text', _ftsx: 1 }, weights: { body: 1 } }]),
			dropIndex,
			createIndex,
		};

		expect(await run(createList(collection))).to.equal(error);
		sinon.assert.calledOnce(dropIndex);
		sinon.assert.calledWithExactly(dropIndex, 'keystone_searchFields_textIndex_1');
		sinon.assert.notCalled(createIndex);
	});

	it('calls back, without dropping, when a text index Keystone did not create is in the way', async function () {
		const createIndex = sinon.spy();
		const dropIndex = sinon.spy();
		const consoleError = sinon.stub(console, 'error');
		const collection = {
			indexes: sinon.stub().resolves([{ name: 'my_text', key: { _fts: 'text', _ftsx: 1 }, weights: { body: 1 } }]),
			dropIndex,
			createIndex,
		};

		try {
			expect(await run(createList(collection))).to.equal(undefined);
			sinon.assert.calledOnce(consoleError);
		} finally {
			consoleError.restore();
		}
		sinon.assert.notCalled(dropIndex);
		sinon.assert.notCalled(createIndex);
	});
});

interface NativeIndex { name: string; weights?: Record<string, number> }
interface NativeCollection {
	createIndex(spec: Record<string, 'text'>, options: { name: string }): Promise<string>;
	drop(): Promise<boolean>;
	dropIndex(name: string): Promise<unknown>;
	countDocuments(filter: Record<string, unknown>): Promise<number>;
	indexes(): Promise<NativeIndex[]>;
	insertOne(doc: Record<string, unknown>): Promise<unknown>;
}
interface KsList {
	add(fields: Record<string, unknown>): void;
	register(): void;
	schema: { index(fields: Record<string, 'text'>, options?: Record<string, unknown>): void };
}
type KsListConstructor = new (key: string, options?: Record<string, unknown>) => KsList;
type KsInit = { init(options?: Record<string, unknown>): void; List: KsListConstructor };

describe('ensureTextIndex against MongoDB', function () {
	const listKeys: string[] = [];
	const collectionNames: string[] = [];
	let connectedMongoose: typeof mongoose;
	let consoleWarn: sinon.SinonStub;
	let consoleError: sinon.SinonStub;
	let counter = 0;

	function nativeCollection(name: string): NativeCollection {
		return connectedMongoose.connection.db.collection(name) as unknown as NativeCollection;
	}

	async function textIndexes(name: string): Promise<NativeIndex[]> {
		return (await nativeCollection(name).indexes()).filter((index) => index.weights);
	}

	/** Creates a collection that already holds a text index, as an earlier boot would have left it. */
	async function collectionWithTextIndex(spec: Record<string, 'text'>, indexName: string): Promise<string> {
		const name = 'ensure_text_index_' + (++counter);
		collectionNames.push(name);
		await nativeCollection(name).drop().catch(() => false);
		await nativeCollection(name).insertOne({ title: 'hello', resetKey: 'resetkey7f3a9c' });
		await nativeCollection(name).createIndex(spec, { name: indexName });
		return name;
	}

	/** Declares and registers ("boots") a list on the collection; register() starts ensureTextIndex. */
	function bootList(collection: string, searchFields: string, prepare?: (list: KsList) => void): KeystoneList {
		const key = 'EnsureTextIndex' + counter;
		listKeys.push(key);
		const list = new (keystone as unknown as KsInit).List(key, {
			schema: { collection },
			searchFields,
			searchUsesTextIndex: true,
		});
		list.add({
			title: { type: String },
			body: { type: String },
			resetKey: { type: String, secret: true },
		});
		prepare?.(list);
		list.register();
		return list as unknown as KeystoneList;
	}

	async function waitFor(check: () => Promise<boolean> | boolean): Promise<void> {
		const deadline = Date.now() + 10000;
		while (!(await check())) {
			if (Date.now() > deadline) throw new Error('Timed out waiting for the text index to settle');
			await new Promise((resolve) => {
				setTimeout(resolve, 25);
			});
		}
	}

	before(async function () {
		connectedMongoose = await getMongooseConnection();
		(keystone as unknown as KsInit).init({ mongoose: connectedMongoose });
	});

	beforeEach(function () {
		consoleWarn = sinon.stub(console, 'warn');
		consoleError = sinon.stub(console, 'error');
	});

	afterEach(async function () {
		consoleWarn.restore();
		consoleError.restore();
		for (const key of listKeys.splice(0)) removeModel(key);
		for (const name of collectionNames.splice(0)) await nativeCollection(name).drop().catch(() => false);
	});

	it('replaces a generated index that still covers a secret path', async function () {
		const stale = { title: 'text', resetKey: 'text' } as const;
		const collection = await collectionWithTextIndex(stale, indexNameFor(stale));

		bootList(collection, 'title, resetKey');

		const current = indexNameFor({ title: 'text' });
		await waitFor(async () => (await textIndexes(collection)).some((index) => index.name === current));
		const indexes = await textIndexes(collection);
		expect(indexes.map((index) => index.name)).to.deep.equal([current]);
		expect(indexes[0]?.weights).to.deep.equal({ title: 1 });
		sinon.assert.notCalled(consoleWarn);
		sinon.assert.notCalled(consoleError);
	});

	it('replaces a generated index under the legacy name', async function () {
		const collection = await collectionWithTextIndex({ title: 'text', resetKey: 'text' }, 'searchFields_text_index');

		bootList(collection, 'title, body');

		const current = indexNameFor({ title: 'text', body: 'text' });
		await waitFor(async () => (await textIndexes(collection)).some((index) => index.name === current));
		const indexes = await textIndexes(collection);
		expect(indexes.map((index) => index.name)).to.deep.equal([current]);
		expect(indexes[0]?.weights).to.deep.equal({ body: 1, title: 1 });
	});

	it('drops a stale generated index when the only search fields are secret', async function () {
		const stale = { resetKey: 'text' } as const;
		const collection = await collectionWithTextIndex(stale, indexNameFor(stale));

		bootList(collection, 'resetKey');

		await waitFor(async () => (await textIndexes(collection)).length === 0);
		sinon.assert.notCalled(consoleWarn);
		sinon.assert.notCalled(consoleError);
	});

	it('leaves a hand-made index covering a secret path in place and warns once', async function () {
		const collection = await collectionWithTextIndex({ title: 'text', resetKey: 'text' }, 'my_handmade_text');

		bootList(collection, 'title, resetKey');

		await waitFor(() => consoleError.called);
		const indexes = await textIndexes(collection);
		expect(indexes.map((index) => index.name)).to.deep.equal(['my_handmade_text']);
		expect(indexes[0]?.weights).to.deep.equal({ resetKey: 1, title: 1 });
		sinon.assert.calledOnce(consoleWarn);
		const warning = String(consoleWarn.firstCall.args[0]);
		expect(warning).to.include('my_handmade_text').and.to.include('secret');
		expect(warning).to.not.include('\n');
	});

	it('searches with regular expressions, not `$text`, while a hand-made index covers a secret path', async function () {
		const secretValue = 'resetkey7f3a9c';
		const collection = await collectionWithTextIndex({ title: 'text', resetKey: 'text' }, 'my_handmade_text');
		// The hand-made index does answer a `$text` query for the secret value.
		expect(await nativeCollection(collection).countDocuments({ $text: { $search: secretValue } })).to.equal(1);

		const list = bootList(collection, 'title, resetKey');
		await waitFor(() => consoleError.called);

		expect(list._unmanagedTextIndexCoversSecret).to.equal(true);
		expect(canSearchWithTextIndex(list)).to.equal(false);
		expect(String(consoleWarn.firstCall.args[0])).to.include('falls back to regular expressions');

		const search = async (value: string): Promise<number> => {
			const queries = [addSearchToQuery.call(list, value), getSearchFilters.call(list, value)];
			const counts: number[] = [];
			for (const query of queries) {
				expect(inspect(query, { depth: null })).to.not.include('$text').and.to.not.include('resetKey');
				counts.push((await list.model.find(query).exec()).length);
			}
			expect(counts[1]).to.equal(counts[0]);
			return counts[0] ?? -1;
		};
		// The secret value matches nothing, in full or in part; the non-secret search field still matches.
		expect(await search(secretValue)).to.equal(0);
		expect(await search('resetkey')).to.equal(0);
		expect(await search('hello')).to.equal(1);
		expect(await search('hel')).to.equal(1);

		// Once the index is dropped by hand, the next run clears the flag and `$text` is used again.
		await nativeCollection(collection).dropIndex('my_handmade_text');
		expect(await run(list)).to.equal(undefined);
		expect(list._unmanagedTextIndexCoversSecret).to.equal(false);
		expect(canSearchWithTextIndex(list)).to.equal(true);
		const indexes = await textIndexes(collection);
		expect(indexes.map((index) => index.name)).to.deep.equal([indexNameFor({ title: 'text' })]);
		expect(addSearchToQuery.call(list, secretValue)).to.deep.equal({ $text: { $search: secretValue } });
		expect((await list.model.find(addSearchToQuery.call(list, secretValue)).exec()).length).to.equal(0);
		expect((await list.model.find(addSearchToQuery.call(list, 'hello')).exec()).length).to.equal(1);
	});

	it('leaves a hand-made index without secret paths in place without the secret warning', async function () {
		const collection = await collectionWithTextIndex({ body: 'text' }, 'my_handmade_text');

		const list = bootList(collection, 'title');

		await waitFor(() => consoleError.called);
		expect((await textIndexes(collection)).map((index) => index.name)).to.deep.equal(['my_handmade_text']);
		sinon.assert.notCalled(consoleWarn);
		expect(list._unmanagedTextIndexCoversSecret).to.equal(false);
		expect(canSearchWithTextIndex(list)).to.equal(true);
	});

	it('drops a stale generated index that blocks a text index declared on the schema', async function () {
		const stale = { title: 'text', resetKey: 'text' } as const;
		const collection = await collectionWithTextIndex(stale, indexNameFor(stale));

		bootList(collection, 'title, resetKey', (list) => list.schema.index({ body: 'text' }, { name: 'declared_text' }));

		await waitFor(async () => (await textIndexes(collection)).some((index) => index.name === 'declared_text'));
		const indexes = await textIndexes(collection);
		expect(indexes.map((index) => index.name)).to.deep.equal(['declared_text']);
		expect(indexes[0]?.weights).to.deep.equal({ body: 1 });
		sinon.assert.notCalled(consoleWarn);
	});
});
