import { Types } from 'mongoose';
import type { Locator, Page, Response } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

type MongoDoc = Record<string, unknown> & { _id: Types.ObjectId };

function objectIdText(value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

async function fixtureDoc(collection: string, fixtureKey: string): Promise<MongoDoc> {
	const doc = await withMongo((db) =>
		db.collection(collection).findOne({ fixtureKey }),
	);
	expect(doc, `${collection}.${fixtureKey} should exist`).toBeTruthy();
	return doc as MongoDoc;
}

function fieldShell(page: Page, fieldName: string, fieldType: string): Locator {
	return page.locator(
		`[data-field-name="${fieldName}"][data-field-type="${fieldType}"]`,
	);
}

function formFieldShell(page: Page, fieldName: string, fieldType: string): Locator {
	return page.locator('form').locator(
		`[data-field-name="${fieldName}"][data-field-type="${fieldType}"]`,
	);
}

async function gotoAdminNextItem(page: Page, listKey: string, id: string): Promise<void> {
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

async function saveAdminNextItem(page: Page, listKey: string, id: string): Promise<void> {
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

async function createAdminNextItem(page: Page, listKey: string): Promise<Response> {
	const create = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/${listKey}/create`) &&
			r.request().method() === 'POST',
	);
	await page.getByRole('button', { name: /^Create$/ }).click();
	return create;
}

async function setCheckbox(checkbox: Locator, checked: boolean): Promise<void> {
	if ((await checkbox.isChecked()) !== checked) {
		await checkbox.setChecked(checked);
	}
}

test.describe('Nightwatch high-value regression ports', () => {
	test('many relationship clears a deleted related target', async ({ signedInPage }) => {
		const source = await fixtureDoc('ManyRelationship', 'many-relationship-alpha');
		const target = await fixtureDoc('RelationshipTarget', 'relationship-target-alpha');
		const sourceId = objectIdText(source._id);
		const targetId = objectIdText(target._id);

		await gotoAdminNextItem(signedInPage, 'ManyRelationship', sourceId);
		const relatedField = fieldShell(signedInPage, 'fieldA', 'relationship');
		await expect(relatedField.getByText('Relationship Target Alpha')).toBeVisible();

		await withMongo((db) =>
			db.collection('RelationshipTarget').deleteOne({ _id: new Types.ObjectId(targetId) }),
		);

		await signedInPage.reload({ waitUntil: 'networkidle' });
		await expect(relatedField.getByText('Relationship Target Alpha')).toHaveCount(0);
		await expect(relatedField.locator('[data-field-relationship-chip]')).toHaveCount(0);

		const stored = await fixtureDoc('ManyRelationship', 'many-relationship-alpha');
		expect((stored.fieldA as Types.ObjectId[]).map(objectIdText)).toEqual([targetId]);
	});

	test('invalid Datetime create input is rejected without epoch normalization', async ({
		signedInPage,
	}) => {
		const name = `Invalid Datetime ${Date.now()}`;

		await signedInPage.goto('/keystone-next/DatetimeValidation/create');
		await expect(signedInPage.locator('form')).toBeVisible();
		await signedInPage.locator('input#name').fill(name);
		await signedInPage.locator('input#fieldA').fill('2026-05-22');
		await signedInPage.locator('[data-field-name="fieldA"] input[data-field-datetime-time]').fill('bar');

		const response = await createAdminNextItem(signedInPage, 'DatetimeValidation');
		expect(response.status()).toBeGreaterThanOrEqual(400);
		await expect(signedInPage.getByRole('alert').or(signedInPage.getByRole('status'))).toContainText(/invalid|error|failed/i);

		const stored = await withMongo((db) =>
			db.collection('DatetimeValidation').findOne({ name }),
		);
		expect(stored).toBeNull();
	});

	test('hidden initial relationship fields are omitted from admin-next create forms', async ({
		signedInPage,
	}) => {
		await signedInPage.goto('/keystone-next/HiddenRelationship/create', { waitUntil: 'networkidle' });
		await expect(signedInPage.locator('form')).toBeVisible();
		await expect(formFieldShell(signedInPage, 'fieldA', 'relationship')).toHaveCount(0);
	});

	test('list view falls back to ID and respects explicit columns query', async ({
		signedInPage,
	}) => {
		const doc = await fixtureDoc('NoDefaultColumn', 'no-default-column-alpha');
		const id = objectIdText(doc._id);

		const fallbackLoad = signedInPage.waitForResponse(
			(r) =>
				r.url().includes('/keystone-api/NoDefaultColumn') &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await signedInPage.goto('/keystone-next/NoDefaultColumn');
		await fallbackLoad;
		const fallbackRow = signedInPage.locator(`[data-list-row][data-item-id="${id}"]`);
		await expect(fallbackRow).toBeVisible();
		await expect(signedInPage.getByRole('button', { name: /^ID$/ }).first()).toBeVisible();
		await expect(fallbackRow).toContainText(id);
		await expect(signedInPage.getByRole('button', { name: 'Field A' })).toHaveCount(0);

		const explicitLoad = signedInPage.waitForResponse(
			(r) =>
				r.url().includes('/keystone-api/NoDefaultColumn') &&
				r.url().includes('fields=id%2CfieldA') &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await signedInPage.goto('/keystone-next/NoDefaultColumn?columns=id,fieldA');
		await explicitLoad;
		const explicitRow = signedInPage.locator(`[data-list-row][data-item-id="${id}"]`);
		await expect(signedInPage.getByRole('button', { name: /^ID$/ }).first()).toBeVisible();
		await expect(signedInPage.getByRole('button', { name: 'Field A' }).first()).toBeVisible();
		await expect(explicitRow).toContainText(id);
		await expect(explicitRow.locator('[data-list-cell][data-field-name="fieldA"][data-field-type="text"]')).toContainText('Fallback column A');
	});

	test('Date-backed map.name renders a navigable row link', async ({ signedInPage }) => {
		const doc = await fixtureDoc('DateFieldMap', 'date-field-map-alpha');
		const id = objectIdText(doc._id);

		const listLoad = signedInPage.waitForResponse(
			(r) =>
				r.url().includes('/keystone-api/DateFieldMap') &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await signedInPage.goto('/keystone-next/DateFieldMap');
		await listLoad;
		const row = signedInPage.locator(`[data-list-row][data-item-id="${id}"]`);
		await expect(row).toBeVisible();
		const link = row.locator('[data-list-row-edit][data-item-id]').first();
		await expect(link).toBeVisible();

		const itemLoad = signedInPage.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/DateFieldMap/${id}`) &&
				r.request().method() === 'GET' &&
				r.status() === 200,
		);
		await link.click();
		await itemLoad;
		await expect(signedInPage).toHaveURL(new RegExp(`/keystone-next/date-field-maps/${id}$`));
		await expect(signedInPage.locator('form')).toBeVisible();
	});

	test('dependsOn fields dynamically hide and show on create and edit forms', async ({
		signedInPage,
	}) => {
		await signedInPage.goto('/keystone-next/DependsOn/create', { waitUntil: 'networkidle' });
		await expect(signedInPage.locator('form')).toBeVisible();
		await signedInPage.locator('input#name').fill(`Depends On Create ${Date.now()}`);
		const createDependency = signedInPage.locator('input[name="dependency"]');
		const createDependent = formFieldShell(signedInPage, 'dependent', 'select');
		await setCheckbox(createDependency, false);
		await expect(createDependent).toBeVisible();
		await signedInPage.locator('select#dependent').selectOption('ham');
		await setCheckbox(createDependency, true);
		await expect(createDependent).toHaveCount(0);
		await setCheckbox(createDependency, false);
		await expect(createDependent).toBeVisible();
		await expect(signedInPage.locator('select#dependent')).toHaveValue('ham');

		const existing = await fixtureDoc('DependsOn', 'depends-on-alpha');
		const existingId = objectIdText(existing._id);
		await gotoAdminNextItem(signedInPage, 'DependsOn', existingId);
		const editDependency = signedInPage.locator('input[name="dependency"]');
		const editDependent = formFieldShell(signedInPage, 'dependent', 'select');
		await setCheckbox(editDependency, false);
		await expect(editDependent).toBeVisible();
		await signedInPage.locator('select#dependent').selectOption('ham');
		await setCheckbox(editDependency, true);
		await expect(editDependent).toHaveCount(0);
		await saveAdminNextItem(signedInPage, 'DependsOn', existingId);

		let stored = await fixtureDoc('DependsOn', 'depends-on-alpha');
		expect(stored.dependency).toBe(true);
		expect(stored.dependent).toBe('ham');

		await gotoAdminNextItem(signedInPage, 'DependsOn', existingId);
		await setCheckbox(signedInPage.locator('input[name="dependency"]'), false);
		await expect(formFieldShell(signedInPage, 'dependent', 'select')).toBeVisible();
		await expect(signedInPage.locator('select#dependent')).toHaveValue('ham');
		await saveAdminNextItem(signedInPage, 'DependsOn', existingId);

		stored = await fixtureDoc('DependsOn', 'depends-on-alpha');
		expect(stored.dependency).toBe(false);
		expect(stored.dependent).toBe('ham');
	});
});
