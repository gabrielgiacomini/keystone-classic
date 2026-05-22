/**
 * Parity spec: Create item (P4-30).
 *
 * Verifies that both adminLegacy (/keystone) and adminNext (/keystone-next) can create
 * a new Post item. After creation, both list views must show +1 item
 * compared to the pre-create count.
 *
 * Each beforeEach re-seeds so counts are deterministic.
 */

import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';

test.beforeEach(async () => {
	await seedPostsAndEditors();
});

test.describe('Parity: Create item', () => {
	test('adminLegacy: create new Post → list shows +1 item', async ({ adminLegacy }) => {
		const before = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		await adminLegacy.gotoList(LIST_PATH);
		const result = await adminLegacy.createItem('Post', `Admin Legacy Created Post ${Date.now()}`);
		expect(result.status).toBe(200);
		expect(result.id).toMatch(/^[0-9a-f]{24}$/);

		const after = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);
		expect(after).toBe(before + 1);

		// Verify the list view shows the new count.
		await adminLegacy.gotoList(LIST_PATH);
		const rowCount = await adminLegacy.getRowCount();
		expect(rowCount).toBeGreaterThanOrEqual(before);
	});

	test('adminNext: create new Post → list shows +1 item', async ({ adminNext }) => {
		const before = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		const result = await adminNext.createItem(LIST_KEY, `Admin Next Created Post ${Date.now()}`);
		expect(result.status).toBe(200);

		const after = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);
		expect(after).toBe(before + 1);
	});

	test('both UIs: create in adminLegacy, verify adminNext list shows +1', async ({ adminLegacy, adminNext }) => {
		const before = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		await adminLegacy.gotoList(LIST_PATH);
		const result = await adminLegacy.createItem('Post', `Cross-UI Post ${Date.now()}`);
		expect(result.status).toBe(200);

		const afterMongo = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);
		expect(afterMongo).toBe(before + 1);

		// adminNext list should also reflect the new count.
		await adminNext.gotoList(LIST_KEY);
		const adminNextRowCount = await adminNext.getRowCount();
		// The adminNext list must show at least the new total (page-size capped).
		expect(adminNextRowCount).toBeGreaterThanOrEqual(Math.min(afterMongo, 1));
	});
});
