import { expect } from 'chai';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import type { KeystoneList } from 'keystone';
import apiForGet from 'keystone/lib/list/apiForGet';
import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';

const BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

type Options = Parameters<typeof apiForGet>[0];
type Sent = { status: number; body: unknown };

// Real Mongoose documents (never saved), so the response goes through the same
// toJSON serialization an application would get.
const UserModel = mongoose.model('ApiForGetUnitUser', new mongoose.Schema({
	name: { first: String, last: String },
	email: String,
	// Deliberately not called "password": detection is by field type.
	secret: String,
	profile: { pin: String, bio: String },
}));
const SlugUserModel = mongoose.model('ApiForGetUnitSlugUser', new mongoose.Schema({
	_id: String,
	email: String,
	secret: String,
}));
const PostModel = mongoose.model('ApiForGetUnitPost', new mongoose.Schema({
	title: String,
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiForGetUnitUser' },
	editors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ApiForGetUnitUser' }],
}));

const userFields = {
	name: { type: 'name' },
	email: { type: 'email' },
	secret: { type: 'password' },
	'profile.pin': { type: 'password' },
};
const userList = { fields: userFields };
const postFields = {
	title: { type: 'text' },
	author: { type: 'relationship', refList: userList },
	editors: { type: 'relationship', many: true, refList: userList },
};

/** A list stub whose `model.findById` resolves `docs[id]`. */
function listFor(fields: Record<string, unknown>, docs: Record<string, unknown>) {
	const wheres: Array<Record<string, unknown>> = [];
	const list = {
		fields,
		model: {
			findById(id: string) {
				return {
					where(query: Record<string, unknown>) { wheres.push(query); },
					exec: () => Promise.resolve(docs[id] ?? null),
				};
			},
		},
	} as unknown as KeystoneList;
	return { list, wheres };
}

/** Runs the middleware and resolves with what it sent, parsed back from the JSON wire form. */
function run(list: KeystoneList, options: Options, params: Record<string, string>): Promise<Sent> {
	return new Promise((resolve) => {
		let status = 200;
		const res = {
			status(code: number) { status = code; return res; },
			json(body: unknown) { resolve({ status, body: JSON.parse(JSON.stringify(body)) as unknown }); return res; },
		};
		const handler = options === undefined ? apiForGet.call(list) : apiForGet.call(list, options);
		handler({ params } as unknown as Request, res as unknown as Response, () => undefined);
	});
}

describe('List.apiForGet', function () {
	const user = new UserModel({
		name: { first: 'Ada', last: 'Lovelace' },
		email: 'ada@example.com',
		secret: BCRYPT_HASH,
		profile: { pin: BCRYPT_HASH, bio: 'hi' },
	});
	const userId = String(user._id);

	it('omits Password-type fields and leaves every other field intact', async function () {
		const { list } = listFor(userFields, { [userId]: user });
		const sent = await run(list, undefined, { id: userId });

		expect(sent.status).to.equal(200);
		expect(JSON.stringify(sent.body)).to.not.include('$2');
		// Exactly the document's own JSON form, minus the Password-type paths.
		const expected = JSON.parse(JSON.stringify(user)) as { secret?: unknown; profile: { pin?: unknown } };
		delete expected.secret;
		delete expected.profile.pin;
		expect(sent.body).to.deep.equal({ data: expected });
		expect(sent.body).to.deep.equal({
			data: {
				_id: userId,
				name: { first: 'Ada', last: 'Lovelace' },
				email: 'ada@example.com',
				profile: { bio: 'hi' },
			},
		});
		// The document itself is not mutated.
		expect(user.get('secret')).to.equal(BCRYPT_HASH);
	});

	it('works for a list with a String _id', async function () {
		const slugUser = new SlugUserModel({ _id: 'ada-lovelace', email: 'ada@example.com', secret: BCRYPT_HASH });
		const { list } = listFor(userFields, { 'ada-lovelace': slugUser });
		const sent = await run(list, undefined, { id: 'ada-lovelace' });

		expect(sent.status).to.equal(200);
		expect(sent.body).to.deep.equal({ data: { _id: 'ada-lovelace', email: 'ada@example.com' } });
	});

	it('redacts populated relationships to a list with a Password-type field', async function () {
		const post = new PostModel({ title: 'Hello' });
		// Populated paths hold hydrated related documents.
		post.$set('author', user);
		post.$set('editors', [user]);
		expect(post.populated('author'), 'fixture: author is populated').to.be.ok;
		const postId = String(post._id);
		const { list } = listFor(postFields, { [postId]: post });
		const sent = await run(list, undefined, { id: postId });

		expect(JSON.stringify(sent.body)).to.not.include('$2');
		const safeUser = { _id: userId, name: { first: 'Ada', last: 'Lovelace' }, email: 'ada@example.com', profile: { bio: 'hi' } };
		expect(sent.body).to.deep.equal({
			data: { _id: postId, title: 'Hello', author: safeUser, editors: [safeUser] },
		});
	});

	it('leaves unpopulated relationship ids untouched', async function () {
		const post = new PostModel({ title: 'Hello', author: user._id, editors: [user._id] });
		const postId = String(post._id);
		const { list } = listFor(postFields, { [postId]: post });
		const sent = await run(list, undefined, { id: postId });

		expect(sent.body).to.deep.equal({ data: { _id: postId, title: 'Hello', author: userId, editors: [userId] } });
	});

	it('redacts the transform result and still honours the id, query and transform options', async function () {
		const { list, wheres } = listFor(userFields, { [userId]: user });
		const sent = await run(list, {
			id: 'userId',
			query: { isAdmin: true },
			transform: (item) => ({ wrapped: true, secret: (item as typeof user).get('secret') as string, email: 'ada@example.com' }),
		}, { userId });

		expect(wheres).to.deep.equal([{ isAdmin: true }]);
		expect(sent.body).to.deep.equal({ data: { wrapped: true, email: 'ada@example.com' } });

		// Non-object transform results are sent as they are.
		const text = await run(list, { transform: () => 'plain text' }, { id: userId });
		expect(text.body).to.deep.equal({ data: 'plain text' });
	});

	it('responds 404 when the item does not exist', async function () {
		const { list } = listFor(userFields, {});
		const sent = await run(list, undefined, { id: 'missing' });

		expect(sent.status).to.equal(404);
		expect(sent.body).to.deep.equal({ err: 'not found', id: 'missing' });
	});
	describe('raw stored BSON values', function () {
		const { Binary, Code, DBRef, Decimal128, ObjectId } = mongoose.mongo;
		// Read back from MongoDB as stored, so Mongoose hydrates real DBRef and Code values.
		const RefUserModel = mongoose.model('ApiForGetUnitRefUser', new mongoose.Schema({
			email: String,
			value: { fields: { hidden: String, keep: Number } },
			code: mongoose.Schema.Types.Mixed,
		}));
		const RefPostModel = mongoose.model('ApiForGetUnitRefPost', new mongoose.Schema({
			title: String,
			author: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiForGetUnitRefUser' },
		}));
		const BsonModel = mongoose.model('ApiForGetUnitBson', new mongoose.Schema({}, { strict: false }));
		const refUserFields = {
			email: { type: 'email' },
			'value.fields.hidden': { type: 'password' },
			'code.scope.inner.fields.hidden': { type: 'password' },
		};
		const refUserList = { fields: refUserFields };
		const refId = new ObjectId();
		const refUserId = new ObjectId();
		const postId = new ObjectId();
		const bsonId = new ObjectId();

		/** A list backed by the real model, so `query` runs against MongoDB. */
		function dbList(fields: Record<string, unknown>, model: mongoose.Model<never>) {
			return { fields, model } as unknown as KeystoneList;
		}

		before(async function () {
			await getMongooseConnection();
			await RefUserModel.collection.insertOne({
				_id: refUserId,
				email: 'ada@example.com',
				value: new DBRef('public', refId, undefined, { hidden: BCRYPT_HASH, keep: 1 }),
				code: new Code('function () {}', { inner: new DBRef('public', refId, undefined, { hidden: BCRYPT_HASH, keep: 2 }) }),
			});
			await RefPostModel.collection.insertOne({ _id: postId, title: 'Hello', author: refUserId });
			await BsonModel.collection.insertOne({
				_id: bsonId,
				ref: new DBRef('public', refId, 'otherdb', { keep: 1, nested: { deep: [1, 'two'] } }),
				code: new Code('function () { return x; }', { x: 1, inner: new DBRef('public', refId, undefined, { keep: 3 }) }),
				blob: new Binary(Buffer.from('keystone')),
				objectId: refId,
				when: new Date('2024-01-02T03:04:05.006Z'),
				amount: Decimal128.fromString('12.50'),
			});
		});

		after(async function () {
			await RefUserModel.collection.deleteMany({ _id: refUserId });
			await RefPostModel.collection.deleteMany({ _id: postId });
			await BsonModel.collection.deleteMany({ _id: bsonId });
		});

		const safeValue = () => ({ $ref: 'public', $id: String(refId), keep: 1 });
		const safeCode = () => ({ code: 'function () {}', scope: { inner: { $ref: 'public', $id: String(refId), keep: 2 } } });

		it('omits a Password path stored in a DBRef\'s extra fields and in a DBRef inside a Code scope', async function () {
			const sent = await run(dbList(refUserFields, RefUserModel as never), undefined, { id: String(refUserId) });

			expect(sent.status).to.equal(200);
			expect(JSON.stringify(sent.body)).to.not.include('$2');
			expect(sent.body).to.deep.equal({
				data: { _id: String(refUserId), email: 'ada@example.com', value: safeValue(), code: safeCode() },
			});
		});

		it('omits them from a relationship populated through the query option', async function () {
			const refPostFields = { title: { type: 'text' }, author: { type: 'relationship', refList: refUserList } };
			const sent = await run(dbList(refPostFields, RefPostModel as never), {
				query: (query) => { (query as { populate(path: string): unknown }).populate('author'); },
			}, { id: String(postId) });

			expect(JSON.stringify(sent.body)).to.not.include('$2');
			expect(sent.body).to.deep.equal({
				data: {
					_id: String(postId),
					title: 'Hello',
					author: { _id: String(refUserId), email: 'ada@example.com', value: safeValue(), code: safeCode() },
				},
			});
		});

		it('sends DBRef, Code, Binary, ObjectId, Date and Decimal128 values exactly as their JSON form', async function () {
			const doc = await BsonModel.findById(bsonId).exec();
			const expected = JSON.stringify({ data: doc });
			for (const fields of [{}, refUserFields, userFields]) {
				const sent = await run(dbList(fields, BsonModel as never), undefined, { id: String(bsonId) });
				expect(JSON.stringify(sent.body)).to.equal(expected);
			}
		});
	});
});
