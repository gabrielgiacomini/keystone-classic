import sinon from 'sinon';
import { expect } from 'chai';
import update from 'keystone/admin/server/api/list/update';

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

function execResult<T>(value: T): { exec(): Promise<T> } {
	return {
		exec() {
			return Promise.resolve(value);
		},
	};
}

function execReject(err: Error): { exec(): Promise<never> } {
	return {
		exec() {
			return Promise.reject(err);
		},
	};
}

function createRequest(overrides: Record<string, unknown> = {}) {
	const item = { id: 'item-1', title: 'Before' };
	return {
		body: {
			items: [
				{ id: 'item-1', title: 'After' },
			],
		},
		files: { upload: 'file' },
		keystone: {
			security: {
				csrf: {
					validate: sinon.stub().returns(true),
				},
			},
		},
		list: {
			getData: sinon.stub().returns({ id: 'item-1', title: 'After' }),
			model: {
				findById: sinon.stub().returns(execResult(item)),
			},
			updateItem: sinon.stub().callsArgWith(3, null),
		},
		query: {},
		user: { id: 'user-1' },
		...overrides,
	};
}

async function flushPromises(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
	await new Promise<void>((resolve) => {
		setImmediate(resolve);
	});
}

describe('admin list update API', function () {
	it('rejects invalid CSRF before querying items', function () {
		const req = createRequest({
			keystone: {
				security: {
					csrf: {
						validate: sinon.stub().returns(false),
					},
				},
			},
		});
		const res = createResponse();

		update(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 403, 'invalid csrf');
		sinon.assert.notCalled(req.list.model.findById);
	});

	it('updates requested items and returns their ids by default', async function () {
		const req = createRequest();
		const res = createResponse();

		update(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(req.list.model.findById, 'item-1');
		sinon.assert.calledWithMatch(req.list.updateItem, sinon.match.object, req.body.items[0], {
			files: req.files,
			user: req.user,
		});
		sinon.assert.calledWithExactly(res.json, { success: true, items: ['item-1'] });
	});

	it('returns serialized item data when returnData is requested', async function () {
		const req = createRequest({ query: { returnData: '1' } });
		const res = createResponse();

		update(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledOnce(req.list.getData);
		sinon.assert.calledWithExactly(res.json, {
			success: true,
			items: [{ id: 'item-1', title: 'After' }],
		});
	});

	it('maps validation errors to a 400 response', async function () {
		const validationError = { error: 'validation errors', detail: { title: 'required' } };
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: {
					findById: sinon.stub().returns(execResult({ id: 'item-1' })),
				},
				updateItem: sinon.stub().callsArgWith(3, validationError),
			},
		});
		const res = createResponse();

		update(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.status, 400);
		expect(res.json.firstCall.args[0]).to.include({ error: 'validation errors', id: 'item-1' });
		sinon.assert.notCalled(req.list.getData);
	});

	it('maps item lookup failures to the admin database API error helper', async function () {
		const dbErr = new Error('read failed');
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: {
					findById: sinon.stub().returns(execReject(dbErr)),
				},
				updateItem: sinon.stub(),
			},
		});
		const res = createResponse();

		update(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(req.list.updateItem);
	});

	it('maps updateItem database errors to the admin database API error helper', async function () {
		const dbErr = new Error('write failed');
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: {
					findById: sinon.stub().returns(execResult({ id: 'item-1' })),
				},
				updateItem: sinon.stub().callsArgWith(3, { error: 'database error', detail: dbErr }),
			},
		});
		const res = createResponse();

		update(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(req.list.getData);
	});
});
