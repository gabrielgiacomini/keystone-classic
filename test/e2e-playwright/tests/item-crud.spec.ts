import { test, expect } from '@playwright/test';
import { SigninPage, ListPage, ItemPage } from '../page-objects';

test.describe('Item CRUD Operations', () => {
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

	test.describe('Read', () => {
		test('should display item details', async ({ page }) => {
			await listPage.goto('users');
			await listPage.clickRowByName('e2e user');
			await itemPage.expectToBeOnItemPage();
			const title = await itemPage.getTitle();
			expect(title).toContain('e2e user');
		});

		test('should show all form fields', async ({ page }) => {
			await listPage.goto('users');
			await listPage.clickRowByName('e2e user');
			await expect(page.getByText('Name')).toBeVisible();
			await expect(page.getByText('Email')).toBeVisible();
			await expect(page.getByRole('button', { name: /Password/i })).toBeVisible();
		});

		test('should show meta information', async ({ page }) => {
			await listPage.goto('users');
			await listPage.clickRowByName('e2e user');
			await expect(page.getByText('Created At')).toBeVisible();
			await expect(page.getByText('Updated At')).toBeVisible();
		});
	});

	test.describe('Create', () => {
		test('should open create modal from list', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			await listPage.openCreateModal();
			await expect(page.getByText('Create a new Text')).toBeVisible();
		});

		test('should create new item', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			await listPage.openCreateModal();

			await page.getByText('Create a new Text').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Test Item ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);
			await itemPage.expectToBeOnItemPage();
		});

		test('should cancel create modal', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			await listPage.openCreateModal();
			await page.getByRole('button', { name: 'Cancel' }).click();
			await expect(page.getByText('Create a new Text')).not.toBeVisible();
		});
	});

	test.describe('Update', () => {
		test('should edit item field', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			await listPage.openCreateModal();
			await page.getByText('Create a new Text').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Update Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);

			const newName = 'Updated Name ' + Date.now();
			await page.locator('input[name="name"]').fill(newName);
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="name"]')).toHaveValue(newName);
		});

		test('should reset changes', async ({ page }) => {
			await listPage.goto('users');
			await listPage.clickRowByName('e2e user');

			const originalValue = await page.locator('input[name="name.first"]').inputValue();
			await page.locator('input[name="name.first"]').fill('Changed');
			await itemPage.reset();
			await itemPage.confirmReset();

			await expect(page.locator('input[name="name.first"]')).toHaveValue(originalValue);
		});
	});

	test.describe('Delete', () => {
		test('should show delete button', async ({ page }) => {
			await listPage.goto('users');
			await listPage.clickRowByName('e2e user');
			await expect(itemPage.deleteButton).toBeVisible();
		});

		test('should delete created item', async ({ page }) => {
			await listPage.goto('texts');
			await page.waitForLoadState('networkidle');
			await listPage.openCreateModal();
			await page.getByText('Create a new Text').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Delete Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);

			await itemPage.delete();
			await itemPage.confirmDelete();

			await page.waitForURL(/\/keystone\/texts/);
			await listPage.expectToBeOnListPage('texts');
		});
	});

	test.describe('Navigation', () => {
		test('should navigate back to list', async ({ page }) => {
			await listPage.goto('users');
			await listPage.clickRowByName('e2e user');
			await itemPage.expectToBeOnItemPage();

			await page.getByRole('link', { name: 'Users' }).first().click();
			await listPage.expectToBeOnListPage('users');
		});

		test('should create new item from item view', async ({ page }) => {
			await listPage.goto('users');
			await listPage.clickRowByName('e2e user');

			await page.getByRole('button', { name: /New User/i }).click();
			await expect(page.getByText('Create a new User')).toBeVisible();
		});
	});
});
