import keystone from 'keystone';
import sinon from 'sinon';
import { expect } from 'chai';
import type { HookMiddleware } from 'keystone/lib/core/hooks';

// keystone.session is typed `unknown` on the public interface; this cast
// gives us a non-`any` local shape for the methods exercised by these tests.
interface KsSession {
	signinWithUser(
		user: Record<string, unknown>,
		req: Record<string, unknown>,
		res: Record<string, unknown>,
		onSuccess: (user: Record<string, unknown>) => void,
	): void;
	signin(
		lookup: Record<string, unknown>,
		req: unknown,
		res: unknown,
		onSuccess: () => void,
		onFailure: (err: Error) => void,
	): void;
	signout(
		req: Record<string, unknown>,
		res: Record<string, unknown>,
		cb: (err?: Error) => void,
	): void;
	keystoneAuth(
		req: Record<string, unknown>,
		res: Record<string, unknown>,
		next: () => void,
	): void;
}

function ksSession(): KsSession {
	return (keystone as unknown as { session: KsSession }).session;
}

describe('Keystone.session', function () {

	describe('keystone.session.signinWithUser()', function () {
		const res = { cookie: sinon.stub() };
		const onSuccess = sinon.stub();
		let user: Record<string, unknown>;
		let req: {
			user: Record<string, unknown> | null;
			session: {
				userId: string | null;
				regenerate: (cb: () => void) => void;
				reset?: sinon.SinonSpy;
			};
		};

		function resetMocks() {
			user = { id: 'USERID', password: 'PASSWORD' };
			req = {
				user: null,
				session: {
					userId: null,
					regenerate: function (callback: () => void) { callback(); },
				},
			};
		}

		before(function () {
			(keystone as unknown as { set(k: string, v: unknown): void }).set('cookie secret', 'SECRET');
			keystone.set('user model', 'User');
		});

		beforeEach(function () {
			resetMocks();
			sinon.spy(req.session, 'regenerate');
		});

		afterEach(function () {
			(req.session.regenerate as unknown as { reset(): void }).reset();
			res.cookie.reset();
			onSuccess.reset();
			keystone.set('cookie signin options', undefined);
		});

		describe('with valid args, "cookie signin" on', function () {
			it('should regenerate session, set user, session.userId, and res.cookie', function () {
				keystone.set('cookie signin', true);
				ksSession().signinWithUser(user, req as unknown as Record<string, unknown>, res, onSuccess);
				sinon.assert.calledOnce(req.session.regenerate as unknown as sinon.SinonSpy);
				expect(req.user).to.equal(user);
				expect(req.session.userId).to.equal(user['id']);
				sinon.assert.calledOnce(res.cookie);
				sinon.assert.calledWith(res.cookie, 'keystone.uid');
				expect(res.cookie.getCall(0).args[2]).to.include({
					signed: true,
					httpOnly: true,
					secure: true,
					sameSite: 'strict',
				});
				sinon.assert.calledOnce(onSuccess);
				sinon.assert.calledWithExactly(onSuccess, user);
			});

			it('should allow secure cookie settings to be overridden for local HTTP development', function () {
				keystone.set('cookie signin', true);
				keystone.set('cookie signin options', { secure: false, sameSite: 'lax' });
				ksSession().signinWithUser(user, req as unknown as Record<string, unknown>, res, onSuccess);

				expect(res.cookie.getCall(0).args[2]).to.include({
					secure: false,
					sameSite: 'lax',
				});
			});
		});

		describe('with valid args, "cookie signin" off', function () {
			it('should regenerate session, set user, session.userId', function () {
				keystone.set('cookie signin', false);
				ksSession().signinWithUser(user, req as unknown as Record<string, unknown>, res, onSuccess);
				sinon.assert.calledOnce(req.session.regenerate as unknown as sinon.SinonSpy);
				expect(req.user).to.equal(user);
				expect(req.session.userId).to.equal(user['id']);
				sinon.assert.callCount(res.cookie, 0);
				sinon.assert.calledOnce(onSuccess);
				sinon.assert.calledWithExactly(onSuccess, user);
			});
		});

		describe('with invalid args', function () {
			function siw(...args: unknown[]): void {
				(ksSession() as unknown as { signinWithUser(...a: unknown[]): void }).signinWithUser(...args);
			}
			it('should error when called less then 4 args', function () {
				expect(() => siw()).to.throw();
				expect(() => siw(user)).to.throw();
				expect(() => siw(user, req)).to.throw();
				expect(() => siw(user, req, res)).to.throw();
			});
			it('should error when user arg is not an object', function () {
				expect(() => siw('user', req, res, onSuccess)).to.throw();
			});
			it('should error when req arg is not an object', function () {
				expect(() => siw(user, 'req', res, onSuccess)).to.throw();
			});
			it('should error when res arg is not an object', function () {
				expect(() => siw(user, req, 'res', onSuccess)).to.throw();
			});
			it('should error when onSuccess arg is not a function', function () {
				expect(() => siw(user, req, res, 'onSuccess')).to.throw();
			});
		});
	});

	describe('keystone.session.signin()', function () {

		describe('case-insensitive email lookup', function () {
			// sinon.spy() creates a SinonSpy; `.reset()` is a sinon runtime alias
			// for `.resetHistory()`. Cast to `SinonSpy & { reset(): void }` to
			// avoid reaching for `any`.
			type SpyWithReset = sinon.SinonSpy & { reset(): void };
			const ctx: {
				onSuccess?: sinon.SinonStub;
				onFailure?: sinon.SinonStub;
				query?: { email: RegExp; match?: boolean };
				user?: Record<string, unknown>;
				User?: {
					model: {
						findOne: SpyWithReset;
						exec: SpyWithReset;
					};
				};
			} = {};

			before(function () {
				ctx.onSuccess = sinon.stub();
				ctx.onFailure = sinon.stub();
				ctx.User = {
					model: {
						findOne: sinon.spy(function (query: { email: RegExp }) {
							ctx.query = query;
							return ctx.User!.model;
						}) as unknown as SpyWithReset,
						exec: sinon.spy(function () {
							const email = 'test@test.com';
							ctx.query!.match = ctx.query!.email.test(email);
							if (ctx.query!.match) { return Promise.resolve(ctx.user); }
							return Promise.resolve(null);
						}) as unknown as SpyWithReset,
					},
				};
				ctx.user = {
					_: {
						password: {
							compare: sinon.spy(function (_password: unknown, callback: (err: null, ok: boolean) => void) {
								callback(null, true);
							}),
						},
					},
				};
				keystone.set('user model', 'User');
				// session.doSignin uses keystone.lists[userModel] (object index access),
				// not the deprecated keystone.list() function, so inject directly.
				(keystone as unknown as { lists: Record<string, unknown> }).lists['User'] = ctx.User;
				sinon.stub(ksSession() as unknown as Record<string, unknown>, 'signinWithUser').callsArg(3);
			});

			after(function () {
				delete (keystone as unknown as { lists: Record<string, unknown> }).lists['User'];
				(ksSession() as unknown as Record<string, { restore(): void }>)['signinWithUser']!.restore();
			});

			afterEach(function () {
				delete ctx.query;
				ctx.User!.model.findOne.reset();
				ctx.User!.model.exec.reset();
				ctx.onSuccess!.reset();
				ctx.onFailure!.reset();
				(ksSession() as unknown as Record<string, { resetHistory(): void }>)['signinWithUser']!.resetHistory();
			});

			it('should match email with mixed case', function (done) {
				const lookup = { email: 'Test@Test.Com', password: 'password' };
				ksSession().signin(lookup, null, null, function () {
					sinon.assert.calledOnce(ctx.User!.model.findOne);
					expect((ctx.User!.model.findOne.getCall(0).args[0] as Record<string, unknown>)['email']).to.be.an.instanceof(RegExp);
					sinon.assert.calledOnce(ctx.User!.model.exec);
					expect(ctx.User!.model.exec.calledAfter(ctx.User!.model.findOne)).to.be.true;
					sinon.assert.calledOnce((ksSession() as unknown as Record<string, sinon.SinonSpy>)['signinWithUser']!);
					done();
				}, ctx.onFailure!);
			});

			it('should not match email when invalid', function (done) {
				const lookup = { email: 'xxx', password: 'password' };
				ksSession().signin(lookup, null, null, ctx.onSuccess!, function (err: Error) {
					sinon.assert.notCalled(ctx.User!.model.findOne);
					sinon.assert.notCalled(ctx.User!.model.exec);
					expect(err).to.be.an.instanceof(Error);
					sinon.assert.notCalled((ksSession() as unknown as Record<string, sinon.SinonSpy>)['signinWithUser']!);
					done();
				});
			});

			it('should not match email when just a regex', function (done) {
				const lookup = { email: '\\.', password: 'password' };
				ksSession().signin(lookup, null, null, ctx.onSuccess!, function (err: Error) {
					sinon.assert.notCalled(ctx.User!.model.findOne);
					sinon.assert.notCalled(ctx.User!.model.exec);
					expect(err).to.be.an.instanceof(Error);
					sinon.assert.notCalled((ksSession() as unknown as Record<string, sinon.SinonSpy>)['signinWithUser']!);
					done();
				});
			});

			it('should fail with an Error when no user matches a valid email', function (done) {
				const lookup = { email: 'missing@example.com', password: 'password' };
				ksSession().signin(lookup, null, null, ctx.onSuccess!, function (err: Error) {
					sinon.assert.calledOnce(ctx.User!.model.findOne);
					sinon.assert.calledOnce(ctx.User!.model.exec);
					expect(err).to.be.an.instanceof(Error);
					expect(err.message).to.equal('Incorrect email or password');
					sinon.assert.notCalled(ctx.onSuccess!);
					sinon.assert.notCalled((ksSession() as unknown as Record<string, sinon.SinonSpy>)['signinWithUser']!);
					done();
				});
			});
		});
	});

	describe('keystone.session.signout()', function () {
		const res = { cookie: sinon.stub(), clearCookie: sinon.stub() };
		let user: Record<string, unknown>;
		let req: {
			user: Record<string, unknown> | null;
			session: {
				userId: string | null;
				regenerate: (cb: () => void) => void;
			};
		};

		function resetMocks() {
			user = { id: 'USERID', password: 'PASSWORD' };
			req = {
				user: null,
				session: {
					userId: null,
					regenerate: function (callback: () => void) { callback(); },
				},
			};
		}

		before(function () {
			(keystone as unknown as { set(k: string, v: unknown): void }).set('cookie secret', 'SECRET');
			keystone.set('user model', 'User');
		});

		beforeEach(function () {
			resetMocks();
			sinon.spy(req.session, 'regenerate');
		});

		afterEach(function () {
			(req.session.regenerate as unknown as { reset(): void }).reset();
			res.cookie.reset();
			res.clearCookie.reset();
			keystone.unhook('pre:signout');
			keystone.unhook('post:signout');
			keystone.set('cookie signin options', undefined);
		});

		it('should unset user, session.userId and cookie', function () {
			keystone.set('cookie signin', true);
			ksSession().signinWithUser(user, req as unknown as Record<string, unknown>, res, function () {
				ksSession().signout(req as unknown as Record<string, unknown>, res, function () {
					expect(req.user).to.be.null;
					expect(req.session.userId).to.be.null;
					sinon.assert.calledOnce(res.clearCookie);
					sinon.assert.calledWith(res.clearCookie, 'keystone.uid');
					expect(res.clearCookie.getCall(0).args[1]).to.include({
						signed: true,
						httpOnly: true,
						secure: true,
						sameSite: 'strict',
						maxAge: 0,
					});
				});
			});
		});

		it('should abort signout when pre:signout fails', function (done) {
			const error = new Error('stop signout');
			req.user = user;
			req.session.userId = user['id'] as string;
			keystone.pre('signout', (function (next: (err?: Error) => void) {
				next(error);
			}) as unknown as HookMiddleware);

			ksSession().signout(req as unknown as Record<string, unknown>, res, function (err?: Error) {
				expect(err).to.equal(error);
				expect(req.user).to.equal(user);
				expect(req.session.userId).to.equal(user['id']);
				sinon.assert.notCalled(res.clearCookie);
				sinon.assert.notCalled(req.session.regenerate as unknown as sinon.SinonSpy);
				done();
			});
		});
	});

	describe('keystone.session.keystoneAuth()', function () {
		function createAuthResponse() {
			const res = {
				status: sinon.stub(),
				json: sinon.stub(),
				redirect: sinon.stub(),
			};
			res.status.returns(res);
			return res;
		}

		function createJsonAuthRequest(user: Record<string, unknown> | null) {
			return {
				user,
				headers: { accept: 'application/json' },
				originalUrl: '/keystone/users',
			};
		}

		it('allows access when canAccessKeystone is a true virtual value', function () {
			const req = createJsonAuthRequest({ id: 'USERID', canAccessKeystone: true });
			const res = createAuthResponse();
			const next = sinon.stub();

			ksSession().keystoneAuth(req, res, next);

			sinon.assert.calledOnce(next);
			sinon.assert.notCalled(res.status);
			sinon.assert.notCalled(res.json);
		});

		it('calls canAccessKeystone methods with the user as this', function () {
			let calledWithUser = false;
			const user = {
				id: 'USERID',
				canAccessKeystone(this: Record<string, unknown>) {
					calledWithUser = this === user;
					return true;
				},
			};
			const req = createJsonAuthRequest(user);
			const res = createAuthResponse();
			const next = sinon.stub();

			ksSession().keystoneAuth(req, res, next);

			expect(calledWithUser).to.equal(true);
			sinon.assert.calledOnce(next);
			sinon.assert.notCalled(res.status);
			sinon.assert.notCalled(res.json);
		});

		it('denies signed-in users when a canAccessKeystone method returns false', function () {
			const req = createJsonAuthRequest({
				id: 'USERID',
				canAccessKeystone() {
					return false;
				},
			});
			const res = createAuthResponse();
			const next = sinon.stub();

			ksSession().keystoneAuth(req, res, next);

			sinon.assert.notCalled(next);
			sinon.assert.calledWithExactly(res.status, 403);
			sinon.assert.calledWithExactly(res.json, { error: 'not authorised' });
		});
	});
});
