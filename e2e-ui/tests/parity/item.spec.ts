/**
 * Parity spec: Item edit (P4-30).
 *
 * Verifies that both adminLegacy (/keystone) and adminNext (/keystone-next):
 *   - Load the same item (same ObjectId) from the seeded Post list
 *   - Display the same title field value
 *   - Can edit the title, save, reload, and both show the updated value
 *
 * Each test re-seeds to guarantee a known ID is available.
 */

import type { Page, Locator } from '@playwright/test';
import { Types } from 'mongoose';
import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';
const USER_LIST_KEY = 'User';
const USER_LIST_PATH = 'users';

let sharedPostId: string;
let aliceId: string;

function legacySelect(page: Page, index: number): Locator {
	return page.locator('.Select--single').nth(index);
}

async function chooseLegacySelectOption(page: Page, index: number, label: string): Promise<void> {
	await legacySelect(page, index).locator('.Select-control').click();
	await page.locator('.Select-menu-outer .Select-option', { hasText: label }).click();
}

function legacyFeaturedField(page: Page): Locator {
	return page.locator('[data-field-name="featured"][data-field-type="boolean"]');
}

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

function formatDateArrayInputValues(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.map(formatDateInputValue);
}

async function fillLegacyDateInput(locator: Locator, value: string): Promise<void> {
	await locator.fill(value);
	await locator.press('Enter');
}

async function fillLegacyCodeField(page: Page, fieldName: string, value: string): Promise<void> {
	const editor = page.locator(`[data-field-code="${fieldName}"] .CodeMirror`).first();
	await editor.evaluate((node, nextValue) => {
		const codeMirror = (node as HTMLElement & {
			CodeMirror?: { setValue: (value: string) => void };
		}).CodeMirror;
		if (!codeMirror) {
			throw new Error('Legacy CodeMirror instance was not mounted');
		}
		codeMirror.setValue(nextValue);
	}, value);
}

async function fillLegacyHtmlField(page: Page, fieldName: string, value: string): Promise<void> {
	const container = page.locator(`[data-field-html="${fieldName}"]`).first();
	await container.evaluate((node, nextValue) => {
		const textarea = (node as HTMLElement).querySelector('textarea');
		if (!(textarea instanceof HTMLTextAreaElement)) {
			throw new Error('Legacy HTML textarea was not mounted');
		}
		const tinymce = (window as typeof window & {
			tinymce?: { get: (id: string) => { setContent: (value: string) => void; fire: (eventName: string) => void } | null };
		}).tinymce;
		const editor = tinymce?.get(textarea.id);
		if (editor) {
			editor.setContent(nextValue);
			editor.fire('change');
			return;
		}
		textarea.value = nextValue;
		textarea.dispatchEvent(new Event('change', { bubbles: true }));
	}, value);
}

async function fillAdminNextCodeField(page: Page, fieldName: string, value: string): Promise<void> {
	const editor = page.locator(`[data-codemirror-field="${fieldName}"]`).first();
	await editor.evaluate((node, nextValue) => {
		const view = (node as HTMLElement & {
			__codemirrorView?: {
				state: { doc: { length: number } };
				dispatch: (spec: { changes: { from: number; to: number; insert: string } }) => void;
			};
		}).__codemirrorView;
		if (!view) {
			throw new Error('Admin next CodeMirror instance was not mounted');
		}
		view.dispatch({
			changes: { from: 0, to: view.state.doc.length, insert: nextValue },
		});
	}, value);
}

async function fillAdminNextHtmlField(page: Page, fieldName: string, value: string): Promise<void> {
	const editor = page.locator(`[data-field-name="${fieldName}"] .ProseMirror`).first();
	await editor.evaluate((node, nextValue) => {
		const tiptap = (node as HTMLElement & {
			__tiptapEditor?: { commands: { setContent: (value: string, options?: { emitUpdate?: boolean }) => void } };
		}).__tiptapEditor;
		if (!tiptap) {
			throw new Error('Admin next TipTap editor was not mounted');
		}
		tiptap.commands.setContent(nextValue, { emitUpdate: true });
	}, value);
}

function normalizeTextareaValue(value: unknown): string {
	return String(value ?? '').replace(/\r\n/g, '\n');
}

test.beforeEach(async () => {
	const seed = await seedPostsAndEditors();
	// Use the first post for all parity item tests.
	sharedPostId = seed.postIds[0] ?? '';
	aliceId = seed.aliceId;
	expect(sharedPostId, 'seed should produce at least one post').toBeTruthy();
	expect(aliceId, 'seed should produce Alice editor').toBeTruthy();
});

test.describe('Parity: Item edit', () => {
	test('both UIs load the same item and display the same title', async ({
		adminLegacy,
		adminNext,
	}) => {
		// Read ground-truth from Mongo.
		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc).not.toBeNull();
		const expectedTitle = doc?.title as string;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const adminLegacyTitle = await adminLegacy.getFieldValue('title');

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const adminNextTitle = await adminNext.getFieldValue('title');

		// Both UIs must render the same title.
		expect(adminLegacyTitle).toBe(expectedTitle);
		expect(adminNextTitle).toBe(expectedTitle);
	});

	test('editing title in adminLegacy → save → both UIs show updated value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const NEW_TITLE = `Parity Updated Title ${Date.now()}`;

		// Edit via adminLegacy.
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.fillField('title', NEW_TITLE);
		await adminLegacy.saveItem();

		// Reload in adminLegacy and verify.
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const adminLegacyTitle = await adminLegacy.getFieldValue('title');
		expect(adminLegacyTitle).toBe(NEW_TITLE);

		// Load the same item in adminNext and verify it shows the updated value.
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const adminNextTitle = await adminNext.getFieldValue('title');
		expect(adminNextTitle).toBe(NEW_TITLE);
	});

	test('editing title in adminNext → save → both UIs show updated value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const NEW_TITLE = `Parity Admin Next Updated ${Date.now()}`;

		// Edit via adminNext.
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.fillField('title', NEW_TITLE);
		await adminNext.saveItem();

		// Reload in adminNext and verify.
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const adminNextTitle = await adminNext.getFieldValue('title');
		expect(adminNextTitle).toBe(NEW_TITLE);

		// Load the same item in adminLegacy and verify it shows the updated value.
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const adminLegacyTitle = await adminLegacy.getFieldValue('title');
		expect(adminLegacyTitle).toBe(NEW_TITLE);
	});

	test('required title validation keeps item open and preserves stored value in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		const original = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		const originalTitle = String(original?.title ?? '');
		expect(originalTitle).not.toBe('');

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.fillField('title', '');
		const legacySave = adminLegacy.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes(`/keystone-api/${LIST_PATH}/${sharedPostId}`),
		);
		await adminLegacy.page.getByRole('button', { name: /^Save$/ }).click();
		const legacyResponse = await legacySave;
		expect(legacyResponse.status()).toBe(400);
		await expect(adminLegacy.page.locator('[data-alert-type="danger"]')).toContainText('Title is required');
		await expect(adminLegacy.page).toHaveURL(new RegExp(`/keystone/${LIST_PATH}/${sharedPostId}(\\?|$)`));

		let afterSave = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(afterSave?.title).toBe(originalTitle);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.fillField('title', '');
		const adminNextSave = adminNext.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes(`/keystone-api/${LIST_KEY}/${sharedPostId}`),
		);
		await adminNext.page.getByRole('button', { name: /^Save$/ }).click();
		const adminNextResponse = await adminNextSave;
		expect(adminNextResponse.status()).toBe(400);
		await expect(adminNext.page.getByRole('alert').filter({ hasText: 'Title is required' })).toBeVisible();
		await expect(adminNext.page.getByRole('status')).toContainText('Save failed');
		await expect(adminNext.page).toHaveURL(new RegExp(`/keystone-next/${LIST_KEY}/${sharedPostId}(\\?|$)`));

		afterSave = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(afterSave?.title).toBe(originalTitle);
	});

	test('editing text field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newContent = `Legacy content parity ${Date.now()}`;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.fillField('content', newContent);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.content).toBe(newContent);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#content')).toHaveValue(newContent);
	});

	test('editing text field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newContent = `Admin next content parity ${Date.now()}`;

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.fillField('content', newContent);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.content).toBe(newContent);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="content"]')).toHaveValue(newContent);
	});

	test('editing key field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newKey = `legacy-key-${Date.now()}`;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.fillField('slugKey', newKey);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.slugKey).toBe(newKey);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#slugKey')).toHaveValue(newKey);
	});

	test('editing key field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newKey = `admin-next-key-${Date.now()}`;

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.fillField('slugKey', newKey);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.slugKey).toBe(newKey);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="slugKey"]')).toHaveValue(newKey);
	});

	test('editing color field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newColor = '#123456';

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.fillField('accentColor', newColor);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.accentColor).toBe(newColor);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#accentColor')).toHaveValue(newColor);
	});

	test('editing color field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newColor = '#abcdef';

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('input#accentColor').fill(newColor);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.accentColor).toBe(newColor);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="accentColor"]')).toHaveValue(newColor);
	});

	test('editing money field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.page.locator('input[name="budgetCost"]').fill('$1,234.56');
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.budgetCost).toBe(1234.56);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#budgetCost')).toHaveValue('1234.56');
	});

	test('editing money field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('input#budgetCost').fill('789.01');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.budgetCost).toBe(789.01);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="budgetCost"]')).toHaveValue('789.01');
	});

	test('editing array fields in adminLegacy → save → adminNext reloads values', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.page.locator('input[name="tags"]').nth(0).fill('legacy-alpha');
		await adminLegacy.page.locator('input[name="tags"]').nth(1).fill('legacy-beta');
		await adminLegacy.page.locator('input[name="scoreHistory"]').nth(0).fill('10.25');
		await adminLegacy.page.locator('input[name="scoreHistory"]').nth(1).fill('20.5');
		await fillLegacyDateInput(adminLegacy.page.locator('input[name="blackoutDates"]').nth(0), '2026-08-10');
		await fillLegacyDateInput(adminLegacy.page.locator('input[name="blackoutDates"]').nth(1), '2026-09-11');
		await adminLegacy.page.locator('.blockout').click();
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.tags).toEqual(['legacy-alpha', 'legacy-beta']);
		expect(doc?.scoreHistory).toEqual([10.25, 20.5]);
		expect(formatDateArrayInputValues(doc?.blackoutDates)).toEqual(['2026-08-10', '2026-09-11']);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#tags')).toHaveValue('legacy-alpha, legacy-beta');
		await expect(adminNext.page.locator('input#scoreHistory')).toHaveValue('10.25, 20.5');
		await expect(adminNext.page.locator('input#blackoutDates')).toHaveValue('2026-08-10, 2026-09-11');
	});

	test('editing array fields in adminNext → save → adminLegacy reloads values', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('input#tags').fill('next-alpha, next-beta, next-gamma');
		await adminNext.page.locator('input#scoreHistory').fill('30.75, 40.5, 50');
		await adminNext.page.locator('input#blackoutDates').fill('2026-10-12, 2026-11-13, 2026-12-14');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.tags).toEqual(['next-alpha', 'next-beta', 'next-gamma']);
		expect(doc?.scoreHistory).toEqual([30.75, 40.5, 50]);
		expect(formatDateArrayInputValues(doc?.blackoutDates)).toEqual(['2026-10-12', '2026-11-13', '2026-12-14']);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="tags"]').nth(0)).toHaveValue('next-alpha');
		await expect(adminLegacy.page.locator('input[name="tags"]').nth(1)).toHaveValue('next-beta');
		await expect(adminLegacy.page.locator('input[name="tags"]').nth(2)).toHaveValue('next-gamma');
		await expect(adminLegacy.page.locator('input[name="scoreHistory"]').nth(0)).toHaveValue('30.75');
		await expect(adminLegacy.page.locator('input[name="scoreHistory"]').nth(1)).toHaveValue('40.5');
		await expect(adminLegacy.page.locator('input[name="scoreHistory"]').nth(2)).toHaveValue('50');
		await expect(adminLegacy.page.locator('input[name="blackoutDates"]').nth(0)).toHaveValue('2026-10-12');
		await expect(adminLegacy.page.locator('input[name="blackoutDates"]').nth(1)).toHaveValue('2026-11-13');
		await expect(adminLegacy.page.locator('input[name="blackoutDates"]').nth(2)).toHaveValue('2026-12-14');
	});

	test('editing geopoint field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.page.locator('input[name="coordinates[1]"]').fill('41.5001');
		await adminLegacy.page.locator('input[name="coordinates[0]"]').fill('-72.6002');
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.coordinates).toEqual([-72.6002, 41.5001]);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#coordinates_lat')).toHaveValue('41.5001');
		await expect(adminNext.page.locator('input#coordinates_lng')).toHaveValue('-72.6002');
	});

	test('editing geopoint field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('input#coordinates_lat').fill('42.7003');
		await adminNext.page.locator('input#coordinates_lng').fill('-71.8004');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.coordinates).toEqual([-71.8004, 42.7003]);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="coordinates[1]"]')).toHaveValue('42.7003');
		await expect(adminLegacy.page.locator('input[name="coordinates[0]"]')).toHaveValue('-71.8004');
	});

	test('editing location field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const nextAddress = {
			number: 'Suite 410',
			name: 'Legacy Hall',
			street1: '410 Legacy Avenue',
			street2: 'Floor 4',
			suburb: 'Old Town',
			state: 'PA',
			postcode: '19104',
			country: 'USA',
		};
		const nextGeo = { lat: '39.9501', lng: '-75.1602' };

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const locationField = adminLegacy.page.locator('[data-field-name="venueAddress"][data-field-type="location"]');
		const showMore = locationField.getByText('(show more fields)');
		if (await showMore.isVisible()) {
			await showMore.click();
		}
		await adminLegacy.page.locator('input[name="venueAddress.number"]').fill(nextAddress.number);
		await adminLegacy.page.locator('input[name="venueAddress.name"]').fill(nextAddress.name);
		await adminLegacy.page.locator('input[name="venueAddress.street1"]').fill(nextAddress.street1);
		await adminLegacy.page.locator('input[name="venueAddress.street2"]').fill(nextAddress.street2);
		await adminLegacy.page.locator('input[name="venueAddress.suburb"]').fill(nextAddress.suburb);
		await adminLegacy.page.locator('input[name="venueAddress.state"]').fill(nextAddress.state);
		await adminLegacy.page.locator('input[name="venueAddress.postcode"]').fill(nextAddress.postcode);
		await adminLegacy.page.locator('input[name="venueAddress.country"]').fill(nextAddress.country);
		await adminLegacy.page.locator('input[name="venueAddress.geo[1]"]').fill(nextGeo.lat);
		await adminLegacy.page.locator('input[name="venueAddress.geo[0]"]').fill(nextGeo.lng);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.venueAddress).toMatchObject(nextAddress);
		expect(doc?.venueAddress?.geo).toEqual([Number(nextGeo.lng), Number(nextGeo.lat)]);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#venueAddress_number')).toHaveValue(nextAddress.number);
		await expect(adminNext.page.locator('input#venueAddress_name')).toHaveValue(nextAddress.name);
		await expect(adminNext.page.locator('input#venueAddress_street1')).toHaveValue(nextAddress.street1);
		await expect(adminNext.page.locator('input#venueAddress_street2')).toHaveValue(nextAddress.street2);
		await expect(adminNext.page.locator('input#venueAddress_suburb')).toHaveValue(nextAddress.suburb);
		await expect(adminNext.page.locator('input#venueAddress_state')).toHaveValue(nextAddress.state);
		await expect(adminNext.page.locator('input#venueAddress_postcode')).toHaveValue(nextAddress.postcode);
		await expect(adminNext.page.locator('input#venueAddress_country')).toHaveValue(nextAddress.country);
		await expect(adminNext.page.locator('input#venueAddress_geo_lat')).toHaveValue(nextGeo.lat);
		await expect(adminNext.page.locator('input#venueAddress_geo_lng')).toHaveValue(nextGeo.lng);
	});

	test('editing location field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const nextAddress = {
			number: 'Unit 205',
			name: 'Next Center',
			street1: '205 Next Boulevard',
			street2: 'North Wing',
			suburb: 'New Town',
			state: 'NY',
			postcode: '10018',
			country: 'USA',
		};
		const nextGeo = { lat: '40.7512', lng: '-73.9823' };

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('input#venueAddress_number').fill(nextAddress.number);
		await adminNext.page.locator('input#venueAddress_name').fill(nextAddress.name);
		await adminNext.page.locator('input#venueAddress_street1').fill(nextAddress.street1);
		await adminNext.page.locator('input#venueAddress_street2').fill(nextAddress.street2);
		await adminNext.page.locator('input#venueAddress_suburb').fill(nextAddress.suburb);
		await adminNext.page.locator('input#venueAddress_state').fill(nextAddress.state);
		await adminNext.page.locator('input#venueAddress_postcode').fill(nextAddress.postcode);
		await adminNext.page.locator('input#venueAddress_country').fill(nextAddress.country);
		await adminNext.page.locator('input#venueAddress_geo_lat').fill(nextGeo.lat);
		await adminNext.page.locator('input#venueAddress_geo_lng').fill(nextGeo.lng);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.venueAddress).toMatchObject(nextAddress);
		expect(doc?.venueAddress?.geo).toEqual([Number(nextGeo.lng), Number(nextGeo.lat)]);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const locationField = adminLegacy.page.locator('[data-field-name="venueAddress"][data-field-type="location"]');
		const showMore = locationField.getByText('(show more fields)');
		if (await showMore.isVisible()) {
			await showMore.click();
		}
		await expect(adminLegacy.page.locator('input[name="venueAddress.number"]')).toHaveValue(nextAddress.number);
		await expect(adminLegacy.page.locator('input[name="venueAddress.name"]')).toHaveValue(nextAddress.name);
		await expect(adminLegacy.page.locator('input[name="venueAddress.street1"]')).toHaveValue(nextAddress.street1);
		await expect(adminLegacy.page.locator('input[name="venueAddress.street2"]')).toHaveValue(nextAddress.street2);
		await expect(adminLegacy.page.locator('input[name="venueAddress.suburb"]')).toHaveValue(nextAddress.suburb);
		await expect(adminLegacy.page.locator('input[name="venueAddress.state"]')).toHaveValue(nextAddress.state);
		await expect(adminLegacy.page.locator('input[name="venueAddress.postcode"]')).toHaveValue(nextAddress.postcode);
		await expect(adminLegacy.page.locator('input[name="venueAddress.country"]')).toHaveValue(nextAddress.country);
		await expect(adminLegacy.page.locator('input[name="venueAddress.geo[1]"]')).toHaveValue(nextGeo.lat);
		await expect(adminLegacy.page.locator('input[name="venueAddress.geo[0]"]')).toHaveValue(nextGeo.lng);
	});

	test('location improve controls render and toggle in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const legacyImprove = adminLegacy.page.locator('[data-field-name="venueAddress"][data-field-type="location"] [data-field-location-improve]');
		await expect(legacyImprove).toBeVisible();
		await expect(legacyImprove).not.toBeChecked();
		await expect(adminLegacy.page.locator('[data-field-name="venueAddress"][data-field-type="location"] [data-field-location-overwrite]')).toHaveCount(0);
		await legacyImprove.check();
		const legacyOverwrite = adminLegacy.page.locator('[data-field-name="venueAddress"][data-field-type="location"] [data-field-location-overwrite]');
		await expect(legacyOverwrite).toBeVisible();
		await legacyOverwrite.check();
		await expect(legacyOverwrite).toBeChecked();
		await legacyImprove.uncheck();
		await expect(adminLegacy.page.locator('[data-field-name="venueAddress"][data-field-type="location"] [data-field-location-overwrite]')).toHaveCount(0);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const adminNextLocation = adminNext.page.locator('[data-field-name="venueAddress"][data-field-type="location"]');
		const adminNextImprove = adminNextLocation.locator('[data-field-location-improve]');
		await expect(adminNextImprove).toBeVisible();
		await expect(adminNextImprove).not.toBeChecked();
		await expect(adminNextLocation.locator('[data-field-location-overwrite]')).toHaveCount(0);
		await adminNextImprove.check();
		const adminNextOverwrite = adminNextLocation.locator('[data-field-location-overwrite]');
		await expect(adminNextOverwrite).toBeVisible();
		await adminNextOverwrite.check();
		await expect(adminNextOverwrite).toBeChecked();
		await adminNextImprove.uncheck();
		await expect(adminNextLocation.locator('[data-field-location-overwrite]')).toHaveCount(0);
	});

	test('editing markdown field in adminLegacy → save → adminNext reloads value and sanitized preview', async ({
		adminLegacy,
		adminNext,
	}) => {
		const markdown = `## Legacy Markdown ${Date.now()}\n\n<script>alert('legacy')</script>\n\nThis is **bold** text.`;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.page.locator('textarea[name="editorialMarkdown.md"]').fill(markdown);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		const stored = doc?.editorialMarkdown as { md?: string; html?: string } | undefined;
		expect(stored?.md).not.toContain('<script>');
		expect(stored?.md).toContain('This is **bold** text.');
		expect(stored?.html).toContain('<strong>bold</strong>');

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('textarea#editorialMarkdown')).toContainText('This is **bold** text.');
		const preview = adminNext.page.locator('[data-field-markdown-preview]');
		await expect(preview.locator('strong')).toContainText('bold');
		await expect(preview).not.toContainText('alert');
	});

	test('editing markdown field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const markdown = `# Admin Next Markdown ${Date.now()}\n\nA [link](https://example.com) and **strong** text.`;

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('textarea#editorialMarkdown').fill(markdown);
		await expect(adminNext.page.locator('[data-field-markdown-preview] strong')).toContainText('strong');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		const stored = doc?.editorialMarkdown as { md?: string; html?: string } | undefined;
		expect(stored?.md).toBe(markdown);
		expect(stored?.html).toContain('<strong>strong</strong>');

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('textarea[name="editorialMarkdown.md"]')).toHaveValue(markdown);
	});

	test('editing html field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const html = `<h2>Legacy HTML ${Date.now()}</h2><p>This is <strong>bold</strong> HTML.</p>`;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await fillLegacyHtmlField(adminLegacy.page, 'articleHtml', html);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.articleHtml).toBe(html);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const editor = adminNext.page.locator('[data-field-name="articleHtml"] .ProseMirror');
		await expect(editor.locator('h2')).toContainText('Legacy HTML');
		await expect(editor.locator('strong')).toContainText('bold');
	});

	test('editing html field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const html = `<h2>Admin Next HTML ${Date.now()}</h2><p>A <a href="https://example.com/html">link</a> and <em>emphasis</em>.</p>`;

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await fillAdminNextHtmlField(adminNext.page, 'articleHtml', html);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.articleHtml).toContain('Admin Next HTML');
		expect(doc?.articleHtml).toContain('https://example.com/html');
		expect(doc?.articleHtml).toContain('<em>emphasis</em>');

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('[data-field-html="articleHtml"]')).toContainText('Admin Next HTML');
	});

	test('editing code field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const code = `export function legacySnippet() {\n  return ${Date.now()};\n}`;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await fillLegacyCodeField(adminLegacy.page, 'codeSnippet', code);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(normalizeTextareaValue(doc?.codeSnippet)).toBe(code);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('[data-codemirror-field="codeSnippet"] .cm-content')).toContainText('legacySnippet');
		await expect(adminNext.page.locator('[data-codemirror-field="codeSnippet"] .cm-content')).toContainText('return');
	});

	test('editing code field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const code = `export const nextSnippet = {\n  value: ${Date.now()}\n};`;

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await fillAdminNextCodeField(adminNext.page, 'codeSnippet', code);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(normalizeTextareaValue(doc?.codeSnippet)).toBe(code);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('[data-field-code="codeSnippet"] .CodeMirror')).toContainText('nextSnippet');
		await expect(adminLegacy.page.locator('[data-field-code="codeSnippet"] .CodeMirror')).toContainText('value');
	});

	test('editing email field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newEmail = `alice.legacy.${Date.now()}@example.com`;

		await adminLegacy.gotoItem(USER_LIST_PATH, aliceId);
		await adminLegacy.fillField('email', newEmail);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('User').findOne({ _id: toObjectId(aliceId) }),
		);
		expect(doc?.email).toBe(newEmail);

		await adminNext.gotoItem(USER_LIST_KEY, aliceId);
		await expect(adminNext.page.locator('input#email')).toHaveValue(newEmail);
	});

	test('editing email field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newEmail = `alice.next.${Date.now()}@example.com`;

		await adminNext.gotoItem(USER_LIST_KEY, aliceId);
		await adminNext.fillField('email', newEmail);
		await adminNext.page.locator('input[name="password"]').fill('temp-alice-email-parity-123');
		await adminNext.page.locator('input[name="password_confirm"]').fill('temp-alice-email-parity-123');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('User').findOne({ _id: toObjectId(aliceId) }),
		);
		expect(doc?.email).toBe(newEmail);

		await adminLegacy.gotoItem(USER_LIST_PATH, aliceId);
		await expect(adminLegacy.page.locator('input[name="email"]')).toHaveValue(newEmail);
	});

	test('editing name field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newFirst = `Alice Legacy ${Date.now()}`;
		const newLast = 'Parity';

		await adminLegacy.gotoItem(USER_LIST_PATH, aliceId);
		await adminLegacy.fillField('name.first', newFirst);
		await adminLegacy.fillField('name.last', newLast);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('User').findOne({ _id: toObjectId(aliceId) }),
		);
		expect((doc?.name as { first?: string; last?: string } | undefined)?.first).toBe(newFirst);
		expect((doc?.name as { first?: string; last?: string } | undefined)?.last).toBe(newLast);

		await adminNext.gotoItem(USER_LIST_KEY, aliceId);
		await expect(adminNext.page.locator('input[name="name.first"]')).toHaveValue(newFirst);
		await expect(adminNext.page.locator('input[name="name.last"]')).toHaveValue(newLast);
	});

	test('editing name field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newFirst = `Alice Next ${Date.now()}`;
		const newLast = 'Parity';

		await adminNext.gotoItem(USER_LIST_KEY, aliceId);
		await adminNext.fillField('name.first', newFirst);
		await adminNext.fillField('name.last', newLast);
		await adminNext.page.locator('input[name="password"]').fill('temp-alice-name-parity-123');
		await adminNext.page.locator('input[name="password_confirm"]').fill('temp-alice-name-parity-123');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('User').findOne({ _id: toObjectId(aliceId) }),
		);
		expect((doc?.name as { first?: string; last?: string } | undefined)?.first).toBe(newFirst);
		expect((doc?.name as { first?: string; last?: string } | undefined)?.last).toBe(newLast);

		await adminLegacy.gotoItem(USER_LIST_PATH, aliceId);
		await expect(adminLegacy.page.locator('input[name="name.first"]')).toHaveValue(newFirst);
		await expect(adminLegacy.page.locator('input[name="name.last"]')).toHaveValue(newLast);
	});

	test('password mismatch in adminNext shows validation and preserves stored hash', async ({
		adminNext,
	}) => {
		const original = await withMongo((db) =>
			db.collection('User').findOne({ _id: toObjectId(aliceId) }),
		);
		const originalHash = String(original?.password ?? '');

		await adminNext.gotoItem(USER_LIST_KEY, aliceId);
		const changePassword = adminNext.page.getByRole('button', { name: /Change Password/i });
		if (await changePassword.count()) {
			await changePassword.click();
		}
		await adminNext.page.locator('input[name="password"]').fill('valid-password-123');
		await adminNext.page.locator('input[name="password_confirm"]').fill('different-password-123');
		await expect(adminNext.page.getByRole('alert').filter({ hasText: /Passwords must match/i }).first()).toBeVisible();

		const response = adminNext.page.waitForResponse(
			(r) =>
				r.request().method() === 'POST' &&
				r.url().includes('/keystone-api/User/') &&
				r.status() === 400,
		);
		await adminNext.page.getByRole('button', { name: /^Save$/ }).click();
		await response;

		await expect(adminNext.page.getByRole('alert').filter({ hasText: /Passwords must match/i })).toHaveCount(2);
		await expect(adminNext.page.getByRole('status')).toContainText('Save failed');

		const after = await withMongo((db) =>
			db.collection('User').findOne({ _id: toObjectId(aliceId) }),
		);
		expect(after?.password).toBe(originalHash);
	});

	test('editing textarea field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newSummary = `Legacy summary parity ${Date.now()}\nSecond textarea line`;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.fillField('summary', newSummary);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(normalizeTextareaValue(doc?.summary)).toBe(newSummary);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		expect(normalizeTextareaValue(await adminNext.page.locator('textarea#summary').inputValue())).toBe(newSummary);
	});

	test('editing textarea field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newSummary = `Admin next summary parity ${Date.now()}\nSecond textarea line`;

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.fillField('summary', newSummary);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(normalizeTextareaValue(doc?.summary)).toBe(newSummary);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		expect(normalizeTextareaValue(await adminLegacy.page.locator('textarea[name="summary"]').inputValue()))
			.toBe(newSummary);
	});

	test('editing url field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newUrl = `https://example.com/legacy-url-${Date.now()}`;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.fillField('canonicalUrl', newUrl);
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.canonicalUrl).toBe(newUrl);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#canonicalUrl')).toHaveValue(newUrl);
	});

	test('editing url field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const newUrl = `https://example.com/admin-next-url-${Date.now()}`;

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.fillField('canonicalUrl', newUrl);
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.canonicalUrl).toBe(newUrl);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="canonicalUrl"]')).toHaveValue(newUrl);
	});

	test('editing number field in adminLegacy → save → adminNext reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.page.locator('input[name="viewCount"]').fill('12345');
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.viewCount).toBe(12345);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#viewCount')).toHaveValue('12345');
	});

	test('editing number field in adminNext → save → adminLegacy reloads value', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('input#viewCount').fill('67890');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.viewCount).toBe(67890);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="viewCount"]')).toHaveValue('67890');
	});

	test('editing select and boolean fields in adminLegacy → save → adminNext reloads values', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await chooseLegacySelectOption(adminLegacy.page, 0, 'archived');
		await chooseLegacySelectOption(adminLegacy.page, 1, 'news');
		await chooseLegacySelectOption(adminLegacy.page, 2, 'High');

		const featuredField = legacyFeaturedField(adminLegacy.page);
		await expect(featuredField).toBeVisible();
		await featuredField.locator('button').first().click();
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.state).toBe('archived');
		expect(doc?.category).toBe('news');
		expect(doc?.priority).toBe(3);
		expect(doc?.featured).toBe(true);

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('select#state')).toHaveValue('archived');
		await expect(adminNext.page.locator('select#category')).toHaveValue('news');
		await expect(adminNext.page.locator('select#priority')).toHaveValue('3');
		await expect(adminNext.page.locator('input#featured')).toBeChecked();
	});

	test('editing select and boolean fields in adminNext → save → adminLegacy reloads values', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('select#state').selectOption('draft');
		await adminNext.page.locator('select#category').selectOption('news');
		await adminNext.page.locator('select#priority').selectOption('1');
		await adminNext.page.locator('input#featured').check();
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc?.state).toBe('draft');
		expect(doc?.category).toBe('news');
		expect(doc?.priority).toBe(1);
		expect(doc?.featured).toBe(true);

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(legacySelect(adminLegacy.page, 0)).toContainText(/draft/i);
		await expect(legacySelect(adminLegacy.page, 1)).toContainText(/news/i);
		await expect(legacySelect(adminLegacy.page, 2)).toContainText('Low');
		await expect(legacyFeaturedField(adminLegacy.page).locator('input[name="featured"]')).toHaveValue('true');
	});

	test('editing date and datetime fields in adminLegacy → save → adminNext reloads values', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await fillLegacyDateInput(adminLegacy.page.locator('input[name="publishedAt"]'), '2026-05-06');
		await fillLegacyDateInput(adminLegacy.page.locator('input[name="reviewedAt_date"]'), '2026-05-06');
		await adminLegacy.page.locator('input[name="reviewedAt_time"]').fill('10:25:00 am');
		await adminLegacy.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(formatDateInputValue(doc?.publishedAt)).toBe('2026-05-06');
		expect(formatDatetimeLocalValue(doc?.reviewedAt)).toBe('2026-05-06T10:25');

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input#publishedAt')).toHaveValue('2026-05-06');
		await expect(adminNext.page.locator('input[data-field-datetime-date][name="reviewedAt_date"]'))
			.toHaveValue('2026-05-06');
		await expect(adminNext.page.locator('input[data-field-datetime-time][name="reviewedAt_time"]'))
			.toHaveValue(/^10:25:00\s*am$/i);
	});

	test('editing date and datetime fields in adminNext → save → adminLegacy reloads values', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('input#publishedAt').fill('2026-05-07');
		await adminNext.page.locator('input[data-field-datetime-date][name="reviewedAt_date"]').fill('2026-05-07');
		await adminNext.page.locator('input[data-field-datetime-time][name="reviewedAt_time"]').fill('11:40:00 am');
		await adminNext.saveItem();

		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(formatDateInputValue(doc?.publishedAt)).toBe('2026-05-07');
		expect(formatDatetimeLocalValue(doc?.reviewedAt)).toBe('2026-05-07T11:40');

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="publishedAt"]')).toHaveValue('2026-05-07');
		await expect(adminLegacy.page.locator('input[name="reviewedAt_date"]')).toHaveValue('2026-05-07');
		await expect(adminLegacy.page.locator('input[name="reviewedAt_time"]')).toHaveValue(/^11:40:00\s*am$/i);
	});

	test('DST-boundary datetime edits preserve local wall-clock value across both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await fillLegacyDateInput(adminLegacy.page.locator('input[name="reviewedAt_date"]'), '2026-03-08');
		await adminLegacy.page.locator('input[name="reviewedAt_time"]').fill('01:30:00 am');
		await adminLegacy.saveItem();

		let doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(formatDatetimeLocalValue(doc?.reviewedAt)).toBe('2026-03-08T01:30');

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await expect(adminNext.page.locator('input[data-field-datetime-date][name="reviewedAt_date"]'))
			.toHaveValue('2026-03-08');
		await expect(adminNext.page.locator('input[data-field-datetime-time][name="reviewedAt_time"]'))
			.toHaveValue(/^1:30:00\s*am$/i);

		await adminNext.page.locator('input[data-field-datetime-date][name="reviewedAt_date"]').fill('2026-11-01');
		await adminNext.page.locator('input[data-field-datetime-time][name="reviewedAt_time"]').fill('01:30:00 am');
		await adminNext.saveItem();

		doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(formatDatetimeLocalValue(doc?.reviewedAt)).toBe('2026-11-01T01:30');

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await expect(adminLegacy.page.locator('input[name="reviewedAt_date"]')).toHaveValue('2026-11-01');
		await expect(adminLegacy.page.locator('input[name="reviewedAt_time"]')).toHaveValue(/^1:30:00\s*am$/i);
	});

	test('deleting in adminLegacy removes item and both UIs return to the list', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const status = await adminLegacy.deleteCurrentItem();
		expect(status).toBe(200);
		await expect(adminLegacy.page).toHaveURL(new RegExp(`/keystone/${LIST_PATH}(\\?|$)`));

		const deleted = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(deleted).toBeNull();

		await adminNext.gotoList(LIST_KEY);
		await expect(adminNext.page.locator(`[data-list-row][data-item-id="${sharedPostId}"]`)).toHaveCount(0);
	});

	test('canceling item delete keeps the item open and unchanged in both UIs', async ({
		adminLegacy,
		adminNext,
	}) => {
		let legacyDeleteRequests = 0;
		adminLegacy.page.on('request', (request) => {
			if (request.method() === 'POST' && request.url().includes('/delete')) {
				legacyDeleteRequests += 1;
			}
		});

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.page.locator('[data-button="delete"]').evaluate((button: HTMLElement) => button.click());
		const legacyDialog = adminLegacy.page.locator('[data-confirm-dialog]');
		await expect(legacyDialog).toBeVisible();
		await legacyDialog.locator('[data-confirm-cancel]').click();
		await expect(legacyDialog).toHaveCount(0);
		await expect(adminLegacy.page).toHaveURL(new RegExp(`/keystone/${LIST_PATH}/${sharedPostId}(\\?|$)`));
		expect(legacyDeleteRequests).toBe(0);

		const afterLegacyCancel = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(afterLegacyCancel).not.toBeNull();

		let adminNextDeleteRequests = 0;
		adminNext.page.on('request', (request) => {
			if (request.method() === 'POST' && request.url().includes('/delete')) {
				adminNextDeleteRequests += 1;
			}
		});

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.locator('[data-button="delete"]').click();
		const adminNextDialog = adminNext.page.locator('[data-confirm-dialog]');
		await expect(adminNextDialog).toBeVisible();
		await adminNextDialog.locator('[data-confirm-cancel]').click();
		await expect(adminNextDialog).not.toBeVisible();
		await expect(adminNext.page).toHaveURL(new RegExp(`/keystone-next/${LIST_KEY}/${sharedPostId}(\\?|$)`));
		expect(adminNextDeleteRequests).toBe(0);

		const afterAdminNextCancel = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(afterAdminNextCancel).not.toBeNull();
	});

	test('adminNext item delete failure keeps the item open and shows an error', async ({
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.page.route(
			(url) => url.pathname.includes(`/keystone-api/${LIST_KEY}/delete`),
			async (route) => {
				await route.fulfill({
					status: 500,
					contentType: 'application/json',
					body: JSON.stringify({ error: 'forced delete failure' }),
				});
			},
		);

		await adminNext.page.locator('[data-button="delete"]').click();
		const dialog = adminNext.page.locator('[data-confirm-dialog]');
		await expect(dialog).toBeVisible();
		await dialog.locator('[data-confirm-delete]').click();

		await expect(adminNext.page.locator('[data-item-delete-error]')).toContainText('Delete failed');
		await expect(adminNext.page).toHaveURL(new RegExp(`/keystone-next/${LIST_KEY}/${sharedPostId}(\\?|$)`));
		const afterFailure = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(afterFailure).not.toBeNull();
	});

	test('deleting in adminNext removes item and both UIs return to the list', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const status = await adminNext.deleteCurrentItem();
		expect(status).toBe(200);
		await expect(adminNext.page).toHaveURL(new RegExp(`/keystone-next/${LIST_PATH}(\\?|$)`));

		const deleted = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(deleted).toBeNull();

		await adminLegacy.gotoList(LIST_PATH);
		await expect(adminLegacy.page.locator(`[data-list-row][data-item-id="${sharedPostId}"]`)).toHaveCount(0);
	});
});
