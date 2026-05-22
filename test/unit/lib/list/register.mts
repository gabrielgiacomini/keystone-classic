import { expect } from 'chai';
import keystone from 'keystone';
import mongoose, { Mongoose } from 'mongoose';
import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import removeModel from '../../../helpers/removeModel.mts';

const duplicateKey = 'DuplicateRegister';
const duplicatePathA = 'DuplicatePathA';
const duplicatePathB = 'DuplicatePathB';
const explicitCollectionKey = 'ExplicitCollectionRegister';
const explicitCollectionName = 'explicit_collection_registers';
const injectedMongooseKey = 'InjectedMongooseRegister';
const listConfigKey = 'ListConfigRegister';
const schemaEscapeKey = 'SchemaEscapeRegister';
const registryLivenessKey = 'RegistryLivenessRegister';
const underscoreMethodKey = 'UnderscoreMethodRegister';
let connectedMongoose: typeof mongoose;

// keystone.List and keystone.lists are typed loosely on the public interface;
// cast through `unknown` to avoid `any` while keeping test-local type safety.
interface KsList {
	add(...fields: Record<string, unknown>[]): void;
	key: string;
	label: string;
	mappings: { name: string | null };
	model: KsModel;
	path: string;
	plural: string;
	register(): void;
	schema: {
		index(fields: Record<string, 1 | -1 | 'text'>, options?: Record<string, unknown>): void;
		indexes(): Array<[Record<string, unknown>, Record<string, unknown>]>;
		methods: Record<string, unknown>;
		path(path: string): { options?: Record<string, unknown> } | undefined;
		pre(event: 'save', callback: (this: KsDoc, next: (err?: Error) => void) => void): void;
		post(event: 'save', callback: (this: KsDoc) => void): void;
		virtual(path: string): { get(callback: (this: KsDoc) => unknown): void };
	};
	searchFields: unknown[];
	singular: string;
	underscoreMethod(path: string, fn: (this: KsDoc) => unknown): void;
	uiElements: Array<Record<string, unknown>>;
	defaultColumns: unknown[];
	defaultSort: string;
	getOptions(): Record<string, unknown>;
}
interface KsListConstructor {
	new(key: string, options?: Record<string, unknown>): KsList;
}
interface KsDoc extends Record<string, unknown> {
	_id: unknown;
	_: Record<string, unknown>;
	get(path: string): unknown;
	set(path: string, value: unknown): void;
	save(): Promise<KsDoc>;
}
interface KsQuery<T> {
	exec(): Promise<T>;
}
interface KsModel {
	new(data?: Record<string, unknown>): KsDoc;
	collection: { name: string };
	deleteMany(query: Record<string, unknown>): KsQuery<unknown>;
	findById(id: unknown): KsQuery<KsDoc | null>;
	findOne(query: Record<string, unknown>): KsQuery<KsDoc | null>;
}

function ksListFactory(): KsListConstructor {
	return (keystone as unknown as { List: KsListConstructor }).List;
}

function ksLists(): Record<string, unknown> {
	return (keystone as unknown as { lists: Record<string, unknown> }).lists;
}

describe('List.register', function () {
	before(async function () {
		connectedMongoose = await getMongooseConnection();
		(keystone as unknown as { init(options?: Record<string, unknown>): void }).init({ mongoose: connectedMongoose });
	});

	afterEach(function () {
		removeModel(duplicateKey);
		removeModel(duplicatePathA);
		removeModel(duplicatePathB);
		removeModel(explicitCollectionKey);
		removeModel(injectedMongooseKey);
		removeModel(listConfigKey);
		removeModel(schemaEscapeKey);
		removeModel(registryLivenessKey);
		removeModel(underscoreMethodKey);
		(keystone as unknown as { init(options?: Record<string, unknown>): void }).init({ mongoose: connectedMongoose });
	});

	it('derives default path and labels with legacy naming helpers', function () {
		const List = ksListFactory();
		const list = new List('FieldSample', {});

		expect(list.path).to.equal('field-samples');
		expect(list.label).to.equal('Field Samples');
		expect(list.singular).to.equal('Field Sample');
		expect(list.plural).to.equal('Field Samples');
	});

	it('preserves Cloom-style constructor options and sectioned field groups', function () {
		const List = ksListFactory();
		const list = new List(listConfigKey, {
			autokey: { path: 'autoSlug', from: 'slugInput', unique: true },
			defaultColumns: 'systemTitle|35%, state|15%, createdAt|25%',
			defaultSort: '-createdAt',
			label: 'Cloom Records',
			map: { name: 'systemTitle' },
			path: 'cloom-records',
			perPage: 25,
			plural: 'Cloom Records',
			schema: {
				collection: 'cloom_list_config_registers',
				versionKey: false,
			},
			searchFields: 'systemTitle, state, notes',
			singular: 'Cloom Record',
			sortable: false,
			track: false,
		});

		list.add(
			{ heading: 'Core Fields' },
			{
				createdAt: { type: Date },
				notes: { type: String },
				slugInput: { type: String },
				state: { type: String },
				systemTitle: { required: true, type: String },
			}
		);
		list.register();

		const options = list.getOptions();
		const heading = list.uiElements[0];

		expect(list.path).to.equal('cloom-records');
		expect(list.label).to.equal('Cloom Records');
		expect(list.singular).to.equal('Cloom Record');
		expect(list.plural).to.equal('Cloom Records');
		expect(list.mappings.name).to.equal('systemTitle');
		expect(list.model.collection.name).to.equal('cloom_list_config_registers');
		expect(list.schema.path('autoSlug')?.options?.index).to.deep.equal({ unique: true, sparse: true });
		expect(list.defaultSort).to.equal('-createdAt');
		expect(list.defaultColumns.map((column) => (column as { path: string; width?: string }).path)).to.deep.equal([
			'systemTitle',
			'state',
			'createdAt',
		]);
		expect(list.searchFields.map((field) => (field as { path: string }).path)).to.deep.equal([
			'systemTitle',
			'state',
			'notes',
		]);
		expect(options.perPage).to.equal(25);
		expect(options.sortable).to.equal(false);
		expect(options.track).to.equal(false);
		expect(options.defaultSort).to.equal('-createdAt');
		expect(options.defaultColumns).to.equal('systemTitle|35%, state|15%, createdAt|25%');
		expect(options.searchFields).to.equal('systemTitle, state, notes');
		expect(heading).to.include({ type: 'heading', heading: 'Core Fields' });
		expect(list.uiElements.slice(1).map((element) => (element['field'] as { path: string }).path)).to.deep.equal([
			'createdAt',
			'notes',
			'slugInput',
			'state',
			'systemTitle',
		]);
	});

	it('throws before replacing an existing list key', function () {
		const List = ksListFactory();
		const first = new List(duplicateKey, {});
		first.add({ name: { type: String } });
		first.register();

		const second = new List(duplicateKey, {});
		second.add({ name: { type: String } });

		expect(() => second.register()).to.throw('list "' + duplicateKey + '" is already registered');
		expect(ksLists()[duplicateKey]).to.equal(first);
	});

	it('throws before registering a list with a duplicate admin path', function () {
		const List = ksListFactory();
		const first = new List(duplicatePathA, { path: 'shared-register-path' });
		first.add({ name: { type: String } });
		first.register();

		const second = new List(duplicatePathB, { path: 'shared-register-path' });
		second.add({ name: { type: String } });

		expect(() => second.register()).to.throw('path "shared-register-path" is already registered');
		expect(ksLists()[duplicatePathB]).to.equal(undefined);
	});

	it('honors explicit schema collection names for registered list model CRUD', async function () {
		const List = ksListFactory();
		const list = new List(explicitCollectionKey, {
			map: { name: 'name' },
			schema: {
				collection: explicitCollectionName,
				versionKey: false,
			},
		});
		list.add({
			name: { required: true, type: String },
			status: { type: String },
		});
		list.schema.pre('save', function (this: KsDoc, next) {
			this['status'] = this['status'] ?? 'created';
			next();
		});
		list.register();

		expect(list.key).to.equal(explicitCollectionKey);
		expect(list.model.collection.name).to.equal(explicitCollectionName);

		const matchCreatedByThisTest = { name: /^explicit collection smoke/ };
		await list.model.deleteMany(matchCreatedByThisTest).exec();

		try {
			const created = await new list.model({ name: 'explicit collection smoke create' }).save();
			const found = await list.model.findOne({ name: 'explicit collection smoke create' }).exec();

			expect(found).to.not.equal(null);
			if (found === null) {
				throw new Error('Expected explicit collection smoke document to be readable');
			}
			expect(found['status']).to.equal('created');

			found['status'] = 'updated';
			await found.save();

			const updated = await list.model.findById(created._id).exec();
			expect(updated).to.not.equal(null);
			if (updated === null) {
				throw new Error('Expected explicit collection smoke document to be update-readable');
			}
			expect(updated['status']).to.equal('updated');

			await list.model.deleteMany({ _id: created._id }).exec();
			const deleted = await list.model.findById(created._id).exec();
			expect(deleted).to.equal(null);
		} finally {
			await list.model.deleteMany(matchCreatedByThisTest).exec();
		}
	});

	it('keeps key and path registry lookups walkable with live list/model/schema entries', function () {
		const List = ksListFactory();
		const list = new List(registryLivenessKey, {
			map: { name: 'title' },
			path: 'registry-liveness-items',
		});
		list.add({
			title: { required: true, type: String },
		});
		list.register();

		const lookup = keystone as unknown as { list(key: string): KsList };
		const registered = ksLists()[registryLivenessKey] as KsList;

		expect(registered).to.equal(list);
		expect(lookup.list(registryLivenessKey)).to.equal(list);
		expect(lookup.list('registry-liveness-items')).to.equal(list);
		expect(Object.keys(ksLists())).to.include(registryLivenessKey);
		expect(registered.key).to.equal(registryLivenessKey);
		expect(registered.model).to.equal(list.model);
		expect(registered.schema).to.equal(list.schema);
	});

	it('compiles schemas and models with the mongoose instance supplied through keystone.init', function () {
		const customMongoose = new Mongoose();
		const pluginField = 'injectedPluginMarker';
		const nowDefault = Date.now;
		customMongoose.plugin(function injectedMongoosePlugin(schema) {
			schema.add({ [pluginField]: { default: 'from-injected-mongoose', type: String } });
			schema.method('readInjectedPluginMarker', function (this: KsDoc) {
				return this.get(pluginField);
			});
		});

		try {
			(keystone as unknown as { init(options?: Record<string, unknown>): void }).init({ mongoose: customMongoose });
			const List = ksListFactory();
			const list = new List(injectedMongooseKey, {
				map: { name: 'title' },
			});
			list.add({
				active: { default: true, type: Boolean },
				count: { default: 0, type: Number },
				createdAt: { default: nowDefault, type: Date },
				state: { default: 'draft', enum: ['draft', 'published'], type: String },
				title: { required: true, type: String },
			});
			list.register();

			const schema = list.schema as unknown as {
				base: unknown;
				path(path: string): { defaultValue?: unknown; enumValues?: string[] } | undefined;
			};
			const model = list.model as unknown as {
				base: unknown;
				new (data?: Record<string, unknown>): KsDoc & { readInjectedPluginMarker(): unknown };
			};
			const createdAtPath = schema.path('createdAt');
			const statePath = schema.path('state');
			const doc = new model({ title: 'injected mongoose smoke' });

			expect(schema.base).to.equal(customMongoose);
			expect(model.base).to.equal(customMongoose);
			expect(schema.path(pluginField)).to.exist;
			expect(doc.readInjectedPluginMarker()).to.equal('from-injected-mongoose');
			expect(createdAtPath?.defaultValue).to.equal(nowDefault);
			expect(statePath?.enumValues).to.deep.equal(['draft', 'published']);
			expect(schema.path('active')).to.exist;
			expect(schema.path('count')).to.exist;
			expect(schema.path('title')).to.exist;
		} finally {
			removeModel(injectedMongooseKey);
			if (customMongoose.models[injectedMongooseKey]) {
				customMongoose.deleteModel(injectedMongooseKey);
			}
			(keystone as unknown as { init(options?: Record<string, unknown>): void }).init({ mongoose: connectedMongoose });
		}
	});

	it('defers schema compilation until register so Cloom schema escape hatches are live', async function () {
		const List = ksListFactory();
		const list = new List(schemaEscapeKey, {
			map: { name: 'name' },
			path: 'schema-escape-registers',
			schema: {
				collection: 'schema_escape_registers',
				versionKey: false,
			},
		});
		const hookOrder: string[] = [];
		const postSaveStatuses: unknown[] = [];

		list.add({
			abortSave: { type: Boolean },
			mode: { type: String },
			name: { required: true, type: String },
			state: { type: String },
			status: { type: String },
		});
		list.schema.pre('save', function firstCloomPreSaveHook(this: KsDoc, next) {
			hookOrder.push('first:' + String(this.get('name')));
			this.set('status', 'first-pass');
			next();
		});
		list.schema.pre('save', function secondCloomPreSaveHook(this: KsDoc, next) {
			hookOrder.push('second:' + String(this.get('name')));
			if (this.get('abortSave') === true) {
				next(new Error('abort from Cloom-style hook'));
				return;
			}
			if (this.get('mode') === 'persist-error-state') {
				this.set('state', 'error');
				this.set('status', 'error');
			} else {
				this.set('status', 'ready');
			}
			next();
		});
		list.schema.post('save', function cloomPostSaveHook(this: KsDoc) {
			postSaveStatuses.push(this.get('status'));
		});
		list.schema.virtual('displayTitle').get(function cloomDisplayTitleVirtual(this: KsDoc) {
			return String(this.get('name')) + ':' + String(this.get('status'));
		});
		list.schema.methods['readDisplayTitle'] = function readDisplayTitle(this: KsDoc) {
			return this.get('displayTitle');
		};
		list.schema.index({ name: 1, status: -1 }, {
			name: 'schema_escape_name_status',
			sparse: true,
		});
		list.register();

		const lookup = keystone as unknown as { list(key: string): KsList };
		const registered = lookup.list(schemaEscapeKey);
		const index = list.schema.indexes().find(function ([fields, options]) {
			return fields['name'] === 1 && fields['status'] === -1 && options['name'] === 'schema_escape_name_status';
		});

		expect(registered.model).to.equal(list.model);
		expect(index?.[1]).to.include({ sparse: true });

		const matchCreatedByThisTest = { name: /^schema escape smoke/ };
		await list.model.deleteMany(matchCreatedByThisTest).exec();

		try {
			const created = await new list.model({ name: 'schema escape smoke ok' }).save();
			const persistedErrorState = await new list.model({
				mode: 'persist-error-state',
				name: 'schema escape smoke error-state',
			}).save();

			expect(hookOrder.slice(0, 4)).to.deep.equal([
				'first:schema escape smoke ok',
				'second:schema escape smoke ok',
				'first:schema escape smoke error-state',
				'second:schema escape smoke error-state',
			]);
			expect(created.get('status')).to.equal('ready');
			expect(created.get('displayTitle')).to.equal('schema escape smoke ok:ready');
			expect((created as KsDoc & { readDisplayTitle(): unknown }).readDisplayTitle()).to.equal('schema escape smoke ok:ready');
			expect(persistedErrorState.get('state')).to.equal('error');
			expect(persistedErrorState.get('status')).to.equal('error');
			expect(postSaveStatuses).to.deep.equal(['ready', 'error']);

			try {
				await new list.model({ abortSave: true, name: 'schema escape smoke abort' }).save();
				throw new Error('Expected Cloom-style pre-save hook to abort the save');
			} catch (err: unknown) {
				expect(err).to.be.instanceOf(Error);
				expect((err as Error).message).to.equal('abort from Cloom-style hook');
			}

			const aborted = await list.model.findOne({ name: 'schema escape smoke abort' }).exec();
			expect(aborted).to.equal(null);
			expect(postSaveStatuses).to.deep.equal(['ready', 'error']);
		} finally {
			await list.model.deleteMany(matchCreatedByThisTest).exec();
		}
	});

	it('binds underscore methods to document instances lazily', async function () {
		const List = ksListFactory();
		const list = new List(underscoreMethodKey, {
			map: { name: 'name' },
		});
		list.add({
			name: { required: true, type: String },
		});
		list.underscoreMethod('summary.label', function (this: KsDoc) {
			return 'summary:' + String(this['name']);
		});
		list.register();

		const matchCreatedByThisTest = { name: /^underscore method smoke/ };
		await list.model.deleteMany(matchCreatedByThisTest).exec();

		try {
			const created = await new list.model({ name: 'underscore method smoke create' }).save();
			const methods = created._;
			expect(methods).to.equal(created._);
			const summary = methods['summary'] as Record<string, unknown>;
			expect(summary).to.have.property('label').that.is.a('function');
			expect((summary['label'] as () => unknown)()).to.equal('summary:underscore method smoke create');
		} finally {
			await list.model.deleteMany(matchCreatedByThisTest).exec();
		}
	});
});
