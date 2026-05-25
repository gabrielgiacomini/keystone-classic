/**
 * Parity spec: List view (P4-30).
 *
 * Verifies that both adminLegacy (/keystone) and adminNext (/keystone-next) list views:
 *   - Show the same number of rows for the seeded Post list
 *   - Return the same row count when searching for an existing title
 *   - Sort by 'title' column and produce the same first-row value
 */

import { test, expect } from '../../fixtures/parity.js';
import { resetWithoutPosts, seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';
import { Types } from 'mongoose';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';
const USER_LIST_KEY = 'User';
const USER_LIST_PATH = 'users';
const PAGE_SIZE = 50;
const COMPACT_LIST_KEY = 'CompactPost';
const COMPACT_LIST_PATH = 'compact-posts';
const COMPACT_PAGE_SIZE = 3;

function formatDateInputValue(value: unknown): string {
	return value instanceof Date ? value.toISOString().slice(0, 10) : '';
}

function distanceKm(a: [number, number], b: [number, number]): number {
	const toRad = (degrees: number) => degrees * Math.PI / 180;
	const [lon1, lat1] = a;
	const [lon2, lat2] = b;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const rLat1 = toRad(lat1);
	const rLat2 = toRad(lat2);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;
	return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

test.beforeEach(async () => {
	await seedPostsAndEditors();
});

async function seedAdditionalPosts(count: number): Promise<void> {
	await withMongo(async (db) => {
		const admin = await db.collection('User').findOne({ isAdmin: true });
		expect(admin, 'admin user should exist before pagination seed').toBeTruthy();
		const now = new Date('2026-05-24T12:00:00.000Z');
		const docs = Array.from({ length: count }, (_, index) => {
			const n = index + 1;
			const title = `Pagination Test Post ${String(n).padStart(2, '0')}`;
			return {
				title,
				slug: `pagination-test-post-${String(n).padStart(2, '0')}`,
				state: n % 2 === 0 ? 'published' : 'draft',
				category: n % 2 === 0 ? 'news' : 'guide',
				priority: (n % 3) + 1,
				author: admin!._id,
				editors: [],
				content: `Pagination parity post ${n}`,
				viewCount: 1000 + n,
				featured: false,
				publishedAt: null,
				reviewedAt: now,
				createdAt: now,
				updatedAt: now,
			};
		});
		await db.collection('Post').insertMany(docs, { ordered: false });
	});
}

async function seedCompactPosts(count: number): Promise<void> {
	await withMongo(async (db) => {
		const existing = await db.listCollections({ name: 'CompactPost' }).toArray();
		if (existing.length > 0) await db.dropCollection('CompactPost');
		const now = new Date('2026-05-24T12:00:00.000Z');
		const docs = Array.from({ length: count }, (_, index) => ({
			title: `Compact Test Post ${String(index + 1).padStart(2, '0')}`,
			createdAt: now,
			updatedAt: now,
		}));
		await db.collection('CompactPost').insertMany(docs, { ordered: false });
	});
}

async function seedPasswordlessUser(): Promise<void> {
	await withMongo(async (db) => {
		await db.collection('User').insertOne({
			name: { first: 'No', last: 'Password' },
			email: 'nopassword@example.com',
			isAdmin: false,
			createdAt: new Date('2026-05-24T12:00:00.000Z'),
			updatedAt: new Date('2026-05-24T12:00:00.000Z'),
		});
	});
}

test.describe('Parity: List view', () => {
	test('invalid list routes show a not-found message without rendering a table', async ({
		adminLegacy,
		adminNext,
	}) => {
		const invalidList = 'definitely-not-a-list';
		let adminNextInvalidApiRequests = 0;
		adminNext.page.on('request', (request) => {
			if (request.url().includes(`/keystone-api/${invalidList}`)) {
				adminNextInvalidApiRequests += 1;
			}
		});

		await adminLegacy.page.goto(`/keystone/${invalidList}`);
		await expect(adminLegacy.page.getByText('List not found!')).toBeVisible();
		await expect(adminLegacy.page.locator('[data-list-table]')).toHaveCount(0);

		await adminNext.page.goto(`/keystone-next/${invalidList}`);
		await expect(adminNext.page.getByText('List not found!')).toBeVisible();
		await expect(adminNext.page.locator('[data-list-table]')).toHaveCount(0);
		expect(adminNextInvalidApiRequests).toBe(0);
	});

	test('invalid list item routes show the same not-found fallback', async ({
		adminLegacy,
		adminNext,
	}) => {
		const invalidList = 'definitely-not-a-list';
		const itemId = '507f1f77bcf86cd799439011';
		let adminNextInvalidApiRequests = 0;
		adminNext.page.on('request', (request) => {
			if (request.url().includes(`/keystone-api/${invalidList}`)) {
				adminNextInvalidApiRequests += 1;
			}
		});

		await adminLegacy.page.goto(`/keystone/${invalidList}/${itemId}`);
		await expect(adminLegacy.page.getByText('List not found!')).toBeVisible();
		await expect(adminLegacy.page.locator('[data-screen-id="item"]')).toHaveCount(0);

		await adminNext.page.goto(`/keystone-next/${invalidList}/${itemId}`);
		await expect(adminNext.page.getByText('List not found!')).toBeVisible();
		await expect(adminNext.page.locator('[data-item-form]')).toHaveCount(0);
		expect(adminNextInvalidApiRequests).toBe(0);
	});

	test('both UIs show the same row count for the seeded Post list', async ({
		adminLegacy,
		adminNext,
	}) => {
		const mongoCount = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		await adminLegacy.gotoList(LIST_PATH);
		const adminLegacyCount = await adminLegacy.getRowCount();

		await adminNext.gotoList(LIST_KEY);
		const adminNextCount = await adminNext.getRowCount();

		// Both must show the same number of rows (first page).
		// Row counts may be capped at page size; just verify they match each other.
		expect(adminLegacyCount).toBe(adminNextCount);

		// Sanity-check: both match mongo (if <= page size).
		if (mongoCount <= 50) {
			expect(adminLegacyCount).toBe(mongoCount);
		}
	});

	test('search for existing title returns same count in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		// "Smoke Test Post 01" is a stable title seeded by seedPostsAndEditors.
		const SEARCH_TERM = 'Smoke Test Post 01';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.search(SEARCH_TERM);
		const adminLegacyCount = await adminLegacy.getRowCount();

		await adminNext.gotoList(LIST_KEY);
		await adminNext.search(SEARCH_TERM);
		const adminNextCount = await adminNext.getRowCount();

		// Both should return the same number of matches.
		expect(adminLegacyCount).toBe(adminNextCount);
		// The search term is specific enough that we expect exactly 1 result.
		expect(adminLegacyCount).toBe(1);
	});

	test('typing a search waits for the debounce window before loading results in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const searchTerm = 'Smoke Test Post 01';

		await adminLegacy.gotoList(LIST_PATH);
		let legacySearchRequests = 0;
		adminLegacy.page.on('request', (request) => {
			const url = new URL(request.url());
			if (
				request.method() === 'GET' &&
				url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
				url.searchParams.get('search') === searchTerm
			) {
				legacySearchRequests += 1;
			}
		});
		const legacySearchResponse = adminLegacy.page.waitForResponse((response) => {
			const url = new URL(response.url());
			return response.request().method() === 'GET' &&
				url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
				url.searchParams.get('search') === searchTerm;
		});
		await adminLegacy.page.locator('[data-search-input-field]').fill(searchTerm);
		await adminLegacy.page.waitForTimeout(350);
		expect(legacySearchRequests).toBe(0);
		await legacySearchResponse;
		expect(legacySearchRequests).toBe(1);
		expect(await adminLegacy.getRowCount()).toBe(1);

		await adminNext.gotoList(LIST_KEY);
		let adminNextSearchRequests = 0;
		adminNext.page.on('request', (request) => {
			const url = new URL(request.url());
			if (
				request.method() === 'GET' &&
				url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
				url.searchParams.get('search') === searchTerm
			) {
				adminNextSearchRequests += 1;
			}
		});
		const adminNextSearchResponse = adminNext.page.waitForResponse((response) => {
			const url = new URL(response.url());
			return response.request().method() === 'GET' &&
				url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
				url.searchParams.get('search') === searchTerm;
		});
		await adminNext.page.locator('[data-search-input-field]').fill(searchTerm);
		await adminNext.page.waitForTimeout(350);
		expect(adminNextSearchRequests).toBe(0);
		await adminNextSearchResponse;
		expect(adminNextSearchRequests).toBe(1);
		expect(await adminNext.getRowCount()).toBe(1);
	});

	test('search matches non-title search fields in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const searchTerm = 'smoke-test-post-07-';
		const expectedIds = await withMongo(async (db) =>
			(await db.collection('Post')
				.find({ slug: { $regex: searchTerm, $options: 'i' } }, { projection: { _id: 1 } })
				.toArray())
				.map((doc) => String(doc._id)),
		);
		expect(expectedIds).toHaveLength(1);

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.search(searchTerm);
		const adminLegacyIds = await adminLegacy.getRowIds();

		await adminNext.gotoList(LIST_KEY);
		await adminNext.search(searchTerm);
		const adminNextIds = await adminNext.getRowIds();

		expect(adminLegacyIds).toEqual(expectedIds);
		expect(adminNextIds).toEqual(expectedIds);
	});

	test('search with no matches shows the search term in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const searchTerm = 'no-post-title-matches-this-term';
		const expectedMessage = `No posts found matching ${searchTerm}`;

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.search(searchTerm);
		await expect(adminLegacy.page.getByText(expectedMessage)).toBeVisible();
		await expect(adminLegacy.page.locator('[data-list-row][data-item-id]')).toHaveCount(0);

		await adminNext.gotoList(LIST_KEY);
		await adminNext.search(searchTerm);
		await expect(adminNext.page.getByText(expectedMessage)).toBeVisible();
		await expect(adminNext.page.locator('[data-list-row][data-item-id]')).toHaveCount(0);
	});

	test('search can be cleared with Escape in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const searchTerm = 'no-post-title-matches-this-term';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.search(searchTerm);
		await expect(adminLegacy.page.locator('[data-list-row][data-item-id]')).toHaveCount(0);
		await adminLegacy.page.locator('[data-search-input-field]').press('Escape');
		await expect(adminLegacy.page.locator('[data-search-input-field]')).toHaveValue('');
		await expect.poll(() => adminLegacy.getRowCount()).toBeGreaterThan(0);
		expect(new URL(adminLegacy.page.url()).searchParams.get('search')).toBeNull();

		await adminNext.gotoList(LIST_KEY);
		await adminNext.search(searchTerm);
		await expect(adminNext.page.locator('[data-list-row][data-item-id]')).toHaveCount(0);
		await adminNext.page.locator('[data-search-input-field]').press('Escape');
		await expect(adminNext.page.locator('[data-search-input-field]')).toHaveValue('');
		await expect.poll(() => adminNext.getRowCount()).toBeGreaterThan(0);
		expect(new URL(adminNext.page.url()).searchParams.get('search')).toBe('');
	});

	test('sorting by title produces same first-row value in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		// Navigate with sort=title query param (adminLegacy uses ?sort=title).
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_PATH}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?sort=title`);
		await adminLegacyLoad;
		const adminLegacyRows = await adminLegacy.getRowIds();

		// adminNext uses ?sort=title in its URL (TanStack Router search params).
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?sort=title`);
		await adminNextLoad;
		const adminNextRows = await adminNext.getRowIds();

		expect(adminLegacyRows.length).toBeGreaterThan(0);
		expect(adminNextRows.length).toBeGreaterThan(0);

		// Both UIs should agree on the first item when sorted by title.
		expect(adminLegacyRows[0]).toBe(adminNextRows[0]);
	});

	test('descending title sort matches Mongo ordering in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const expectedIds = await withMongo(async (db) =>
			(await db.collection('Post')
				.find({}, { projection: { _id: 1 } })
				.sort({ title: -1 })
				.limit(PAGE_SIZE)
				.toArray())
				.map((doc) => String(doc._id)),
		);

		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.get('sort') === '-title' &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?sort=-title`);
		await adminLegacyLoad;
		const adminLegacyRows = await adminLegacy.getRowIds();

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.get('sort') === '-title' &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?sort=-title`);
		await adminNextLoad;
		const adminNextRows = await adminNext.getRowIds();

		expect(adminLegacyRows).toEqual(expectedIds);
		expect(adminNextRows).toEqual(expectedIds);
	});

	test('numeric select sort matches Mongo ordering in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const sortQuery = 'priority,title';
		const expectedIds = await withMongo(async (db) =>
			(await db.collection('Post')
				.find({}, { projection: { _id: 1 } })
				.sort({ priority: 1, title: 1 })
				.limit(PAGE_SIZE)
				.toArray())
				.map((doc) => String(doc._id)),
		);

		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.get('sort') === sortQuery &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?sort=${encodeURIComponent(sortQuery)}`);
		await adminLegacyLoad;
		const adminLegacyRows = await adminLegacy.getRowIds();

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.get('sort') === sortQuery &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?sort=${encodeURIComponent(sortQuery)}`);
		await adminNextLoad;
		const adminNextRows = await adminNext.getRowIds();

		expect(adminLegacyRows).toEqual(expectedIds);
		expect(adminNextRows).toEqual(expectedIds);
	});

	test('datetime sort matches Mongo ordering in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const sortQuery = '-reviewedAt,title';
		const expectedIds = await withMongo(async (db) =>
			(await db.collection('Post')
				.find({}, { projection: { _id: 1 } })
				.sort({ reviewedAt: -1, title: 1 })
				.limit(PAGE_SIZE)
				.toArray())
				.map((doc) => String(doc._id)),
		);

		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.get('sort') === sortQuery &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?sort=${encodeURIComponent(sortQuery)}`);
		await adminLegacyLoad;
		const adminLegacyRows = await adminLegacy.getRowIds();

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.get('sort') === sortQuery &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?sort=${encodeURIComponent(sortQuery)}`);
		await adminNextLoad;
		const adminNextRows = await adminNext.getRowIds();

		expect(adminLegacyRows).toEqual(expectedIds);
		expect(adminNextRows).toEqual(expectedIds);
	});

	test('relationship sort matches Mongo ordering in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const sortQuery = 'author,title';
		await withMongo(async (db) => {
			const alice = await db.collection('User').findOne({ email: 'alice@example.com' });
			const bob = await db.collection('User').findOne({ email: 'bob@example.com' });
			expect(alice, 'Alice editor should exist before relationship sort seed').toBeTruthy();
			expect(bob, 'Bob editor should exist before relationship sort seed').toBeTruthy();
			await db.collection('Post').updateOne(
				{ title: 'Smoke Test Post 03 — draft' },
				{ $set: { author: alice!._id } },
			);
			await db.collection('Post').updateOne(
				{ title: 'Smoke Test Post 04 — published' },
				{ $set: { author: bob!._id } },
			);
		});
		const expectedIds = await withMongo(async (db) =>
			(await db.collection('Post')
				.find({}, { projection: { _id: 1 } })
				.sort({ author: 1, title: 1 })
				.limit(PAGE_SIZE)
				.toArray())
				.map((doc) => String(doc._id)),
		);

		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.get('sort') === sortQuery &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?sort=${encodeURIComponent(sortQuery)}`);
		await adminLegacyLoad;
		const adminLegacyRows = await adminLegacy.getRowIds();

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.get('sort') === sortQuery &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?sort=${encodeURIComponent(sortQuery)}`);
		await adminNextLoad;
		const adminNextRows = await adminNext.getRowIds();

		expect(adminLegacyRows).toEqual(expectedIds);
		expect(adminNextRows).toEqual(expectedIds);
	});

	test('state select filter returns the same rows in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const adminLegacyFilters = encodeURIComponent(
			JSON.stringify([{ path: 'state', inverted: false, value: ['published'] }]),
		);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200 &&
					url.searchParams.has('filters');
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?filters=${adminLegacyFilters}`);
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200 &&
					url.searchParams.has('filters');
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?f.state=published`);
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();

		expect(adminLegacyIds).toEqual(adminNextIds);
		expect(adminLegacyIds).toHaveLength(9);
		const filteredStates = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminLegacyIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ state: string }>({ state: 1 })
				.toArray(),
		);
		expect(filteredStates.map((doc) => doc.state)).toEqual(Array(9).fill('published'));
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="state"]')).toContainText('Published');
	});

	test('structured inverted multi-select filters return the same rows in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const filterValue = { path: 'state', inverted: true, value: ['published', 'draft'] };
		const adminLegacyFilters = encodeURIComponent(JSON.stringify([filterValue]));
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200 &&
					url.searchParams.has('filters');
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?filters=${adminLegacyFilters}`);
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();

		const adminNextFilterValue = encodeURIComponent(JSON.stringify({
			value: filterValue.value,
			inverted: filterValue.inverted,
		}));
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200 &&
					url.searchParams.has('filters');
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?f.state=${adminNextFilterValue}`);
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();

		expect(adminNextIds).toEqual(adminLegacyIds);
		expect(adminNextIds.length).toBeGreaterThan(0);
		const filteredStates = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ state: string }>({ state: 1 })
				.toArray(),
		);
		expect(filteredStates.map((doc) => doc.state)).toEqual(Array(adminNextIds.length).fill('archived'));
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="state"]'))
			.toContainText('NOT Published, Draft');
	});

	test('structured inverted text filters return the same rows in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const filterValue = { path: 'title', mode: 'endsWith', inverted: true, value: 'published' };
		const adminLegacyFilters = encodeURIComponent(JSON.stringify([filterValue]));
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200 &&
					url.searchParams.has('filters');
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?filters=${adminLegacyFilters}`);
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();

		const adminNextFilterValue = encodeURIComponent(JSON.stringify({
			mode: filterValue.mode,
			inverted: filterValue.inverted,
			value: filterValue.value,
		}));
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200 &&
					url.searchParams.has('filters');
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?f.title=${adminNextFilterValue}`);
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();

		expect(adminNextIds).toEqual(adminLegacyIds);
		expect(adminNextIds).toHaveLength(16);
		const filteredTitles = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ title: string }>({ title: 1 })
				.toArray(),
		);
		expect(filteredTitles.every((doc) => !doc.title.endsWith('published'))).toBe(true);
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="title"]'))
			.toContainText('NOT Ends with: published');
	});

	test('text mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="title"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('endsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill('published');
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(9);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('endsWith');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="title"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="title"] [data-list-filter-text-mode]').selectOption('endsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="title"] [data-list-filter-text-value]').fill('published');
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredTitles = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ title: string }>({ title: 1 })
				.toArray(),
		);
		expect(filteredTitles.every((doc) => doc.title.endsWith('published'))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.title')).toContain('endsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="title"]'))
			.toContainText('Ends with: published');
	});

	test('textarea mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = 'State=archived.';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="summary"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('endsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(8);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('summary');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="summary"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="summary"] [data-list-filter-text-mode]').selectOption('endsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="summary"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ summary: string }>({ summary: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.summary.endsWith(value))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.summary')).toContain('endsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="summary"]'))
			.toContainText('Ends with: State=archived.');
	});

	test('key mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = 'smoke-test-post-key-1';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="slugKey"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(11);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('slugKey');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="slugKey"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="slugKey"] [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="slugKey"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ slugKey: string }>({ slugKey: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.slugKey.startsWith(value))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.slugKey')).toContain('beginsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="slugKey"]'))
			.toContainText('Begins with: smoke-test-post-key-1');
	});

	test('url mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = 'https://example.com/smoke-test-post-1';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="canonicalUrl"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(11);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('canonicalUrl');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="canonicalUrl"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="canonicalUrl"] [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="canonicalUrl"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ canonicalUrl: string }>({ canonicalUrl: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.canonicalUrl.startsWith(value))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.canonicalUrl')).toContain('beginsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="canonicalUrl"]'))
			.toContainText('Begins with: https://example.com/smoke-test-post-1');
	});

	test('email mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = 'alice';

		await adminLegacy.gotoList(USER_LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="email"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${USER_LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(1);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('email');

		await adminNext.gotoList(USER_LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="email"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="email"] [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="email"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${USER_LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('User')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ email: string }>({ email: 1 })
				.toArray(),
		);
		expect(filteredRows).toHaveLength(1);
		expect(filteredRows[0]?.email).toBe('alice@example.com');
		expect(new URL(adminNext.page.url()).searchParams.get('f.email')).toContain('beginsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="email"]'))
			.toContainText('Begins with: alice');
	});

	test('name mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = 'Alice';

		await adminLegacy.gotoList(USER_LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="name"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${USER_LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(1);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('name');

		await adminNext.gotoList(USER_LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="name"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="name"] [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="name"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${USER_LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('User')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ name: { first: string; last: string } }>({ name: 1 })
				.toArray(),
		);
		expect(filteredRows).toHaveLength(1);
		expect(filteredRows[0]?.name).toEqual({ first: 'Alice', last: 'Editor' });
		expect(new URL(adminNext.page.url()).searchParams.get('f.name')).toContain('beginsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="name"]'))
			.toContainText('Begins with: Alice');
	});

	test('code mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = 'export const smokePost1';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="codeSnippet"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(11);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('codeSnippet');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="codeSnippet"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="codeSnippet"] [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="codeSnippet"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ codeSnippet: string }>({ codeSnippet: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.codeSnippet.startsWith(value))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.codeSnippet')).toContain('beginsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="codeSnippet"]'))
			.toContainText('Begins with: export const smokePost1');
	});

	test('color mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = '#27ae60';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="accentColor"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('exactly');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(13);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('accentColor');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="accentColor"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="accentColor"] [data-list-filter-text-mode]').selectOption('exactly');
		await adminNext.page.locator('[data-field-filter][data-field-name="accentColor"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ accentColor: string }>({ accentColor: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.accentColor === value)).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.accentColor')).toContain('exactly');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="accentColor"]'))
			.toContainText('Exactly: #27ae60');
	});

	test('html mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = '<h2>Smoke HTML 1';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="articleHtml"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(11);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('articleHtml');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="articleHtml"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="articleHtml"] [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="articleHtml"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ articleHtml: string }>({ articleHtml: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.articleHtml.startsWith(value))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.articleHtml')).toContain('beginsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="articleHtml"]'))
			.toContainText('Begins with: <h2>Smoke HTML 1');
	});

	test('markdown mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = '## Smoke markdown 1';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="editorialMarkdown"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminLegacy.page.locator('.Popout [data-list-filter-text-value]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(11);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('editorialMarkdown');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="editorialMarkdown"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="editorialMarkdown"] [data-list-filter-text-mode]').selectOption('beginsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="editorialMarkdown"] [data-list-filter-text-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ editorialMarkdown?: { md?: string } }>({ editorialMarkdown: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.editorialMarkdown?.md?.startsWith(value))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.editorialMarkdown')).toContain('beginsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="editorialMarkdown"]'))
			.toContainText('Begins with: ## Smoke markdown 1');
	});

	test('textarray mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = 'post-1';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="tags"]').click();
		await adminLegacy.page.locator('.Popout select').nth(0).selectOption('some');
		await adminLegacy.page.locator('.Popout select').nth(1).selectOption('beginsWith');
		await adminLegacy.page.locator('.Popout input[placeholder^="At least one element"]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(11);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('tags');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="tags"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="tags"] [data-list-filter-textarray-presence]').selectOption('some');
		await adminNext.page.locator('[data-field-filter][data-field-name="tags"] [data-list-filter-textarray-mode]').selectOption('beginsWith');
		await adminNext.page.locator('[data-field-filter][data-field-name="tags"] [data-list-filter-textarray-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ tags: string[] }>({ tags: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.tags.some((tag) => tag.startsWith(value)))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.tags')).toContain('beginsWith');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="tags"]'))
			.toContainText('At least one element begins with: post-1');
	});

	test('numberarray mode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = '20';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="scoreHistory"]').click();
		await adminLegacy.page.locator('.Popout select').nth(0).selectOption('some');
		await adminLegacy.page.locator('.Popout select').nth(1).selectOption('gt');
		await adminLegacy.page.locator('.Popout input[placeholder^="At least one element"]').fill(value);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(6);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('scoreHistory');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="scoreHistory"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="scoreHistory"] [data-list-filter-numberarray-presence]').selectOption('some');
		await adminNext.page.locator('[data-field-filter][data-field-name="scoreHistory"] [data-list-filter-numberarray-mode]').selectOption('gt');
		await adminNext.page.locator('[data-field-filter][data-field-name="scoreHistory"] [data-list-filter-numberarray-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ scoreHistory: number[] }>({ scoreHistory: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.scoreHistory.some((entry) => entry > 20))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.scoreHistory')).toContain('gt');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="scoreHistory"]'))
			.toContainText('At least one element greater than: 20');
	});

	test('datearray mode filter returns the same rows in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const value = '2026-07-20';
		const adminLegacyFilters = encodeURIComponent(JSON.stringify([{
			path: 'blackoutDates',
			mode: 'after',
			presence: 'some',
			value,
		}]));
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?filters=${adminLegacyFilters}`);
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(4);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('blackoutDates');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="blackoutDates"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="blackoutDates"] [data-list-filter-datearray-presence]').selectOption('some');
		await adminNext.page.locator('[data-field-filter][data-field-name="blackoutDates"] [data-list-filter-date-mode]').selectOption('after');
		await adminNext.page.locator('[data-field-filter][data-field-name="blackoutDates"] [data-list-filter-date-value]').fill(value);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const boundary = new Date(`${value}T00:00:00.000Z`);
		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ blackoutDates: Date[] }>({ blackoutDates: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.blackoutDates.some((entry) => new Date(entry).getTime() > boundary.getTime()))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.blackoutDates')).toContain('after');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="blackoutDates"]'))
			.toContainText('At least one element after: 2026-07-20');
	});

	test('date filters return the same rows in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const filterDate = '2026-04-30';
		const adminLegacyFilters = encodeURIComponent(JSON.stringify([{
			path: 'publishedAt',
			mode: 'on',
			inverted: false,
			value: filterDate,
		}]));
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200 &&
					url.searchParams.has('filters');
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?filters=${adminLegacyFilters}`);
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200 &&
					url.searchParams.has('filters');
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?f.publishedAt=${filterDate}`);
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();

		expect(adminNextIds).toEqual(adminLegacyIds);
		expect(adminNextIds).toHaveLength(1);
		const filteredDates = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ publishedAt: Date }>({ publishedAt: 1 })
				.toArray(),
		);
		expect(filteredDates.map((doc) => formatDateInputValue(doc.publishedAt))).toEqual([filterDate]);
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="publishedAt"]'))
			.toContainText(filterDate);
	});

	test('date after filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="publishedAt"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-date-mode]').selectOption('after');
		await adminLegacy.page.locator('.Popout [data-list-filter-date-value]').fill('15-04-2026');
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(5);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('after');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="publishedAt"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="publishedAt"] [data-list-filter-date-mode]').selectOption('after');
		await adminNext.page.locator('[data-field-filter][data-field-name="publishedAt"] [data-list-filter-date-value]').fill('2026-04-15');
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ publishedAt: Date }>({ publishedAt: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => formatDateInputValue(doc.publishedAt) > '2026-04-15')).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.publishedAt')).toContain('after');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="publishedAt"]'))
			.toContainText('After: 2026-04-15');
	});

	test('state select filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="state"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-select-option][data-filter-option-value="published"]').click();
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(9);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('published');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="state"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="state"] select').selectOption('published');
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);
		expect(new URL(adminNext.page.url()).searchParams.get('f.state')).toBe('published');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="state"]')).toContainText('Published');
	});

	test('number greater-than filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="viewCount"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-number-mode]').selectOption('gt');
		await adminLegacy.page.locator('.Popout [data-list-filter-number-value]').fill('100');
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(11);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('viewCount');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="viewCount"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="viewCount"] [data-list-filter-number-mode]').selectOption('gt');
		await adminNext.page.locator('[data-field-filter][data-field-name="viewCount"] [data-list-filter-number-value]').fill('100');
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ viewCount: number }>({ viewCount: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.viewCount > 100)).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.viewCount')).toContain('gt');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="viewCount"]'))
			.toContainText('Greater than: 100');
	});

	test('number between filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="viewCount"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-number-mode]').selectOption('between');
		await adminLegacy.page.locator('.Popout [data-list-filter-number-min]').fill('35');
		await adminLegacy.page.locator('.Popout [data-list-filter-number-max]').fill('70');
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(6);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('between');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="viewCount"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="viewCount"] [data-list-filter-number-mode]').selectOption('between');
		await adminNext.page.locator('[data-field-filter][data-field-name="viewCount"] [data-list-filter-number-min]').fill('35');
		await adminNext.page.locator('[data-field-filter][data-field-name="viewCount"] [data-list-filter-number-max]').fill('70');
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ viewCount: number }>({ viewCount: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.viewCount >= 35 && doc.viewCount <= 70)).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.viewCount')).toContain('between');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="viewCount"]'))
			.toContainText('Between: 35 - 70');
	});

	test('money less-than filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="budgetCost"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-number-mode]').selectOption('lt');
		await adminLegacy.page.locator('.Popout [data-list-filter-number-value]').fill('100');
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(7);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('budgetCost');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="budgetCost"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="budgetCost"] [data-list-filter-number-mode]').selectOption('lt');
		await adminNext.page.locator('[data-field-filter][data-field-name="budgetCost"] [data-list-filter-number-value]').fill('100');
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ budgetCost: number }>({ budgetCost: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.budgetCost < 100)).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.budgetCost')).toContain('lt');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="budgetCost"]'))
			.toContainText('Less than: 100');
	});

	test('location postcode filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const postcode = '62701';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="venueAddress"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-location-code]').fill(postcode);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(3);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('venueAddress');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="venueAddress"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="venueAddress"] [data-list-filter-location-code]').fill(postcode);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ venueAddress?: { postcode?: string } }>({ venueAddress: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.venueAddress?.postcode === postcode)).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.venueAddress')).toContain('62701');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="venueAddress"]'))
			.toContainText('Postcode: 62701');
	});

	test('password existence filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await seedPasswordlessUser();

		await adminLegacy.gotoList(USER_LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="password"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-password]').getByRole('button', { name: 'Is NOT Set' }).click();
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${USER_LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(1);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('false');

		await adminNext.gotoList(USER_LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="password"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="password"] [data-list-filter-password-missing]').check();
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${USER_LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredUsers = await withMongo(async (db) =>
			db.collection('User')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ email: string; password?: string }>({ email: 1, password: 1 })
				.toArray(),
		);
		expect(filteredUsers).toHaveLength(1);
		expect(filteredUsers[0]?.email).toBe('nopassword@example.com');
		expect(filteredUsers[0]?.password).toBeUndefined();
		expect(new URL(adminNext.page.url()).searchParams.get('f.password')).toContain('false');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="password"]'))
			.toContainText('Is NOT Set');
	});

	test('boolean filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="featured"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-boolean]').getByRole('button', { name: 'Is NOT Checked' }).click();
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds).toHaveLength(19);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('false');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="featured"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="featured"] [data-list-filter-boolean-value]').selectOption('false');
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ featured?: boolean }>({ featured: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => doc.featured !== true)).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.featured')).toContain('false');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="featured"]'))
			.toContainText('Is NOT Checked');
	});

	test('geopoint proximity filter can be applied from the filter dropdown in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const lat = '40.7494';
		const lon = '-73.9847';
		const maxDistanceKm = '1';

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.locator('#listHeaderFilterButton').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-option][data-field-name="coordinates"]').click();
		await adminLegacy.page.locator('.Popout [data-list-filter-geopoint-lat]').fill(lat);
		await adminLegacy.page.locator('.Popout [data-list-filter-geopoint-lon]').fill(lon);
		await adminLegacy.page.locator('.Popout [data-list-filter-geopoint-distance]').fill(maxDistanceKm);
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
		await adminLegacyLoad;
		const adminLegacyIds = await adminLegacy.getRowIds();
		expect(adminLegacyIds.length).toBeGreaterThan(0);
		expect(new URL(adminLegacy.page.url()).searchParams.get('filters')).toContain('coordinates');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-filters-add] > button').click();
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-option][data-field-name="coordinates"]').click();
		await adminNext.page.locator('[data-field-filter][data-field-name="coordinates"] [data-list-filter-geopoint-lat]').fill(lat);
		await adminNext.page.locator('[data-field-filter][data-field-name="coordinates"] [data-list-filter-geopoint-lon]').fill(lon);
		await adminNext.page.locator('[data-field-filter][data-field-name="coordinates"] [data-list-filter-geopoint-distance]').fill(maxDistanceKm);
		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.has('filters') &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.locator('[data-list-filters-add] [data-list-filter-apply]').click();
		await adminNextLoad;
		const adminNextIds = await adminNext.getRowIds();
		expect(adminNextIds).toEqual(adminLegacyIds);

		const center: [number, number] = [Number(lon), Number(lat)];
		const filteredRows = await withMongo(async (db) =>
			db.collection('Post')
				.find({ _id: { $in: adminNextIds.map((id) => new Types.ObjectId(id)) } })
				.project<{ coordinates: [number, number] }>({ coordinates: 1 })
				.toArray(),
		);
		expect(filteredRows.every((doc) => distanceKm(center, doc.coordinates) <= Number(maxDistanceKm))).toBe(true);
		expect(new URL(adminNext.page.url()).searchParams.get('f.coordinates')).toContain('max');
		await expect(adminNext.page.locator('[data-list-filter-chip][data-field-name="coordinates"]'))
			.toContainText('Max distance: 1km');
	});

	test('column query params select the same visible columns in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_PATH}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?columns=title,state`);
		await adminLegacyLoad;

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?columns=title,state`);
		await adminNextLoad;

		expect(await adminLegacy.getColumnHeaders()).toEqual(['ID', 'Title', 'State']);
		expect(await adminNext.getColumnHeaders()).toEqual(['ID', 'Title', 'State']);

		const adminNextColsAliasLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?cols=title,state`);
		await adminNextColsAliasLoad;
		expect(await adminNext.getColumnHeaders()).toEqual(['ID', 'Title', 'State']);
	});

	test('column query params preserve explicit column order in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_PATH}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?columns=state,title`);
		await adminLegacyLoad;

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?columns=state,title`);
		await adminNextLoad;

		expect(await adminLegacy.getColumnHeaders()).toEqual(['ID', 'State', 'Title']);
		expect(await adminNext.getColumnHeaders()).toEqual(['ID', 'State', 'Title']);
	});

	test('column query params render relationship columns in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_PATH}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?columns=author,title`);
		await adminLegacyLoad;

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?columns=author,title`);
		await adminNextLoad;

		expect(await adminLegacy.getColumnHeaders()).toEqual(['ID', 'Author', 'Title']);
		expect(await adminNext.getColumnHeaders()).toEqual(['ID', 'Author', 'Title']);
		await expect(adminLegacy.page.locator('[data-list-row][data-item-id]').first()).toContainText('Test Admin');
		await expect(adminNext.page.locator('[data-list-cell][data-field-name="author"]').first()).toContainText('Test Admin');
	});

	test('column query params render special field columns in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const columnsQuery = 'codeSnippet,budgetCost,accentColor';
		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_PATH}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?columns=${columnsQuery}`);
		await adminLegacyLoad;

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?columns=${columnsQuery}`);
		await adminNextLoad;

		expect(await adminLegacy.getColumnHeaders()).toEqual(['ID', 'Code Snippet', 'Budget Cost', 'Accent Color']);
		expect(await adminNext.getColumnHeaders()).toEqual(['ID', 'Code Snippet', 'Budget Cost', 'Accent Color']);
		await expect(adminLegacy.page.locator('[data-list-row][data-item-id]').first()).toContainText('export const smokePost1 = true;');
		await expect(adminLegacy.page.locator('[data-list-row][data-item-id]').first()).toContainText('$12.50');
		await expect(adminLegacy.page.locator('[data-list-row][data-item-id]').first()).toContainText('#27ae60');
		await expect(adminNext.page.locator('[data-list-cell][data-field-name="codeSnippet"]').first()).toContainText('export const smokePost1 = true;');
		await expect(adminNext.page.locator('[data-list-cell][data-field-name="budgetCost"]').first()).toContainText('$12.50');
		await expect(adminNext.page.locator('[data-list-cell][data-field-name="accentColor"]').first()).toContainText('#27ae60');
	});

	test('column dropdown changes visible columns and URL state in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const adminLegacyInitialLoad = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_PATH}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?columns=title,state`);
		await adminLegacyInitialLoad;
		await expect.poll(() => adminLegacy.getColumnHeaders()).toEqual(['ID', 'Title', 'State']);

		await adminLegacy.openColumnsDropdown();
		await adminLegacy.toggleColumnOption('state');
		const adminLegacyReload = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_PATH}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminLegacy.applyColumnsDropdown();
		await adminLegacyReload;
		await expect.poll(() => adminLegacy.getColumnHeaders()).toEqual(['ID', 'Title']);
		expect(new URL(adminLegacy.page.url()).searchParams.get('columns')).toBe('id,title');

		const adminNextInitialLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?columns=title,state`);
		await adminNextInitialLoad;
		await expect.poll(() => adminNext.getColumnHeaders()).toEqual(['ID', 'Title', 'State']);

		await adminNext.openColumnsDropdown();
		const adminNextReload = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.toggleColumnOption('state');
		await adminNextReload;
		await expect.poll(() => adminNext.getColumnHeaders()).toEqual(['ID', 'Title']);
		expect(new URL(adminNext.page.url()).searchParams.get('cols')).toBe('id,title');
	});

	test('adminNext column reset returns to the legacy default headers', async ({
		adminLegacy,
		adminNext,
	}) => {
		const adminLegacyDefaultLoad = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_PATH}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}`);
		await adminLegacyDefaultLoad;
		const legacyDefaultHeaders = await adminLegacy.getColumnHeaders();
		expect(legacyDefaultHeaders.length).toBeGreaterThan(2);

		const adminNextInitialLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?columns=title,state`);
		await adminNextInitialLoad;
		await expect.poll(() => adminNext.getColumnHeaders()).toEqual(['ID', 'Title', 'State']);

		await adminNext.openColumnsDropdown();
		await expect(adminNext.page.locator('[data-list-columns] [data-list-column-reset]')).toBeVisible();
		const adminNextResetLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await adminNext.page.locator('[data-list-columns] [data-list-column-reset]').click();
		await adminNextResetLoad;
		await expect.poll(() => adminNext.getColumnHeaders()).toEqual(legacyDefaultHeaders);
		expect(new URL(adminNext.page.url()).searchParams.get('cols')).toBe('');
	});

	test('column dropdown search narrows visible options in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.openColumnsDropdown();
		await adminLegacy.page.locator('.Popout [data-list-column-search]').fill('state');
		await expect(adminLegacy.page.locator('.Popout [data-list-column-option][data-field-name="state"]')).toBeVisible();
		await expect(adminLegacy.page.locator('.Popout [data-list-column-option][data-field-name="title"]')).toHaveCount(0);

		await adminNext.gotoList(LIST_KEY);
		await adminNext.openColumnsDropdown();
		await adminNext.page.locator('[data-list-columns] [data-list-column-search]').fill('state');
		await expect(adminNext.page.locator('[data-list-columns] [data-list-column-option][data-field-name="state"]')).toBeVisible();
		await expect(adminNext.page.locator('[data-list-columns] [data-list-column-option][data-field-name="title"]')).toHaveCount(0);
	});

	test('pagination deep links and page buttons show the same slice in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await seedAdditionalPosts(PAGE_SIZE + 10 - 25);

		const adminLegacyPageTwoLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_PATH}`) &&
					url.searchParams.get('skip') === String(PAGE_SIZE) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${LIST_PATH}?page=2`);
		await adminLegacyPageTwoLoad;
		expect(await adminLegacy.getPaginationSummary()).toBe('Showing 51 to 60 of 60');
		expect(await adminLegacy.getRowCount()).toBe(10);

		const adminNextPageTwoLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.get('skip') === String(PAGE_SIZE) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.goto(`/keystone-next/${LIST_KEY}?page=2`);
		await adminNextPageTwoLoad;
		expect(await adminNext.getPaginationSummary()).toBe('Showing 51 to 60 of 60');
		expect(await adminNext.getRowCount()).toBe(10);

		await adminLegacy.selectPage(1);
		await expect.poll(() => adminLegacy.getPaginationSummary()).toBe('Showing 1 to 50 of 60');
		await expect.poll(() => adminLegacy.getRowCount()).toBe(PAGE_SIZE);

		const adminNextPageOneLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${LIST_KEY}`) &&
					url.searchParams.get('skip') === '0' &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.selectPage(1);
		await adminNextPageOneLoad;
		await expect.poll(() => adminNext.getPaginationSummary()).toBe('Showing 1 to 50 of 60');
		await expect.poll(() => adminNext.getRowCount()).toBe(PAGE_SIZE);
	});

	test('custom list perPage metadata drives pagination in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await seedCompactPosts(7);

		const adminLegacyPageTwoLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_PATH}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(COMPACT_PAGE_SIZE) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${COMPACT_LIST_PATH}?page=2`);
		await adminLegacyPageTwoLoad;
		expect(await adminLegacy.getPaginationSummary()).toBe('Showing 4 to 6 of 7');
		expect(await adminLegacy.getRowCount()).toBe(COMPACT_PAGE_SIZE);

		const adminNextPageTwoLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_KEY}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(COMPACT_PAGE_SIZE) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.goto(`/keystone-next/${COMPACT_LIST_KEY}?page=2`);
		await adminNextPageTwoLoad;
		expect(await adminNext.getPaginationSummary()).toBe('Showing 4 to 6 of 7');
		expect(await adminNext.getRowCount()).toBe(COMPACT_PAGE_SIZE);

		const adminNextLastPageLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_KEY}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(COMPACT_PAGE_SIZE * 2) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.selectPage(3);
		await adminNextLastPageLoad;
		await expect.poll(() => adminNext.getPaginationSummary()).toBe('Showing 7 to 7 of 7');
		await expect.poll(() => adminNext.getRowCount()).toBe(1);
	});

	test('out-of-range pagination deep links preserve legacy skip behavior', async ({
		adminLegacy,
		adminNext,
	}) => {
		await seedCompactPosts(7);
		const outOfRangePage = 99;
		const outOfRangeSkip = (outOfRangePage - 1) * COMPACT_PAGE_SIZE;

		const adminLegacyLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_PATH}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(outOfRangeSkip) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${COMPACT_LIST_PATH}?page=${outOfRangePage}`);
		await adminLegacyLoad;
		await expect(adminLegacy.page.getByText('No compact posts found...')).toBeVisible();
		await expect(adminLegacy.page.locator('[data-list-pagination-summary]')).toHaveCount(0);
		await expect(adminLegacy.page.locator('[data-list-table]')).toHaveCount(0);
		await expect(adminLegacy.page.locator('[data-list-row][data-item-id]')).toHaveCount(0);

		const adminNextLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_KEY}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(outOfRangeSkip) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.goto(`/keystone-next/${COMPACT_LIST_KEY}?page=${outOfRangePage}`);
		await adminNextLoad;
		await expect(adminNext.page.getByText('No compact posts found...')).toBeVisible();
		await expect(adminNext.page.locator('[data-list-pagination-summary]')).toHaveCount(0);
		await expect(adminNext.page.locator('[data-list-table]')).toHaveCount(0);
		await expect(adminNext.page.locator('[data-list-row][data-item-id]')).toHaveCount(0);
	});

	test('delete-induced page boundary preserves legacy blank-state pagination behavior', async ({
		adminLegacy,
		adminNext,
	}) => {
		await seedCompactPosts(7);
		const boundaryPage = 3;
		const boundarySkip = (boundaryPage - 1) * COMPACT_PAGE_SIZE;

		const adminLegacyBeforeLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_PATH}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(boundarySkip) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.goto(`/keystone/${COMPACT_LIST_PATH}?page=${boundaryPage}`);
		await adminLegacyBeforeLoad;
		expect(await adminLegacy.getPaginationSummary()).toBe('Showing 7 to 7 of 7');
		expect(await adminLegacy.getRowCount()).toBe(1);

		const adminNextBeforeLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_KEY}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(boundarySkip) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.goto(`/keystone-next/${COMPACT_LIST_KEY}?page=${boundaryPage}`);
		await adminNextBeforeLoad;
		expect(await adminNext.getPaginationSummary()).toBe('Showing 7 to 7 of 7');
		expect(await adminNext.getRowCount()).toBe(1);

		await withMongo(async (db) => {
			const result = await db.collection('CompactPost').deleteOne({
				title: 'Compact Test Post 07',
			});
			expect(result.deletedCount).toBe(1);
		});

		const adminLegacyAfterLoad = adminLegacy.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_PATH}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(boundarySkip) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminLegacy.page.reload();
		await adminLegacyAfterLoad;
		await expect(adminLegacy.page.getByText('No compact posts found...')).toBeVisible();
		await expect(adminLegacy.page.locator('[data-list-pagination-summary]')).toHaveCount(0);
		await expect(adminLegacy.page.locator('[data-list-table]')).toHaveCount(0);
		await expect(adminLegacy.page.locator('[data-list-row][data-item-id]')).toHaveCount(0);

		const adminNextAfterLoad = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_KEY}`) &&
					url.searchParams.get('limit') === String(COMPACT_PAGE_SIZE) &&
					url.searchParams.get('skip') === String(boundarySkip) &&
					r.request().method() === 'GET' &&
					r.status() === 200;
			},
		);
		await adminNext.page.reload();
		await adminNextAfterLoad;
		await expect(adminNext.page.getByText('No compact posts found...')).toBeVisible();
		await expect(adminNext.page.locator('[data-list-pagination-summary]')).toHaveCount(0);
		await expect(adminNext.page.locator('[data-list-table]')).toHaveCount(0);
		await expect(adminNext.page.locator('[data-list-row][data-item-id]')).toHaveCount(0);
	});

	test('empty lists show matching create affordances in the blank state', async ({
		adminLegacy,
		adminNext,
	}) => {
		await resetWithoutPosts();

		await adminLegacy.page.goto(`/keystone/${LIST_PATH}`);
		await expect(adminLegacy.page.getByText('No posts found...')).toBeVisible();
		const legacyCreateButton = adminLegacy.page.locator('[data-e2e-list-create-button="no-results"]');
		await expect(legacyCreateButton).toBeVisible();
		await legacyCreateButton.click();
		await expect(adminLegacy.page.getByText('Create a new Post')).toBeVisible();

		await adminNext.page.goto(`/keystone-next/${LIST_KEY}`);
		await expect(adminNext.page.getByText('No posts found...')).toBeVisible();
		const adminNextCreateButton = adminNext.page.locator('[data-e2e-list-create-button="no-results"]');
		await expect(adminNextCreateButton).toBeVisible();
		await adminNextCreateButton.click();
		await expect(adminNext.page.locator('[data-create-item-modal]')).toBeVisible();
	});
});
