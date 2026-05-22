/**
 * Section E — Item edit (all field types) + delete.
 *
 * This spec exercises the admin legacy's per-item edit screen. The
 * runbook describes verifying that all 7 Post field types render —
 * Title (Text), State (Select), Author (Relationship), Editors
 * (Relationship many), Content (Text), View Count (Number), Featured
 * (Boolean), Published At (Date), Category (Select), Priority (Select),
 * Reviewed At (Datetime).
 *
 * Save round-trip: flip the Featured boolean, click Save, refetch the
 * doc from the JSON API, assert `featured: true`.
 *
 * Delete: click "delete post" in the EditForm footer, confirm in the
 * modal, assert redirect to /keystone/posts and Mongo doc gone.
 */

import { test, expect } from '../fixtures/auth.js';
import { seedPostsAndEditors, withMongo } from '../fixtures/seed.js';
import { ADMIN_LEGACY_PATH, API_BASE } from '../fixtures/constants.js';

test.describe.configure({ mode: 'serial' });

let firstPostId: string;
let lastPostId: string;

test.beforeAll(async () => {
	const seed = await seedPostsAndEditors();
	// Spec uses two distinct posts so the save and delete tests don't
	// race each other.
	firstPostId = seed.postIds[0]!;
	lastPostId = seed.postIds[seed.postIds.length - 1]!;
});

test.describe('E. Item edit', () => {
	test('all 7 field types render on a Post detail screen', async ({ signedInPage }) => {
		const page = signedInPage;
		// Set up the response listener BEFORE navigating — otherwise
		// we miss the GET fired during page load.
		const itemLoad = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts/${firstPostId}`)
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts/${firstPostId}`);
		await itemLoad;

		// Each field renders a label (`<label>` or visible heading) +
		// its input. Assert on the label text — that's stable across
		// component-level CSS changes.
		const expectedLabels = [
			'Title',
			'State',
			'Category',
			'Priority',
			'Author',
			'Editors',
			'Content',
			'View Count',
			'Featured',
			'Published At',
			'Reviewed At',
		];
		for (const label of expectedLabels) {
			await expect(
				page.locator(`label:has-text("${label}")`).first(),
				`label "${label}" should render`,
			).toBeVisible();
		}

		// Smoke-check the actual inputs that back each label render.
		// Title is a Text input; Content is a Text input; View Count is
		// a Number input. State is a react-select v1 single. Author is
		// also single-relationship react-select. Editors is multi.
		// Featured is a Checkbox. Published At is a date input.
		await expect(page.locator('input[name="title"]')).toBeVisible();
		await expect(page.locator('input[name="content"]')).toBeVisible();
		await expect(page.locator('input[name="viewCount"]')).toBeVisible();
		// Four react-select singles render: State, Category, Priority, Author.
		await expect(page.locator('.Select--single')).toHaveCount(4);
		// Exactly one react-select multi: Editors.
		await expect(page.locator('.Select--multi')).toHaveCount(1);
		// Featured: BooleanField renders a wrapper div with data-attrs
		// + a hidden form input + a styled `Checkbox` (which is a
		// <button>, not <input type="checkbox">). Assert on the wrapper
		// + hidden input — that's the stable contract.
		await expect(
			page.locator('[data-field-name="featured"][data-field-type="boolean"]'),
		).toBeVisible();
		await expect(page.locator('input[name="featured"][type="hidden"]')).toBeAttached();
		// PublishedAt: the DateInput renders an `<input>` with placeholder
		// like "YYYY-MM-DD" or attribute name="publishedAt".
		await expect(page.locator('input[name="publishedAt"]')).toBeVisible();
	});

	test('flipping Featured saves and round-trips via the JSON API', async ({
		signedInPage,
	}) => {
		const page = signedInPage;
		// Use the LAST seeded post — the first one is reserved for the
		// "render" assertions above (in case any spec ever changes it).
		const itemLoad = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts/${lastPostId}`)
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts/${lastPostId}`);
		await itemLoad;

		// Read the current featured state from Mongo so the assertion
		// is stable regardless of seeded distribution. (i=25 → i%4!==0
		// → seeded featured: false; flipping makes it true.)
		const before = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(lastPostId) }),
		);
		expect(before).not.toBeNull();
		const wasFeatured = Boolean(before?.featured);

		// The BooleanField renders a hidden input + a styled <button>
		// (Checkbox component) inside `<div data-field-name="featured">`.
		// The button toggles state via React onChange. Click it once to
		// flip — independent of seeded value.
		const featuredWrapper = page.locator(
			'[data-field-name="featured"][data-field-type="boolean"]',
		);
		await expect(featuredWrapper).toBeVisible();
		await featuredWrapper.locator('button').first().click();

		// Click Save. The button is in EditForm — labelled "Save". A
		// successful save POSTs to /keystone-api/posts/<id>.
		const savePromise = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts/${lastPostId}`)
				&& r.request().method() === 'POST',
		);
		await page.getByRole('button', { name: /^Save$/ }).click();
		const saveRes = await savePromise;
		expect(saveRes.status()).toBe(200);

		// Re-fetch via Mongo (instead of the JSON API) — same source of
		// truth, no extra session roundtrip needed.
		const after = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(lastPostId) }),
		);
		expect(Boolean(after?.featured)).toBe(!wasFeatured);
	});

	test('delete removes the post and redirects to /keystone/posts', async ({
		signedInPage,
	}) => {
		const page = signedInPage;
		// Pick the SECOND seeded post (the runbook deletes "any
		// existing post"). We avoided first/last because they're owned
		// by the render and save tests above.
		const targetId = await withMongo(async (db) => {
			const docs = await db
				.collection('Post')
				.find()
				.sort({ _id: 1 })
				.limit(2)
				.toArray();
			// docs[1] is the second post. Skip docs[0] = firstPostId.
			return docs[1]?._id?.toString();
		});
		expect(targetId).toBeTruthy();
		const itemLoad = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts/${targetId}`)
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts/${targetId}`);
		await itemLoad;

		// EditForm renders a "delete post" link/button at the bottom
		// right. The exact label is "delete post" (lowercase, see
		// admin/client-legacy/App/screens/Item/components/EditForm.mjs).
		await page
			.getByRole('button', { name: /^delete post$/i })
			.first()
			.click();

		// Confirmation dialog body text.
		await expect(page.getByText(/Are you sure you want to delete/i)).toBeVisible();

		// Item-detail delete actually goes through the legacy
		// `List.deleteItems` helper, which POSTs to `/api/:list/delete`
		// (NOT `/api/:list/:id/delete`). The runbook glosses over this
		// — both endpoints exist server-side, but the client uses the
		// list-level one. See `admin/client-legacy/utils/List.mjs:295`.
		const deletePromise = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/posts/delete`)
				&& r.request().method() === 'POST',
		);
		// Dialog confirm — the modal's primary action is "Delete"
		// (exact match, no glyph prefix — same idiom as section C).
		await page.getByRole('button', { name: 'Delete', exact: true }).click();
		await deletePromise;

		// Redirect to /keystone/posts (not /<id>). URL-shape match.
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/posts/?(\\?|$)`));

		// Mongo: doc gone.
		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(targetId!) }),
		);
		expect(doc).toBeNull();
	});
});

/**
 * Convert a 24-char hex string into a mongo ObjectId. Local helper to
 * keep the spec dependency surface narrow (no `bson` import).
 */
import { Types } from 'mongoose';
function toObjectId (id: string): Types.ObjectId {
	return new Types.ObjectId(id);
}
