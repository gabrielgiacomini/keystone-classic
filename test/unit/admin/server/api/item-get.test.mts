import { expect } from 'chai';
import sinon from 'sinon';
import itemGet from 'keystone/admin/server/api/item/get';

interface MockResponse {
	apiError: sinon.SinonSpy;
	json: sinon.SinonSpy;
	logError: sinon.SinonSpy;
	status: sinon.SinonStub;
}

interface MockQuery {
	exec: sinon.SinonStub;
	populate: sinon.SinonStub;
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

function createQuery(result: unknown): MockQuery {
	return {
		exec: sinon.stub().resolves(result),
		populate: sinon.stub().returnsThis(),
	};
}

async function flushPromises(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
}

function createKeystone(adminLegacyPath?: string) {
	return {
		get: sinon.stub().callsFake((key: string) => {
			if (key === 'admin legacy path') return adminLegacyPath;
			return undefined;
		}),
	};
}

describe('admin item get API', function () {
	it('returns selected item data and expands relationship fields', async function () {
		const item = { id: 'post-1' };
		const query = createQuery(item);
		const list = {
			fields: {},
			get: sinon.stub().returns(undefined),
			getData: sinon.stub().returns({ id: 'post-1', title: 'Launch' }),
			model: {
				findById: sinon.stub().returns(query),
			},
			relationshipFields: [{ path: 'author' }],
		};
		const req = {
			keystone: createKeystone(),
			list,
			params: { id: 'post-1' },
			query: {
				expandRelationshipFields: 'true',
				fields: 'title,author',
			},
		};
		const res = createResponse();

		itemGet(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(list.model.findById, 'post-1');
		sinon.assert.calledWithExactly(query.populate, 'author');
		sinon.assert.calledWithExactly(list.getData, item, ['title', 'author'], 'true');
		sinon.assert.calledWithExactly(res.json, { id: 'post-1', title: 'Launch', drilldown: undefined });
	});

	it('returns 404 when the item does not exist', async function () {
		const query = createQuery(null);
		const list = {
			fields: {},
			get: sinon.stub().returns(undefined),
			getData: sinon.stub(),
			model: {
				findById: sinon.stub().returns(query),
			},
			relationshipFields: [],
		};
		const req = {
			keystone: createKeystone(),
			list,
			params: { id: 'missing-id' },
			query: {},
		};
		const res = createResponse();

		itemGet(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.status, 404);
		sinon.assert.calledWithExactly(res.json, { err: 'not found', id: 'missing-id' });
		sinon.assert.notCalled(list.getData);
	});

	it('uses the configured legacy admin path in relationship drilldown hrefs', async function () {
		const item = {
			id: 'post-1',
			get: sinon.stub().withArgs('author').returns('author-1'),
		};
		const author = { id: 'author-1' };
		const query = createQuery(item);
		const refList = {
			getDocumentName: sinon.stub().returns('Ada Lovelace'),
			getOptions: sinon.stub().returns({ label: 'Authors' }),
			model: {
				findById: sinon.stub().withArgs('author-1').returns(createQuery(author)),
			},
			path: 'authors',
		};
		const list = {
			fields: {
				author: {
					many: false,
					path: 'author',
					refList,
					type: 'relationship',
				},
			},
			get: sinon.stub().withArgs('drilldown').returns('author'),
			getData: sinon.stub().returns({ id: 'post-1' }),
			model: {
				findById: sinon.stub().returns(query),
			},
			relationshipFields: [],
			key: 'Post',
		};
		const req = {
			keystone: createKeystone('/cms'),
			list,
			params: { id: 'post-1' },
			query: { drilldown: 'true' },
		};
		const res = createResponse();

		itemGet(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		const payload = res.json.firstCall.args[0] as {
			drilldown: { items: Array<{ items: Array<{ href: string; label: string }> }> };
		};
		expect(payload.drilldown.items[0]?.items[0]).to.deep.equal({
			label: 'Ada Lovelace',
			href: '/cms/authors/author-1',
		});
	});

	it('routes database failures through the admin API error helper', async function () {
		const dbErr = new Error('driver failed');
		const query = {
			exec: sinon.stub().rejects(dbErr),
			populate: sinon.stub().returnsThis(),
		};
		const list = {
			fields: {},
			get: sinon.stub().returns(undefined),
			getData: sinon.stub(),
			model: {
				findById: sinon.stub().returns(query),
			},
			relationshipFields: [],
		};
		const req = {
			keystone: createKeystone(),
			list,
			params: { id: 'post-1' },
			query: {},
		};
		const res = createResponse();

		itemGet(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(
			res.logError,
			'admin/server/api/item/get',
			'database error finding item',
			dbErr,
		);
		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(res.json);
	});
});
