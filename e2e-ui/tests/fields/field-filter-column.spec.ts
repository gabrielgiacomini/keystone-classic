import { Types } from 'mongoose';
import type { APIRequestContext, Response } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';
import { canonicalFieldCoverage } from '../../fixtures/field-complete/fieldCoverageManifest.js';
import type { FieldCoverageCase } from '../../fixtures/field-complete/fieldCoverageManifest.js';

type MongoDoc = Record<string, unknown> & { _id: Types.ObjectId };

// A FieldCoverageCase narrowed to entries that have all the fields needed
// to drive a filter UI assertion (listKey, mongoCollection, fixtureKey, path).
type FilterEntry = FieldCoverageCase & {
	listKey: string;
	mongoCollection: string;
	fixtureKey: string;
	path: string;
	supportsFilter: true;
};

interface ListResponse {
	results?: Array<{ id?: string; _id?: string }>;
}

function asRecord(value: unknown): Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? value as Record<string, unknown>
		: {};
}

function objectIdText(value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

function objectIdTexts(value: unknown): string[] {
	return Array.isArray(value) ? value.map(objectIdText) : [];
}

function dateText(value: unknown): string {
	return value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '').slice(0, 10);
}

async function fixtureDoc(collection: string, fixtureKey: string): Promise<MongoDoc> {
	const doc = await withMongo((db) =>
		db.collection(collection).findOne({ fixtureKey }),
	);
	expect(doc, `${collection}.${fixtureKey} should exist`).toBeTruthy();
	return doc as MongoDoc;
}

function currentFieldValue(doc: MongoDoc, entry: FilterEntry): unknown {
	return entry.path ? doc[entry.path] : undefined;
}

function positiveFilterValue(doc: MongoDoc, entry: FilterEntry): unknown {
	const value = currentFieldValue(doc, entry);

	switch (entry.typeName) {
		case 'boolean':
			return value ? 'true' : 'false';
		case 'date':
		case 'datetime':
			return dateText(value);
		case 'datearray':
			return Array.isArray(value) ? dateText(value[0]) : '';
		case 'geopoint': {
			// Stored as [lng, lat]; send lat/lon + generous radius to include the fixture.
			const coords = Array.isArray(value) ? value : [];
			const lng = Number(coords[0] ?? 0);
			const lat = Number(coords[1] ?? 0);
			return { lat, lon: lng, distance: { mode: 'max', value: 500 } };
		}
		case 'location':
			return String(asRecord(value).suburb ?? '');
		case 'markdown':
			return String(asRecord(value).md ?? '');
		case 'name': {
			const name = asRecord(value);
			return String(name.first ?? name.last ?? '');
		}
		case 'numberarray':
		case 'textarray':
			return Array.isArray(value) ? String(value[0] ?? '') : '';
		case 'relationship': {
			const ids = objectIdTexts(value);
			return ids[0] ?? objectIdText(value);
		}
		default:
			return String(value ?? '');
	}
}

function negativeFilterValue(doc: MongoDoc, entry: FilterEntry): unknown {
	const value = currentFieldValue(doc, entry);

	switch (entry.typeName) {
		case 'boolean':
			return value ? 'false' : 'true';
		case 'date':
		case 'datearray':
		case 'datetime':
			return '1999-01-01';
		case 'geopoint':
			// North Pole — far from any seeded fixture.
			return { lat: 90, lon: 0, distance: { mode: 'max', value: 1 } };
		case 'money':
		case 'number':
		case 'numberarray':
			return '999999';
		case 'relationship':
			return new Types.ObjectId().toString();
		case 'select':
			if (entry.variant === 'numeric') return value === 1 ? 2 : 1;
			return value === 'administrator' ? 'editor' : 'administrator';
		default:
			return 'zz-field-complete-no-match';
	}
}

function numberFilterValue(value: unknown): unknown {
	if (typeof value === 'number') return value;
	if (typeof value === 'string' && value.trim() !== '') {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : value;
	}
	return value;
}

function apiFilter(entry: FilterEntry, value: unknown): Record<string, unknown> {
	switch (entry.typeName) {
		case 'boolean':
			return { value };
		case 'date':
		case 'datearray':
		case 'datetime':
			return { mode: 'on', value };
		case 'geopoint':
			// value is already the full filter object { lat, lon, distance: { mode, value } }
			return value as Record<string, unknown>;
		case 'location':
			return { city: value };
		case 'money':
		case 'number':
		case 'numberarray':
			return { mode: 'equals', value: numberFilterValue(value) };
		case 'relationship':
			return { value };
		case 'select':
			return { value: entry.variant === 'numeric' ? numberFilterValue(value) : value };
		default:
			return { mode: 'contains', value };
	}
}

async function filteredIds(
	request: APIRequestContext,
	entry: FilterEntry,
	value: unknown,
): Promise<string[]> {
	const filters = JSON.stringify({ [entry.path!]: apiFilter(entry, value) });
	const res = await request.get(
		`/keystone-api/${entry.listKey}?fields=false&limit=100&filters=${encodeURIComponent(filters)}`,
	);
	expect(res.status(), `${entry.listKey}.${entry.path} filter request should succeed`).toBe(200);
	const body = (await res.json()) as ListResponse;
	return (body.results ?? []).map((item) => String(item.id ?? item._id ?? ''));
}

function isFilteredListResponse(
	response: Response,
	listKey: string,
	fieldPath: string,
	value: unknown,
): boolean {
	if (response.request().method() !== 'GET' || response.status() !== 200) return false;

	const url = new URL(response.url());
	if (!url.pathname.endsWith(`/keystone-api/${listKey}`)) return false;

	const filters = url.searchParams.get('filters');
	if (filters === null) return false;

	try {
		const parsed = JSON.parse(filters) as Record<string, Record<string, unknown>>;
		return String(parsed[fieldPath]?.value ?? '') === String(value);
	} catch {
		return false;
	}
}

const filterableEntries = canonicalFieldCoverage.filter(
	(entry): entry is FilterEntry =>
		entry.supportsFilter === true &&
		Boolean(entry.listKey) &&
		Boolean(entry.mongoCollection) &&
		Boolean(entry.fixtureKey) &&
		Boolean(entry.path),
);

function groupedFilterEntries(): Array<{ listKey: string; fields: FilterEntry[] }> {
	const groups = new Map<string, FilterEntry[]>();
	for (const entry of filterableEntries) {
		const fields = groups.get(entry.listKey!) ?? [];
		fields.push(entry);
		groups.set(entry.listKey!, fields);
	}
	return [...groups.entries()].map(([listKey, fields]) => ({ listKey, fields }));
}

test.describe('field-complete filters and columns', () => {
	for (const group of groupedFilterEntries()) {
		test(`${group.listKey} renders admin next filter controls`, async ({ signedInPage }) => {
			await signedInPage.goto(`/keystone-next/${group.listKey}`);
			const filterButton = signedInPage.locator('[data-list-filters-add] > button').first();
			await expect(
				filterButton,
				`${group.listKey} filter dropdown trigger should render`,
			).toBeVisible();

			for (const field of group.fields) {
				await filterButton.click();
				const fieldLabel = field.label ?? field.path;
				const fieldRow = signedInPage
					.locator('[data-list-filters-add] ul button')
					.filter({ has: signedInPage.locator(`span:text-is("${fieldLabel}")`) })
					.first();
				await fieldRow.click();
				await expect(
					signedInPage.locator(
						`[data-field-filter][data-field-name="${field.path}"][data-field-type="${field.typeName}"]`,
					),
					`${group.listKey}.${field.path} filter control should render`,
				).toBeVisible();
				// Close the dropdown to reset state for the next field by clicking outside it.
				await signedInPage.locator('body').click({ position: { x: 5, y: 5 } });
			}
		});
	}

	test('admin next applies a text filter through the filter UI', async ({ signedInPage }) => {
		const doc = await fixtureDoc('Article', 'article-launch-playbook');
		const id = objectIdText(doc._id);
		const title = String(doc.title ?? '');
		expect(title, 'Article fixture should have a title to filter by').toBeTruthy();

		const listLoad = signedInPage.waitForResponse(
			(response) =>
				response.url().includes('/keystone-api/Article') &&
				response.request().method() === 'GET' &&
				response.status() === 200,
		);
		await signedInPage.goto('/keystone-next/Article');
		await listLoad;

		const row = signedInPage.locator(`[data-list-row][data-item-id="${id}"]`);
		await expect(row, 'Article fixture row should render before filtering').toBeVisible();

		// Open the Filter dropdown and pick the Title field.
		const filterButton = signedInPage.locator('[data-list-filters-add] > button').first();

		async function openFilterAndPick(label: string): Promise<void> {
			await filterButton.click();
			await signedInPage
				.locator('[data-list-filters-add] ul button')
				.filter({ has: signedInPage.locator(`span:text-is("${label}")`) })
				.first()
				.click();
		}

		async function applyDraft(): Promise<void> {
			await signedInPage
				.locator('[data-list-filters-add]')
				.getByRole('button', { name: /^Apply$/ })
				.click();
		}

		await openFilterAndPick('Title');
		const filterInput = signedInPage
			.locator('[data-field-filter][data-field-name="title"] input')
			.first();

		const positiveLoad = signedInPage.waitForResponse((response) =>
			isFilteredListResponse(response, 'Article', 'title', title),
		);
		await filterInput.fill(title);
		await applyDraft();
		await positiveLoad;
		await expect(row, 'Article fixture row should remain visible after matching filter').toBeVisible();

		// Remove the existing chip and re-apply with a non-matching value.
		await signedInPage
			.locator('[data-list-filter-chip][data-field-name="title"]')
			.getByRole('button', { name: /^Remove filter/ })
			.click();

		const negativeTitle = `${title}-no-match`;
		await openFilterAndPick('Title');
		const negativeLoad = signedInPage.waitForResponse((response) =>
			isFilteredListResponse(response, 'Article', 'title', negativeTitle),
		);
		await signedInPage
			.locator('[data-field-filter][data-field-name="title"] input')
			.first()
			.fill(negativeTitle);
		await applyDraft();
		await negativeLoad;
		await expect(row, 'Article fixture row should be removed after non-matching filter').toHaveCount(0);
		await expect(signedInPage.getByText(/No\s+articles\s+found/i)).toBeVisible();
	});

	for (const entry of filterableEntries) {
		test(`${entry.listKey}.${entry.path} filters through the admin API`, async ({
			signedInPage,
		}) => {
			const doc = await fixtureDoc(entry.mongoCollection!, entry.fixtureKey!);
			const id = objectIdText(doc._id);
			const positiveIds = await filteredIds(
				signedInPage.request,
				entry,
				positiveFilterValue(doc, entry),
			);
			expect(positiveIds, `${entry.listKey}.${entry.path} positive filter should include fixture row`).toContain(id);

			const negativeIds = await filteredIds(
				signedInPage.request,
				entry,
				negativeFilterValue(doc, entry),
			);
			expect(negativeIds, `${entry.listKey}.${entry.path} negative filter should exclude fixture row`).not.toContain(id);
		});
	}
});
