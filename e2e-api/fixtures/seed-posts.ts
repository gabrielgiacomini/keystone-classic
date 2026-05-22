/**
 * @file Idempotent Post seeder for the legacy-admin smoke test runbook.
 *
 * Inserts ~25 Post documents with varied state, viewCount, featured,
 * publishedAt, and a populated editors array so the admin legacy list
 * view has something to filter, sort, paginate, and so the relationship
 * pickers (author = many:false, editors = many:true) have multiple
 * users to choose from. Also inserts two extra non-admin users (Alice
 * and Bob) so the relationship pickers can be exercised end-to-end.
 *
 * Skips post-insert if Post collection already has >= 20 docs.
 * Skips user-insert if the named user already exists.
 *
 * Usage:
 *   npx jiti e2e-api/fixtures/seed-posts.ts
 *
 * Env:
 *   MONGO_URI (default mongodb://localhost:27017/keystone-e2e-api)
 *
 * Notes:
 *   - The admin legacy server (server-boot.ts) drops the DB on every
 *     boot, so this seeder runs AFTER the server is up.
 *   - We use the raw mongoose driver (not the Keystone List API) so the
 *     seeder can run as a separate process. Field names mirror the
 *     server-boot Post schema exactly: title, slug, state, author,
 *     editors, content, viewCount, featured, publishedAt.
 */

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-api';
const TARGET_COUNT = 25;

const STATES = ['draft', 'published', 'archived'];

function slugify (s: string): string {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const EXTRA_USERS = [
	{ first: 'Alice', last: 'Editor', email: 'alice@example.com' },
	{ first: 'Bob', last: 'Editor', email: 'bob@example.com' },
];

const conn = await mongoose.createConnection(MONGO_URI).asPromise();
try {
	// Keystone uses the List name as the collection name (PascalCase).
	const usersCol = conn.db.collection('User');
	const postsCol = conn.db.collection('Post');

	const admin = await usersCol.findOne({ email: 'admin@example.com' });
	if (!admin) {
		console.error('[seed-posts] admin user not found — boot the server first');
		process.exit(1);
	}

	// Idempotently insert the two extra editor users.
	const editorIds: unknown[] = [];
	for (const u of EXTRA_USERS) {
		let user = await usersCol.findOne({ email: u.email });
		if (!user) {
			const result = await usersCol.insertOne({
				name: { first: u.first, last: u.last },
				email: u.email,
				// bcrypt hash of "password-123" — only used to satisfy required:true,
				// these accounts are never used to sign in.
				// eslint-disable-next-line sonarjs/no-hardcoded-passwords -- bcrypt digest, not plaintext
				password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
				isAdmin: false,
			});
			user = { _id: result.insertedId };
			console.log(`[seed-posts] inserted user ${u.email}`);
		}
		editorIds.push(user._id);
	}

	const existing = await postsCol.countDocuments({});
	if (existing >= 20) {
		console.log(`[seed-posts] skipping post insert — posts already has ${existing} docs (>=20)`);
	} else {
		const now = Date.now();
		const docs = [];
		for (let i = 1; i <= TARGET_COUNT; i++) {
			const state = STATES[i % STATES.length];
			const title = `Smoke Test Post ${String(i).padStart(2, '0')} — ${state}`;
			// Even-numbered posts get both editors, odd-numbered get only Alice,
			// every 5th gets none — gives the many:true picker a varied dataset.
			let editors: unknown[];
			if (i % 5 === 0) editors = [];
			else if (i % 2 === 0) editors = editorIds;
			else editors = [editorIds[0]];
			docs.push({
				title,
				slug: slugify(title),
				state,
				author: admin._id,
				editors,
				content: `Auto-seeded post #${i} for admin smoke test. State=${state}.`,
				viewCount: i * 7,
				featured: i % 4 === 0,
				publishedAt: state === 'published' ? new Date(now - i * 86400000) : null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		const result = await postsCol.insertMany(docs, { ordered: false });
		console.log(`[seed-posts] inserted ${result.insertedCount} posts (target=${TARGET_COUNT})`);
	}
} finally {
	await conn.close();
}
