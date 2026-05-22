import { Types } from 'mongoose';
import type { Page } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

type MongoDoc = Record<string, unknown> & { _id: Types.ObjectId };

function objectIdText(value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

function objectIdTexts(value: unknown): string[] {
	return Array.isArray(value) ? value.map(objectIdText) : [];
}

async function fixtureDoc(collection: string, fixtureKey: string): Promise<MongoDoc> {
	const doc = await withMongo((db) =>
		db.collection(collection).findOne({ fixtureKey }),
	);
	expect(doc, `${collection}.${fixtureKey} should exist`).toBeTruthy();
	return doc as MongoDoc;
}

async function ensureRelationshipVariantArticle(): Promise<MongoDoc> {
	const doc = await withMongo(async (db) => {
		const existing = await db
			.collection('Article')
			.findOne({ fixtureKey: 'article-relationship-variant' });
		if (existing) return existing;
		const _id = new Types.ObjectId();
		await db.collection('Article').insertOne({
			_id,
			fixtureKey: 'article-relationship-variant',
			title: 'Relationship Variant Article',
			slug: 'relationship-variant-article',
			slugKey: 'relationship-variant-article',
			summary: 'Used by the many relationship picker test.',
			state: 'published',
			priority: 2,
			featured: false,
		});
		return db.collection('Article').findOne({ _id });
	});
	expect(doc, 'relationship variant article should exist').toBeTruthy();
	return doc as MongoDoc;
}

function fieldShell(page: Page, fieldName: string, fieldType: string) {
	return page.locator(
		`[data-field-name="${fieldName}"][data-field-type="${fieldType}"]`,
	);
}

async function gotoItem(page: Page, listKey: string, id: string): Promise<void> {
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

async function saveItem(page: Page, listKey: string, id: string): Promise<void> {
	const save = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/${listKey}/${id}`) &&
			r.request().method() === 'POST',
	);
	await page.getByRole('button', { name: /^Save$/ }).click();
	const res = await save;
	expect(res.status()).toBe(200);
	await expect(page.getByRole('status')).toContainText(/saved successfully/i);
}

async function chooseRelationship(
	page: Page,
	fieldName: string,
	refListKey: string,
	search: string,
	label: string,
): Promise<void> {
	// For single-relationship pickers, the search input is hidden behind a `▾`
	// toggle; clicking it opens the search popout. Many-pickers already render
	// the input inline, so the toggle is a no-op when not present.
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

test.describe('field-complete relationship variants', () => {
	test('single relationship picker saves an Event venue', async ({ signedInPage }) => {
		const event = await fixtureDoc('Event', 'event-launch-workshop');
		const venue = await fixtureDoc('Venue', 'venue-main-hall');
		const eventId = objectIdText(event._id);
		const venueId = objectIdText(venue._id);

		await gotoItem(signedInPage, 'Event', eventId);

		const venueField = fieldShell(signedInPage, 'venue', 'relationship');
		const remove = venueField.getByRole('button', { name: /Remove / });
		if (await remove.count()) {
			await remove.first().click();
		}
		await chooseRelationship(signedInPage, 'venue', 'Venue', 'North', 'North Pier Hall');
		await saveItem(signedInPage, 'Event', eventId);

		const stored = await fixtureDoc('Event', 'event-launch-workshop');
		expect(objectIdText(stored.venue)).toBe(venueId);
	});

	test('many relationship picker saves Product related articles', async ({
		signedInPage,
	}) => {
		const product = await fixtureDoc('Product', 'product-starter-kit');
		const article = await ensureRelationshipVariantArticle();
		const productId = objectIdText(product._id);
		const articleId = objectIdText(article._id);

		await gotoItem(signedInPage, 'Product', productId);

		const relatedField = fieldShell(signedInPage, 'relatedArticles', 'relationship');
		const remove = relatedField.getByRole('button', { name: /Remove / });
		while (await remove.count()) {
			await remove.first().click();
		}
		await expect(remove).toHaveCount(0);

		await chooseRelationship(
			signedInPage,
			'relatedArticles',
			'Article',
			'Relationship Variant',
			'Relationship Variant Article',
		);
		await saveItem(signedInPage, 'Product', productId);

		const stored = await fixtureDoc('Product', 'product-starter-kit');
		expect(objectIdTexts(stored.relatedArticles)).toEqual([articleId]);
	});
});
