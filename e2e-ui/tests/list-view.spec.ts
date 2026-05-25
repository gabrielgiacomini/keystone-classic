/**
 * Section C — List view (`/keystone/posts`).
 *
 * Covers search, sort, state filter, and bulk-delete. Each test
 * navigates to a fresh URL so the React-Redux store starts clean —
 * the list-screen's filter/search state lives in the URL, so URL =
 * source of truth.
 *
 * Why we wait on `/keystone-api/posts` GETs rather than a fixed
 * timeout: the runbook describes a "5 second loading dots" delay.
 * That's not a feature, it's the time the list takes to fetch its
 * data. The right wait is the response that ends the load.
 */

import type * as playwright from '@playwright/test';
import { test, expect } from '../fixtures/auth.js';
import { seedPostsAndEditors, withMongo } from '../fixtures/seed.js';
import { ADMIN_LEGACY_PATH, API_BASE } from '../fixtures/constants.js';

test.describe.configure({ mode: 'serial', timeout: 60_000 });

test.beforeAll(async () => {
	await seedPostsAndEditors();
});

/**
 * Wait for the list-data XHR that ends the loading-dots state.
 * Returns a promise of the response — caller awaits it AFTER
 * triggering the navigation/filter change.
 * @param page - Signed-in admin page on the legacy list UI.
 * @returns Promise that settles when the posts list GET completes with HTTP 200.
 */
function waitForListLoad (page: playwright.Page) {
	return page.waitForResponse(
		(r) =>
			r.url().includes(`${API_BASE}/posts`)
			// Match GET (initial list fetch) — exclude POSTs to /create or /:id.
			&& r.request().method() === 'GET'
			&& r.status() === 200,
	);
}

test.describe('C. List view', () => {
	test('search filters the table to one row', async ({ signedInPage }) => {
		const page = signedInPage;
		const load = waitForListLoad(page);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts?search=Post+07`);
		await load;
		// Search-result count text (legacy renders this both as the h2
		// title and in the list toolbar).
		await expect(page.getByRole('heading', { name: /Showing\s+1\s+Post/i })).toBeVisible();
		// Exactly one body row in the items table.
		const rows = page.locator('table tbody tr');
		await expect(rows).toHaveCount(1);
		await expect(rows.first()).toContainText('Smoke Test Post 07');
	});

	test('sort=-publishedAt orders by published descending', async ({ signedInPage }) => {
		const page = signedInPage;
		const load = waitForListLoad(page);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts?sort=-publishedAt`);
		await load;
		// "25 Posts sorted by published at (descending)" — the suffix
		// is rendered conditionally on the sort key.
		await expect(page.getByText(/sorted by published at \(descending\)/i)).toBeVisible();
		// First row is the most-recently-published post in the fixture
		// set. STATES = [draft, published, archived]; STATES[i%3] for
		// i=1..25 makes 'published' fall at i ∈ {1,4,7,10,13,16,19,22,25}.
		// publishedAt = SEED_REFERENCE_DATE − i*day, so smallest `i`
		// (i=1) is the most recent → row 1 = Post 01.
		const firstRow = page.locator('table tbody tr').first();
		await expect(firstRow).toContainText('Smoke Test Post 01');
	});

	test('state=published filter narrows result count to 9', async ({ signedInPage }) => {
		const page = signedInPage;
		// Direct URL navigation — avoids the dropdown-clicking flake.
		// The runbook step describes the dropdown click sequence; we
		// cover the equivalent end state. (URL shape includes JSON whose
		// property order isn't guaranteed; assert on count and chip.)
		const load = waitForListLoad(page);
		const filtersJson = encodeURIComponent(
			JSON.stringify([{ path: 'state', inverted: false, value: ['published'] }]),
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts?filters=${filtersJson}`);
		await load;
		// Of 25 seeded posts, those with state==='published' are i where
		// i%3===2 → i ∈ {2,5,8,11,14,17,20,23} → 8 posts.
		// (STATES = ['draft', 'published', 'archived'], i%3 indexes:
		//  i=1 'published', i=2 'archived', i=3 'draft' — wait, i%3:
		//  i=1 →1 →'published'; i=2 →2 →'archived'; i=3 →0 →'draft'; ...)
		// So published comes at i ∈ {1,4,7,10,13,16,19,22,25} → 9 posts.
		await expect(page.getByRole('heading', { name: /Showing\s+9\s+Posts/i })).toBeVisible();
		await expect(page.locator('table tbody tr')).toHaveCount(9);
	});

	test('bulk delete removes two posts', async ({ signedInPage }) => {
		const page = signedInPage;
		const before = await withMongo((db) => db.collection('Post').countDocuments());

		const load = waitForListLoad(page);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts`);
		await load;

		// Enter manage mode.
		await page.locator('button', { hasText: /^Manage$/ }).click();
		// Once manage mode is on, each row gets a leading checkbox cell
		// rendered as a button. Click the first button in the last two
		// rows. This mirrors the helper from the runbook section C step 4.
		await page.evaluate(() => {
			const rows = Array.from(
				document.querySelectorAll('table tbody tr'),
			).slice(-2);
			for (const tr of rows) {
				const btn = tr.querySelector('button');
				if (btn) (btn as HTMLButtonElement).click();
			}
		});
		// Confirm the manage toolbar shows "2 selected" before opening
		// the confirm dialog.
		await expect(page.getByText(/2\s+selected/i)).toBeVisible();

		// Click the toolbar Delete button. The GlyphButton from
		// elemental renders with `alt="delete"` (matches `actionButtons`
		// in ListManagement.mjs).
		await page.locator('button[alt="delete"]').click();

		// Confirmation dialog body text.
		await expect(
			page.getByText(/Are you sure you want to delete 2 posts/i),
		).toBeVisible();

		// The dialog's confirm button is the only button labelled
		// exactly "Delete" (no glyph, no accessible name suffix). The
		// toolbar's Delete button has its label prefixed by a glyph
		// (` Delete` with a leading space), so an exact regex match
		// uniquely picks the modal button.
		const modalDelete = page.getByRole('button', { name: 'Delete', exact: true });
		await expect(modalDelete).toBeVisible();

		const deletePromise = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts/delete`)
				&& r.request().method() === 'POST',
		);
		await modalDelete.click();
		const deleteResponse = await deletePromise;
		expect(deleteResponse.status()).toBe(200);

		// Confirm Mongo count dropped by exactly 2.
		const after = await withMongo((db) => db.collection('Post').countDocuments());
		expect(after).toBe(before - 2);
	});
});
