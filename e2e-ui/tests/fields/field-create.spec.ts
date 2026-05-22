import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

interface AdminMetaField {
	path: string;
	label: string;
	fieldType: string;
	initial?: boolean;
	hidden?: boolean;
}

interface AdminMetaList {
	key: string;
	path: string;
	fields: Record<string, AdminMetaField>;
	initialFields?: string[];
}

interface AdminMeta {
	lists: Record<string, AdminMetaList>;
}

function initialFieldPaths(list: AdminMetaList): string[] {
	if (Array.isArray(list.initialFields) && list.initialFields.length > 0) {
		return list.initialFields.filter((path) => list.fields[path]?.hidden !== true);
	}
	return Object.values(list.fields)
		.filter((field) => field.initial === true && field.hidden !== true)
		.map((field) => field.path);
}

test.describe('field-complete create flows', () => {
	test('admin next create pages render configured initial fields', async ({
		signedInPage,
	}) => {
		const res = await signedInPage.request.get('/keystone-api');
		expect(res.status()).toBe(200);
		const meta = (await res.json()) as AdminMeta;

		for (const list of Object.values(meta.lists)) {
			const fields = initialFieldPaths(list);
			if (fields.length === 0) continue;

			await signedInPage.goto(`/keystone-next/${list.key}/create`, { waitUntil: 'networkidle' });
			await expect(signedInPage.locator('form')).toBeVisible();

			for (const path of fields) {
				const field = list.fields[path];
				await expect(
					// Scope to the form element to avoid matching list-cell elements
					// that may appear in embedded RelatedItemsLists or stale DOM.
					signedInPage.locator('form').locator(`[data-field-name="${path}"][data-field-type="${field?.fieldType ?? ''}"]`),
					`${list.key}.${path} initial field should render`,
				).toBeVisible();
			}
		}
	});

	test('admin next creates a product with text and key initial fields', async ({
		signedInPage,
	}) => {
		const sku = `field-create-${Date.now()}`;

		await signedInPage.goto('/keystone-next/Product/create');
		await expect(signedInPage.locator('form')).toBeVisible();
		await signedInPage.locator('input#name').fill('Field Create Product');
		await signedInPage.locator('input#sku').fill(sku);

		const create = signedInPage.waitForResponse(
			(r) =>
				r.url().includes('/keystone-api/Product/create') &&
				r.request().method() === 'POST',
		);
		await signedInPage.getByRole('button', { name: /^Create$/ }).click();
		const response = await create;
		expect(response.status()).toBe(200);
		const body = await response.json() as { id?: string; item?: { id?: string } };
		const id = body.item?.id ?? body.id;
		expect(id).toBeTruthy();

		await expect(signedInPage).toHaveURL(new RegExp(`/keystone-next/products/${id}$`));

		const stored = await withMongo((db) =>
			db.collection('Product').findOne({ sku }),
		);
		expect(stored?.name).toBe('Field Create Product');
		expect(stored?.sku).toBe(sku);
	});
});
