import { expect } from 'chai';
import keystone, { Types as KeystoneTypes } from 'keystone';
import mongoose from 'mongoose';

import getMongooseConnection from '../../../helpers/getMongooseConnection.mts';
import removeModel from '../../../helpers/removeModel.mts';

const authorKey = 'RuntimeApiAuthor';
const postKey = 'RuntimeApiPost';
let connectedMongoose: typeof mongoose;
let authorList: RuntimeList | null = null;
let postList: RuntimeList | null = null;

interface RuntimeDoc extends Record<string, unknown> {
	_id: unknown;
	get(path: string): unknown;
	save(): Promise<RuntimeDoc>;
}

interface RuntimeQuery<T> {
	exec(): Promise<T>;
	getOptions?(): Record<string, unknown>;
	lean(): RuntimeQuery<Array<Record<string, unknown>>>;
	populate(path: string): RuntimeQuery<T>;
	select(selection: string): RuntimeQuery<T>;
	session(session: unknown): RuntimeQuery<T>;
	sort(selection: string | Record<string, 1 | -1>): RuntimeQuery<T>;
}

interface RuntimeAggregate {
	exec(): Promise<Array<Record<string, unknown>>>;
	session?(session: unknown): RuntimeAggregate;
}

interface RuntimeModel {
	new(data?: Record<string, unknown>): RuntimeDoc;
	aggregate(pipeline: Array<Record<string, unknown>>): RuntimeAggregate;
	bulkWrite(operations: Array<Record<string, unknown>>, options?: Record<string, unknown>): Promise<unknown>;
	collection: { name: string };
	create(data: Record<string, unknown>): Promise<RuntimeDoc>;
	deleteMany(query: Record<string, unknown>, options?: Record<string, unknown>): RuntimeQuery<unknown>;
	find(query?: Record<string, unknown>, projection?: unknown, options?: Record<string, unknown>): RuntimeQuery<RuntimeDoc[]>;
	findById(id: unknown, projection?: unknown, options?: Record<string, unknown>): RuntimeQuery<RuntimeDoc | null>;
	findOne(query: Record<string, unknown>, projection?: unknown, options?: Record<string, unknown>): RuntimeQuery<RuntimeDoc | null>;
	findOneAndUpdate(
		query: Record<string, unknown>,
		update: Record<string, unknown>,
		options?: Record<string, unknown>
	): RuntimeQuery<RuntimeDoc | null>;
	insertMany(items: Array<Record<string, unknown>>, options?: Record<string, unknown>): Promise<RuntimeDoc[]>;
	updateMany(query: Record<string, unknown>, update: Record<string, unknown>, options?: Record<string, unknown>): RuntimeQuery<unknown>;
}

interface RuntimeList {
	add(fields: Record<string, unknown>): void;
	model: RuntimeModel;
	register(): void;
}

interface RuntimeListConstructor {
	new(key: string, options?: Record<string, unknown>): RuntimeList;
}

function resetKeystone(): void {
	(keystone as unknown as { init(options?: Record<string, unknown>): void }).init({ mongoose: connectedMongoose });
}

function listConstructor(): RuntimeListConstructor {
	return (keystone as unknown as { List: RuntimeListConstructor }).List;
}

function registerRuntimeLists(): void {
	const List = listConstructor();

	authorList = new List(authorKey, {
		map: { name: 'name' },
		schema: {
			collection: 'runtime_api_authors',
			versionKey: false,
		},
	});
	authorList.add({
		name: { required: true, type: String },
		state: { type: String },
	});
	authorList.register();

	postList = new List(postKey, {
		map: { name: 'title' },
		schema: {
			collection: 'runtime_api_posts',
			versionKey: false,
		},
	});
	postList.add({
		author: { type: KeystoneTypes.Relationship, ref: authorKey },
		score: { type: Number },
		state: { type: String },
		title: { required: true, type: String },
	});
	postList.register();
}

async function cleanupRuntimeCollections(): Promise<void> {
	if (postList) {
		await postList.model.deleteMany({}).exec();
	}
	if (authorList) {
		await authorList.model.deleteMany({}).exec();
	}
}

function unregisterRuntimeLists(): void {
	removeModel(postKey);
	removeModel(authorKey);
	authorList = null;
	postList = null;
}

function runtimeLists(): { author: RuntimeList; post: RuntimeList } {
	if (!authorList || !postList) {
		throw new Error('Runtime API lists were not registered');
	}
	return { author: authorList, post: postList };
}

function expectObjectId(value: unknown): void {
	expect(value).to.be.instanceOf(connectedMongoose.Types.ObjectId);
}

function numericResult(result: unknown, key: string): number {
	if (!result || typeof result !== 'object') {
		throw new Error('Expected a Mongoose write result object');
	}
	const value = (result as Record<string, unknown>)[key];
	if (typeof value !== 'number') {
		throw new Error('Expected numeric Mongoose write result "' + key + '"');
	}
	return value;
}

function querySession(query: unknown): unknown {
	const candidate = query as {
		getOptions?: () => Record<string, unknown>;
		options?: Record<string, unknown>;
	};
	return candidate.getOptions?.()['session'] ?? candidate.options?.['session'];
}

describe('List registered model runtime API', function () {
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

	it('supports Cloom-used CRUD helpers and query chaining on registered models', async function () {
		const { author, post } = runtimeLists();
		const createdAuthor = await author.model.create({
			name: 'Runtime API Author',
			state: 'active',
		});
		const insertedPosts = await post.model.insertMany([
			{
				author: createdAuthor._id,
				score: 2,
				state: 'draft',
				title: 'Runtime API low',
			},
			{
				author: createdAuthor._id,
				score: 9,
				state: 'draft',
				title: 'Runtime API high',
			},
		]);

		expect(insertedPosts).to.have.length(2);
		expectObjectId(insertedPosts[0]!._id);

		const generatedObjectId = new connectedMongoose.Types.ObjectId();
		expectObjectId(generatedObjectId);

		const leanRows = await post.model.find({ title: /^Runtime API/ })
			.sort('-score')
			.select('title score author')
			.lean()
			.exec();

		expect(leanRows.map((row) => row['title'])).to.deep.equal([
			'Runtime API high',
			'Runtime API low',
		]);
		expect(leanRows[0]).to.not.have.property('state');

		const foundOne = await post.model.findOne({ title: 'Runtime API high' }).exec();
		expect(foundOne?.get('score')).to.equal(9);

		const foundById = await post.model.findById(insertedPosts[0]!._id).exec();
		expect(foundById?.get('title')).to.equal('Runtime API low');

		const updatedOne = await post.model.findOneAndUpdate(
			{ title: 'Runtime API high' },
			{ $set: { state: 'published' } },
			{ new: true }
		).exec();
		expect(updatedOne?.get('state')).to.equal('published');

		const updateManyResult = await post.model.updateMany(
			{ state: 'draft' },
			{ $set: { state: 'reviewed' } }
		).exec();
		expect(numericResult(updateManyResult, 'modifiedCount')).to.equal(1);

		const bulkWriteResult = await post.model.bulkWrite([
			{
				updateOne: {
					filter: { title: 'Runtime API low' },
					update: { $set: { score: 5, state: 'published' } },
				},
			},
			{
				insertOne: {
					document: {
						author: createdAuthor._id,
						score: 7,
						state: 'published',
						title: 'Runtime API bulk',
					},
				},
			},
		]);
		expect(numericResult(bulkWriteResult, 'insertedCount')).to.equal(1);
		expect(numericResult(bulkWriteResult, 'modifiedCount')).to.equal(1);

		const deleteManyResult = await post.model.deleteMany({ title: 'Runtime API bulk' }).exec();
		expect(numericResult(deleteManyResult, 'deletedCount')).to.equal(1);
	});

	it('stores relationship values as ObjectIds and supports single-level populate', async function () {
		const { author, post } = runtimeLists();
		const createdAuthor = await author.model.create({
			name: 'Runtime API Populate Author',
			state: 'active',
		});
		const createdPost = await post.model.create({
			author: createdAuthor._id,
			score: 4,
			state: 'published',
			title: 'Runtime API populate',
		});

		const rawPost = await post.model.findById(createdPost._id).exec();
		expectObjectId(rawPost?.get('author'));

		const populatedPost = await post.model.findOne({ title: 'Runtime API populate' })
			.populate('author')
			.exec();
		const populatedAuthor = populatedPost?.get('author') as RuntimeDoc | undefined;

		expect(populatedAuthor?.get('name')).to.equal('Runtime API Populate Author');
	});

	it('supports Cloom-used aggregation with $match and $group', async function () {
		const { author, post } = runtimeLists();
		const createdAuthor = await author.model.create({
			name: 'Runtime API Aggregate Author',
			state: 'active',
		});
		await post.model.insertMany([
			{ author: createdAuthor._id, score: 3, state: 'published', title: 'Runtime API aggregate 1' },
			{ author: createdAuthor._id, score: 4, state: 'published', title: 'Runtime API aggregate 2' },
			{ author: createdAuthor._id, score: 11, state: 'draft', title: 'Runtime API aggregate draft' },
		]);

		const rows = await post.model.aggregate([
			{ $match: { state: 'published' } },
			{
				$group: {
					_id: '$state',
					count: { $sum: 1 },
					totalScore: { $sum: '$score' },
				},
			},
		]).exec();

		expect(rows).to.deep.equal([
			{
				_id: 'published',
				count: 2,
				totalScore: 7,
			},
		]);
	});

	it('exposes real connection and query session surfaces used by Cloom transaction probes', async function () {
		const { post } = runtimeLists();
		const db = connectedMongoose.connection.db;

		expect(typeof db.command).to.equal('function');
		const hello = await db.command({ hello: 1 });
		expect(hello).to.be.an('object');

		const session = await connectedMongoose.connection.startSession();
		try {
			expect((session as unknown as Record<string, unknown>)['withTransaction']).to.be.a('function');

			const findQuery = post.model.find({}).session(session);
			expect(querySession(findQuery)).to.equal(session);
			await findQuery.exec();

			const updateQuery = post.model.findOneAndUpdate(
				{ title: 'Runtime API session missing' },
				{ $set: { state: 'missing' } },
				{ new: true }
			).session(session);
			expect(querySession(updateQuery)).to.equal(session);

			const deleteQuery = post.model.deleteMany({ title: 'Runtime API session missing' }).session(session);
			expect(querySession(deleteQuery)).to.equal(session);
		} finally {
			await session.endSession();
		}
	});
});
