import mongoose from 'mongoose';
import { expect } from 'chai';
import { projectSessionUser, projectSessionUserFor } from 'keystone/lib/sessionUserProjection';

const BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

type TestUser = Parameters<typeof projectSessionUser>[0];

function asUser(user: Record<string, unknown>): TestUser {
	return user as unknown as TestUser;
}

function createUserList(overrides: Record<string, unknown> = {}) {
	return {
		namePath: 'name',
		fields: {
			name: { type: 'name' },
			email: { type: 'email' },
			password: { type: 'password' },
		} as Record<string, unknown>,
		getDocumentName(doc: Record<string, unknown>): string {
			const name = doc['name'] as { first?: string; last?: string };
			return `${name.first ?? ''} ${name.last ?? ''}`.trim();
		},
		...overrides,
	};
}

describe('lib/sessionUserProjection', function () {
	describe('projectSessionUser()', function () {
		it('returns undefined when there is no user', function () {
			expect(projectSessionUser(null, createUserList())).to.equal(undefined);
			expect(projectSessionUser(undefined)).to.equal(undefined);
		});

		it('only emits the allowlisted fields', function () {
			const projection = projectSessionUser(asUser({
				id: 'u1',
				_id: 'u1',
				name: { first: 'Ada', last: 'Lovelace' },
				email: 'ada@example.com',
				password: BCRYPT_HASH,
				isAdmin: true,
				canAccessKeystone: true,
				resetPasswordKey: 'secret-reset-key',
			}), createUserList());

			expect(projection).to.deep.equal({
				id: 'u1',
				name: 'Ada Lovelace',
				email: 'ada@example.com',
				canAccessKeystone: true,
			});
		});

		it('never includes a Password-type field, whatever it is called', function () {
			const list = createUserList({
				fields: {
					name: { type: 'name' },
					email: { type: 'email' },
					secret: { type: 'password' },
				},
			});
			const projection = projectSessionUser(asUser({
				id: 'u1',
				name: { first: 'Ada', last: 'Lovelace' },
				email: 'ada@example.com',
				secret: BCRYPT_HASH,
				password: BCRYPT_HASH,
			}), list);

			expect(projection).to.not.have.property('secret');
			expect(projection).to.not.have.property('password');
			expect(JSON.stringify(projection)).to.not.include('$2');
		});

		it('drops name and email when those paths are Password-type fields', function () {
			const list = createUserList({
				fields: { name: { type: 'password' }, email: { type: 'password' } },
				getDocumentName: () => BCRYPT_HASH,
			});
			const projection = projectSessionUser(asUser({ id: 'u1', name: BCRYPT_HASH, email: BCRYPT_HASH }), list);

			expect(projection).to.deep.equal({ id: 'u1' });
		});

		it('drops hash-looking values even when the field type is not password', function () {
			const list = createUserList({
				fields: { name: { type: 'text' }, email: { type: 'text' } },
				getDocumentName: () => BCRYPT_HASH,
			});
			const projection = projectSessionUser(asUser({ id: 'u1', name: BCRYPT_HASH, email: BCRYPT_HASH }), list);

			expect(projection).to.deep.equal({ id: 'u1' });
		});

		it('stringifies an ObjectId _id when there is no id virtual', function () {
			const objectId = new mongoose.Types.ObjectId();
			const projection = projectSessionUser(asUser({ _id: objectId }), createUserList({ getDocumentName: () => '' }));

			expect(projection?.id).to.be.a('string');
			expect(projection?.id).to.equal(objectId.toHexString());
		});

		it('uses a String _id as the id', function () {
			const projection = projectSessionUser(asUser({ _id: 'custom-string-id' }));

			expect(projection).to.deep.equal({ id: 'custom-string-id' });
		});

		it('prefers the id virtual over _id', function () {
			const objectId = new mongoose.Types.ObjectId();
			const projection = projectSessionUser(asUser({ id: objectId.toHexString(), _id: objectId }));

			expect(projection?.id).to.equal(objectId.toHexString());
		});

		it('formats the name through the list name field', function () {
			const projection = projectSessionUser(
				asUser({ id: 'u1', name: { first: 'Grace', last: 'Hopper' } }),
				createUserList()
			);

			expect(projection?.name).to.equal('Grace Hopper');
		});

		it('falls back to a plain name when no list is available', function () {
			expect(projectSessionUser(asUser({ id: 'u1', name: ' Ada ' }))?.name).to.equal('Ada');
			expect(projectSessionUser(asUser({ id: 'u1', name: { first: 'Ada', last: 'Lovelace' } }))?.name)
				.to.equal('Ada Lovelace');
		});

		it('falls back to the plain name when getDocumentName throws', function () {
			const list = createUserList({ getDocumentName: () => { throw new Error('boom'); } });
			const projection = projectSessionUser(asUser({ id: 'u1', name: { first: 'Ada' } }), list);

			expect(projection?.name).to.equal('Ada');
		});

		it('omits the name when the list has no name field (namePath is _id)', function () {
			const list = createUserList({ namePath: '_id', fields: {}, getDocumentName: () => 'u1' });
			const projection = projectSessionUser(asUser({ id: 'u1', email: 'ada@example.com' }), list);

			expect(projection).to.deep.equal({ id: 'u1', email: 'ada@example.com' });
		});

		it('resolves canAccessKeystone from boolean and method shapes, and omits it when absent', function () {
			expect(projectSessionUser(asUser({ id: 'u1', canAccessKeystone: false }))?.canAccessKeystone).to.equal(false);
			expect(projectSessionUser(asUser({ id: 'u1', canAccessKeystone: () => true }))?.canAccessKeystone).to.equal(true);
			expect(projectSessionUser(asUser({ id: 'u1' }))).to.not.have.property('canAccessKeystone');
		});
	});

	describe('projectSessionUserFor()', function () {
		it('resolves the configured user list from the keystone instance', function () {
			const keystone = {
				get: (key: string) => (key === 'user model' ? 'User' : undefined),
				lists: { User: createUserList() },
			};
			const projection = projectSessionUserFor(keystone, asUser({
				id: 'u1',
				name: { first: 'Ada', last: 'Lovelace' },
				password: BCRYPT_HASH,
			}));

			expect(projection).to.deep.equal({ id: 'u1', name: 'Ada Lovelace' });
		});

		it('still projects when no user model is configured', function () {
			const projection = projectSessionUserFor({ get: () => undefined }, asUser({ id: 'u1', password: BCRYPT_HASH }));

			expect(projection).to.deep.equal({ id: 'u1' });
		});
	});
});
