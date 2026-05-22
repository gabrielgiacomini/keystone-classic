/**
 * Parity spec: List view (P4-30).
 *
 * Verifies that both adminLegacy (/keystone) and adminNext (/keystone-next) list views:
 *   - Show the same number of rows for the seeded Post list
 *   - Return the same row count when searching for an existing title
 *   - Sort by 'title' column and produce the same first-row value
 */

import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';

test.beforeEach(async () => {
	await seedPostsAndEditors();
});

test.describe('Parity: List view', () => {
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
});
