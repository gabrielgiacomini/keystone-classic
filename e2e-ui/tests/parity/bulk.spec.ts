/**
 * Parity spec: Bulk delete (P4-30).
 *
 * Verifies that both adminLegacy (/keystone) and adminNext (/keystone-next) can
 * select 2 rows and bulk-delete them. After deletion, both UIs
 * must show N-2 rows.
 *
 * Each beforeEach re-seeds 25 Posts so the count is deterministic
 * and large enough to pick 2 rows on the first page.
 */

import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';
const COMPACT_LIST_KEY = 'CompactPost';
const COMPACT_LIST_PATH = 'compact-posts';

async function seedCompactPosts(count: number): Promise<void> {
	await withMongo(async (db) => {
		const existing = await db.listCollections({ name: 'CompactPost' }).toArray();
		if (existing.length > 0) await db.dropCollection('CompactPost');
		const now = new Date('2026-05-24T12:00:00.000Z');
		const docs = Array.from({ length: count }, (_, index) => ({
			title: `Compact Bulk Post ${String(index + 1).padStart(2, '0')}`,
			createdAt: now,
			updatedAt: now,
		}));
		await db.collection('CompactPost').insertMany(docs, { ordered: false });
	});
}

test.beforeEach(async () => {
	await seedPostsAndEditors();
});

test.describe('Parity: Bulk delete', () => {
	test('cross-page All selection deletes every row from a paginated list in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await seedCompactPosts(7);
		await adminLegacy.gotoList(COMPACT_LIST_PATH);
		await expect(adminLegacy.page.locator('[data-list-row]')).toHaveCount(3);
		await adminLegacy.page.locator('[data-list-management-toggle]').click();
		const legacyAllResponse = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${COMPACT_LIST_PATH}`) &&
				r.request().method() === 'GET',
		);
		await adminLegacy.page.locator('[data-list-management-select-all]').click();
		await legacyAllResponse;
		await expect(adminLegacy.page.locator('[data-list-management-selected-count]')).toHaveText(
			/^\s*7\s+selected\s*$/i,
		);
		await adminLegacy.bulkDelete();
		await expect
			.poll(() => withMongo((db) => db.collection('CompactPost').countDocuments()))
			.toBe(0);

		await seedCompactPosts(7);
		await adminNext.gotoList(COMPACT_LIST_KEY);
		await expect(adminNext.page.locator('[data-list-row]')).toHaveCount(3);
		await adminNext.page.locator('[data-list-management-toggle]').click();
		const adminNextAllResponse = adminNext.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return url.pathname.includes(`/keystone-api/${COMPACT_LIST_KEY}`) &&
					url.searchParams.get('limit') === '7' &&
					r.request().method() === 'GET';
			},
		);
		await adminNext.page.locator('[data-list-management-select-all]').click();
		await adminNextAllResponse;
		await expect(adminNext.page.locator('[data-list-management] [data-list-management-selected-count]').getByText('7 selected'))
			.toBeVisible();
		await adminNext.bulkDelete();
		await expect
			.poll(() => withMongo((db) => db.collection('CompactPost').countDocuments()))
			.toBe(0);
	});

	test('visible-page all and none selection controls update selected counts in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		const legacyVisibleCount = await adminLegacy.getRowCount();
		expect(legacyVisibleCount).toBeGreaterThan(0);
		await adminLegacy.page.locator('[data-list-management-toggle]').click();
		await adminLegacy.page.locator('[data-list-management-select-visible]').click();
		await expect(adminLegacy.page.locator('[data-list-management-selected-count]')).toHaveText(
			new RegExp(`^\\s*${legacyVisibleCount}\\s+selected\\s*$`, 'i'),
		);
		await adminLegacy.page.locator('[data-list-management-select-none]').click();
		await expect(adminLegacy.page.locator('[data-list-management-selected-count]')).toHaveText(/^\s*0\s+selected\s*$/i);

		await adminNext.gotoList(LIST_KEY);
		const adminNextVisibleCount = await adminNext.getRowCount();
		expect(adminNextVisibleCount).toBe(legacyVisibleCount);
		await adminNext.page.locator('[data-list-management-toggle]').click();
		await adminNext.page.locator('[data-list-management-select-visible]').click();
		await expect(adminNext.page.locator('[data-list-management] [data-list-management-selected-count]').getByText(`${adminNextVisibleCount} selected`))
			.toBeVisible();
		await adminNext.page.locator('[data-list-management-select-none]').click();
		await expect(adminNext.page.locator('[data-list-management] [data-list-management-selected-count]').getByText('0 selected'))
			.toBeVisible();
	});

	test('adminLegacy: select 2 rows → bulk delete → list shows N-2 rows', async ({ adminLegacy }) => {
		const before = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		await adminLegacy.gotoList(LIST_PATH);
		const ids = await adminLegacy.getRowIds();
		expect(ids.length).toBeGreaterThanOrEqual(2);

		// Select the first two row ids.
		await adminLegacy.selectRows([ids[0]!, ids[1]!]);
		await adminLegacy.bulkDelete();

		const after = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);
		expect(after).toBe(before - 2);

		// Reload and verify the row count dropped by 2.
		await adminLegacy.gotoList(LIST_PATH);
		const newRowCount = await adminLegacy.getRowCount();
		// Row count on first page: either page-size capped or the new total.
		const expected = Math.min(after, 50);
		expect(newRowCount).toBe(expected);
	});

	test('adminNext: select 2 rows → bulk delete → list shows N-2 rows', async ({ adminNext }) => {
		const before = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		await adminNext.gotoList(LIST_KEY);
		const ids = await adminNext.getRowIds();
		expect(ids.length).toBeGreaterThanOrEqual(2);

		// Select the first two row ids using adminNext checkboxes.
		await adminNext.selectRows([ids[0]!, ids[1]!]);
		await adminNext.bulkDelete();

		const after = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);
		expect(after).toBe(before - 2);

		// Reload and verify the row count.
		await adminNext.gotoList(LIST_KEY);
		const newRowCount = await adminNext.getRowCount();
		const expected = Math.min(after, 50);
		expect(newRowCount).toBe(expected);
	});

	test('cross-UI parity: both show same count after adminLegacy bulk delete', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		const adminLegacyIdsBefore = await adminLegacy.getRowIds();
		expect(adminLegacyIdsBefore.length).toBeGreaterThanOrEqual(2);

		// Delete 2 rows via adminLegacy.
		await adminLegacy.selectRows([adminLegacyIdsBefore[0]!, adminLegacyIdsBefore[1]!]);
		await adminLegacy.bulkDelete();

		const mongoBefore = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		// Both UIs should now show the same row count.
		await adminLegacy.gotoList(LIST_PATH);
		const adminLegacyCount = await adminLegacy.getRowCount();

		await adminNext.gotoList(LIST_KEY);
		const adminNextCount = await adminNext.getRowCount();

		// Both should agree.
		expect(adminLegacyCount).toBe(adminNextCount);
		// And match Mongo (if within page size).
		if (mongoBefore <= 50) {
			expect(adminLegacyCount).toBe(mongoBefore);
		}
	});
});
