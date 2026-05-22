import { expect } from 'chai';
import sinon from 'sinon';
import listGet from 'keystone/admin/server/api/list/get';

interface MockResponse {
	apiError: sinon.SinonSpy;
	json: sinon.SinonSpy;
	logError: sinon.SinonSpy;
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
		logError: sinon.spy(),
		status: sinon.stub(),
	};
	res.status.returns(res);
	return res;
}

function createQuery(results: unknown[] = [], err?: Error): MockQuery {
	const query = {} as MockQuery;
	query.exec = err ? sinon.stub().rejects(err) : sinon.stub().resolves(results);
	query.limit = sinon.stub().returns(query);
	query.populate = sinon.stub().returns(query);
	query.skip = sinon.stub().returns(query);
	query.sort = sinon.stub().returns(query);
	return query;
}

function createCountQuery(count: number, err?: Error) {
	return {
		exec: err ? sinon.stub().rejects(err) : sinon.stub().resolves(count),
	};
}

describe('admin list get API', function () {
	it('returns filtered, searched, sorted, populated, and paginated list data', async function () {
		const item = { id: 'post-1' };
		const findQuery = createQuery([item]);
		const countQuery = createCountQuery(7);
		const list = {
			addFiltersToQuery: sinon.stub().returns({ state: 'draft' }),
			addSearchToQuery: sinon.stub().returns({ title: /launch/i }),
			expandSort: sinon.stub().returns({ string: '-publishedAt' }),
			fields: {
				author: { type: 'relationship', path: 'author' },
			},
			getData: sinon.stub().returns({ id: 'post-1', title: 'Launch' }),
			model: {
				countDocuments: sinon.stub().returns(countQuery),
				find: sinon.stub().returns(findQuery),
			},
			relationshipFields: [],
		};
		const req = {
			list,
			query: {
				fields: 'title,author',
				filters: JSON.stringify({ state: 'draft' }),
				limit: '2',
				populate: 'author',
				search: 'launch',
				skip: '1',
				sort: '-publishedAt',
			},
		};
		const res = createResponse();

		await listGet(req as unknown as import('express').Request, res as unknown as import('express').Response);

		const where = list.model.find.firstCall.args[0] as Record<string, unknown>;
		expect(where.state).to.equal('draft');
		expect(where.title).to.be.instanceOf(RegExp);
		expect(list.model.countDocuments.firstCall.args[0]).to.equal(where);
		sinon.assert.calledWithExactly(findQuery.populate, 'author');
		sinon.assert.calledWithExactly(findQuery.limit, 2);
		sinon.assert.calledWithExactly(findQuery.skip, 1);
		sinon.assert.calledWithExactly(findQuery.sort, '-publishedAt');
		sinon.assert.calledWithExactly(list.getData, item, ['title', 'author'], undefined);
		sinon.assert.calledWithExactly(res.json, {
			results: [{ id: 'post-1', title: 'Launch' }],
			count: 7,
		});
	});

	it('rejects invalid populate fields before executing database reads', async function () {
		const findQuery = createQuery();
		const countQuery = createCountQuery(0);
		const list = {
			addFiltersToQuery: sinon.stub().returns({}),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {
				author: { type: 'relationship', path: 'author' },
			},
			getData: sinon.stub(),
			model: {
				countDocuments: sinon.stub().returns(countQuery),
				find: sinon.stub().returns(findQuery),
			},
			relationshipFields: [],
		};
		const req = {
			list,
			query: { populate: 'author,comments' },
		};
		const res = createResponse();

		await listGet(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 400);
		sinon.assert.calledWithExactly(res.json, { error: 'invalid populate fields', fields: ['comments'] });
		sinon.assert.notCalled(countQuery.exec);
		sinon.assert.notCalled(findQuery.exec);
	});

	it('can return count-only responses without executing the find query', async function () {
		const findQuery = createQuery([{ id: 'unused' }]);
		const countQuery = createCountQuery(3);
		const list = {
			addFiltersToQuery: sinon.stub().returns({ state: 'published' }),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {},
			getData: sinon.stub(),
			model: {
				countDocuments: sinon.stub().returns(countQuery),
				find: sinon.stub().returns(findQuery),
			},
			relationshipFields: [],
		};
		const req = {
			list,
			query: {
				filters: { state: 'published' },
				results: 'false',
			},
		};
		const res = createResponse();

		await listGet(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.notCalled(findQuery.limit);
		sinon.assert.notCalled(findQuery.skip);
		sinon.assert.notCalled(findQuery.exec);
		sinon.assert.calledWithExactly(res.json, {
			results: undefined,
			count: 3,
		});
	});

	it('rejects invalid fields query shapes before executing database reads', async function () {
		const findQuery = createQuery();
		const countQuery = createCountQuery(0);
		const list = {
			addFiltersToQuery: sinon.stub().returns({}),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {},
			getData: sinon.stub(),
			model: {
				countDocuments: sinon.stub().returns(countQuery),
				find: sinon.stub().returns(findQuery),
			},
			relationshipFields: [],
		};
		const req = {
			list,
			query: {
				fields: { title: true },
			},
		};
		const res = createResponse();

		await listGet(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 401);
		sinon.assert.calledWithExactly(res.json, { error: 'fields must be undefined, a string, or an array' });
		sinon.assert.notCalled(list.model.find);
		sinon.assert.notCalled(countQuery.exec);
		sinon.assert.notCalled(findQuery.exec);
	});

	it('ignores malformed filter JSON while still applying search filters', async function () {
		const item = { id: 'post-1' };
		const findQuery = createQuery([item]);
		const countQuery = createCountQuery(1);
		const list = {
			addFiltersToQuery: sinon.stub().returns({ state: 'draft' }),
			addSearchToQuery: sinon.stub().returns({ title: /launch/i }),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {},
			getData: sinon.stub().returns({ id: 'post-1' }),
			model: {
				countDocuments: sinon.stub().returns(countQuery),
				find: sinon.stub().returns(findQuery),
			},
			relationshipFields: [],
		};
		const req = {
			list,
			query: {
				filters: '{"state"',
				search: 'launch',
			},
		};
		const res = createResponse();

		await listGet(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.notCalled(list.addFiltersToQuery);
		sinon.assert.calledWithExactly(list.addSearchToQuery, 'launch');
		const where = list.model.find.firstCall.args[0] as Record<string, unknown>;
		expect(where.title).to.be.instanceOf(RegExp);
		sinon.assert.calledWithExactly(res.json, {
			results: [{ id: 'post-1' }],
			count: 1,
		});
	});

	it('skips countDocuments for proximity filters that MongoDB cannot count', async function () {
		const item = { id: 'nearby-1' };
		const findQuery = createQuery([item]);
		const countQuery = createCountQuery(0);
		const list = {
			addFiltersToQuery: sinon.stub().returns({ location: { $near: [100, 50] } }),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {},
			getData: sinon.stub().returns({ id: 'nearby-1' }),
			model: {
				countDocuments: sinon.stub().returns(countQuery),
				find: sinon.stub().returns(findQuery),
			},
			relationshipFields: [],
		};
		const req = {
			list,
			query: {
				filters: { location: 'nearby' },
			},
		};
		const res = createResponse();

		await listGet(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.notCalled(list.model.countDocuments);
		sinon.assert.calledOnce(findQuery.exec);
		sinon.assert.calledWithExactly(res.json, {
			results: [{ id: 'nearby-1' }],
			count: undefined,
		});
	});

	it('routes count database failures through the admin API error helper', async function () {
		const dbErr = new Error('count failed');
		const findQuery = createQuery([{ id: 'unused' }]);
		const countQuery = createCountQuery(0, dbErr);
		const list = {
			addFiltersToQuery: sinon.stub().returns({}),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {},
			getData: sinon.stub(),
			model: {
				countDocuments: sinon.stub().returns(countQuery),
				find: sinon.stub().returns(findQuery),
			},
			relationshipFields: [],
		};
		const req = {
			list,
			query: {},
		};
		const res = createResponse();

		await listGet(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.logError, 'admin/server/api/list/get', 'database error finding items', dbErr);
		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(findQuery.exec);
		sinon.assert.notCalled(res.json);
	});

	it('routes find database failures through the admin API error helper', async function () {
		const dbErr = new Error('find failed');
		const findQuery = createQuery([], dbErr);
		const countQuery = createCountQuery(1);
		const list = {
			addFiltersToQuery: sinon.stub().returns({}),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {},
			getData: sinon.stub(),
			model: {
				countDocuments: sinon.stub().returns(countQuery),
				find: sinon.stub().returns(findQuery),
			},
			relationshipFields: [],
		};
		const req = {
			list,
			query: {},
		};
		const res = createResponse();

		await listGet(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.logError, 'admin/server/api/list/get', 'database error finding items', dbErr);
		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(list.getData);
		sinon.assert.notCalled(res.json);
	});
});
