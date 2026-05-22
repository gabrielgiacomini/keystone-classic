import { expect } from 'chai';
import sinon from 'sinon';
import listDownload from 'keystone/admin/server/api/list/download';

interface MockResponse {
	attachment: sinon.SinonSpy;
	end: sinon.SinonSpy;
	json: sinon.SinonSpy;
	setHeader: sinon.SinonSpy;
	status: sinon.SinonStub;
}

interface MockQuery {
	exec: sinon.SinonStub;
	limit: sinon.SinonStub;
	populate: sinon.SinonStub;
	sort: sinon.SinonStub;
}

function createResponse(): MockResponse {
	const res: MockResponse = {
		attachment: sinon.spy(),
		end: sinon.spy(),
		json: sinon.spy(),
		setHeader: sinon.spy(),
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
	query.sort = sinon.stub().returns(query);
	return query;
}

function createKeystone(overrides: Record<string, unknown> = {}) {
	return {
		get: sinon.stub().callsFake(function (key: string) {
			if (key in overrides) return overrides[key];
			return undefined;
		}),
	};
}

async function flushDownload(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
}

describe('admin list download API', function () {
	it('exports filtered list results as JSON data', async function () {
		const item = { id: 'post-1' };
		const query = createQuery([item]);
		const list = {
			addFiltersToQuery: sinon.stub().returns({ state: 'published' }),
			addSearchToQuery: sinon.stub().returns({ title: /launch/iu }),
			expandSort: sinon.stub().returns({ string: '-publishedAt' }),
			fields: {
				author: { type: 'relationship', path: 'author' },
			},
			getCSVData: sinon.stub(),
			getData: sinon.stub().returns({ id: 'post-1', title: 'Launch' }),
			model: {
				find: sinon.stub().returns(query),
			},
			path: 'posts',
			relationshipFields: [{ path: 'tags' }],
		};
		const req = {
			keystone: createKeystone(),
			list,
			params: { format: 'export.json' },
			query: {
				expandRelationshipFields: 'true',
				filters: JSON.stringify({ state: 'published' }),
				populate: 'author',
				search: 'launch',
				select: 'title,author',
				sort: '-publishedAt',
			},
			user: { id: 'user-1' },
		};
		const res = createResponse();
		const next = sinon.spy();

		listDownload(
			req as unknown as Parameters<typeof listDownload>[0],
			res as unknown as Parameters<typeof listDownload>[1],
			next,
		);
		await flushDownload();

		const where = list.model.find.firstCall.args[0] as Record<string, unknown>;
		expect(where.state).to.equal('published');
		expect(where.title).to.be.instanceOf(RegExp);
		sinon.assert.calledWithExactly(query.populate.firstCall, 'author');
		sinon.assert.calledWithExactly(query.populate.secondCall, 'tags');
		sinon.assert.calledWithExactly(query.sort, '-publishedAt');
		sinon.assert.calledWithExactly(list.getData, item, 'title,author', 'true');
		sinon.assert.calledWithExactly(res.json, [{ id: 'post-1', title: 'Launch' }]);
		sinon.assert.notCalled(list.getCSVData);
		sinon.assert.notCalled(next);
	});

	it('exports CSV data with the configured delimiter and unioned row fields', async function () {
		const first = { id: 'post-1' };
		const second = { id: 'post-2' };
		const query = createQuery([first, second]);
		const list = {
			addFiltersToQuery: sinon.stub().returns({}),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: 'title' }),
			fields: {},
			getCSVData: sinon.stub(),
			getData: sinon.stub(),
			model: {
				find: sinon.stub().returns(query),
			},
			path: 'posts',
			relationshipFields: [],
		};
		list.getCSVData.onFirstCall().returns({ title: 'Launch', owner: 'Ada' });
		list.getCSVData.onSecondCall().returns({ title: 'Second' });
		const req = {
			keystone: createKeystone({ 'csv field delimiter': ';' }),
			list,
			params: { format: 'export.csv' },
			query: {
				expandRelationshipFields: 'true',
				select: 'title,owner',
				sort: 'title',
			},
			user: { id: 'user-1' },
		};
		const res = createResponse();
		const next = sinon.spy();

		listDownload(
			req as unknown as Parameters<typeof listDownload>[0],
			res as unknown as Parameters<typeof listDownload>[1],
			next,
		);
		await flushDownload();

		sinon.assert.calledWithExactly(query.sort, 'title');
		sinon.assert.calledWithExactly(list.getCSVData.firstCall, first, {
			expandRelationshipFields: 'true',
			fields: 'title,owner',
			user: req.user,
		});
		sinon.assert.calledWithExactly(list.getCSVData.secondCall, second, {
			expandRelationshipFields: 'true',
			fields: 'title,owner',
			user: req.user,
		});
		expect(res.attachment.firstCall.args[0]).to.match(/^posts-\d{8}-\d{6}\.csv$/u);
		sinon.assert.calledWithExactly(res.setHeader, 'Content-Type', 'application/octet-stream');
		sinon.assert.calledWithExactly(res.end, 'title;owner\r\nLaunch;Ada\r\nSecond;', 'utf-8');
		sinon.assert.notCalled(list.getData);
		sinon.assert.notCalled(next);
	});

	it('rejects invalid populate fields before executing the export query', async function () {
		const query = createQuery();
		const list = {
			addFiltersToQuery: sinon.stub().returns({}),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {
				author: { type: 'relationship', path: 'author' },
			},
			getCSVData: sinon.stub(),
			getData: sinon.stub(),
			model: {
				find: sinon.stub().returns(query),
			},
			path: 'posts',
			relationshipFields: [],
		};
		const req = {
			keystone: createKeystone(),
			list,
			params: { format: 'export.json' },
			query: { populate: 'author,comments' },
			user: {},
		};
		const res = createResponse();
		const next = sinon.spy();

		listDownload(
			req as unknown as Parameters<typeof listDownload>[0],
			res as unknown as Parameters<typeof listDownload>[1],
			next,
		);
		await flushDownload();

		sinon.assert.calledWithExactly(res.status, 400);
		sinon.assert.calledWithExactly(res.json, { error: 'invalid populate fields', fields: ['comments'] });
		sinon.assert.notCalled(query.exec);
		sinon.assert.notCalled(next);
	});

	it('passes database export failures to the next error handler', async function () {
		const err = new Error('find failed');
		const query = createQuery([], err);
		const list = {
			addFiltersToQuery: sinon.stub().returns({}),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: '' }),
			fields: {},
			getCSVData: sinon.stub(),
			getData: sinon.stub(),
			model: {
				find: sinon.stub().returns(query),
			},
			path: 'posts',
			relationshipFields: [],
		};
		const req = {
			keystone: createKeystone(),
			list,
			params: { format: 'export.json' },
			query: {},
			user: {},
		};
		const res = createResponse();
		const next = sinon.spy();

		listDownload(
			req as unknown as Parameters<typeof listDownload>[0],
			res as unknown as Parameters<typeof listDownload>[1],
			next,
		);
		await flushDownload();

		sinon.assert.calledWithExactly(next, err);
		sinon.assert.notCalled(res.json);
	});
});
