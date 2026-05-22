import { expect } from 'chai';
import sortable from 'keystone/lib/schemaPlugins/sortable';
import type { KeystoneList } from 'keystone';

/** Minimal shape of the mock list returned by createSortableList. */
interface SortableMockList {
	model: {
		bulkWrite(ops: unknown, bulkOptions: unknown): Promise<unknown>;
		findOne(filter: unknown): { exec(): Promise<{ _id: string; sortOrder: number }> };
	};
	schema: {
		statics: Record<string, unknown>;
		pre(): void;
	};
	add(fields: unknown): void;
	get(): boolean;
}

function createSortableList(options: { bulkError?: Error } = {}) {
	const doc = { _id: 'item-1', sortOrder: 5 };
	const calls: {
		addedFields?: unknown;
		bulkOps?: unknown;
		bulkOptions?: unknown;
		findOneFilter?: unknown;
		findOneCalled: boolean;
	} = { findOneCalled: false };
	const list: SortableMockList = {
		model: {
			bulkWrite(ops: unknown, bulkOptions: unknown) {
				calls.bulkOps = ops;
				calls.bulkOptions = bulkOptions;
				return options.bulkError ? Promise.reject(options.bulkError) : Promise.resolve({});
			},
			findOne(filter: unknown) {
				calls.findOneCalled = true;
				calls.findOneFilter = filter;
				return {
					exec() {
						return Promise.resolve(doc);
					},
				};
			},
		},
		schema: {
			statics: {},
			pre() {},
		},
		add(fields: unknown) {
			calls.addedFields = fields;
		},
		get() {
			return false;
		},
	};

	sortable.call(list as unknown as KeystoneList);
	return { calls, list, doc };
}

function reorder(list: SortableMockList, id: string, prevOrder: number, newOrder: number) {
	return new Promise(function (resolve, reject) {
		(list.schema.statics['reorderItems'] as (id: string, prevOrder: number, newOrder: number, cb: (err: Error | null, doc: unknown) => void) => void)(id, prevOrder, newOrder, function (err: Error | null, doc: unknown) {
			if (err) reject(err);
			else resolve(doc);
		});
	});
}

describe('sortable schema plugin', function () {
	it('uses one ordered bulkWrite for reorder mutations', async function () {
		const { calls, list, doc } = createSortableList();

		const result = await reorder(list, 'item-1', 2, 5);

		expect(result).to.equal(doc);
		expect(calls.addedFields).to.eql({ sortOrder: { type: Number, index: true, hidden: true } });
		expect(calls.bulkOps).to.eql([
			{
				updateMany: {
					filter: { sortOrder: { $gte: 3, $lte: 5 } },
					update: { $inc: { sortOrder: -1 } },
				},
			},
			{
				updateOne: {
					filter: { _id: 'item-1' },
					update: { $set: { sortOrder: 5 } },
				},
			},
		]);
		expect(calls.bulkOptions).to.eql({ ordered: true });
		expect(calls.findOneFilter).to.eql({ _id: 'item-1' });
	});

	it('builds the correct reorder range when moving an item upward', async function () {
		const { calls, list } = createSortableList();

		await reorder(list, 'item-1', 5, 2);

		expect(calls.bulkOps).to.eql([
			{
				updateMany: {
					filter: { sortOrder: { $gte: 2, $lte: 4 } },
					update: { $inc: { sortOrder: 1 } },
				},
			},
			{
				updateOne: {
					filter: { _id: 'item-1' },
					update: { $set: { sortOrder: 2 } },
				},
			},
		]);
	});

	it('does not read the moved item when the bulk reorder fails', async function () {
		const bulkError = new Error('bulk failed');
		const { calls, list } = createSortableList({ bulkError });
		const originalLog = console.log;
		console.log = function () {};

		try {
			await reorder(list, 'item-1', 2, 5);
			throw new Error('expected reorder to fail');
		} catch (err) {
			expect(err).to.equal(bulkError);
			expect(calls.findOneCalled).to.equal(false);
		} finally {
			console.log = originalLog;
		}
	});
});
