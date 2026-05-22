import { expect } from 'chai';
import sinon from 'sinon';
import itemSortOrder from 'keystone/admin/server/api/item/sortOrder';

interface MockResponse {
	apiError: sinon.SinonSpy;
	json: sinon.SinonSpy;
	status: sinon.SinonStub;
}

interface MockQuery {
	exec: sinon.SinonStub;
	limit: sinon.SinonStub;
	populate: sinon.SinonStub;
	skip: sinon.SinonStub;
	sort: sinon.SinonStub;
}

function createResponse(): MockResponse {
	const res: MockResponse = {
		apiError: sinon.spy(),
		json: sinon.spy(),
		status: sinon.stub(),
	};
	res.status.returns(res);
	return res;
}

function createQuery(results: unknown[] = []): MockQuery {
	const query = {} as MockQuery;
	query.exec = sinon.stub().resolves(results);
	query.limit = sinon.stub().returns(query);
	query.populate = sinon.stub().returns(query);
	query.skip = sinon.stub().returns(query);
	query.sort = sinon.stub().returns(query);
	return query;
}

function createSortableList(reorderErr?: Error) {
	const findQuery = createQuery();
	const reorderItems = sinon.stub().callsFake((
		_id: string,
		_sortOrder: string,
		_newOrder: string,
		callback: (err?: Error) => void,
	) => {
		callback(reorderErr);
	});
	const list = {
		key: 'Post',
		addFiltersToQuery: sinon.stub().returns({}),
		addSearchToQuery: sinon.stub().returns({}),
		expandSort: sinon.stub().returns({ string: '' }),
		fields: {},
		getData: sinon.stub(),
		model: {
			countDocuments: sinon.stub().returns({ exec: sinon.stub().resolves(0) }),
			find: sinon.stub().returns(findQuery),
			reorderItems,
		},
		relationshipFields: [],
	};
	return { findQuery, list, reorderItems };
}

function createRequest(list: unknown, csrfValid = true) {
	return {
		keystone: {
			security: {
				csrf: {
					validate: sinon.stub().returns(csrfValid),
				},
			},
		},
		list,
		params: {
			id: 'post-1',
			sortOrder: '0',
			newOrder: '2',
		},
		query: {
			count: 'false',
			results: 'false',
		},
	};
}

describe('admin item sort-order API', function () {
	it('returns a stable error when list context is missing', function () {
		const req = createRequest(undefined);
		const res = createResponse();

		itemSortOrder(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'list context missing' });
		sinon.assert.notCalled(res.apiError);
	});

	it('rejects invalid CSRF before reordering', function () {
		const { list, reorderItems } = createSortableList();
		const req = createRequest(list, false);
		const res = createResponse();
		const log = sinon.stub(console, 'log');

		try {
			itemSortOrder(req as unknown as import('express').Request, res as unknown as import('express').Response);
		} finally {
			log.restore();
		}

		sinon.assert.calledWithExactly(res.apiError, 403, 'invalid csrf');
		sinon.assert.notCalled(reorderItems);
	});

	it('maps reorder database failures to the admin database API error helper', function () {
		const dbErr = new Error('reorder failed');
		const { list, reorderItems } = createSortableList(dbErr);
		const req = createRequest(list);
		const res = createResponse();

		itemSortOrder(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(reorderItems, 'post-1', '0', '2', sinon.match.func);
		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(res.json);
	});

	it('reorders then refreshes the list response', async function () {
		const { findQuery, list, reorderItems } = createSortableList();
		const req = createRequest(list);
		const res = createResponse();

		itemSortOrder(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await Promise.resolve();

		sinon.assert.calledWithExactly(reorderItems, 'post-1', '0', '2', sinon.match.func);
		sinon.assert.calledOnce(list.model.find);
		sinon.assert.notCalled(findQuery.exec);
		sinon.assert.calledWithExactly(res.json, {
			results: undefined,
			count: undefined,
		});
		sinon.assert.notCalled(res.apiError);
		expect(list.model.find.firstCall.args[0]).to.deep.equal({});
	});
});
