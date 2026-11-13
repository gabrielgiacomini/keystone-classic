/**
 * Password-exposure specs — every admin JSON/CSV endpoint that can return
 * (or reach into) a user document must never serialise a Password-type
 * field value (the bcrypt hash).
 */

import type { APIRequestContext, APIResponse } from '@playwright/test';
import { test, expect } from '../fixtures/auth.js';
import { API_BASE, APP_GET_BASE, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from '../fixtures/server.js';
import { resetDb } from '../fixtures/seedDb.js';
import { createItem, getItem, getList, signin, signout, updateItem } from '../helpers/api.js';

/** bcrypt modular-crypt prefix: `$2a$10$`, `$2b$12$`, ... */
const BCRYPT_RE = /\$2[abxy]?\$\d{2}\$/;

// Test fixture credential — never used outside the e2e-api harness.
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const SECOND_USER_PASSWORD = 'second-user-password-123';
const SECOND_USER_EMAIL = 'second-user@example.com';

let adminId = '';
let secondUserId = '';
let postId = '';

/**
 * Asserts the response succeeded and that its raw body carries no bcrypt hash.
 * @param res Response to inspect.
 * @param label Endpoint label used in failure messages.
 * @returns The raw response body.
 */
async function expectNoHash (res: APIResponse, label: string): Promise<string> {
	const raw = await res.text();
	expect(res.status(), `${label} status (body: ${raw.slice(0, 200)})`).toBe(200);
	expect(BCRYPT_RE.test(raw), `${label} contains a bcrypt hash`).toBe(false);
	return raw;
}

async function signedIn (
	playwright: { request: { newContext(options: { baseURL?: string }): Promise<APIRequestContext> } },
	baseURL: string | undefined,
): Promise<APIRequestContext> {
	const ctx = await playwright.request.newContext({ baseURL });
	const res = await signin(ctx, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
	expect(res.ok()).toBe(true);
	return ctx;
}

test.beforeAll(async ({ request, playwright, baseURL }) => {
	await resetDb(request);
	const ctx = await signedIn(playwright, baseURL);
	try {
		const session = (await (await ctx.get(`${API_BASE}/session`)).json()) as { user: { id: string } };
		adminId = session.user.id;

		const userRes = await createItem(ctx, 'users', {
			'name.first': 'Second',
			'name.last': 'User',
			'email': SECOND_USER_EMAIL,
			'password': SECOND_USER_PASSWORD,
			'password_confirm': SECOND_USER_PASSWORD,
		});
		// The create response itself is an endpoint under test.
		const userRaw = await expectNoHash(userRes, 'POST /users/create');
		secondUserId = (JSON.parse(userRaw) as { id: string }).id;

		const postRes = await createItem(ctx, 'posts', {
			title: 'Password exposure post',
			author: adminId,
			editors: [adminId, secondUserId],
		});
		expect(postRes.ok()).toBe(true);
		postId = ((await postRes.json()) as { id: string }).id;
	} finally {
		await ctx.dispose();
	}
});

test.describe('Password-type field values never reach the client', () => {
	test('user list and item endpoints', async ({ signedInRequest }) => {
		const listRaw = await expectNoHash(await getList(signedInRequest, 'users'), 'GET /users');
		const list = JSON.parse(listRaw) as { results: Array<{ fields: Record<string, unknown> }> };
		expect(list.results.length).toBeGreaterThanOrEqual(2);
		for (const row of list.results) {
			// Password fields report only whether a value is set.
			expect(row.fields['password']).toBe('true');
		}

		await expectNoHash(
			await getList(signedInRequest, 'users', { fields: 'password,password.hash,name,email,_doc,$__' }),
			'GET /users?fields=password,...',
		);
		await expectNoHash(
			await getList(signedInRequest, 'users', { expandRelationshipFields: true }),
			'GET /users?expandRelationshipFields',
		);
		await expectNoHash(await getItem(signedInRequest, 'users', adminId), 'GET /users/:id');
		await expectNoHash(
			await signedInRequest.get(`${API_BASE}/users/${adminId}?fields=password,_doc.password&drilldown=true`),
			'GET /users/:id?fields=password',
		);
	});

	test('user update responses', async ({ signedInRequest }) => {
		await expectNoHash(
			await updateItem(signedInRequest, 'users', secondUserId, { 'name.first': 'Renamed' }),
			'POST /users/:id',
		);
		await expectNoHash(
			await signedInRequest.post(`${API_BASE}/users/update?returnData=true`, {
				data: { items: [{ id: secondUserId, 'name.last': 'Person' }] },
			}),
			'POST /users/update?returnData=true',
		);
	});

	test('user exports', async ({ signedInRequest }) => {
		await expectNoHash(await signedInRequest.get(`${API_BASE}/users/export.json`), 'GET /users/export.json');
		await expectNoHash(
			await signedInRequest.get(`${API_BASE}/users/export.json?select=password,email`),
			'GET /users/export.json?select=password',
		);
		const csv = await expectNoHash(await signedInRequest.get(`${API_BASE}/users/export.csv`), 'GET /users/export.csv');
		expect(csv).toContain(TEST_ADMIN_EMAIL);
		await expectNoHash(
			await signedInRequest.get(`${API_BASE}/users/export.csv?select=password,email`),
			'GET /users/export.csv?select=password',
		);
	});

	test('relationship lookups, populate and expand on a list referencing users', async ({ signedInRequest }) => {
		const variants: Array<Record<string, string | number | boolean>> = [
			{},
			{ populate: 'author' },
			{ populate: 'author,editors' },
			{ expandRelationshipFields: true },
			{ populate: 'author,editors', expandRelationshipFields: true },
			{ populate: 'author,editors', fields: 'author,editors,author.password,editors.password,editors.0,editors.0.password' },
			{ expandRelationshipFields: true, fields: 'author.password,editors.password,editors.0' },
		];
		for (const query of variants) {
			const label = JSON.stringify(query);
			await expectNoHash(await getList(signedInRequest, 'posts', query), `GET /posts ${label}`);
			const qs = Object.entries(query)
				.map(([k, v]) => `${k === 'fields' ? 'select' : k}=${encodeURIComponent(String(v))}`)
				.join('&');
			await expectNoHash(
				await signedInRequest.get(`${API_BASE}/posts/export.json?${qs}`),
				`GET /posts/export.json ${label}`,
			);
			await expectNoHash(
				await signedInRequest.get(`${API_BASE}/posts/export.csv?${qs}`),
				`GET /posts/export.csv ${label}`,
			);
		}

		await expectNoHash(await getItem(signedInRequest, 'posts', postId), 'GET /posts/:id');
		await expectNoHash(
			await signedInRequest.get(
				`${API_BASE}/posts/${postId}?expandRelationshipFields=true&fields=author,editors,author.password,editors.password,editors.0`,
			),
			'GET /posts/:id?expandRelationshipFields&fields=author.password',
		);
		await expectNoHash(
			await updateItem(signedInRequest, 'posts', postId, { title: 'Password exposure post (edited)' }),
			'POST /posts/:id',
		);
	});

	test('populate still returns the related user, minus Password-type fields', async ({ signedInRequest }) => {
		const raw = await expectNoHash(
			await getList(signedInRequest, 'posts', { populate: 'author' }),
			'GET /posts?populate=author',
		);
		const body = JSON.parse(raw) as { results: Array<{ fields: { author?: Record<string, unknown> } }> };
		const author = body.results[0]?.fields.author;
		expect(author).toBeTruthy();
		expect(author?.['email']).toBe(TEST_ADMIN_EMAIL);
		expect(author).not.toHaveProperty('password');
	});

	test('List.apiForGet application routes', async ({ request }) => {
		const userRaw = await expectNoHash(await request.get(`${APP_GET_BASE}/users/${adminId}`), 'apiForGet user');
		const user = (JSON.parse(userRaw) as { data: Record<string, unknown> }).data;
		expect(user).not.toHaveProperty('password');
		// Every other stored field is still the raw document's.
		expect(user).toMatchObject({
			_id: adminId,
			name: { first: 'Test', last: 'Admin' },
			email: TEST_ADMIN_EMAIL,
			isAdmin: true,
		});

		const postRaw = await expectNoHash(await request.get(`${APP_GET_BASE}/posts/${postId}`), 'apiForGet populated post');
		const post = (JSON.parse(postRaw) as {
			data: { _id: string; author: Record<string, unknown>; editors: Array<Record<string, unknown>> };
		}).data;
		expect(post._id).toBe(postId);
		// The relationships are populated with the related users, minus Password-type fields.
		expect(post.author).toMatchObject({ _id: adminId, email: TEST_ADMIN_EMAIL });
		expect(post.author).not.toHaveProperty('password');
		expect(post.editors.map((editor) => editor['_id'])).toEqual([adminId, secondUserId]);
		for (const editor of post.editors) expect(editor).not.toHaveProperty('password');

		const missing = await request.get(`${APP_GET_BASE}/users/000000000000000000000000`);
		expect(missing.status()).toBe(404);
	});

	test('signin and signout responses', async ({ playwright, baseURL }) => {
		const ctx = await playwright.request.newContext({ baseURL });
		try {
			await expectNoHash(await signin(ctx, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD), 'POST /session/signin');
			await expectNoHash(await ctx.get(`${API_BASE}/session`), 'GET /session');
			const outRaw = await expectNoHash(await signout(ctx), 'POST /session/signout');
			expect(JSON.parse(outRaw)).toEqual({ success: true });
		} finally {
			await ctx.dispose();
		}
	});
});
