import keystone from 'keystone';
import mongoose from 'mongoose';
import sinon from 'sinon';
import { expect } from 'chai';

// A session or cookie user id that
// cannot be cast to the user list's `_id` type means "signed out", not a 500.

interface KsSession {
	signin(lookup: string, req: unknown, res: unknown, onSuccess: () => void, onFailure: (err: Error | null) => void): void;
	persist(req: unknown, res: unknown, next: (err?: unknown) => void): void;
}

function ksSession(): KsSession {
	return (keystone as unknown as { session: KsSession }).session;
}

const kinds = [
	{
		name: 'ObjectId',
		model: { modelName: 'SessionIdCastUnitObjectId', schema: new mongoose.Schema({ email: String }) as unknown },
		uncastable: 'not-an-objectid',
		missing: '507f1f77bcf86cd799439011',
	},
	{
		name: 'Number',
		model: { modelName: 'SessionIdCastUnitNumber', schema: new mongoose.Schema({ _id: Number, email: String }) as unknown },
		uncastable: 'not-a-number',
		missing: '42',
	},
	{
		name: 'String',
		model: { modelName: 'SessionIdCastUnitString', schema: new mongoose.Schema({ _id: String, email: String }) as unknown },
		uncastable: undefined,
		missing: 'no-such-user',
	},
];

describe('Keystone.session: user ids that cannot be cast to the user _id type', function () {
	const lists = (keystone as unknown as { lists: Record<string, unknown> }).lists;
	let previousUserModel: unknown;
	let previousUserList: unknown;
	let previousCookieSignin: unknown;

	before(function () {
		previousUserModel = keystone.get('user model');
		previousCookieSignin = keystone.get('cookie signin');
		previousUserList = lists['SessionIdCastUser'];
		keystone.set('user model', 'SessionIdCastUser');
	});

	after(function () {
		keystone.set('user model', previousUserModel as string);
		keystone.set('cookie signin', previousCookieSignin as boolean);
		if (previousUserList === undefined) delete lists['SessionIdCastUser'];
		else lists['SessionIdCastUser'] = previousUserList;
	});

	function persist(req: Record<string, unknown>): Promise<unknown[]> {
		return new Promise((resolve) => {
			ksSession().persist(req, { clearCookie: sinon.stub() }, function (...args: unknown[]) { resolve(args); });
		});
	}

	for (const kind of kinds) {
		describe(kind.name + ' user _id', function () {
			let findById: sinon.SinonStub;

			beforeEach(function () {
				// The real `_id` schema type, with a stubbed lookup that finds nobody.
				findById = sinon.stub().returns({ exec: () => Promise.resolve(null) });
				lists['SessionIdCastUser'] = { model: { schema: kind.model.schema, findById } };
				keystone.set('cookie signin', false);
			});

			if (kind.uncastable !== undefined) {
				const uncastable = kind.uncastable;

				it('persist() treats an uncastable session user id as signed out', async function () {
					const req: Record<string, unknown> = { session: { userId: uncastable }, signedCookies: {} };
					const args = await persist(req);

					expect(args, 'next() is called without an error').to.deep.equal([]);
					expect(req['user']).to.equal(null);
					sinon.assert.notCalled(findById);
				});

				it('persist() treats an uncastable cookie user id as signed out and clears the cookie', async function () {
					keystone.set('cookie signin', true);
					const clearCookie = sinon.stub();
					const req: Record<string, unknown> = { session: {}, signedCookies: { 'keystone.uid': uncastable + ':hash' } };
					const args = await new Promise<unknown[]>((resolve) => {
						ksSession().persist(req, { clearCookie }, function (...nextArgs: unknown[]) { resolve(nextArgs); });
					});

					expect(args).to.deep.equal([]);
					expect(req['user']).to.equal(null);
					sinon.assert.calledOnce(clearCookie);
					sinon.assert.calledWith(clearCookie, 'keystone.uid');
					sinon.assert.notCalled(findById);
				});

				it('signin() by an uncastable user id fails as an unknown user', function (done) {
					ksSession().signin(uncastable, {}, {}, function () {
						done(new Error('signin must not succeed'));
					}, function (err) {
						expect(err).to.be.an.instanceof(Error);
						expect(err?.message).to.equal('Incorrect user or password');
						expect(err?.name).to.equal('Error');
						sinon.assert.notCalled(findById);
						done();
					});
				});
			}

			it('persist() still looks up a well-formed session user id and signs out when it is gone', async function () {
				const req: Record<string, unknown> = { session: { userId: kind.missing }, signedCookies: {} };
				const args = await persist(req);

				expect(args).to.deep.equal([]);
				expect(req['user']).to.equal(null);
				sinon.assert.calledOnce(findById);
				sinon.assert.calledWithExactly(findById, kind.missing);
			});

			it('persist() still passes any other lookup failure to next()', async function () {
				const failure = new Error('connection lost');
				findById.returns({ exec: () => Promise.reject(failure) });
				const req: Record<string, unknown> = { session: { userId: kind.missing }, signedCookies: {} };
				const args = await persist(req);

				expect(args).to.deep.equal([failure]);
			});
		});
	}
});
