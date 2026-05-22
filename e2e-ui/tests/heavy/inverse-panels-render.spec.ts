/**
 * Spec: Inverse relationship panels — admin-next item detail
 *
 * Verifies that the HeavyUser item detail screen (which mirrors the CLMUser
 * shape with 18 inverse relationship panels) correctly renders all panels
 * in admin-next within the 3000ms performance budget.
 *
 * Fixture: heavy-lists (port 3009)
 * URL: /keystone-next/HeavyUser/<heavyUserId>
 *
 * Wave 3 Chrome verification note:
 *   Boot the heavy-list server (`jiti e2e-ui/fixtures/heavy-lists/server-boot.ts`)
 *   and open http://127.0.0.1:3009/keystone-next/HeavyUser/<heavyUserId> in Chrome.
 *   Sign in as admin@example.com / admin-password-123.
 */

import { test, expect } from '../../fixtures/parity.js';
import { getHeavyIds } from '../../fixtures/heavy-lists/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'HeavyUser';
const PERF_THRESHOLD_MS = 3000;

// The 18 inverse relationship panel paths registered on HeavyUser
const EXPECTED_REL_PATHS = [
  'threads',
  'threads-deleted',
  'loops',
  'subjects',
  'turns',
  'messages',
  'llm-requests',
  'llm-sessions',
  'context-docs',
  'milestones',
  'pipeline-execs',
  'profile-fields',
  'profile-items',
  'profile-roots',
  'profile-sections',
  'web-searches',
  'places-searches',
  'places-details',
];

let heavyUserId = '';

test.beforeAll(async () => {
  const ids = await getHeavyIds();
  heavyUserId = ids.heavyUserId;
  expect(heavyUserId, 'HeavyUser seed id must be a valid ObjectId').toMatch(/^[0-9a-f]{24}$/i);
});

test.describe('admin-next: inverse relationship panels on HeavyUser', () => {
  test('renders all 18 panel headers within 3000ms', async ({ adminNext }) => {
    const consoleErrors: string[] = [];
    adminNext.page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const t0 = Date.now();

    // Navigate to the HeavyUser item detail in admin-next
    await adminNext.gotoItem(LIST_KEY, heavyUserId);

    // Wait for the main form to be interactive
    await adminNext.page.locator('[data-item-form]').waitFor({ state: 'visible', timeout: 10_000 });

    // Wait for the relationships section to appear
    const relSection = adminNext.page.locator('[data-relationships-section]');
    await relSection.waitFor({ state: 'visible', timeout: 10_000 });

    const renderMs = Date.now() - t0;
    console.log(`[inverse-panels] admin-next render-to-interactive: ${renderMs}ms`);

    // Performance assertion — must render within budget
    expect(
      renderMs,
      `admin-next item detail must load within ${PERF_THRESHOLD_MS}ms`,
    ).toBeLessThan(PERF_THRESHOLD_MS);

    // All 18 panel containers must be present
    const allPanels = adminNext.page.locator('[data-inverse-panel]');
    const panelCount = await allPanels.count();
    console.log(`[inverse-panels] panel count: ${panelCount}`);

    expect(panelCount, 'All 18 inverse relationship panels must be present').toBe(
      EXPECTED_REL_PATHS.length,
    );

    // Check each expected panel exists by its data-rel-path attribute
    for (const relPath of EXPECTED_REL_PATHS) {
      const panel = adminNext.page.locator(`[data-inverse-panel][data-rel-path="${relPath}"]`);
      await expect(
        panel,
        `Panel for rel-path="${relPath}" must be present`,
      ).toBeAttached();
    }
  });

  test('each panel has a visible table header row', async ({ adminNext }) => {
    await adminNext.gotoItem(LIST_KEY, heavyUserId);
    await adminNext.page.locator('[data-relationships-section]').waitFor({
      state: 'visible',
      timeout: 10_000,
    });

    // Wait for at least one table to be rendered (data loaded)
    // Panels that have seeded data show a table; empty panels show "No related…" text.
    // We seed at least one record for each relationship, so all tables should appear.
    // Give extra time for async fetches.
    await adminNext.page.locator('[data-inverse-table]').first().waitFor({
      state: 'visible',
      timeout: 15_000,
    });

    const tables = adminNext.page.locator('[data-inverse-table]');
    const tableCount = await tables.count();
    console.log(`[inverse-panels] tables with data: ${tableCount}`);

    // At minimum, the seeded records give us > 0 tables
    expect(tableCount, 'At least one panel must have a data table').toBeGreaterThan(0);

    // Each visible table must have a thead row
    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      await expect(table.locator('thead tr')).toBeAttached();
    }
  });

  test('panel rows are clickable (click-to-edit navigation)', async ({ adminNext }) => {
    await adminNext.gotoItem(LIST_KEY, heavyUserId);
    await adminNext.page.locator('[data-relationships-section]').waitFor({
      state: 'visible',
      timeout: 10_000,
    });

    // Wait for first table to appear
    await adminNext.page.locator('[data-inverse-table]').first().waitFor({
      state: 'visible',
      timeout: 15_000,
    });

    // Find the first item link inside any panel table
    const firstItemLink = adminNext.page.locator('[data-inverse-table] tbody [data-item-id]').first();
    await expect(firstItemLink, 'First item row link must be visible').toBeVisible();

    // Verify the href points to a valid admin-next item detail URL
    const href = await firstItemLink.getAttribute('href');
    console.log(`[inverse-panels] first item link href: ${href}`);
    expect(href, 'Item link must be a valid href').toMatch(/keystone-next\/.+\/.+/);
  });

  test('Add Item button is present on every panel', async ({ adminNext }) => {
    await adminNext.gotoItem(LIST_KEY, heavyUserId);
    await adminNext.page.locator('[data-relationships-section]').waitFor({
      state: 'visible',
      timeout: 10_000,
    });

    // All "Add Item" anchors — one per panel
    const addBtns = adminNext.page.locator('[data-add-item]');
    const addBtnCount = await addBtns.count();
    console.log(`[inverse-panels] Add Item buttons: ${addBtnCount}`);

    expect(addBtnCount, 'Every panel must have an "Add Item" button').toBe(
      EXPECTED_REL_PATHS.length,
    );
  });

  test('no JavaScript errors during render', async ({ adminNext }) => {
    const consoleErrors: string[] = [];
    adminNext.page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await adminNext.gotoItem(LIST_KEY, heavyUserId);
    await adminNext.page.locator('[data-relationships-section]').waitFor({
      state: 'visible',
      timeout: 10_000,
    });

    // Small wait to let any async panel errors surface
    await adminNext.page.waitForTimeout(1000);

    const significantErrors = consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('ResizeObserver'),
    );
    if (significantErrors.length > 0) {
      console.warn('[inverse-panels] Console errors:', significantErrors);
    }
    expect(significantErrors, 'No unexpected JS errors').toHaveLength(0);
  });
});
