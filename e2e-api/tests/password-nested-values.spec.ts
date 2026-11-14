/**
 * Password values stored in shapes other than the schema's — a DBRef's extra
 * fields, an array of objects, an array of DBRefs — written directly through
 * the driver. No admin or application route may send them, however the
 * caller names the path (`fields`, `select`, `populate`).
 */

import mongoose from 'mongoose';
import type { APIResponse } from '@playwright/test';
import { test, expect } from '../fixtures/auth.js';
import { API_BASE, APP_GET_BASE } from '../fixtures/server.js';
import { resetDb } from '../fixtures/seedDb.js';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-api';
/** Synthetic stand-in for a stored Password value; never a real hash. */
const FAKE = 'FAKE-NESTED-PIN-VALUE';
/** Admin API base for the user list. */
const USERS = `${API_BASE}/users`;

const { DBRef, ObjectId } = mongoose.mongo;
const refId = new ObjectId();
const users = {
	dbref: new ObjectId(),
	array: new ObjectId(),
	dbrefArray: new ObjectId(),
};
const postId = new ObjectId();

/**
 * Asserts the response succeeded and that its raw body carries no stored Password value.
 * @param res Response to inspect.
 * @param label Endpoint label used in failure messages.
 * @returns The raw response body.
 */
async function expectNoPin (res: APIResponse, label: string): Promise<string> {
	const raw = await res.text();
	expect(res.status(), `${label} status`).toBe(200);
	expect(raw.includes(FAKE), `${label} contains a stored Password value`).toBe(false);
	return raw;
}

test.beforeAll(async ({ request }) => {
	await resetDb(request);
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		const db = conn.db;
		if (!db) throw new Error('no database');
		const user = (id: InstanceType<typeof ObjectId>, label: string, secret: unknown) => ({
			_id: id,
			name: { first: 'Nested', last: label },
			email: `nested-${label}@example.com`,
			isAdmin: false,
			secret,
		});
		await db.collection('User').insertMany([
			user(users.dbref, 'dbref', new DBRef('public', refId, undefined, { pin: FAKE, keep: 1 })),
			user(users.array, 'array', [{ pin: FAKE, keep: 1 }]),
			user(users.dbrefArray, 'dbrefarray', [new DBRef('public', refId, undefined, { pin: FAKE, keep: 1 })]),
		]);
		await db.collection('Post').insertOne({
			_id: postId,
			title: 'Nested values post',
			slug: 'nested-values-post',
			state: 'draft',
			author: users.dbref,
			editors: [users.dbref, users.array, users.dbrefArray],
		});
	} finally {
		await conn.close();
	}
});

test.describe('Password values stored in nested shapes never reach the client', () => {
	test('populated relationships named in fields', async ({ signedInRequest }) => {
		const variants: Array<Record<string, string>> = [
			{ populate: 'author', fields: 'author' },
			{ populate: 'editors', fields: 'editors' },
			{ populate: 'author,editors', fields: 'author,editors' },
			{ populate: 'author,editors' },
		];
		for (const query of variants) {
			const raw = await expectNoPin(
				await signedInRequest.get(`${API_BASE}/posts`, { params: query }),
				`GET /posts ${JSON.stringify(query)}`,
			);
			if (query['fields'] === 'author') {
				const body = JSON.parse(raw) as { results: Array<{ fields: { author?: Record<string, unknown> } }> };
				// The related user is still sent, with its other values.
				expect(body.results[0]?.fields.author).toMatchObject({ email: 'nested-dbref@example.com', secret: { keep: 1 } });
			}
		}
		await expectNoPin(
			await signedInRequest.get(`${API_BASE}/posts/${String(postId)}`, { params: { populate: 'author,editors', fields: 'author,editors' } }),
			'GET /posts/:id populated',
		);
	});

	test('paths through an array or a DBRef named in fields and select', async ({ signedInRequest }) => {
		const paths = 'secret,secret.0,secret.0.pin,secret.0.fields,secret.0.fields.pin,secret.fields,secret.fields.pin';
		await expectNoPin(await signedInRequest.get(USERS, { params: { fields: paths } }), 'GET /users?fields');
		for (const id of Object.values(users)) {
			await expectNoPin(
				await signedInRequest.get(`${USERS}/${String(id)}`, { params: { fields: paths } }),
				'GET users/:id?fields',
			);
		}
		await expectNoPin(await signedInRequest.get(`${USERS}/export.json`, { params: { select: paths } }), 'export.json?select');
		await expectNoPin(await signedInRequest.get(`${USERS}/export.csv`, { params: { select: paths } }), 'export.csv?select');
		await expectNoPin(await signedInRequest.get(`${USERS}/export.csv`), 'export.csv');
		await expectNoPin(
			await signedInRequest.get(`${API_BASE}/posts/export.csv`, { params: { populate: 'author,editors', select: 'author,editors' } }),
			'posts export.csv populated',
		);
	});

	test('List.apiForGet application routes', async ({ request }) => {
		for (const id of Object.values(users)) {
			const raw = await expectNoPin(await request.get(`${APP_GET_BASE}/user/${String(id)}`), 'apiForGet user');
			expect(raw).toContain('"keep":1');
		}
		await expectNoPin(await request.get(`${APP_GET_BASE}/post/${String(postId)}`), 'apiForGet populated post');
	});
});
