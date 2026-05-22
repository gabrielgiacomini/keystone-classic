import { expect } from 'chai';
import keystone from 'keystone';
import mongoose from 'mongoose';

import getMongooseConnection from '../helpers/getMongooseConnection.mts';
import removeModel from '../helpers/removeModel.mts';

const accountKey = 'TransactionRuntimeAccount';
const auditKey = 'TransactionRuntimeAudit';
let connectedMongoose: typeof mongoose;
let accountList: RuntimeList | null = null;
let auditList: RuntimeList | null = null;

type RuntimeSession = Awaited<ReturnType<typeof mongoose.connection.startSession>>;

interface RuntimeDoc extends Record<string, unknown> {
	_id: unknown;
	get(path: string): unknown;
	save(): Promise<RuntimeDoc>;
}

interface RuntimeQuery<T> {
	exec(): Promise<T>;
	getOptions?(): Record<string, unknown>;
	options?: Record<string, unknown>;
	session(session: RuntimeSession): RuntimeQuery<T>;
}

interface RuntimeModel {
	new(data?: Record<string, unknown>): RuntimeDoc;
	create(data: Record<string, unknown>): Promise<RuntimeDoc>;
	deleteMany(query: Record<string, unknown>, options?: Record<string, unknown>): RuntimeQuery<unknown>;
	find(query?: Record<string, unknown>, projection?: unknown, options?: Record<string, unknown>): RuntimeQuery<RuntimeDoc[]>;
	findOne(query: Record<string, unknown>, projection?: unknown, options?: Record<string, unknown>): RuntimeQuery<RuntimeDoc | null>;
	findOneAndUpdate(
		query: Record<string, unknown>,
		update: Record<string, unknown>,
		options?: Record<string, unknown>
	): RuntimeQuery<RuntimeDoc | null>;
	insertMany(items: Array<Record<string, unknown>>, options?: Record<string, unknown>): Promise<RuntimeDoc[]>;
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

	accountList = new List(accountKey, {
		map: { name: 'name' },
		schema: {
			collection: 'transaction_runtime_accounts',
			versionKey: false,
		},
	});
	accountList.add({
		balance: { type: Number },
		name: { required: true, type: String },
		state: { type: String },
	});
	accountList.register();

	auditList = new List(auditKey, {
		map: { name: 'action' },
		schema: {
			collection: 'transaction_runtime_audits',
			versionKey: false,
		},
	});
	auditList.add({
		accountId: { type: String },
		action: { required: true, type: String },
	});
	auditList.register();
}

async function cleanupRuntimeCollections(): Promise<void> {
	if (auditList) {
		await auditList.model.deleteMany({}).exec();
	}
	if (accountList) {
		await accountList.model.deleteMany({}).exec();
	}
}

function unregisterRuntimeLists(): void {
	removeModel(auditKey);
	removeModel(accountKey);
	auditList = null;
	accountList = null;
}

function runtimeLists(): { account: RuntimeList; audit: RuntimeList } {
	if (!accountList || !auditList) {
		throw new Error('Transaction runtime lists were not registered');
	}
	return { account: accountList, audit: auditList };
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

async function expectTransactionAbort(operation: () => Promise<void>): Promise<void> {
	let aborted = false;
	try {
		await operation();
	} catch (error) {
		aborted = true;
		expect(error).to.be.instanceOf(Error);
		expect((error as Error).message).to.equal('abort Cloom transaction smoke');
	}
	expect(aborted).to.equal(true);
}

describe('Mongoose transaction runtime smoke', function () {
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

	it('executes and rolls back Cloom-used session-threaded model writes', async function () {
		const { account, audit } = runtimeLists();
		const db = connectedMongoose.connection.db;
		const hello = await db.command({ hello: 1 });

		expect(hello).to.include({ isWritablePrimary: true, setName: 'rs0' });

		await account.model.create({
			balance: 10,
			name: 'outside transaction',
			state: 'open',
		});

		const commitSession = await connectedMongoose.connection.startSession();
		try {
			await commitSession.withTransaction(async function () {
				const inserted = await account.model.insertMany([
					{ balance: 5, name: 'committed transaction', state: 'new' },
					{ balance: 0, name: 'obsolete transaction row', state: 'obsolete' },
				], { session: commitSession });
				expect(inserted).to.have.length(2);

				const updated = await account.model.findOneAndUpdate(
					{ name: 'committed transaction' },
					{ $set: { balance: 15, state: 'committed' } },
					{ new: true, session: commitSession }
				).exec();
				expect(updated?.get('balance')).to.equal(15);

				const findQuery = account.model.find({ state: 'committed' }, undefined, { session: commitSession });
				expect(querySession(findQuery)).to.equal(commitSession);
				const committedRows = await findQuery.exec();
				expect(committedRows.map((row) => row.get('name'))).to.deep.equal(['committed transaction']);

				const chainedFind = account.model.find({ name: 'committed transaction' }).session(commitSession);
				expect(querySession(chainedFind)).to.equal(commitSession);
				expect(await chainedFind.exec()).to.have.length(1);

				await audit.model.insertMany([
					{ accountId: String(updated?._id), action: 'commit transaction' },
				], { session: commitSession });

				const deleted = await account.model.deleteMany({ state: 'obsolete' }, { session: commitSession }).exec();
				expect(numericResult(deleted, 'deletedCount')).to.equal(1);
			});
		} finally {
			await commitSession.endSession();
		}

		const committedAccount = await account.model.findOne({ name: 'committed transaction' }).exec();
		expect(committedAccount?.get('state')).to.equal('committed');
		expect(await account.model.findOne({ name: 'obsolete transaction row' }).exec()).to.equal(null);
		expect(await audit.model.findOne({ action: 'commit transaction' }).exec()).to.not.equal(null);

		const rollbackSession = await connectedMongoose.connection.startSession();
		try {
			await expectTransactionAbort(async function () {
				await rollbackSession.withTransaction(async function () {
					await account.model.insertMany([
						{ balance: 1, name: 'rolled back transaction', state: 'temporary' },
					], { session: rollbackSession });

					await account.model.findOneAndUpdate(
						{ name: 'committed transaction' },
						{ $set: { state: 'rolled-back' } },
						{ new: true, session: rollbackSession }
					).exec();

					await account.model.deleteMany({ name: 'outside transaction' }, { session: rollbackSession }).exec();

					throw new Error('abort Cloom transaction smoke');
				});
			});
		} finally {
			await rollbackSession.endSession();
		}

		expect(await account.model.findOne({ name: 'rolled back transaction' }).exec()).to.equal(null);
		expect((await account.model.findOne({ name: 'committed transaction' }).exec())?.get('state')).to.equal('committed');
		expect(await account.model.findOne({ name: 'outside transaction' }).exec()).to.not.equal(null);
	});
});
