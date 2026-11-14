import { expect } from 'chai';
import mongoose from 'mongoose';
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
const { Binary, Code, DBRef, Decimal128, ObjectId } = mongoose.mongo;

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
	describe('BSON values that carry nested data', function () {
		const refId = new ObjectId('64b7f0c2a1b2c3d4e5f60718');
		// Password paths written the way the stored document is structured.
		const refUserList = {
			fields: {
				email: { type: 'email' },
				'value.fields.hidden': { type: 'password' },
				'code.scope.inner.fields.hidden': { type: 'password' },
			} as Record<string, unknown>,
		};
		const refPostList = {
			fields: {
				title: { type: 'text' },
				author: { type: 'relationship', refList: refUserList },
			} as Record<string, unknown>,
		};
		const storedUser = () => ({
			_id: 'u1',
			email: 'ada@example.com',
			value: new DBRef('public', refId, undefined, { hidden: BCRYPT_HASH, keep: 1 }),
			code: new Code('function () {}', { inner: new DBRef('public', refId, undefined, { hidden: BCRYPT_HASH, keep: 2 }) }),
		});
		const safeUser = {
			_id: 'u1',
			email: 'ada@example.com',
			value: { $ref: 'public', $id: String(refId), keep: 1 },
			code: { code: 'function () {}', scope: { inner: { $ref: 'public', $id: String(refId), keep: 2 } } },
		};

		it('removes a Password path stored in a DBRef\'s extra fields', function () {
			const user = storedUser();
			const result = toJSONWithoutPasswordFields(refUserList, { _id: user._id, email: user.email, value: user.value });
			expect(JSON.stringify(result)).to.not.include('$2');
			expect(result).to.deep.equal({ _id: 'u1', email: 'ada@example.com', value: safeUser.value });
			// The DBRef itself is not mutated.
			expect((user.value.fields as Record<string, unknown>)['hidden']).to.equal(BCRYPT_HASH);
		});

		it('removes a Password path stored in a DBRef inside a Code scope', function () {
			const user = storedUser();
			const result = toJSONWithoutPasswordFields(refUserList, { _id: user._id, code: user.code });
			expect(JSON.stringify(result)).to.not.include('$2');
			expect(result).to.deep.equal({ _id: 'u1', code: safeUser.code });
		});

		it('removes them from a populated relationship', function () {
			const post = { toJSON: () => ({ _id: 'p1', title: 'Hello', author: storedUser() }) };
			const result = toJSONWithoutPasswordFields(refPostList, post);
			expect(JSON.stringify(result)).to.not.include('$2');
			expect(result).to.deep.equal({ _id: 'p1', title: 'Hello', author: safeUser });
		});

		it('still removes a Password path written in the flattened JSON form of a DBRef', function () {
			const list = { fields: { 'value.hidden': { type: 'password' } } as Record<string, unknown> };
			const result = toJSONWithoutPasswordFields(list, { value: storedUser().value });
			expect(result).to.deep.equal({ value: safeUser.value });
		});

		it('serializes everything else exactly as JSON.stringify does', function () {
			const value = {
				_id: refId,
				when: new Date('2024-01-02T03:04:05.006Z'),
				amount: Decimal128.fromString('12.50'),
				blob: new Binary(Buffer.from('keystone')),
				ref: new DBRef('public', refId, 'otherdb', { keep: 1, nested: { deep: [1, 'two'] } }),
				refNoFields: new DBRef('public', refId),
				code: new Code('function () { return x; }', { x: 1, inner: new DBRef('public', refId, undefined, { keep: 3 }) }),
				codeNoScope: new Code('function () {}'),
				list: [refId, new Date(0), null, undefined, () => 1, Symbol('s')],
				boxed: [Object(1), Object('s'), Object(true)],
				skipped: undefined,
				doc: { toJSON: (key: string) => ({ key, title: 'Hello' }) },
			};
			Object.defineProperty(value, '__proto__', { value: { own: 'property' }, enumerable: true });
			const expected = JSON.stringify(value);
			// None of the lists' Password paths match, so nothing may change.
			for (const list of [refUserList, refPostList, userList, undefined]) {
				expect(JSON.stringify(toJSONWithoutPasswordFields(list, value))).to.equal(expected);
				expect(JSON.stringify(toJSONWithoutPasswordFields(list, [value, value]))).to.equal(JSON.stringify([value, value]));
			}
		});
	});

	describe('caller-named parents of a Password path', function () {
		const refId = new ObjectId('64b7f0c2a1b2c3d4e5f60718');
		const parentList = {
			fields: {
				title: { type: 'text', path: 'title', options: {}, format: () => 'Hello', getData: () => 'Hello' },
				'profile.pin': { type: 'password' },
				// Written in the flattened JSON form of the DBRef stored there.
				'ref.hidden': { type: 'password' },
				'code.scope.inner.hidden': { type: 'password' },
			} as Record<string, unknown>,
			options: {},
			getDocumentName: () => 'Hello',
		};
		const stored: Record<string, unknown> = {
			title: 'Hello',
			profile: { pin: BCRYPT_HASH, bio: 'hi' },
			ref: new DBRef('public', refId, undefined, { hidden: BCRYPT_HASH, keep: 1 }),
			code: new Code('function () {}', { inner: new DBRef('public', refId, undefined, { hidden: BCRYPT_HASH, keep: 2 }) }),
			other: { plain: 'yes' },
		};
		/** Reads a dotted path by property access, as Mongoose does for these values. */
		const item = {
			id: 'p1',
			get(path: string): unknown {
				let current: unknown = stored;
				for (const segment of path.split('.')) {
					if (current === null || typeof current !== 'object') return undefined;
					current = (current as Record<string, unknown>)[segment];
				}
				return current;
			},
		};
		const refused = ['profile', 'ref', 'ref.fields', 'code', 'code.scope', 'code.scope.inner', 'code.scope.inner.fields'];
		const allowed = ['title', 'profile.bio', 'other', 'other.plain'];

		it('isSensitivePath refuses a parent of a Password path', function () {
			expect(isSensitivePath(parentList, 'profile')).to.equal(true);
			expect(isSensitivePath(parentList, 'code.scope')).to.equal(true);
			expect(isSensitivePath(parentList, 'profile.bio')).to.equal(false);
			expect(isSensitivePath(parentList, 'prof')).to.equal(false);
			expect(isSensitivePath(postList, 'author.profile')).to.equal(true);
		});

		it('isSensitivePath refuses a path through a DBRef or Code scope above a Password path', function () {
			const read = (path: string) => item.get(path);
			expect(isSensitivePath(parentList, 'ref.fields', read)).to.equal(true);
			expect(isSensitivePath(parentList, 'code.scope.inner.fields', read)).to.equal(true);
			// Without a reader the structure is unknown.
			expect(isSensitivePath(parentList, 'ref.fields')).to.equal(false);
			for (const path of allowed) expect(isSensitivePath(parentList, path, read), path).to.equal(false);
		});

		it('getData', function () {
			const data = getData.call(parentList as never, item as never, [...refused, ...allowed]);
			expect(JSON.stringify(data)).to.not.include('$2');
			const fields = data['fields'] as Record<string, unknown>;
			expect(fields).to.not.have.any.keys(...refused);
			expect(fields).to.deep.equal({ title: 'Hello', 'profile.bio': 'hi', other: { plain: 'yes' }, 'other.plain': 'yes' });
		});

		it('getCSVData', function () {
			const data = getCSVData.call(parentList as never, item, { fields: [...refused, ...allowed] });
			expect(JSON.stringify(data)).to.not.include('$2');
			expect(data).to.not.have.any.keys(...refused);
			expect(data).to.deep.equal({ id: 'p1', title: 'Hello', 'profile.bio': 'hi', otherPlain: 'yes', 'other.plain': 'yes' });
		});

		it('getData and getCSVData refuse a value holding a populated document below its top level', function () {
			const admin = hydrated({ _id: 'u1', email: 'ada@example.com', secret: BCRYPT_HASH });
			const nestedItem = { id: 'p1', get: (path: string) => (path === 'meta' ? { author: admin } : undefined) };
			const list = { fields: {}, options: {}, getDocumentName: () => 'Hello' };
			expect(getData.call(list as never, nestedItem as never, ['meta'])['fields']).to.deep.equal({});
			expect(getCSVData.call(list as never, nestedItem, { fields: ['meta'] })).to.deep.equal({ id: 'p1' });
		});
	});
});
