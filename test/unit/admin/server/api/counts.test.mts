import sinon from 'sinon';
import counts from 'keystone/admin/server/api/counts';

interface MockResponse {
	apiError: sinon.SinonSpy;
	json: sinon.SinonSpy;
}

function createResponse(): MockResponse {
	return {
		apiError: sinon.spy(),
		json: sinon.spy(),
	};
}

function createList(key: string, count: number, err?: Error) {
	return {
		key,
		model: {
			countDocuments: err
				? sinon.stub().rejects(err)
				: sinon.stub().resolves(count),
		},
	};
}

async function flushPromises(): Promise<void> {
	await new Promise<void>((resolve) => {
		setImmediate(resolve);
	});
}

describe('admin counts API', function () {
	it('returns document counts for every registered list', async function () {
		const postList = createList('Post', 7);
		const authorList = createList('Author', 2);
		const req = {
			keystone: {
				lists: {
					Post: postList,
					Author: authorList,
				},
			},
		};
		const res = createResponse();

		counts(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledOnce(postList.model.countDocuments);
		sinon.assert.calledOnce(authorList.model.countDocuments);
		sinon.assert.calledWithExactly(res.json, {
			counts: {
				Post: 7,
				Author: 2,
			},
		});
		sinon.assert.notCalled(res.apiError);
	});

	it('returns an empty counts object when no lists are registered', async function () {
		const req = { keystone: { lists: {} } };
		const res = createResponse();

		counts(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.json, { counts: {} });
		sinon.assert.notCalled(res.apiError);
	});

	it('maps count database failures to the admin database API error helper', async function () {
		const dbErr = new Error('count failed');
		const req = {
			keystone: {
				lists: {
					Post: createList('Post', 0, dbErr),
					Author: createList('Author', 2),
				},
			},
		};
		const res = createResponse();

		counts(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(res.json);
	});
});
