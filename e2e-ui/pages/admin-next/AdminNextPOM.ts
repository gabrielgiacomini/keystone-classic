/**
 * @file Page Object Model for the admin next Keystone admin UI.
 *
 * Mount path: /keystone-next  (when admin ui === 'both')
 *
 * Admin next is a React 18 SPA using TanStack Router. When Keystone
 * runs with `admin ui: 'both'`, `createAdminNextStaticRouter` mounts the built
 * bundle at /keystone-next and provides an SPA HTML5-history fallback.
 *
 * The bundle is served from /keystone-next in both-UI mode, and admin next links
 * preserve that base path while sharing the canonical /keystone-api router.
 *
 * Selector strategy: semantic role selectors and element structure
 * derived from admin/client-next/src/routes/. No CSS class selectors.
 */

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/** Route prefix for the admin next SPA. */
const ADMIN_NEXT_PREFIX = '/keystone-next';

/**
 * Shared canonical API prefix for both admin legacy and admin next.
 */
const API_PREFIX = '/keystone-api';

/** Page Object Model for the admin next Keystone admin UI. */
export class AdminNextPOM {
	readonly page: Page;
	readonly prefix: string;

	/**
	 * Creates a new AdminNextPOM instance.
	 * @param page - Playwright Page instance.
	 */
	constructor (page: Page) {
		this.page = page;
		this.prefix = ADMIN_NEXT_PREFIX;
	}

	// ---------------------------------------------------------------------------
	// Navigation
	// ---------------------------------------------------------------------------

	/** Navigate to the admin next home dashboard. Waits for counts XHR. */
	async gotoHome (): Promise<void> {
		const load = this.page.waitForResponse(
			(r) =>
				r.url().includes(`${API_PREFIX}/counts`) &&
				r.request().method() === 'GET',
		);
		await this.page.goto(this.prefix + '/');
		await load;
		// adminNext home renders dashboard cards once counts load.
		// Wait on the stable [data-dashboard-list] semantic hook (h1 is the
		// configured brand name, which is environment dependent).
		await this.page.locator('[data-dashboard-list]').first().waitFor({ state: 'visible' });
	}

	/**
	 * Navigate to a list view in adminNext.
	 * @param listKey - Keystone list key (e.g. "Post", "User").
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
		// adminNext list renders the table once data loads. The h1 now reads
		// "<count> <plural>" (e.g. "5 Posts") so we wait on the semantic
		// [data-list-table] hook keyed by list key.
		await this.page.locator(`[data-list-table][data-list-key="${listKey}"]`).waitFor({ state: 'visible' });
	}

	/**
	 * Navigate to an individual item edit page in adminNext.
	 * @param listKey - Keystone list key.
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
		// adminNext item edit renders the item id as the h1 and ships a
		// [data-item-form] container. Wait on the form so we know inputs are mounted.
		await this.page.locator('[data-item-form]').waitFor({ state: 'visible' });
	}

	// ---------------------------------------------------------------------------
	// Auth
	// ---------------------------------------------------------------------------

	/** Navigate to the adminNext signin page and wait for the email input. */
	async gotoSignin (): Promise<void> {
		await this.page.goto(`${this.prefix}/signin`);
		await this.page.locator('input#email').waitFor({ state: 'visible' });
	}

	/**
	 * Fill and submit the adminNext signin form.
	 * @param email - Account email.
	 * @param password - Account password.
	 * @returns HTTP status of the signin POST.
	 */
	async submitSignin (email: string, password: string): Promise<number> {
		await this.page.locator('input#email').fill(email);
		await this.page.locator('input#password').fill(password);
		const response = this.page.waitForResponse(
			(r) =>
				r.url().includes(`${API_PREFIX}/session/signin`) &&
				r.request().method() === 'POST',
		);
		await this.page.locator('button[type="submit"]').click();
		const res = await response;
		return res.status();
	}

	/** Navigate to the adminNext signout route. */
	async signout (): Promise<void> {
		await this.page.goto(`${this.prefix}/signout`);
	}

	// ---------------------------------------------------------------------------
	// Home dashboard
	// ---------------------------------------------------------------------------

	/**
	 * Read the list counts from the adminNext dashboard cards.
	 * The adminNext home renders cards with className containing "card" and a
	 * count paragraph inside each card.
	 * @returns A map of list key → count integer.
	 */
	async getListCounts (): Promise<Record<string, number>> {
		const cards = this.page.locator('[data-dashboard-list][data-list-path]');
		const count = await cards.count();
		const result: Record<string, number> = {};
		for (let i = 0; i < count; i++) {
			const card = cards.nth(i);
			const key = await card.getAttribute('data-list-path');
			if (!key) continue;
			const countText = await card.locator('[data-dashboard-list-count]').textContent();
			const num = parseInt(countText?.replace(/\D/g, '') ?? '0', 10);
			result[key] = num;
		}
		return result;
	}

	// ---------------------------------------------------------------------------
	// List view
	// ---------------------------------------------------------------------------

	/**
	 * Return the number of body rows in the adminNext list table.
	 * @returns Row count.
	 */
	async getRowCount (): Promise<number> {
		const rows = this.page.locator('[data-list-row][data-item-id]');
		await rows.first().waitFor({ state: 'attached' });
		return rows.count();
	}

	/**
	 * Return item ids from explicit row attributes in the table.
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
	 * Fill the search input and wait for the list to reload.
	 * @param query - Search string.
	 */
	async search (query: string): Promise<void> {
		const listKey = new URL(this.page.url()).pathname.split('/').filter(Boolean).at(-1);
		const load = this.page.waitForResponse(
			(r) => {
				const url = new URL(r.url());
				return r.request().method() === 'GET' &&
					r.status() === 200 &&
					listKey !== undefined &&
					url.pathname.includes(`${API_PREFIX}/${listKey}`) &&
					url.searchParams.get('search') === query;
			},
		);
		await this.page.locator('input[type="search"]').fill(query);
		await load;
	}

	// ---------------------------------------------------------------------------
	// Item edit
	// ---------------------------------------------------------------------------

	/**
	 * Get the current value of a field input.
	 * @param fieldPath - Field key name (e.g. "title").
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
	 * Fill a text field.
	 * @param fieldPath - Field key name.
	 * @param value - Value to type.
	 */
	async fillField (fieldPath: string, value: string): Promise<void> {
		await this.page
			.locator(`input[name="${fieldPath}"], textarea[name="${fieldPath}"]`)
			.first()
			.fill(value);
	}

	/**
	 * Click the adminNext Save button and wait for the update POST.
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

	// ---------------------------------------------------------------------------
	// Manage (bulk select / delete)
	// ---------------------------------------------------------------------------

	/**
	 * Enter Manage mode and select rows by their ids.
	 *
	 * Parity with admin legacy: the per-row select checkboxes only render
	 * when Manage mode is active, so we click the [data-list-management-toggle]
	 * button first.
	 * @param ids - Array of item ObjectId strings.
	 */
	async selectRows (ids: string[]): Promise<void> {
		const toggle = this.page.locator('[data-list-management-toggle]');
		await expect(toggle).toBeVisible();
		await toggle.click();
		for (const id of ids) {
			await this.page.locator(`[data-list-row-select][data-item-id="${id}"]`).check();
		}
		await expect(this.page.locator('[data-list-management-delete]')).toHaveAttribute(
			'data-list-management-selected-count',
			String(ids.length),
		);
	}

	/**
	 * Click the adminNext "Delete selected (N)" button and confirm.
	 */
	async bulkDelete (): Promise<void> {
		await this.page.locator('[data-list-management-delete]').click();
		const dialog = this.page.locator('[data-confirm-dialog]');
		await expect(dialog).toBeVisible();
		const deletePromise = this.page.waitForResponse(
			(r) =>
				r.url().includes(API_PREFIX) &&
				r.request().method() === 'POST',
		);
		await dialog.locator('[data-confirm-delete]').click();
		await deletePromise;
	}

	// ---------------------------------------------------------------------------
	// Create
	// ---------------------------------------------------------------------------

	/**
	 * Open the adminNext create modal (parity with legacy: triggered from the
	 * list view via `?create=true`), fill the initial title field, and submit.
	 * @param listKey - Keystone list key.
	 * @param titleValue - Value for the initial (title) field.
	 * @returns The HTTP status of the create POST.
	 */
	async createItem (listKey: string, titleValue: string): Promise<{ status: number; id: string }> {
		// Ensure we are on the list view so the modal can mount, then trigger the
		// modal via the shareable URL parameter (parity with legacy admin which
		// opens the create modal from the list view).
		await this.gotoList(listKey);
		await this.page.locator('[data-list-create]').click();
		const modal = this.page.locator('[data-create-item-modal]');
		await expect(modal).toBeVisible();

		// Initial field input is keyed by field path ("title" for Post). Fall
		// back to the first input inside the modal if the field path differs.
		const titleInput = modal.locator('input[name="title"]');
		if (await titleInput.count() > 0) {
			await expect(titleInput).toBeVisible();
			await titleInput.fill(titleValue);
			await expect(titleInput).toHaveValue(titleValue);
		} else {
			const firstInput = modal.locator('input:not([type="hidden"]), textarea').first();
			await expect(firstInput).toBeVisible();
			await firstInput.fill(titleValue);
			await expect(firstInput).toHaveValue(titleValue);
		}

		const createPromise = this.page.waitForResponse(
			(r) =>
				r.url().includes('/create') &&
				r.request().method() === 'POST',
		);
		await modal.locator('[data-create-item-submit]').click();
		const res = await createPromise;
		const body = (await res.json()) as { item?: { id?: string } };
		return { status: res.status(), id: body.item?.id ?? '' };
	}

	// ---------------------------------------------------------------------------
	// Assertions (convenience)
	// ---------------------------------------------------------------------------

	/** Assert that the adminNext signin form is visible. */
	async expectSigninFormVisible (): Promise<void> {
		await expect(this.page.locator('input#email')).toBeVisible();
		await expect(this.page.locator('input#password')).toBeVisible();
		// adminNext signin renders an sr-only "Keystone Sign In" h1 alongside
		// the visible brand wordmark column.
		await expect(this.page.locator('h1')).toHaveText(/Keystone Sign In/i);
	}

	/** Assert that the adminNext signin error alert is visible. */
	async expectSigninError (): Promise<void> {
		await expect(
			this.page.locator('[role="alert"]', {
				hasText: /(Invalid email or password|email and password)/i,
			}),
		).toBeVisible();
	}

	/** Assert that the user is on the adminNext home dashboard. */
	async expectOnHome (): Promise<void> {
		// Dashboard surfaces [data-dashboard-list] tiles once counts load.
		await expect(this.page.locator('[data-dashboard-list]').first()).toBeVisible();
	}

	/** Assert that the user is on the adminNext signin page. */
	async expectOnSignin (): Promise<void> {
		await expect(this.page).toHaveURL(/\/keystone-next\/signin(\?|$)/);
		await expect(this.page.locator('input#email')).toBeVisible();
	}
}
