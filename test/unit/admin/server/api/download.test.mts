import { expect } from 'chai';
import sinon from 'sinon';
import download from 'keystone/admin/server/api/download';

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
	for (let i = 0; i < 5; i += 1) {
		await Promise.resolve();
	}
}

describe('admin legacy download API', function () {
	it('exports filtered CSV rows with expanded relationship data and spreadsheet-safe values', async function () {
		const author = { id: 'author-1', name: 'Ada' };
		const tagOne = { id: 'tag-1', name: 'News' };
		const tagTwo = { id: 'tag-2', name: 'Tech' };
		const itemValues: Record<string, unknown> = {
			author,
			published: true,
			slug: 'launch',
			tags: [tagOne, tagTwo],
		};
		const item = {
			id: 'post-1',
			get: sinon.stub().callsFake(function (path: string): unknown {
				return itemValues[path];
			}),
		};
		const query = createQuery([item]);
		const filters = { state: 'published' };
		const queryFilters = { state: 'published', title: /launch/iu };
		const getDocumentName = sinon.stub().callsFake(function (doc: { name: string }) {
			return doc.name;
		});
		const list = {
			fields: {
				title: { type: 'text', path: 'title', format: sinon.stub().returns('=Launch') },
				published: { type: 'boolean', path: 'published', format: sinon.stub() },
				author: {
					type: 'relationship',
					path: 'author',
					refList: { getDocumentName },
					format: sinon.stub().returns('No author'),
				},
				tags: {
					type: 'relationship',
					path: 'tags',
					many: true,
					refList: { getDocumentName },
					format: sinon.stub(),
				},
			},
			get: sinon.stub().callsFake(function (key: string) {
				if (key === 'autokey') return { path: 'slug' };
				return undefined;
			}),
			getSearchFilters: sinon.stub().returns(queryFilters),
			key: 'Post',
			model: {
				find: sinon.stub().returns(query),
			},
			path: 'posts',
			processFilters: sinon.stub().returns(filters),
		};
		const req = {
			keystone: createKeystone({
				'csv expanded': true,
				'csv field delimiter': ';',
			}),
			list,
			query: {
				q: 'state:published',
				search: 'launch',
			},
			user: { id: 'editor-1' },
		};
		const res = createResponse();

		download(req as unknown as Parameters<typeof download>[0], res as unknown as Parameters<typeof download>[1]);
		await flushDownload();

		sinon.assert.calledWithExactly(list.processFilters, 'state:published');
		sinon.assert.calledWithExactly(list.getSearchFilters, 'launch', filters);
		sinon.assert.calledWithExactly(list.model.find, queryFilters);
		sinon.assert.calledWithExactly(query.populate, 'author tags');
		expect(res.attachment.firstCall.args[0]).to.match(/^posts-\d{8}-\d{6}\.csv$/u);
		sinon.assert.calledWithExactly(res.setHeader, 'Content-Type', 'application/octet-stream');
		sinon.assert.calledWithExactly(
			res.end,
			'id;slug;title;published;author_id;author_name;tags\r\n'
				+ 'post-1;launch; =Launch;true;author-1;Ada;[tag-1,News], [tag-2,Tech]',
			'utf-8',
		);
	});

	it('returns a 500 JSON response when the export query fails', async function () {
		const err = new Error('find failed');
		const query = createQuery([], err);
		const list = {
			fields: {},
			get: sinon.stub().returns(undefined),
			getSearchFilters: sinon.stub().returns({}),
			key: 'Post',
			model: {
				find: sinon.stub().returns(query),
			},
			path: 'posts',
			processFilters: sinon.stub().returns({}),
		};
		const req = {
			keystone: createKeystone(),
			list,
			query: {},
			user: {},
		};
		const res = createResponse();

		download(req as unknown as Parameters<typeof download>[0], res as unknown as Parameters<typeof download>[1]);
		await flushDownload();

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, err);
		sinon.assert.notCalled(res.attachment);
		sinon.assert.notCalled(res.end);
	});

	it('supports synchronous custom toCSV methods with request, user, and row dependencies', async function () {
		const item = {
			id: 'post-1',
			get: sinon.stub(),
			toCSV: function (_req: unknown, user: { id: string }, row: Record<string, string>): Record<string, string> {
				return {
					id: row.id ?? '',
					owner: user.id,
					title: row.title ?? '',
				};
			},
		};
		const query = createQuery([item]);
		const list = {
			fields: {
				title: { type: 'text', path: 'title', format: sinon.stub().returns('=Draft') },
			},
			get: sinon.stub().returns(undefined),
			getSearchFilters: sinon.stub().returns({}),
			key: 'Post',
			model: {
				find: sinon.stub().returns(query),
			},
			path: 'posts',
			processFilters: sinon.stub().returns({}),
		};
		const req = {
			keystone: createKeystone(),
			list,
			query: {},
			user: { id: 'editor-1' },
		};
		const res = createResponse();

		download(req as unknown as Parameters<typeof download>[0], res as unknown as Parameters<typeof download>[1]);
		await flushDownload();

		sinon.assert.calledWithExactly(
			res.end,
			'id,owner,title\r\npost-1,editor-1, =Draft',
			'utf-8',
		);
	});

	it('supports callback-style custom toCSV methods with generated row dependencies', async function () {
		const item = {
			id: 'post-1',
			get: sinon.stub(),
			toCSV: function (row: Record<string, string>, callback: (err: unknown, result: Record<string, string>) => void): void {
				callback(null, {
					summary: row.id + ':' + row.title,
				});
			},
		};
		const query = createQuery([item]);
		const list = {
			fields: {
				title: { type: 'text', path: 'title', format: sinon.stub().returns('Callback Title') },
			},
			get: sinon.stub().returns(undefined),
			getSearchFilters: sinon.stub().returns({}),
			key: 'Post',
			model: {
				find: sinon.stub().returns(query),
			},
			path: 'posts',
			processFilters: sinon.stub().returns({}),
		};
		const req = {
			keystone: createKeystone(),
			list,
			query: {},
			user: { id: 'editor-1' },
		};
		const res = createResponse();

		download(req as unknown as Parameters<typeof download>[0], res as unknown as Parameters<typeof download>[1]);
		await flushDownload();

		sinon.assert.calledWithExactly(
			res.end,
			'summary\r\npost-1:Callback Title',
			'utf-8',
		);
	});
});
