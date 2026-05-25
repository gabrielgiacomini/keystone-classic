/**
 * Date picker operations across all legacy fields that embed DayPicker.
 *
 * Covers creating and editing items with Date, Datetime, and DateArray fields,
 * plus the Date and DateArray list-filter popouts. The assertions intentionally
 * check both interaction behavior and persistence so regressions where the
 * popout renders but clicks are swallowed do not pass.
 */

import type * as playwright from '@playwright/test';
import { Types } from 'mongoose';
import { test, expect } from '../fixtures/auth.js';
import { seedPostsAndEditors, withMongo } from '../fixtures/seed.js';
import { ADMIN_LEGACY_PATH, API_BASE } from '../fixtures/constants.js';

test.describe.configure({ mode: 'serial', timeout: 60_000 });

let postId: string;

test.beforeAll(async () => {
	const seed = await seedPostsAndEditors();
	postId = seed.postIds[0]!;
});

function toObjectId (id: string): Types.ObjectId {
	return new Types.ObjectId(id);
}

function waitForPostLoad (page: playwright.Page, id = postId) {
	return page.waitForResponse(
		(r) =>
			r.url().includes(`${API_BASE}/posts/${id}`)
			&& r.request().method() === 'GET'
			&& r.status() === 200,
	);
}

function waitForListLoad (page: playwright.Page) {
	return page.waitForResponse(
		(r) =>
			r.url().includes(`${API_BASE}/posts`)
			&& r.request().method() === 'GET'
			&& r.status() === 200,
	);
}

async function openPost (page: playwright.Page, id = postId) {
	const itemLoad = waitForPostLoad(page, id);
	await page.goto(`/${ADMIN_LEGACY_PATH}/posts/${id}`);
	await itemLoad;
}

async function savePost (page: playwright.Page, id = postId) {
	const savePromise = page.waitForResponse(
		(r) =>
			r.url().includes(`${API_BASE}/posts/${id}`)
			&& r.request().method() === 'POST',
	);
	await page.getByRole('button', { name: /^Save$/ }).click();
	const saveRes = await savePromise;
	expect(saveRes.status()).toBe(200);
}

async function expectPickerGridAndNav (picker: playwright.Locator) {
	await expect(picker).toBeVisible();
	const firstWeekDays = picker.locator('.DayPicker-Week').first().locator('.DayPicker-Day');
	await expect(firstWeekDays).toHaveCount(7);
	const boxes = await firstWeekDays.evaluateAll((days) =>
		days.map((day) => {
			const rect = day.getBoundingClientRect();
			return { left: rect.left, top: rect.top, width: rect.width };
		}),
	);
	expect(boxes[1]?.top).toBe(boxes[0]?.top);
	expect((boxes[6]?.left ?? 0) - (boxes[0]?.left ?? 0))
		.toBeGreaterThan((boxes[0]?.width ?? 0) * 4);

	const caption = await picker.locator('.DayPicker-Caption').textContent();
	expect(caption).toBeTruthy();
	await picker.locator('.DayPicker-NavButton--next').click();
	await expect(picker).toBeVisible();
	await expect(picker.locator('.DayPicker-Caption')).not.toHaveText(caption!);
	await picker.locator('.DayPicker-NavButton--prev').click();
	await expect(picker.locator('.DayPicker-Caption')).toHaveText(caption!);
}

async function selectVisibleDay (picker: playwright.Locator, day: string) {
	await picker
		.locator('.DayPicker-Day:not(.DayPicker-Day--outside)')
		.filter({ hasText: new RegExp(`^${day}$`) })
		.first()
		.click();
}

async function expectControlsShareRow (
	dateInput: playwright.Locator,
	timeInput: playwright.Locator,
	nowButton: playwright.Locator,
) {
	const [dateBox, timeBox, buttonBox] = await Promise.all([
		dateInput.boundingBox(),
		timeInput.boundingBox(),
		nowButton.boundingBox(),
	]);
	expect(dateBox).toBeTruthy();
	expect(timeBox).toBeTruthy();
	expect(buttonBox).toBeTruthy();
	expect(Math.abs(dateBox!.y - timeBox!.y)).toBeLessThanOrEqual(2);
	expect(Math.abs(dateBox!.y - buttonBox!.y)).toBeLessThanOrEqual(2);
	expect(timeBox!.x).toBeGreaterThan(dateBox!.x + dateBox!.width);
	expect(buttonBox!.x).toBeGreaterThan(timeBox!.x + timeBox!.width);
}

function filtersParam (filters: Array<Record<string, unknown>>): string {
	return encodeURIComponent(JSON.stringify(filters));
}

async function createPost (page: playwright.Page, title: string): Promise<string> {
	await page.goto(`/${ADMIN_LEGACY_PATH}/posts`);
	await page.getByRole('button', { name: /Create Post/i }).click();
	const titleInput = page.locator('input[name="title"], input[id="title"]').first();
	await expect(titleInput).toBeVisible();
	await titleInput.fill(title);

	const createPromise = page.waitForResponse(
		(r) =>
			r.url().includes(`${API_BASE}/posts/create`)
			&& r.request().method() === 'POST',
	);
	await page.getByRole('button', { name: 'Create', exact: true }).click();
	const createRes = await createPromise;
	expect(createRes.status()).toBe(200);
	const body = (await createRes.json()) as { id?: string };
	expect(body.id).toMatch(/^[0-9a-f]{24}$/);
	await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/posts/${body.id}(\\?|$)`));
	return body.id!;
}

test.describe('Legacy date picker operations', () => {
	test('Created posts can set every date picker-backed field and reload those values', async ({ signedInPage }) => {
		const page = signedInPage;
		const createdId = await createPost(page, `Date Picker Created ${Date.now()}`);

		const publishedAtInput = page.locator('input[name="publishedAt"]');
		await expect(publishedAtInput).toBeVisible();
		await publishedAtInput.fill('2026-09-01');
		await publishedAtInput.press('Enter');
		await publishedAtInput.click();
		await selectVisibleDay(page.locator('.DayPicker').first(), '22');
		await expect(publishedAtInput).toHaveValue('2026-09-22');

		const reviewedDateInput = page.locator('input[name="reviewedAt_date"]');
		const reviewedTimeInput = page.locator('input[name="reviewedAt_time"]');
		await reviewedDateInput.fill('2026-10-01');
		await reviewedDateInput.press('Enter');
		await reviewedDateInput.click();
		await selectVisibleDay(page.locator('.DayPicker').first(), '23');
		await expect(reviewedDateInput).toHaveValue('2026-10-23');
		await reviewedTimeInput.fill('8:05:45 am');

		const blackoutDatesField = page.locator('label:has-text("Blackout Dates")').locator('xpath=..');
		await blackoutDatesField.getByRole('button', { name: 'Add item' }).click();
		let blackoutDateInputs = blackoutDatesField.locator('input[name="blackoutDates"]');
		await expect(blackoutDateInputs).toHaveCount(1);
		await blackoutDateInputs.nth(0).fill('2026-11-01');
		await blackoutDateInputs.nth(0).press('Enter');
		await blackoutDateInputs.nth(0).click();
		await selectVisibleDay(page.locator('.DayPicker').first(), '24');
		await expect(blackoutDateInputs.nth(0)).toHaveValue('2026-11-24');

		await blackoutDatesField.getByRole('button', { name: 'Add item' }).click();
		blackoutDateInputs = blackoutDatesField.locator('input[name="blackoutDates"]');
		await expect(blackoutDateInputs).toHaveCount(2);
		await blackoutDateInputs.nth(1).fill('2026-12-25');
		await blackoutDateInputs.nth(1).press('Enter');
		await expect(blackoutDateInputs.nth(1)).toHaveValue('2026-12-25');

		await savePost(page, createdId);

		const saved = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(createdId) }),
		);
		expect(saved?.publishedAt?.toISOString().slice(0, 10)).toBe('2026-09-22');
		expect((saved?.blackoutDates ?? []).map((date: Date) => date.toISOString().slice(0, 10)))
			.toEqual(['2026-11-24', '2026-12-25']);

		await openPost(page, createdId);
		await expect(page.locator('input[name="publishedAt"]')).toHaveValue('2026-09-22');
		await expect(page.locator('input[name="reviewedAt_date"]')).toHaveValue('2026-10-23');
		await expect(page.locator('input[name="reviewedAt_time"]')).toHaveValue('8:05:45 am');
		const reloadedBlackoutDateInputs = page
			.locator('label:has-text("Blackout Dates")')
			.locator('xpath=..')
			.locator('input[name="blackoutDates"]');
		await expect(reloadedBlackoutDateInputs).toHaveCount(2);
		await expect(reloadedBlackoutDateInputs.nth(0)).toHaveValue('2026-11-24');
		await expect(reloadedBlackoutDateInputs.nth(1)).toHaveValue('2026-12-25');
	});

	test('Date field supports picker navigation, day selection, manual entry, save, and reload', async ({ signedInPage }) => {
		const page = signedInPage;
		await openPost(page);

		const publishedAtInput = page.locator('input[name="publishedAt"]');
		await expect(publishedAtInput).toBeVisible();
		await publishedAtInput.fill('2026-05-01');
		await publishedAtInput.press('Enter');
		await expect(publishedAtInput).toHaveValue('2026-05-01');

		await publishedAtInput.click();
		const picker = page.locator('.DayPicker').first();
		await expectPickerGridAndNav(picker);
		await selectVisibleDay(picker, '12');
		await expect(publishedAtInput).toHaveValue('2026-05-12');

		await publishedAtInput.fill('2026-06-14');
		await publishedAtInput.press('Enter');
		await expect(publishedAtInput).toHaveValue('2026-06-14');
		await savePost(page);

		const saved = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		expect(saved?.publishedAt?.toISOString().slice(0, 10)).toBe('2026-06-14');

		await openPost(page);
		await expect(page.locator('input[name="publishedAt"]')).toHaveValue('2026-06-14');
	});

	test('Datetime field supports picker navigation, Now, day selection, time edits, save, and reload', async ({ signedInPage }) => {
		const page = signedInPage;
		await openPost(page);

		const dateInput = page.locator('input[name="reviewedAt_date"]');
		const timeInput = page.locator('input[name="reviewedAt_time"]');
		await expect(dateInput).toBeVisible();
		await expect(timeInput).toBeVisible();

		const nowButton = page.locator('label:has-text("Reviewed At")').locator('xpath=..').getByRole('button', { name: 'Now' });
		await expectControlsShareRow(dateInput, timeInput, nowButton);

		await nowButton.click();
		await expect(dateInput).not.toHaveValue('');
		await expect(timeInput).not.toHaveValue('');

		await dateInput.fill('2026-05-01');
		await dateInput.press('Enter');
		await dateInput.click();
		const picker = page.locator('.DayPicker').first();
		await expectPickerGridAndNav(picker);
		await selectVisibleDay(picker, '18');
		await expect(dateInput).toHaveValue('2026-05-18');

		await timeInput.fill('4:45:30 pm');
		await savePost(page);

		await openPost(page);
		await expect(page.locator('input[name="reviewedAt_date"]')).toHaveValue('2026-05-18');
		await expect(page.locator('input[name="reviewedAt_time"]')).toHaveValue('4:45:30 pm');
	});

	test('DateArray field supports picker navigation, add, manual entry, remove, save, and reload', async ({ signedInPage }) => {
		const page = signedInPage;
		await openPost(page);

		const field = page.locator('label:has-text("Blackout Dates")').locator('xpath=..');
		const inputs = field.locator('input[name="blackoutDates"]');
		await expect(inputs).toHaveCount(2);

		await inputs.nth(0).click();
		const picker = page.locator('.DayPicker').first();
		await expectPickerGridAndNav(picker);
		await selectVisibleDay(picker, '10');
		await expect(inputs.nth(0)).toHaveValue('2026-06-10');

		await field.getByRole('button', { name: 'Add item' }).click();
		await expect(inputs).toHaveCount(3);
		await inputs.nth(2).fill('2026-08-21');
		await inputs.nth(2).press('Enter');
		await expect(inputs.nth(2)).toHaveValue('2026-08-21');

		await field.locator('button.keystone-relational-button').nth(1).click();
		await expect(inputs).toHaveCount(2);
		await savePost(page);

		const saved = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(postId) }),
		);
		const savedDates = (saved?.blackoutDates ?? []).map((date: Date) => date.toISOString().slice(0, 10));
		expect(savedDates).toEqual(['2026-06-10', '2026-08-21']);

		await openPost(page);
		const reloadedInputs = page
			.locator('label:has-text("Blackout Dates")')
			.locator('xpath=..')
			.locator('input[name="blackoutDates"]');
		await expect(reloadedInputs).toHaveCount(2);
		await expect(reloadedInputs.nth(0)).toHaveValue('2026-06-10');
		await expect(reloadedInputs.nth(1)).toHaveValue('2026-08-21');
	});

	test('Date and DateArray filter popouts support picker navigation and day selection', async ({ signedInPage }) => {
		const page = signedInPage;
		let listLoad = waitForListLoad(page);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts?filters=${filtersParam([
			{
				path: 'publishedAt',
				inverted: false,
				mode: 'on',
				value: '2026-06-14T00:00:00.000Z',
				before: '2026-06-14T00:00:00.000Z',
				after: '2026-06-14T00:00:00.000Z',
			},
		])}`);
		await listLoad;

		await page.locator('#activeFilter__publishedAt').click();
		let picker = page.locator('.Popout .DayPicker').first();
		await expectPickerGridAndNav(picker);
		await selectVisibleDay(picker, '15');
		await expect(page.locator('[data-list-filter-date-value]')).toHaveValue('15-06-2026');
		listLoad = waitForListLoad(page);
		await page.getByRole('button', { name: 'Apply' }).click();
		await listLoad;
		await expect(page.locator('#activeFilter__publishedAt')).toContainText('Jun 15 2026');

		listLoad = waitForListLoad(page);
		await page.goto(`/${ADMIN_LEGACY_PATH}/posts?filters=${filtersParam([
			{
				path: 'blackoutDates',
				presence: 'some',
				mode: 'on',
				value: '2026-06-10T00:00:00.000Z',
				before: '2026-06-10T00:00:00.000Z',
				after: '2026-06-10T00:00:00.000Z',
			},
		])}`);
		await listLoad;

		await page.locator('#activeFilter__blackoutDates').click();
		picker = page.locator('.Popout .DayPicker').first();
		await expectPickerGridAndNav(picker);
		await selectVisibleDay(picker, '11');
		await expect(page.locator('[data-list-filter-date-value]')).toHaveValue('11-06-2026');
		listLoad = waitForListLoad(page);
		await page.getByRole('button', { name: 'Apply' }).click();
		await listLoad;
		await expect(page.locator('#activeFilter__blackoutDates')).toContainText('Jun 11 2026');
	});
});
