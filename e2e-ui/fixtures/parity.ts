/**
 * @file Parity test fixtures for P4-30.
 *
 * Provides `adminLegacy` and `adminNext` fixtures (Page Object Models) so parity specs
 * can drive both UIs in the same test without boilerplate. Each fixture
 * owns its own isolated `BrowserContext` + `Page` so cookie state does
 * not leak between the two UIs.
 *
 * Usage:
 *   import { test, expect } from '../../fixtures/parity.js';
 *   test('parity', async ({ adminLegacy, adminNext }) => { ... });
 */

import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';
import { AdminLegacyPOM } from '../pages/admin-legacy/AdminLegacyPOM.js';
import { AdminNextPOM } from '../pages/admin-next/AdminNextPOM.js';
import {
	API_BASE,
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from './constants.js';

interface ParityFixtures {
	/** Authenticated admin legacy POM (admin legacy at /keystone). */
	adminLegacy: AdminLegacyPOM;
	/** Authenticated admin next POM (admin next at /keystone-next). */
	adminNext: AdminNextPOM;
}

/**
 * Sign in as the seeded admin via the API session endpoint (faster than
 * driving the form). Returns the cookie header value.
 * @param context - Browser context that should receive the session cookies.
 * @param baseURL - Base URL for the Keystone test server.
 */
async function getSessionCookie (
	context: BrowserContext,
	baseURL: string,
): Promise<void> {
	await context.request.get(`${baseURL}${API_BASE}/session`, {
		headers: { Accept: 'application/json' },
	});
	const xsrfToken = (await context.cookies(`${baseURL}${API_BASE}`))
		.find((cookie) => cookie.name === 'XSRF-TOKEN')?.value ?? '';
	const res = await context.request.post(`${baseURL}${API_BASE}/session/signin`, {
		data: { email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD },
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-xsrf-token': xsrfToken,
		},
	});
	if (!res.ok()) {
		throw new Error(
			`parity fixture: signin failed ${res.status()} ${await res.text()}`,
		);
	}
}

export const test = base.extend<ParityFixtures>({
	adminLegacy: async ({ browser, baseURL }, use) => {
		const url = baseURL ?? 'http://127.0.0.1:3008';
		const ctx: BrowserContext = await browser.newContext({ baseURL: url });
		await getSessionCookie(ctx, url);
		const page: Page = await ctx.newPage();
		const pom = new AdminLegacyPOM(page);
		try {
			await use(pom);
		} finally {
			await ctx.close();
		}
	},

	adminNext: async ({ browser, baseURL }, use) => {
		const url = baseURL ?? 'http://127.0.0.1:3008';
		const ctx: BrowserContext = await browser.newContext({ baseURL: url });
		await getSessionCookie(ctx, url);
		const page: Page = await ctx.newPage();
		const pom = new AdminNextPOM(page);
		try {
			await use(pom);
		} finally {
			await ctx.close();
		}
	},
});

export { expect };
