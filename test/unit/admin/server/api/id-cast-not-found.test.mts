import { expect } from 'chai';
import mongoose from 'mongoose';
import sinon from 'sinon';
import type { Request, Response } from 'express';
import type { KeystoneList } from 'keystone';
import itemGet from 'keystone/admin/server/api/item/get';
import itemSortOrder from 'keystone/admin/server/api/item/sortOrder';
import itemUpdate from 'keystone/admin/server/api/item/update';
import listDelete from 'keystone/admin/server/api/list/delete';
import listUpdate from 'keystone/admin/server/api/list/update';
import apiForGet from 'keystone/lib/list/apiForGet';

// An id that cannot be cast to the
// list's `_id` type used to reject the query with a CastError and answer 500.
// The model doubles carry a real Mongoose schema (so the `_id` schema type is
// the real one) and stubbed query methods, so no database is involved.

type IdModel = { modelName: string; schema: unknown };

type IdKind = {
	name: string;
	model: IdModel;
	/** A URL id that cannot be cast; `undefined` when every string casts (String ids). */
	uncastable?: string;
	/** A well-formed id that matches no document. */
	missing: string;
};

const kinds: IdKind[] = [
	{
		name: 'ObjectId',
		model: { modelName: 'IdCastUnitObjectId', schema: new mongoose.Schema({ title: String }) as unknown },
		uncastable: 'not-an-objectid',
		missing: '507f1f77bcf86cd799439011',
	},
	{
		name: 'Number',
		model: { modelName: 'IdCastUnitNumber', schema: new mongoose.Schema({ _id: Number, title: String }) as unknown },
		uncastable: 'not-a-number',
		missing: '42',
	},
	{
		name: 'String',
		model: { modelName: 'IdCastUnitString', schema: new mongoose.Schema({ _id: String, title: String }) as unknown },
		missing: 'not-an-objectid',
	},
];

type Sent = { status: number; body: unknown };

/** A response double that records the status and JSON body, including `apiError` calls. */
function createResponse() {
	const sent: Sent[] = [];
	let status = 200;
	const res = {
		sent,
		status(code: number) { status = code; return res; },
		json(body: unknown) { sent.push({ status, body: JSON.parse(JSON.stringify(body)) as unknown }); return res; },
		apiError: sinon.spy(),
		logError: sinon.spy(),
	};
	return res;
}

function createKeystone() {
	return {
		get: sinon.stub().returns(undefined),
		security: { csrf: { validate: sinon.stub().returns(true) } },
	};
}

/**
 * A list double whose model has the real `_id` schema type and stubbed query
 * methods: `findById` and `find` resolve "no document".
 */
function createList(source: IdModel) {
	const findById = sinon.stub().returns({
		exec: () => Promise.resolve(null),
		populate: () => undefined,
		where: () => undefined,
	});
	const find = sinon.stub().returns({ exec: () => Promise.resolve([]) });
	const reorderItems = sinon.stub();
	const list = {
		key: source.modelName,
		fields: {},
		relationshipFields: [],
		model: { modelName: source.modelName, schema: source.schema, findById, find, reorderItems },
		get: sinon.stub().returns(undefined),
		getData: sinon.stub(),
		updateItem: sinon.stub(),
	};
	return { list, findById, find, reorderItems };
}

async function flush(): Promise<void> {
	await new Promise<void>((resolve) => { setImmediate(resolve); });
	await new Promise<void>((resolve) => { setImmediate(resolve); });
}

function call(handler: (req: Request, res: Response) => void, req: Record<string, unknown>, res: unknown): void {
	handler({ keystone: createKeystone(), query: {}, body: {}, params: {}, ...req } as unknown as Request, res as Response);
}

describe('admin API: ids that cannot be cast to the list _id type', function () {
	for (const kind of kinds) {
		describe(kind.name + ' _id list', function () {
			const uncastable = kind.uncastable;

			if (uncastable !== undefined) {
				it('GET item answers 404 without querying', async function () {
					const { list, findById } = createList(kind.model);
					const res = createResponse();
					call(itemGet, { list, params: { id: uncastable } }, res);
					await flush();

					expect(res.sent).to.deep.equal([{ status: 404, body: { err: 'not found', id: uncastable } }]);
					sinon.assert.notCalled(findById);
					sinon.assert.notCalled(res.apiError);
				});

				it('POST item (update) answers 404 without querying or updating', async function () {
					const { list, findById } = createList(kind.model);
					const res = createResponse();
					call(itemUpdate, { list, params: { id: uncastable }, body: { title: 'x' } }, res);
					await flush();

					expect(res.sent).to.deep.equal([{ status: 404, body: { error: 'not found', id: uncastable } }]);
					sinon.assert.notCalled(findById);
					sinon.assert.notCalled(list.updateItem);
					sinon.assert.notCalled(res.apiError);
				});

				it('POST item sortOrder answers 404 without reordering', async function () {
					const { list, reorderItems } = createList(kind.model);
					const res = createResponse();
					call(itemSortOrder, { list, params: { id: uncastable, sortOrder: '1', newOrder: '2' } }, res);
					await flush();

					expect(res.sent).to.deep.equal([{ status: 404, body: { error: 'not found', id: uncastable } }]);
					sinon.assert.notCalled(reorderItems);
				});

				it('POST item delete reports nothing deleted, like a missing id', async function () {
					const { list, find } = createList(kind.model);
					const res = createResponse();
					call(listDelete, { list, params: { id: uncastable } }, res);
					await flush();

					expect(res.sent).to.deep.equal([{ status: 200, body: { success: true, ids: [], count: 0 } }]);
					sinon.assert.calledOnce(find);
					sinon.assert.calledWithExactly(find, { _id: { $in: [] } });
					sinon.assert.notCalled(res.apiError);
				});

				it('bulk delete drops the uncastable ids and keeps the others', async function () {
					const { list, find } = createList(kind.model);
					const res = createResponse();
					call(listDelete, { list, body: { ids: [uncastable, kind.missing] } }, res);
					await flush();

					sinon.assert.calledOnce(find);
					sinon.assert.calledWithExactly(find, { _id: { $in: [kind.missing] } });
					expect(res.sent).to.deep.equal([{ status: 200, body: { success: true, ids: [], count: 0 } }]);
				});

				it('bulk update answers 404 for the item without querying', async function () {
					const { list, findById } = createList(kind.model);
					const res = createResponse();
					call(listUpdate, { list, body: { items: [{ id: uncastable, title: 'x' }] } }, res);
					await flush();

					expect(res.sent).to.deep.equal([{ status: 404, body: { id: uncastable } }]);
					sinon.assert.notCalled(findById);
					sinon.assert.notCalled(res.apiError);
				});

				it('List.apiForGet answers 404 without querying', async function () {
					const { list, findById } = createList(kind.model);
					const res = createResponse();
					apiForGet.call(list as unknown as KeystoneList, {})({ params: { id: uncastable } } as unknown as Request, res as unknown as Response, () => undefined);
					await flush();

					expect(res.sent).to.deep.equal([{ status: 404, body: { err: 'not found', id: uncastable } }]);
					sinon.assert.notCalled(findById);
				});
			}

			it('bulk update answers 404 for a query operator in place of an id', async function () {
				const { list, findById } = createList(kind.model);
				const res = createResponse();
				call(listUpdate, { list, body: { items: [{ id: { $ne: null }, title: 'x' }] } }, res);
				await flush();

				expect(res.sent).to.deep.equal([{ status: 404, body: { id: { $ne: null } } }]);
				sinon.assert.notCalled(findById);
				sinon.assert.notCalled(list.updateItem);
			});

			it('a well-formed id that matches nothing still queries and answers 404', async function () {
				const { list, findById } = createList(kind.model);

				const getRes = createResponse();
				call(itemGet, { list, params: { id: kind.missing } }, getRes);
				const updateRes = createResponse();
				call(itemUpdate, { list, params: { id: kind.missing } }, updateRes);
				const bulkRes = createResponse();
				call(listUpdate, { list, body: { items: [{ id: kind.missing }] } }, bulkRes);
				const appRes = createResponse();
				apiForGet.call(list as unknown as KeystoneList, {})({ params: { id: kind.missing } } as unknown as Request, appRes as unknown as Response, () => undefined);
				await flush();

				expect(getRes.sent).to.deep.equal([{ status: 404, body: { err: 'not found', id: kind.missing } }]);
				expect(updateRes.sent).to.deep.equal([{ status: 404, body: { error: 'not found', id: kind.missing } }]);
				expect(bulkRes.sent).to.deep.equal([{ status: 404, body: { id: kind.missing } }]);
				expect(appRes.sent).to.deep.equal([{ status: 404, body: { err: 'not found', id: kind.missing } }]);
				expect(findById.callCount).to.equal(4);
				sinon.assert.alwaysCalledWithExactly(findById, kind.missing);
			});

			it('any other query failure is still a database error', async function () {
				const { list, findById } = createList(kind.model);
				const failure = new Error('connection lost');
				findById.returns({
					exec: () => Promise.reject(failure),
					populate: () => undefined,
					where: () => undefined,
				});
				const consoleError = sinon.stub(console, 'error');

				const getRes = createResponse();
				call(itemGet, { list, params: { id: kind.missing } }, getRes);
				const updateRes = createResponse();
				call(itemUpdate, { list, params: { id: kind.missing } }, updateRes);
				const bulkRes = createResponse();
				call(listUpdate, { list, body: { items: [{ id: kind.missing }] } }, bulkRes);
				const appRes = createResponse();
				apiForGet.call(list as unknown as KeystoneList, {})({ params: { id: kind.missing } } as unknown as Request, appRes as unknown as Response, () => undefined);
				await flush();
				consoleError.restore();

				sinon.assert.calledOnce(getRes.apiError);
				sinon.assert.calledWithExactly(getRes.apiError, 'database error', failure);
				sinon.assert.calledOnce(updateRes.apiError);
				sinon.assert.calledWithExactly(updateRes.apiError, 'database error', failure);
				sinon.assert.calledOnce(bulkRes.apiError);
				sinon.assert.calledWithExactly(bulkRes.apiError, 'database error', failure);
				expect(appRes.sent).to.have.length(1);
				expect(appRes.sent[0]?.status).to.equal(500);
				expect(getRes.sent.concat(updateRes.sent, bulkRes.sent)).to.deep.equal([]);
			});
		});
	}
});
