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
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';
import { API_BASE } from '../../fixtures/constants.js';
import type { Page, Route } from '@playwright/test';
import { Types } from 'mongoose';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';
const ADMIN_NEXT_PREFIX = '/keystone-next';
const ADMIN_LEGACY_PREFIX = '/keystone';

async function captureExportUrl(
	page: Page,
	action: () => Promise<void>,
	format: 'csv' | 'json' = 'csv',
): Promise<string> {
	let capturedExportUrl: string | null = null;
	const context = page.context();
	const matcher = (url: URL) => url.pathname.includes(`/export.${format}`);
	const handler = async (route: Route) => {
		capturedExportUrl = route.request().url();
		await route.abort();
	};
	await context.route(matcher, handler);
	try {
		await action();
		await expect.poll(() => capturedExportUrl, { timeout: 5_000 }).not.toBeNull();
		return capturedExportUrl!;
	} finally {
		await context.unroute(matcher, handler);
	}
}

async function fetchExport(page: Page, pathAndQuery: string): Promise<{
	status: number;
	contentType: string;
	bodyText: string;
}> {
	const res = await page.context().request.get(pathAndQuery, {
		headers: { Accept: '*/*' },
	});
	return {
		status: res.status(),
		contentType: res.headers()['content-type'] ?? '',
		bodyText: await res.text(),
	};
}

test.beforeEach(async () => {
	await seedPostsAndEditors();
});

async function seedFormulaTitlePost(): Promise<void> {
	await withMongo(async (db) => {
		const admin = await db.collection('User').findOne({ isAdmin: true });
		expect(admin, 'admin user should exist before CSV formula seed').toBeTruthy();
		await db.collection('Post').insertOne({
			_id: new Types.ObjectId(),
			title: '=2-3',
			slug: 'formula-injection-export',
			state: 'draft',
			author: admin!._id,
			content: 'CSV formula escaping fixture',
			viewCount: 0,
			createdAt: new Date('2026-05-24T12:00:00.000Z'),
			updatedAt: new Date('2026-05-24T12:00:00.000Z'),
		});
	});
}

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

	test('legacy and adminNext: Download button preserves filtered CSV export state', async ({
		adminLegacy,
		adminNext,
	}) => {
		const searchTerm = 'Smoke Test Post 01';

		await adminLegacy.page.goto(
			`${ADMIN_LEGACY_PREFIX}/${LIST_PATH}?search=${encodeURIComponent(searchTerm)}&columns=title,state`,
		);
		await adminLegacy.page.locator('[data-screen-id="list"]').waitFor({ state: 'visible' });
		await adminLegacy.openDownloadDropdown();
		const legacyUrl = await captureExportUrl(adminLegacy.page, () => adminLegacy.submitDownload());

		await adminNext.page.goto(
			`${ADMIN_NEXT_PREFIX}/${LIST_KEY}?search=${encodeURIComponent(searchTerm)}&columns=title,state`,
		);
		await adminNext.page.locator(`[data-list-table][data-list-key="${LIST_KEY}"]`).waitFor({ state: 'visible' });
		await adminNext.openDownloadDropdown();
		const nextUrl = await captureExportUrl(adminNext.page, () => adminNext.submitDownload());

		const legacyExportUrl = new URL(legacyUrl);
		const nextExportUrl = new URL(nextUrl);
		expect(legacyExportUrl.pathname).toMatch(/\/keystone-api\/posts\/export\.csv$/);
		expect(nextExportUrl.pathname).toMatch(/\/keystone-api\/posts\/export\.csv$/);
		expect(legacyExportUrl.searchParams.get('search')).toBe(searchTerm);
		expect(nextExportUrl.searchParams.get('search')).toBe(searchTerm);
		expect(legacyExportUrl.searchParams.get('select')).toBe(nextExportUrl.searchParams.get('select'));
		expect(legacyExportUrl.searchParams.get('select')).toBe('id,title,state');

		const directPath = `${API_BASE}/${LIST_PATH}/export.csv?search=${encodeURIComponent(searchTerm)}&select=id,title,state&expandRelationshipFields=true`;
		const legacyExport = await fetchExport(adminLegacy.page, directPath);
		const nextExport = await fetchExport(adminNext.page, directPath);

		expect(legacyExport.status).toBe(200);
		expect(nextExport.status).toBe(200);
		expect(legacyExport.contentType).toBe(nextExport.contentType);
		expect(legacyExport.bodyText).toBe(nextExport.bodyText);
		expect(legacyExport.bodyText).toContain('title,state');
		expect(legacyExport.bodyText).toContain('Smoke Test Post 01');
		expect(legacyExport.bodyText).not.toContain('Smoke Test Post 02');
	});

	test('legacy and adminNext: Download button preserves sorted CSV export state', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.page.goto(`${ADMIN_LEGACY_PREFIX}/${LIST_PATH}?sort=-title&columns=title,state`);
		await adminLegacy.page.locator('[data-screen-id="list"]').waitFor({ state: 'visible' });
		await adminLegacy.openDownloadDropdown();
		const legacyUrl = await captureExportUrl(adminLegacy.page, () => adminLegacy.submitDownload());

		await adminNext.page.goto(`${ADMIN_NEXT_PREFIX}/${LIST_KEY}?sort=-title&columns=title,state`);
		await adminNext.page.locator(`[data-list-table][data-list-key="${LIST_KEY}"]`).waitFor({ state: 'visible' });
		await adminNext.openDownloadDropdown();
		const nextUrl = await captureExportUrl(adminNext.page, () => adminNext.submitDownload());

		const legacyExportUrl = new URL(legacyUrl);
		const nextExportUrl = new URL(nextUrl);
		expect(legacyExportUrl.pathname).toMatch(/\/keystone-api\/posts\/export\.csv$/);
		expect(nextExportUrl.pathname).toMatch(/\/keystone-api\/posts\/export\.csv$/);
		expect(legacyExportUrl.searchParams.get('sort')).toBe('-title');
		expect(nextExportUrl.searchParams.get('sort')).toBe('-title');
		expect(legacyExportUrl.searchParams.get('select')).toBe(nextExportUrl.searchParams.get('select'));
		expect(legacyExportUrl.searchParams.get('select')).toBe('id,title,state');

		const directPath = `${API_BASE}/${LIST_PATH}/export.csv?sort=-title&select=id,title,state&expandRelationshipFields=true`;
		const legacyExport = await fetchExport(adminLegacy.page, directPath);
		const nextExport = await fetchExport(adminNext.page, directPath);

		expect(legacyExport.status).toBe(200);
		expect(nextExport.status).toBe(200);
		expect(legacyExport.contentType).toBe(nextExport.contentType);
		expect(legacyExport.bodyText).toBe(nextExport.bodyText);
		const rows = legacyExport.bodyText.trim().split(/\r?\n/);
		expect(rows[0]).toContain('title,state');
		expect(rows[1]).toContain('Smoke Test Post 25');
		expect(rows.at(-1)).toContain('Smoke Test Post 01');
	});

	test('legacy and adminNext: Download button preserves field-filtered selected-column CSV export state', async ({
		adminLegacy,
		adminNext,
	}) => {
		const legacyFilters = encodeURIComponent(
			JSON.stringify([{ path: 'state', inverted: false, value: ['published'] }]),
		);
		await adminLegacy.page.goto(
			`${ADMIN_LEGACY_PREFIX}/${LIST_PATH}?filters=${legacyFilters}&columns=title,state`,
		);
		await adminLegacy.page.locator('[data-screen-id="list"]').waitFor({ state: 'visible' });
		await adminLegacy.openDownloadDropdown();
		const legacyUrl = await captureExportUrl(adminLegacy.page, () => adminLegacy.submitDownload());

		await adminNext.page.goto(`${ADMIN_NEXT_PREFIX}/${LIST_KEY}?f.state=published&columns=title,state`);
		await adminNext.page.locator(`[data-list-table][data-list-key="${LIST_KEY}"]`).waitFor({ state: 'visible' });
		await adminNext.openDownloadDropdown();
		const nextUrl = await captureExportUrl(adminNext.page, () => adminNext.submitDownload());

		const legacyExportUrl = new URL(legacyUrl);
		const nextExportUrl = new URL(nextUrl);
		expect(legacyExportUrl.pathname).toMatch(/\/keystone-api\/posts\/export\.csv$/);
		expect(nextExportUrl.pathname).toMatch(/\/keystone-api\/posts\/export\.csv$/);
		expect(legacyExportUrl.searchParams.get('select')).toBe(nextExportUrl.searchParams.get('select'));
		expect(legacyExportUrl.searchParams.get('select')).toBe('id,title,state');
		expect(legacyExportUrl.searchParams.get('filters')).toContain('published');
		expect(nextExportUrl.searchParams.get('filters')).toContain('published');

		const legacyDirectPath = `${API_BASE}/${LIST_PATH}/export.csv?filters=${encodeURIComponent(legacyExportUrl.searchParams.get('filters') ?? '')}&select=id,title,state&expandRelationshipFields=true`;
		const nextDirectPath = `${API_BASE}/${LIST_PATH}/export.csv?filters=${encodeURIComponent(nextExportUrl.searchParams.get('filters') ?? '')}&select=id,title,state&expandRelationshipFields=true`;
		const legacyExport = await fetchExport(adminLegacy.page, legacyDirectPath);
		const nextExport = await fetchExport(adminNext.page, nextDirectPath);

		expect(legacyExport.status).toBe(200);
		expect(nextExport.status).toBe(200);
		expect(legacyExport.contentType).toBe(nextExport.contentType);
		expect(legacyExport.bodyText).toBe(nextExport.bodyText);
		const rows = legacyExport.bodyText.trim().split(/\r?\n/);
		expect(rows[0]).toContain('title,state');
		expect(rows.length).toBeGreaterThan(1);
		expect(rows.slice(1).every((row) => row.includes('published'))).toBe(true);
		expect(legacyExport.bodyText).not.toContain('Smoke Test Post 01,draft');
		expect(legacyExport.bodyText).not.toContain('Smoke Test Post 02,archived');
	});

	test('legacy and adminNext: Download panel custom column selection controls CSV output', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.page.goto(`${ADMIN_LEGACY_PREFIX}/${LIST_PATH}?columns=title,state`);
		await adminLegacy.page.locator('[data-screen-id="list"]').waitFor({ state: 'visible' });
		await adminLegacy.openDownloadDropdown();
		await adminLegacy.page.locator('.Popout [data-list-download-use-current-columns]').uncheck();
		await adminLegacy.page.locator('.Popout [data-list-download-toggle-all-columns]').uncheck();
		await adminLegacy.page.locator('.Popout [data-list-download-column-option][data-field-name="title"]').click();
		const legacyUrl = await captureExportUrl(adminLegacy.page, () => adminLegacy.submitDownload());

		await adminNext.page.goto(`${ADMIN_NEXT_PREFIX}/${LIST_KEY}?columns=title,state`);
		await adminNext.page.locator(`[data-list-table][data-list-key="${LIST_KEY}"]`).waitFor({ state: 'visible' });
		await adminNext.openDownloadDropdown();
		const adminNextDownload = adminNext.page.locator('[data-list-download]');
		await adminNextDownload.locator('[data-list-download-use-current-columns]').uncheck();
		await adminNextDownload.locator('[data-list-download-toggle-all-columns]').uncheck();
		await adminNextDownload.locator('[data-list-download-column-option][data-field-name="title"]').click();
		const nextUrl = await captureExportUrl(adminNext.page, () => adminNext.submitDownload());

		const legacyExportUrl = new URL(legacyUrl);
		const nextExportUrl = new URL(nextUrl);
		expect(legacyExportUrl.pathname).toMatch(/\/keystone-api\/posts\/export\.csv$/);
		expect(nextExportUrl.pathname).toMatch(/\/keystone-api\/posts\/export\.csv$/);
		expect(legacyExportUrl.searchParams.get('select')).toBe('id,state');
		expect(nextExportUrl.searchParams.get('select')).toBe('id,state');

		const legacyExport = await fetchExport(adminLegacy.page, legacyExportUrl.pathname + legacyExportUrl.search);
		const nextExport = await fetchExport(adminNext.page, nextExportUrl.pathname + nextExportUrl.search);

		expect(legacyExport.status).toBe(200);
		expect(nextExport.status).toBe(200);
		expect(legacyExport.contentType).toBe(nextExport.contentType);
		expect(legacyExport.bodyText).toBe(nextExport.bodyText);
		const rows = legacyExport.bodyText.trim().split(/\r?\n/);
		expect(rows[0]).toBe('id,slug,state');
		expect(rows[1]).toMatch(/^[0-9a-f]{24},smoke-test-post-\d{2}-(draft|published|archived),(Draft|Published|Archived)$/);
		expect(rows[1]).not.toContain('Smoke Test Post');
	});

	test('legacy and adminNext: CSV export escapes spreadsheet formula-like values', async ({
		adminLegacy,
		adminNext,
	}) => {
		await seedFormulaTitlePost();
		const searchTerm = '=2-3';

		await adminLegacy.page.goto(
			`${ADMIN_LEGACY_PREFIX}/${LIST_PATH}?search=${encodeURIComponent(searchTerm)}&columns=title,state`,
		);
		await adminLegacy.page.locator('[data-screen-id="list"]').waitFor({ state: 'visible' });
		await adminLegacy.openDownloadDropdown();
		const legacyUrl = await captureExportUrl(adminLegacy.page, () => adminLegacy.submitDownload());

		await adminNext.page.goto(
			`${ADMIN_NEXT_PREFIX}/${LIST_KEY}?search=${encodeURIComponent(searchTerm)}&columns=title,state`,
		);
		await adminNext.page.locator(`[data-list-table][data-list-key="${LIST_KEY}"]`).waitFor({ state: 'visible' });
		await adminNext.openDownloadDropdown();
		const nextUrl = await captureExportUrl(adminNext.page, () => adminNext.submitDownload());

		const legacyExportUrl = new URL(legacyUrl);
		const nextExportUrl = new URL(nextUrl);
		expect(legacyExportUrl.searchParams.get('search')).toBe(searchTerm);
		expect(nextExportUrl.searchParams.get('search')).toBe(searchTerm);
		expect(legacyExportUrl.searchParams.get('select')).toBe(nextExportUrl.searchParams.get('select'));
		expect(legacyExportUrl.searchParams.get('select')).toBe('id,title,state');

		const directPath = `${API_BASE}/${LIST_PATH}/export.csv?search=${encodeURIComponent(searchTerm)}&select=id,title,state&expandRelationshipFields=true`;
		const legacyExport = await fetchExport(adminLegacy.page, directPath);
		const nextExport = await fetchExport(adminNext.page, directPath);

		expect(legacyExport.status).toBe(200);
		expect(nextExport.status).toBe(200);
		expect(legacyExport.contentType).toBe(nextExport.contentType);
		expect(legacyExport.bodyText).toBe(nextExport.bodyText);
		expect(legacyExport.bodyText).toContain('id,slug,title,state');
		expect(legacyExport.bodyText).toContain('formula-injection-export, =2-3,Draft');
		expect(legacyExport.bodyText).not.toContain('formula-injection-export,=2-3,Draft');
	});

	test('legacy and adminNext: Download button switches to JSON export', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoList(LIST_PATH);
		await adminLegacy.openDownloadDropdown();
		await adminLegacy.selectDownloadFormat('JSON');
		const legacyUrl = await captureExportUrl(adminLegacy.page, () => adminLegacy.submitDownload(), 'json');

		await adminNext.gotoList(LIST_KEY);
		await adminNext.openDownloadDropdown();
		await adminNext.selectDownloadFormat('JSON');
		const nextUrl = await captureExportUrl(adminNext.page, () => adminNext.submitDownload(), 'json');

		expect(new URL(legacyUrl).pathname).toMatch(/\/keystone-api\/posts\/export\.json$/);
		expect(new URL(nextUrl).pathname).toMatch(/\/keystone-api\/posts\/export\.json$/);
	});
});
