import { expect } from 'chai';
import sinon from 'sinon';
import signout from 'keystone/admin/server/api/session/signout';

interface MockResponse {
	apiError: sinon.SinonSpy;
	clearCookie: sinon.SinonSpy;
	status: sinon.SinonStub;
	json: sinon.SinonSpy;
}

interface MockRequest {
	keystone?: MockKeystone;
	user: { id: string } | null;
	session: {
		regenerate: sinon.SinonStub;
	};
}

interface MockKeystone {
	get: sinon.SinonStub;
	security: { csrf: { validate: sinon.SinonStub } };
	callHook: sinon.SinonStub;
}

function createResponse(): MockResponse {
	const res: MockResponse = {
		apiError: sinon.spy(),
		clearCookie: sinon.spy(),
		status: sinon.stub(),
		json: sinon.spy(),
	};
	res.status.returns(res);
	return res;
}

function createRequest(keystone: MockKeystone, sessionErr: Error | null = null): MockRequest {
	return {
		keystone,
		user: { id: 'user-1' },
		session: {
			regenerate: sinon.stub().callsFake((callback: (err: Error | null) => void) => {
				callback(sessionErr);
			}),
		},
	};
}

function createKeystone(options: {
	cookieOptions?: Record<string, unknown>;
	csrfValid?: boolean;
	preError?: Error;
	postError?: Error;
} = {}): MockKeystone {
	const get = sinon.stub();
	get.withArgs('cookie signin options').returns(options.cookieOptions);
	return {
		get,
		security: {
			csrf: {
				validate: sinon.stub().returns(options.csrfValid ?? true),
			},
		},
		callHook: sinon.stub().callsFake((_user: unknown, hook: string, callback: (err?: Error) => void) => {
			callback(hook === 'pre:signout' ? options.preError : options.postError);
		}),
	};
}

describe('admin session signout security', function () {
	it('returns an internal error when Keystone is not initialised on the request', function () {
		const req = {
			user: { id: 'user-1' },
			session: {
				regenerate: sinon.stub(),
			},
		};
		const res = createResponse();

		signout(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'keystone not initialised' });
		sinon.assert.notCalled(res.clearCookie);
	});

	it('rejects invalid CSRF before firing signout hooks', function () {
		const keystone = createKeystone({ csrfValid: false });
		const req = createRequest(keystone);
		const res = createResponse();

		signout(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 403, 'invalid csrf');
		sinon.assert.notCalled(keystone.callHook);
		sinon.assert.notCalled(res.clearCookie);
	});

	it('clears the remember-me cookie with configured signin cookie options', function () {
		const keystone = createKeystone({
			cookieOptions: {
				domain: '.example.test',
				path: '/admin',
				secure: false,
				sameSite: 'lax',
			},
		});
		const req = createRequest(keystone);
		const res = createResponse();

		signout(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.clearCookie, 'keystone.uid', {
			signed: true,
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			domain: '.example.test',
			path: '/admin',
			maxAge: 0,
		});
		expect(req.user).to.equal(null);
		sinon.assert.calledWithExactly(res.json, { success: true });
	});

	it('does not serialize hook error details', function () {
		const keystone = createKeystone({
			preError: new Error('private hook failure'),
		});
		const req = createRequest(keystone);
		const res = createResponse();

		signout(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'pre:signout error' });
		expect(res.json.firstCall.args[0]).not.to.have.property('detail');
		sinon.assert.notCalled(res.clearCookie);
	});

	it('does not serialize session regeneration error details', function () {
		const keystone = createKeystone();
		const req = createRequest(keystone, new Error('private session failure'));
		const res = createResponse();

		signout(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledOnce(res.clearCookie);
		expect(req.user).to.equal(null);
		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'session error' });
		expect(res.json.firstCall.args[0]).not.to.have.property('detail');
		sinon.assert.calledOnce(keystone.callHook);
	});

	it('does not serialize post-signout hook error details', function () {
		const keystone = createKeystone({
			postError: new Error('private post-hook failure'),
		});
		const req = createRequest(keystone);
		const res = createResponse();

		signout(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledOnce(res.clearCookie);
		expect(req.user).to.equal(null);
		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'post:signout error' });
		expect(res.json.firstCall.args[0]).not.to.have.property('detail');
		sinon.assert.calledTwice(keystone.callHook);
	});
});
