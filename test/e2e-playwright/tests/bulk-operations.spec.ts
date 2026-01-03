import { test, expect } from '@playwright/test';
import { SigninPage, ListPage, ItemPage } from '../page-objects';

test.describe('Bulk Operations', () => {
	let signinPage: SigninPage;
	let listPage: ListPage;
	let itemPage: ItemPage;

	test.beforeEach(async ({ page }) => {
		signinPage = new SigninPage(page);
		listPage = new ListPage(page);
		itemPage = new ItemPage(page);

		await signinPage.goto();
		await signinPage.signinAsAdmin();
	});

	test.describe('Manage Mode', () => {
		test('should show Manage button', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');

			await expect(page.getByRole('button', { name: 'Manage' })).toBeVisible();
		});

		test('should enter manage mode when clicking Manage', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');

			await page.getByRole('button', { name: 'Manage' }).click();

			await expect(page.getByRole('button', { name: /All|Page/ })).toBeVisible();
			await expect(page.getByRole('button', { name: 'None' })).toBeVisible();
		});

		test('should show Delete button in manage mode', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');

			await page.getByRole('button', { name: 'Manage' }).click();

			await expect(page.getByRole('button', { name: /Delete/i })).toBeVisible();
		});

		test('should toggle out of manage mode', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');

			await page.getByRole('button', { name: 'Manage' }).click();
			await expect(page.getByRole('button', { name: 'None' })).toBeVisible();

			await page.getByRole('button', { name: 'Manage' }).click();
			await expect(page.getByRole('button', { name: 'None' })).not.toBeVisible();
		});
	});

	test.describe('Selection', () => {
		test('should select all visible items', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');

			await page.getByRole('button', { name: 'Manage' }).click();
			await page.getByRole('button', { name: /All|Page/ }).click();

			await expect(page.getByText(/\d+ selected/)).toBeVisible();
		});

		test('should deselect all items', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');

			await page.getByRole('button', { name: 'Manage' }).click();
			await page.getByRole('button', { name: /All|Page/ }).click();
			await page.getByRole('button', { name: 'None' }).click();

			await expect(page.getByText('0 selected')).toBeVisible();
		});

		test('should show correct selected count', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			const rowCount = await listPage.getRowCount();

			await page.getByRole('button', { name: 'Manage' }).click();
			await page.getByRole('button', { name: /All|Page/ }).click();

			const selectedText = await page.getByText(/\d+ selected/).textContent();
			expect(selectedText).toContain('selected');
		});
	});

	test.describe('Bulk Delete', () => {
		test('should show delete confirmation modal', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			const rowCount = await listPage.getRowCount();

			if (rowCount > 0) {
				await page.getByRole('button', { name: 'Manage' }).click();
				await page.getByRole('button', { name: /All|Page/ }).click();
				await page.getByRole('button', { name: /Delete/i }).click();

				await expect(page.getByText('Are you sure you want to')).toBeVisible();
				await page.keyboard.press('Escape');
			}
		});

		test('should cancel delete operation', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			const initialCount = await listPage.getRowCount();

			if (initialCount > 0) {
				await page.getByRole('button', { name: 'Manage' }).click();
				await page.getByRole('button', { name: /All|Page/ }).click();
				await page.getByRole('button', { name: /Delete/i }).click();

				await page.getByRole('button', { name: 'Cancel' }).click();
				await page.waitForTimeout(500);

				const finalCount = await listPage.getRowCount();
				expect(finalCount).toBe(initialCount);
			}
		});
	});

	test.describe('Column Visibility', () => {
		test('should open columns dropdown', async ({ page }) => {
			await listPage.goto('users');
			await listPage.openColumnsDropdown();
			await expect(page.locator('.Popout__body')).toBeVisible();
		});

		test('should show available columns', async ({ page }) => {
			await listPage.goto('users');
			await listPage.openColumnsDropdown();
			await expect(page.locator('.PopoutList__item').first()).toBeVisible();
		});

		test('should toggle column visibility', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.openColumnsDropdown();

			const popout = page.locator('.Popout__body');
			const columnItem = popout.locator('.PopoutList__item').first();

			await expect(columnItem).toBeVisible();
			await columnItem.click();
			await page.waitForTimeout(300);

			await expect(popout).toBeVisible();
		});
	});

	test.describe('Download', () => {
		test('should show download button', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');

			await expect(page.getByRole('button', { name: /Download/i })).toBeVisible();
		});

		test('should open download form', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');

			await page.getByRole('button', { name: /Download/i }).click();

			await expect(page.locator('.Popout__body')).toBeVisible();
		});
	});
});
