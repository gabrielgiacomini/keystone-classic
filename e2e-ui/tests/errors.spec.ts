/**
 * Section G — Errors / regressions.
 *
 * Covers four cases:
 *   1. JSON API still returns 200 + the expected shape.
 *   2. Bogus list path renders the React-rendered "List not found" page.
 *   3. Bogus item id renders the "An unknown error has ocurred" page.
 *   4. Browsing home → posts → users emits no `[EXCEPTION]` console
 *      entries. Wired via `page.on('pageerror' / 'console')`.
 */

import { test, expect } from '../fixtures/auth.js';
import { seedPostsAndEditors } from '../fixtures/seed.js';
import { ADMIN_LEGACY_PATH, API_BASE } from '../fixtures/constants.js';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
	// Posts need to exist for navigation tests + the JSON API check.
	await seedPostsAndEditors();
});

test.describe('G. Errors', () => {
	test('JSON API: GET /keystone-api/posts?limit=2 returns 200 + JSON shape', async ({
		signedInPage,
	}) => {
		const page = signedInPage;
		// Use Playwright's request fixture pinned to the page's session.
		const res = await page.request.get(`${API_BASE}/posts?limit=2`);
		expect(res.status()).toBe(200);
		expect(res.headers()['content-type']).toMatch(/application\/json/);
		const body = (await res.json()) as { results?: unknown[]; count?: number };
		expect(Array.isArray(body.results)).toBe(true);
	});

	test('bogus list path renders the React "List not found" page', async ({
		signedInPage,
	}) => {
		const page = signedInPage;
		await page.goto(`/${ADMIN_LEGACY_PATH}/garbage-list`);
		await expect(page.getByText('List not found!')).toBeVisible();
		// "Go back home" link from the same React 404 component.
		await expect(page.getByText(/Go back home/i)).toBeVisible();
	});

	test('bogus item id under a real list renders the "unknown error" page', async ({
		signedInPage,
	}) => {
		const page = signedInPage;
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts/000000000000000000000000`);
		// Note: typo "ocurred" is in source — preserved in the assertion.
		await expect(
			page.getByText('An unknown error has ocurred, please refresh.'),
		).toBeVisible();
	});

	test('browsing home → posts → users emits no console exceptions', async ({
		signedInPage,
	}) => {
		const page = signedInPage;

		const consoleErrors: string[] = [];
		page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`);
		});

		// Home → wait for counts XHR.
		const counts = page.waitForResponse((r) =>
			r.url().includes(`${API_BASE}/counts`),
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}`);
		await counts;
		await expect(page.locator('[data-dashboard-list][data-list-path="users"]')).toBeVisible();

		// Posts list.
		const postsList = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts`)
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts`);
		await postsList;
		await expect(page.locator('table tbody tr').first()).toBeVisible();

		// Users list.
		const usersList = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/users`)
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}/users`);
		await usersList;
		await expect(page.locator('table tbody tr').first()).toBeVisible();

		expect(
			consoleErrors,
			`unexpected console output: ${consoleErrors.join(' | ')}`,
		).toHaveLength(0);
	});
});
