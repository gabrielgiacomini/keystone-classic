/**
 * @file Browser-auth fixtures for the UI suite.
 *
 * Exposes a `signedInPage` test fixture that lands on a page already
 * authenticated as the seeded admin. Implementation: a one-shot
 * browser-context `storageState` that signs in via the actual signin
 * form (so the CSRF + session bootstrap is exercised end-to-end at
 * least once per worker), then snapshots the cookie set for downstream
 * tests.
 *
 * Why drive the form rather than POST to `/api/session/signin` from
 * the request fixture: section A of the smoke runbook explicitly
 * tests that the form works. The other specs assume "I'm signed in";
 * doing the signin via the form here means the storageState we hand
 * out matches what a real user's browser would have.
 */

import { test as base, expect, type Page } from '@playwright/test';
import {
	API_BASE,
	ADMIN_LEGACY_PATH,
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from './constants.js';

interface AuthFixtures {
	/** A `Page` that has already signed in as the seeded admin. */
	signedInPage: Page;
}

/**
 * Submit the admin legacy signin form on an open page and wait for
 * the post-signin redirect to land on `/keystone/`. Throws if the
 * signin response was not 200 OK.
 * @param page - Playwright page (typically not yet authenticated).
 * @param email - Account email; defaults to seeded admin.
 * @param password - Account password; defaults to seeded admin fixture password.
 */
export async function signInViaForm (
	page: Page,
	email: string = TEST_ADMIN_EMAIL,
	password: string = TEST_ADMIN_PASSWORD,
): Promise<void> {
	await page.goto(`/${ADMIN_LEGACY_PATH}/signin`);
	await page.locator('input[name="email"]').fill(email);
	await page.locator('input[name="password"]').fill(password);
	const signinResponse = page.waitForResponse(
		(r) =>
			(
				r.url().includes(`${API_BASE}/session/signin`)
				|| r.url().includes(`/${ADMIN_LEGACY_PATH}/api/session/signin`)
			)
			&& r.request().method() === 'POST',
	);
	await page.locator('button[type="submit"]').click();
	const res = await signinResponse;
	expect(res.status(), 'signin POST should return 200').toBe(200);
	// The signin success handler does a client-side redirect via
	// `redirect: keystone.get('signin redirect')` which defaults to
	// the admin home. Wait for that nav to settle before handing the
	// page back to the test.
	await page.waitForURL((url) => {
		const p = url.pathname.replace(/\/$/, '');
		return (
			p === `/${ADMIN_LEGACY_PATH}` || p.startsWith(`/${ADMIN_LEGACY_PATH}/`)
				? !p.endsWith('/signin')
				: false
		);
	});
}

export const test = base.extend<AuthFixtures>({
	signedInPage: async ({ page }, use) => {
		await signInViaForm(page);
		await use(page);
	},
});

export { expect } from '@playwright/test';
