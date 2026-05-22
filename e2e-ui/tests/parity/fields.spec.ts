/**
 * Parity spec: admin next field behavior (P4-31).
 *
 * These tests drive admin next against the real Keystone API and
 * verify saved state through MongoDB so field widgets cannot pass by only
 * updating local React state.
 */

import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';
import {
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from '../../fixtures/constants.js';

test.describe.configure({ mode: 'serial' });

const POST_LIST_KEY = 'Post';
const USER_LIST_KEY = 'User';
const TEMP_PASSWORD = 'temp-admin-next-password-789';

function toObjectId(id: string): Types.ObjectId {
	return new Types.ObjectId(id);
}

function pad(value: number): string {
	return String(value).padStart(2, '0');
}

function formatDateInputValue(value: unknown): string {
	return value instanceof Date ? value.toISOString().slice(0, 10) : '';
}

function formatDatetimeLocalValue(value: unknown): string {
	if (!(value instanceof Date)) return '';
	return [
		value.getFullYear(),
		'-',
		pad(value.getMonth() + 1),
		'-',
		pad(value.getDate()),
		'T',
		pad(value.getHours()),
		':',
		pad(value.getMinutes()),
	].join('');
}

test.describe('Parity: admin next field behavior', () => {
	test('relationship single and many fields save ids and reload labels', async ({ adminNext }) => {
		const seed = await seedPostsAndEditors();
		const postId = seed.postIds[1]!;

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		// Scope label assertions to the relationship widgets (the page footer
		// also shows the signed-in user "Test Admin", which would trigger a
		// strict-mode violation against a page-wide getByText).
		await expect(
			adminNext.page.locator('[data-field-relationship-single-value]', { hasText: 'Test Admin' }),
		).toBeVisible();
		await expect(
			adminNext.page.locator('[data-field-relationship-chip]', { hasText: 'Alice Editor' }),
		).toBeVisible();
		await expect(
			adminNext.page.locator('[data-field-relationship-chip]', { hasText: 'Bob Editor' }),
		).toBeVisible();

		// Single-relationship widgets only mount their search input after the
		// trigger is opened; click the [data-field-relationship-single] container
		// so the input#author appears.
		await adminNext.page.locator('[data-field-relationship-single]').first().click();
		const authorSearch = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes('/keystone-api/User')
				&& r.url().includes('search=Alice')
				&& r.request().method() === 'GET',
		);
		await adminNext.page.locator('input#author').fill('Alice');
		await authorSearch;
		await adminNext.page
			.locator('[role="listbox"] [role="option"] button', { hasText: 'Alice Editor' })
			.click();

		await adminNext.page.locator('input#editors').fill('Alice');
		await expect(adminNext.page.locator('[role="listbox"]')).toContainText('No results');

		await adminNext.page.locator('input#editors').fill('');
		await adminNext.page.getByRole('button', { name: /Remove Bob Editor/i }).click();
		await expect(
			adminNext.page.locator('[data-field-relationship-chip]', { hasText: 'Bob Editor' }),
		).toHaveCount(0);

		const bobSearch = adminNext.page.waitForResponse(
			(r) =>
				r.url().includes('/keystone-api/User')
				&& r.url().includes('search=Bob')
				&& r.request().method() === 'GET',
		);
		await adminNext.page.locator('input#editors').fill('Bob');
		await bobSearch;
		await adminNext.page
			.locator('[role="listbox"] [role="option"] button', { hasText: 'Bob Editor' })
			.click();

		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect(String(doc?.author)).toBe(seed.aliceId);
		expect((doc?.editors as Types.ObjectId[]).map(String).sort()).toEqual(
			[seed.aliceId, seed.bobId].sort(),
		);

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await expect(
			adminNext.page.locator('[data-field-relationship-chip]', { hasText: 'Alice Editor' }),
		).toBeVisible();
		await expect(
			adminNext.page.locator('[data-field-relationship-chip]', { hasText: 'Bob Editor' }),
		).toBeVisible();
	});

	test('select empty, text, and numeric values round-trip', async ({ adminNext }) => {
		const seed = await seedPostsAndEditors();
		const postId = seed.postIds[0]!;

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await expect(adminNext.page.locator('select#state')).toHaveValue('published');
		await expect(adminNext.page.locator('select#category')).toHaveValue('guide');
		await expect(adminNext.page.locator('select#priority')).toHaveValue('2');

		await adminNext.page.locator('select#state').selectOption('archived');
		await adminNext.page.locator('select#category').selectOption('');
		await adminNext.page.locator('select#priority').selectOption('3');
		await adminNext.saveItem();

		let doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect(doc?.state).toBe('archived');
		expect(doc?.category ?? '').toBe('');
		expect(doc?.priority).toBe(3);

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await expect(adminNext.page.locator('select#state')).toHaveValue('archived');
		await expect(adminNext.page.locator('select#category')).toHaveValue('');
		await expect(adminNext.page.locator('select#priority')).toHaveValue('3');

		await adminNext.page.locator('select#category').selectOption('news');
		await adminNext.saveItem();

		doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect(doc?.category).toBe('news');

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await expect(adminNext.page.locator('select#category')).toHaveValue('news');
	});

	test('date and datetime inputs normalize on load and round-trip after save', async ({ adminNext }) => {
		const seed = await seedPostsAndEditors();
		const postId = seed.postIds[0]!;

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		// Date field renders a single YYYY-MM-DD input (parity with legacy).
		await expect(adminNext.page.locator('input#publishedAt')).toHaveValue(/\d{4}-\d{2}-\d{2}/);
		// Datetime field renders a date input + a time input (parity with the
		// legacy admin's DatetimeField, which also split the value into two
		// inputs). The date input keeps the `id={fieldName}` for label binding.
		const reviewedDate = adminNext.page.locator('input[data-field-datetime-date][name="reviewedAt_date"]');
		const reviewedTime = adminNext.page.locator('input[data-field-datetime-time][name="reviewedAt_time"]');
		await expect(reviewedDate).toHaveValue(/^\d{4}-\d{2}-\d{2}$/);
		await expect(reviewedTime).toHaveValue(/^\d{1,2}:\d{2}(?::\d{2})?\s*(am|pm)$/i);

		await adminNext.page.locator('input#publishedAt').fill('2026-05-05');
		await reviewedDate.fill('2026-05-05');
		// Use 12-hour format with seconds — the widget accepts both 12h and 24h.
		await reviewedTime.fill('9:15:00 am');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect(formatDateInputValue(doc?.publishedAt)).toBe('2026-05-05');
		expect(formatDatetimeLocalValue(doc?.reviewedAt)).toBe('2026-05-05T09:15');

		await adminNext.gotoItem(POST_LIST_KEY, postId);
		await expect(adminNext.page.locator('input#publishedAt')).toHaveValue('2026-05-05');
		await expect(adminNext.page.locator('input[data-field-datetime-date][name="reviewedAt_date"]'))
			.toHaveValue('2026-05-05');
		await expect(adminNext.page.locator('input[data-field-datetime-time][name="reviewedAt_time"]'))
			.toHaveValue(/^9:15:00\s*am$/i);
	});

	test('password change uses confirmation and never renders the stored hash', async ({ adminNext }) => {
		const seed = await seedPostsAndEditors();
		const adminId = seed.adminId;
		const originalHash = await withMongo(async (db) => {
			const admin = await db.collection('User').findOne({ _id: toObjectId(adminId) });
			return String(admin?.password ?? '');
		});

		try {
			await adminNext.gotoItem(USER_LIST_KEY, adminId);
			await expect(adminNext.page.getByText(originalHash, { exact: true })).toHaveCount(0);
			const changePassword = adminNext.page.getByRole('button', { name: /Change Password/i });
			if (await changePassword.count()) {
				await changePassword.click();
			}

			const newPassword = adminNext.page.locator('input[name="password"]');
			const confirmPassword = adminNext.page.locator('input[name="password_confirm"]');
			await expect(newPassword).toBeVisible();
			await expect(confirmPassword).toBeVisible();
			await newPassword.fill(TEMP_PASSWORD);
			await confirmPassword.fill(TEMP_PASSWORD);

			await adminNext.saveItem();

			const stored = await withMongo((db) =>
				db.collection('User').findOne({ _id: toObjectId(adminId) }),
			);
			expect(await bcrypt.compare(TEST_ADMIN_PASSWORD, String(stored?.password ?? ''))).toBe(false);
			expect(await bcrypt.compare(TEMP_PASSWORD, String(stored?.password ?? ''))).toBe(true);
		} finally {
			const hash = await bcrypt.hash(TEST_ADMIN_PASSWORD, 10);
			await withMongo((db) =>
				db
					.collection('User')
					.updateOne({ email: TEST_ADMIN_EMAIL }, { $set: { password: hash } }),
			);
		}
	});
});
