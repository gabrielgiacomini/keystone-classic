import { Types } from 'mongoose';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';
import { canonicalFieldCoverage } from '../../fixtures/field-complete/fieldCoverageManifest.js';

interface ColumnField {
	path: string;
	label: string;
	typeName: string;
}

interface ColumnGroup {
	listKey: string;
	mongoCollection: string;
	fixtureKey: string;
	fields: ColumnField[];
}

function objectIdText (value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

function groupedColumnEntries (): ColumnGroup[] {
	const groups = new Map<string, ColumnGroup>();

	for (const entry of canonicalFieldCoverage) {
		if (
			entry.supportsColumn !== true ||
			!entry.listKey ||
			!entry.mongoCollection ||
			!entry.fixtureKey ||
			!entry.path ||
			!entry.label
		) {
			continue;
		}

		const key = `${entry.listKey}:${entry.fixtureKey}`;
		const group = groups.get(key) ?? {
			listKey: entry.listKey,
			mongoCollection: entry.mongoCollection,
			fixtureKey: entry.fixtureKey,
			fields: [],
		};
		if (!group.fields.some((field) => field.path === entry.path)) {
			group.fields.push({
				path: entry.path,
				label: entry.label,
				typeName: entry.typeName,
			});
		}
		groups.set(key, group);
	}

	return [...groups.values()];
}

async function fixtureItemId (
	collection: string,
	fixtureKey: string,
): Promise<string> {
	const doc = await withMongo((db) =>
		db.collection(collection).findOne({ fixtureKey }, { projection: { _id: 1 } }),
	);
	expect(doc, `${collection}.${fixtureKey} should exist`).toBeTruthy();
	return objectIdText(doc?._id);
}

test.describe('field-complete list columns', () => {
	for (const group of groupedColumnEntries()) {
		test(`${group.listKey} renders covered default columns`, async ({
			signedInPage,
		}) => {
			const id = await fixtureItemId(group.mongoCollection, group.fixtureKey);
			const listLoad = signedInPage.waitForResponse(
				(r) =>
					r.url().includes(`/keystone-api/${group.listKey}`) &&
					r.request().method() === 'GET' &&
					r.status() === 200,
			);
			await signedInPage.goto(`/keystone-next/${group.listKey}`);
			await listLoad;

			const row = signedInPage.locator(`[data-list-row][data-item-id="${id}"]`);
			await expect(row, `${group.listKey} seeded row should render`).toBeVisible();

			for (const field of group.fields) {
				await expect(
					signedInPage.getByRole('button', { name: field.label }).first(),
					`${group.listKey}.${field.path} column header should render`,
				).toBeVisible();
				await expect(
					row.locator(
						`[data-list-cell][data-field-name="${field.path}"][data-field-type="${field.typeName}"]`,
					),
					`${group.listKey}.${field.path} column cell should render`,
				).toBeVisible();
			}
		});
	}
});
