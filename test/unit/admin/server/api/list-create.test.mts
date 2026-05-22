import sinon from 'sinon';
import create from 'keystone/admin/server/api/list/create';

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

function createRequest(overrides: Record<string, unknown> = {}) {
	const item = {};
	function Model() {
		return item;
	}
	return {
		body: { title: 'Launch' },
		files: { upload: 'file' },
		keystone: {
			security: {
				csrf: {
					validate: sinon.stub().returns(true),
				},
			},
		},
		list: {
			getData: sinon.stub().returns({ id: 'created', title: 'Launch' }),
			model: Model,
			updateItem: sinon.stub().callsArgWith(3, null),
		},
		user: { id: 'user-1' },
		...overrides,
	};
}

describe('admin list create API', function () {
	it('rejects invalid CSRF before constructing or updating an item', function () {
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

		create(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 403, 'invalid csrf');
		sinon.assert.notCalled(req.list.updateItem);
	});

	it('passes files, user, and ignoreNoEdit into list.updateItem and returns serialized data', function () {
		const req = createRequest();
		const res = createResponse();

		create(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledOnce(req.list.updateItem);
		sinon.assert.calledWithMatch(req.list.updateItem, sinon.match.object, req.body, {
			files: req.files,
			ignoreNoEdit: true,
			user: req.user,
		});
		sinon.assert.calledWithExactly(res.json, { id: 'created', title: 'Launch' });
	});

	it('maps validation errors to a 400 API error', function () {
		const validationError = { error: 'validation errors', detail: { title: 'required' } };
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: function Model() {},
				updateItem: sinon.stub().callsArgWith(3, validationError),
			},
		});
		const res = createResponse();

		create(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 400, validationError);
		sinon.assert.notCalled(req.list.getData);
	});

	it('maps database errors to the admin database API error helper', function () {
		const dbErr = new Error('insert failed');
		const req = createRequest({
			list: {
				getData: sinon.stub(),
				model: function Model() {},
				updateItem: sinon.stub().callsArgWith(3, { error: 'database error', detail: dbErr }),
			},
		});
		const res = createResponse();

		create(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 'database error', dbErr);
		sinon.assert.notCalled(req.list.getData);
	});
});
