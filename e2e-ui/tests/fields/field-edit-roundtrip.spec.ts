import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import type { Locator, Page } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

type MongoDoc = Record<string, unknown> & { _id: Types.ObjectId };

const TEMP_EDITOR_PASSWORD = 'temp-field-coverage-password-789';

function asRecord (value: unknown): Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? value as Record<string, unknown>
		: {};
}

function objectIdText (value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

function objectIdTexts (value: unknown): string[] {
	return Array.isArray(value) ? value.map(objectIdText) : [];
}

function dateInputText (value: unknown): string {
	return value instanceof Date ? value.toISOString().slice(0, 10) : '';
}

function datetimeInputText (value: unknown): string {
	if (!(value instanceof Date)) return '';
	// Use UTC accessors — the test server runs with TZ=UTC so all stored
	// datetimes are in UTC, and the split-input widget emits a local-form
	// "YYYY-MM-DDTHH:MM" string that Keystone interprets as UTC on save.
	const year = value.getUTCFullYear();
	const month = String(value.getUTCMonth() + 1).padStart(2, '0');
	const day = String(value.getUTCDate()).padStart(2, '0');
	const hours = String(value.getUTCHours()).padStart(2, '0');
	const minutes = String(value.getUTCMinutes()).padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

async function fixtureDoc (collection: string, fixtureKey: string): Promise<MongoDoc> {
	const doc = await withMongo((db) =>
		db.collection(collection).findOne({ fixtureKey }),
	);
	expect(doc, `${collection}.${fixtureKey} should exist`).toBeTruthy();
	return doc as MongoDoc;
}

async function gotoAdminNextItem (
	page: Page,
	listKey: string,
	id: string,
): Promise<void> {
	const load = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/${listKey}/${id}`) &&
			r.request().method() === 'GET' &&
			r.status() === 200,
	);
	await page.goto(`/keystone-next/${listKey}/${id}`);
	await load;
	await expect(page.locator('form')).toBeVisible();
}

async function saveAdminNextItem (
	page: Page,
	listKey: string,
	id: string,
): Promise<void> {
	const save = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/${listKey}/${id}`) &&
			r.request().method() === 'POST',
	);
	await page.getByRole('button', { name: /^Save$/ }).click();
	const res = await save;
	if (res.status() !== 200) {
		throw new Error(`${listKey}.${id} save failed: ${res.status()} ${await res.text()}`);
	}
	await expect(page.getByRole('status')).toContainText(/saved successfully/i);
}

function fieldShell (page: Page, fieldName: string, fieldType: string): Locator {
	return page.locator(
		`[data-field-name="${fieldName}"][data-field-type="${fieldType}"]`,
	);
}

async function setCheckbox (
	checkbox: Locator,
	checked: boolean,
): Promise<void> {
	if ((await checkbox.isChecked()) !== checked) {
		await checkbox.setChecked(checked);
	}
}

async function fillColor (input: Locator, value: string): Promise<void> {
	await input.evaluate((node, nextValue) => {
		const element = node as HTMLInputElement;
		const valueSetter = Object.getOwnPropertyDescriptor(
			HTMLInputElement.prototype,
			'value',
		)?.set;
		valueSetter?.call(element, nextValue);
		element.dispatchEvent(new Event('input', { bubbles: true }));
		element.dispatchEvent(new Event('change', { bubbles: true }));
	}, value);
}

async function chooseRelationship (
	page: Page,
	fieldName: string,
	refListKey: string,
	search: string,
	label: string,
): Promise<void> {
	// For single-relationship pickers, the search input is hidden behind a `▾`
	// toggle; clicking it opens the search popout. Many-pickers already render
	// the input inline, so the toggle branch is a no-op when not needed.
	const searchInput = page.locator(`input#${fieldName}`);
	if ((await searchInput.count()) === 0) {
		await page
			.locator(`[data-field-name="${fieldName}"][data-field-type="relationship"] [data-field-relationship-single-toggle]`)
			.first()
			.click();
		await expect(searchInput).toBeVisible();
	}
	const searchResponse = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/${refListKey}`) &&
			r.url().includes(`search=${encodeURIComponent(search)}`) &&
			r.request().method() === 'GET',
	);
	await searchInput.fill(search);
	await searchResponse;
	await page
		.locator('[role="listbox"] [role="option"] button', { hasText: label })
		.click();
}

test.describe('field-complete admin next edit round trips', () => {
	test('account identity, select, boolean, and password fields save', async ({
		signedInPage,
	}) => {
		const editor = await fixtureDoc('User', 'account-editor');
		const editorId = objectIdText(editor._id);

		await gotoAdminNextItem(signedInPage, 'User', editorId);
		await signedInPage.locator('input[name="name.first"]').fill('Morgan');
		await signedInPage.locator('input[name="name.last"]').fill('Roundtrip');
		await signedInPage.locator('input#email').fill('morgan.roundtrip@example.com');
		await signedInPage.locator('select#role').selectOption('producer');
		await setCheckbox(signedInPage.locator('input[name="isAdmin"]'), true);

		const passwordField = fieldShell(signedInPage, 'password', 'password');
		const changePassword = passwordField.getByRole('button', { name: /Change Password/i });
		if (await changePassword.count()) {
			await changePassword.click();
		}
		await passwordField.locator('input[name="password"]').fill(TEMP_EDITOR_PASSWORD);
		await passwordField.locator('input[name="password_confirm"]').fill(TEMP_EDITOR_PASSWORD);

		await saveAdminNextItem(signedInPage, 'User', editorId);

		const stored = await fixtureDoc('User', 'account-editor');
		expect(asRecord(stored.name).first).toBe('Morgan');
		expect(asRecord(stored.name).last).toBe('Roundtrip');
		expect(stored.email).toBe('morgan.roundtrip@example.com');
		expect(stored.role).toBe('producer');
		expect(stored.isAdmin).toBe(true);
		expect(await bcrypt.compare(TEMP_EDITOR_PASSWORD, String(stored.password ?? ''))).toBe(true);

		await gotoAdminNextItem(signedInPage, 'User', editorId);
		await expect(signedInPage.locator('input[name="name.first"]')).toHaveValue('Morgan');
		await expect(signedInPage.locator('input[name="name.last"]')).toHaveValue('Roundtrip');
		await expect(signedInPage.locator('input#email')).toHaveValue('morgan.roundtrip@example.com');
		await expect(signedInPage.locator('select#role')).toHaveValue('producer');
		await expect(signedInPage.locator('input[name="isAdmin"]')).toBeChecked();
	});

	test('article editorial scalar fields and relationship variants save', async ({
		signedInPage,
	}) => {
		const article = await fixtureDoc('Article', 'article-launch-playbook');
		const admin = await fixtureDoc('User', 'account-admin');
		const editor = await fixtureDoc('User', 'account-editor');
		const articleId = objectIdText(article._id);
		const adminId = objectIdText(admin._id);
		const editorId = objectIdText(editor._id);
		const editorName = asRecord(editor.name);
		const editorLabel = `${editorName.first} ${editorName.last}`;

		await gotoAdminNextItem(signedInPage, 'Article', articleId);
		await signedInPage.locator('input#title').fill('Launch Playbook Roundtrip');
		await signedInPage.locator('input#slugKey').fill('launch-playbook-roundtrip');
		await signedInPage.locator('textarea#summary').fill('Updated summary for full field coverage.');
		await signedInPage.locator('textarea#bodyMarkdown').fill('## Updated plan\n\nRound-trip every major editorial field.');
		// bodyHtml uses the TipTap WYSIWYG editor.
		// Type into the ProseMirror contenteditable. First clear any existing
		// content then type plain text (the round-trip just verifies storage).
		const htmlEditor = signedInPage.locator('[data-field-name="bodyHtml"] .ProseMirror');
		await htmlEditor.click();
		await signedInPage.keyboard.press('Control+a');
		await signedInPage.keyboard.press('Delete');
		await htmlEditor.pressSequentially('Updated HTML coverage.');
		// codeSample now renders a CodeMirror 6 editor — type via keyboard after focusing .cm-content
		const codeSampleContent = signedInPage.locator('[data-codemirror-field="codeSample"] .cm-content');
		await codeSampleContent.click();
		await signedInPage.keyboard.press('ControlOrMeta+a');
		await signedInPage.keyboard.type('export const covered = true;');
		await signedInPage.locator('select#state').selectOption('review');
		await signedInPage.locator('select#priority').selectOption('1');
		await signedInPage.locator('input#canonicalUrl').fill('https://example.com/articles/roundtrip');
		await fillColor(signedInPage.locator('input#accentColor'), '#123456');
		await signedInPage.locator('input#readingMinutes').fill('13');
		await setCheckbox(signedInPage.locator('input[name="featured"]'), false);
		await signedInPage.locator('input#publishedOn').fill('2026-03-04');
		// reviewedAt uses the split-input datetime widget (date + time separate inputs).
		// The date input has id=reviewedAt; the time input is addressed by data-attr.
		await signedInPage.locator('input#reviewedAt').fill('2026-03-04');
		await signedInPage.locator('[data-field-name="reviewedAt"] input[data-field-datetime-time]').fill('10:45');

		const authorField = fieldShell(signedInPage, 'author', 'relationship');
		const authorRemove = authorField.getByRole('button', { name: /Remove / });
		if (await authorRemove.count()) {
			await authorRemove.first().click();
		}
		await chooseRelationship(signedInPage, 'author', 'User', 'Morgan', editorLabel);

		const editorsField = fieldShell(signedInPage, 'editors', 'relationship');
		// Remove all possible editors so the test is idempotent across serial-mode
		// retries (a failed sibling test re-runs the whole describe block).
		for (const label of [editorLabel, 'Riley Producer', 'Test Admin']) {
			const remove = editorsField.getByRole('button', { name: `Remove ${label}` });
			if (await remove.count()) {
				await remove.click();
			}
		}
		await chooseRelationship(signedInPage, 'editors', 'User', 'Test', 'Test Admin');

		await saveAdminNextItem(signedInPage, 'Article', articleId);

		const stored = await fixtureDoc('Article', 'article-launch-playbook');
		expect(stored.title).toBe('Launch Playbook Roundtrip');
		expect(stored.slugKey).toBe('launch-playbook-roundtrip');
		expect(stored.summary).toBe('Updated summary for full field coverage.');
		expect(asRecord(stored.bodyMarkdown).md).toBe('## Updated plan\n\nRound-trip every major editorial field.');
		expect(typeof stored.bodyHtml).toBe('string');
		expect(stored.bodyHtml as string).toContain('Updated HTML coverage.');
		expect(stored.codeSample).toBe('export const covered = true;');
		expect(stored.state).toBe('review');
		expect(stored.priority).toBe(1);
		expect(stored.canonicalUrl).toBe('https://example.com/articles/roundtrip');
		expect(stored.accentColor).toBe('#123456');
		expect(stored.readingMinutes).toBe(13);
		expect(stored.featured).toBe(false);
		expect(dateInputText(stored.publishedOn)).toBe('2026-03-04');
		expect(datetimeInputText(stored.reviewedAt)).toBe('2026-03-04T10:45');
		expect(objectIdText(stored.author)).toBe(editorId);
		expect(objectIdTexts(stored.editors)).toEqual([adminId]);

		await gotoAdminNextItem(signedInPage, 'Article', articleId);
		await expect(signedInPage.locator('input#title')).toHaveValue('Launch Playbook Roundtrip');
		await expect(signedInPage.getByText(editorLabel).first()).toBeVisible();
		await expect(fieldShell(signedInPage, 'editors', 'relationship').getByText('Test Admin')).toBeVisible();
	});

	test('venue location and geopoint fields save structured values', async ({
		signedInPage,
	}) => {
		const venue = await fixtureDoc('Venue', 'venue-main-hall');
		const venueId = objectIdText(venue._id);

		await gotoAdminNextItem(signedInPage, 'Venue', venueId);
		await signedInPage.locator('input#address_number').fill('10');
		await signedInPage.locator('input#address_name').fill('Roundtrip Hall');
		await signedInPage.locator('input#address_street1').fill('Atlantic Avenue');
		await signedInPage.locator('input#address_street2').fill('Suite 5');
		await signedInPage.locator('input#address_suburb').fill('Boston');
		await signedInPage.locator('input#address_state').fill('MA');
		await signedInPage.locator('input#address_postcode').fill('02110');
		await signedInPage.locator('input#address_country').fill('US');
		await signedInPage.locator('input#coordinates_lat').fill('42.3601');
		await signedInPage.locator('input#coordinates_lng').fill('-71.0589');

		await saveAdminNextItem(signedInPage, 'Venue', venueId);

		const stored = await fixtureDoc('Venue', 'venue-main-hall');
		const address = asRecord(stored.address);
		expect(address.number).toBe('10');
		expect(address.name).toBe('Roundtrip Hall');
		expect(address.street1).toBe('Atlantic Avenue');
		expect(address.street2).toBe('Suite 5');
		expect(address.suburb).toBe('Boston');
		expect(address.state).toBe('MA');
		expect(address.postcode).toBe('02110');
		expect(address.country).toBe('US');
		expect(stored.coordinates).toEqual([-71.0589, 42.3601]);

		await gotoAdminNextItem(signedInPage, 'Venue', venueId);
		await expect(signedInPage.locator('input#coordinates_lat')).toHaveValue('42.3601');
		await expect(signedInPage.locator('input#coordinates_lng')).toHaveValue('-71.0589');
	});

	test('event date array, money, number, date, datetime, and boolean fields save', async ({
		signedInPage,
	}) => {
		const event = await fixtureDoc('Event', 'event-launch-workshop');
		const eventId = objectIdText(event._id);

		await gotoAdminNextItem(signedInPage, 'Event', eventId);
		await signedInPage.locator('input#startsOn').fill('2026-04-01');
		await signedInPage.locator('input#doorsOpenAt').fill('2026-04-01');
		await signedInPage.locator('[data-field-name="doorsOpenAt"] input[data-field-datetime-time]').fill('18:30');
		await signedInPage.locator('input#blackoutDates').fill('2026-03-30, 2026-03-31');
		await signedInPage.locator('input#ticketPrice').fill('199.5');
		await signedInPage.locator('input#capacity').fill('320');
		await setCheckbox(signedInPage.locator('input[name="published"]'), false);

		await saveAdminNextItem(signedInPage, 'Event', eventId);

		const stored = await fixtureDoc('Event', 'event-launch-workshop');
		expect(dateInputText(stored.startsOn)).toBe('2026-04-01');
		expect(datetimeInputText(stored.doorsOpenAt)).toBe('2026-04-01T18:30');
		expect(Array.isArray(stored.blackoutDates)).toBe(true);
		expect((stored.blackoutDates as Date[]).map(dateInputText)).toEqual([
			'2026-03-30',
			'2026-03-31',
		]);
		expect(stored.ticketPrice).toBe(199.5);
		expect(stored.capacity).toBe(320);
		expect(stored.published).toBe(false);
	});

	test('product key, color, text array, number array, and commerce fields save', async ({
		signedInPage,
	}) => {
		const product = await fixtureDoc('Product', 'product-starter-kit');
		const productId = objectIdText(product._id);

		await gotoAdminNextItem(signedInPage, 'Product', productId);
		await signedInPage.locator('input#name').fill('Editorial Starter Kit Plus');
		await signedInPage.locator('input#sku').fill('editorial-starter-kit-plus');
		await signedInPage.locator('select#status').selectOption('retired');
		await signedInPage.locator('input#price').fill('349.75');
		await signedInPage.locator('input#inventoryCount').fill('17');
		await fillColor(signedInPage.locator('input#swatchColor'), '#654321');
		await signedInPage.locator('input#tags').fill('editorial, launch, field coverage');
		await signedInPage.locator('input#ratingHistory').fill('4.1, 4.2, 4.9');
		await signedInPage.locator('input#manualUrl').fill('https://example.com/products/kit-plus/manual');

		await saveAdminNextItem(signedInPage, 'Product', productId);

		const stored = await fixtureDoc('Product', 'product-starter-kit');
		expect(stored.name).toBe('Editorial Starter Kit Plus');
		expect(stored.sku).toBe('editorial-starter-kit-plus');
		expect(stored.status).toBe('retired');
		expect(stored.price).toBe(349.75);
		expect(stored.inventoryCount).toBe(17);
		expect(stored.swatchColor).toBe('#654321');
		expect(stored.tags).toEqual(['editorial', 'launch', 'field coverage']);
		expect(stored.ratingHistory).toEqual([4.1, 4.2, 4.9]);
		expect(stored.manualUrl).toBe('https://example.com/products/kit-plus/manual');
	});

	test('media file and Cloudinary compatibility fields can be cleared hermetically', async ({
		signedInPage,
	}) => {
		const media = await fixtureDoc('MediaAsset', 'media-hero');
		const mediaId = objectIdText(media._id);

		await gotoAdminNextItem(signedInPage, 'MediaAsset', mediaId);

		await fieldShell(signedInPage, 'download', 'file')
			.getByRole('button', { name: 'Remove' })
			.click();
		await fieldShell(signedInPage, 'legacyImage', 'cloudinaryimage')
			.getByRole('button', { name: 'Remove' })
			.click();
		await fieldShell(signedInPage, 'cloudinaryDirectImage', 'cloudinary')
			.getByRole('button', { name: 'Remove' })
			.click();

		const galleryField = fieldShell(signedInPage, 'legacyGallery', 'cloudinaryimages');
		while (await galleryField.getByRole('button', { name: 'Remove image' }).count()) {
			await galleryField.getByRole('button', { name: 'Remove image' }).first().click();
		}
		const directGalleryField = fieldShell(signedInPage, 'cloudinaryDirectGallery', 'cloudinary');
		while (await directGalleryField.getByRole('button', { name: 'Remove image' }).count()) {
			await directGalleryField.getByRole('button', { name: 'Remove image' }).first().click();
		}

		await saveAdminNextItem(signedInPage, 'MediaAsset', mediaId);

		const stored = await fixtureDoc('MediaAsset', 'media-hero');
		expect(asRecord(stored.download).filename).toBeNull();
		expect(asRecord(stored.legacyImage).public_id).toBe('');
		expect(stored.legacyGallery).toEqual([]);
		expect(asRecord(stored.cloudinaryDirectImage).public_id).toBe('');
		expect(stored.cloudinaryDirectGallery).toEqual([]);
	});
});
