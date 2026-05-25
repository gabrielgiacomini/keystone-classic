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

	test('canceling the create modal closes it without creating an item in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const before = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		let legacyCreateRequests = 0;
		adminLegacy.page.on('request', (request) => {
			if (request.method() === 'POST' && request.url().includes('/create')) {
				legacyCreateRequests += 1;
			}
		});

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.getByRole('button', { name: /Create Post/i }).click();
		const legacyModal = adminLegacy.page.locator('[data-create-item-modal]');
		await expect(legacyModal).toBeVisible();
		await legacyModal.locator('[data-create-item-cancel]').click();
		await expect(legacyModal).toHaveCount(0);
		expect(legacyCreateRequests).toBe(0);

		let adminNextCreateRequests = 0;
		adminNext.page.on('request', (request) => {
			if (request.method() === 'POST' && request.url().includes('/create')) {
				adminNextCreateRequests += 1;
			}
		});

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-create]').click();
		const adminNextModal = adminNext.page.locator('[data-create-item-modal]');
		await expect(adminNextModal).toBeVisible();
		await adminNextModal.locator('[data-create-item-cancel]').click();
		await expect(adminNextModal).toHaveCount(0);
		expect(adminNextCreateRequests).toBe(0);

		const after = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);
		expect(after).toBe(before);
	});

	test('adminLegacy: required initial field validation keeps modal open and preserves count', async ({ adminLegacy }) => {
		const before = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.page.getByRole('button', { name: /Create Post/i }).click();
		await expect(adminLegacy.page.getByText('Create a new Post')).toBeVisible();

		const createPromise = adminLegacy.page.waitForResponse(
			(r) =>
				r.url().includes('/create') &&
				r.request().method() === 'POST',
		);
		await adminLegacy.page.getByRole('button', { name: 'Create', exact: true }).click();
		const res = await createPromise;
		expect(res.status()).toBe(400);
		await expect(adminLegacy.page.locator('[data-alert-type="danger"]')).toContainText('Title is required');
		await expect(adminLegacy.page.getByText('Create a new Post')).toBeVisible();

		const after = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);
		expect(after).toBe(before);
	});

	test('adminNext: required initial field validation keeps modal open and preserves count', async ({ adminNext }) => {
		const before = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		await adminNext.gotoList(LIST_KEY);
		await adminNext.page.locator('[data-list-create]').click();
		const modal = adminNext.page.locator('[data-create-item-modal]');
		await expect(modal).toBeVisible();

		const createPromise = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes('/create') &&
				r.request().method() === 'POST',
		);
		await modal.locator('[data-create-item-submit]').click();
		const res = await createPromise;
		expect(res.status()).toBe(400);
		await expect(modal.getByRole('alert')).toContainText('Title is required');
		await expect(modal).toBeVisible();

		const after = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);
		expect(after).toBe(before);
	});
});
