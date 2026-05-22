/**
 * Heavy-list parity spec: CLMThread shape (HeavyThread).
 *
 * Verifies that admin-next renders a "CLMThread-shaped" item detail page
 * correctly and performantly. HeavyThread mirrors CLMThread's stress
 * dimensions:
 *   - 3 relationship fields (threadUser, threadLoop, threadSubject, deletedBy)
 *   - 5 field sections (Core, Tracking, Selected Business (Legacy),
 *     Distributed Lock, Deletion State)
 *   - ~22 own fields
 *
 * WHAT WE TEST:
 *  1. Admin-next item page loads within 3000ms.
 *  2. The form renders all section headings correctly.
 *  3. Relationship fields (threadUser) render their populated label.
 *  4. Admin-legacy renders the same item.
 *  5. Console error check.
 *
 * KNOWN WAVE 2 ISSUE:
 *   Admin-next does not render inverse relationship panels. CLMThread in
 *   production has 2 inverse panels (Turns, Messages). Documented here
 *   without failing the spec.
 */

import { test, expect } from '../../fixtures/parity.js';
import { getHeavyIds } from '../../fixtures/heavy-lists/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'HeavyThread';
const LEGACY_LIST_PATH = 'heavy-threads';
const PERF_THRESHOLD_MS = 3000;

let heavyThreadId = '';

test.beforeAll(async () => {
	const ids = await getHeavyIds();
	heavyThreadId = ids.heavyThreadId;
	expect(heavyThreadId, 'HeavyThread seed id must be a valid ObjectId').toMatch(/^[0-9a-f]{24}$/i);
});

test.describe('Heavy list: CLMThread shape (HeavyThread)', () => {
	test('admin-next: item detail loads within 3000ms and renders all sections', async ({ adminNext }) => {
		const consoleErrors: string[] = [];
		adminNext.page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		const t0 = Date.now();
		await adminNext.gotoItem(LIST_KEY, heavyThreadId);
		await adminNext.page.locator('[data-item-form]').waitFor({ state: 'visible' });
		const renderMs = Date.now() - t0;

		console.log(`[clmthread] admin-next render time: ${renderMs}ms`);

		expect(renderMs, `admin-next item detail must load within ${PERF_THRESHOLD_MS}ms`).toBeLessThan(
			PERF_THRESHOLD_MS,
		);

		// Form must be present
		await expect(adminNext.page.locator('[data-item-form]')).toBeVisible();

		// Section headings (CLMThread has 5 sections besides the default)
		await expect(adminNext.page.locator('h3', { hasText: 'Tracking' })).toBeVisible();
		await expect(adminNext.page.locator('h3', { hasText: 'Selected Business (Legacy)' })).toBeVisible();
		await expect(adminNext.page.locator('h3', { hasText: 'Distributed Lock' })).toBeVisible();
		await expect(adminNext.page.locator('h3', { hasText: 'Deletion State' })).toBeVisible();

		// Key text field: displayName
		const displayNameInput = adminNext.page.locator('input[name="displayName"]');
		await expect(displayNameInput).toBeVisible();
		await expect(displayNameInput).toHaveValue('Marketing Campaign Thread');

		// threadSummary textarea (noedit)
		const summaryTextarea = adminNext.page.locator('textarea[name="threadSummary"]');
		await expect(summaryTextarea).toBeVisible();

		// Relationship field for threadUser — look for the relationship widget
		// Admin-next renders relationship fields with a data-field-name attribute
		const userRelField = adminNext.page.locator('[data-field-name="threadUser"]');
		await expect(userRelField).toBeVisible();

		// Console error check
		const significantErrors = consoleErrors.filter(
			(e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
		);
		if (significantErrors.length > 0) {
			console.warn(`[clmthread] admin-next console errors:`, significantErrors);
		}
		expect(significantErrors, 'Unexpected JS console errors in admin-next').toHaveLength(0);
	});

	test('admin-legacy: item detail loads and shows the same item id', async ({ adminLegacy }) => {
		const t0 = Date.now();
		await adminLegacy.gotoItem(LEGACY_LIST_PATH, heavyThreadId);
		const renderMs = Date.now() - t0;

		console.log(`[clmthread] admin-legacy render time: ${renderMs}ms`);

		await expect(adminLegacy.page.locator('[data-screen-id="item"]')).toBeVisible();
		const bodyText = await adminLegacy.page.locator('body').textContent();
		expect(bodyText).toContain(heavyThreadId);
	});

	test('admin-legacy: shows inverse relationship panels (Turns, Messages) — Wave 2 gap', async ({
		adminLegacy,
		adminNext,
	}) => {
		// Admin legacy: wait for RelatedItemsList panels (.Relationship class)
		await adminLegacy.gotoItem(LEGACY_LIST_PATH, heavyThreadId);
		const relationshipsContainer = adminLegacy.page.locator('.Relationships');
		await relationshipsContainer.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
		const legacyPanels = adminLegacy.page.locator('.Relationship');
		const legacyPanelCount = await legacyPanels.count();
		console.log(`[clmthread] admin-legacy inverse relationship panels: ${legacyPanelCount}`);

		await adminNext.gotoItem(LIST_KEY, heavyThreadId);
		await expect(adminNext.page.locator('[data-item-form]')).toBeVisible();
		const nextPanelCount = await adminNext.page.locator('.Relationship').count();
		console.log(`[clmthread] admin-next inverse relationship panels: ${nextPanelCount}`);

		if (legacyPanelCount > 0 && nextPanelCount === 0) {
			console.warn(
				`[WAVE2-GAP] CLMThread shape: admin-legacy shows ${legacyPanelCount} inverse ` +
				`relationship panels (Turns, Messages); admin-next shows ${nextPanelCount}. ` +
				`Wave 2 must implement RelatedItemsList panels in admin-next.`,
			);
		}

		expect(legacyPanelCount, 'admin-legacy must show inverse relationship panels').toBeGreaterThan(0);
	});
});
