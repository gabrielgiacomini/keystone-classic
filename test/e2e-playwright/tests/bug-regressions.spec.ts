import { test, expect } from '@playwright/test';
import { SigninPage, ListPage, ItemPage } from '../page-objects';

test.describe('Bug Regressions', () => {
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

	test.describe('Issue #2945 - List columns with no default', () => {
		test('should display list header correctly for no-default-columns', async ({ page }) => {
			await page.goto('/keystone/no-default-columns');
			await page.waitForLoadState('networkidle');

			const heading = page.locator('h2').first();
			await expect(heading).toContainText('No Default Column');
		});

		test('should display table when items exist', async ({ page }) => {
			await page.goto('/keystone/no-default-columns');
			await page.waitForLoadState('networkidle');

			const hasTable = await page.locator('table').isVisible().catch(() => false);
			const hasBlankState = await page.locator('.BlankState, [class*="blank"]').isVisible().catch(() => false);

			expect(hasTable || hasBlankState).toBe(true);
		});
	});

	test.describe('Issue #3028 - Inline relationship', () => {
		test('should navigate to inline-relationships list', async ({ page }) => {
			await page.goto('/keystone/inline-relationships');
			await page.waitForLoadState('networkidle');

			const heading = page.locator('h2').first();
			await expect(heading).toContainText('Inline Relationship');
		});
	});

	test.describe('Issue #3068 - DependsOn field', () => {
		test('should display depends-ons list', async ({ page }) => {
			await page.goto('/keystone/depends-ons');
			await page.waitForLoadState('networkidle');

			const heading = page.locator('h2').first();
			await expect(heading).toContainText('Depends On');
		});

		test('should show dependency field in create modal', async ({ page }) => {
			await listPage.goto('depends-ons');
			await listPage.openCreateModal();

			await page.getByText('Create a new Depends On').waitFor({ state: 'visible' });

			const dependencyLabel = page.getByText('Dependency', { exact: false });
			await expect(dependencyLabel).toBeVisible();
		});
	});

	test.describe('Issue #2940 - Target Relationship', () => {
		test('should display target-relationships list', async ({ page }) => {
			await page.goto('/keystone/target-relationships');
			await page.waitForLoadState('networkidle');

			const heading = page.locator('h2').first();
			await expect(heading).toContainText('Target Relationship');
		});
	});

	test.describe('Issue #3126 - Date Field Map', () => {
		test('should display date-field-maps list', async ({ page }) => {
			await page.goto('/keystone/date-field-maps');
			await page.waitForLoadState('networkidle');

			const heading = page.locator('h2').first();
			await expect(heading).toContainText('Date Field Map');
		});

		test('should open create modal for date-field-maps', async ({ page }) => {
			await listPage.goto('date-field-maps');
			await listPage.openCreateModal();

			await page.getByText('Create a new Date Field Map').waitFor({ state: 'visible' });
			await expect(page.getByText('Create a new Date Field Map')).toBeVisible();
		});
	});

	test.describe('Misc Models Navigation', () => {
		test('should navigate to all misc models', async ({ page }) => {
			const miscModels = [
				'date-field-maps',
				'depends-ons',
				'no-default-columns',
				'inline-relationships',
				'many-relationships',
				'hidden-relationships',
				'source-relationships',
				'target-relationships',
			];

			for (const model of miscModels) {
				await page.goto(`/keystone/${model}`);
				await page.waitForLoadState('networkidle');
				await expect(page).toHaveURL(new RegExp(`/keystone/${model}`));
			}
		});
	});
});
