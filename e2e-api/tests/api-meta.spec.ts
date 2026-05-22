/**
 * API meta-smoke specs — lightweight checks against the broader admin
 * surface that don't fit cleanly under auth/list/item.
 */

import { test, expect } from '../fixtures/auth.js';
import { API_BASE } from '../fixtures/server.js';
import { resetDb } from '../fixtures/seedDb.js';

test.beforeAll(async ({ request }) => {
	await resetDb(request);
});

test.describe('admin meta', () => {
	test('signin page returns HTML 200 (server is reachable)', async ({
		anonRequest,
	}) => {
		const res = await anonRequest.get('/keystone/signin', {
			headers: { Accept: 'text/html' },
		});
		expect(res.status()).toBe(200);
		const text = await res.text();
		expect(text.length).toBeGreaterThan(0);
	});

	test('GET /api/counts returns the registered list counts', async ({
		signedInRequest,
	}) => {
		const res = await signedInRequest.get(`${API_BASE}/counts`);
		expect(res.status()).toBe(200);
		const body = (await res.json()) as { counts: Record<string, number> };
		expect(body.counts).toBeDefined();
		expect(typeof body.counts.User).toBe('number');
		expect(typeof body.counts.Post).toBe('number');
		// Seed left a single admin user behind.
		expect(body.counts.User).toBeGreaterThanOrEqual(1);
	});

	test('unknown list returns an error response', async ({ signedInRequest }) => {
		const res = await signedInRequest.get(`${API_BASE}/no-such-list`);
		// keystone.list() throws ReferenceError on unknown keys; Express
		// surfaces it as 500. Either 4xx or 5xx is acceptable here — the
		// contract is "not 200" and "no item data".
		expect(res.status()).toBeGreaterThanOrEqual(400);
		expect(res.status()).not.toBe(200);
	});

	test('list-create requires authentication', async ({ anonRequest }) => {
		const res = await anonRequest.post(`${API_BASE}/posts/create`, {
			data: { title: 'unauthenticated', state: 'draft' },
		});
		// The signin gate kicks in before the list handler. Keystone
		// redirects unauthenticated admin requests to /signin (302) or
		// rejects them outright. Either way, no 200.
		expect(res.status()).not.toBe(200);
	});
});
