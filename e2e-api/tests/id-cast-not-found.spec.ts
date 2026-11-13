/**
 * Ids that cannot be cast to a list's `_id` type answer like an id that
 * matches no item, on the item, bulk update, delete and sort order routes and
 * for the `keystone.uid` cookie.
 */

import { createHmac } from 'node:crypto';
import { test, expect } from '../fixtures/auth.js';
import { resetDb } from '../fixtures/seedDb.js';
import { createItem, deleteItem, getItem, getList, getSession, updateItem } from '../helpers/api.js';
import { API_BASE, COOKIE_SECRET } from '../fixtures/server.js';

/** A well-formed ObjectId that no document uses. */
const MISSING_OBJECT_ID = '507f1f77bcf86cd799439011';

/**
 * The `Cookie` header value for a `keystone.uid` cookie signed the way
 * cookie-parser expects (`s:<value>.<hmac>`), carrying `value`.
 * @param value Cookie payload, `<user id>:<password hash check>`.
 * @returns The header value.
 */
function signedUidCookie (value: string): string {
	const signature = createHmac('sha256', COOKIE_SECRET).update(value).digest('base64').replace(/=+$/, '');
	return 'keystone.uid=' + encodeURIComponent('s:' + value + '.' + signature);
}

test.beforeAll(async ({ request }) => {
	await resetDb(request);
});

test.describe('uncastable ids answer not found, not 500', () => {
	const uncastable = [
		{ kind: 'ObjectId', list: 'users', id: 'not-an-objectid' },
		{ kind: 'ObjectId', list: 'posts', id: 'not-an-objectid' },
	];

	for (const { kind, list, id } of uncastable) {
		test(`GET /${list}/${id} (${kind} _id) is 404`, async ({ signedInRequest }) => {
			const res = await getItem(signedInRequest, list, id);
			expect(res.status()).toBe(404);
			expect(await res.json()).toEqual({ err: 'not found', id });
		});

		test(`POST /${list}/${id} (${kind} _id) is 404`, async ({ signedInRequest }) => {
			const res = await updateItem(signedInRequest, list, id, { name: 'x' });
			expect(res.status()).toBe(404);
			expect(await res.json()).toEqual({ error: 'not found', id });
		});

		test(`POST /${list}/${id}/delete (${kind} _id) deletes nothing`, async ({ signedInRequest }) => {
			const res = await deleteItem(signedInRequest, list, id);
			expect(res.status()).toBe(200);
			expect(await res.json()).toEqual({ success: true, ids: [], count: 0 });
		});

		test(`POST /${list}/${id}/sortOrder/1/2 (${kind} _id) is 404`, async ({ signedInRequest }) => {
			const res = await signedInRequest.post(`${API_BASE}/${list}/${id}/sortOrder/1/2`);
			expect(res.status()).toBe(404);
			expect(await res.json()).toEqual({ error: 'not found', id });
		});

		test(`bulk POST /${list}/update with id ${id} (${kind} _id) is 404`, async ({ signedInRequest }) => {
			const res = await signedInRequest.post(`${API_BASE}/${list}/update`, {
				data: { items: [{ id, name: 'x' }] },
			});
			expect(res.status()).toBe(404);
			expect(await res.json()).toEqual({ id });
		});
	}

	test('bulk update with an object in place of an id is 404 and changes nothing', async ({ signedInRequest }) => {
		const created = await createItem(signedInRequest, 'posts', { title: 'Kept as is' });
		const { id } = (await created.json()) as { id: string };

		const res = await signedInRequest.post(`${API_BASE}/posts/update`, {
			data: { items: [{ id: { $ne: null }, title: 'overwritten' }] },
		});
		expect(res.status()).toBe(404);

		const post = await getItem(signedInRequest, 'posts', id);
		expect(((await post.json()) as { fields?: { title?: string } }).fields?.title).toBe('Kept as is');
	});

	test('bulk delete skips an uncastable id and still deletes the others', async ({ signedInRequest }) => {
		const created = await createItem(signedInRequest, 'posts', { title: 'Deleted next to a bad id' });
		const { id } = (await created.json()) as { id: string };

		const res = await signedInRequest.post(`${API_BASE}/posts/delete`, {
			data: { ids: ['not-an-objectid', id] },
		});
		expect(res.status()).toBe(200);
		expect(await res.json()).toEqual({ success: true, ids: [id], count: 1 });
		expect((await getItem(signedInRequest, 'posts', id)).status()).toBe(404);
	});
});

test.describe('well-formed ids are unchanged', () => {
	const missing = [
		{ kind: 'ObjectId', list: 'users', id: MISSING_OBJECT_ID },
		{ kind: 'ObjectId', list: 'posts', id: MISSING_OBJECT_ID },
	];

	for (const { kind, list, id } of missing) {
		test(`a missing ${kind} id on /${list} is still 404 on every route`, async ({ signedInRequest }) => {
			const got = await getItem(signedInRequest, list, id);
			expect(got.status()).toBe(404);
			expect(await got.json()).toEqual({ err: 'not found', id });

			const updated = await updateItem(signedInRequest, list, id, { name: 'x' });
			expect(updated.status()).toBe(404);
			expect(await updated.json()).toEqual({ error: 'not found', id });

			const bulk = await signedInRequest.post(`${API_BASE}/${list}/update`, {
				data: { items: [{ id, name: 'x' }] },
			});
			expect(bulk.status()).toBe(404);
			expect(await bulk.json()).toEqual({ id });

			const deleted = await deleteItem(signedInRequest, list, id);
			expect(deleted.status()).toBe(200);
			expect(await deleted.json()).toEqual({ success: true, ids: [], count: 0 });

		});
	}
});

test.describe('session cookie with a bogus user id', () => {
	for (const userId of ['not-an-objectid', MISSING_OBJECT_ID]) {
		test(`keystone.uid for user "${userId}" is signed out, not an error`, async ({ playwright, baseURL }) => {
			const ctx = await playwright.request.newContext({
				baseURL,
				extraHTTPHeaders: { Accept: 'application/json', Cookie: signedUidCookie(userId + ':bogus-hash') },
			});
			try {
				const session = await getSession(ctx);
				expect(session.status()).toBe(200);
				expect(await session.json()).toEqual({ user: null });
				// The rejected cookie is cleared.
				expect(session.headers()['set-cookie'] ?? '').toMatch(/keystone\.uid=[^;]*; Max-Age=0/);

				const list = await getList(ctx, 'posts');
				expect(list.status()).toBe(401);
				expect(await list.json()).toEqual({ error: 'not signed in' });
			} finally {
				await ctx.dispose();
			}
		});
	}

	test('a valid keystone.uid cookie still signs the user back in', async ({ playwright, baseURL, signedInRequest }) => {
		// Take the cookie the server issued at signin and replay it without the session cookie.
		const state = await signedInRequest.storageState();
		const uid = state.cookies.find((cookie) => cookie.name === 'keystone.uid');
		expect(uid, 'signin issues keystone.uid').toBeTruthy();
		const ctx = await playwright.request.newContext({
			baseURL,
			extraHTTPHeaders: { Accept: 'application/json', Cookie: 'keystone.uid=' + (uid?.value ?? '') },
		});
		try {
			const session = await getSession(ctx);
			expect(session.status()).toBe(200);
			expect(((await session.json()) as { user?: { email?: string } }).user?.email).toBeTruthy();
		} finally {
			await ctx.dispose();
		}
	});
});
