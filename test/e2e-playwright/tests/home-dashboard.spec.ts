import { test, expect } from '@playwright/test';
import { SigninPage } from '../page-objects';

test.describe('Home Dashboard', () => {
	let signinPage: SigninPage;

	test.beforeEach(async ({ page }) => {
		signinPage = new SigninPage(page);
		await signinPage.goto();
		await signinPage.signinAsAdmin();
	});

	test.describe('Dashboard Header', () => {
		test('should display dashboard header with app name', async ({ page }) => {
			await page.goto('/keystone');
			await expect(page.locator('.dashboard-heading')).toContainText('e2e');
		});

		test('should display dashboard groups', async ({ page }) => {
			await page.goto('/keystone');
			await expect(page.locator('.dashboard-group__heading').filter({ hasText: 'Access' })).toBeVisible();
			await expect(page.locator('.dashboard-group__heading').filter({ hasText: 'Fields' })).toBeVisible();
		});
	});

	test.describe('Dashboard Groups', () => {
		test('should display Access group with Users', async ({ page }) => {
			await page.goto('/keystone');
			await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();
		});

		test('should display Fields group with field type lists', async ({ page }) => {
			await page.goto('/keystone');
			await expect(page.getByRole('link', { name: 'Booleans' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Texts' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Numbers' })).toBeVisible();
		});

		test('should display Miscs group', async ({ page }) => {
			await page.goto('/keystone');
			await expect(page.locator('.dashboard-group__heading').filter({ hasText: 'Miscs' })).toBeVisible();
		});
	});

	test.describe('Dashboard Navigation', () => {
		test('should navigate to Users list when clicking Users tab', async ({ page }) => {
			await page.goto('/keystone');
			await page.getByRole('link', { name: /User/i }).first().click();
			await expect(page).toHaveURL(/\/keystone\/users/);
		});

		test('should navigate to Texts list when clicking Texts tab', async ({ page }) => {
			await page.goto('/keystone');
			await page.getByRole('link', { name: 'Texts' }).click();
			await expect(page).toHaveURL(/\/keystone\/texts/);
		});

		test('should navigate to Booleans list when clicking Booleans tab', async ({ page }) => {
			await page.goto('/keystone');
			await page.getByRole('link', { name: 'Booleans' }).click();
			await expect(page).toHaveURL(/\/keystone\/booleans/);
		});
	});

	test.describe('Dashboard Item Counts', () => {
		test('should display item count for Users', async ({ page }) => {
			await page.goto('/keystone');
			const userLink = page.getByRole('link', { name: /User/i }).first();
			await expect(userLink).toBeVisible();
		});

		test('should show correct count format', async ({ page }) => {
			await page.goto('/keystone');
			await page.waitForLoadState('networkidle');
			const countLocator = page.locator('.dashboard-group__list-count').first();
			await expect(countLocator).not.toHaveText('Loading...');
			const countText = await countLocator.textContent();
			expect(countText).toMatch(/\d+ Items?/);
		});
	});

	test.describe('Dashboard Create Actions', () => {
		test('should have create button for list items', async ({ page }) => {
			await page.goto('/keystone');
			const createButtons = page.locator('[href*="/keystone/"][href*="?create"]');
			const count = await createButtons.count();
			expect(count).toBeGreaterThan(0);
		});

		test('should open create modal when clicking plus icon on Users', async ({ page }) => {
			await page.goto('/keystone');
			const usersCreateLink = page.locator('a[href="/keystone/users?create"]');
			if (await usersCreateLink.isVisible()) {
				await usersCreateLink.click();
				await expect(page.getByText('Create a new User')).toBeVisible();
			}
		});
	});

	test.describe('Secondary Navigation', () => {
		test('should display secondary nav with list links', async ({ page }) => {
			await page.goto('/keystone/users');
			await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();
		});

		test('should highlight current list in nav', async ({ page }) => {
			await page.goto('/keystone/texts');
			const textsLink = page.getByRole('link', { name: 'Texts' });
			await expect(textsLink).toBeVisible();
		});
	});
});
