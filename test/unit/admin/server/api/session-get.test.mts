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
				get: sinon.stub().returns(undefined),
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

	it('returns a safe projection instead of the raw user document', function () {
		const hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
		const userList = {
			namePath: 'name',
			fields: { name: { type: 'name' }, email: { type: 'email' }, password: { type: 'password' } },
			getDocumentName: () => 'Ada Lovelace',
		};
		const req = {
			keystone: {
				get: (key: string) => (key === 'user model' ? 'User' : undefined),
				lists: { User: userList },
			},
			user: {
				_id: 'user-1',
				id: 'user-1',
				name: { first: 'Ada', last: 'Lovelace' },
				email: 'ada@example.com',
				password: hash,
				isAdmin: true,
				canAccessKeystone: true,
				resetToken: 'secret',
			},
		};
		const res = createResponse();

		getSession(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.json, {
			user: { id: 'user-1', name: 'Ada Lovelace', email: 'ada@example.com', canAccessKeystone: true },
		});
		const serialized = JSON.stringify(res.json.firstCall.args[0]);
		if (serialized.includes('$2') || serialized.includes('password')) {
			throw new Error('session response contains password data: ' + serialized);
		}
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
