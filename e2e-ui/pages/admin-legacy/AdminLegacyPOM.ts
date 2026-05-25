/**
 * @file Page Object Model for the admin legacy Keystone admin UI.
 *
 * Mount path: /keystone  (when admin ui === 'legacy' or 'both')
 *
 * Selector strategy: data-* attributes and semantic role selectors
 * where they exist; text-content fallbacks for elements the legacy
 * React-15 UI doesn't annotate with data attributes. Brittle glamor
 * CSS class selectors are avoided.
 *
 * Admin legacy is a single-page React-15/Redux app. After initial
 * load the `Keystone` global is set by the EJS template; subsequent
 * navigation is client-side. We always wait for a network response
 * that signals data is loaded before asserting.
 */

import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

/** Route prefix for the admin legacy. */
const ADMIN_LEGACY_PREFIX = '/keystone';

/** Shared canonical API prefix for both admin clients. */
const API_PREFIX = '/keystone-api';

/** Page Object Model for the admin legacy Keystone admin UI. */
export class AdminLegacyPOM {
	readonly page: Page;
	readonly prefix: string;

	/**
	 * Creates a new AdminLegacyPOM instance.
	 * @param page - Playwright Page instance.
	 */
	constructor (page: Page) {
		this.page = page;
		this.prefix = ADMIN_LEGACY_PREFIX;
	}

	// ---------------------------------------------------------------------------
	// Navigation
	// ---------------------------------------------------------------------------

	/** Navigate to the admin home dashboard. Waits for counts XHR. */
	async gotoHome (): Promise<void> {
		const load = this.page.waitForResponse(
			(r) =>
				r.url().includes(`${API_PREFIX}/counts`) &&
				r.request().method() === 'GET',
		);
		await this.page.goto(this.prefix + '/');
		await load;
		// Dashboard container is rendered once React mounts.
		await this.page.locator('[data-screen-id="home"]').waitFor({ state: 'visible' });
	}

	/**
	 * Navigate to a list. Waits for the list data XHR.
	 * @param listKey - Keystone list path (e.g. "posts", "users").
	 */
	async gotoList (listKey: string): Promise<void> {
		const load = this.page.waitForResponse(
			(r) =>
				r.url().includes(`${API_PREFIX}/${listKey}`) &&
				r.request().method() === 'GET',
			{ timeout: 20_000 },
		);
		await this.page.goto(`${this.prefix}/${listKey}`);
		await load;
		await this.page.locator('[data-screen-id="list"]').waitFor({ state: 'visible' });
	}

	/**
	 * Navigate to an individual item edit page.
	 * @param listKey - Keystone list path.
	 * @param id - Item ObjectId string.
	 */
	async gotoItem (listKey: string, id: string): Promise<void> {
		const load = this.page.waitForResponse(
			(r) =>
				r.url().includes(`${API_PREFIX}/${listKey}/${id}`) &&
				r.request().method() === 'GET',
			{ timeout: 20_000 },
		);
		await this.page.goto(`${this.prefix}/${listKey}/${id}`);
		await load;
		await this.page.locator('[data-screen-id="item"]').waitFor({ state: 'visible' });
	}

	// ---------------------------------------------------------------------------
	// Auth
	// ---------------------------------------------------------------------------

	/** Navigate to the signin page and wait for the email input. */
	async gotoSignin (): Promise<void> {
		await this.page.goto(`${this.prefix}/signin`);
		await this.page.locator('input[name="email"]').waitFor({ state: 'visible' });
	}

	/**
	 * Fill and submit the signin form.
	 * @param email - Account email.
	 * @param password - Account password.
	 * @returns The HTTP status of the signin POST.
	 */
	async submitSignin (email: string, password: string): Promise<number> {
		await this.page.locator('input[name="email"]').fill(email);
		await this.page.locator('input[name="password"]').fill(password);
		const response = this.page.waitForResponse(
			(r) =>
				r.url().includes(`${API_PREFIX}/session/signin`) &&
				r.request().method() === 'POST',
		);
		await this.page.locator('button[type="submit"]').click();
		const res = await response;
		return res.status();
	}

	/** Navigate to the signout route. */
	async signout (): Promise<void> {
		await this.page.goto(`${this.prefix}/signout`);
	}

	// ---------------------------------------------------------------------------
	// Home dashboard
	// ---------------------------------------------------------------------------

	/**
	 * Read the list counts from the dashboard cards.
	 * @returns A map of list path → count integer.
	 */
	async getListCounts (): Promise<Record<string, number>> {
		const tiles: Locator = this.page.locator('[data-dashboard-list][data-list-path]');
		const count = await tiles.count();
		const result: Record<string, number> = {};
		for (let i = 0; i < count; i++) {
			const tile = tiles.nth(i);
			const path = await tile.getAttribute('data-list-path');
			if (!path) continue;
			const text = await tile.locator('[data-dashboard-list-count]').textContent();
			const num = parseInt(text?.replace(/\D/g, '') ?? '0', 10);
			result[path] = num;
		}
		return result;
	}

	// ---------------------------------------------------------------------------
	// List view
	// ---------------------------------------------------------------------------

	/**
	 * Return the number of body rows in the list table.
	 * @returns Row count.
	 */
	async getRowCount (): Promise<number> {
		const rows = this.page.locator('[data-list-row][data-item-id]');
		await rows.first().waitFor({ state: 'attached' });
		return rows.count();
	}

	/**
	 * Return item ids from explicit row attributes in the list table.
	 * @returns Array of item id strings.
	 */
	async getRowIds (): Promise<string[]> {
		const rows = this.page.locator('[data-list-row][data-item-id]');
		await rows.first().waitFor({ state: 'attached' });
		const count = await rows.count();
		const ids: string[] = [];
		for (let i = 0; i < count; i++) {
			const id = await rows.nth(i).getAttribute('data-item-id');
			if (id && /^[0-9a-f]{24}$/i.test(id)) {
				ids.push(id);
			}
		}
		return ids;
	}

	/**
	 * Return visible list column header labels, excluding row-control headers.
	 * @returns Array of column header text labels.
	 */
	async getColumnHeaders (): Promise<string[]> {
		const headers = this.page.locator('[data-list-table] thead th');
		await headers.first().waitFor({ state: 'attached' });
		return (await headers.allTextContents())
			.map((text) => text.trim())
			.filter(Boolean);
	}

	/** Open the list Columns dropdown. */
	async openColumnsDropdown (): Promise<void> {
		await this.page.locator('#listHeaderColumnButton').click();
		await this.page.locator('.Popout [data-list-column-option]').first().waitFor({
			state: 'visible',
		});
	}

	/**
	 * Toggle a column option in the legacy Columns dropdown.
	 * @param fieldPath - Field path to toggle.
	 */
	async toggleColumnOption (fieldPath: string): Promise<void> {
		await this.page.locator(`.Popout [data-list-column-option][data-field-name="${fieldPath}"]`).click();
	}

	/** Apply the pending legacy Columns dropdown selection. */
	async applyColumnsDropdown (): Promise<void> {
		await this.page.locator('.Popout').getByRole('button', { name: /^Apply$/ }).click();
	}

	/** Open the list Download dropdown. */
	async openDownloadDropdown (): Promise<void> {
		await this.page.locator('#listHeaderDownloadButton').click();
		await this.page.locator('.Popout .Popout__footer__button--primary').waitFor({ state: 'visible' });
	}

	/** Switch the legacy Download dropdown export format. */
	async selectDownloadFormat (format: 'CSV' | 'JSON'): Promise<void> {
		await this.page.locator('.Popout').getByRole('button', { name: new RegExp(`^${format}$`) }).click();
	}

	/** Submit the legacy Download dropdown. */
	async submitDownload (): Promise<void> {
		await this.page.locator('.Popout .Popout__footer__button--primary').click();
	}

	/**
	 * Read the list pagination/count summary text.
	 * @returns Visible pagination summary.
	 */
	async getPaginationSummary (): Promise<string> {
		const summary = this.page.locator('[data-list-pagination-summary]');
		await summary.waitFor({ state: 'visible' });
		return (await summary.textContent())?.trim() ?? '';
	}

	/**
	 * Select a list page by page number.
	 * @param pageNumber - Page number to select.
	 */
	async selectPage (pageNumber: number): Promise<void> {
		await this.page.locator(`[data-list-pagination] [data-list-page-button][data-page="${pageNumber}"]`).click();
	}

	/**
	 * Type into the list search input and wait for results to reload.
	 * @param query - Text to search for.
	 */
	async search (query: string): Promise<void> {
		const listPath = new URL(this.page.url()).pathname.split('/').filter(Boolean).at(-1);
		const load = this.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return r.request().method() === 'GET' &&
					r.status() === 200 &&
					listPath !== undefined &&
					url.pathname.includes(`${API_PREFIX}/${listPath}`) &&
					url.searchParams.get('search') === query;
			},
		);
		// The legacy search input is annotated data-search-input-field.
		await this.page.locator('[data-search-input-field]').fill(query);
		await load;
	}

	// ---------------------------------------------------------------------------
	// Item edit
	// ---------------------------------------------------------------------------

	/**
	 * Get the text value of a field input.
	 * @param fieldPath - Input name attribute (e.g. "title").
	 * @returns Current input value string.
	 */
	async getFieldValue (fieldPath: string): Promise<string> {
		return (
			(await this.page
				.locator(`input[name="${fieldPath}"], textarea[name="${fieldPath}"]`)
				.first()
				.inputValue()) ?? ''
		);
	}

	/**
	 * Fill a text/textarea field.
	 * @param fieldPath - Input name attribute.
	 * @param value - Value to type.
	 */
	async fillField (fieldPath: string, value: string): Promise<void> {
		await this.page
			.locator(`input[name="${fieldPath}"], textarea[name="${fieldPath}"]`)
			.first()
			.fill(value);
	}

	/**
	 * Click the Save button and wait for the POST to complete.
	 */
	async saveItem (): Promise<void> {
		const save = this.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes(API_PREFIX) &&
				r.status() === 200,
		);
		await this.page.getByRole('button', { name: /^Save$/ }).click();
		await save;
	}

	/**
	 * Delete the current item from the item edit footer and wait for the
	 * list redirect.
	 * @returns HTTP status of the delete POST.
	 */
	async deleteCurrentItem (): Promise<number> {
		await this.page.locator('[data-button="delete"]').evaluate((button: HTMLElement) => button.click());
		const dialog = this.page.locator('[data-confirm-dialog]');
		await expect(dialog).toBeVisible();
		const deletePromise = this.page.waitForResponse(
			(r) =>
				r.url().includes('/delete') &&
				r.request().method() === 'POST',
		);
		await dialog.locator('[data-confirm-delete]').click();
		const res = await deletePromise;
		await this.page.locator('[data-screen-id="list"]').waitFor({ state: 'visible' });
		return res.status();
	}

	// ---------------------------------------------------------------------------
	// Manage (bulk select / delete)
	// ---------------------------------------------------------------------------

	/**
	 * Enter manage mode and select the rows at the given ids.
	 * @param ids - Array of item ObjectId strings.
	 */
	async selectRows (ids: string[]): Promise<void> {
		await this.page.locator('[data-list-management-toggle]').click();
		for (const id of ids) {
			await this.page
				.locator(`[data-list-row][data-item-id="${id}"] [data-list-row-select]`)
				.click();
		}
		await expect(this.page.locator('[data-list-management-selected-count]')).toHaveText(
			new RegExp(`^\\s*${ids.length}\\s+selected\\s*$`, 'i'),
		);
	}

	/**
	 * Click the toolbar Delete button and confirm the dialog.
	 * Waits for the delete POST to complete.
	 */
	async bulkDelete (): Promise<void> {
		const deleteButton = this.page.locator('[data-list-management-delete]');
		await expect(deleteButton).toBeVisible();
		await deleteButton.click();
		const dialog = this.page.locator('[data-screen-id="modal-dialog"]');
		await expect(dialog).toBeVisible();
		const deletePromise = this.page.waitForResponse(
			(r) =>
				r.url().includes('/delete') &&
				r.request().method() === 'POST',
		);
		await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
		await deletePromise;
	}

	// ---------------------------------------------------------------------------
	// Create
	// ---------------------------------------------------------------------------

	/**
	 * Open the create modal for the given singular list label, fill the
	 * title field, and submit.
	 * @param singularLabel - e.g. "Post", "User".
	 * @param titleValue - Value to type in the title input.
	 * @returns HTTP status of the create POST.
	 */
	async createItem (singularLabel: string, titleValue: string): Promise<{ status: number; id: string }> {
		await this.page.getByRole('button', { name: new RegExp(`Create ${singularLabel}`, 'i') }).click();
		const titleInput = this.page
			.locator('input[name="title"], input[id="title"]')
			.first();
		await expect(titleInput).toBeVisible();
		await titleInput.fill(titleValue);

		const createPromise = this.page.waitForResponse(
			(r) =>
				r.url().includes('/create') &&
				r.request().method() === 'POST',
		);
		await this.page.getByRole('button', { name: 'Create', exact: true }).click();
		const res = await createPromise;
		const body = (await res.json()) as { id?: string };
		return { status: res.status(), id: body.id ?? '' };
	}

	// ---------------------------------------------------------------------------
	// Assertions (convenience)
	// ---------------------------------------------------------------------------

	/** Assert that the signin form is visible. */
	async expectSigninFormVisible (): Promise<void> {
		await expect(this.page.locator('input[name="email"]')).toBeVisible();
		await expect(this.page.locator('input[name="password"]')).toBeVisible();
	}

	/** Assert that the signin error message is visible. */
	async expectSigninError (): Promise<void> {
		await expect(
			this.page.getByText(/The email and password you entered are not valid\./i),
		).toBeVisible();
	}

	/** Assert that the user is on the home dashboard. */
	async expectOnHome (): Promise<void> {
		await expect(this.page).toHaveURL(new RegExp(`${this.prefix}/?$`));
		await expect(this.page.locator('[data-screen-id="home"]')).toBeVisible();
	}

	/** Assert that the user is on the signin page. */
	async expectOnSignin (): Promise<void> {
		await expect(this.page).toHaveURL(new RegExp(`${this.prefix}/signin(\\?|$)`));
	}
}
