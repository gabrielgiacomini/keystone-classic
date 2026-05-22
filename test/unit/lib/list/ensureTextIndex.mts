import { expect } from 'chai';
import sinon from 'sinon';
import ensureTextIndex from 'keystone/lib/list/ensureTextIndex';
import type { KeystoneList } from 'keystone/lib/list';

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

function createList(collection: Record<string, unknown>, buildSearchTextIndex = () => textIndex): KeystoneList {
	return {
		key: 'Post',
		model: { collection },
		buildSearchTextIndex,
	} as unknown as KeystoneList;
}

describe('ensureTextIndex', function () {
	it('passes createIndex errors to the callback', function (done) {
		const error = new Error('create failed');
		const collection = {
			getIndexes(callback: (err: Error | null, indexes: Record<string, unknown>) => void) {
				callback(null, {});
			},
			createIndex(index: Record<string, string>, options: { name: string }, callback: (err: Error) => void) {
				expect(index).to.deep.equal(textIndex);
				expect(options.name).to.equal(indexNameFor(textIndex));
				callback(error);
			},
		};

		ensureTextIndex.call(createList(collection), function (err?: Error | null) {
			expect(err).to.equal(error);
			done();
		});
	});

	it('passes getIndexes errors to the callback', function (done) {
		const error = new Error('index list failed');
		const collection = {
			getIndexes(callback: (err: Error) => void) {
				callback(error);
			},
		};

		ensureTextIndex.call(createList(collection), function (err?: Error | null) {
			expect(err).to.equal(error);
			done();
		});
	});

	it('calls back without creating an index when the generated text index already exists', function (done) {
		const createIndex = sinon.spy();
		const collection = {
			getIndexes(callback: (err: Error | null, indexes: Record<string, unknown>) => void) {
				callback(null, {
					[indexNameFor(textIndex)]: [['title', 'text']],
				});
			},
			createIndex,
		};

		ensureTextIndex.call(createList(collection), function (err?: Error | null) {
			expect(err).to.equal(undefined);
			sinon.assert.notCalled(createIndex);
			done();
		});
	});

	it('passes generated-index drop errors to the callback', function (done) {
		const error = new Error('drop failed');
		const createIndex = sinon.spy();
		const collection = {
			getIndexes(callback: (err: Error | null, indexes: Record<string, unknown>) => void) {
				callback(null, {
					keystone_searchFields_textIndex_1: [['body', 'text']],
				});
			},
			dropIndex(name: string, callback: (err: Error) => void) {
				expect(name).to.equal('keystone_searchFields_textIndex_1');
				callback(error);
			},
			createIndex,
		};

		ensureTextIndex.call(createList(collection), function (err?: Error | null) {
			expect(err).to.equal(error);
			sinon.assert.notCalled(createIndex);
			done();
		});
	});
});
