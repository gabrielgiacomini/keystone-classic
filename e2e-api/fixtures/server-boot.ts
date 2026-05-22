/**
 * @file Standalone Keystone test server for the API-only Playwright suite.
 *
 * Boots a minimal Keystone app with two Lists (User, Post), seeds a
 * deterministic admin user, and listens on the port configured by the
 * `PORT` env var (default 3005). Designed to be invoked by Playwright's
 * `webServer.command` config.
 *
 * Required env:
 *   - MONGO_URI   (default: mongodb://localhost:27017/keystone-e2e-api)
 *   - PORT        (default: 3005)
 *   - DISABLE_CSRF=true is set by the npm script and consumed by
 *     lib/security/csrf.mjs so the API-only suite can POST without
 *     bootstrapping a browser session.
 *
 * The server intentionally drops the database on boot. Each spec file
 * additionally re-seeds via the `seedDb` fixture before its tests run.
 */

import keystone from 'keystone';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-api';
const PORT = process.env.PORT ?? '3005';

type FixtureDocument = {
	_id?: unknown;
	save(): Promise<void>;
};

type FixtureList = {
	add(fields: Record<string, unknown>): void;
	defaultColumns: string;
	model: {
		new (doc: Record<string, unknown>): FixtureDocument;
		findOne(query: Record<string, unknown>): { exec(): Promise<FixtureDocument | null> };
	};
	register(): void;
	relationship(options: { ref: string; path: string; refPath: string }): void;
	schema: {
		virtual(name: string): { get(getter: (this: { isAdmin?: boolean }) => unknown): void };
	};
};

function createList(key: string, options: Record<string, unknown> = {}): FixtureList {
	return new keystone.List(key, options) as unknown as FixtureList;
}

/** Seeded admin credentials. Spec fixtures import these constants. */
export const TEST_ADMIN_EMAIL = 'admin@example.com';
// Test fixture credential — never used outside the e2e-api harness.
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const TEST_ADMIN_PASSWORD = 'admin-password-123';

/**
 * Drop the test database before models register, using a throwaway
 * connection that we close immediately. Keeps Keystone's own connection
 * lifecycle uncomplicated.
 */
async function dropDatabase () {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		if (conn.db) await conn.db.dropDatabase();
	} finally {
		await conn.close();
	}
}

/**
 * Register the User and Post Lists used by the spec suite. Kept
 * intentionally tiny — the suite covers the API contract, not the
 * full field-type matrix.
 */
function defineLists () {
	const Types = keystone.Field.Types;

	const User = createList('User');
	User.add({
		name: { type: Types.Name, required: true, index: true },
		email: { type: Types.Email, initial: true, required: true, index: true },
		password: { type: Types.Password, initial: true, required: true },
		isAdmin: { type: Types.Boolean, default: false },
	});
	User.schema.virtual('canAccessKeystone').get(function () {
		return this.isAdmin;
	});
	User.defaultColumns = 'name, email, isAdmin';
	User.register();

	// Post list — exercises the five field types called out in roadmap
	// step 38a (text, number, boolean, date, relationship), plus Select
	// for state-machine-style filter testing.
	const Post = createList('Post', {
		autokey: { path: 'slug', from: 'title', unique: true },
		// Post has no Name field, so the default `searchFields: '__name__'`
		// resolves to nothing and `?search=` becomes a no-op (or worse, a
		// regex against `null`). Search by title + slug instead.
		searchFields: 'title, slug',
	});
	Post.add({
		title: { type: String, required: true, initial: true, index: true },
		state: {
			type: Types.Select,
			options: 'draft, published, archived',
			default: 'draft',
			index: true,
		},
		author: { type: Types.Relationship, ref: 'User', index: true },
		editors: { type: Types.Relationship, ref: 'User', many: true },
		content: { type: String },
		viewCount: { type: Types.Number, default: 0 },
		featured: { type: Types.Boolean, default: false },
		publishedAt: { type: Types.Date },
	});
	Post.defaultColumns = 'title, state, author, publishedAt';
	Post.register();

	User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
	User.relationship({ ref: 'Post', path: 'editing', refPath: 'editors' });
}

/**
 * Idempotent admin seed. Re-running the boot script (or hitting the
 * Playwright `reuseExistingServer` path) won't error out.
 */
async function seedAdmin () {
	const User = keystone.list('User');
	const existing = await User.model.findOne({ email: TEST_ADMIN_EMAIL }).exec();
	if (existing) return;
	const admin = new User.model({
		name: { first: 'Test', last: 'Admin' },
		email: TEST_ADMIN_EMAIL,
		password: TEST_ADMIN_PASSWORD,
		isAdmin: true,
	});
	await admin.save();
}

await dropDatabase();

keystone.init({
	'name': 'keystone-e2e-api',
	'brand': 'keystone-e2e-api',
	'host': '127.0.0.1',
	'port': PORT,
	'mongo': MONGO_URI,
	'auto update': false,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'keystone-e2e-api-secret',
	'admin legacy path': 'keystone',
	'admin api path': 'keystone-api',
	'headless': false,
	'logger': false,
});

defineLists();

await new Promise<void>((resolve, reject) => {
	keystone.start({
		onStart: () => resolve(),
		onHttpServerCreated: () => {
			const server = keystone.httpServer;
			if (server) server.on('error', reject);
		},
	});
});

await seedAdmin();

// Hand control back to Playwright. The process stays alive on its open
// HTTP server + Mongo connection until Playwright's webServer manager
// SIGTERMs it after the spec run.
console.log(`[e2e-api] Keystone listening on http://127.0.0.1:${PORT}/keystone`);
console.log(`[e2e-api] Admin API mounted at http://127.0.0.1:${PORT}/keystone-api`);
