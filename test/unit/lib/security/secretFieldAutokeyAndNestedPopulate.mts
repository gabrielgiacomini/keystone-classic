import { expect } from 'chai';
import keystone, { Types } from 'keystone';
import type { KeystoneList } from 'keystone';
import {
	SECRET_REDACTION_MAX_DEPTH,
	isSecretValuePath,
	toJSONWithoutSecretFields,
	withoutSecretFields,
} from 'keystone/lib/security/secretFieldRedaction';
import getData from 'keystone/lib/list/getData';
import getCSVData from 'keystone/lib/list/getCSVData';
import addSearchToQuery from 'keystone/lib/list/addSearchToQuery';
import getSearchFilters from 'keystone/lib/list/getSearchFilters';
import RelationshipType from 'keystone/fields/types/relationship/RelationshipType';
import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import removeModel from '../../../helpers/removeModel.mts';

const BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const RESET_KEY = 'reset-key-7f3a9c';
const API_TOKEN = 'api-token-51b2e8';
const ORG_KEY = 'org-key-0d4e1b';

function expectNoSecret(value: unknown): void {
	const raw = JSON.stringify(value);
	expect(raw).to.not.include(RESET_KEY);
	expect(raw).to.not.include(API_TOKEN);
	expect(raw).to.not.include(ORG_KEY);
	expect(raw).to.not.include('$2a$');
}

/** Minimal stand-in for a hydrated Mongoose document. */
function hydrated(data: Record<string, unknown>) {
	return {
		$__: {},
		...data,
		toObject(): Record<string, unknown> { return JSON.parse(JSON.stringify(data)) as Record<string, unknown>; },
	};
}

// Unresolved before the first build, where the rule would fire.
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type RealList = KeystoneList & {
	add(fields: Record<string, unknown>): void;
	register(): void;
	model: new (data: Record<string, unknown>) => { get(path: string): unknown; set(path: string, value: unknown): void };
};

function newList(key: string, options: Record<string, unknown> = {}): RealList {
	removeModel(key);
	return new keystone.List(key, options) as unknown as RealList;
}

describe('secret fields: autokey', function () {
	const keys = ['SecretAutokeyFrom', 'SecretAutokeyPassword', 'SecretAutokeyDerived', 'SecretAutokeyNested', 'SecretAutokeyPlain', 'SecretAutokeyRef', 'SecretAutokeyRefTarget'];
	// The write entry points below need a connection.
	before(async function () {
		(keystone as unknown as { mongoose: unknown }).mongoose = await getMongooseConnection();
	});
	after(function () { keys.forEach(removeModel); });

	describe('a `from` path that reads a secret field', function () {
		it('is refused at registration when it is a `secret: true` field', function () {
			const list = newList('SecretAutokeyFrom', { autokey: { path: 'slug', from: 'label recovery', unique: true } });
			list.add({ label: { type: String }, recovery: { type: String, secret: true } });
			expect(() => list.register()).to.throw(/autokey.*SecretAutokeyFrom.*recovery.*secret/s);
		});

		it('is refused at registration when it is a Password field', function () {
			const list = newList('SecretAutokeyPassword', { autokey: { path: 'slug', from: 'password' } });
			list.add({ label: { type: String }, password: { type: Types.Password } });
			expect(() => list.register()).to.throw(/autokey.*SecretAutokeyPassword.*password.*secret/s);
		});

		it('is refused when it is a path derived from a secret field, with or without a format', function () {
			const list = newList('SecretAutokeyDerived', { autokey: { path: 'slug', from: ['label', 'tierLabel:upper'] } });
			list.add({ label: { type: String }, tier: { type: Types.Select, options: 'gold, silver', secret: true } });
			expect(() => list.register()).to.throw(/autokey.*SecretAutokeyDerived.*tierLabel.*secret/s);
		});

		it('is refused when it is the parent of a nested secret field', function () {
			const list = newList('SecretAutokeyNested', { autokey: { path: 'slug', from: 'integration' } });
			list.add({ label: { type: String }, integration: { value: { type: String, secret: true } } });
			expect(() => list.register()).to.throw(/autokey.*SecretAutokeyNested.*integration.*secret/s);
		});

		it('never names the secret value in the error', function () {
			const list = newList('SecretAutokeyFrom', { autokey: { path: 'slug', from: 'recovery' } });
			list.add({ recovery: { type: String, secret: true, default: RESET_KEY } });
			let message = '';
			try { list.register(); } catch (err) { message = (err as Error).message; }
			expect(message).to.include('recovery');
			expect(message).to.not.include(RESET_KEY);
		});

		it('still accepts ordinary sources, a relationship included', function () {
			const target = newList('SecretAutokeyRefTarget');
			target.add({ label: { type: String }, recovery: { type: String, secret: true } });
			target.register();
			const list = newList('SecretAutokeyPlain', { autokey: { path: 'slug', from: 'label owner', unique: true } });
			list.add({ label: { type: String }, recovery: { type: String, secret: true }, owner: { type: Types.Relationship, ref: 'SecretAutokeyRefTarget' } });
			expect(() => list.register()).to.not.throw();
		});

		it('is refused when it reaches a secret field of a related list', async function () {
			const target = newList('SecretAutokeyRefTarget');
			target.add({ label: { type: String }, recovery: { type: String, secret: true } });
			target.register();
			const list = newList('SecretAutokeyRef', { autokey: { path: 'slug', from: 'owner.recovery' } });
			list.add({ label: { type: String }, owner: { type: Types.Relationship, ref: 'SecretAutokeyRefTarget' } });
			// The related list may register later, so this is decided no later than the first save.
			let message = '';
			try {
				list.register();
				const owner = new target.model({ label: 'Owner', recovery: RESET_KEY });
				const doc = new list.model({ label: 'Doc', owner }) as unknown as { validate(): Promise<void>; $__save?: unknown; save(): Promise<unknown>; get(path: string): unknown };
				await doc.save();
				message = 'saved with slug ' + String(doc.get('slug'));
			} catch (err) {
				message = (err as Error).message;
			}
			expect(message).to.match(/autokey.*SecretAutokeyRef.*owner\.recovery.*secret/s);
			expect(message).to.not.include(RESET_KEY);
		});

		it('is refused through a related list on insertMany and on the update entry points too', async function () {
			const target = newList('SecretAutokeyRefTarget');
			target.add({ label: { type: String }, recovery: { type: String, secret: true } });
			target.register();
			const list = newList('SecretAutokeyRef', { autokey: { path: 'slug', from: 'label owner.recovery' } });
			list.add({ label: { type: String }, owner: { type: Types.Relationship, ref: 'SecretAutokeyRefTarget' } });
			list.register();
			const model = list.model as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>;
			const attempts: Record<string, () => Promise<unknown>> = {
				insertMany: () => model['insertMany']!([{ label: 'Doc' }]),
				updateOne: () => model['updateOne']!({ label: 'Doc' }, { label: 'Other' }),
				updateMany: () => model['updateMany']!({ label: 'Doc' }, { label: 'Other' }),
				findOneAndUpdate: () => model['findOneAndUpdate']!({ label: 'Doc' }, { label: 'Other' }),
				replaceOne: () => model['replaceOne']!({ label: 'Doc' }, { label: 'Other' }),
				findOneAndReplace: () => model['findOneAndReplace']!({ label: 'Doc' }, { label: 'Other' }),
			};
			for (const [name, attempt] of Object.entries(attempts)) {
				let message = name + ' was not refused';
				try { await attempt(); } catch (err) { message = (err as Error).message; }
				expect(message, name).to.match(/autokey.*SecretAutokeyRef.*owner\.recovery.*secret/s);
			}
		});

		it('leaves insertMany and updates alone when the related path is not secret', async function () {
			const target = newList('SecretAutokeyRefTarget');
			target.add({ label: { type: String }, recovery: { type: String, secret: true } });
			target.register();
			const list = newList('SecretAutokeyPlain', { autokey: { path: 'slug', from: 'label owner.label' } });
			list.add({ label: { type: String }, owner: { type: Types.Relationship, ref: 'SecretAutokeyRefTarget' } });
			list.register();
			const model = list.model as unknown as {
				insertMany(docs: unknown[]): Promise<Array<{ _id: unknown }>>;
				updateOne(filter: unknown, update: unknown): Promise<{ matchedCount: number }>;
				deleteMany(filter: unknown): Promise<unknown>;
			};
			const [inserted] = await model.insertMany([{ label: 'Allowed' }]);
			expect((await model.updateOne({ _id: inserted?._id }, { label: 'Allowed again' })).matchedCount).to.equal(1);
			await model.deleteMany({ _id: inserted?._id });
		});

		it('isSecretValuePath tells secret sources from ordinary ones', function () {
			const related = { fields: { label: { type: 'text' }, recovery: { type: 'text', secret: true } } as Record<string, unknown> };
			const list = {
				fields: {
					'label': { type: 'text' },
					'password': { type: 'password', paths: { hash: 'password_hash' } },
					'tier': { type: 'select', secret: true, paths: { label: 'tierLabel' } },
					'integration.value': { type: 'key', secret: true },
					'owner': { type: 'relationship', refList: related },
					'stranger': { type: 'relationship' },
				} as Record<string, unknown>,
			};
			for (const path of ['password', 'password.length', 'password_hash', 'tier', 'tierLabel', 'integration', 'integration.value', 'owner.recovery', 'owner.0.recovery', 'stranger.label']) {
				expect(isSecretValuePath(list, path), path).to.equal(true);
			}
			for (const path of ['label', 'owner', 'stranger', 'owner.label', 'id', 'missing']) {
				expect(isSecretValuePath(list, path), path).to.equal(false);
			}
		});
	});

	describe('an autokey path that is itself a secret field', function () {
		const item = { id: 'v1', get: (path: string) => ({ code: API_TOKEN, label: 'Main' } as Record<string, unknown>)[path] };
		const fields = {
			label: { type: 'text', path: 'label', options: {}, getData: () => 'Main', format: () => 'Main' },
			code: { type: 'text', path: 'code', secret: true, options: { secret: true }, getData: () => API_TOKEN, format: () => API_TOKEN },
		} as Record<string, unknown>;
		const list = {
			fields,
			autokey: { path: 'code' },
			options: {},
			mappings: { name: 'label' },
			searchFields: [{ path: 'label', field: fields['label'] }],
			getDocumentName: () => 'Main',
			get: (key: string) => key === 'searchFields' ? 'label' : undefined,
			model: { schema: { path: () => ({ instance: 'ObjectId' }) } },
		};

		it('is left out of getData', function () {
			const data = getData.call(list as never, item as never);
			expectNoSecret(data);
			expect(data).to.not.have.property('code');
			expect(data['fields']).to.deep.equal({ label: 'Main' });
		});

		it('is left out of getCSVData', function () {
			const data = getCSVData.call(list as never, item, {});
			expectNoSecret(data);
			expect(data).to.not.have.property('code');
			expect(data).to.include({ label: 'Main' });
		});

		it('is not searched', function () {
			const search = JSON.stringify([
				addSearchToQuery.call(list as never, 'api'),
				getSearchFilters.call(list as never, 'api'),
			], (_key, value: unknown) => value instanceof RegExp ? value.source : value);
			expect(search).to.not.include('"code"');
			expect(search).to.include('"label"');
		});

		it('an ordinary autokey path is still returned and searched', function () {
			const plain = { ...list, autokey: { path: 'slug' } };
			const plainItem = { id: 'v1', get: (path: string) => path === 'slug' ? 'main' : undefined };
			expect(getData.call(plain as never, plainItem as never)).to.include({ slug: 'main' });
			expect(getCSVData.call(plain as never, plainItem, {})).to.include({ slug: 'main' });
			const search = JSON.stringify([
				addSearchToQuery.call(plain as never, 'ma'),
				getSearchFilters.call(plain as never, 'ma'),
			], (_key, value: unknown) => value instanceof RegExp ? value.source : value);
			expect(search.match(/"slug"/g)).to.have.length(2);
		});
	});
});

describe('secret fields: nested populated relationships', function () {
	const orgList = {
		fields: {
			name: { type: 'text' },
			apiKey: { type: 'text', secret: true },
		} as Record<string, unknown>,
	};
	const userList = { fields: {} as Record<string, unknown> };
	userList.fields = {
		'email': { type: 'email' },
		'password': { type: 'password' },
		'recovery': { type: 'text', options: { secret: true } },
		'employer': { type: 'relationship', refList: orgList },
		'manager': { type: 'relationship', refList: userList },
		'peers': { type: 'relationship', many: true, refList: userList },
		'meta.sponsor': { type: 'relationship', refList: userList },
	};
	const postList = {
		fields: {
			title: { type: 'text' },
			author: { type: 'relationship', refList: userList },
			editors: { type: 'relationship', many: true, refList: userList },
		} as Record<string, unknown>,
	};

	const org = { _id: 'o1', name: 'Acme', apiKey: ORG_KEY };
	const boss = { _id: 'u2', email: 'boss@example.com', password: BCRYPT_HASH, recovery: RESET_KEY, employer: org };
	const peer = { _id: 'u3', email: 'peer@example.com', password: BCRYPT_HASH, recovery: API_TOKEN, manager: boss };
	const author = {
		_id: 'u1',
		email: 'ada@example.com',
		password: BCRYPT_HASH,
		recovery: RESET_KEY,
		employer: org,
		manager: boss,
		peers: [peer, 'u9'],
		meta: { sponsor: boss },
	};
	const safeOrg = { _id: 'o1', name: 'Acme' };
	const safeBoss = { _id: 'u2', email: 'boss@example.com', employer: safeOrg };
	const safeAuthor = {
		_id: 'u1',
		email: 'ada@example.com',
		employer: safeOrg,
		manager: safeBoss,
		peers: [{ _id: 'u3', email: 'peer@example.com', manager: safeBoss }, 'u9'],
		meta: { sponsor: safeBoss },
	};

	/** A chain of users, each the manager of the one before, `length` levels below the first. */
	function managerChain(length: number): Record<string, unknown> {
		let user: Record<string, unknown> = { _id: 'm' + length, password: BCRYPT_HASH, recovery: RESET_KEY };
		for (let level = length - 1; level >= 0; level--) {
			user = { _id: 'm' + level, password: BCRYPT_HASH, recovery: RESET_KEY, manager: user };
		}
		return user;
	}

	function depthOf(user: unknown): number {
		let depth = 0;
		let current = user as { manager?: unknown } | undefined;
		// Capped so that a cyclic value fails the assertion instead of looping.
		while (depth < 1000 && current && typeof current.manager === 'object' && current.manager !== null) {
			depth++;
			current = current.manager as { manager?: unknown };
		}
		return depth;
	}

	it('withoutSecretFields redacts every populated level', function () {
		for (const doc of [hydrated(author), author]) {
			const safe = withoutSecretFields(userList, doc);
			expectNoSecret(safe);
			expect(safe).to.deep.equal(safeAuthor);
		}
		// The source is not modified.
		expect(author.manager.employer.apiKey).to.equal(ORG_KEY);
	});

	it('Relationship getData redacts every populated level', function () {
		const item = { get: (path: string) => ({ author: hydrated(author), editors: [hydrated(author), 'u9'] } as Record<string, unknown>)[path] };
		const proto = RelationshipType.prototype as unknown as { getData(this: unknown, i: typeof item): unknown };
		const one = proto.getData.call({ path: 'author', many: false, refList: userList }, item);
		const many = proto.getData.call({ path: 'editors', many: true, refList: userList }, item);
		expectNoSecret([one, many]);
		expect(one).to.deep.equal(safeAuthor);
		expect(many).to.deep.equal([safeAuthor, 'u9']);
	});

	it('toJSONWithoutSecretFields redacts every populated level', function () {
		const post = { toJSON: () => ({ _id: 'p1', title: 'Hello', author, editors: [author, 'u9'] }) };
		const safe = toJSONWithoutSecretFields(postList, post);
		expectNoSecret(safe);
		expect(safe).to.deep.equal({ _id: 'p1', title: 'Hello', author: safeAuthor, editors: [safeAuthor, 'u9'] });
	});

	it('stops at a bounded depth and keeps only the id of what lies deeper', function () {
		expect(SECRET_REDACTION_MAX_DEPTH).to.be.within(1, 32);
		const deep = managerChain(SECRET_REDACTION_MAX_DEPTH + 5);
		for (const safe of [
			withoutSecretFields(userList, deep),
			withoutSecretFields(userList, hydrated(deep)),
			toJSONWithoutSecretFields(userList, deep),
		]) {
			expectNoSecret(safe);
			expect(depthOf(safe)).to.equal(SECRET_REDACTION_MAX_DEPTH);
			let last = safe as { manager?: unknown };
			for (let level = 0; level < SECRET_REDACTION_MAX_DEPTH; level++) last = last.manager as { manager?: unknown };
			// The document one level past the limit is replaced by its id.
			expect(last.manager).to.equal('m' + (SECRET_REDACTION_MAX_DEPTH + 1));
		}
		// Many-relationships past the limit keep ids only as well.
		let nested: Record<string, unknown> = { _id: 'leaf', peers: [{ _id: 'x1', recovery: RESET_KEY }, 'x2', { recovery: RESET_KEY }] };
		for (let level = 0; level < SECRET_REDACTION_MAX_DEPTH; level++) nested = { _id: 'n' + level, manager: nested };
		const safe = withoutSecretFields(userList, nested);
		expectNoSecret(safe);
		expect(JSON.stringify(safe)).to.include('"peers":["x1","x2",null]');
	});

	it('reads the list\'s secret paths once for a whole array, however long', function () {
		let reads = 0;
		const fields = { ...userList.fields };
		const counted = { get fields() { reads++; return fields; } };
		const users = Array.from({ length: 500 }, (_unused, i) => ({ _id: 'c' + i, password: BCRYPT_HASH, recovery: RESET_KEY }));
		toJSONWithoutSecretFields(counted, users.slice(0, 1));
		const readsForOne = reads;
		reads = 0;
		const safe = toJSONWithoutSecretFields(counted, users) as unknown[];
		expectNoSecret(safe);
		expect(safe).to.have.length(500);
		expect(reads).to.equal(readsForOne);
	});

	it('terminates on a document that populates itself', function () {
		const self: Record<string, unknown> = { _id: 'loop', password: BCRYPT_HASH, recovery: RESET_KEY };
		const looped = { $__: {}, toObject: () => { const copy: Record<string, unknown> = { ...self }; copy['manager'] = copy; return copy; } };
		const safe = withoutSecretFields(userList, looped);
		expect(safe).to.not.have.any.keys('password', 'recovery');
		expect(depthOf(safe)).to.be.at.most(SECRET_REDACTION_MAX_DEPTH);
	});

	describe('real lists and documents', function () {
		const keys = ['SecretNestedOrg', 'SecretNestedUser', 'SecretNestedPost'];
		let Post: RealList;
		let post: { get(path: string): unknown };

		before(function () {
			const Org = newList('SecretNestedOrg', { map: { name: 'label' } });
			Org.add({ label: { type: String }, apiKey: { type: String, secret: true } });
			Org.register();
			const User = newList('SecretNestedUser', { map: { name: 'email' } });
			User.add({
				email: { type: String },
				password: { type: Types.Password },
				recovery: { type: String, secret: true },
				employer: { type: Types.Relationship, ref: 'SecretNestedOrg' },
				manager: { type: Types.Relationship, ref: 'SecretNestedUser' },
				peers: { type: Types.Relationship, ref: 'SecretNestedUser', many: true },
			});
			User.register();
			Post = newList('SecretNestedPost', { map: { name: 'title' } });
			Post.add({
				title: { type: String },
				author: { type: Types.Relationship, ref: 'SecretNestedUser' },
				editors: { type: Types.Relationship, ref: 'SecretNestedUser', many: true },
				reviewer: { type: Types.Relationship, ref: 'SecretNestedUser', toCSV: 'email, password, recovery, manager, employer' },
			});
			Post.register();

			// Assigning documents to relationship paths is how Mongoose marks them populated.
			const acme = new Org.model({ label: 'Acme', apiKey: ORG_KEY });
			const chief = new User.model({ email: 'chief@example.com', password: BCRYPT_HASH, recovery: RESET_KEY, employer: acme });
			const colleague = new User.model({ email: 'peer@example.com', password: BCRYPT_HASH, recovery: API_TOKEN, manager: chief });
			const writer = new User.model({ email: 'ada@example.com', password: BCRYPT_HASH, recovery: RESET_KEY, employer: acme, manager: chief, peers: [colleague] });
			post = new Post.model({ title: 'Hello', author: writer, editors: [writer, colleague], reviewer: writer });
		});

		after(function () { keys.forEach(removeModel); });

		it('the fixture really is populated on several levels', function () {
			const raw = JSON.stringify(post);
			expect(raw).to.include(ORG_KEY);
			expect(raw).to.include(RESET_KEY);
			expect(raw).to.include(API_TOKEN);
			expect(raw).to.include('$2a$');
		});

		it('getData returns no secret of any populated level', function () {
			for (const fields of [undefined, 'title,author,editors,reviewer', 'author.manager,author.manager.recovery,author.employer.apiKey,author.manager.employer,editors.manager.password']) {
				const data = getData.call(Post, post as never, fields);
				expectNoSecret(data);
			}
			const all = getData.call(Post, post as never)['fields'] as { author: { email: string; manager: { email: string; employer: { label: string } }; peers: Array<{ email: string }> } };
			// The non-secret values of each level are still there.
			expect(all.author.email).to.equal('ada@example.com');
			expect(all.author.manager.email).to.equal('chief@example.com');
			expect(all.author.manager.employer.label).to.equal('Acme');
			expect(all.author.peers[0]?.email).to.equal('peer@example.com');
		});

		it('getData with expandRelationshipFields returns ids and names only', function () {
			const data = getData.call(Post, post as never, undefined, true);
			expectNoSecret(data);
			expect((data['fields'] as { author: Record<string, unknown> }).author).to.have.all.keys('id', 'name');
		});

		it('getCSVData returns no secret of any populated level', function () {
			for (const options of [{}, { expandRelationshipFields: true }, { fields: 'title,author,reviewer,author.manager.recovery,author.manager' }]) {
				const data = getCSVData.call(Post, post, { ...options });
				expectNoSecret(data);
			}
			expect(getCSVData.call(Post, post, {})).to.include({ reviewerEmail: 'ada@example.com' });
		});

		it('toJSONWithoutSecretFields (apiForGet) returns no secret of any populated level', function () {
			const safe = toJSONWithoutSecretFields(Post, post) as { author: { manager: { employer: { label: string } } } };
			expectNoSecret(safe);
			expect(safe.author.manager.employer.label).to.equal('Acme');
		});
	});
});
