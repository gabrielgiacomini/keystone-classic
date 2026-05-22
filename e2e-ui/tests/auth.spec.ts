/**
 * Section A — Auth.
 *
 * Translates the manual smoke-runbook section A into deterministic
 * specs. Drives the actual signin form (not the JSON API endpoint)
 * because we want to verify that:
 *   - `/keystone` redirects to `/keystone/signin` when anonymous,
 *   - the signin form posts correctly and the session cookie auths
 *     subsequent navigations,
 *   - wrong-password renders the inline error,
 *   - sign-out clears the session.
 */

import { test, expect } from '@playwright/test';
import { signInViaForm } from '../fixtures/auth.js';
import { resetWithoutPosts } from '../fixtures/seed.js';
import {
	API_BASE,
	ADMIN_LEGACY_PATH,
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from '../fixtures/constants.js';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
	// `resetWithoutPosts` wipes any state the previous spec file left
	// behind. Auth specs don't need posts.
	await resetWithoutPosts();
});

test.describe('A. Auth', () => {
	test('anonymous /keystone redirects to /keystone/signin', async ({ page }) => {
		await page.goto(`/${ADMIN_LEGACY_PATH}`);
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/signin(\\?|$)`));
		// Signin form is mounted by signin.js into #signin-view; wait
		// for the email input to ensure React hydration finished before
		// returning.
		await expect(page.locator('input[name="email"]')).toBeVisible();
	});

	test('wrong password shows inline error and stays on signin', async ({ page }) => {
		await page.goto(`/${ADMIN_LEGACY_PATH}/signin`);
		await page.locator('input[name="email"]').fill(TEST_ADMIN_EMAIL);
		await page.locator('input[name="password"]').fill('definitely-not-the-password');
		const failed = page.waitForResponse(
			(r) =>
				(
					r.url().includes(`${API_BASE}/session/signin`)
					|| r.url().includes(`/${ADMIN_LEGACY_PATH}/api/session/signin`)
				) &&
				r.request().method() === 'POST',
		);
		await page.locator('button[type="submit"]').click();
		const res = await failed;
		expect(res.status()).toBe(401);
		// Inline error string from admin/client-legacy/Signin/Signin.mjs.
		await expect(
			page.getByText('The email and password you entered are not valid.'),
		).toBeVisible();
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/signin(\\?|$)`));
	});

	test('correct credentials sign in and land on /keystone/', async ({ page }) => {
		await signInViaForm(page);
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/?$`));
		// The footer renders "Signed in as <FirstName> <LastName>" once
		// the home screen mounts. The seeded admin is "Test Admin".
		await expect(page.getByText('Signed in as')).toBeVisible();
		await expect(page.getByText('Test Admin')).toBeVisible();
	});

	test('signed-in nav: /keystone/posts and /keystone/ both render without re-auth', async ({ page }) => {
		await signInViaForm(page);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts`);
		// Wait for either the List view header or the empty-state — either
		// is fine, the point is that we did NOT bounce to /signin.
		await expect(page).not.toHaveURL(/\/signin(\?|$)/);
		await page.goto(`/${ADMIN_LEGACY_PATH}`);
		await expect(page).not.toHaveURL(/\/signin(\?|$)/);
	});

	test('sign-out clears the session and re-redirects /keystone to /keystone/signin', async ({ page }) => {
		await signInViaForm(page);
		// The sign-out flow is a GET to `/keystone/signout` that the legacy
		// app links to from the primary-nav signout icon. Hit it directly
		// (more reliable than depending on icon hover state).
		await page.goto(`/${ADMIN_LEGACY_PATH}/signout`);
		// signout.mjs redirects to /signin?signedout.
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/signin\\?signedout`));

		// Now navigate to /keystone again — should redirect back to
		// signin with `from=...`. (The exact `from` value is a query
		// param; we assert on shape, not exact string.)
		await page.goto(`/${ADMIN_LEGACY_PATH}`);
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/signin(\\?|$)`));
	});

	// Sanity check we can sign in twice in a row with the original
	// password — guards against residual session state leaking across
	// tests in this file.
	test('re-signin with the original password works', async ({ page }) => {
		await signInViaForm(page, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/?$`));
	});
});
