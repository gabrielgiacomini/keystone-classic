import { type Page, type Locator, expect } from '@playwright/test';

export class SigninPage {
	readonly page: Page;
	readonly form: Locator;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly signInButton: Locator;
	readonly logo: Locator;
	readonly errorMessage: Locator;

	constructor(page: Page) {
		this.page = page;
		this.form = page.getByTestId('signin-form');
		this.emailInput = page.getByTestId('signin-email-input');
		this.passwordInput = page.getByTestId('signin-password-input');
		this.signInButton = page.getByTestId('signin-submit-button');
		this.logo = page.locator('.auth-box__col--logo');
		this.errorMessage = page.locator('.Alert--danger');
	}

	async goto() {
		await this.page.goto('/keystone/signin');
	}

	async signin(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.signInButton.click();
	}

	async signinAsAdmin() {
		await this.signin('user@test.e2e', 'test');
		await this.page.waitForURL(/\/keystone(?!\/signin)/);
		await this.page.waitForLoadState('networkidle');
	}

	async expectToBeOnSigninPage() {
		await expect(this.page).toHaveURL(/\/keystone\/signin/);
		await expect(this.signInButton).toBeVisible();
	}

	async expectErrorMessage(message?: string) {
		await expect(this.errorMessage).toBeVisible();
		if (message) {
			await expect(this.errorMessage).toContainText(message);
		}
	}
}
