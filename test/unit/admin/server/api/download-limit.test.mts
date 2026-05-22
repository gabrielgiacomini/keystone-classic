import { expect } from 'chai';
import sinon from 'sinon';
import download from 'keystone/admin/server/api/download';
import listDownload from 'keystone/admin/server/api/list/download';
import {
	DEFAULT_DOWNLOAD_LIMIT,
	DOWNLOAD_LIMIT_OPTION,
	createDownloadLimitError,
	resolveDownloadLimit,
} from 'keystone/admin/server/api/list/downloadLimit';

interface MockResponse {
	status: sinon.SinonStub & { returns(v: MockResponse): void };
	json: sinon.SinonSpy;
	attachment: sinon.SinonSpy;
	setHeader: sinon.SinonSpy;
	end: sinon.SinonSpy;
}

function createResponse(): MockResponse {
	const res = {
		status: sinon.stub(),
		json: sinon.spy(),
		attachment: sinon.spy(),
		setHeader: sinon.spy(),
		end: sinon.spy(),
	} as unknown as MockResponse;
	(res.status as sinon.SinonStub).returns(res);
	return res;
}

interface MockQuery {
	limit: sinon.SinonStub;
	populate: sinon.SinonStub;
	sort: sinon.SinonStub;
	exec: sinon.SinonStub;
}

function createQuery(results: Record<string, unknown>[]) {
	const execPromise = Promise.resolve(results);
	const query: MockQuery = {
		limit: sinon.stub().returnsThis(),
		populate: sinon.stub().returnsThis(),
		sort: sinon.stub().returnsThis(),
		exec: sinon.stub().returns(execPromise),
	};
	return { query, execPromise };
}

function createKeystone(limit: number | string | undefined) {
	return {
		get(key: string) {
			if (key === DOWNLOAD_LIMIT_OPTION) return limit;
			return undefined;
		},
	};
}

describe('admin download limit', function () {
	it('resolves configured positive limits and falls back for invalid values', function () {
		expect(resolveDownloadLimit(createKeystone(undefined))).to.equal(DEFAULT_DOWNLOAD_LIMIT);
		expect(resolveDownloadLimit(createKeystone('25'))).to.equal(25);
		expect(resolveDownloadLimit(createKeystone(25.9))).to.equal(25);
		expect(resolveDownloadLimit(createKeystone(0))).to.equal(DEFAULT_DOWNLOAD_LIMIT);
		expect(resolveDownloadLimit(createKeystone('not-a-number'))).to.equal(DEFAULT_DOWNLOAD_LIMIT);
	});

	it('caps the legacy CSV download query and rejects overflow before writing an attachment', async function () {
		const { query, execPromise } = createQuery([
			{ id: '1', get: sinon.stub() },
			{ id: '2', get: sinon.stub() },
		]);
		const list = {
			key: 'Post',
			path: 'posts',
			fields: {},
			model: { find: sinon.stub().returns(query) },
			processFilters: sinon.stub().returns({}),
			getSearchFilters: sinon.stub().returns({}),
			get: sinon.stub().returns(undefined),
		};
		const req = {
			keystone: createKeystone(1),
			list,
			query: {},
			user: {},
		};
		const res = createResponse();

		download(req as unknown as Parameters<typeof download>[0], res as unknown as Parameters<typeof download>[1]);
		await execPromise;

		sinon.assert.calledWithExactly(query.limit, 2);
		sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 413);
		sinon.assert.calledWithExactly(res.json, createDownloadLimitError(1));
		sinon.assert.notCalled(res.attachment);
		sinon.assert.notCalled(res.end);
	});

	it('caps the list download query and rejects overflow before serialising CSV data', async function () {
		const { query, execPromise } = createQuery([
			{ id: '1' },
			{ id: '2' },
		]);
		const list = {
			path: 'posts',
			relationshipFields: [],
			model: { find: sinon.stub().returns(query) },
			addFiltersToQuery: sinon.stub().returns({}),
			addSearchToQuery: sinon.stub().returns({}),
			expandSort: sinon.stub().returns({ string: 'name' }),
			getCSVData: sinon.spy(),
			getData: sinon.spy(),
		};
		const req = {
			keystone: createKeystone(1),
			list,
			params: { format: 'export.csv' },
			query: {},
			user: {},
		};
		const res = createResponse();
		const next = sinon.spy();

		listDownload(req as unknown as Parameters<typeof listDownload>[0], res as unknown as Parameters<typeof listDownload>[1], next);
		await execPromise;

		sinon.assert.calledWithExactly(query.limit, 2);
		sinon.assert.calledWithExactly(res.status as sinon.SinonStub, 413);
		sinon.assert.calledWithExactly(res.json, createDownloadLimitError(1));
		sinon.assert.notCalled(list.getCSVData);
		sinon.assert.notCalled(res.attachment);
		sinon.assert.notCalled(res.end);
		sinon.assert.notCalled(next);
	});
});
