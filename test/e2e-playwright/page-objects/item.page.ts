import { type Page, type Locator, expect } from '@playwright/test';

export class ItemPage {
	readonly page: Page;
	readonly editForm: Locator;
	readonly saveButton: Locator;
	readonly resetButton: Locator;
	readonly deleteButton: Locator;
	readonly backToListLink: Locator;
	readonly itemTitle: Locator;
	readonly createNewButton: Locator;
	readonly successAlert: Locator;
	readonly errorAlert: Locator;

	constructor(page: Page) {
		this.page = page;
		this.editForm = page.getByTestId('edit-form');
		this.saveButton = page.getByTestId('item-save-button');
		this.resetButton = page.getByTestId('item-reset-button');
		this.deleteButton = page.getByTestId('item-delete-button');
		this.backToListLink = page.locator('a:has-text("← ")').first();
		this.itemTitle = page.locator('.EditForm__name-field h2, .item-name-field').first();
		this.createNewButton = page.locator('button:has-text("New")');
		this.successAlert = page.locator('.Alert--success');
		this.errorAlert = page.locator('.Alert--danger');
	}

	async goto(listName: string, itemId: string) {
		await this.page.goto(`/keystone/${listName}/${itemId}`);
	}

	async expectToBeOnItemPage() {
		await expect(this.editForm).toBeVisible();
		await expect(this.page).toHaveURL(/\/keystone\/[^/]+\/[a-f0-9]+/);
	}

	async getTitle(): Promise<string> {
		return await this.itemTitle.textContent() || '';
	}

	async fillField(fieldName: string, value: string) {
		const field = this.page.locator(`[name="${fieldName}"], [placeholder="${fieldName}"]`).first();
		await field.fill(value);
	}

	async fillTextInput(label: string, value: string) {
		const labelElement = this.page.locator(`text=${label}`).first();
		const input = labelElement.locator('..').locator('input, textarea').first();
		await input.fill(value);
	}

	async getFieldByPath(path: string): Promise<Locator> {
		return this.page.locator(`[data-field-path="${path}"], [name="${path}"]`).first();
	}

	async toggleCheckbox(label: string) {
		const checkbox = this.page.locator(`button:near(:text("${label}"))`).first();
		await checkbox.click();
	}

	async save() {
		await this.saveButton.click();
	}

	async reset() {
		await this.resetButton.click();
	}

	async confirmReset() {
		await this.page.getByRole('button', { name: 'Reset', exact: true }).click();
	}

	async delete() {
		await this.deleteButton.click();
	}

	async confirmDelete() {
		await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
	}

	async goBackToList() {
		await this.backToListLink.click();
	}

	async expectFieldValue(fieldName: string, expectedValue: string) {
		const field = this.page.locator(`input[name="${fieldName}"]`).first();
		await expect(field).toHaveValue(expectedValue);
	}

	async expectSuccessMessage(message?: string) {
		await expect(this.successAlert).toBeVisible();
		if (message) {
			await expect(this.successAlert).toContainText(message);
		}
	}

	async expectErrorMessage(message?: string) {
		await expect(this.errorAlert).toBeVisible();
		if (message) {
			await expect(this.errorAlert).toContainText(message);
		}
	}

	async getRelatedItemsList(listPath: string): Promise<Locator> {
		return this.page.getByTestId(`related-items-${listPath}`);
	}

	async expectRelatedItemsVisible(listPath: string) {
		const relatedItems = await this.getRelatedItemsList(listPath);
		await expect(relatedItems).toBeVisible();
	}

	async getRelatedItemsCount(listPath: string): Promise<number> {
		const relatedItems = await this.getRelatedItemsList(listPath);
		const rows = relatedItems.locator('tbody tr');
		return await rows.count();
	}
}
