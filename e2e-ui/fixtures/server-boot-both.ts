/**
 * @file Standalone Keystone test server for the UI parity Playwright suite (P4-30).
 *
 * Boots Keystone with `admin ui: 'both'` so both the admin legacy
 * (at /keystone) and the admin next (at /keystone-next) are
 * served simultaneously. Seeds a deterministic admin user plus 5 Post
 * items used by the parity specs.
 *
 * Required env:
 *   - MONGO_URI   (default: mongodb://localhost:27017/keystone-e2e-ui)
 *   - PORT        (default: 3008)
 *   - NODE_ENV=test
 *
 * CSRF stays ENABLED — the UI parity suite exercises the real CSRF path.
 */

import keystone from 'keystone';
import mongoose from 'mongoose';

const MONGO_URI =
	process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-ui';
const PORT = process.env.PORT ?? '3008';

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

/** Seeded admin credentials used across all parity specs. */
export const TEST_ADMIN_EMAIL = 'admin@example.com';
// Test fixture credential — never used outside the e2e-ui parity harness.
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const TEST_ADMIN_PASSWORD = 'admin-password-123';

/** Total number of Post items seeded by this boot script. */
export const SEED_POST_COUNT = 5;

/**
 * Drop the test database before models register.
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
 * Register the User and Post lists.
 */
function defineLists () {
	const Types = keystone.Field.Types;

	const User = createList('User');
	User.add({
		name: { type: Types.Name, required: true, index: true },
		email: {
			type: Types.Email,
			initial: true,
			required: true,
			index: true,
		},
		password: { type: Types.Password, initial: true, required: true },
		isAdmin: { type: Types.Boolean, default: false },
	});
	User.schema.virtual('canAccessKeystone').get(function () {
		return this.isAdmin;
	});
	User.defaultColumns = 'name, email, isAdmin';
	User.register();

	const Post = createList('Post', {
		autokey: { path: 'slug', from: 'title', unique: true },
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
		category: {
			type: Types.Select,
			options: 'news, guide',
			emptyOption: true,
		},
		priority: {
			type: Types.Select,
			numeric: true,
			options: [
				{ value: 1, label: 'Low' },
				{ value: 2, label: 'Medium' },
				{ value: 3, label: 'High' },
			],
			default: 1,
		},
		author: { type: Types.Relationship, ref: 'User', index: true },
		editors: { type: Types.Relationship, ref: 'User', many: true },
		content: { type: String },
		viewCount: { type: Types.Number, default: 0 },
		featured: { type: Types.Boolean, default: false },
		publishedAt: { type: Types.Date },
		reviewedAt: { type: Types.Datetime },
	});
	Post.defaultColumns = 'title, state, author, publishedAt';
	Post.register();

	const SortableItem = createList('SortableItem', {
		label: 'Sortable Items',
		singular: 'Sortable Item',
		plural: 'Sortable Items',
		sortable: true,
		searchFields: 'name',
	});
	SortableItem.add({
		name: { type: Types.Text, required: true, initial: true, index: true },
	});
	SortableItem.defaultColumns = 'name';
	SortableItem.register();

	User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
	User.relationship({ ref: 'Post', path: 'editing', refPath: 'editors' });
}

/**
 * Seed admin user and 5 Post items.
 */
async function seedData () {
	const User = keystone.list('User');
	const Post = keystone.list('Post');
	const SortableItem = keystone.list('SortableItem');

	// Admin user (idempotent).
	let admin = await User.model.findOne({ email: TEST_ADMIN_EMAIL }).exec();
	if (!admin) {
		admin = new User.model({
			name: { first: 'Test', last: 'Admin' },
			email: TEST_ADMIN_EMAIL,
			password: TEST_ADMIN_PASSWORD,
			isAdmin: true,
		});
		await admin.save();
	}

	// 5 Post items.
	for (let i = 1; i <= SEED_POST_COUNT; i++) {
		const post = new Post.model({
			title: `Parity Post ${String(i).padStart(2, '0')}`,
			state: i % 2 === 0 ? 'published' : 'draft',
			category: i % 2 === 0 ? 'news' : 'guide',
			priority: (i % 3) + 1,
			author: admin._id,
			editors: [],
			content: `Parity post ${i}`,
			viewCount: i,
			featured: i % 2 === 0,
			publishedAt: i % 2 === 0 ? new Date(Date.UTC(2026, 4, i)) : null,
			reviewedAt: new Date(Date.UTC(2026, 4, i, 15, 30, 0)),
		});
		await post.save();
	}

	for (let i = 1; i <= 5; i++) {
		const item = new SortableItem.model({
			name: `Sortable Item ${String(i).padStart(2, '0')}`,
		});
		await item.save();
	}
}

await dropDatabase();

keystone.init({
	'name': 'keystone-e2e-ui',
	'brand': 'keystone-e2e-ui',
	'host': '127.0.0.1',
	'port': PORT,
	'mongo': MONGO_URI,
	'auto update': false,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'keystone-e2e-ui-parity-secret',
	'admin legacy path': 'keystone',
	'admin next path': 'keystone-next',
	'admin api path': 'keystone-api',
	'admin legacy api alias': false,
	'admin ui': 'both',
	'headless': false,
	'logger': false,
	// The parity suite signs in many isolated browser contexts; keep the
	// middleware enabled while avoiding false positives during repeat runs.
	'signin rate limit': { max: 1000 },
});

defineLists();

await new Promise((resolve, reject) => {
	keystone.start({
		onStart: () => resolve(undefined),
		onHttpServerCreated: () => {
			const server = keystone.httpServer;
			if (server) server.on('error', reject);
		},
	});
});

await seedData();

console.log(
	`[e2e-ui-parity] Keystone listening on http://127.0.0.1:${PORT}/keystone`,
);
console.log(
	`[e2e-ui-parity] admin next mounted at http://127.0.0.1:${PORT}/keystone-next`,
);
console.log(
	`[e2e-ui-parity] admin API mounted at http://127.0.0.1:${PORT}/keystone-api`,
);
