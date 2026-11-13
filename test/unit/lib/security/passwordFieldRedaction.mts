import { expect } from 'chai';
import {
	getPasswordFieldPaths,
	isHydratedDocument,
	isPasswordField,
	isSensitivePath,
	toJSONWithoutPasswordFields,
	withoutPasswordFields,
} from 'keystone/lib/security/passwordFieldRedaction';
import getData from 'keystone/lib/list/getData';
import getCSVData from 'keystone/lib/list/getCSVData';
import RelationshipType from 'keystone/fields/types/relationship/RelationshipType';

const BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

const userList = {
	fields: {
		name: { type: 'name' },
		email: { type: 'email' },
		// Deliberately not called "password": detection is by type.
		secret: { type: 'password' },
		'profile.pin': { type: 'password' },
	} as Record<string, unknown>,
};

const postList = {
	fields: {
		title: { type: 'text' },
		author: { type: 'relationship', refList: userList },
		editors: { type: 'relationship', many: true, refList: userList },
		orphan: { type: 'relationship' },
	} as Record<string, unknown>,
};

/** Minimal stand-in for a hydrated Mongoose document. */
function hydrated(data: Record<string, unknown>) {
	return {
		$__: {},
		...data,
		toObject(): Record<string, unknown> { return JSON.parse(JSON.stringify(data)) as Record<string, unknown>; },
	};
}

describe('lib/security/passwordFieldRedaction', function () {
	it('detects Password-type fields by type, not by name', function () {
		expect(isPasswordField(userList, 'secret')).to.equal(true);
		expect(isPasswordField(userList, 'email')).to.equal(false);
		expect(isPasswordField(userList, 'password')).to.equal(false);
		expect(isPasswordField(userList, 'toString')).to.equal(false);
		expect(isPasswordField(undefined, 'secret')).to.equal(false);
		expect(getPasswordFieldPaths(userList)).to.deep.equal(['secret', 'profile.pin']);
	});

	it('flags paths that address or reach a Password-type field', function () {
		expect(isSensitivePath(userList, 'secret')).to.equal(true);
		expect(isSensitivePath(userList, 'secret.hash')).to.equal(true);
		expect(isSensitivePath(userList, 'profile.pin')).to.equal(true);
		expect(isSensitivePath(userList, 'name.first')).to.equal(false);
		expect(isSensitivePath(userList, 'createdAt')).to.equal(false);
	});

	it('flags paths that reach through a relationship into a hash or a raw document', function () {
		expect(isSensitivePath(postList, 'author.secret')).to.equal(true);
		expect(isSensitivePath(postList, 'editors.secret')).to.equal(true);
		expect(isSensitivePath(postList, 'editors.0.secret')).to.equal(true);
		expect(isSensitivePath(postList, 'editors.0.profile.pin')).to.equal(true);
		// Whole related documents.
		expect(isSensitivePath(postList, 'editors.0')).to.equal(true);
		// Unknown related list: cannot be vetted, so refused.
		expect(isSensitivePath(postList, 'orphan.anything')).to.equal(true);
		expect(isSensitivePath(postList, 'author.email')).to.equal(false);
		expect(isSensitivePath(postList, 'title')).to.equal(false);
	});

	it('recognises hydrated documents', function () {
		expect(isHydratedDocument(hydrated({ _id: 'u1' }))).to.equal(true);
		expect(isHydratedDocument({ _id: 'u1' })).to.equal(false);
		expect(isHydratedDocument('u1')).to.equal(false);
		expect(isHydratedDocument(null)).to.equal(false);
	});

	it('strips every Password-type field from documents and plain objects', function () {
		const data = {
			_id: 'u1',
			email: 'ada@example.com',
			secret: BCRYPT_HASH,
			profile: { pin: BCRYPT_HASH, bio: 'hi' },
		};
		for (const doc of [hydrated(data), data]) {
			const safe = withoutPasswordFields(userList, doc);
			expect(safe).to.deep.equal({ _id: 'u1', email: 'ada@example.com', profile: { bio: 'hi' } });
			expect(JSON.stringify(safe)).to.not.include('$2');
		}
		// The source object is not mutated.
		expect(data.secret).to.equal(BCRYPT_HASH);
	});

	it('redacts the JSON form of a value, following populated relationships', function () {
		const user = { _id: 'u1', email: 'ada@example.com', secret: BCRYPT_HASH, profile: { pin: BCRYPT_HASH, bio: 'hi' } };
		const safeUser = { _id: 'u1', email: 'ada@example.com', profile: { bio: 'hi' } };
		// Serialization goes through toJSON, like res.json.
		const post = { toJSON: () => ({ _id: 'p1', title: 'Hello', author: user, editors: [user, 'u2'], orphan: { secret: 'kept' } }) };

		expect(toJSONWithoutPasswordFields(postList, post)).to.deep.equal({
			_id: 'p1',
			title: 'Hello',
			author: safeUser,
			editors: [safeUser, 'u2'],
			// No known related list, so nothing identifies a Password-type field there.
			orphan: { secret: 'kept' },
		});
		expect(toJSONWithoutPasswordFields(userList, [user, user])).to.deep.equal([safeUser, safeUser]);
		// Unpopulated ids, primitives and absent values pass through.
		expect(toJSONWithoutPasswordFields(postList, { author: 'u1', editors: ['u1'] })).to.deep.equal({ author: 'u1', editors: ['u1'] });
		expect(toJSONWithoutPasswordFields(userList, 'text')).to.equal('text');
		expect(toJSONWithoutPasswordFields(userList, null)).to.equal(null);
		expect(toJSONWithoutPasswordFields(userList, undefined)).to.equal(undefined);
		// The source object is not mutated.
		expect(user.secret).to.equal(BCRYPT_HASH);
	});

	describe('list serializers never emit a hash or secret path', function () {
		const admin = hydrated({ _id: 'u1', id: 'u1', email: 'ada@example.com', secret: BCRYPT_HASH });
		const values: Record<string, unknown> = {
			'title': 'Hello',
			'author': admin,
			'editors': [admin],
			'editors.0': admin,
			'author.secret': BCRYPT_HASH,
			'editors.secret': [BCRYPT_HASH],
			'editors.0.secret': BCRYPT_HASH,
			'author.email': 'ada@example.com',
		};
		const item = { id: 'p1', get: (path: string) => values[path] };
		const paths = Object.keys(values);
		const list = {
			...postList,
			options: {},
			getDocumentName: () => 'Hello',
		};

		it('getData', function () {
			const relationshipProto = RelationshipType.prototype as unknown as { getData(this: unknown, i: typeof item): unknown };
			function relationshipGetData(this: unknown, i: typeof item): unknown {
				return relationshipProto.getData.call(this, i);
			}
			const dataList = {
				...list,
				fields: {
					title: { type: 'text', getData: (i: typeof item) => i.get('title') },
					author: { type: 'relationship', path: 'author', many: false, refList: userList, getData: relationshipGetData },
					editors: { type: 'relationship', path: 'editors', many: true, refList: userList, getData: relationshipGetData },
				},
			};
			const data = getData.call(dataList as never, item, paths);
			expect(JSON.stringify(data)).to.not.include('$2');
			expect(JSON.stringify(data)).to.not.include('secret');
			const fields = data['fields'] as Record<string, unknown>;
			expect(fields).to.not.have.any.keys('editors.0', 'author.secret', 'editors.secret', 'editors.0.secret');
			expect(fields['title']).to.equal('Hello');
			expect(fields['author.email']).to.equal('ada@example.com');
		});

		it('getCSVData', function () {
			const csvList = {
				...list,
				fields: {
					title: { type: 'text', path: 'title', options: {}, format: (i: typeof item) => i.get('title') },
					author: { type: 'relationship', path: 'author', refList: userList, options: {}, format: () => 'u1' },
					editors: { type: 'relationship', path: 'editors', many: true, refList: userList, options: {}, format: () => 'u1' },
				},
			};
			const data = getCSVData.call(csvList as never, item, { fields: paths });
			expect(JSON.stringify(data)).to.not.include('$2');
			expect(data).to.not.have.any.keys('editors.0', 'author.secret', 'editors.secret', 'editors.0.secret');
			expect(data['author.email']).to.equal('ada@example.com');
		});
		it('populated Relationship fields (getData and format)', function () {
			const proto = RelationshipType.prototype as unknown as {
				getData(this: unknown, i: typeof item): unknown;
				format(this: unknown, i: typeof item): string;
			};
			const single = { path: 'author', many: false, refList: userList };
			const many = { path: 'editors', many: true, refList: userList };

			expect(proto.getData.call(single, item)).to.deep.equal({ _id: 'u1', id: 'u1', email: 'ada@example.com' });
			expect(proto.getData.call(many, item)).to.deep.equal([{ _id: 'u1', id: 'u1', email: 'ada@example.com' }]);
			expect(proto.format.call(single, item)).to.equal('u1');
			expect(proto.format.call(many, item)).to.equal('u1');

			// Unpopulated ids pass through untouched.
			const idItem = { id: 'p1', get: (path: string) => (path === 'editors' ? ['u1', 'u2'] : 'u1') };
			expect(proto.getData.call(single, idItem)).to.equal('u1');
			expect(proto.getData.call(many, idItem)).to.deep.equal(['u1', 'u2']);
			expect(proto.format.call(many, idItem)).to.equal('u1, u2');
		});
	});
});
