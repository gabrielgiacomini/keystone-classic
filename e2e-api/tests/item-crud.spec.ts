/**
 * Item CRUD specs — POST /create, POST /:id (update), POST /:id/delete.
 *
 * Each test creates its own item to keep the file order-independent.
 */

import { test, expect } from '../fixtures/auth.js';
import { resetDb } from '../fixtures/seedDb.js';
import {
	createItem,
	deleteItem,
	getItem,
	getList,
	updateItem,
} from '../helpers/api.js';

interface CreateResponse {
	id: string;
	fields?: Record<string, unknown>;
}

test.beforeAll(async ({ request }) => {
	await resetDb(request);
});

test.describe('item CRUD', () => {
	test('POST /:list/create creates a new item', async ({ signedInRequest }) => {
		const res = await createItem(signedInRequest, 'posts', {
			title: 'Hello CRUD',
			state: 'draft',
		});
		expect(res.status()).toBe(200);
		const body = (await res.json()) as CreateResponse;
		expect(body.id).toBeTruthy();
		const fields = body.fields as { title?: string; state?: string } | undefined;
		expect(fields?.title).toBe('Hello CRUD');
		expect(fields?.state).toBe('draft');

		const fetched = await getItem(signedInRequest, 'posts', body.id);
		expect(fetched.status()).toBe(200);
	});

	test('POST /:list/create rejects missing required fields with 400', async ({
		signedInRequest,
	}) => {
		const res = await createItem(signedInRequest, 'posts', { state: 'draft' });
		expect(res.status()).toBe(400);
		const body = (await res.json()) as { error?: string };
		expect(body.error).toBe('validation errors');
	});

	test('POST /:list/:id updates an item', async ({ signedInRequest }) => {
		const created = await createItem(signedInRequest, 'posts', {
			title: 'Pre-update title',
			state: 'draft',
		});
		expect(created.ok()).toBe(true);
		const { id } = (await created.json()) as CreateResponse;

		const updated = await updateItem(signedInRequest, 'posts', id, {
			title: 'Post-update title',
			state: 'published',
		});
		expect(updated.status()).toBe(200);

		const fetched = await getItem(signedInRequest, 'posts', id);
		const body = (await fetched.json()) as { fields?: { title?: string; state?: string } };
		expect(body.fields?.title).toBe('Post-update title');
		expect(body.fields?.state).toBe('published');
	});

	test('POST /:list/:id/delete removes the item', async ({
		signedInRequest,
	}) => {
		const created = await createItem(signedInRequest, 'posts', {
			title: 'Soon to be gone',
			state: 'draft',
		});
		const { id } = (await created.json()) as CreateResponse;

		const deleted = await deleteItem(signedInRequest, 'posts', id);
		expect(deleted.status()).toBe(200);

		const fetched = await getItem(signedInRequest, 'posts', id);
		expect(fetched.status()).toBe(404);
	});

	test('list count reflects creates and deletes', async ({ signedInRequest }) => {
		const before = await getList(signedInRequest, 'posts');
		const beforeBody = (await before.json()) as { count?: number };

		const created = await createItem(signedInRequest, 'posts', {
			title: 'Count me',
			state: 'draft',
		});
		const { id } = (await created.json()) as CreateResponse;

		const after = await getList(signedInRequest, 'posts');
		const afterBody = (await after.json()) as { count?: number };
		expect(afterBody.count).toBe((beforeBody.count ?? 0) + 1);

		await deleteItem(signedInRequest, 'posts', id);
		const final = await getList(signedInRequest, 'posts');
		const finalBody = (await final.json()) as { count?: number };
		expect(finalBody.count).toBe(beforeBody.count);
	});
});
