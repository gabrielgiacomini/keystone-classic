import { type Page, type Locator, expect } from '@playwright/test';

export class DashboardPage {
	readonly page: Page;
	readonly header: Locator;
	readonly navBar: Locator;
	readonly signoutLink: Locator;
	readonly signedInAs: Locator;

	constructor(page: Page) {
		this.page = page;
		this.header = page.locator('header');
		this.navBar = page.locator('nav').first();
		this.signoutLink = page.locator('a[href="/keystone/signout"]');
		this.signedInAs = page.locator('text=Signed in as');
	}

	async goto() {
		await this.page.goto('/keystone/');
	}

	async expectToBeOnDashboard() {
		await expect(this.page).toHaveURL(/\/keystone\/?$/);
		await expect(this.signedInAs).toBeVisible();
	}

	async getListCard(listName: string): Promise<Locator> {
		return this.page.locator(`a[href="/keystone/${listName}"]`).first();
	}

	async navigateToList(listName: string) {
		const card = await this.getListCard(listName);
		await card.click();
		await this.page.waitForURL(`**/keystone/${listName}`);
	}

	async getListItemCount(listName: string): Promise<string> {
		const card = this.page.locator(`a[href="/keystone/${listName}"]`).first();
		const countText = await card.locator('div').last().textContent();
		return countText || '0';
	}

	async signout() {
		await this.signoutLink.click();
		await this.page.waitForSelector('button:has-text("Sign In")');
	}

	async clickNavGroup(groupName: string) {
		await this.page.getByRole('link', { name: groupName }).click();
	}

	async openCreateModal(listName: string) {
		const createButton = this.page.locator(`a[href="/keystone/${listName}?create"]`);
		await createButton.click();
	}
}
