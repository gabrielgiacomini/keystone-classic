import { expect } from 'chai';
import keystone, { Types } from 'keystone';
import type { KeystoneList } from 'keystone';
import mongoose from 'mongoose';
import {
	getClientSafeDocumentName,
	getRedactedDuplicateKeyDetail,
	getSecretDerivedPaths,
	hasSecretNameField,
	isSecretFieldObject,
	isSensitivePath,
	toJSONWithoutSecretFields,
	withoutSecretFields,
} from 'keystone/lib/security/secretFieldRedaction';
import buildSearchTextIndex, { canSearchWithTextIndex } from 'keystone/lib/list/buildSearchTextIndex';
import addSearchToQuery from 'keystone/lib/list/addSearchToQuery';
import getSearchFilters from 'keystone/lib/list/getSearchFilters';
import getData from 'keystone/lib/list/getData';
import getCSVData from 'keystone/lib/list/getCSVData';
import updateItem from 'keystone/lib/list/updateItem';
import getSession from 'keystone/admin/server/api/session/get';
import RelationshipType from 'keystone/fields/types/relationship/RelationshipType';
import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import removeModel from '../../../helpers/removeModel.mts';

const BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const RESET_KEY = 'resetkey7f3a9c';
const OTHER_KEY = 'otherkey51b2e8';

type SearchField = { path: string; field?: Record<string, unknown> };

/** A stub list with the parts the search builders read. */
function searchList(searchFields: SearchField[], extra: Record<string, unknown> = {}): KeystoneList {
	const fields: Record<string, unknown> = {};
	for (const entry of searchFields) {
		if (entry.field) fields[entry.path] = entry.field;
	}
	return {
		options: { searchUsesTextIndex: true },
		autokey: null,
		mappings: { name: null },
		key: 'Stub',
		fields,
		searchFields,
		get: () => searchFields.map((entry) => entry.path).join(', '),
		...extra,
	} as unknown as KeystoneList;
}

const title: SearchField = { path: 'title', field: { type: 'text', path: 'title' } };
const fullName: SearchField = { path: 'name', field: { type: 'name', path: 'name', paths: { first: 'name.first', last: 'name.last' } } };
const recovery: SearchField = { path: 'recovery', field: { type: 'text', path: 'recovery', options: { secret: true } } };
const token: SearchField = { path: 'token', field: { type: 'key', path: 'token', secret: true } };
const password: SearchField = { path: 'password', field: { type: 'password', path: 'password', paths: { hash: 'password_hash', confirm: 'password_confirm' } } };

function schemaWithTextIndex(paths: Record<string, string>): { indexes(): Array<[Record<string, unknown>, unknown]> } {
	return { indexes: () => [[{ createdAt: 1 }, {}], [paths, {}]] };
}

describe('secret fields: search text index, name, derived paths and duplicate-key errors', function () {
	describe('buildSearchTextIndex', function () {
		it('leaves secret and Password fields out of the text index definition', function () {
			const list = searchList([title, recovery, fullName, token, password]);
			expect(buildSearchTextIndex.call(list)).to.deep.equal({ 'title': 'text', 'name.first': 'text', 'name.last': 'text' });
		});

		it('builds no index when every search field is secret', function () {
			expect(buildSearchTextIndex.call(searchList([recovery, token, password]))).to.equal(false);
			expect(buildSearchTextIndex.call(searchList([]))).to.equal(false);
		});

		it('is unchanged for lists without secret fields', function () {
			expect(buildSearchTextIndex.call(searchList([title, fullName]))).to.deep.equal({ 'title': 'text', 'name.first': 'text', 'name.last': 'text' });
		});
	});

	describe('`$text` search with `searchUsesTextIndex`', function () {
		it('uses `$text` when the generated index holds only non-secret fields', function () {
			const list = searchList([title, recovery]);
			expect(canSearchWithTextIndex(list)).to.equal(true);
			expect(addSearchToQuery.call(list, RESET_KEY)).to.deep.equal({ $text: { $search: RESET_KEY } });
			expect(getSearchFilters.call(list, RESET_KEY)).to.deep.equal({ $text: { $search: RESET_KEY } });
		});

		it('never uses `$text` when the only search fields are secret', function () {
			for (const fields of [[recovery], [recovery, token], [password]]) {
				const list = searchList(fields);
				expect(canSearchWithTextIndex(list)).to.equal(false);
				// A stale index from before the field was marked secret must not be queried,
				// and the regular-expression fallback skips secret fields.
				expect(addSearchToQuery.call(list, RESET_KEY)).to.deep.equal({});
				expect(getSearchFilters.call(list, RESET_KEY)).to.deep.equal({});
			}
		});

		it('falls back to the secret-free regular-expression search when a declared text index covers a secret path', function () {
			const declarations: Array<Record<string, string>> = [{ title: 'text', recovery: 'text' }, { 'recovery.sub': 'text' }, { '$**': 'text' }];
			for (const declared of declarations) {
				const list = searchList([title, recovery], { schema: schemaWithTextIndex(declared) });
				expect(canSearchWithTextIndex(list)).to.equal(false);
				expect(Object.keys(addSearchToQuery.call(list, RESET_KEY))).to.deep.equal(['title']);
				expect(Object.keys(getSearchFilters.call(list, RESET_KEY))).to.deep.equal(['title']);
			}
		});

		it('keeps using a declared text index that covers no secret path', function () {
			const declared = searchList([recovery], { schema: schemaWithTextIndex({ title: 'text' }) });
			expect(canSearchWithTextIndex(declared)).to.equal(true);
			expect(addSearchToQuery.call(declared, 'x')).to.deep.equal({ $text: { $search: 'x' } });
			// A wildcard index is only a problem when the list has a secret field.
			const wildcard = searchList([title], { schema: schemaWithTextIndex({ '$**': 'text' }) });
			expect(canSearchWithTextIndex(wildcard)).to.equal(true);
		});

		it('is off without the list option', function () {
			const list = searchList([title], { options: {} });
			expect(canSearchWithTextIndex(list)).to.equal(false);
			expect(Object.keys(addSearchToQuery.call(list, 'x'))).to.deep.equal(['title']);
		});

		it('the regular-expression search skips Password fields too', function () {
			const list = searchList([title, password], { options: {} });
			expect(Object.keys(addSearchToQuery.call(list, '$2a$10$'))).to.deep.equal(['title']);
			expect(Object.keys(getSearchFilters.call(list, '$2a$10$'))).to.deep.equal(['title']);
		});
	});

	describe('document name', function () {
		const item = { id: 'i1', get: (path: string) => (path === 'recovery' ? RESET_KEY : undefined) };
		const secretName = {
			options: {},
			namePath: 'recovery',
			nameField: recovery.field,
			fields: { recovery: { ...recovery.field, getData: () => RESET_KEY } },
			getDocumentName: () => RESET_KEY,
		};

		it('detects a secret name field by field, path or derived path', function () {
			expect(hasSecretNameField(secretName)).to.equal(true);
			expect(hasSecretNameField({ namePath: 'password', fields: { password: password.field } })).to.equal(true);
			expect(hasSecretNameField({ nameField: password.field })).to.equal(true);
			expect(hasSecretNameField({ namePath: 'tierLabel', fields: { tier: { type: 'select', secret: true, paths: { label: 'tierLabel' } } } })).to.equal(true);
			expect(hasSecretNameField({ namePath: 'title', nameField: title.field, fields: { title: title.field, recovery: recovery.field } })).to.equal(false);
			expect(hasSecretNameField({ namePath: '_id', fields: {} })).to.equal(false);
			expect(hasSecretNameField(undefined)).to.equal(false);
		});

		it('getData omits `name` when the name field is secret', function () {
			const data = getData.call(secretName as never, item);
			expect(data).to.deep.equal({ id: 'i1', fields: {} });
			expect(JSON.stringify(data)).to.not.include(RESET_KEY);
			expect(getClientSafeDocumentName(secretName, item)).to.equal(undefined);
		});

		it('getData still emits `name` otherwise', function () {
			const list = { options: {}, namePath: 'title', fields: {}, getDocumentName: () => 'Hello' };
			expect(getData.call(list as never, item)).to.deep.equal({ id: 'i1', name: 'Hello', fields: {} });
		});

		it('expanded relationship data omits the related name when it is secret', function () {
			const proto = RelationshipType.prototype as unknown as { getExpandedData(this: unknown, i: unknown): unknown };
			const related = { id: 'u1' };
			const doc = { get: () => related, populated: () => true };
			expect(proto.getExpandedData.call({ path: 'owner', many: false, refList: secretName }, doc)).to.deep.equal({ id: 'u1' });
			expect(proto.getExpandedData.call({ path: 'owner', many: false, refList: { fields: {}, getDocumentName: () => 'Ada' } }, doc))
				.to.deep.equal({ id: 'u1', name: 'Ada' });
		});
	});

	describe('duplicate-key (E11000) errors', function () {
		const list = { fields: { email: { type: 'email' }, recovery: recovery.field, password: password.field } };
		const dupMessage = 'E11000 duplicate key error collection: db.users index: recovery_1 dup key: { recovery: "' + RESET_KEY + '" }';

		function dupError(extra: Record<string, unknown>): Error {
			return Object.assign(new Error(dupMessage), { name: 'MongoServerError', code: 11000, errmsg: dupMessage, ...extra });
		}

		it('names the path but never the value when a secret field is involved', function () {
			const detail = getRedactedDuplicateKeyDetail(list, dupError({ keyPattern: { recovery: 1 }, keyValue: { recovery: RESET_KEY } }));
			expect(detail).to.equal('Duplicate recovery value already exists');
			// Compound index with a secret member, and key information only in `keyValue`.
			expect(getRedactedDuplicateKeyDetail(list, dupError({ keyPattern: { email: 1, recovery: 1 } }))).to.equal('Duplicate email, recovery value already exists');
			expect(getRedactedDuplicateKeyDetail(list, dupError({ keyValue: { 'recovery.sub': RESET_KEY } }))).to.equal('Duplicate recovery.sub value already exists');
			expect(getRedactedDuplicateKeyDetail(list, dupError({ keyPattern: { password_hash: 1 } }))).to.equal('Duplicate password_hash value already exists');
		});

		it('fails closed when the error carries no key information', function () {
			expect(getRedactedDuplicateKeyDetail(list, dupError({}))).to.equal('Duplicate value already exists');
		});

		it('leaves other errors alone', function () {
			expect(getRedactedDuplicateKeyDetail(list, dupError({ keyPattern: { email: 1 } }))).to.equal(undefined);
			expect(getRedactedDuplicateKeyDetail({ fields: { email: { type: 'email' } } }, dupError({}))).to.equal(undefined);
			expect(getRedactedDuplicateKeyDetail(list, Object.assign(new Error('boom'), { code: 121 }))).to.equal(undefined);
			expect(getRedactedDuplicateKeyDetail(list, undefined)).to.equal(undefined);
		});

		it('updateItem reports the redacted detail to its callback', async function () {
			const stub = { ...list, key: 'Stub', fieldsArray: [] };
			const item = { save: () => Promise.reject(dupError({ keyPattern: { recovery: 1 }, keyValue: { recovery: RESET_KEY } })) };
			const err = await new Promise<unknown>((resolve) => {
				(updateItem as unknown as (this: unknown, i: unknown, d: unknown, o: unknown, cb: (e?: unknown) => void) => void)
					.call(stub, item, {}, {}, resolve);
			});
			expect(err).to.deep.equal({ error: 'database error', detail: 'Duplicate recovery value already exists' });
			expect(JSON.stringify(err)).to.not.include(RESET_KEY);
		});
	});

	describe('session', function () {
		it('answers `{ user: null }` when signed out', function () {
			for (const user of [undefined, null]) {
				let body: unknown;
				getSession({ user } as never, { json: (value: unknown) => { body = value; } } as never);
				expect(body).to.deep.equal({ user: null });
			}
		});
	});

	describe('a real list', function () {
		const key = 'SecretSearchUnitVault';
		const namedKey = 'SecretNameUnitVault';
		const collection = 'secret_search_unit_vaults';
		type Doc = { id: string; get(path: string): unknown; save(): Promise<unknown> };
		// Unresolved before the first build, where the rule would fire.
		// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
		type RealList = KeystoneList & {
			add(fields: Record<string, unknown>): void;
			register(): void;
			buildSearchTextIndex(): Record<string, string> | false;
			model: (new (data: Record<string, unknown>) => Doc) & {
				collection: {
					indexes(): Promise<Array<{ key: Record<string, unknown>; weights?: Record<string, unknown> }>>;
				};
				find(query: Record<string, unknown>): { exec(): Promise<Doc[]> };
				init(): Promise<unknown>;
			};
		};
		let list: RealList;
		let named: RealList;

		before(async function () {
			const connected = await getMongooseConnection();
			(keystone as unknown as { init(options?: Record<string, unknown>): void }).init({ mongoose: connected });
			removeModel(key);
			removeModel(namedKey);
			await mongoose.connection.collection(collection).drop().catch(() => undefined);

			list = new keystone.List(key, {
				searchUsesTextIndex: true,
				searchFields: 'label, recovery',
				map: { name: 'label' },
				schema: { collection },
			}) as unknown as RealList;
			list.add({
				label: { type: String, initial: true },
				recovery: { type: String, secret: true, unique: true, sparse: true },
				tier: { type: Types.Select, options: 'gold, silver', secret: true },
				password: { type: Types.Password },
			});
			list.register();
			// Builds the declared (unique) indexes before documents are inserted.
			await list.model.init();

			named = new keystone.List(namedKey, { map: { name: 'recovery' }, schema: { collection: collection + '_named' } }) as unknown as RealList;
			named.add({ recovery: { type: String, secret: true }, label: { type: String } });
			named.register();
		});

		after(async function () {
			removeModel(key);
			removeModel(namedKey);
			await mongoose.connection.collection(collection).drop().catch(() => undefined);
		});

		it('treats the paths a secret field type derives as sensitive', function () {
			expect(getSecretDerivedPaths(list)).to.include.members(['tierLabel', 'tierData', 'tierOptions', 'tierOptionsMap', 'password_hash']);
			for (const path of ['tierLabel', 'tierData', 'tierData.label', 'tierOptions', 'tierOptionsMap', 'password_hash']) {
				expect(isSensitivePath(list, path), path).to.equal(true);
			}
			expect(isSensitivePath(list, 'label')).to.equal(false);
			expect(isSensitivePath(list, 'labelLabel')).to.equal(false);
			expect(isSecretFieldObject(list.fields['tier'])).to.equal(true);
			expect(isSecretFieldObject(list.fields['password'])).to.equal(true);
			expect(isSecretFieldObject(list.fields['label'])).to.equal(false);
		});

		it('omits derived paths of a secret field from getData, getCSVData and redacted documents', function () {
			const doc = new list.model({ label: 'Main', recovery: RESET_KEY, tier: 'gold', password: BCRYPT_HASH });
			// The virtuals do reveal the choice to application code.
			expect(doc.get('tierLabel')).to.equal('Gold');

			const requested = 'label,tier,tierLabel,tierData,tierData.label,tierOptions,tierOptionsMap,password_hash';
			const data = getData.call(list, doc as never, requested);
			expect(data).to.deep.equal({ id: doc.id, name: 'Main', fields: { label: 'Main' } });

			const csv = getCSVData.call(list, doc, { fields: requested });
			expect(csv).to.have.all.keys('id', 'label');

			// The shape a document serializes to when its schema includes virtuals.
			const withVirtuals = {
				label: 'Main',
				recovery: RESET_KEY,
				tier: 'gold',
				tierLabel: doc.get('tierLabel'),
				tierData: doc.get('tierData'),
				tierOptions: doc.get('tierOptions'),
				tierOptionsMap: doc.get('tierOptionsMap'),
				password: BCRYPT_HASH,
			};
			for (const safe of [withoutSecretFields(list, withVirtuals), toJSONWithoutSecretFields(list, withVirtuals)]) {
				expect(safe).to.deep.equal({ label: 'Main' });
			}
		});

		it('omits `name` from getData when the name field is secret', function () {
			const doc = new named.model({ recovery: RESET_KEY, label: 'Main' });
			expect(hasSecretNameField(named)).to.equal(true);
			const data = getData.call(named, doc as never);
			expect(data).to.deep.equal({ id: doc.id, fields: { label: 'Main' } });
		});

		it('keeps secret fields out of the text index', async function () {
			const definition = list.buildSearchTextIndex();
			expect(definition).to.deep.equal({ label: 'text' });
			// `register()` builds the index from that definition (`ensureTextIndex`); wait for it.
			let textIndex: { weights?: Record<string, unknown> } | undefined;
			for (let attempt = 0; attempt < 100 && !textIndex; attempt++) {
				textIndex = (await list.model.collection.indexes()).find((index) => index.weights);
				if (!textIndex) await new Promise<void>((resolve) => { setTimeout(resolve, 50); });
			}
			expect(textIndex?.weights).to.deep.equal({ label: 1 });

			await new list.model({ label: 'alpha', recovery: RESET_KEY }).save();
			await new list.model({ label: 'beta', recovery: OTHER_KEY }).save();

			const search = async (value: string): Promise<number> => {
				const viaQuery = await list.model.find(addSearchToQuery.call(list, value)).exec();
				const viaFilters = await list.model.find(getSearchFilters.call(list, value)).exec();
				expect(viaFilters.length).to.equal(viaQuery.length);
				return viaQuery.length;
			};
			expect(addSearchToQuery.call(list, 'alpha')).to.deep.equal({ $text: { $search: 'alpha' } });
			expect(await search('alpha')).to.equal(1);
			// An exact secret value answers exactly like a value that is stored nowhere.
			expect(await search(RESET_KEY)).to.equal(0);
			expect(await search(OTHER_KEY)).to.equal(0);
			expect(await search('storednowhere')).to.equal(0);
		});

		it('a duplicate unique secret value is reported without the value', async function () {
			const doc = new list.model({});
			const err = await new Promise<unknown>((resolve) => {
				(list.updateItem as unknown as (i: unknown, d: unknown, o: unknown, cb: (e?: unknown) => void) => void)
					.call(list, doc, { label: 'gamma', recovery: RESET_KEY }, { fields: 'label, recovery' }, resolve);
			});
			expect(err).to.deep.equal({ error: 'database error', detail: 'Duplicate recovery value already exists' });
			expect(JSON.stringify(err)).to.not.include(RESET_KEY);
		});
	});
});
