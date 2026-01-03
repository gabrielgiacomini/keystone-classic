import { test, expect } from '@playwright/test';
import { SigninPage, ListPage } from '../page-objects';

test.describe('List Filters', () => {
	let signinPage: SigninPage;
	let listPage: ListPage;

	test.beforeEach(async ({ page }) => {
		signinPage = new SigninPage(page);
		listPage = new ListPage(page);

		await signinPage.goto();
		await signinPage.signinAsAdmin();
	});

	test.describe('Filter Dropdown', () => {
		test('should open filter dropdown', async ({ page }) => {
			await listPage.goto('users');
			await listPage.openFilterDropdown();
			await expect(page.getByPlaceholder('Find a filter...')).toBeVisible();
		});

		test('should show available filters for list', async ({ page }) => {
			await listPage.goto('users');
			await listPage.openFilterDropdown();
			const popout = page.locator('.Popout__body');
			await expect(popout.locator('.PopoutList__item').filter({ hasText: 'Name' })).toBeVisible();
			await expect(popout.locator('.PopoutList__item').filter({ hasText: 'Email' })).toBeVisible();
		});

		test('should search for filters', async ({ page }) => {
			await listPage.goto('users');
			await listPage.openFilterDropdown();
			await page.getByPlaceholder('Find a filter...').fill('email');
			const popout = page.locator('.Popout__body');
			await expect(popout.locator('.PopoutList__item').filter({ hasText: 'Email' })).toBeVisible();
		});
	});

	test.describe('Text Filters', () => {
		test('should filter by text contains', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			const initialCount = await listPage.getRowCount();

			await listPage.applyTextFilter('Name', 'test', 'contains');

			const hasFilter = await listPage.hasActiveFilter('name');
			expect(hasFilter).toBe(true);
		});

		test('should filter by text exactly', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyTextFilter('Email', 'user@test.e2e', 'exactly');

			const hasFilter = await listPage.hasActiveFilter('email');
			expect(hasFilter).toBe(true);

			const rowCount = await listPage.getRowCount();
			expect(rowCount).toBeGreaterThanOrEqual(1);
		});

		test('should show filter label with value', async ({ page }) => {
			await listPage.goto('users');
			await listPage.applyTextFilter('Email', 'test', 'contains');

			const filterLabel = await listPage.getActiveFilterLabel('email');
			expect(filterLabel).toContain('test');
		});
	});

	test.describe('Boolean Filters', () => {
		test('should filter by boolean is checked', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyBooleanFilter('Is Admin', true);

			const hasFilter = await listPage.hasActiveFilter('isAdmin');
			expect(hasFilter).toBe(true);
		});

		test('should filter by boolean is not checked', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyBooleanFilter('Is Admin', false);

			const hasFilter = await listPage.hasActiveFilter('isAdmin');
			expect(hasFilter).toBe(true);
		});
	});

	test.describe('Select Filters', () => {
		test('should filter by select option', async ({ page }) => {
			await listPage.goto('selects');
			await page.waitForLoadState('networkidle');

			await listPage.openFilterDropdown();
			await page.locator('.PopoutList__item').filter({ hasText: 'Field A' }).click();
			await page.waitForTimeout(300);

			await page.locator('.Popout__body .PopoutList__item').filter({ hasText: 'one' }).click();
			await page.getByRole('button', { name: 'Apply' }).click();
			await page.waitForTimeout(500);

			const filterCount = await listPage.getActiveFilterCount();
			expect(filterCount).toBe(1);
		});
	});

	test.describe('Multiple Filters', () => {
		test('should apply multiple filters', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyTextFilter('Email', 'test', 'contains');
			await listPage.applyBooleanFilter('Is Admin', true);

			const filterCount = await listPage.getActiveFilterCount();
			expect(filterCount).toBe(2);
		});

		test('should show all active filters as chips', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyTextFilter('Email', 'test', 'contains');
			await listPage.applyBooleanFilter('Is Member', true);

			const emailFilter = await listPage.hasActiveFilter('email');
			const memberFilter = await listPage.hasActiveFilter('isMember');

			expect(emailFilter).toBe(true);
			expect(memberFilter).toBe(true);
		});
	});

	test.describe('Clear Filters', () => {
		test('should clear single filter', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyTextFilter('Email', 'test', 'contains');
			expect(await listPage.getActiveFilterCount()).toBe(1);

			await listPage.clearFilter('email');
			expect(await listPage.getActiveFilterCount()).toBe(0);
		});

		test('should clear all filters', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyTextFilter('Email', 'test', 'contains');
			await listPage.applyBooleanFilter('Is Admin', true);
			expect(await listPage.getActiveFilterCount()).toBe(2);

			await listPage.clearAllFilters();
			expect(await listPage.getActiveFilterCount()).toBe(0);
		});

		test('should restore full list after clearing filter', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');
			const initialCount = await listPage.getRowCount();

			await listPage.applyTextFilter('Email', 'admin@test.e2e', 'exactly');
			const filteredCount = await listPage.getRowCount();

			await listPage.clearAllFilters();
			await page.waitForTimeout(500);
			const restoredCount = await listPage.getRowCount();

			expect(restoredCount).toBeGreaterThanOrEqual(filteredCount);
		});
	});

	test.describe('Filter Persistence', () => {
		test('should persist filter in URL', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyTextFilter('Email', 'test', 'contains');
			await page.waitForTimeout(500);

			const url = page.url();
			expect(url).toContain('email');
		});

		test('should edit existing filter', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForLoadState('networkidle');

			await listPage.applyTextFilter('Email', 'test', 'contains');

			const filterChip = page.locator('#activeFilter__email button').first();
			await filterChip.click();

			await expect(page.locator('.Popout__header__label').filter({ hasText: 'Edit Filter' })).toBeVisible();
		});
	});
});
