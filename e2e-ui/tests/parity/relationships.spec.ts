/**
 * Parity spec: Relationship fields and inverse relationship panels.
 *
 * Verifies that legacy and admin-next agree on seeded relationship values,
 * relationship candidate search behavior, and inverse relationship panels for
 * the Post/User fixture lists.
 */

import type { Page } from '@playwright/test';
import { Types } from 'mongoose';
import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const POST_LIST_KEY = 'Post';
const POST_LIST_PATH = 'posts';
const USER_LIST_KEY = 'User';
const USER_LIST_PATH = 'users';
const ASSIGNMENT_LIST_KEY = 'Assignment';
const ASSIGNMENT_LIST_PATH = 'assignments';

let adminId: string;
let aliceId: string;
let bobId: string;
let postIds: string[];
let assignmentId: string;

function toObjectId(id: string): Types.ObjectId {
	return new Types.ObjectId(id);
}

function legacyAuthorPicker(page: Page) {
	// Single selects render in field order: State, Category, Priority, Author.
	return page.locator('.Select--single').nth(3);
}

function legacyEditorsPicker(page: Page) {
	return page.locator('.Select--multi');
}

function legacySponsorPicker(page: Page) {
	// Single selects render in field order: State, Category, Priority, Author, Sponsor.
	return page.locator('.Select--single').nth(4);
}

function legacyAssignmentAssigneePicker(page: Page) {
	return page.locator('.Select--single').first();
}

function legacyAssignmentReviewersPicker(page: Page) {
	return page.locator('.Select--multi').first();
}

test.beforeEach(async () => {
	const seed = await seedPostsAndEditors();
	adminId = seed.adminId;
	aliceId = seed.aliceId;
	bobId = seed.bobId;
	postIds = seed.postIds;
	assignmentId = seed.assignmentIds[0]!;
});

test.describe('Parity: Relationships', () => {
	test('same item shows matching author and editors in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const postId = postIds[1]!;

		await adminLegacy.gotoItem(POST_LIST_PATH, postId);
		await expect(legacyAuthorPicker(adminLegacy.page)).toContainText('Test Admin');
		await expect(legacyEditorsPicker(adminLegacy.page)).toContainText('Alice Editor');
		await expect(legacyEditorsPicker(adminLegacy.page)).toContainText('Bob Editor');

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await expect(
			adminNext.page.locator('[data-field-relationship-single-value]', { hasText: 'Test Admin' }),
		).toBeVisible();
		await expect(
			adminNext.page.locator('[data-field-relationship-chip]', { hasText: 'Alice Editor' }),
		).toBeVisible();
		await expect(
			adminNext.page.locator('[data-field-relationship-chip]', { hasText: 'Bob Editor' }),
		).toBeVisible();
	});

	test('relationship candidate search excludes already-selected many values', async ({
		adminLegacy,
		adminNext,
	}) => {
		const postId = postIds[1]!;

		await adminLegacy.gotoItem(POST_LIST_PATH, postId);
		await legacyAuthorPicker(adminLegacy.page).locator('.Select-control').click();
		const legacyAuthorMenu = adminLegacy.page.locator('.Select-menu-outer').first();
		await expect(legacyAuthorMenu).toContainText('Test Admin');
		await expect(legacyAuthorMenu).toContainText('Alice Editor');
		await expect(legacyAuthorMenu).toContainText('Bob Editor');

		await adminLegacy.page.keyboard.press('Escape');
		await legacyEditorsPicker(adminLegacy.page).locator('.Select-control').click();
		const legacyEditorsOptions = legacyEditorsPicker(adminLegacy.page).locator('.Select-menu-outer .Select-option');
		await expect(legacyEditorsOptions.filter({ hasText: 'Test Admin' })).toHaveCount(1);
		await expect(legacyEditorsOptions.filter({ hasText: 'Alice Editor' })).toHaveCount(0);
		await expect(legacyEditorsOptions.filter({ hasText: 'Bob Editor' })).toHaveCount(0);

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await adminNext.page.locator('[data-field-relationship-single]').first().click();
		const adminNextAuthorSearch = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes('/keystone-api/User') &&
				r.url().includes('search=Alice') &&
				r.request().method() === 'GET',
		);
		await adminNext.page.locator('input#author').fill('Alice');
		await adminNextAuthorSearch;
		await expect(adminNext.page.locator('[role="listbox"]')).toContainText('Alice Editor');

		await adminNext.page.keyboard.press('Escape');
		await adminNext.page.locator('input#editors').fill('Alice');
		await expect(adminNext.page.locator('[role="listbox"]')).toContainText('No results');
	});

	test('empty optional single and many relationships save and reload in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const postId = postIds[4]!;
		await withMongo((db) =>
			db.collection('Post').updateOne(
				{ _id: toObjectId(postId) },
				{ $unset: { author: '' }, $set: { editors: [] } },
			),
		);

		await adminLegacy.gotoItem(POST_LIST_PATH, postId);
		await expect(legacyAuthorPicker(adminLegacy.page)).not.toContainText('Test Admin');
		await expect(legacyEditorsPicker(adminLegacy.page)).not.toContainText('Alice Editor');
		await expect(legacyEditorsPicker(adminLegacy.page)).not.toContainText('Bob Editor');
		await adminLegacy.saveItem();

		const afterLegacySave = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect(afterLegacySave?.author).toBeUndefined();
		expect(afterLegacySave?.editors).toEqual([]);

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await expect(adminNext.page.locator('[data-field-name="author"] [data-field-relationship-single]'))
			.toHaveAttribute('data-has-value', 'false');
		await expect(adminNext.page.locator('[data-field-name="editors"] [data-field-relationship-chip]'))
			.toHaveCount(0);
		await adminNext.saveItem();

		const afterAdminNextSave = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect(afterAdminNextSave?.author).toBeUndefined();
		expect(afterAdminNextSave?.editors).toEqual([]);

		await adminLegacy.gotoItem(POST_LIST_PATH, postId);
		await expect(legacyAuthorPicker(adminLegacy.page)).not.toContainText('Test Admin');
		await expect(legacyEditorsPicker(adminLegacy.page)).not.toContainText('Alice Editor');
		await expect(legacyEditorsPicker(adminLegacy.page)).not.toContainText('Bob Editor');
	});

	test('legacy single relationship save persists and admin-next reloads it', async ({
		adminLegacy,
		adminNext,
	}) => {
		const postId = postIds[2]!;

		await adminLegacy.gotoItem(POST_LIST_PATH, postId);
		await legacyAuthorPicker(adminLegacy.page).locator('.Select-control').click();
		await adminLegacy.page
			.locator('.Select-menu-outer .Select-option', { hasText: 'Alice Editor' })
			.click();
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect(String(doc?.author)).toBe(aliceId);

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await expect(
			adminNext.page.locator('[data-field-relationship-single-value]', { hasText: 'Alice Editor' }),
		).toBeVisible();
	});

	test('admin-next many relationship remove persists and legacy reloads it', async ({
		adminLegacy,
		adminNext,
	}) => {
		const postId = postIds[1]!;

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await adminNext.page.getByRole('button', { name: /Remove Bob Editor/i }).click();
		await expect(
			adminNext.page.locator('[data-field-relationship-chip]', { hasText: 'Bob Editor' }),
		).toHaveCount(0);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect((doc?.editors as Types.ObjectId[]).map(String).sort()).toEqual([aliceId].sort());
		expect((doc?.editors as Types.ObjectId[]).map(String)).not.toContain(bobId);

		await adminLegacy.gotoItem(POST_LIST_PATH, postId);
		await expect(legacyEditorsPicker(adminLegacy.page)).toContainText('Alice Editor');
		await expect(legacyEditorsPicker(adminLegacy.page)).not.toContainText('Bob Editor');
	});

	test('relationship create-inline creates and selects related items in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const legacyPostId = postIds[3]!;
		const adminNextPostId = postIds[4]!;
		const legacySponsorTitle = `Legacy Inline Sponsor ${Date.now()}`;
		const adminNextSponsorTitle = `Next Inline Sponsor ${Date.now()}`;

		await adminLegacy.gotoItem(POST_LIST_PATH, legacyPostId);
		await adminLegacy.page.getByRole('button', { name: '+', exact: true }).click();
		const legacyCreateModal = adminLegacy.page.locator('[data-create-item-modal]');
		await expect(legacyCreateModal).toBeVisible();
		await legacyCreateModal.locator('input[name="title"]').fill(legacySponsorTitle);
		const legacyCreateResponse = adminLegacy.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes('/keystone-api/sponsors/create') &&
				r.status() === 200,
		);
		await legacyCreateModal.getByRole('button', { name: 'Create', exact: true }).click();
		await legacyCreateResponse;
		await expect(legacySponsorPicker(adminLegacy.page)).toContainText(legacySponsorTitle);
		await adminLegacy.saveItem();

		const legacyDoc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(legacyPostId) }),
		);
		const legacySponsor = await withMongo((db) =>
			db.collection('Sponsor').findOne({ title: legacySponsorTitle }),
		);
		expect(legacySponsor).toBeTruthy();
		expect(String(legacyDoc?.sponsor)).toBe(String(legacySponsor?._id));

		await adminNext.gotoItem(POST_LIST_KEY, adminNextPostId);
		await adminNext.page
			.locator('[data-field-name="sponsor"] [data-field-relationship-create-inline]')
			.click();
		const adminNextCreateModal = adminNext.page.locator('[data-create-item-modal]');
		await expect(adminNextCreateModal).toBeVisible();
		await adminNextCreateModal.locator('input[name="title"]').fill(adminNextSponsorTitle);
		await expect(adminNextCreateModal.locator('input[name="title"]')).toHaveValue(adminNextSponsorTitle);
		const adminNextCreateResponse = adminNext.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes('/keystone-api/') &&
				r.url().includes('/create'),
		);
		await adminNextCreateModal.locator('[data-create-item-submit]').click();
		const adminNextCreateResult = await adminNextCreateResponse;
		expect(adminNextCreateResult.status()).toBe(200);
		await expect(
			adminNext.page.locator('[data-field-name="sponsor"] [data-field-relationship-single-value]'),
		).toContainText(adminNextSponsorTitle);
		const adminNextSponsor = await withMongo((db) =>
			db.collection('Sponsor').findOne({ title: adminNextSponsorTitle }),
		);
		expect(adminNextSponsor).toBeTruthy();
		const adminNextUpdateRequest = adminNext.page.waitForRequest(
			(r) =>
				r.method() === 'POST' &&
				r.url().includes(`/keystone-api/${POST_LIST_KEY}/${adminNextPostId}`),
		);
		await adminNext.saveItem();
		const adminNextUpdatePayload = JSON.parse((await adminNextUpdateRequest).postData() ?? '{}');
		expect(adminNextUpdatePayload.sponsor).toBe(String(adminNextSponsor?._id));

		const adminNextDoc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(adminNextPostId) }),
		);
		expect(String(adminNextDoc?.sponsor)).toBe(String(adminNextSponsor?._id));
	});

	test('inverse relationship panels show matching authored and editing totals', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(USER_LIST_PATH, adminId);
		await expect(adminLegacy.page.getByText(/^Relationships$/i)).toBeVisible();
		await expect(adminLegacy.page.locator('h3', { hasText: /^Posts$/i })).toHaveCount(1);
		await expect(adminLegacy.page.locator('h3', { hasText: /^Editing$/i })).toHaveCount(1);
		await expect(adminLegacy.page.locator('text=Smoke Test Post')).toHaveCount(25);
		await expect(adminLegacy.page.getByText(/No related posts/i)).toBeVisible();

		await adminNext.gotoItem(USER_LIST_KEY, adminId);
		const adminNextAuthoredPanel = adminNext.page.locator('[data-inverse-panel][data-rel-path="posts"]');
		const adminNextEditingPanel = adminNext.page.locator('[data-inverse-panel][data-rel-path="editing"]');
		await expect(adminNextAuthoredPanel).toBeVisible();
		await expect(adminNextEditingPanel).toBeVisible();
		await expect(adminNextAuthoredPanel.locator('[data-inverse-table] tbody tr')).toHaveCount(10);
		await expect(adminNextAuthoredPanel.locator('[data-pagination]')).toContainText('25 total');
		await expect(adminNextEditingPanel).toContainText(/No related posts/i);

		await adminLegacy.gotoItem(USER_LIST_PATH, aliceId);
		await expect(adminLegacy.page.getByText(/^Relationships$/i)).toBeVisible();
		await expect(adminLegacy.page.getByText(/No related posts/i)).toBeVisible();
		await expect(adminLegacy.page.locator('text=Smoke Test Post')).toHaveCount(20);

		await adminNext.gotoItem(USER_LIST_KEY, aliceId);
		const aliceAuthoredPanel = adminNext.page.locator('[data-inverse-panel][data-rel-path="posts"]');
		const aliceEditingPanel = adminNext.page.locator('[data-inverse-panel][data-rel-path="editing"]');
		await expect(aliceAuthoredPanel).toContainText(/No related posts/i);
		await expect(aliceEditingPanel.locator('[data-inverse-table] tbody tr')).toHaveCount(10);
		await expect(aliceEditingPanel.locator('[data-pagination]')).toContainText('20 total');
	});

	test('inverse relationship panel item links navigate to the related item in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const authoredPostId = postIds[0]!;

		await adminLegacy.gotoItem(USER_LIST_PATH, adminId);
		const legacyRelatedRow = adminLegacy.page.locator(
			`[data-related-list-row][data-item-id="${authoredPostId}"]`,
		);
		await expect(legacyRelatedRow).toBeVisible();
		await legacyRelatedRow.getByRole('link').first().click();
		await expect(adminLegacy.page).toHaveURL(new RegExp(`/keystone/${POST_LIST_PATH}/${authoredPostId}(\\?|$)`));
		await expect(adminLegacy.page.locator('[data-screen-id="item"]')).toBeVisible();

		await adminNext.gotoItem(USER_LIST_KEY, adminId);
		const adminNextAuthoredPanel = adminNext.page.locator('[data-inverse-panel][data-rel-path="posts"]');
		await expect(adminNextAuthoredPanel).toBeVisible();
		await adminNextAuthoredPanel.locator(`[data-item-id="${authoredPostId}"]`).click();
		await expect(adminNext.page).toHaveURL(new RegExp(`/keystone-next/${POST_LIST_PATH}/${authoredPostId}(\\?|$)`));
		await expect(adminNext.page.locator('[data-item-form]')).toBeVisible();
	});

	test('admin-next inverse relationship Add Item preselects the parent relationship', async ({
		adminNext,
	}) => {
		const title = `Inverse Add Item ${Date.now()}`;

		await adminNext.gotoItem(USER_LIST_KEY, adminId);
		const authoredPanel = adminNext.page.locator('[data-inverse-panel][data-rel-path="posts"]');
		await expect(authoredPanel).toBeVisible();
		await authoredPanel.locator('[data-add-item]').click();
		await expect(adminNext.page).toHaveURL(new RegExp(`/keystone-next/${POST_LIST_PATH}\\?`));
		const currentUrl = new URL(adminNext.page.url());
		expect(currentUrl.searchParams.get('create')).toBe('true');
		expect(currentUrl.searchParams.get('f.author')).toBe(adminId);

		const modal = adminNext.page.locator('[data-create-item-modal]');
		await expect(modal).toBeVisible();
		await modal.locator('input[name="title"]').fill(title);
		const createResponse = adminNext.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes('/keystone-api/Post/create') &&
				r.status() === 200,
		);
		await modal.locator('[data-create-item-submit]').click();
		await createResponse;

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ title }),
		);
		expect(doc).toBeTruthy();
		expect(String(doc?.author)).toBe(adminId);
	});

	test('admin-next inverse relationship panel search preserves parent filtering', async ({
		adminNext,
	}) => {
		await adminNext.gotoItem(USER_LIST_KEY, adminId);
		const authoredPanel = adminNext.page.locator('[data-inverse-panel][data-rel-path="posts"]');
		await expect(authoredPanel).toBeVisible();
		await expect(authoredPanel.locator('[data-inverse-table] tbody tr')).toHaveCount(10);

		const searchResponse = adminNext.page.waitForResponse((response) => {
			const url = new URL(response.url());
			return url.pathname.includes('/keystone-api/Post') &&
				url.searchParams.get('search') === 'Smoke Test Post 01' &&
				url.searchParams.has('filters') &&
				response.request().method() === 'GET' &&
				response.status() === 200;
		});
		await authoredPanel.locator('[data-inverse-search]').fill('Smoke Test Post 01');
		await searchResponse;
		await expect(authoredPanel.locator('[data-inverse-table] tbody tr')).toHaveCount(1);
		await expect(authoredPanel.locator('[data-inverse-table]')).toContainText('Smoke Test Post 01');
		await expect(authoredPanel.locator('[data-pagination]')).toHaveCount(0);

		await authoredPanel.locator('[data-inverse-search]').fill('does-not-match-related-posts');
		await expect(authoredPanel).toContainText('No related posts matching does-not-match-related-posts...');
		await expect(authoredPanel.locator('[data-inverse-table]')).toHaveCount(0);
	});

	test('sortable inverse relationship panels preserve parent filtering while reordering', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(USER_LIST_PATH, adminId);
		await expect(adminLegacy.page.locator('h3', { hasText: /^Sortable Items$/i })).toBeVisible();
		await expect(adminLegacy.page.locator('[data-list-row-control="sortable"]')).toHaveCount(5);

		await adminNext.gotoItem(USER_LIST_KEY, adminId);
		const sortablePanel = adminNext.page.locator('[data-inverse-panel][data-rel-path="sortableItems"]');
		await expect(sortablePanel).toBeVisible();
		await expect(sortablePanel.locator('[data-inverse-table] tbody tr')).toHaveCount(5);
		await expect(sortablePanel.locator('[data-inverse-table] tbody tr').nth(0)).toContainText('Sortable Item 01');
		await expect(sortablePanel.locator('[data-inverse-table] tbody tr').nth(1)).toContainText('Sortable Item 02');

		const sortableItem02 = await withMongo((db) =>
			db.collection('SortableItem').findOne({ name: 'Sortable Item 02' }),
		);
		expect(sortableItem02).toBeTruthy();
		const reorderResponse = adminNext.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes(`/keystone-api/SortableItem/${String(sortableItem02?._id)}/sortOrder/`) &&
				r.url().includes('filters=') &&
				r.status() === 200,
		);
		await sortablePanel.locator('[data-inverse-table] tbody tr').nth(1).locator('[data-inverse-sort-up]').click();
		await reorderResponse;

		await expect(sortablePanel.locator('[data-inverse-table] tbody tr').nth(0)).toContainText('Sortable Item 02');
		await expect(sortablePanel.locator('[data-inverse-table] tbody tr').nth(1)).toContainText('Sortable Item 01');

		const reordered = await withMongo((db) =>
			db.collection('SortableItem')
				.find({ owner: toObjectId(adminId) })
				.sort({ sortOrder: 1 })
				.project({ name: 1 })
				.toArray(),
		);
		expect(reordered.map((item) => item.name).slice(0, 2)).toEqual([
			'Sortable Item 02',
			'Sortable Item 01',
		]);
	});

	test('legacy required relationship validation preserves stored values', async ({
		adminLegacy,
	}) => {
		await adminLegacy.gotoItem(ASSIGNMENT_LIST_PATH, assignmentId);
		await legacyAssignmentAssigneePicker(adminLegacy.page).locator('.Select-clear-zone').click();
		await legacyAssignmentReviewersPicker(adminLegacy.page).locator('.Select-value-icon').click();

		const response = adminLegacy.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes('/keystone-api/assignments/') &&
				r.status() === 400,
		);
		await adminLegacy.page.getByRole('button', { name: /^Save$/ }).click();
		await response;

		await expect(adminLegacy.page.locator('[data-alert-type="danger"]')).toContainText('Assignee is required');
		await expect(adminLegacy.page.locator('[data-alert-type="danger"]')).toContainText('Reviewers is required');

		const doc = await withMongo((db) =>
			db.collection('Assignment').findOne({ _id: toObjectId(assignmentId) }),
		);
		expect(String(doc?.assignee)).toBe(adminId);
		expect((doc?.reviewers as Types.ObjectId[]).map(String)).toEqual([adminId]);
	});

	test('admin-next required relationship validation preserves stored values', async ({
		adminNext,
	}) => {
		await adminNext.gotoItem(ASSIGNMENT_LIST_KEY, assignmentId);
		await adminNext.page.getByRole('button', { name: /Remove Test Admin/i }).first().click();
		await adminNext.page.getByRole('button', { name: /Remove Test Admin/i }).first().click();

		const response = adminNext.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes('/keystone-api/Assignment/') &&
				r.status() === 400,
		);
		await adminNext.page.getByRole('button', { name: /^Save$/ }).click();
		await response;

		await expect(adminNext.page.getByRole('alert').filter({ hasText: 'Assignee is required' })).toBeVisible();
		await expect(adminNext.page.getByRole('alert').filter({ hasText: 'Reviewers is required' })).toBeVisible();
		await expect(adminNext.page.getByRole('status')).toContainText('Save failed');

		const doc = await withMongo((db) =>
			db.collection('Assignment').findOne({ _id: toObjectId(assignmentId) }),
		);
		expect(String(doc?.assignee)).toBe(adminId);
		expect((doc?.reviewers as Types.ObjectId[]).map(String)).toEqual([adminId]);
	});
});
