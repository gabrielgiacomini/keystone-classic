import { expect } from 'chai';
import keystone, { Types as KeystoneTypes } from 'keystone';
import mongoose from 'mongoose';

import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import removeModel from '../../../helpers/removeModel.mts';

const authorKey = 'CloomFieldRuntimeAuthor';
const contentKey = 'CloomFieldRuntimeContent';
let connectedMongoose: typeof mongoose;
let authorList: RuntimeList | null = null;
let contentList: RuntimeList | null = null;

interface RuntimeDoc extends Record<string, unknown> {
	_id: unknown;
	get(path: string): unknown;
	save(): Promise<RuntimeDoc>;
}

interface RuntimeQuery<T> {
	exec(): Promise<T>;
	lean(): RuntimeQuery<Record<string, unknown> | null>;
}

interface RuntimeModel {
	new(data?: Record<string, unknown>): RuntimeDoc;
	create(data: Record<string, unknown>): Promise<RuntimeDoc>;
	deleteMany(query: Record<string, unknown>): RuntimeQuery<unknown>;
	findById(id: unknown): RuntimeQuery<RuntimeDoc | null>;
}

interface RuntimeList {
	add(fields: Record<string, unknown>): void;
	model: RuntimeModel;
	register(): void;
	updateItem(
		item: RuntimeDoc,
		data: Record<string, unknown>,
		options: Record<string, unknown>,
		callback: (err?: unknown) => void,
	): void;
}

interface RuntimeListConstructor {
	new(key: string, options?: Record<string, unknown>): RuntimeList;
}

const cloudinaryPayload = {
	format: 'png',
	height: 630,
	public_id: 'permalinks/aggregate-field/social-card',
	resource_type: 'image',
	secure_url: 'https://res.cloudinary.test/image/upload/v1716232026/permalinks/aggregate-field/social-card.png',
	signature: '7ad3a2f0d09c601e0b0f8f810fb1a5fd89ff4bb7',
	url: 'http://res.cloudinary.test/image/upload/v1716232026/permalinks/aggregate-field/social-card.png',
	version: 1716232026,
	width: 1200,
};
const generatedSecret = ['Correct', 'Horse', String(42)].join('');

function resetKeystone(): void {
	(keystone as unknown as { init(options?: Record<string, unknown>): void }).init({
		mongoose: connectedMongoose,
		'cloudinary config': {
			api_key: 'test-key',
			api_secret: 'test-secret',
			cloud_name: 'cloom-test',
		},
		'cloudinary folders': true,
		'cloudinary secure': true,
	});
}

function listConstructor(): RuntimeListConstructor {
	return (keystone as unknown as { List: RuntimeListConstructor }).List;
}

function registerRuntimeLists(): void {
	const List = listConstructor();

	authorList = new List(authorKey, {
		map: { name: 'name' },
		schema: {
			collection: 'cloom_field_runtime_authors',
			versionKey: false,
		},
	});
	authorList.add({
		name: { required: true, type: String },
	});
	authorList.register();

	contentList = new List(contentKey, {
		map: { name: 'title' },
		schema: {
			collection: 'cloom_field_runtime_contents',
			versionKey: false,
		},
	});
	contentList.add({
		author: { ref: authorKey, type: KeystoneTypes.Relationship },
		body: { type: KeystoneTypes.Textarea },
		budget: { type: KeystoneTypes.Money },
		contactEmail: { type: KeystoneTypes.Email },
		displayName: { type: KeystoneTypes.Name },
		isActive: { type: KeystoneTypes.Boolean },
		jsonConfig: { height: 600, language: 'json', type: KeystoneTypes.Code },
		metadataImage: { folder: 'permalinks', type: KeystoneTypes.CloudinaryImage },
		nativeFlag: { type: Boolean },
		nativeScore: { type: Number },
		nativeTitle: { type: String },
		publishedAt: { type: KeystoneTypes.Datetime },
		score: { type: KeystoneTypes.Number },
		secretPassword: {
			min: 8,
			rejectCommon: false,
			type: KeystoneTypes.Password,
			workFactor: 4,
		},
		state: { options: 'draft, published, archived', type: KeystoneTypes.Select },
		title: { required: true, type: KeystoneTypes.Text },
		website: { type: KeystoneTypes.Url },
	});
	contentList.register();
}

async function cleanupRuntimeCollections(): Promise<void> {
	if (contentList) {
		await contentList.model.deleteMany({}).exec();
	}
	if (authorList) {
		await authorList.model.deleteMany({}).exec();
	}
}

function unregisterRuntimeLists(): void {
	removeModel(contentKey);
	removeModel(authorKey);
	contentList = null;
	authorList = null;
}

function runtimeLists(): { author: RuntimeList; content: RuntimeList } {
	if (!authorList || !contentList) {
		throw new Error('Cloom field runtime lists were not registered');
	}
	return { author: authorList, content: contentList };
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('Expected object record for ' + label);
	}
	return value as Record<string, unknown>;
}

function updateListItem(item: RuntimeDoc, data: Record<string, unknown>, fields: string[]): Promise<void> {
	return new Promise<void>(function (resolve, reject) {
		runtimeLists().content.updateItem(item, data, { fields, ignoreNoEdit: true }, function (err?: unknown) {
			if (err) {
				reject(err instanceof Error ? err : new Error(JSON.stringify(err)));
				return;
			}
			resolve();
		});
	});
}

describe('Cloom-used field type runtime aggregate', function () {
	before(async function () {
		connectedMongoose = await getMongooseConnection();
		resetKeystone();
	});

	beforeEach(function () {
		unregisterRuntimeLists();
		resetKeystone();
		registerRuntimeLists();
	});

	afterEach(async function () {
		await cleanupRuntimeCollections();
		unregisterRuntimeLists();
		resetKeystone();
	});

	it('registers and persists every Keystone field type used by Cloom models', async function () {
		const { author, content } = runtimeLists();
		const createdAuthor = await author.model.create({ name: 'Field Runtime Author' });
		const RuntimeModel = content.model;
		const item = new RuntimeModel({
			nativeFlag: true,
			nativeScore: 7,
			nativeTitle: 'Native constructor title',
			title: 'Initial aggregate field runtime',
		});
		await item.save();

		await updateListItem(item, {
			author: String(createdAuthor._id),
			body: 'Long editorial body',
			budget: '123.45',
			contactEmail: 'EDITOR@Example.COM',
			displayName: { first: 'Ada', last: 'Lovelace' },
			isActive: 'true',
			jsonConfig: '{ "enabled": true }',
			metadataImage: cloudinaryPayload,
			publishedAt: '2024-05-21 10:30:00 am +0000',
			score: '42',
			secretPassword: generatedSecret,
			secretPassword_confirm: generatedSecret,
			state: 'published',
			title: 'Aggregate field runtime',
			website: 'https://example.com/landing',
		}, [
			'author',
			'body',
			'budget',
			'contactEmail',
			'displayName',
			'isActive',
			'jsonConfig',
			'metadataImage',
			'publishedAt',
			'score',
			'secretPassword',
			'state',
			'title',
			'website',
		]);

		const saved = await content.model.findById(item._id).lean().exec();
		if (!saved) {
			throw new Error('Expected aggregate field runtime document to reload');
		}

		expect(String(saved['author'])).to.equal(String(createdAuthor._id));
		expect(saved).to.include({
			body: 'Long editorial body',
			budget: 123.45,
			contactEmail: 'editor@example.com',
			isActive: true,
			jsonConfig: '{ "enabled": true }',
			nativeFlag: true,
			nativeScore: 7,
			nativeTitle: 'Native constructor title',
			score: 42,
			state: 'published',
			title: 'Aggregate field runtime',
			website: 'https://example.com/landing',
		});

		expect(saved['publishedAt']).to.be.instanceOf(Date);
		expect((saved['publishedAt'] as Date).toISOString()).to.equal('2024-05-21T10:30:00.000Z');

		const displayName = asRecord(saved['displayName'], 'displayName');
		expect(displayName).to.deep.include({ first: 'Ada', last: 'Lovelace' });

		const storedPassword = saved['secretPassword'];
		expect(storedPassword).to.be.a('string');
		expect(storedPassword).to.not.equal(generatedSecret);
		expect(String(storedPassword)).to.match(/^\$2[aby]\$/);

		expect(asRecord(saved['metadataImage'], 'metadataImage')).to.deep.equal(cloudinaryPayload);
	});
});
