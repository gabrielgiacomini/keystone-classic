/**
 * List-read specs — exercises GET /keystone-api/:list with no filters,
 * pagination, and search.
 */

import { test, expect } from '../fixtures/auth.js';
import { API_BASE, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD } from '../fixtures/server.js';
import { resetDb } from '../fixtures/seedDb.js';
import { createItem, getList } from '../helpers/api.js';

interface ListGetResponse {
	count?: number;
	results?: Array<Record<string, unknown>>;
}

test.beforeAll(async ({ request, playwright, baseURL }) => {
	await resetDb(request);

	// Seed five posts under a signed-in admin context. We can't reuse
	// the `signedInRequest` fixture here because Playwright fixtures
	// are scoped per-test, not per-beforeAll.
	const ctx = await playwright.request.newContext({ baseURL });
	try {
		const signin = await ctx.post(`${API_BASE}/session/signin`, {
			data: { email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASSWORD },
		});
		expect(signin.ok()).toBe(true);

		for (let i = 0; i < 5; i++) {
			const res = await createItem(ctx, 'posts', {
				title: `Post number ${i}`,
				state: i % 2 === 0 ? 'published' : 'draft',
			});
			if (!res.ok()) {
				const body = await res.text();
				throw new Error(`seed createItem failed: ${res.status()} ${body}`);
			}
		}
	} finally {
		await ctx.dispose();
	}
});

test.describe('GET /api/:list', () => {
	test('returns all items with count', async ({ signedInRequest }) => {
		const res = await getList(signedInRequest, 'posts');
		expect(res.status()).toBe(200);
		const body = (await res.json()) as ListGetResponse;
		expect(body.count).toBe(5);
		expect(Array.isArray(body.results)).toBe(true);
		expect(body.results?.length).toBe(5);
	});

	test('respects limit + skip pagination', async ({ signedInRequest }) => {
		const page1 = await getList(signedInRequest, 'posts', { limit: 2, skip: 0 });
		const page2 = await getList(signedInRequest, 'posts', { limit: 2, skip: 2 });
		expect(page1.status()).toBe(200);
		expect(page2.status()).toBe(200);

		const body1 = (await page1.json()) as ListGetResponse;
		const body2 = (await page2.json()) as ListGetResponse;

		expect(body1.results?.length).toBe(2);
		expect(body2.results?.length).toBe(2);

		// Different pages should return different ids.
		const ids1 = new Set((body1.results ?? []).map((r) => r.id as string));
		const ids2 = new Set((body2.results ?? []).map((r) => r.id as string));
		for (const id of ids2) {
			expect(ids1.has(id)).toBe(false);
		}
	});

	test('search narrows the results', async ({ signedInRequest }) => {
		const res = await getList(signedInRequest, 'posts', { search: 'number 3' });
		expect(res.status()).toBe(200);
		const body = (await res.json()) as ListGetResponse;
		// At least one of the seeded posts contains "number 3" in the title.
		expect((body.results ?? []).length).toBeGreaterThanOrEqual(1);
		const titles = (body.results ?? []).map((r) => r.fields as { title?: string });
		expect(titles.some((f) => f.title?.includes('number 3'))).toBe(true);
	});
});
