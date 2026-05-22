/**
 * @file Seed helpers for heavy-list parity specs.
 *
 * Looks up the seeded HeavyUser, HeavyThread, and EarlyApp ObjectIds from
 * the MongoDB database so specs can navigate directly to item detail pages.
 *
 * The actual data is seeded by `server-boot.ts` at startup, so these
 * helpers are read-only lookups.
 */

import mongoose from 'mongoose';

const MONGO_URI =
	process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-ui-heavy';

/**
 * Open a short-lived mongoose connection and run `fn` against the DB.
 */
async function withMongo<T>(fn: (db: mongoose.mongo.Db) => Promise<T>): Promise<T> {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		if (!conn.db) throw new Error('withMongo: no db connection');
		return await fn(conn.db);
	} finally {
		await conn.close();
	}
}

export interface HeavyIds {
	heavyUserId: string;
	heavyThreadId: string;
	earlyAppId: string;
}

/**
 * Look up the seeded document ObjectIds from the DB.
 * Returns all three ids needed by the heavy-list specs.
 */
export async function getHeavyIds(): Promise<HeavyIds> {
	return withMongo(async (db) => {
		const user = await db.collection('HeavyUser').findOne({});
		const thread = await db.collection('HeavyThread').findOne({});
		const app = await db.collection('EarlyApp').findOne({});

		if (!user) throw new Error('getHeavyIds: no HeavyUser found — was the server seeded?');
		if (!thread) throw new Error('getHeavyIds: no HeavyThread found');
		if (!app) throw new Error('getHeavyIds: no EarlyApp found');

		return {
			heavyUserId: user._id.toString(),
			heavyThreadId: thread._id.toString(),
			earlyAppId: app._id.toString(),
		};
	});
}
