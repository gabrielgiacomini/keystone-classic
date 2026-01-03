import { test, expect } from '@playwright/test';
import { SigninPage, DashboardPage, ListPage } from '../page-objects';

test.describe('List View', () => {
	let signinPage: SigninPage;
	let dashboardPage: DashboardPage;
	let listPage: ListPage;

	test.beforeEach(async ({ page }) => {
		signinPage = new SigninPage(page);
		dashboardPage = new DashboardPage(page);
		listPage = new ListPage(page);

		await signinPage.goto();
		await signinPage.signinAsAdmin();
		await dashboardPage.expectToBeOnDashboard();
	});

	test('should display users list', async () => {
		await listPage.goto('users');
		await listPage.expectToBeOnListPage('users');
	});

	test('should show correct item count', async ({ page }) => {
		await listPage.goto('users');
		await page.waitForLoadState('networkidle');
		const rowCount = await listPage.getRowCount();
		expect(rowCount).toBeGreaterThanOrEqual(1);
	});

	test('should display table headers', async ({ page }) => {
		await listPage.goto('users');
		await page.waitForLoadState('networkidle');
		const headers = await listPage.getColumnHeaders();
		expect(headers.length).toBeGreaterThan(0);
		expect(headers).toContain('Name');
		expect(headers).toContain('Email');
	});

	test('should filter list by search', async ({ page }) => {
		await listPage.goto('users');
		await listPage.search('member');
		await page.waitForTimeout(500);
		const rowCount = await listPage.getRowCount();
		expect(rowCount).toBeGreaterThanOrEqual(1);
	});

	test('should open filter dropdown', async ({ page }) => {
		await listPage.goto('users');
		await page.waitForLoadState('networkidle');
		await listPage.openFilterDropdown();
		await expect(page.getByPlaceholder('Find a filter...')).toBeVisible();
	});

	test('should open columns dropdown', async ({ page }) => {
		await listPage.goto('users');
		await listPage.openColumnsDropdown();
		await expect(page.locator('.Popout__body')).toBeVisible();
	});

	test('should navigate to item when clicking row', async ({ page }) => {
		await listPage.goto('users');
		await listPage.clickRowByName('e2e user');
		await expect(page).toHaveURL(/\/keystone\/users\/[a-f0-9]+/);
	});

	test('should open create modal', async ({ page }) => {
		await listPage.goto('users');
		await listPage.openCreateModal();
		await expect(page.getByText('Create a new User')).toBeVisible();
	});

	test('should sort by column', async ({ page }) => {
		await listPage.goto('users');
		await listPage.sortByColumn('email');
		await page.waitForTimeout(300);
		await expect(listPage.table).toBeVisible();
	});

	test('should navigate from dashboard to list', async () => {
		await dashboardPage.navigateToList('users');
		await listPage.expectToBeOnListPage('users');
	});
});
