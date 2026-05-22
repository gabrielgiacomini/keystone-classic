/**
 * @file Database seeding helpers for the UI suite.
 *
 * The UI suite shares the seeded admin user from `server-boot.ts`, but
 * each spec wipes everything else (Posts + non-admin users) at
 * `beforeAll` time so order-of-execution can't leak state between specs.
 *
 * `resetDb` (re-exported from `e2e-api/fixtures/seedDb.ts`) drops the
 * `Post` collection and removes non-admin users. Most specs additionally
 * call `seedPostsAndEditors` to recreate the smoke-runbook fixture set
 * (25 posts + Alice + Bob).
 *
 * The seed values are deterministic and stable across runs — `publishedAt`
 * is calculated from `SEED_REFERENCE_DATE` rather than `Date.now()` so
 * date-formatted assertions don't break tomorrow.
 */

import mongoose from 'mongoose';
import { TEST_ADMIN_EMAIL } from './constants.js';

const MONGO_URI =
	process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-ui';

/**
 * Stable reference date for seeded `publishedAt` values. Picked
 * deliberately in the past so any "is this in the future" assertions
 * the admin might make stay stable forever. Update only if a spec
 * explicitly asserts on a different date.
 */
const SEED_REFERENCE_DATE = new Date('2026-05-01T12:00:00.000Z').getTime();

const STATES = ['draft', 'published', 'archived'] as const;
const TARGET_POST_COUNT = 25;

const EXTRA_USERS = [
	{ first: 'Alice', last: 'Editor', email: 'alice@example.com' },
	{ first: 'Bob', last: 'Editor', email: 'bob@example.com' },
];

// bcrypt hash of "password-123" — only used to satisfy required:true
// on the Password field; these accounts are never used to sign in.
const INERT_BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

function slugify (s: string): string {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

/**
 * Wipe the test DB and re-seed posts + non-admin editor users.
 *
 * Why both steps live in one helper: `clearNonAdminData` (from
 * `seedDb.ts`) drops the `Post` collection AND removes non-admin
 * users. Specs that exercise relationships (sections H, etc.) need
 * Alice and Bob back — they're not in `server-boot.ts`'s admin seed.
 * Returns the inserted ids so specs can reference them deterministically.
 * @returns Admin and editor Mongo ids plus ordered post ids from the fresh seed.
 */
export async function seedPostsAndEditors (): Promise<{
	adminId: string;
	aliceId: string;
	bobId: string;
	postIds: string[];
}> {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		const db = conn.db;
		if (!db) throw new Error('seedPostsAndEditors: no db connection');

		const usersCol = db.collection('User');
		const postsCol = db.collection('Post');

		// 1. Drop posts and non-admin users (idempotent).
		const existing = await db.listCollections().toArray();
		const names = new Set(existing.map((c) => c.name));
		if (names.has('Post')) await db.dropCollection('Post');
		await usersCol.deleteMany({ email: { $ne: TEST_ADMIN_EMAIL } });

		// 2. Resolve admin id (must exist — boot script seeded it).
		const admin = await usersCol.findOne({ email: TEST_ADMIN_EMAIL });
		if (!admin) {
			throw new Error(
				'seedPostsAndEditors: admin user missing — server-boot.ts not run?',
			);
		}

		// 3. Insert Alice and Bob.
		const editorIds: mongoose.mongo.ObjectId[] = [];
		for (const u of EXTRA_USERS) {
			const result = await usersCol.insertOne({
				name: { first: u.first, last: u.last },
				email: u.email,
				password: INERT_BCRYPT_HASH,
				isAdmin: false,
			});
			editorIds.push(result.insertedId);
		}

		// 4. Insert 25 posts with a deterministic editors distribution:
		//    every 5th post: no editors
		//    even-numbered:  both Alice and Bob
		//    odd-numbered:   Alice only
		// (mirrors `e2e-api/fixtures/seed-posts.ts`)
		const docs: Record<string, unknown>[] = [];
		for (let i = 1; i <= TARGET_POST_COUNT; i++) {
			const state = STATES[i % STATES.length];
			const title = `Smoke Test Post ${String(i).padStart(2, '0')} — ${state}`;
			let editors: mongoose.mongo.ObjectId[];
			if (i % 5 === 0) editors = [];
			else if (i % 2 === 0) editors = editorIds;
			else editors = [editorIds[0]!];
			docs.push({
				title,
				slug: slugify(title),
				state,
				category: i % 2 === 0 ? 'news' : 'guide',
				priority: (i % 3) + 1,
				author: admin._id,
				editors,
				content: `Auto-seeded post #${i} for admin smoke test. State=${state}.`,
				viewCount: i * 7,
				featured: i % 4 === 0,
				publishedAt:
					state === 'published'
						? new Date(SEED_REFERENCE_DATE - i * 86400000)
						: null,
				reviewedAt: new Date(SEED_REFERENCE_DATE - i * 3600000),
				createdAt: new Date(SEED_REFERENCE_DATE),
				updatedAt: new Date(SEED_REFERENCE_DATE),
			});
		}
		const inserted = await postsCol.insertMany(docs, { ordered: false });
		const postIds = Object.values(inserted.insertedIds).map((oid) =>
			oid.toString(),
		);

		return {
			adminId: admin._id.toString(),
			aliceId: editorIds[0]!.toString(),
			bobId: editorIds[1]!.toString(),
			postIds,
		};
	} finally {
		await conn.close();
	}
}

/**
 * Reset to a clean state with NO posts (sections A, D, G — flows that
 * either don't read seeded data or want full control over what's in the
 * DB). Still preserves the seeded admin.
 * @returns Resolves when posts and non-admin users are cleared.
 */
export async function resetWithoutPosts (): Promise<void> {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		const db = conn.db;
		if (!db) return;
		const existing = await db.listCollections().toArray();
		const names = new Set(existing.map((c) => c.name));
		if (names.has('Post')) await db.dropCollection('Post');
		await db.collection('User').deleteMany({ email: { $ne: TEST_ADMIN_EMAIL } });
	} finally {
		await conn.close();
	}
}

/**
 * Look up the seeded admin's _id. Used by specs that need to navigate
 * to /keystone/users/<admin-id>.
 * @returns The admin user's `_id` as a hex string.
 */
export async function getAdminId (): Promise<string> {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		const db = conn.db;
		if (!db) throw new Error('getAdminId: no db connection');
		const admin = await db
			.collection('User')
			.findOne({ email: TEST_ADMIN_EMAIL });
		if (!admin) throw new Error('getAdminId: admin not found');
		return admin._id.toString();
	} finally {
		await conn.close();
	}
}

/**
 * Open a short-lived mongoose connection and run `fn` against it.
 * Keeps spec code free of `createConnection`/`close` boilerplate.
 * @param fn - Async callback receiving the default mongoose DB handle.
 * @returns The value resolved by `fn`.
 */
export async function withMongo<T> (
	fn: (db: mongoose.mongo.Db) => Promise<T>,
): Promise<T> {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		if (!conn.db) throw new Error('withMongo: no db connection');
		return await fn(conn.db);
	} finally {
		await conn.close();
	}
}
