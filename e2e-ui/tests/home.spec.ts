/**
 * Section B — Home dashboard.
 *
 * Verifies the per-list count cards on `/keystone` match the live Mongo
 * counts. The home screen lazy-loads counts via `/keystone-api/counts`
 * after first render — we wait on that response, not on a fixed timer.
 */

import { test, expect } from '../fixtures/auth.js';
import { seedPostsAndEditors, withMongo } from '../fixtures/seed.js';
import { ADMIN_LEGACY_PATH, API_BASE } from '../fixtures/constants.js';

test.describe.configure({ mode: 'serial' });

let expectedUserCount = 0;
let expectedPostCount = 0;

test.beforeAll(async () => {
	// Re-seed before this spec runs. `seedPostsAndEditors` wipes
	// non-admin data first, so we don't carry state over from
	// previous specs. After it runs, expect 3 users (admin + alice +
	// bob) and 25 posts.
	await seedPostsAndEditors();
	const counts = await withMongo(async (db) => {
		return {
			users: await db.collection('User').countDocuments(),
			posts: await db.collection('Post').countDocuments(),
		};
	});
	expectedUserCount = counts.users;
	expectedPostCount = counts.posts;
});

test.describe('B. Home dashboard', () => {
	test('count cards match live Mongo counts', async ({ signedInPage }) => {
		const page = signedInPage;
		// Wait for the counts XHR to land before asserting on the
		// rendered count text — without this the tile shows a spinner
		// and our assertion races React's first paint.
		const countsResponse = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/counts`)
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}`);
		await countsResponse;

		// The cards expose list identity directly; the inner manage link also
		// carries list metadata, so use the card-level contract here.
		const userTile = page.locator('[data-dashboard-list][data-list-path="users"]');
		const postTile = page.locator('[data-dashboard-list][data-list-path="posts"]');
		await expect(userTile).toBeVisible();
		await expect(postTile).toBeVisible();

		// Match against the user/post counts we read from Mongo. The
		// tile renders "<Label><Count> Items" with no separator between
		// label and count, so we anchor on the count + "Items?" suffix.
		const expectedUserText = new RegExp(`(?:^|\\D)${expectedUserCount}\\s*Items?\\b`);
		const expectedPostText = new RegExp(`(?:^|\\D)${expectedPostCount}\\s*Items?\\b`);
		await expect(userTile).toContainText(expectedUserText);
		await expect(postTile).toContainText(expectedPostText);
	});

	test('home page reports zero console errors on load', async ({ signedInPage }) => {
		const page = signedInPage;
		const consoleErrors: string[] = [];
		page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`);
		});

		const countsResponse = page.waitForResponse(
			(r) => r.url().includes(`${API_BASE}/counts`),
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}`);
		await countsResponse;

		// Allow tiny grace for late console messages from any micro-tasks
		// kicked off by the counts response handler. We're NOT polling on
		// the message itself — we're polling on the locator below, which
		// is what gates the assertion.
		await expect(page.locator('[data-dashboard-list][data-list-path="users"]')).toBeVisible();

		expect(
			consoleErrors,
			`unexpected console errors: ${consoleErrors.join(' | ')}`,
		).toHaveLength(0);
	});
});
