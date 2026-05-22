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

test.beforeEach(async () => {
	await seedPostsAndEditors();
});

test.describe('Parity: Bulk delete', () => {
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
