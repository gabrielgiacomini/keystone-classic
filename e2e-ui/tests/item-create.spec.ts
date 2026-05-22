/**
 * Section D — Item create.
 *
 * The smoke runbook deferred the "valid create" half of section D
 * because Chrome MCP can't reliably populate React-15 controlled
 * inputs. Playwright's `fill()` works around that — so this spec
 * exercises BOTH paths:
 *   1. empty submit blocked, no Mongo write, modal stays open;
 *   2. typed Title, click Create, redirects to /keystone/posts/<id>
 *      and the doc lands in Mongo with the auto-generated slug.
 */

import { test, expect } from '../fixtures/auth.js';
import { resetWithoutPosts, withMongo } from '../fixtures/seed.js';
import { ADMIN_LEGACY_PATH, API_BASE } from '../fixtures/constants.js';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
	await resetWithoutPosts();
});

test.describe('D. Item create', () => {
	test('empty submit is blocked (no doc, modal stays open)', async ({ signedInPage }) => {
		const page = signedInPage;
		const before = await withMongo((db) => db.collection('Post').countDocuments());

		await page.goto(`/${ADMIN_LEGACY_PATH}/posts`);
		// Open the create modal via the toolbar button.
		await page.getByRole('button', { name: /Create Post/i }).click();
		// The modal renders one input — Title is the only initial field
		// on Post. Wait for it to mount.
		const titleInput = page
			.locator('input[name="title"], input[id="title"]')
			.first();
		await expect(titleInput).toBeVisible();

		// Click Create with Title blank. The /create POST should fail
		// validation server-side; we wait for the response so we can
		// assert on its status without a fixed timer.
		const createPromise = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts/create`)
				&& r.request().method() === 'POST',
		);
		// The modal renders a Create button — pick the one inside the
		// open dialog. There's no Create button on the list view itself
		// (toolbar uses "+ Create Post" with a leading glyph), so an
		// exact "Create" match is unambiguous.
		await page.getByRole('button', { name: 'Create', exact: true }).click();
		const res = await createPromise;
		expect(res.status()).toBe(400);

		// Modal should still be open (Title input still visible) and
		// no doc inserted.
		await expect(titleInput).toBeVisible();
		const after = await withMongo((db) => db.collection('Post').countDocuments());
		expect(after).toBe(before);
	});

	test('typed Title creates the post and redirects to /keystone/posts/<id>', async ({
		signedInPage,
	}) => {
		const page = signedInPage;
		const TITLE = 'Playwright Created Post';

		await page.goto(`/${ADMIN_LEGACY_PATH}/posts`);
		await page.getByRole('button', { name: /Create Post/i }).click();

		const titleInput = page
			.locator('input[name="title"], input[id="title"]')
			.first();
		await expect(titleInput).toBeVisible();
		await titleInput.fill(TITLE);

		const createPromise = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts/create`)
				&& r.request().method() === 'POST',
		);
		await page.getByRole('button', { name: 'Create', exact: true }).click();
		const res = await createPromise;
		expect(res.status()).toBe(200);
		const body = (await res.json()) as { id?: string };
		expect(body.id).toMatch(/^[0-9a-f]{24}$/);

		// Redirect to /keystone/posts/<id>. URL shape only — exact
		// query params are not load-bearing here.
		await expect(page).toHaveURL(
			new RegExp(`/${ADMIN_LEGACY_PATH}/posts/${body.id ?? '[0-9a-f]{24}'}(\\?|$)`),
		);

		// Mongo: doc exists with the typed title and an auto-generated
		// slug ('playwright-created-post' from `autokey: { from: title }`).
		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: { $exists: true }, title: TITLE }),
		);
		expect(doc).not.toBeNull();
		expect(doc?.slug).toBe('playwright-created-post');
	});
});
