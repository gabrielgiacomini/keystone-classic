import { type Page, type Locator, expect } from '@playwright/test';

export class ListPage {
	readonly page: Page;
	readonly tableWrapper: Locator;
	readonly table: Locator;
	readonly searchInput: Locator;
	readonly searchClearButton: Locator;
	readonly filterButton: Locator;
	readonly columnsButton: Locator;
	readonly downloadButton: Locator;
	readonly createButton: Locator;
	readonly manageButton: Locator;
	readonly itemCount: Locator;
	readonly filterPopout: Locator;
	readonly activeFilters: Locator;

	constructor(page: Page) {
		this.page = page;
		this.tableWrapper = page.getByTestId('list-table-wrapper');
		this.table = page.getByTestId('list-table');
		this.searchInput = page.getByTestId('list-search-input');
		this.searchClearButton = page.getByTestId('list-search-clear');
		this.filterButton = page.getByTestId('list-filter-button');
		this.columnsButton = page.getByTestId('list-columns-button');
		this.downloadButton = page.getByRole('button', { name: 'Download' });
		this.createButton = page.getByTestId('list-create-button');
		this.manageButton = page.getByRole('button', { name: 'Manage' });
		this.itemCount = page.locator('text=/Showing \\d+ /');
		this.filterPopout = page.locator('.Popout');
		this.activeFilters = page.locator('[id^="activeFilter__"]');
	}

	async goto(listName: string) {
		await this.page.goto(`/keystone/${listName}`);
	}

	async expectToBeOnListPage(listName: string) {
		await expect(this.page).toHaveURL(new RegExp(`/keystone/${listName}`));
	}

	async search(query: string) {
		await this.searchInput.fill(query);
		await this.searchInput.press('Enter');
	}

	async clearSearch() {
		await this.searchClearButton.click();
	}

	async openFilterDropdown() {
		await this.filterButton.click();
	}

	async selectFilter(filterName: string) {
		await this.openFilterDropdown();
		await this.page.getByRole('button', { name: filterName }).click();
	}

	async openColumnsDropdown() {
		await this.columnsButton.click();
	}

	async toggleColumn(columnName: string) {
		await this.openColumnsDropdown();
		await this.page.getByRole('button', { name: columnName }).click();
	}

	async openCreateModal() {
		await this.createButton.waitFor({ state: 'visible', timeout: 10000 });
		await this.createButton.click();
	}

	async getTableRows(): Promise<Locator> {
		await this.table.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
		return this.table.locator('tbody tr');
	}

	async getRowCount(): Promise<number> {
		try {
			await this.table.waitFor({ state: 'visible', timeout: 5000 });
			const rows = await this.getTableRows();
			return await rows.count();
		} catch {
			return 0;
		}
	}

	async getRowById(itemId: string): Promise<Locator> {
		return this.page.getByTestId(`list-row-${itemId}`);
	}

	async clickRow(index: number) {
		const rows = await this.getTableRows();
		const row = rows.nth(index);
		const link = row.locator('a').first();
		await link.click();
	}

	async clickRowById(itemId: string) {
		const row = await this.getRowById(itemId);
		const link = row.locator('a').first();
		await link.click();
	}

	async clickRowByName(name: string) {
		await this.page.waitForLoadState('networkidle');
		await this.table.waitFor({ state: 'visible', timeout: 10000 });
		await this.table.getByRole('link', { name }).click();
	}

	async getColumnHeaders(): Promise<string[]> {
		try {
			await this.table.waitFor({ state: 'visible', timeout: 5000 });
			const headers = this.table.locator('th');
			const count = await headers.count();
			const headerTexts: string[] = [];
			for (let i = 0; i < count; i++) {
				const text = await headers.nth(i).textContent();
				if (text) headerTexts.push(text.trim());
			}
			return headerTexts;
		} catch {
			return [];
		}
	}

	async sortByColumn(columnPath: string) {
		await this.page.getByTestId(`list-sort-${columnPath}`).click();
	}

	async getColumnHeader(columnPath: string): Promise<Locator> {
		return this.page.getByTestId(`list-header-${columnPath}`);
	}

	// ========== FILTER METHODS ==========

	/**
	 * Apply a text filter with specified mode
	 */
	async applyTextFilter(fieldLabel: string, value: string, mode: 'contains' | 'exactly' | 'beginsWith' | 'endsWith' = 'contains') {
		await this.openFilterDropdown();
		await this.page.locator('.PopoutList__item').filter({ hasText: fieldLabel }).click();
		await this.page.waitForTimeout(500);

		if (mode !== 'contains') {
			await this.page.locator('.Popout select').selectOption(mode);
		}

		const modeLabels: Record<string, string> = {
			'contains': 'contains',
			'exactly': 'exactly',
			'beginsWith': 'begins with',
			'endsWith': 'ends with'
		};
		const placeholder = `${fieldLabel} ${modeLabels[mode]}...`;
		await this.page.getByPlaceholder(placeholder).fill(value);
		await this.page.getByRole('button', { name: 'Apply' }).click();
		await this.page.waitForTimeout(500);
	}

	/**
	 * Apply a boolean filter
	 */
	async applyBooleanFilter(fieldLabel: string, isChecked: boolean) {
		await this.openFilterDropdown();
		await this.page.locator('.PopoutList__item').filter({ hasText: fieldLabel }).click();
		await this.page.waitForTimeout(300);

		const option = isChecked ? 'Is Checked' : 'Is NOT Checked';
		await this.page.locator('.Popout__body').getByRole('button', { name: option, exact: true }).click();
		await this.page.getByRole('button', { name: 'Apply' }).click();
		await this.page.waitForTimeout(500);
	}

	/**
	 * Apply a select filter
	 */
	async applySelectFilter(fieldLabel: string, optionLabel: string) {
		await this.openFilterDropdown();
		await this.page.getByRole('button', { name: fieldLabel }).click();
		await this.page.waitForTimeout(300);

		await this.page.locator('.PopoutList__item').filter({ hasText: optionLabel }).click();
		await this.page.getByRole('button', { name: 'Apply' }).click();
		await this.page.waitForTimeout(500);
	}

	/**
	 * Apply a number filter
	 */
	async applyNumberFilter(fieldLabel: string, value: string, mode: 'equals' | 'gt' | 'lt' | 'between' = 'equals') {
		await this.openFilterDropdown();
		await this.page.locator('.PopoutList__item').filter({ hasText: fieldLabel }).click();
		await this.page.waitForTimeout(300);

		if (mode !== 'equals') {
			await this.page.locator('.FormSelect').selectOption(mode);
		}

		await this.page.locator('.Popout__body').locator('input[type="number"], .FormInput').last().fill(value);
		await this.page.getByRole('button', { name: 'Apply' }).click();
		await this.page.waitForTimeout(500);
	}

	/**
	 * Get count of active filters
	 */
	async getActiveFilterCount(): Promise<number> {
		return await this.activeFilters.count();
	}

	/**
	 * Clear a specific filter by field path
	 */
	async clearFilter(fieldPath: string) {
		const filter = this.page.locator(`#activeFilter__${fieldPath}`);
		const clearButton = filter.locator('button').last();
		await clearButton.click();
		await this.page.waitForTimeout(500);
	}

	/**
	 * Clear all active filters
	 */
	async clearAllFilters() {
		await this.page.keyboard.press('Escape');
		await this.page.waitForTimeout(300);

		const count = await this.getActiveFilterCount();
		for (let i = count - 1; i >= 0; i--) {
			const clearButton = this.activeFilters.nth(i).locator('button').last();
			await clearButton.click();
			await this.page.waitForTimeout(500);
		}
	}

	/**
	 * Check if a filter is active
	 */
	async hasActiveFilter(fieldPath: string): Promise<boolean> {
		const filter = this.page.locator(`#activeFilter__${fieldPath}`);
		return await filter.isVisible();
	}

	/**
	 * Get active filter label text
	 */
	async getActiveFilterLabel(fieldPath: string): Promise<string> {
		const filter = this.page.locator(`#activeFilter__${fieldPath}`);
		return await filter.textContent() || '';
	}

	// ========== BULK OPERATIONS ==========

	/**
	 * Select/deselect a row by index (checkbox)
	 */
	async toggleRowSelection(index: number) {
		const rows = await this.getTableRows();
		const checkbox = rows.nth(index).locator('input[type="checkbox"]');
		await checkbox.click();
	}

	/**
	 * Select all rows
	 */
	async selectAllRows() {
		const selectAllCheckbox = this.table.locator('thead input[type="checkbox"]');
		await selectAllCheckbox.click();
	}

	/**
	 * Get count of selected rows
	 */
	async getSelectedRowCount(): Promise<number> {
		const checkedBoxes = this.table.locator('tbody input[type="checkbox"]:checked');
		return await checkedBoxes.count();
	}

	/**
	 * Click bulk delete button (appears after selecting rows)
	 */
	async clickBulkDelete() {
		await this.page.getByRole('button', { name: /delete/i }).click();
	}

	/**
	 * Confirm bulk delete in modal
	 */
	async confirmBulkDelete() {
		await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
		await this.page.waitForTimeout(500);
	}

	// ========== COLUMN VISIBILITY ==========

	/**
	 * Check if a column is visible in the table
	 */
	async isColumnVisible(columnName: string): Promise<boolean> {
		const headers = await this.getColumnHeaders();
		return headers.includes(columnName);
	}

	/**
	 * Toggle column visibility in dropdown
	 */
	async toggleColumnVisibility(columnName: string) {
		await this.openColumnsDropdown();
		await this.page.locator('.PopoutList__item').filter({ hasText: columnName }).click();
		await this.page.keyboard.press('Escape');
		await this.page.waitForTimeout(300);
	}
}
