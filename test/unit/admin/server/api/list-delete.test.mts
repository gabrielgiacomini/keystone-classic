import { expect } from 'chai';
import sinon from 'sinon';
import listDelete from 'keystone/admin/server/api/list/delete';

interface MockResponse {
	apiError: sinon.SinonSpy;
	json: sinon.SinonSpy;
	status: sinon.SinonStub;
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

function createItem(id: string) {
	return {
		id,
		deleteOne: sinon.stub().resolves(),
		_req_user: undefined as unknown,
	};
}

function createRequest(overrides: Record<string, unknown> = {}) {
	const findQuery = {
		exec: sinon.stub().resolves([]),
	};
	const req = {
		body: { ids: ['post-1'] },
		keystone: {
			get: sinon.stub().returns('User'),
			security: {
				csrf: {
					validate: sinon.stub().returns(true),
				},
			},
		},
		list: {
			get: sinon.stub().withArgs('nodelete').returns(false),
			key: 'Post',
			model: {
				find: sinon.stub().returns(findQuery),
			},
		},
		params: {},
		user: { id: 'user-1' },
		...overrides,
	};
	return { req, findQuery };
}

async function waitForAsyncDelete(): Promise<void> {
	await new Promise<void>((resolve) => {
		setImmediate(resolve);
	});
}

describe('admin list delete API', function () {
	it('deletes requested ids, attaches the request user, and returns the deleted count', async function () {
		const postA = createItem('post-1');
		const postB = createItem('post-2');
		const { req, findQuery } = createRequest({
			body: { ids: 'post-1,post-2' },
		});
		findQuery.exec.resolves([postA, postB]);
		const res = createResponse();

		listDelete(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await waitForAsyncDelete();

		sinon.assert.calledWithExactly(req.list.model.find, { _id: { $in: ['post-1', 'post-2'] } });
		expect(postA._req_user).to.equal(req.user);
		expect(postB._req_user).to.equal(req.user);
		sinon.assert.calledOnce(postA.deleteOne);
		sinon.assert.calledOnce(postB.deleteOne);
		sinon.assert.calledWithExactly(res.json, {
			success: true,
			ids: ['post-1', 'post-2'],
			count: 2,
		});
	});

	it('maps find failures to a database API error', async function () {
		const dbErr = new Error('find failed');
		const { req, findQuery } = createRequest();
		findQuery.exec.rejects(dbErr);
		const res = createResponse();

		listDelete(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await waitForAsyncDelete();

		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
	});

	it('maps document delete failures to a database API error', async function () {
		const dbErr = new Error('delete failed');
		const post = createItem('post-1');
		post.deleteOne.rejects(dbErr);
		const { req, findQuery } = createRequest();
		findQuery.exec.resolves([post]);
		const res = createResponse();

		listDelete(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await waitForAsyncDelete();

		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(res.json);
	});

	it('rejects invalid CSRF before querying for documents', function () {
		const { req } = createRequest({
			keystone: {
				get: sinon.stub().returns('User'),
				security: {
					csrf: {
						validate: sinon.stub().returns(false),
					},
				},
			},
		});
		const res = createResponse();

		listDelete(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 403, 'invalid csrf');
		sinon.assert.notCalled(req.list.model.find);
	});

	it('rejects nodelete lists before querying for documents', function () {
		const { req } = createRequest({
			list: {
				get: sinon.stub().withArgs('nodelete').returns(true),
				key: 'Post',
				model: {
					find: sinon.stub(),
				},
			},
		});
		const res = createResponse();

		listDelete(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 400, 'nodelete');
		sinon.assert.notCalled(req.list.model.find);
	});

	it('blocks users from deleting their own user record', function () {
		const { req } = createRequest({
			body: { ids: ['user-1'] },
			list: {
				get: sinon.stub().withArgs('nodelete').returns(false),
				key: 'User',
				model: {
					find: sinon.stub(),
				},
			},
		});
		req.keystone.get.withArgs('user model').returns('User');
		const res = createResponse();

		listDelete(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 403, 'not allowed', 'You can not delete yourself');
		sinon.assert.notCalled(req.list.model.find);
	});
});
