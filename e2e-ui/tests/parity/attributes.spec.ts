/**
 * Parity spec: explicit admin semantic attributes (P4-31).
 *
 * These checks lock the data-* hooks used by parity tests so future specs do
 * not regress to CSS classes, icon glyphs, or href parsing.
 */

import type { Locator } from '@playwright/test';
import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';

test.beforeEach(async () => {
	await seedPostsAndEditors();
});

async function expectSingle(locator: Locator): Promise<void> {
	await expect(locator).toHaveCount(1);
	await expect(locator).toBeVisible();
}

test.describe('Parity: semantic attribute contract', () => {
	test('dashboard and nav expose list identity hooks', async ({ adminLegacy, adminNext }) => {
		await adminLegacy.gotoHome();
		await expectSingle(adminLegacy.page.locator(`[data-dashboard-list][data-list-path="${LIST_PATH}"]`));
		await expectSingle(adminLegacy.page.locator(`[data-dashboard-list][data-list-path="${LIST_PATH}"] [data-dashboard-list-count]`));
		await expectSingle(adminLegacy.page.locator(`[data-dashboard-list][data-list-path="${LIST_PATH}"] [data-dashboard-list-manage]`));
		await expectSingle(adminLegacy.page.locator(`[data-nav-list-link][data-list-path="${LIST_PATH}"]`));

		await adminNext.gotoHome();
		await expectSingle(adminNext.page.locator(`[data-dashboard-list][data-list-path="${LIST_PATH}"]`));
		await expectSingle(adminNext.page.locator(`[data-dashboard-list][data-list-path="${LIST_PATH}"] [data-dashboard-list-count]`));
		await expectSingle(adminNext.page.locator(`[data-dashboard-list][data-list-path="${LIST_PATH}"] [data-dashboard-list-manage]`));
		await expectSingle(adminNext.page.locator(`[data-nav-list-link][data-list-path="${LIST_PATH}"]`));
	});

	test('list rows expose strict item-level hooks', async ({ adminLegacy, adminNext }) => {
		await adminLegacy.gotoList(LIST_PATH);
		await expectSingle(adminLegacy.page.locator(`[data-list-table][data-list-path="${LIST_PATH}"]`));
		await expectSingle(adminLegacy.page.locator('[data-list-create]'));
		const adminLegacyIds = await adminLegacy.getRowIds();
		const adminLegacyId = adminLegacyIds[0]!;
		await expectSingle(adminLegacy.page.locator(`[data-list-row][data-item-id="${adminLegacyId}"]`));
		await expectSingle(adminLegacy.page.locator(`[data-list-row-edit][data-item-id="${adminLegacyId}"]`));
		await adminLegacy.page.locator('[data-list-management-toggle]').click();
		await expectSingle(adminLegacy.page.locator(`[data-list-row-select][data-item-id="${adminLegacyId}"]`));
		await expectSingle(adminLegacy.page.locator('[data-list-management-delete]'));
		await expectSingle(adminLegacy.page.locator('[data-list-management-selected-count]'));

		await adminNext.gotoList(LIST_KEY);
		await expectSingle(adminNext.page.locator(`[data-list-table][data-list-path="${LIST_PATH}"]`));
		await expectSingle(adminNext.page.locator('[data-list-create]'));
		const adminNextIds = await adminNext.getRowIds();
		const adminNextId = adminNextIds[0]!;
		await expectSingle(adminNext.page.locator(`[data-list-row][data-item-id="${adminNextId}"]`));
		await expectSingle(adminNext.page.locator(`[data-list-row-edit][data-item-id="${adminNextId}"]`));
		// Manage-mode row selects only render when the management toggle is
		// active (parity with legacy). selectRows() flips the toggle for us.
		await adminNext.selectRows([adminNextId]);
		await expectSingle(adminNext.page.locator(`[data-list-row-select][data-item-id="${adminNextId}"]`));
		await expectSingle(adminNext.page.locator('[data-list-management-delete]'));
		await expect(adminNext.page.locator('[data-list-management-delete]')).toHaveAttribute(
			'data-list-management-selected-count',
			'1',
		);
	});

	test('adminNext resolves route paths and labels from metadata', async ({ adminNext }) => {
		const listLoad = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes('/keystone-api/Post')
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await adminNext.page.goto(`${adminNext.prefix}/${LIST_PATH}`);
		await listLoad;

		// Title is "<count> <plural>" (e.g. "5 Posts") for parity with legacy
		// admin which renders `${count} ${plural}` in its list header.
		await expect(adminNext.page.locator('h1')).toHaveText(/^\d+\s+Posts$/);
		await expect(adminNext.page.locator(`[data-list-table][data-list-path="${LIST_PATH}"]`)).toHaveAttribute(
			'data-list-key',
			LIST_KEY,
		);
		await expect(adminNext.page.locator(`[data-list-create][data-list-path="${LIST_PATH}"]`)).toHaveAttribute(
			'data-list-key',
			LIST_KEY,
		);
	});

	test('bulk delete confirmation dialogs expose explicit confirm hooks', async ({ adminLegacy, adminNext }) => {
		await adminLegacy.gotoList(LIST_PATH);
		const adminLegacyId = (await adminLegacy.getRowIds())[0]!;
		await adminLegacy.selectRows([adminLegacyId]);
		await adminLegacy.page.locator('[data-list-management-delete]').click();
		await expectSingle(adminLegacy.page.locator('[data-confirm-dialog]'));
		await expectSingle(adminLegacy.page.locator('[data-confirm-dialog] [data-confirm-delete]'));

		await adminNext.gotoList(LIST_KEY);
		const adminNextId = (await adminNext.getRowIds())[0]!;
		await adminNext.selectRows([adminNextId]);
		await adminNext.page.locator('[data-list-management-delete]').click();
		await expectSingle(adminNext.page.locator('[data-confirm-dialog]'));
		await expectSingle(adminNext.page.locator('[data-confirm-dialog] [data-confirm-delete]'));
	});
});
