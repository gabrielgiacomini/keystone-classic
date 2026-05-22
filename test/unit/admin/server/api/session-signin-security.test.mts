import { expect } from 'chai';
import sinon from 'sinon';
import signin from 'keystone/admin/server/api/session/signin';
import {
	createSigninRateLimitMiddleware,
	resetSigninSecurityState,
} from 'keystone/admin/server/api/session/signinSecurity';

interface MockResponse {
	apiError: sinon.SinonSpy;
	status: sinon.SinonStub;
	json: sinon.SinonSpy;
	setHeader: sinon.SinonSpy;
}

interface MockKeystone {
	get: sinon.SinonStub;
	security: { csrf: { validate: sinon.SinonStub } };
	lists: Record<string, { model: { findOne: sinon.SinonStub } } | undefined>;
	callHook: sinon.SinonStub;
	session: { signinWithUser: sinon.SinonStub };
}

interface MockRequest {
	keystone: MockKeystone;
	body: Record<string, unknown>;
	ip: string;
	socket: Record<string, unknown>;
}

interface MockUser {
	id: string;
	email: string;
	_: {
		password: {
			compare: sinon.SinonStub;
		};
	};
}

function createResponse(): MockResponse {
	const res: MockResponse = {
		apiError: sinon.spy(),
		status: sinon.stub(),
		json: sinon.spy(),
		setHeader: sinon.spy(),
	};
	res.status.returns(res);
	return res;
}

function createRequest(keystone: MockKeystone, email = 'admin@example.com', password = ['wrong', 'password'].join('-')): MockRequest {
	return {
		keystone,
		body: {
			email,
			password,
		},
		ip: '127.0.0.1',
		socket: {},
	};
}

function createKeystone(options: {
	csrfValid?: boolean;
	findOne?: sinon.SinonStub;
	postError?: Error;
	preError?: Error;
	rateLimit?: false | Record<string, unknown>;
	lockout?: false | Record<string, unknown>;
	userModel?: string | null;
} = {}): MockKeystone {
	const findOne = options.findOne ?? sinon.stub();
	const configuredUserModel = options.userModel ?? 'User';
	const get = sinon.stub();
	get.withArgs('signin rate limit').returns(options.rateLimit);
	get.withArgs('signin lockout').returns(options.lockout);
	get.withArgs('user model').returns(options.userModel === null ? undefined : configuredUserModel);
	return {
		get,
		security: {
			csrf: {
				validate: sinon.stub().returns(options.csrfValid ?? true),
			},
		},
		lists: {
			...(options.userModel === null ? { User: { model: { findOne } } } : {}),
			...(options.userModel !== null ? { [configuredUserModel]: { model: { findOne } } } : {}),
		},
		callHook: sinon.stub().callsFake((_user: unknown, hook: string, _req: unknown, callback: (err?: Error) => void) => {
			callback(hook === 'pre:signin' ? options.preError : options.postError);
		}),
		session: {
			signinWithUser: sinon.stub().callsFake((_user: unknown, _req: unknown, _res: unknown, callback: () => void) => {
				callback();
			}),
		},
	};
}

function createUser(compareErr: Error | null = null, isMatch = true): MockUser {
	return {
		id: 'user-1',
		email: 'admin@example.com',
		_: {
			password: {
				compare: sinon.stub().callsFake((_password: string, callback: (err: Error | null, isMatch: boolean) => void) => {
					callback(compareErr, isMatch);
				}),
			},
		},
	};
}

function createUserFindOne(user: MockUser) {
	return sinon.stub().returns({
		exec: sinon.stub().returns(Promise.resolve(user)),
	});
}

function createNullUserFindOne() {
	return sinon.stub().returns({
		exec: sinon.stub().returns(Promise.resolve(null)),
	});
}

async function flushPromises(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
}

async function runThroughMiddleware(req: MockRequest, res: MockResponse, keystone: MockKeystone): Promise<void> {
	const middleware = createSigninRateLimitMiddleware(keystone as unknown as import('keystone').Keystone);
	middleware(req as unknown as import('express').Request, res as unknown as import('express').Response, function () {
		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);
	});
	await flushPromises();
}

describe('admin session signin security', function () {
	beforeEach(function () {
		resetSigninSecurityState();
	});

	afterEach(function () {
		resetSigninSecurityState();
	});

	it('rejects invalid CSRF before querying the user model', function () {
		const findOne = sinon.stub();
		const keystone = createKeystone({ csrfValid: false, findOne });
		const req = createRequest(keystone);
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.apiError, 403, 'invalid csrf');
		sinon.assert.notCalled(findOne);
	});

	it('requires email and password before querying the user model', function () {
		const findOne = sinon.stub();
		const keystone = createKeystone({ findOne });
		const req = createRequest(keystone);
		req.body = { email: 'admin@example.com' };
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 401);
		sinon.assert.calledWithExactly(res.json, { error: 'email and password required' });
		sinon.assert.notCalled(findOne);
	});

	it('rejects non-email credentials before querying the user model', function () {
		const findOne = sinon.stub();
		const keystone = createKeystone({ findOne });
		const req = createRequest(keystone, 'not-an-email');
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 401);
		sinon.assert.calledWithExactly(res.json, { error: 'invalid details' });
		sinon.assert.notCalled(findOne);
	});

	it('returns an internal error when the user model is not configured', function () {
		const findOne = sinon.stub();
		const keystone = createKeystone({ findOne, userModel: null });
		const req = createRequest(keystone);
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'user model not configured' });
		sinon.assert.notCalled(findOne);
	});

	it('signs in matching users and returns the authenticated user', async function () {
		const user = createUser();
		const findOne = createUserFindOne(user);
		const keystone = createKeystone({ findOne });
		const req = createRequest(keystone, 'ADMIN@example.com', 'correct-password');
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		const query = findOne.firstCall.args[0] as { email: RegExp };
		expect(query.email).to.be.instanceOf(RegExp);
		expect(query.email.test('admin@example.com')).to.equal(true);
		sinon.assert.calledWith(user._.password.compare, 'correct-password');
		sinon.assert.calledWith(keystone.session.signinWithUser, user, req, res);
		sinon.assert.calledWithExactly(res.json, { success: true, user });
	});

	it('uses the configured non-default user model for admin sign-in', async function () {
		const user = createUser();
		const findOne = createUserFindOne(user);
		const fallbackUserFindOne = sinon.stub();
		const keystone = createKeystone({ findOne, userModel: 'Administrator' });
		keystone.lists.User = { model: { findOne: fallbackUserFindOne } };
		const req = createRequest(keystone, 'ADMIN@example.com', 'correct-password');
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledOnce(findOne);
		sinon.assert.notCalled(fallbackUserFindOne);
		sinon.assert.calledWith(keystone.session.signinWithUser, user, req, res);
		sinon.assert.calledWithExactly(res.json, { success: true, user });
	});

	it('rate limits repeated signin posts by request IP', function () {
		const keystone = createKeystone({
			rateLimit: { windowMs: 60000, max: 2 },
			lockout: false,
		});
		const middleware = createSigninRateLimitMiddleware(keystone as unknown as import('keystone').Keystone);
		const next = sinon.spy();

		middleware(createRequest(keystone) as unknown as import('express').Request, createResponse() as unknown as import('express').Response, next);
		middleware(createRequest(keystone) as unknown as import('express').Request, createResponse() as unknown as import('express').Response, next);
		const blockedRes = createResponse();
		middleware(createRequest(keystone) as unknown as import('express').Request, blockedRes as unknown as import('express').Response, next);

		sinon.assert.calledTwice(next);
		sinon.assert.calledWithExactly(blockedRes.status, 429);
		sinon.assert.calledWithExactly(blockedRes.json, {
			error: 'signin rate limit exceeded',
			message: 'Too many sign-in attempts. Try again later.',
			retryAfter: 60,
		});
		sinon.assert.calledWithExactly(blockedRes.setHeader, 'Retry-After', '60');
	});

	it('locks an email credential after repeated failed signin attempts', async function () {
		const findOne = createNullUserFindOne();
		const keystone = createKeystone({
			findOne,
			rateLimit: false,
			lockout: { windowMs: 60000, maxFailures: 2, durationMs: 60000 },
		});

		const firstRes = createResponse();
		await runThroughMiddleware(createRequest(keystone), firstRes, keystone);
		sinon.assert.calledWithExactly(firstRes.status, 401);
		sinon.assert.calledWithExactly(firstRes.json, { error: 'invalid details' });

		const secondRes = createResponse();
		await runThroughMiddleware(createRequest(keystone), secondRes, keystone);
		sinon.assert.calledWithExactly(secondRes.status, 429);
		sinon.assert.calledWithExactly(secondRes.json, {
			error: 'signin locked',
			message: 'Too many failed sign-in attempts for this account. Try again later.',
			retryAfter: 60,
		});

		const thirdRes = createResponse();
		await runThroughMiddleware(createRequest(keystone), thirdRes, keystone);
		sinon.assert.calledWithExactly(thirdRes.status, 429);
		expect(findOne.callCount).to.equal(2);
	});

	it('does not serialize pre-signin hook error details', async function () {
		const user = createUser();
		const keystone = createKeystone({
			findOne: createUserFindOne(user),
			preError: new Error('private pre-hook failure'),
		});
		const req = createRequest(keystone);
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'pre:signin error' });
		expect(res.json.firstCall.args[0]).not.to.have.property('detail');
		sinon.assert.notCalled(user._.password.compare);
		sinon.assert.notCalled(keystone.session.signinWithUser);
	});

	it('does not serialize bcrypt error details', async function () {
		const user = createUser(new Error('bcrypt internal failure'), false);
		const keystone = createKeystone({
			findOne: createUserFindOne(user),
		});
		const req = createRequest(keystone);
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'bcrypt error' });
		expect(res.json.firstCall.args[0]).not.to.have.property('detail');
		sinon.assert.notCalled(keystone.session.signinWithUser);
	});

	it('does not serialize post-signin hook error details', async function () {
		const user = createUser();
		const keystone = createKeystone({
			findOne: createUserFindOne(user),
			postError: new Error('private post-hook failure'),
		});
		const req = createRequest(keystone);
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'post:signin error' });
		expect(res.json.firstCall.args[0]).not.to.have.property('detail');
		sinon.assert.calledOnce(keystone.session.signinWithUser);
	});

	it('does not serialize database error details on signin failures', async function () {
		const findOne = sinon.stub().returns({
			exec: sinon.stub().returns(Promise.reject(new Error('connection string leak'))),
		});
		const keystone = createKeystone({
			findOne,
			rateLimit: false,
			lockout: false,
		});
		const req = createRequest(keystone);
		const res = createResponse();

		signin(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushPromises();

		sinon.assert.calledWithExactly(res.status, 500);
		sinon.assert.calledWithExactly(res.json, { error: 'database error' });
		expect(res.json.firstCall.args[0]).not.to.have.property('detail');
	});
});
