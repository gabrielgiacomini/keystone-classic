/**
 * Auth specs — signin success/failure and signout via the
 * `/keystone-api/session/*` endpoints.
 */

import { test, expect } from '../fixtures/auth.js';
import { resetDb } from '../fixtures/seedDb.js';
import { getSession, signin, signout } from '../helpers/api.js';
import { API_BASE, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from '../fixtures/server.js';

test.beforeAll(async ({ request }) => {
	await resetDb(request);
});

test.describe('session API', () => {
	test('GET /api/session returns { user: undefined } when signed out', async ({
		anonRequest,
	}) => {
		const res = await getSession(anonRequest);
		expect(res.status()).toBe(200);
		const body = (await res.json()) as { user?: unknown };
		expect(body.user).toBeFalsy();
	});

	test('legacy /keystone/api/session alias remains available during migration', async ({
		anonRequest,
	}) => {
		const res = await anonRequest.get('/keystone/api/session');
		expect(res.status()).toBe(200);
		const body = (await res.json()) as { user?: unknown };
		expect(body.user).toBeFalsy();
	});

	test('signin with correct credentials returns success and a session cookie', async ({
		playwright,
		baseURL,
	}) => {
		const ctx = await playwright.request.newContext({ baseURL });
		try {
			const res = await signin(ctx, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
			expect(res.status()).toBe(200);
			const body = (await res.json()) as { success?: boolean; user?: { email?: string } };
			expect(body.success).toBe(true);
			expect(body.user?.email).toBe(TEST_ADMIN_EMAIL);

			// Session cookie should be attached to the request context now.
			const session = await getSession(ctx);
			const sessionBody = (await session.json()) as { user?: { email?: string } };
			expect(sessionBody.user?.email).toBe(TEST_ADMIN_EMAIL);
		} finally {
			await ctx.dispose();
		}
	});

	test('signin with wrong password returns 401', async ({ anonRequest }) => {
		const res = await signin(anonRequest, TEST_ADMIN_EMAIL, 'definitely-not-the-password');
		expect(res.status()).toBe(401);
		const body = (await res.json()) as { error?: string };
		expect(body.error).toBe('invalid details');
	});

	test('signin with missing fields returns 401', async ({ anonRequest }) => {
		const res = await anonRequest.post(`${API_BASE}/session/signin`, {
			data: { email: TEST_ADMIN_EMAIL },
		});
		expect(res.status()).toBe(401);
		const body = (await res.json()) as { error?: string };
		expect(body.error).toBe('email and password required');
	});

	test('signout clears the session', async ({ playwright, baseURL }) => {
		const ctx = await playwright.request.newContext({ baseURL });
		try {
			await signin(ctx, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
			const out = await signout(ctx);
			expect(out.status()).toBe(200);
			const outBody = (await out.json()) as { success?: boolean };
			expect(outBody.success).toBe(true);

			const after = await getSession(ctx);
			const afterBody = (await after.json()) as { user?: unknown };
			expect(afterBody.user).toBeFalsy();
		} finally {
			await ctx.dispose();
		}
	});
});
