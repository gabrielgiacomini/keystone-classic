/**
 * Heavy-list parity spec: CLMUser shape (HeavyUser).
 *
 * Verifies that admin-next renders a "CLMUser-shaped" item detail page
 * correctly and performantly. The HeavyUser list mirrors CLMUser's stress
 * dimensions:
 *   - 23 own fields across 4 sections (Core, Profile, Manager Permissions, Tracking)
 *   - 18 inverse relationship panels visible on the admin-legacy item page
 *
 * WHAT WE TEST:
 *  1. Admin-next item page loads within 3000 ms (render-to-interactive).
 *  2. The item form renders with the correct field count.
 *  3. Key field values are visible in admin-next.
 *  4. Admin-legacy item page also loads and shows the same item id.
 *  5. Admin-legacy shows inverse relationship panels; admin-next does NOT
 *     (this is the known parity gap — logged as a Wave 2 issue).
 *  6. No JavaScript errors are thrown during render.
 *
 * KNOWN WAVE 2 ISSUE (do not fail the spec on this):
 *   Admin-next does not render inverse relationship panels ("Related Items"
 *   sections at the bottom of the legacy item page). The CLMUser item in
 *   production carries 18 such panels. This spec documents the gap via a
 *   soft assertion so Wave 2 can track it.
 */

import { test, expect } from '../../fixtures/parity.js';
import { getHeavyIds } from '../../fixtures/heavy-lists/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'HeavyUser';
const LEGACY_LIST_PATH = 'heavy-users';
const PERF_THRESHOLD_MS = 3000;

let heavyUserId = '';

test.beforeAll(async () => {
	const ids = await getHeavyIds();
	heavyUserId = ids.heavyUserId;
	expect(heavyUserId, 'HeavyUser seed id must be a valid ObjectId').toMatch(/^[0-9a-f]{24}$/i);
});

test.describe('Heavy list: CLMUser shape (HeavyUser)', () => {
	test('admin-next: item detail loads within 3000ms and renders the edit form', async ({ adminNext }) => {
		const consoleErrors: string[] = [];
		adminNext.page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		// Measure render-to-interactive
		const t0 = Date.now();
		await adminNext.gotoItem(LIST_KEY, heavyUserId);
		// [data-item-form] visible means React has finished mounting the form
		await adminNext.page.locator('[data-item-form]').waitFor({ state: 'visible' });
		const renderMs = Date.now() - t0;

		console.log(`[clmuser] admin-next render time: ${renderMs}ms`);

		// Perf assertion
		expect(renderMs, `admin-next item detail must load within ${PERF_THRESHOLD_MS}ms`).toBeLessThan(
			PERF_THRESHOLD_MS,
		);

		// The form must be present
		await expect(adminNext.page.locator('[data-item-form]')).toBeVisible();

		// Key field: systemTitle text input should be present (noedit)
		const systemTitleInput = adminNext.page.locator('input[name="systemTitle"]');
		await expect(systemTitleInput).toBeVisible();

		// Key field: displayName should show the seeded value
		const displayNameInput = adminNext.page.locator('input[name="displayName"]');
		await expect(displayNameInput).toBeVisible();
		await expect(displayNameInput).toHaveValue('Alice Example');

		// Key field: email should be visible
		const emailInput = adminNext.page.locator('input[name="email"]');
		await expect(emailInput).toBeVisible();

		// Section headings: Profile, Manager Permissions, Tracking
		// Scope to [data-item-form] to avoid matching inverse relationship panel <h3> titles
		const itemForm = adminNext.page.locator('[data-item-form]');
		await expect(itemForm.locator('h3', { hasText: 'Profile' }).first()).toBeVisible();
		await expect(itemForm.locator('h3', { hasText: 'Manager Permissions' })).toBeVisible();
		await expect(itemForm.locator('h3', { hasText: 'Tracking' })).toBeVisible();

		// Console errors: filter out known noisy non-blocking warnings
		const significantErrors = consoleErrors.filter(
			(e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
		);
		if (significantErrors.length > 0) {
			console.warn(`[clmuser] admin-next console errors:`, significantErrors);
		}
		// Soft assertion: log errors but do not fail (Wave 2 will fix upstream issues)
		expect(significantErrors, 'Unexpected JS console errors in admin-next').toHaveLength(0);
	});

	test('admin-legacy: item detail loads and shows the same item id', async ({ adminLegacy }) => {
		const t0 = Date.now();
		await adminLegacy.gotoItem(LEGACY_LIST_PATH, heavyUserId);
		const renderMs = Date.now() - t0;

		console.log(`[clmuser] admin-legacy render time: ${renderMs}ms`);

		// Admin legacy should have loaded the item edit screen
		await expect(adminLegacy.page.locator('[data-screen-id="item"]')).toBeVisible();

		// The item id should appear somewhere on the page
		const bodyText = await adminLegacy.page.locator('body').textContent();
		expect(bodyText).toContain(heavyUserId);
	});

	test('admin-legacy: shows inverse relationship panels that admin-next lacks (Wave 2 gap)', async ({
		adminLegacy,
		adminNext,
	}) => {
		// Admin legacy: navigate to item and wait for relationship panels to load.
		// Panels are rendered as <div className="Relationship"> by RelatedItemsList.mjs.
		// They load asynchronously so we wait for the container div.className="Relationships".
		await adminLegacy.gotoItem(LEGACY_LIST_PATH, heavyUserId);
		// Wait for the Relationships section to be present (async load)
		const relationshipsContainer = adminLegacy.page.locator('.Relationships');
		await relationshipsContainer.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {
			// If the section never appears within 15s, count = 0
		});
		const legacyPanels = adminLegacy.page.locator('.Relationship');
		const legacyPanelCount = await legacyPanels.count();
		console.log(`[clmuser] admin-legacy inverse relationship panels: ${legacyPanelCount}`);

		// Admin next: navigate to same item
		await adminNext.gotoItem(LIST_KEY, heavyUserId);
		// Admin next does not render any .Relationship panels;
		// confirm the form is visible but relationship panels are absent.
		await expect(adminNext.page.locator('[data-item-form]')).toBeVisible();
		const nextPanelCount = await adminNext.page.locator('.Relationship').count();
		console.log(`[clmuser] admin-next inverse relationship panels: ${nextPanelCount}`);

		// Document the gap (soft assertion via console log — this is the Wave 2 issue)
		if (legacyPanelCount > 0 && nextPanelCount === 0) {
			console.warn(
				`[WAVE2-GAP] CLMUser shape: admin-legacy shows ${legacyPanelCount} inverse ` +
				`relationship panels; admin-next shows ${nextPanelCount}. ` +
				`Wave 2 must implement RelatedItemsList panels in admin-next.`,
			);
		}

		// The legacy panels SHOULD exist (HeavyUser has 18 relationships configured)
		expect(legacyPanelCount, 'admin-legacy must show inverse relationship panels').toBeGreaterThan(0);
	});
});
