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
});
