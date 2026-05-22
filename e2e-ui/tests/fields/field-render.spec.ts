import { expect, type APIRequestContext, type Page } from '@playwright/test';
import { test } from '../../fixtures/auth.js';
import { canonicalFieldCoverage } from '../../fixtures/field-complete/fieldCoverageManifest.js';

interface ListResponse {
	results?: Array<{ id?: string; _id?: string }>;
}

interface GroupedEntries {
	listKey: string;
	listPath: string;
	fields: Array<{
		path: string;
		label: string;
		typeName: string;
	}>;
}

function groupedRenderEntries (): GroupedEntries[] {
	const groups = new Map<string, GroupedEntries>();

	for (const entry of canonicalFieldCoverage) {
		if (entry.supportsRender !== true || !entry.listKey || !entry.listPath || !entry.path || !entry.label) {
			continue;
		}
		const key = `${entry.listKey}:${entry.listPath}`;
		const group = groups.get(key) ?? {
			listKey: entry.listKey,
			listPath: entry.listPath,
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

async function firstItemIdForList (request: APIRequestContext, listPath: string): Promise<string> {
	const res = await request.get(`/keystone-api/${listPath}?fields=false&limit=1`);
	expect(res.status(), `${listPath} list fetch should succeed`).toBe(200);
	const body = (await res.json()) as ListResponse;
	const first = body.results?.[0];
	const id = first?.id ?? first?._id;
	expect(id, `${listPath} should have a seeded item`).toBeTruthy();
	return String(id);
}

async function expectFieldCaptionOrControl(page: Page, label: string, message: string) {
	const labelLocator = page.locator(`label:has-text("${label}")`).first();
	if (await labelLocator.count()) {
		await expect(labelLocator, message).toBeVisible();
		return;
	}

	const labelledControl = page.getByLabel(label).first();
	if (await labelledControl.count()) {
		await expect(labelledControl, message).toBeVisible();
		return;
	}

	const namedTextbox = page.getByRole('textbox', { name: label }).first();
	if (await namedTextbox.count()) {
		await expect(namedTextbox, message).toBeVisible();
		return;
	}

	await expect(page.getByText(label, { exact: true }).first(), message).toBeVisible();
}

test.describe('field-complete edit screens', () => {
	for (const group of groupedRenderEntries()) {
		test(`${group.listKey} renders covered fields in admin legacy and admin next`, async ({
			signedInPage,
		}) => {
			const id = await firstItemIdForList(signedInPage.request, group.listPath);

			await signedInPage.goto(`/keystone/${group.listPath}/${id}`);
			for (const field of group.fields) {
				await expectFieldCaptionOrControl(
					signedInPage,
					field.label,
					`admin legacy should render ${group.listKey}.${field.label}`,
				);
			}

			await signedInPage.goto(`/keystone-next/${group.listKey}/${id}`);
			for (const field of group.fields) {
				await expectFieldCaptionOrControl(
					signedInPage,
					field.label,
					`admin next should render ${group.listKey}.${field.label}`,
				);
				await expect(
					signedInPage.locator(
						`[data-field-name="${field.path}"][data-field-type="${field.typeName}"]`,
					).first(),
					`admin next should expose stable selectors for ${group.listKey}.${field.path}`,
				).toBeVisible();
			}
		});
	}
});
