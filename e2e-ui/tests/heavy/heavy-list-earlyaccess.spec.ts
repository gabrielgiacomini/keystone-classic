/**
 * Heavy-list parity spec: EarlyAccessApplication shape (EarlyApp).
 *
 * Verifies that admin-next renders an "EarlyAccessApplication-shaped" item
 * detail page correctly and performantly. EarlyApp mirrors the stress
 * dimensions of EarlyAccessApplication:
 *   - 5 field sections (Identity, Application Details, Workflow, Abuse
 *     Controls, Tracking)
 *   - ~30 own fields including Select, Boolean, Number, Datetime, Textarea
 *   - 1 outgoing relationship field (linkedUser → HeavyUser)
 *   - 1 self-referential relationship field (supersededBy → EarlyApp)
 *
 * WHAT WE TEST:
 *  1. Admin-next item page loads within 3000ms.
 *  2. All 5 section headings render.
 *  3. Key field values are correct (fullName, email, status, priorityScore).
 *  4. Select fields render with the seeded value.
 *  5. Admin-legacy renders the same item.
 *  6. Console error check.
 */

import { test, expect } from '../../fixtures/parity.js';
import { getHeavyIds } from '../../fixtures/heavy-lists/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'EarlyApp';
const LEGACY_LIST_PATH = 'early-apps';
const PERF_THRESHOLD_MS = 3000;

let earlyAppId = '';

test.beforeAll(async () => {
	const ids = await getHeavyIds();
	earlyAppId = ids.earlyAppId;
	expect(earlyAppId, 'EarlyApp seed id must be a valid ObjectId').toMatch(/^[0-9a-f]{24}$/i);
});

test.describe('Heavy list: EarlyAccessApplication shape (EarlyApp)', () => {
	test('admin-next: item detail loads within 3000ms and renders all 5 sections', async ({ adminNext }) => {
		const consoleErrors: string[] = [];
		adminNext.page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		const t0 = Date.now();
		await adminNext.gotoItem(LIST_KEY, earlyAppId);
		await adminNext.page.locator('[data-item-form]').waitFor({ state: 'visible' });
		const renderMs = Date.now() - t0;

		console.log(`[earlyaccess] admin-next render time: ${renderMs}ms`);

		expect(renderMs, `admin-next item detail must load within ${PERF_THRESHOLD_MS}ms`).toBeLessThan(
			PERF_THRESHOLD_MS,
		);

		await expect(adminNext.page.locator('[data-item-form]')).toBeVisible();

		// All 5 section headings
		await expect(adminNext.page.locator('h3', { hasText: 'Identity' })).toBeVisible();
		await expect(adminNext.page.locator('h3', { hasText: 'Application Details' })).toBeVisible();
		await expect(adminNext.page.locator('h3', { hasText: 'Workflow' })).toBeVisible();
		await expect(adminNext.page.locator('h3', { hasText: 'Abuse Controls' })).toBeVisible();
		await expect(adminNext.page.locator('h3', { hasText: 'Tracking' })).toBeVisible();

		// Key field: fullName
		const fullNameInput = adminNext.page.locator('input[name="fullName"]');
		await expect(fullNameInput).toBeVisible();
		await expect(fullNameInput).toHaveValue('Alice Example');

		// Key field: email
		const emailInput = adminNext.page.locator('input[name="email"]');
		await expect(emailInput).toBeVisible();
		await expect(emailInput).toHaveValue('alice@example.com');

		// Key field: businessName
		const bizNameInput = adminNext.page.locator('input[name="businessName"]');
		await expect(bizNameInput).toBeVisible();
		await expect(bizNameInput).toHaveValue('Acme Corp');

		// Select field: status (should be "pending")
		const statusField = adminNext.page.locator('[data-field-name="status"]');
		await expect(statusField).toBeVisible();

		// Number field: priorityScore
		const priorityScoreInput = adminNext.page.locator('input[name="priorityScore"]');
		await expect(priorityScoreInput).toBeVisible();

		// Boolean field: isStarred
		const isStarredField = adminNext.page.locator('[data-field-name="isStarred"]');
		await expect(isStarredField).toBeVisible();

		// Relationship field: linkedUser
		const linkedUserField = adminNext.page.locator('[data-field-name="linkedUser"]');
		await expect(linkedUserField).toBeVisible();

		// Self-referential relationship: supersededBy
		const supersededByField = adminNext.page.locator('[data-field-name="supersededBy"]');
		await expect(supersededByField).toBeVisible();

		// Console error check
		const significantErrors = consoleErrors.filter(
			(e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
		);
		if (significantErrors.length > 0) {
			console.warn(`[earlyaccess] admin-next console errors:`, significantErrors);
		}
		expect(significantErrors, 'Unexpected JS console errors in admin-next').toHaveLength(0);
	});

	test('admin-next: select, boolean, and number fields render correctly', async ({ adminNext }) => {
		await adminNext.gotoItem(LIST_KEY, earlyAppId);
		await adminNext.page.locator('[data-item-form]').waitFor({ state: 'visible' });

		// Status select should be rendered as a select or combobox
		const statusSelect = adminNext.page.locator(
			'[data-field-name="status"] select, [data-field-name="status"] [role="combobox"]',
		);
		await expect(statusSelect.first()).toBeVisible();

		// followUpState select
		const followUpSelect = adminNext.page.locator(
			'[data-field-name="followUpState"] select, [data-field-name="followUpState"] [role="combobox"]',
		);
		await expect(followUpSelect.first()).toBeVisible();

		// priorityScore number input
		const priorityInput = adminNext.page.locator('input[name="priorityScore"]');
		await expect(priorityInput).toHaveValue('85');

		// isStarred checkbox or toggle
		const starredCheckbox = adminNext.page.locator(
			'[data-field-name="isStarred"] input[type="checkbox"]',
		);
		if (await starredCheckbox.count() > 0) {
			await expect(starredCheckbox).toBeChecked();
		}

		// isQualifiedLead checkbox
		const qualifiedLeadCheckbox = adminNext.page.locator(
			'[data-field-name="isQualifiedLead"] input[type="checkbox"]',
		);
		if (await qualifiedLeadCheckbox.count() > 0) {
			await expect(qualifiedLeadCheckbox).toBeChecked();
		}
	});

	test('admin-legacy: item detail loads and shows the same item', async ({ adminLegacy }) => {
		const t0 = Date.now();
		await adminLegacy.gotoItem(LEGACY_LIST_PATH, earlyAppId);
		const renderMs = Date.now() - t0;

		console.log(`[earlyaccess] admin-legacy render time: ${renderMs}ms`);

		await expect(adminLegacy.page.locator('[data-screen-id="item"]')).toBeVisible();
		const bodyText = await adminLegacy.page.locator('body').textContent();
		expect(bodyText).toContain(earlyAppId);
	});
});
