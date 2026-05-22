import { expect } from 'chai';
import keystone, { Types as KeystoneTypes } from 'keystone';
import mongoose from 'mongoose';

import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import removeModel from '../../../helpers/removeModel.mts';

const listKey = 'CloudinaryImageRuntimePermalink';
const collectionName = 'cloudinary_image_runtime_permalinks';
let connectedMongoose: typeof mongoose;
let runtimeList: RuntimeList | null = null;

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
	deleteMany(query: Record<string, unknown>): RuntimeQuery<unknown>;
	findById(id: unknown): RuntimeQuery<RuntimeDoc | null>;
}

interface RuntimeField {
	getData(item: RuntimeDoc): unknown;
	getFolder(): string | null;
}

interface RuntimeList {
	add(fields: Record<string, unknown>): void;
	fields: Record<string, RuntimeField | undefined>;
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

const expectedPayload = {
	format: 'png',
	height: 630,
	public_id: 'permalinks/public-page/social-card',
	resource_type: 'image',
	secure_url: 'https://res.cloudinary.test/image/upload/v1716232026/permalinks/public-page/social-card.png',
	signature: '26c83a021bcebe6f3ec906b2aa23ccd84afaa8c1',
	url: 'http://res.cloudinary.test/image/upload/v1716232026/permalinks/public-page/social-card.png',
	version: 1716232026,
	width: 1200,
};

function resetKeystone(): void {
	(keystone as unknown as { init(options?: Record<string, unknown>): void }).init({
		mongoose: connectedMongoose,
		'cloudinary config': {
			api_key: 'test-key',
			api_secret: 'test-secret',
			cloud_name: 'cloom-test',
		},
		'cloudinary folders': true,
		'cloudinary prefix': 'cloom',
		'cloudinary secure': true,
	});
}

function listConstructor(): RuntimeListConstructor {
	return (keystone as unknown as { List: RuntimeListConstructor }).List;
}

function registerRuntimeList(): void {
	const List = listConstructor();
	runtimeList = new List(listKey, {
		map: { name: 'title' },
		schema: {
			collection: collectionName,
			versionKey: false,
		},
	});
	runtimeList.add({
		metadataImage: { folder: 'permalinks', type: KeystoneTypes.CloudinaryImage },
		title: { required: true, type: String },
	});
	runtimeList.register();
}

function unregisterRuntimeList(): void {
	removeModel(listKey);
	runtimeList = null;
}

function list(): RuntimeList {
	if (!runtimeList) {
		throw new Error('CloudinaryImage runtime list was not registered');
	}
	return runtimeList;
}

function field(): RuntimeField {
	const metadataImage = list().fields['metadataImage'];
	if (!metadataImage) {
		throw new Error('CloudinaryImage runtime field was not registered');
	}
	return metadataImage;
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error('Expected object record for ' + label);
	}
	return value as Record<string, unknown>;
}

function jsonRecord(value: unknown, label: string): Record<string, unknown> {
	const parsed: unknown = JSON.parse(JSON.stringify(value));
	return asRecord(parsed, label);
}

function updateListItem(item: RuntimeDoc, data: Record<string, unknown>): Promise<void> {
	return new Promise<void>(function (resolve, reject) {
		list().updateItem(item, data, { fields: ['metadataImage'], ignoreNoEdit: true }, function (err?: unknown) {
			if (err) {
				reject(err instanceof Error ? err : new Error(JSON.stringify(err)));
				return;
			}
			resolve();
		});
	});
}

describe('List CloudinaryImage runtime payload', function () {
	before(async function () {
		connectedMongoose = await getMongooseConnection();
		resetKeystone();
	});

	beforeEach(function () {
		unregisterRuntimeList();
		resetKeystone();
		registerRuntimeList();
	});

	afterEach(async function () {
		if (runtimeList) {
			await runtimeList.model.deleteMany({}).exec();
		}
		unregisterRuntimeList();
		resetKeystone();
	});

	it('preserves the Cloom Permalink CloudinaryImage payload shape when saved through list.updateItem', async function () {
		const RuntimeModel = list().model;
		const item = new RuntimeModel({ title: 'Cloudinary payload smoke' });
		await item.save();

		await updateListItem(item, {
			metadataImage: {
				...expectedPayload,
				publicId: 'camel-case-should-not-persist',
				secureUrl: 'camel-case-should-not-persist',
			},
		});

		const saved = await list().model.findById(item._id).lean().exec();
		const image = asRecord(saved?.['metadataImage'], 'saved metadataImage');

		expect(image).to.deep.equal(expectedPayload);
		expect(image).not.to.have.property('publicId');
		expect(image).not.to.have.property('secureUrl');

		const reloaded = await list().model.findById(item._id).exec();
		if (!reloaded) {
			throw new Error('Expected saved CloudinaryImage runtime document to reload');
		}
		expect(jsonRecord(field().getData(reloaded), 'field getData')).to.deep.equal(expectedPayload);
		expect(field().getFolder()).to.equal('permalinks');
	});
});
