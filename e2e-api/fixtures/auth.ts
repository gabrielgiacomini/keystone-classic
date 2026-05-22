/**
 * Authentication fixtures.
 *
 * Provides two Playwright fixtures via `test.extend`:
 *   - `signedInRequest`: an `APIRequestContext` that has already POSTed
 *     to `/keystone-api/session/signin` as the seeded admin user. Use
 *     it for any spec that needs to hit a list-create / item-update
 *     endpoint.
 *   - `anonRequest`: the raw, never-signed-in request context (alias
 *     for the built-in `request` fixture). Convenient to make the
 *     intent explicit at the call site.
 */

import {
	test as base,
	request as playwrightRequest,
} from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import {
	API_BASE,
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from './server.js';

interface AuthFixtures {
	anonRequest: APIRequestContext;
	signedInRequest: APIRequestContext;
}

export const test = base.extend<AuthFixtures>({
	anonRequest: async ({ request }, use) => {
		await use(request);
	},
	signedInRequest: async ({ playwright, baseURL }, use) => {
		const ctx = await playwrightRequest.newContext({
			baseURL,
			extraHTTPHeaders: { Accept: 'application/json' },
		});
		const res = await ctx.post(`${API_BASE}/session/signin`, {
			data: {
				email: TEST_ADMIN_EMAIL,
				password: TEST_ADMIN_PASSWORD,
			},
		});
		if (!res.ok()) {
			const body = await res.text();
			await ctx.dispose();
			throw new Error(`signedInRequest signin failed: ${res.status()} ${body}`);
		}
		try {
			await use(ctx);
		} finally {
			await ctx.dispose();
		}
		// Hint: `playwright` is referenced only to keep the fixture
		// resolution graph honest — Playwright wires it in for us.
		void playwright;
	},
});

export { expect } from '@playwright/test';
