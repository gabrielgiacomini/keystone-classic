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
