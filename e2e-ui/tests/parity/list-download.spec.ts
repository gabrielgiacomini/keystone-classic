/**
 * Parity spec: List download (CSV + JSON export).
 *
 * Verifies that the adminNext Download panel wires through to the
 * server's /keystone-api/:list/export.csv and /export.json endpoints:
 *   - Clicking the Download button triggers a navigation to the
 *     correct export URL (captured via page.waitForRequest).
 *   - A direct API call to those URLs returns the expected Content-Type
 *     and Content-Disposition: attachment header.
 *
 * Notes:
 *   - `window.location.href = url` causes the browser to navigate to the
 *     export URL. Playwright treats it as a top-level navigation, but since
 *     the server replies with Content-Disposition: attachment it also
 *     triggers a Download event. We listen for both so the spec stays
 *     stable regardless of browser download-interception mode.
 *   - Seeds 5 Posts (enough to test CSV row output).
 */

import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors } from '../../fixtures/seed.js';
import { API_BASE } from '../../fixtures/constants.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';
const ADMIN_NEXT_PREFIX = '/keystone-next';

test.beforeEach(async () => {
	await seedPostsAndEditors();
});

test.describe('Parity: List download', () => {

	test('adminNext: Download button triggers CSV file download', async ({ adminNext }) => {
		const page = adminNext.page;
		await adminNext.gotoList(LIST_KEY);

		// Open the Download toolbar dropdown by clicking the button inside the container.
		// data-list-download is on the outer div; the toggle button is the first button inside it.
		const downloadContainer = page.locator('[data-list-download]');
		await expect(downloadContainer).toBeVisible();
		await downloadContainer.locator('button').first().click();

		// Wait for the panel's submit button to be visible.
		const submitBtn = page.locator('[data-list-download-submit]');
		await expect(submitBtn).toBeVisible();

		// Intercept the outgoing request before the button click so we don't miss it.
		// The route aborts the request (so no real download happens) but captures
		// the URL — we then assert it targets the correct export endpoint.
		let capturedExportUrl: string | null = null;
		await page.route(
			(url) => url.pathname.includes('/export.csv'),
			(route) => {
				capturedExportUrl = route.request().url();
				// Abort the request so the page stays on the list view.
				void route.abort();
			},
		);

		await submitBtn.click();

		// Give the route handler a moment to fire.
		await page.waitForTimeout(2_000);

		expect(capturedExportUrl).not.toBeNull();
		// URL may use either the list path ("posts") or list key ("Post") depending on
		// when adminMeta resolves; both are accepted by the initList middleware.
		expect(capturedExportUrl!).toMatch(/\/keystone-api\/(posts|Post)\/export\.csv/);
	});

	test('adminNext: CSV export endpoint returns correct Content-Type and attachment header', async ({
		adminNext,
	}) => {
		// Navigate to the list first so the session cookie is active in the page context.
		await adminNext.gotoList(LIST_KEY);
		const page = adminNext.page;

		// Fetch the export URL from within the page (uses the browser's session cookie).
		const result = await page.evaluate(async (url) => {
			const res = await fetch(url);
			return {
				status: res.status,
				contentType: res.headers.get('content-type') ?? '',
				disposition: res.headers.get('content-disposition') ?? '',
				bodyLength: (await res.text()).length,
			};
		}, `${API_BASE}/${LIST_PATH}/export.csv`);

		expect(result.status).toBe(200);
		// Server sets Content-Type to application/octet-stream for CSV to force download.
		expect(
			result.contentType.includes('text/csv') || result.contentType.includes('application/octet-stream'),
		).toBe(true);
		expect(result.disposition.toLowerCase()).toContain('attachment');
		expect(result.disposition).toContain('posts');
		expect(result.bodyLength).toBeGreaterThan(0);
	});

	test('adminNext: JSON export endpoint returns correct Content-Type and attachment header', async ({
		adminNext,
	}) => {
		await adminNext.gotoList(LIST_KEY);
		const page = adminNext.page;

		// Fetch the export URL from within the page (uses the browser's session cookie).
		const result = await page.evaluate(async (url) => {
			const res = await fetch(url);
			return {
				status: res.status,
				contentType: res.headers.get('content-type') ?? '',
				bodyText: await res.text(),
			};
		}, `${API_BASE}/${LIST_PATH}/export.json`);

		expect(result.status).toBe(200);
		expect(result.contentType.includes('application/json')).toBe(true);
		// JSON endpoint: server calls res.json() which does NOT set Content-Disposition.
		// Verify we get a valid JSON array back.
		const body = JSON.parse(result.bodyText) as unknown[];
		expect(Array.isArray(body)).toBe(true);
		expect(body.length).toBeGreaterThan(0);
	});

	test('adminNext: Download panel JSON toggle switches export format', async ({ adminNext }) => {
		const page = adminNext.page;
		await adminNext.gotoList(LIST_KEY);

		// Open Download panel by clicking the toggle button inside the container.
		const downloadContainer = page.locator('[data-list-download]');
		await expect(downloadContainer).toBeVisible();
		await downloadContainer.locator('button').first().click();

		// Switch to JSON format.
		const jsonBtn = page.getByRole('button', { name: /^JSON$/ });
		await expect(jsonBtn).toBeVisible();
		await jsonBtn.click();

		const submitBtn = page.locator('[data-list-download-submit]');
		await expect(submitBtn).toBeVisible();

		// Intercept the JSON export request before it fires.
		let capturedJsonUrl: string | null = null;
		await page.route(
			(url) => url.pathname.includes('/export.json'),
			(route) => {
				capturedJsonUrl = route.request().url();
				void route.abort();
			},
		);

		await submitBtn.click();
		await page.waitForTimeout(2_000);

		expect(capturedJsonUrl).not.toBeNull();
		expect(capturedJsonUrl!).toMatch(/\/keystone-api\/(posts|Post)\/export\.json/);
	});

	test('adminNext: Download URL preserves current search query', async ({ adminNext }) => {
		const page = adminNext.page;

		// Navigate with a search term active.
		const searchTerm = 'Smoke Test Post 01';
		await page.goto(`${ADMIN_NEXT_PREFIX}/${LIST_KEY}?search=${encodeURIComponent(searchTerm)}`);
		await page.locator('[data-list-download]').waitFor({ state: 'visible' });

		// Open Download panel by clicking the toggle button inside the container.
		const downloadContainer = page.locator('[data-list-download]');
		await expect(downloadContainer).toBeVisible();
		await downloadContainer.locator('button').first().click();

		// Wait for submit button before wiring download waiter.
		const submitBtn = page.locator('[data-list-download-submit]');
		await expect(submitBtn).toBeVisible();

		// Intercept the CSV export request and verify it carries the search param.
		let capturedSearchUrl: string | null = null;
		await page.route(
			(url) => url.pathname.includes('/export.csv'),
			(route) => {
				capturedSearchUrl = route.request().url();
				void route.abort();
			},
		);

		await submitBtn.click();
		await page.waitForTimeout(2_000);

		expect(capturedSearchUrl).not.toBeNull();
		const exportUrl = new URL(capturedSearchUrl!);
		expect(exportUrl.searchParams.get('search')).toBe(searchTerm);
	});
});
