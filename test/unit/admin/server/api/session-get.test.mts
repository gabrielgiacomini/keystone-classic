import sinon from 'sinon';
import getSession from 'keystone/admin/server/api/session/get';

interface MockResponse {
	json: sinon.SinonSpy;
}

function createResponse(): MockResponse {
	return {
		json: sinon.spy(),
	};
}

describe('admin session get API', function () {
	it('refreshes the CSRF token and returns the authenticated user', function () {
		const user = { id: 'user-1', name: 'Ada' };
		const req = {
			keystone: {
				security: {
					csrf: {
						getToken: sinon.stub().returns('csrf-token'),
					},
				},
			},
			user,
		};
		const res = createResponse();

		getSession(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(req.keystone.security.csrf.getToken, req, res);
		sinon.assert.calledWithExactly(res.json, { user });
	});

	it('returns the user even when CSRF helpers are not installed', function () {
		const req = {
			keystone: {},
			user: null,
		};
		const res = createResponse();

		getSession(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.json, { user: null });
	});
});
