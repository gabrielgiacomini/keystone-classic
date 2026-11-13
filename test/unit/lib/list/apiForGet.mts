import { expect } from 'chai';
import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import type { KeystoneList } from 'keystone';
import apiForGet from 'keystone/lib/list/apiForGet';

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
});
