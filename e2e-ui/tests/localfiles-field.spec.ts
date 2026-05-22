/**
 * LocalFiles field — admin-next UI component smoke test.
 *
 * Types.LocalFiles is removed server-side (throws on construction),
 * so there is no live Keystone list with a `localfiles` field.
 * This spec verifies:
 *
 *   1. The admin-next field registry boots without throwing
 *      (assertAllFieldsRegistered() must not throw — localfiles must be registered).
 *   2. No FieldRegistry errors or warnings mention "localfiles" as unknown.
 *   3. The admin meta API responds successfully (the server didn't crash).
 *
 * NOTE: Once Types.LocalFiles is re-implemented server-side or a fixture
 * list is added to schema.mjs, this spec should be promoted to a full
 * round-trip test (create item → save → reload → assert persisted).
 */

import { test, expect } from '../fixtures/auth.js';

test.describe('localfiles field — registry and component smoke', () => {
  test('localfiles components are registered and admin-next boots without errors', async ({
    signedInPage,
  }) => {
    // The admin meta API responds without server-side crash.
    const res = await signedInPage.request.get('/keystone-api');
    expect(res.status(), 'admin meta API should return 200').toBe(200);

    const meta = (await res.json()) as { lists: Record<string, unknown> };
    expect(meta.lists, 'admin meta should expose registered lists').toBeTruthy();

    // Collect console errors before navigating so we capture all page load errors.
    const errors: string[] = [];
    const warnings: string[] = [];
    signedInPage.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    // Navigate to an admin-next list page to trigger the field registry
    // assertAllFieldsRegistered() bootstrap. If localfiles is missing from
    // the registry, a FieldRegistry error would appear in the console.
    await signedInPage.goto('/keystone-next/Post');
    await expect(signedInPage.locator('body')).toBeVisible();

    // If localfiles is unregistered, assertAllFieldsRegistered throws and
    // produces a console error containing "FieldRegistry".
    const registryErrors = errors.filter((e) => e.includes('FieldRegistry'));
    expect(
      registryErrors,
      'No FieldRegistry errors — localfiles must be registered',
    ).toHaveLength(0);

    // Also confirm no "Unknown field type localfiles" warning.
    const unknownLocalFiles = warnings.filter(
      (w) => w.includes('FieldRegistry') && w.toLowerCase().includes('localfiles'),
    );
    expect(
      unknownLocalFiles,
      'No "Unknown field type localfiles" FieldRegistry warning',
    ).toHaveLength(0);
  });

  test('admin-next Post list page renders without FieldRegistry warnings about localfiles', async ({
    signedInPage,
  }) => {
    const warnings: string[] = [];
    signedInPage.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await signedInPage.goto('/keystone-next/Post');
    await expect(signedInPage.locator('body')).toBeVisible();

    const registryWarnings = warnings.filter(
      (w) => w.includes('FieldRegistry') && w.toLowerCase().includes('localfiles'),
    );
    expect(
      registryWarnings,
      'No "localfiles" FieldRegistry warnings — component must be registered',
    ).toHaveLength(0);
  });
});
