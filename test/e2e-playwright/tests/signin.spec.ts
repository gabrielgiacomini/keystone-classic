import { test, expect } from '@playwright/test';
import { SigninPage, DashboardPage } from '../page-objects';

test.describe('Sign In', () => {
	let signinPage: SigninPage;
	let dashboardPage: DashboardPage;

	test.beforeEach(async ({ page }) => {
		signinPage = new SigninPage(page);
		dashboardPage = new DashboardPage(page);
	});

	test('should display signin page', async () => {
		await signinPage.goto();
		await signinPage.expectToBeOnSigninPage();
	});

	test('should sign in with valid credentials', async () => {
		await signinPage.goto();
		await signinPage.signinAsAdmin();
		await dashboardPage.expectToBeOnDashboard();
	});

	test('should show error with invalid credentials', async ({ page }) => {
		await signinPage.goto();
		await signinPage.signin('invalid@email.com', 'wrongpassword');
		await expect(page).toHaveURL(/\/keystone\/signin/);
	});

	test('should redirect to signin when accessing protected page', async ({ page }) => {
		await page.goto('/keystone/users');
		await expect(page).toHaveURL(/\/keystone\/signin/);
	});

	test('should sign out successfully', async ({ page }) => {
		await signinPage.goto();
		await signinPage.signinAsAdmin();
		await dashboardPage.expectToBeOnDashboard();
		await dashboardPage.signout();
		await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
	});
});
