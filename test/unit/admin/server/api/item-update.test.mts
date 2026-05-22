import sinon from 'sinon';
import { expect } from 'chai';
import itemUpdate from 'keystone/admin/server/api/item/update';

interface MockResponse {
	apiError: sinon.SinonSpy;
	json: sinon.SinonSpy;
	logError: sinon.SinonSpy;
	status: sinon.SinonStub;
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
	const updatedItem = { id: 'item-1', title: 'After' };
	const findById = sinon.stub();
	findById.onFirstCall().returns(execResult(item));
	findById.onSecondCall().returns(execResult(updatedItem));
	return {
		body: { title: 'After' },
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
			model: { findById },
			updateItem: sinon.stub().callsArgWith(3, null),
		},
		params: { id: 'item-1' },
		user: { id: 'user-1' },
		...overrides,
	};
}

async function flushPromises(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
}

describe('admin item update API', function () {
	it('rejects invalid CSRF before querying the item', function () {
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

		itemUpdate(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 403, 'invalid csrf');
		sinon.assert.notCalled(req.list.model.findById);
	});

	it('returns 404 when the requested item does not exist', async function () {
		const findById = sinon.stub().returns(execResult(null));
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: { findById },
				updateItem: sinon.stub(),
			},
		});
		const res = createResponse();

		itemUpdate(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.status, 404);
		sinon.assert.calledWithExactly(res.json, { error: 'not found', id: 'item-1' });
		sinon.assert.notCalled(req.list.updateItem);
	});

	it('updates the item with files and user, then returns fresh serialized data', async function () {
		const req = createRequest();
		const res = createResponse();

		itemUpdate(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledTwice(req.list.model.findById);
		expect(req.list.model.findById.firstCall.args).to.deep.equal(['item-1']);
		sinon.assert.calledWithMatch(req.list.updateItem, sinon.match.object, req.body, {
			files: req.files,
			user: req.user,
		});
		sinon.assert.calledWithExactly(res.json, { id: 'item-1', title: 'After' });
	});

	it('maps validation errors to a 400 API error', async function () {
		const validationError = { error: 'validation errors', detail: { title: 'required' } };
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: { findById: sinon.stub().returns(execResult({ id: 'item-1' })) },
				updateItem: sinon.stub().callsArgWith(3, validationError),
			},
		});
		const res = createResponse();

		itemUpdate(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.apiError, 400, validationError);
		sinon.assert.notCalled(req.list.getData);
	});

	it('maps updateItem database errors to the admin database API error helper', async function () {
		const dbErr = new Error('write failed');
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: { findById: sinon.stub().returns(execResult({ id: 'item-1' })) },
				updateItem: sinon.stub().callsArgWith(3, { error: 'database error', detail: dbErr }),
			},
		});
		const res = createResponse();

		itemUpdate(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(req.list.getData);
	});

	it('routes initial item lookup failures through the admin API error helper', async function () {
		const dbErr = new Error('read failed');
		const findById = sinon.stub().returns(execReject(dbErr));
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: { findById },
				updateItem: sinon.stub(),
			},
		});
		const res = createResponse();

		itemUpdate(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(
			res.logError,
			'admin/server/api/item/update',
			'database error finding item',
			dbErr,
		);
		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(req.list.updateItem);
	});

	it('routes updated item lookup failures through the admin API error helper', async function () {
		const item = { id: 'item-1', title: 'Before' };
		const dbErr = new Error('refresh failed');
		const findById = sinon.stub();
		findById.onFirstCall().returns(execResult(item));
		findById.onSecondCall().returns(execReject(dbErr));
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: { findById },
				updateItem: sinon.stub().callsArgWith(3, null),
			},
		});
		const res = createResponse();

		itemUpdate(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(
			res.logError,
			'admin/server/api/item/update',
			'database error finding updated item',
			dbErr,
		);
		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(req.list.getData);
	});
});
