/**
 * Password-exposure specs — every admin JSON/CSV endpoint that can return
 * (or reach into) a user document must never serialise a secret field value:
 * a Password-type field (the bcrypt hash) or a field declared with
 * `secret: true` (here `User.recoveryCode`).
 */

import type { APIRequestContext, APIResponse } from '@playwright/test';
import mongoose from 'mongoose';
import { test, expect } from '../fixtures/auth.js';
import {
	API_BASE,
	APP_GET_BASE,
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
	TEST_ADMIN_RECOVERY_CODE,
} from '../fixtures/server.js';
import { resetDb } from '../fixtures/seedDb.js';
import { createItem, getItem, getList, signin, signout, updateItem } from '../helpers/api.js';

/** bcrypt modular-crypt prefix: `$2a$10$`, `$2b$12$`, ... */
/** Admin API base for the user list. */
const USERS = `${API_BASE}/users`;
/** Application `apiForGet` route for the user list. */
const APP_USERS = `${APP_GET_BASE}/user`;

const BCRYPT_RE = /\$2[abxy]?\$\d{2}\$/;

// Test fixture credential — never used outside the e2e-api harness.
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const SECOND_USER_PASSWORD = 'second-user-password-123';
const SECOND_USER_EMAIL = 'second-user@example.com';
/** Value written to the second user's `secret: true` field through the admin API. */
const SECOND_USER_RECOVERY_CODE = 'e2e-second-recovery-code-93b0f5d2';
const SECRET_VALUES = [TEST_ADMIN_RECOVERY_CODE, SECOND_USER_RECOVERY_CODE];

let adminId = '';
let secondUserId = '';
let postId = '';

/**
 * Asserts the response succeeded and that its raw body carries no bcrypt hash
 * and no value of a `secret: true` field.
 * @param res Response to inspect.
 * @param label Endpoint label used in failure messages.
 * @returns The raw response body.
 */
async function expectNoHash (res: APIResponse, label: string): Promise<string> {
	const raw = await res.text();
	expect(res.status(), `${label} status (body: ${raw.slice(0, 200)})`).toBe(200);
	expect(BCRYPT_RE.test(raw), `${label} contains a bcrypt hash`).toBe(false);
	for (const secret of SECRET_VALUES) {
		expect(raw.includes(secret), `${label} contains a secret field value`).toBe(false);
	}
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
			'recoveryCode': SECOND_USER_RECOVERY_CODE,
			'accessTier': 'gold',
		});
		// The create response itself is an endpoint under test.
		const userRaw = await expectNoHash(userRes, 'POST users/create');
		secondUserId = (JSON.parse(userRaw) as { id: string }).id;

		const postRes = await createItem(ctx, 'posts', {
			title: 'Password exposure post',
			author: adminId,
			editors: [adminId, secondUserId],
			reviewer: secondUserId,
		});
		expect(postRes.ok()).toBe(true);
		postId = ((await postRes.json()) as { id: string }).id;
	} finally {
		await ctx.dispose();
	}
});

test.describe('Password-type field values never reach the client', () => {
	test('user list and item endpoints', async ({ signedInRequest }) => {
		const listRaw = await expectNoHash(await getList(signedInRequest, 'users'), 'GET users');
		const list = JSON.parse(listRaw) as { results: Array<{ fields: Record<string, unknown> }> };
		expect(list.results.length).toBeGreaterThanOrEqual(2);
		for (const row of list.results) {
			// Password fields report only whether a value is set.
			expect(row.fields['password']).toBe('true');
		}

		await expectNoHash(
			await getList(signedInRequest, 'users', { fields: 'password,password.hash,name,email,_doc,$__' }),
			'GET users?fields=password,...',
		);
		await expectNoHash(
			await getList(signedInRequest, 'users', { expandRelationshipFields: true }),
			'GET users?expandRelationshipFields',
		);
		await expectNoHash(await getItem(signedInRequest, 'users', adminId), 'GET users/:id');
		await expectNoHash(
			await signedInRequest.get(`${USERS}/${adminId}?fields=password,_doc.password&drilldown=true`),
			'GET users/:id?fields=password',
		);
	});

	test('user update responses', async ({ signedInRequest }) => {
		await expectNoHash(
			await updateItem(signedInRequest, 'users', secondUserId, { 'name.first': 'Renamed' }),
			'POST users/:id',
		);
		await expectNoHash(
			await signedInRequest.post(`${USERS}/update?returnData=true`, {
				data: { items: [{ id: secondUserId, 'name.last': 'Person' }] },
			}),
			'POST users/update?returnData=true',
		);
	});

	test('user exports', async ({ signedInRequest }) => {
		await expectNoHash(await signedInRequest.get(`${USERS}/export.json`), 'GET users/export.json');
		await expectNoHash(
			await signedInRequest.get(`${USERS}/export.json?select=password,email`),
			'GET users/export.json?select=password',
		);
		const csv = await expectNoHash(await signedInRequest.get(`${USERS}/export.csv`), 'GET users/export.csv');
		expect(csv).toContain(TEST_ADMIN_EMAIL);
		await expectNoHash(
			await signedInRequest.get(`${USERS}/export.csv?select=password,email`),
			'GET users/export.csv?select=password',
		);
	});

	test('relationship lookups, populate and expand on a list referencing users', async ({ signedInRequest }) => {
		const variants: Array<Record<string, string | number | boolean>> = [
			{},
			{ populate: 'author' },
			{ populate: 'author,editors' },
			{ expandRelationshipFields: true },
			{ populate: 'author,editors', expandRelationshipFields: true },
			{ populate: 'author,editors,reviewer' },
			{ populate: 'reviewer', fields: 'reviewer,reviewer.recoveryCode,author.recoveryCode,editors.0.recoveryCode,editors.recoveryCode' },
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
		expect(author).not.toHaveProperty('recoveryCode');
	});

	test('a `secret: true` field is stored but never returned, selectable, filterable or sortable', async ({ signedInRequest }) => {
		// The values really are stored: the API omits them, it did not drop them.
		const conn = await mongoose.createConnection(process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-api').asPromise();
		try {
			const stored = await conn.collection('User').find({}).project({ email: 1, recoveryCode: 1 }).toArray();
			const byEmail = Object.fromEntries(stored.map((user) => [user['email'], user['recoveryCode']]));
			expect(byEmail[TEST_ADMIN_EMAIL]).toBe(TEST_ADMIN_RECOVERY_CODE);
			// Written through the admin API create endpoint.
			expect(byEmail[SECOND_USER_EMAIL]).toBe(SECOND_USER_RECOVERY_CODE);
		} finally {
			await conn.close();
		}

		type Row = { id: string; fields: Record<string, unknown> };
		const allRaw = await expectNoHash(await getList(signedInRequest, 'users'), 'GET users');
		const all = JSON.parse(allRaw) as { count: number; results: Row[] };
		expect(all.count).toBe(2);
		for (const row of all.results) {
			expect(row.fields).not.toHaveProperty('recoveryCode');
			expect(row.fields).toHaveProperty('email');
		}

		const itemRaw = await expectNoHash(
			await signedInRequest.get(`${USERS}/${adminId}?fields=email,recoveryCode,recoveryCode.length,_doc.recoveryCode`),
			'GET users/:id?fields=recoveryCode',
		);
		expect(Object.keys((JSON.parse(itemRaw) as Row).fields)).toEqual(['email']);

		const selectedRaw = await expectNoHash(
			await getList(signedInRequest, 'users', { fields: 'recoveryCode,email' }),
			'GET users?fields=recoveryCode',
		);
		for (const row of (JSON.parse(selectedRaw) as { results: Row[] }).results) {
			expect(Object.keys(row.fields)).toEqual(['email']);
		}

		// A filter on the secret field is ignored.
		for (const filter of [
			{ mode: 'exactly', value: TEST_ADMIN_RECOVERY_CODE },
			{ mode: 'beginsWith', value: 'e2e-admin' },
			{ mode: 'contains', value: 'no-such-value' },
		]) {
			const res = await signedInRequest.get(
				`${USERS}?filters=${encodeURIComponent(JSON.stringify({ recoveryCode: filter }))}`,
			);
			const raw = await res.text();
			expect(res.status(), raw.slice(0, 200)).toBe(200);
			expect((JSON.parse(raw) as { count: number }).count, `filter ${JSON.stringify(filter)} was applied`).toBe(2);
		}
		// A real filter still narrows the result.
		const narrowed = await signedInRequest.get(
			`${USERS}?filters=${encodeURIComponent(JSON.stringify({ email: { mode: 'exactly', value: TEST_ADMIN_EMAIL } }))}`,
		);
		expect(((await narrowed.json()) as { count: number }).count).toBe(1);

		// Sorting on it is ignored too: both directions return the same order.
		const order = async (sort: string): Promise<string[]> => {
			const raw = await expectNoHash(await getList(signedInRequest, 'users', { sort }), `GET users?sort=${sort}`);
			return (JSON.parse(raw) as { results: Row[] }).results.map((row) => row.id);
		};
		expect(await order('recoveryCode')).toEqual(await order('-recoveryCode'));

		for (const format of ['json', 'csv']) {
			const raw = await expectNoHash(
				await signedInRequest.get(`${USERS}/export.${format}?select=email,recoveryCode`),
				`GET users/export.${format}?select=recoveryCode`,
			);
			expect(raw).toContain(TEST_ADMIN_EMAIL);
			expect(raw).not.toContain('recoveryCode');
		}
		const fullCsv = await expectNoHash(await signedInRequest.get(`${USERS}/export.csv`), 'GET users/export.csv');
		expect(fullCsv).not.toContain('recoveryCode');

		// Updating another field neither returns nor clears the stored secret.
		await expectNoHash(
			await updateItem(signedInRequest, 'users', secondUserId, { 'name.first': 'Still' }),
			'POST users/:id',
		);
	});

	test('paths derived from a secret field are never returned', async ({ signedInRequest }) => {
		// The secret Select value is stored; its label would be "Gold".
		const conn = await mongoose.createConnection(process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-api').asPromise();
		try {
			const stored = await conn.collection('User').findOne({ email: SECOND_USER_EMAIL });
			expect(stored?.['accessTier']).toBe('gold');
		} finally {
			await conn.close();
		}

		const derived = 'accessTier,accessTierLabel,accessTierData,accessTierData.label,accessTierOptions,accessTierOptionsMap,password_hash';
		type Row = { id: string; fields: Record<string, unknown> };
		const itemRaw = await expectNoHash(
			await signedInRequest.get(`${USERS}/${secondUserId}?fields=email,${derived}`),
			'GET users/:id?fields=accessTierLabel',
		);
		expect(Object.keys((JSON.parse(itemRaw) as Row).fields)).toEqual(['email']);
		expect(itemRaw.toLowerCase()).not.toContain('gold');

		const listRaw = await expectNoHash(
			await getList(signedInRequest, 'users', { fields: `email,${derived}` }),
			'GET users?fields=accessTierLabel',
		);
		for (const row of (JSON.parse(listRaw) as { results: Row[] }).results) {
			expect(Object.keys(row.fields)).toEqual(['email']);
		}
		expect(listRaw.toLowerCase()).not.toContain('gold');

		for (const format of ['json', 'csv']) {
			const raw = await expectNoHash(
				await signedInRequest.get(`${USERS}/export.${format}?select=email,${derived}`),
				`GET users/export.${format}?select=accessTierLabel`,
			);
			expect(raw).toContain(SECOND_USER_EMAIL);
			expect(raw.toLowerCase()).not.toContain('gold');
			expect(raw).not.toContain('accessTier');
		}
	});

	test('`?search=` does not match on a secret field', async ({ signedInRequest }) => {
		const count = async (search: string): Promise<number> => {
			const raw = await expectNoHash(await getList(signedInRequest, 'users', { search }), `GET users?search=${search}`);
			return (JSON.parse(raw) as { count: number }).count;
		};
		// A stored secret value answers exactly like a value stored nowhere.
		const baseline = await count('no-such-value-anywhere');
		expect(await count(TEST_ADMIN_RECOVERY_CODE)).toBe(baseline);
		expect(await count(SECOND_USER_RECOVERY_CODE)).toBe(baseline);
		expect(await count('e2e-admin')).toBe(baseline);
		// A real search still matches.
		expect(await count('Admin')).toBe(1);
	});

	test('a duplicate-key error on a unique secret field does not echo the value', async ({ signedInRequest }) => {
		const check = async (res: APIResponse, label: string): Promise<void> => {
			const raw = await res.text();
			expect(res.status(), `${label} status (body: ${raw.slice(0, 200)})`).toBe(500);
			for (const secret of SECRET_VALUES) {
				expect(raw.includes(secret), `${label} echoed a secret field value`).toBe(false);
			}
			expect(JSON.parse(raw)).toEqual({ error: 'database error', detail: 'Duplicate recoveryCode value already exists' });
		};
		// Create a third user with the second user's secret value.
		await check(await createItem(signedInRequest, 'users', {
			'name.first': 'Third',
			'name.last': 'User',
			'email': 'third-user@example.com',
			'password': SECOND_USER_PASSWORD,
			'password_confirm': SECOND_USER_PASSWORD,
			'recoveryCode': SECOND_USER_RECOVERY_CODE,
		}), 'POST users/create');
		// Update the second user to the admin's secret value.
		await check(
			await updateItem(signedInRequest, 'users', secondUserId, { recoveryCode: TEST_ADMIN_RECOVERY_CODE }),
			'POST users/:id',
		);
		const all = (await (await getList(signedInRequest, 'users')).json()) as { count: number };
		expect(all.count).toBe(2);
	});

	test('a relationship `toCSV` key list never exports secret fields of the related user', async ({ signedInRequest }) => {
		for (const qs of ['populate=reviewer', 'populate=reviewer&select=title,reviewer', '']) {
			const csv = await expectNoHash(
				await signedInRequest.get(`${API_BASE}/posts/export.csv?${qs}`),
				`GET /posts/export.csv?${qs}`,
			);
			if (qs) {
				// The non-secret key of `toCSV: 'email, password, recoveryCode'` is still exported.
				expect(csv).toContain(SECOND_USER_EMAIL);
				expect(csv).toContain('reviewerEmail');
			}
			expect(csv).not.toContain('reviewerPassword');
			expect(csv).not.toContain('reviewerRecoveryCode');
		}
	});

	test('List.apiForGet application routes', async ({ request }) => {
		const userRaw = await expectNoHash(await request.get(`${APP_USERS}/${adminId}`), 'apiForGet user');
		const user = (JSON.parse(userRaw) as { data: Record<string, unknown> }).data;
		expect(user).not.toHaveProperty('password');
		expect(user).not.toHaveProperty('recoveryCode');
		// Every other stored field is still the raw document's.
		expect(user).toMatchObject({
			_id: adminId,
			name: { first: 'Test', last: 'Admin' },
			email: TEST_ADMIN_EMAIL,
			isAdmin: true,
		});

		const postRaw = await expectNoHash(await request.get(`${APP_GET_BASE}/post/${postId}`), 'apiForGet populated post');
		const post = (JSON.parse(postRaw) as {
			data: { _id: string; author: Record<string, unknown>; editors: Array<Record<string, unknown>> };
		}).data;
		expect(post._id).toBe(postId);
		// The relationships are populated with the related users, minus Password-type fields.
		expect(post.author).toMatchObject({ _id: adminId, email: TEST_ADMIN_EMAIL });
		expect(post.author).not.toHaveProperty('password');
		expect(post.editors.map((editor) => editor['_id'])).toEqual([adminId, secondUserId]);
		for (const editor of post.editors) {
			expect(editor).not.toHaveProperty('password');
			expect(editor).not.toHaveProperty('recoveryCode');
		}

		const missing = await request.get(`${APP_USERS}/000000000000000000000000`);
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
