import { test, expect } from '@playwright/test';
import { SigninPage, ListPage } from '../page-objects';

test.describe('App Navigation', () => {
	let signinPage: SigninPage;
	let listPage: ListPage;

	test.beforeEach(async ({ page }) => {
		signinPage = new SigninPage(page);
		listPage = new ListPage(page);

		await signinPage.goto();
		await signinPage.signinAsAdmin();
	});

	test.describe('Header Icons', () => {
		test('should display home/brand link', async ({ page }) => {
			const homeLink = page.locator('a[href="/keystone"]').first();
			await expect(homeLink).toBeVisible();
		});

		test('should display front page link', async ({ page }) => {
			const frontPageLink = page.locator('a[title*="Front page"], a[href="/"]:not([href="/keystone"])').first();
			await expect(frontPageLink).toBeVisible();
		});

		test('should display logout link', async ({ page }) => {
			const logoutLink = page.locator('a[title="Sign Out"], a[href*="signout"]').first();
			await expect(logoutLink).toBeVisible();
		});

		test('should navigate to home when clicking home link', async ({ page }) => {
			await listPage.goto('users');
			await page.waitForURL(/\/keystone\/users/);

			const homeLink = page.locator('a[href="/keystone"]').first();
			await homeLink.click();

			await expect(page).toHaveURL(/\/keystone\/?$/);
		});

		test('should navigate to front page when clicking front page link', async ({ page }) => {
			const frontPageLink = page.locator('a[title*="Front page"], a[href="/"]:not([href="/keystone"])').first();
			await frontPageLink.click();
			
			await expect(page).toHaveURL(/^http:\/\/[^/]+\/?$/);
		});

		test('should sign out when clicking logout link', async ({ page }) => {
			const logoutLink = page.locator('a[title="Sign Out"], a[href*="signout"]').first();
			await logoutLink.click();

			await expect(page).toHaveURL(/\/keystone\/signin/);
		});
	});

	test.describe('Dashboard Groups', () => {
		test('should display Access section', async ({ page }) => {
			await page.goto('/keystone');
			const accessGroup = page.locator('.dashboard-group__heading').filter({ hasText: 'Access' });
			await expect(accessGroup).toBeVisible();
		});

		test('should display Fields section', async ({ page }) => {
			await page.goto('/keystone');
			const fieldsGroup = page.locator('.dashboard-group__heading').filter({ hasText: 'Fields' });
			await expect(fieldsGroup).toBeVisible();
		});

		test('should display Miscs section', async ({ page }) => {
			await page.goto('/keystone');
			const miscsGroup = page.locator('.dashboard-group__heading').filter({ hasText: 'Miscs' });
			await expect(miscsGroup).toBeVisible();
		});
	});

	test.describe('List Links in Dashboard', () => {
		test('should show Users link in Access section', async ({ page }) => {
			await page.goto('/keystone');
			const usersLink = page.getByRole('link', { name: 'Users' });
			await expect(usersLink).toBeVisible();
		});

		test('should show Texts link in Fields section', async ({ page }) => {
			await page.goto('/keystone');
			const textsLink = page.getByRole('link', { name: 'Texts' });
			await expect(textsLink).toBeVisible();
		});

		test('should show Booleans link in Fields section', async ({ page }) => {
			await page.goto('/keystone');
			const booleansLink = page.getByRole('link', { name: 'Booleans' });
			await expect(booleansLink).toBeVisible();
		});

		test('should show Selects link in Fields section', async ({ page }) => {
			await page.goto('/keystone');
			const selectsLink = page.getByRole('link', { name: 'Selects' });
			await expect(selectsLink).toBeVisible();
		});

		test('should show Numbers link in Fields section', async ({ page }) => {
			await page.goto('/keystone');
			const numbersLink = page.getByRole('link', { name: 'Numbers' });
			await expect(numbersLink).toBeVisible();
		});

		test('should show Emails link in Fields section', async ({ page }) => {
			await page.goto('/keystone');
			const emailsLink = page.getByRole('link', { name: 'Emails' });
			await expect(emailsLink).toBeVisible();
		});

		test('should navigate to list when clicking link', async ({ page }) => {
			await page.goto('/keystone');
			await page.getByRole('link', { name: 'Texts' }).click();

			await expect(page).toHaveURL(/\/keystone\/texts/);
		});
	});

	test.describe('List Links in Miscs Section', () => {
		test('should show DependsOn list', async ({ page }) => {
			await page.goto('/keystone');
			const dependsOnLink = page.getByRole('link', { name: 'Depends Ons' });
			await expect(dependsOnLink).toBeVisible();
		});

		test('should show SourceRelationship list', async ({ page }) => {
			await page.goto('/keystone');
			const sourceRelLink = page.getByRole('link', { name: 'Source Relationships' });
			await expect(sourceRelLink).toBeVisible();
		});

		test('should show TargetRelationship list', async ({ page }) => {
			await page.goto('/keystone');
			const targetRelLink = page.getByRole('link', { name: 'Target Relationships' });
			await expect(targetRelLink).toBeVisible();
		});
	});

	test.describe('Cross-Section Navigation', () => {
		test('should navigate between different lists', async ({ page }) => {
			await page.goto('/keystone');

			await page.getByRole('link', { name: 'Users' }).first().click();
			await expect(page).toHaveURL(/\/keystone\/users/);

			await page.locator('a[href="/keystone"]').first().click();
			await expect(page).toHaveURL(/\/keystone\/?$/);

			await page.getByRole('link', { name: 'Texts' }).click();
			await expect(page).toHaveURL(/\/keystone\/texts/);

			await page.locator('a[href="/keystone"]').first().click();
			await expect(page).toHaveURL(/\/keystone\/?$/);
		});
	});
});
