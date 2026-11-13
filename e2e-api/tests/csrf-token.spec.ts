/**
 * CSRF token specs — signin and signout regenerate the session, which drops
 * its CSRF secret, so each response has to hand the client the token of the
 * new session in the `XSRF-TOKEN` cookie. Without it, the first write after
 * signing in is refused until the client fetches `GET /session`.
 *
 * These run against the second server of `playwright.config.ts`, the one
 * that enforces CSRF (the main server runs with DISABLE_CSRF=true).
 */

import { test, expect } from '@playwright/test';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { ADMIN_LEGACY_PATH, API_BASE, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from '../fixtures/server.js';

const XSRF_COOKIE = 'XSRF-TOKEN';
const XSRF_HEADER = 'x-xsrf-token';

interface IssuedToken {
	token: string;
	/** The cookie's attributes, everything after the value. */
	attributes: string;
}

/**
 * Read the `XSRF-TOKEN` cookie a response sets.
 * @param res The response.
 * @returns The token and the cookie attributes, or null when the response sets no such cookie.
 */
function issuedToken (res: APIResponse): IssuedToken | null {
	const cookies = res.headersArray()
		.filter((header) => header.name.toLowerCase() === 'set-cookie')
		.map((header) => header.value)
		.filter((value) => value.startsWith(XSRF_COOKIE + '='));
	const cookie = cookies[cookies.length - 1];
	if (cookie === undefined) return null;
	const [pair = '', ...attributes] = cookie.split(';');
	return {
		token: decodeURIComponent(pair.slice(XSRF_COOKIE.length + 1)),
		attributes: attributes.map((attribute) => attribute.trim()).join('; '),
	};
}

/**
 * Like `issuedToken`, but fails the test when the cookie is missing.
 * @param res The response.
 * @param label What the response is, for the failure message.
 * @returns The token and the cookie attributes.
 */
function requireToken (res: APIResponse, label: string): IssuedToken {
	const issued = issuedToken(res);
	expect(issued, label + ' must set the XSRF-TOKEN cookie').not.toBeNull();
	return issued as IssuedToken;
}

function signin (ctx: APIRequestContext, token: string): Promise<APIResponse> {
	return ctx.post(`${API_BASE}/session/signin`, {
		headers: { [XSRF_HEADER]: token },
		data: { email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD },
	});
}

function signout (ctx: APIRequestContext, token: string): Promise<APIResponse> {
	return ctx.post(`${API_BASE}/session/signout`, { headers: { [XSRF_HEADER]: token } });
}

function createPost (ctx: APIRequestContext, token: string | null, title: string): Promise<APIResponse> {
	return ctx.post(`${API_BASE}/posts/create`, {
		headers: token === null ? {} : { [XSRF_HEADER]: token },
		data: { title },
	});
}

function updatePost (ctx: APIRequestContext, token: string, id: string, title: string): Promise<APIResponse> {
	return ctx.post(`${API_BASE}/posts/${id}`, {
		headers: { [XSRF_HEADER]: token },
		data: { title },
	});
}

/**
 * Fetch the token of a signed-out session, as a client does before it shows
 * the signin form.
 * @param ctx The request context.
 * @returns The token and cookie attributes `GET /session` issued.
 */
async function anonymousToken (ctx: APIRequestContext): Promise<IssuedToken> {
	const res = await ctx.get(`${API_BASE}/session`);
	expect(res.status()).toBe(200);
	return requireToken(res, 'GET /session');
}

test.describe('XSRF-TOKEN on signin and signout', () => {
	let ctx: APIRequestContext;

	test.beforeEach(async ({ playwright }) => {
		const baseURL = process.env.E2E_CSRF_BASE_URL;
		if (!baseURL) throw new Error('E2E_CSRF_BASE_URL is not set; playwright.config.ts sets it');
		ctx = await playwright.request.newContext({
			baseURL,
			extraHTTPHeaders: { Accept: 'application/json' },
		});
	});

	test.afterEach(async () => {
		await ctx.dispose();
	});

	test('this server enforces CSRF', async () => {
		const before = await anonymousToken(ctx);
		const noToken = await ctx.post(`${API_BASE}/session/signin`, {
			data: { email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD },
		});
		expect(noToken.status()).toBe(403);
		expect(await noToken.json()).toMatchObject({ error: 'invalid csrf' });

		const signedIn = await signin(ctx, before.token);
		expect(signedIn.status()).toBe(200);
		const withoutHeader = await createPost(ctx, null, 'No token');
		expect(withoutHeader.status()).toBe(403);
	});

	test('signin issues a token that works for a write at once, with no GET /session in between', async () => {
		const before = await anonymousToken(ctx);

		const signedIn = await signin(ctx, before.token);
		expect(signedIn.status()).toBe(200);
		// The body keeps its shape: the safe user projection, nothing else.
		const body = (await signedIn.json()) as { success?: boolean; user?: Record<string, unknown> };
		expect(Object.keys(body).sort()).toEqual(['success', 'user']);
		expect(body.success).toBe(true);
		expect(body.user).toBeTruthy();

		const fresh = requireToken(signedIn, 'signin');
		expect(fresh.token).not.toBe(before.token);
		// Same cookie options as the cookie GET /session sets.
		expect(fresh.attributes).toBe(before.attributes);

		const created = await createPost(ctx, fresh.token, 'Written right after signin');
		expect(created.status()).toBe(200);
		const { id } = (await created.json()) as { id: string };
		expect(id).toBeTruthy();

		const updated = await updatePost(ctx, fresh.token, id, 'Updated right after signin');
		expect(updated.status()).toBe(200);
		const updatedBody = (await updated.json()) as { fields?: { title?: string } };
		expect(updatedBody.fields?.title).toBe('Updated right after signin');
	});

	test('a token from before signin is refused after signin', async () => {
		const before = await anonymousToken(ctx);
		const signedIn = await signin(ctx, before.token);
		expect(signedIn.status()).toBe(200);

		const stale = await createPost(ctx, before.token, 'Stale token');
		expect(stale.status()).toBe(403);
		expect(await stale.json()).toMatchObject({ error: 'invalid csrf' });
	});

	test('signout issues a token that works for the next signin, and that signin for a write', async () => {
		const before = await anonymousToken(ctx);
		const first = await signin(ctx, before.token);
		expect(first.status()).toBe(200);
		const firstToken = requireToken(first, 'signin');

		const signedOut = await signout(ctx, firstToken.token);
		expect(signedOut.status()).toBe(200);
		expect(await signedOut.json()).toEqual({ success: true });
		const afterSignout = requireToken(signedOut, 'signout');
		expect(afterSignout.token).not.toBe(firstToken.token);
		expect(afterSignout.attributes).toBe(before.attributes);

		// The token of the signed-in session died with that session.
		const staleSignin = await signin(ctx, firstToken.token);
		expect(staleSignin.status()).toBe(403);
		expect(await staleSignin.json()).toMatchObject({ error: 'invalid csrf' });

		// Second signin with the token signout issued, no GET /session in between.
		const second = await signin(ctx, afterSignout.token);
		expect(second.status()).toBe(200);
		const secondToken = requireToken(second, 'second signin');
		expect(secondToken.token).not.toBe(afterSignout.token);

		const created = await createPost(ctx, secondToken.token, 'Written after the second signin');
		expect(created.status()).toBe(200);
		const { id } = (await created.json()) as { id: string };
		const updated = await updatePost(ctx, secondToken.token, id, 'Updated after the second signin');
		expect(updated.status()).toBe(200);

		// Tokens of the earlier sessions stay refused.
		for (const stale of [before.token, firstToken.token, afterSignout.token]) {
			const refused = await createPost(ctx, stale, 'Stale token');
			expect(refused.status()).toBe(403);
		}
	});

	test('the legacy signout route issues a token for the next signin', async () => {
		const before = await anonymousToken(ctx);
		const first = await signin(ctx, before.token);
		expect(first.status()).toBe(200);

		const signedOut = await ctx.get(`/${ADMIN_LEGACY_PATH}/signout`, { maxRedirects: 0 });
		expect(signedOut.status()).toBe(302);
		const afterSignout = requireToken(signedOut, 'legacy signout');

		const second = await signin(ctx, afterSignout.token);
		expect(second.status()).toBe(200);
		const created = await createPost(ctx, requireToken(second, 'second signin').token, 'Written after legacy signout');
		expect(created.status()).toBe(200);
	});
});
