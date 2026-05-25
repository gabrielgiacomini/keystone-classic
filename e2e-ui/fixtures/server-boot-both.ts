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
	map(key: string, value: string): string;
	model: {
		new (doc: Record<string, unknown>): FixtureDocument;
		findOne(query: Record<string, unknown>): { exec(): Promise<FixtureDocument | null> };
	};
	register(): void;
	relationship(options: { ref: string; path: string; refPath: string; label?: string }): void;
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

	const Sponsor = createList('Sponsor', {
		searchFields: 'title',
	});
	Sponsor.add({
		title: { type: Types.Text, required: true, initial: true, index: true },
	});
	Sponsor.map('name', 'title');
	Sponsor.defaultColumns = 'title';
	Sponsor.register();

	const Post = createList('Post', {
		autokey: { path: 'slug', from: 'title', unique: true },
		perPage: 50,
		searchFields: 'title, slug',
	});
	Post.add({
		title: { type: String, required: true, initial: true, index: true },
		slugKey: { type: Types.Key, index: true },
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
		sponsor: { type: Types.Relationship, ref: 'Sponsor', createInline: true },
		content: { type: String },
		summary: { type: Types.Textarea },
		editorialMarkdown: { type: Types.Markdown, wysiwyg: false },
		articleHtml: { type: Types.Html, wysiwyg: true },
		codeSnippet: { type: Types.Code, language: 'javascript' },
		canonicalUrl: { type: Types.Url },
		accentColor: { type: Types.Color },
		budgetCost: { type: Types.Money },
		tags: { type: Types.TextArray },
		scoreHistory: { type: Types.NumberArray },
		blackoutDates: { type: Types.DateArray },
		coordinates: { type: Types.GeoPoint },
		venueAddress: { type: Types.Location, enableImprove: true },
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
		sortContext: 'User:sortableItems',
		searchFields: 'name',
	});
	SortableItem.add({
		name: { type: Types.Text, required: true, initial: true, index: true },
		owner: { type: Types.Relationship, ref: 'User', index: true },
	});
	SortableItem.defaultColumns = 'name';
	SortableItem.register();

	const CompactPost = createList('CompactPost', {
		label: 'Compact Posts',
		singular: 'Compact Post',
		plural: 'Compact Posts',
		perPage: 3,
		searchFields: 'title',
	});
	CompactPost.add({
		title: { type: Types.Text, required: true, initial: true, index: true },
	});
	CompactPost.defaultColumns = 'title';
	CompactPost.register();

	const Assignment = createList('Assignment', {
		searchFields: 'title',
	});
	Assignment.add({
		title: { type: Types.Text, required: true, initial: true, index: true },
		assignee: { type: Types.Relationship, ref: 'User', required: true, initial: true },
		reviewers: { type: Types.Relationship, ref: 'User', many: true, required: true, initial: true },
	});
	Assignment.defaultColumns = 'title, assignee, reviewers';
	Assignment.register();

	User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
	User.relationship({ ref: 'Post', path: 'editing', refPath: 'editors' });
	User.relationship({ ref: 'SortableItem', path: 'sortableItems', refPath: 'owner', label: 'Sortable Items' });
}

/**
 * Seed admin user and 5 Post items.
 */
async function seedData () {
	const User = keystone.list('User');
	const Post = keystone.list('Post');
	const SortableItem = keystone.list('SortableItem');
	const Assignment = keystone.list('Assignment');

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
			slugKey: `parity-post-key-${i}`,
			state: i % 2 === 0 ? 'published' : 'draft',
			category: i % 2 === 0 ? 'news' : 'guide',
			priority: (i % 3) + 1,
			author: admin._id,
			editors: [],
			content: `Parity post ${i}`,
			summary: `Parity summary ${i}\nSecond line ${i}`,
			editorialMarkdown: {
				md: `## Parity markdown ${i}\n\nSeeded **markdown** body ${i}.`,
			},
			articleHtml: `<h2>Parity HTML ${i}</h2><p>Seeded <strong>HTML</strong> body ${i}.</p>`,
			codeSnippet: `export const parityPost${i} = true;`,
			canonicalUrl: `https://example.com/parity-post-${i}`,
			accentColor: i % 2 === 0 ? '#2f80ed' : '#27ae60',
			budgetCost: i * 12.5,
			tags: ['parity', `post-${i}`],
			scoreHistory: [i, i + 0.5],
			blackoutDates: [
				new Date(Date.UTC(2026, 5, i)),
				new Date(Date.UTC(2026, 6, i)),
			],
			coordinates: [-73.9857 + i / 1000, 40.7484 + i / 1000],
			venueAddress: {
				number: `Suite ${i}`,
				name: `Parity Venue ${i}`,
				street1: `${100 + i} Example Street`,
				street2: `Level ${i}`,
				suburb: 'Springfield',
				state: 'IL',
				postcode: `6270${i % 10}`,
				country: 'USA',
				geo: [-75.1652 + i / 1000, 39.9526 + i / 1000],
			},
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
			owner: admin._id,
		});
		await item.save();
	}

	const assignment = new Assignment.model({
		title: 'Required Relationship Assignment',
		assignee: admin._id,
		reviewers: [admin._id],
	});
	await assignment.save();
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

keystone.set('nav', {
	Access: ['users'],
	Content: ['posts', 'compact-posts'],
	Operations: [
		'sortable-items',
		'assignments',
		{
			key: 'external-docs',
			label: 'External Docs',
			path: 'https://example.com/admin-docs',
		},
	],
});

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
