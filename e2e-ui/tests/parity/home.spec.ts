/**
 * Parity spec: Home dashboard (P4-30).
 *
 * Both adminLegacy (/keystone) and adminNext (/keystone-next) must show a dashboard
 * after sign-in. Both must display the same list keys and counts within
 * ±1 of each other (race-condition tolerance).
 *
 * Seed state: 5 Posts seeded by server-boot-both.mjs. The specs use
 * test.beforeEach to sign in fresh per test.
 */

import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async () => {
	// Ensure at least one user + posts exist.
	await seedPostsAndEditors();
});

async function getDashboardSections(page: import('@playwright/test').Page): Promise<Array<{ label: string; paths: string[] }>> {
	const sections = page.locator('[data-section-label]');
	await sections.first().waitFor({ state: 'visible' });
	const count = await sections.count();
	const result: Array<{ label: string; paths: string[] }> = [];
	for (let i = 0; i < count; i++) {
		const section = sections.nth(i);
		const label = await section.getAttribute('data-section-label');
		const tiles = section.locator('[data-dashboard-list][data-list-path]');
		const tileCount = await tiles.count();
		const paths: string[] = [];
		for (let j = 0; j < tileCount; j++) {
			const path = await tiles.nth(j).getAttribute('data-list-path');
			if (path) paths.push(path);
		}
		if (paths.length === 0) continue;
		result.push({ label: label ?? '', paths });
	}
	return result;
}

test.describe('Parity: Home dashboard', () => {
	test('both UIs show a dashboard after sign-in', async ({ adminLegacy, adminNext }) => {
		await adminLegacy.gotoHome();
		await adminLegacy.expectOnHome();

		await adminNext.gotoHome();
		await adminNext.expectOnHome();
	});

	test('both UIs show the same list keys', async ({ adminLegacy, adminNext }) => {
		await adminLegacy.gotoHome();
		const adminLegacyCounts = await adminLegacy.getListCounts();
		const adminLegacyKeys = Object.keys(adminLegacyCounts).sort();

		await adminNext.gotoHome();
		const adminNextCounts = await adminNext.getListCounts();
		const adminNextKeys = Object.keys(adminNextCounts).sort();

		// Both dashboards must surface the same list keys.
		expect(adminLegacyKeys).toEqual(adminNextKeys);
	});

	test('both UIs group dashboard lists into the same navigation sections', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoHome();
		const legacySections = await getDashboardSections(adminLegacy.page);

		await adminNext.gotoHome();
		const adminNextSections = await getDashboardSections(adminNext.page);

		expect(adminNextSections).toEqual(legacySections);
		expect(adminNextSections.length).toBeGreaterThan(1);
	});

	test('both UIs render external and orphaned dashboard entries consistently', async ({
		adminLegacy,
		adminNext,
	}) => {
		await adminLegacy.gotoHome();
		const legacyExternal = adminLegacy.page
			.locator('[data-dashboard-list][data-list-path="https://example.com/admin-docs"]')
			.first();
		await expect(legacyExternal).toHaveAttribute('data-external', 'true');
		await expect(legacyExternal.locator('[data-dashboard-list-manage]'))
			.toHaveAttribute('href', 'https://example.com/admin-docs');
		await expect(legacyExternal.locator('[data-dashboard-list-create]')).toHaveCount(0);
		const legacySections = await getDashboardSections(adminLegacy.page);

		await adminNext.gotoHome();
		const adminNextExternal = adminNext.page
			.locator('[data-dashboard-list][data-list-path="https://example.com/admin-docs"]')
			.first();
		await expect(adminNextExternal).toHaveAttribute('data-external', 'true');
		await expect(adminNextExternal.locator('[data-dashboard-list-manage]'))
			.toHaveAttribute('href', 'https://example.com/admin-docs');
		await expect(adminNextExternal.locator('[data-dashboard-list-create]')).toHaveCount(0);
		const adminNextSections = await getDashboardSections(adminNext.page);

		expect(adminNextSections).toEqual(legacySections);
		expect(adminNextSections).toContainEqual({
			label: 'Other',
			paths: ['sponsors'],
		});
	});

	test('both UIs show Post count within ±1 of each other', async ({ adminLegacy, adminNext }) => {
		// Read the ground-truth count directly from Mongo.
		const mongoCount = await withMongo((db) =>
			db.collection('Post').countDocuments(),
		);

		await adminLegacy.gotoHome();
		const adminLegacyCounts = await adminLegacy.getListCounts();

		await adminNext.gotoHome();
		const adminNextCounts = await adminNext.getListCounts();

		// Both must be within ±1 of the Mongo count (race-condition tolerance).
		for (const [key, adminLegacyCount] of Object.entries(adminLegacyCounts)) {
			const adminNextCount = adminNextCounts[key] ?? 0;
			expect(
				Math.abs(adminLegacyCount - adminNextCount),
				`count mismatch for list "${key}": adminLegacy=${adminLegacyCount} adminNext=${adminNextCount}`,
			).toBeLessThanOrEqual(1);
			// Also sanity-check against the Mongo count for 'posts' / 'post'.
			if (key.toLowerCase() === 'posts' || key.toLowerCase() === 'post') {
				expect(Math.abs(adminLegacyCount - mongoCount)).toBeLessThanOrEqual(1);
			}
		}
	});

	test('dashboard manage links navigate to the matching Post list views', async ({ adminLegacy, adminNext }) => {
		await adminLegacy.gotoHome();
		await adminLegacy.page
			.locator('[data-dashboard-list][data-list-path="posts"] [data-dashboard-list-manage]')
			.click();
		await expect(adminLegacy.page).toHaveURL(/\/keystone\/posts(?:\?|$)/);
		await expect(adminLegacy.page.locator('[data-screen-id="list"]')).toBeVisible();

		await adminNext.gotoHome();
		await adminNext.page
			.locator('[data-dashboard-list][data-list-path="posts"] [data-dashboard-list-manage]')
			.click();
		await expect(adminNext.page).toHaveURL(/\/keystone-next\/posts(?:\?|$)/);
		await expect(adminNext.page.locator('[data-list-table][data-list-key="Post"]')).toBeVisible();
	});

	test('dashboard create links open the matching Post create modal', async ({ adminLegacy, adminNext }) => {
		await adminLegacy.gotoHome();
		await adminLegacy.page
			.locator('[data-dashboard-list][data-list-path="posts"] [data-dashboard-list-create]')
			.click();
		await expect(adminLegacy.page).toHaveURL(/\/keystone\/posts\?create=?$/);
		await expect(adminLegacy.page.getByText('Create a new Post')).toBeVisible();

		await adminNext.gotoHome();
		await adminNext.page
			.locator('[data-dashboard-list][data-list-path="posts"] [data-dashboard-list-create]')
			.click();
		await expect(adminNext.page).toHaveURL(/\/keystone-next\/posts\?.*create=true/);
		await expect(adminNext.page.locator('[data-create-item-modal][data-list-key="Post"]')).toBeVisible();
	});
});
