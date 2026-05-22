/**
 * Database seed helpers for spec files.
 *
 * The shared test server runs as a separate process; we can't import
 * its in-memory `keystone` instance directly. Instead, we open a thin
 * mongoose connection from inside the test runner, clear the
 * non-User collections (Posts, etc), and reset all non-admin users.
 *
 * The seeded admin remains across resets so that `signedInRequest`
 * fixtures keep working — re-seeding the admin via the API would be
 * blocked by `keystoneAuth` (chicken-and-egg).
 *
 * Each spec file should call `resetDb` in `test.beforeAll` (or
 * `beforeEach` if its tests mutate state in interfering ways).
 */

import type { APIRequestContext } from '@playwright/test';
import mongoose from 'mongoose';
import { TEST_ADMIN_EMAIL } from './server.js';

const MONGO_URI =
	process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-api';

/**
 * Non-user collections to wipe between specs.
 *
 * Mongoose's default `pluralize` is *not* applied to collection names by
 * Keystone — `keystone.List('Post')` registers a `Post` mongoose model,
 * which, with the project's `mongoose.pluralize(null)` setup, persists to
 * a collection literally named `Post`. Mirror that here so the right
 * collection actually gets dropped between specs.
 */
const OWNED_COLLECTIONS = ['Post'];

/** Name of the user collection seeded at server-boot time. */
const USER_COLLECTION = 'User';

/**
 * Drop the non-user test collections and remove any non-admin users
 * via a throwaway mongoose connection.
 *
 * Dropping collections rather than the whole database keeps any indexes
 * Keystone created at boot intact (Mongoose lazily rebuilds them after
 * a `dropDatabase`, which produces a startup race).
 */
async function clearNonAdminData (): Promise<void> {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		const db = conn.db;
		if (!db) return;
		const existing = await db.listCollections().toArray();
		const names = new Set(existing.map((c) => c.name));
		for (const target of OWNED_COLLECTIONS) {
			if (names.has(target)) {
				await db.dropCollection(target);
			}
		}
		if (names.has(USER_COLLECTION)) {
			await db.collection(USER_COLLECTION).deleteMany({ email: { $ne: TEST_ADMIN_EMAIL } });
		}
	} finally {
		await conn.close();
	}
}

/**
 * Drop the test collections (preserving the seeded admin user).
 *
 * Spec files should call this from a `test.beforeAll` hook. The
 * `request` argument is unused but kept in the signature for future
 * extension (e.g. seeding additional fixtures via the API).
 * @param _request Playwright request fixture (currently unused).
 */
export async function resetDb (_request: APIRequestContext): Promise<void> {
	await clearNonAdminData();
}
