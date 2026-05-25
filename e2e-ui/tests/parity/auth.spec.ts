/**
 * Parity spec: Auth — sign-in / sign-out (P4-30).
 *
 * Verifies that both admin legacy (/keystone) and admin next
 * (/keystone-next) show a sign-in form, accept valid credentials,
 * reject invalid credentials with an error message, and redirect to the
 * sign-in page after sign-out.
 *
 * Both UIs share the same Keystone session API
 * (POST /keystone-api/session/signin) and the same MongoDB.
 */

import { test, expect } from '@playwright/test';
import { AdminLegacyPOM } from '../../pages/admin-legacy/AdminLegacyPOM.js';
import { AdminNextPOM } from '../../pages/admin-next/AdminNextPOM.js';
import {
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from '../../fixtures/constants.js';
import { seedPostsAndEditors } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

test.describe('Parity: Auth — sign-in form visible', () => {
	test('adminLegacy: signin page renders email + password inputs', async ({ page }) => {
		const pom = new AdminLegacyPOM(page);
		await pom.gotoSignin();
		await pom.expectSigninFormVisible();
	});

	test('adminNext: signin page renders email + password inputs', async ({ page }) => {
		const pom = new AdminNextPOM(page);
		await pom.gotoSignin();
		await pom.expectSigninFormVisible();
	});
});

test.describe('Parity: Auth — valid credentials redirect to home', () => {
	test('adminLegacy: correct credentials land on /keystone/', async ({ page }) => {
		const pom = new AdminLegacyPOM(page);
		await pom.gotoSignin();
		const status = await pom.submitSignin(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
		expect(status).toBe(200);
		await pom.expectOnHome();
	});

	test('adminNext: correct credentials redirect to adminNext home', async ({ page }) => {
		const pom = new AdminNextPOM(page);
		await pom.gotoSignin();
		const status = await pom.submitSignin(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
		expect(status).toBe(200);
		await pom.expectOnHome();
	});
});

test.describe('Parity: Auth — invalid credentials show error', () => {
	test('adminLegacy: wrong password shows inline error message', async ({ page }) => {
		const pom = new AdminLegacyPOM(page);
		await pom.gotoSignin();
		const status = await pom.submitSignin(TEST_ADMIN_EMAIL, 'wrong-password');
		expect(status).toBe(401);
		await pom.expectSigninError();
		await pom.expectOnSignin();
	});

	test('adminNext: wrong password shows alert error message', async ({ page }) => {
		const pom = new AdminNextPOM(page);
		await pom.gotoSignin();
		const status = await pom.submitSignin(TEST_ADMIN_EMAIL, 'wrong-password');
		expect(status).toBe(401);
		await pom.expectSigninError();
		await pom.expectOnSignin();
	});
});

test.describe('Parity: Auth — invalid CSRF shows refresh guidance', () => {
	test('adminLegacy: stale CSRF token is rejected with refresh guidance', async ({ page }) => {
		const pom = new AdminLegacyPOM(page);
		await pom.gotoSignin();
		await page.evaluate(() => {
			const keystone = (window as typeof window & {
				Keystone?: { csrf?: { header?: Record<string, string> } };
			}).Keystone;
			const header = keystone?.csrf?.header;
			if (!header) throw new Error('Legacy CSRF header was not available');
			for (const key of Object.keys(header)) header[key] = 'invalid-csrf-token';
		});

		const status = await pom.submitSignin(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
		expect(status).toBe(403);
		await expect(page.getByText('Something went wrong; please refresh your browser and try again.')).toBeVisible();
		await pom.expectOnSignin();
	});

	test('adminNext: stale CSRF token is rejected with refresh guidance', async ({ page }) => {
		const pom = new AdminNextPOM(page);
		await pom.gotoSignin();
		await page.evaluate(() => {
			document.cookie = 'XSRF-TOKEN=invalid-csrf-token; path=/';
		});

		const status = await pom.submitSignin(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
		expect(status).toBe(403);
		await expect(page.getByRole('alert')).toContainText('Something went wrong; please refresh your browser and try again.');
		await pom.expectOnSignin();
	});
});

test.describe('Parity: Auth — sign-out redirects to signin', () => {
	test('adminLegacy: sign-out clears session and redirects to /keystone/signin', async ({
		page,
	}) => {
		const pom = new AdminLegacyPOM(page);
		await pom.gotoSignin();
		await pom.submitSignin(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
		await pom.signout();
		await pom.expectOnSignin();
	});

	test('adminNext: sign-out clears session and redirects to /keystone-next/signin', async ({
		page,
	}) => {
		const pom = new AdminNextPOM(page);
		await pom.gotoSignin();
		await pom.submitSignin(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
		await pom.signout();
		await pom.expectOnSignin();
		await expect(page).toHaveURL(/\/keystone-next\/signin/);
	});
});

test.describe('Parity: Auth — protected routes redirect anonymous users', () => {
	test('anonymous list deep links redirect to each signin page', async ({ page }) => {
		const legacy = new AdminLegacyPOM(page);
		await page.goto('/keystone/posts');
		await legacy.expectOnSignin();

		const next = new AdminNextPOM(page);
		await page.goto('/keystone-next/posts');
		await next.expectOnSignin();
	});

	test('anonymous item deep links redirect to each signin page', async ({ page }) => {
		const { postIds } = await seedPostsAndEditors();
		const postId = postIds[0]!;

		const legacy = new AdminLegacyPOM(page);
		await page.goto(`/keystone/posts/${postId}`);
		await legacy.expectOnSignin();

		const next = new AdminNextPOM(page);
		await page.goto(`/keystone-next/posts/${postId}`);
		await next.expectOnSignin();
	});
});
