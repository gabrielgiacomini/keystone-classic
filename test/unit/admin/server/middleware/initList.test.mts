import { expect } from 'chai';
import sinon from 'sinon';
import initList from 'keystone/admin/server/middleware/initList';

interface MockResponse {
	json: sinon.SinonSpy;
	redirect: sinon.SinonSpy;
	status: sinon.SinonStub;
}

interface MockKeystone {
	lists: Record<string, unknown>;
	paths: Record<string, string>;
	get(key: string): unknown;
}

function createResponse(): MockResponse {
	const res: MockResponse = {
		json: sinon.spy(),
		redirect: sinon.spy(),
		status: sinon.stub(),
	};
	res.status.returns(res);
	return res;
}

function createKeystone(): MockKeystone {
	const postList = { key: 'Post' };
	return {
		lists: {
			Post: postList,
		},
		paths: {
			posts: 'Post',
		},
		get(key: string): unknown {
			if (key === 'admin legacy path') return 'keystone';
			return undefined;
		},
	};
}

function createRequest(overrides: Record<string, unknown> = {}) {
	return {
		flash: sinon.spy(),
		headers: {},
		keystone: createKeystone(),
		params: {
			list: 'Post',
		},
		...overrides,
	};
}

describe('admin initList middleware', function () {
	it('attaches a list resolved by key and continues', function () {
		const req = createRequest();
		const res = createResponse();
		const next = sinon.spy();

		initList(req as unknown as import('express').Request, res as unknown as import('express').Response, next);

		expect((req as { list?: unknown }).list).to.equal((req.keystone as MockKeystone).lists.Post);
		sinon.assert.calledOnce(next);
		sinon.assert.notCalled(res.status);
	});

	it('attaches a list resolved by legacy path alias and continues', function () {
		const req = createRequest({
			params: {
				list: 'posts',
			},
		});
		const res = createResponse();
		const next = sinon.spy();

		initList(req as unknown as import('express').Request, res as unknown as import('express').Response, next);

		expect((req as { list?: unknown }).list).to.equal((req.keystone as MockKeystone).lists.Post);
		sinon.assert.calledOnce(next);
		sinon.assert.notCalled(res.status);
	});

	it('returns JSON for invalid list paths when the API client sends a broad JSON Accept header', function () {
		const req = createRequest({
			headers: {
				accept: 'application/json, text/plain, */*',
			},
			params: {
				list: 'missing-list',
			},
		});
		const res = createResponse();
		const next = sinon.spy();

		initList(req as unknown as import('express').Request, res as unknown as import('express').Response, next);

		sinon.assert.calledWithExactly(res.status, 404);
		sinon.assert.calledWithExactly(res.json, { error: 'invalid list path' });
		sinon.assert.notCalled(req.flash as sinon.SinonSpy);
		sinon.assert.notCalled(res.redirect);
		sinon.assert.notCalled(next);
	});

	it('redirects invalid HTML list paths back to the legacy admin path', function () {
		const req = createRequest({
			headers: {
				accept: 'text/html,application/xhtml+xml',
			},
			params: {
				list: 'missing-list',
			},
		});
		const res = createResponse();
		const next = sinon.spy();

		initList(req as unknown as import('express').Request, res as unknown as import('express').Response, next);

		sinon.assert.calledWithExactly(req.flash as sinon.SinonSpy, 'error', 'List missing-list could not be found.');
		sinon.assert.calledWithExactly(res.redirect, '/keystone');
		sinon.assert.notCalled(res.status);
		sinon.assert.notCalled(res.json);
		sinon.assert.notCalled(next);
	});

	it('returns a JSON 500 when Keystone was not attached to the request', function () {
		const req = createRequest({
			keystone: undefined,
		});
		const res = createResponse();
		const next = sinon.spy();

		initList(req as unknown as import('express').Request, res as unknown as import('express').Response, next);

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'keystone not initialised' });
		sinon.assert.notCalled(next);
	});
});
