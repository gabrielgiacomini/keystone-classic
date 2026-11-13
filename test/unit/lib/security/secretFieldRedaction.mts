import { expect } from 'chai';
import keystone, { Types } from 'keystone';
import type { KeystoneList } from 'keystone';
import {
	getPasswordFieldPaths,
	getSecretFieldPaths,
	hasSecretOption,
	isPasswordField,
	isSecretField,
	isSecretOptionField,
	isSensitivePath,
	toJSONWithoutSecretFields,
	withoutSecretFields,
} from 'keystone/lib/security/secretFieldRedaction';
import * as legacyExports from 'keystone/lib/security/passwordFieldRedaction';
import getData from 'keystone/lib/list/getData';
import getCSVData from 'keystone/lib/list/getCSVData';
import addFiltersToQuery from 'keystone/lib/list/addFiltersToQuery';
import addSearchToQuery from 'keystone/lib/list/addSearchToQuery';
import getSearchFilters from 'keystone/lib/list/getSearchFilters';
import expandSort from 'keystone/lib/list/expandSort';
import apiForGet from 'keystone/lib/list/apiForGet';
import { projectSessionUser } from 'keystone/lib/sessionUserProjection';
import RelationshipType from 'keystone/fields/types/relationship/RelationshipType';
import removeModel from '../../../helpers/removeModel.mts';

const BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
const RESET_KEY = 'reset-key-7f3a9c';
const API_TOKEN = 'api-token-51b2e8';

const userList = {
	fields: {
		name: { type: 'name' },
		email: { type: 'email' },
		password: { type: 'password' },
		// Deliberately neutral names: detection is by the explicit option, never by name.
		recovery: { type: 'text', options: { secret: true } },
		'integration.value': { type: 'key', secret: true },
		// A field merely *named* like a secret is not one.
		apiToken: { type: 'text', options: {} },
	} as Record<string, unknown>,
};

const postList = {
	fields: {
		title: { type: 'text' },
		author: { type: 'relationship', refList: userList },
		editors: { type: 'relationship', many: true, refList: userList },
		'meta.reviewer': { type: 'relationship', refList: userList },
	} as Record<string, unknown>,
};

const userData = {
	_id: 'u1',
	id: 'u1',
	email: 'ada@example.com',
	password: BCRYPT_HASH,
	recovery: RESET_KEY,
	integration: { value: API_TOKEN, label: 'ci' },
	apiToken: 'not-declared-secret',
};
const safeUserData = { _id: 'u1', id: 'u1', email: 'ada@example.com', integration: { label: 'ci' }, apiToken: 'not-declared-secret' };

/** Minimal stand-in for a hydrated Mongoose document. */
function hydrated(data: Record<string, unknown>) {
	return {
		$__: {},
		...data,
		toObject(): Record<string, unknown> { return JSON.parse(JSON.stringify(data)) as Record<string, unknown>; },
	};
}

function expectNoSecret(value: unknown): void {
	const raw = JSON.stringify(value);
	expect(raw).to.not.include(RESET_KEY);
	expect(raw).to.not.include(API_TOKEN);
	expect(raw).to.not.include('$2a$');
}

describe('lib/security/secretFieldRedaction', function () {
	describe('detection', function () {
		it('treats `secret: true` fields of any type like Password fields, by option and never by name', function () {
			expect(isSecretField(userList, 'password')).to.equal(true);
			expect(isSecretField(userList, 'recovery')).to.equal(true);
			expect(isSecretField(userList, 'integration.value')).to.equal(true);
			expect(isSecretField(userList, 'apiToken')).to.equal(false);
			expect(isSecretField(userList, 'email')).to.equal(false);
			expect(isSecretField(userList, 'toString')).to.equal(false);
			expect(isSecretField(undefined, 'recovery')).to.equal(false);
			expect(getSecretFieldPaths(userList)).to.deep.equal(['password', 'recovery', 'integration.value']);
		});

		it('distinguishes the explicit option from the Password type', function () {
			expect(isSecretOptionField(userList, 'recovery')).to.equal(true);
			expect(isSecretOptionField(userList, 'password')).to.equal(false);
			expect(isPasswordField(userList, 'password')).to.equal(true);
			expect(isPasswordField(userList, 'recovery')).to.equal(false);
			expect(getPasswordFieldPaths(userList)).to.deep.equal(['password']);
			expect(hasSecretOption({ options: { secret: true } })).to.equal(true);
			expect(hasSecretOption({ secret: true })).to.equal(true);
			// Any truthy value opts in, so a loosely typed config fails closed.
			expect(hasSecretOption({ options: { secret: 1 } })).to.equal(true);
			expect(hasSecretOption({ options: { secret: false } })).to.equal(false);
			expect(hasSecretOption({ options: null })).to.equal(false);
			expect(hasSecretOption(undefined)).to.equal(false);
			expect(hasSecretOption('secret')).to.equal(false);
		});

		it('flags paths that address, contain or reach a secret field', function () {
			expect(isSensitivePath(userList, 'recovery')).to.equal(true);
			expect(isSensitivePath(userList, 'recovery.length')).to.equal(true);
			expect(isSensitivePath(userList, 'integration.value')).to.equal(true);
			// The parent of a nested secret field would return the whole nested object.
			expect(isSensitivePath(userList, 'integration')).to.equal(true);
			expect(isSensitivePath(userList, 'integration.label')).to.equal(false);
			expect(isSensitivePath(userList, 'apiToken')).to.equal(false);
			// A path that merely shares a prefix string is unaffected.
			expect(isSensitivePath(userList, 'integ')).to.equal(false);

			expect(isSensitivePath(postList, 'author.recovery')).to.equal(true);
			expect(isSensitivePath(postList, 'editors.0.recovery')).to.equal(true);
			expect(isSensitivePath(postList, 'editors.integration.value')).to.equal(true);
			expect(isSensitivePath(postList, 'author.integration')).to.equal(true);
			expect(isSensitivePath(postList, 'author.email')).to.equal(false);
			// The parent of a nested relationship could return a populated document.
			expect(isSensitivePath(postList, 'meta')).to.equal(true);
		});

		it('keeps the passwordFieldRedaction exports working', function () {
			expect(legacyExports.isPasswordField).to.equal(isPasswordField);
			expect(legacyExports.getPasswordFieldPaths).to.equal(getPasswordFieldPaths);
			expect(legacyExports.isSensitivePath).to.equal(isSensitivePath);
			expect(legacyExports.withoutPasswordFields).to.equal(withoutSecretFields);
			expect(legacyExports.toJSONWithoutPasswordFields).to.equal(toJSONWithoutSecretFields);
			expect(legacyExports.isHydratedDocument).to.be.a('function');
		});
	});

	describe('document redaction', function () {
		it('strips secret fields from documents and plain objects', function () {
			for (const doc of [hydrated(userData), userData]) {
				const safe = withoutSecretFields(userList, doc);
				expect(safe).to.deep.equal(safeUserData);
				expectNoSecret(safe);
			}
			expect(userData.recovery).to.equal(RESET_KEY);
		});

		it('redacts the JSON form of a value, following populated relationships', function () {
			const post = { toJSON: () => ({ _id: 'p1', title: 'Hello', author: userData, editors: [userData, 'u2'] }) };
			const safe = toJSONWithoutSecretFields(postList, post);
			expect(safe).to.deep.equal({ _id: 'p1', title: 'Hello', author: safeUserData, editors: [safeUserData, 'u2'] });
			expectNoSecret(safe);
		});
	});

	describe('serializers with stub lists', function () {
		const admin = hydrated(userData);
		const values: Record<string, unknown> = {
			'title': 'Hello',
			'author': admin,
			'editors': [admin],
			'author.recovery': RESET_KEY,
			'editors.recovery': [RESET_KEY],
			'editors.0.integration.value': API_TOKEN,
			'author.integration': { value: API_TOKEN, label: 'ci' },
			'author.email': 'ada@example.com',
		};
		const item = { id: 'p1', author: admin, editors: [admin], get: (path: string) => values[path] };
		const paths = Object.keys(values);
		const listBase = { options: {}, getDocumentName: () => 'Hello' };

		it('Relationship getData removes secret fields from populated documents', function () {
			const proto = RelationshipType.prototype as unknown as { getData(this: unknown, i: typeof item): unknown };
			expect(proto.getData.call({ path: 'author', many: false, refList: userList }, item)).to.deep.equal(safeUserData);
			expect(proto.getData.call({ path: 'editors', many: true, refList: userList }, item)).to.deep.equal([safeUserData]);
		});

		it('getData vets fields paths through populated relationships', function () {
			const proto = RelationshipType.prototype as unknown as { getData(this: unknown, i: typeof item): unknown };
			function relationshipGetData(this: unknown, i: typeof item): unknown { return proto.getData.call(this, i); }
			const list = {
				...listBase,
				fields: {
					title: { type: 'text', getData: (i: typeof item) => i.get('title') },
					author: { type: 'relationship', path: 'author', many: false, refList: userList, getData: relationshipGetData },
					editors: { type: 'relationship', path: 'editors', many: true, refList: userList, getData: relationshipGetData },
				},
			};
			const data = getData.call(list as never, item, paths);
			expectNoSecret(data);
			const fields = data['fields'] as Record<string, unknown>;
			expect(fields).to.have.all.keys('title', 'author', 'editors', 'author.email');
			expect(fields['author']).to.deep.equal(safeUserData);
		});

		it('getCSVData vets select paths through populated relationships', function () {
			const list = {
				...listBase,
				fields: {
					title: { type: 'text', path: 'title', options: {}, format: (i: typeof item) => i.get('title') },
					author: { type: 'relationship', path: 'author', refList: userList, options: {}, format: () => 'u1' },
					editors: { type: 'relationship', path: 'editors', many: true, refList: userList, options: {}, format: () => 'u1' },
				},
			};
			const data = getCSVData.call(list as never, item, { fields: paths });
			expectNoSecret(data);
			expect(data).to.have.all.keys('id', 'title', 'author', 'editors', 'author.email');
		});

		describe('a relationship field configured with a `toCSV` key list', function () {
			function csvFor(toCSV: string | string[], field: Record<string, unknown> = {}): Record<string, unknown> {
				const list = {
					...listBase,
					fields: {
						author: { type: 'relationship', path: 'author', refList: userList, options: { toCSV }, format: () => 'u1', ...field },
					},
				};
				return getCSVData.call(list as never, item, { fields: ['author'] });
			}

			it('never exports a secret field of the related document', function () {
				for (const toCSV of ['password', 'recovery', 'integration', 'integration.value', ['password'], 'email, password, recovery, integration']) {
					const data = csvFor(toCSV);
					expectNoSecret(data);
					expect(JSON.stringify(data)).to.not.include(API_TOKEN);
				}
				expect(csvFor('email, password, recovery')).to.deep.equal({ id: 'p1', authorEmail: 'ada@example.com' });
				expect(csvFor('password')).to.deep.equal({ id: 'p1' });
			});

			it('still exports non-secret keys', function () {
				expect(csvFor('email')).to.deep.equal({ id: 'p1', author: 'ada@example.com' });
				expect(csvFor('email, apiToken')).to.deep.equal({ id: 'p1', authorEmail: 'ada@example.com', authorApiToken: 'not-declared-secret' });
			});

			it('exports nothing when the related list is unknown', function () {
				expect(csvFor('email, password', { refList: undefined })).to.deep.equal({ id: 'p1' });
			});

			it('tolerates an empty relationship', function () {
				const list = {
					...listBase,
					fields: { author: { type: 'relationship', path: 'author', refList: userList, options: { toCSV: 'email' }, format: () => '' } },
				};
				expect(getCSVData.call(list as never, { id: 'p2', author: null, get: () => null }, { fields: ['author'] })).to.deep.equal({ id: 'p2' });
			});
		});

		it('apiForGet removes secret fields from the item and populated relationships', async function () {
			const list = { ...postList, model: { findById: () => ({ exec: () => Promise.resolve({ _id: 'p1', author: userData, editors: [userData] }) }) } };
			const body = await new Promise<unknown>((resolve) => {
				const res = { json: resolve, status: () => res };
				(apiForGet.call(list as never) as unknown as (req: unknown, res: unknown) => void)({ params: { id: 'p1' } }, res);
			});
			expect(body).to.deep.equal({ data: { _id: 'p1', author: safeUserData, editors: [safeUserData] } });
			expectNoSecret(body);
		});

		it('the session projection never reads a secret field', function () {
			const user = { id: 'u1', name: 'Ada', email: RESET_KEY } as never;
			const list = { namePath: 'name', fields: { name: { type: 'text' }, email: { type: 'text', options: { secret: true } } }, getDocumentName: () => 'Ada' };
			expect(projectSessionUser(user, list)).to.deep.equal({ id: 'u1', name: 'Ada' });
			const secretName = { namePath: 'name', fields: { name: { type: 'text', secret: true } }, getDocumentName: () => RESET_KEY };
			expect(projectSessionUser({ id: 'u1', name: RESET_KEY } as never, secretName)).to.deep.equal({ id: 'u1' });
		});

		it('filters, search and sort ignore secret fields', function () {
			const filterField = (path: string, extra: Record<string, unknown> = {}) => ({
				path, type: 'text', addFilterToQuery: (f: { value: string }) => ({ [path]: f.value }), ...extra,
			});
			const list = {
				options: {},
				autokey: null,
				defaultSort: 'email',
				namePath: 'email',
				mappings: { name: 'recovery' },
				fields: { email: filterField('email'), recovery: filterField('recovery', { options: { secret: true } }) },
				searchFields: [] as unknown[],
				get: () => 'email, recovery',
			};
			list.searchFields = [{ path: 'email', field: list.fields.email }, { path: 'recovery', field: list.fields.recovery }];
			const asList = list as unknown as KeystoneList;

			expect(addFiltersToQuery.call(asList, { email: { value: 'a' }, recovery: { value: RESET_KEY } })).to.deep.equal({ email: 'a' });
			expect(Object.keys(addSearchToQuery.call(asList, 'reset'))).to.deep.equal(['email']);
			expect(Object.keys(getSearchFilters.call(asList, 'reset', {
				recovery: { key: 'recovery', value: 'reset', field: list.fields.recovery },
			}))).to.deep.equal(['email']);
			expect(expandSort.call(asList, 'recovery,-email').string).to.equal('-email');
			expect(expandSort.call(asList, '-recovery').string).to.equal('');

			// With no other search field, the name-path fallback must not search the secret field either.
			list.searchFields = [];
			expect(addSearchToQuery.call(asList, 'reset')).to.deep.equal({});
		});
	});

	describe('a real list with a `secret: true` field', function () {
		const key = 'SecretOptionUnitAccount';
		// Unresolved before the first build, where the rule would fire.
		// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
		type RealList = KeystoneList & {
			add(fields: Record<string, unknown>): void;
			register(): void;
			model: new (data: Record<string, unknown>) => { get(path: string): unknown };
		};
		let list: RealList;
		let doc: { get(path: string): unknown };

		before(function () {
			removeModel(key);
			list = new keystone.List(key, {}) as unknown as RealList;
			list.add({
				label: { type: String, initial: true },
				recovery: { type: String, secret: true },
				token: { type: Types.Key, secret: true, index: true },
				password: { type: Types.Password },
			});
			list.register();
			doc = new list.model({ label: 'Main', recovery: RESET_KEY, token: API_TOKEN, password: BCRYPT_HASH });
		});

		after(function () {
			removeModel(key);
		});

		it('exposes the option on the field and reports it as hidden', function () {
			const field = list.fields['recovery'] as unknown as { secret: boolean; hidden: boolean; getOptions(): Record<string, unknown> };
			expect(field.secret).to.equal(true);
			expect(field.hidden).to.equal(true);
			expect(field.getOptions()).to.include({ secret: true, hidden: true });
			const plain = list.fields['label'] as unknown as { secret: boolean; hidden: boolean; getOptions(): Record<string, unknown> };
			expect(plain.secret).to.equal(false);
			expect(plain.hidden).to.equal(false);
			expect(plain.getOptions()).to.not.have.any.keys('secret', 'hidden');
			expect(getSecretFieldPaths(list)).to.have.members(['recovery', 'token', 'password']);
		});

		it('keeps the field out of the Admin UI form elements', function () {
			const options = list.getOptions() as { fields: Record<string, Record<string, unknown>>; uiElements: Array<{ field?: string }> };
			expect(options.uiElements.map((el) => el.field)).to.deep.equal(['label', 'password']);
			expect(options.fields['recovery']).to.include({ secret: true, hidden: true });
		});

		it('is still readable by application code', function () {
			expect(doc.get('recovery')).to.equal(RESET_KEY);
			expect(doc.get('token')).to.equal(API_TOKEN);
		});

		it('is omitted from getData, including when requested by path', function () {
			for (const fields of [undefined, 'label,recovery,token,password', ['recovery'], 'recovery.length,token.0']) {
				const data = getData.call(list, doc as never, fields);
				expectNoSecret(data);
				expect(data['fields']).to.not.have.any.keys('recovery', 'token');
			}
			const all = getData.call(list, doc as never)['fields'] as Record<string, unknown>;
			// Password fields keep reporting only whether a value is set.
			expect(all).to.deep.equal({ label: 'Main', password: 'true' });
		});

		it('is omitted from getCSVData, including when selected', function () {
			for (const fields of [undefined, 'label,recovery,token,password', ['recovery', 'token']]) {
				const data = getCSVData.call(list, doc, fields === undefined ? {} : { fields });
				expectNoSecret(data);
				expect(data).to.not.have.any.keys('recovery', 'token');
			}
			expect(getCSVData.call(list, doc, {})).to.include({ label: 'Main' });
		});

		it('cannot be filtered or sorted on', function () {
			expect(addFiltersToQuery.call(list, {
				label: { mode: 'exactly', value: 'Main' },
				recovery: { mode: 'beginsWith', value: 'r' },
				token: { mode: 'beginsWith', value: 'a' },
			})).to.have.all.keys('label');
			expect(expandSort.call(list, 'recovery,-token,label').string).to.equal('label');
		});
	});
});
