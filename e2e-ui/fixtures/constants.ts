/**
 * Shared constants for the UI suite. Centralised so a credential
 * change only has to land in one place.
 *
 * Values intentionally mirror `e2e-api/fixtures/server.ts` — both
 * suites talk to the same `server-boot.ts`-seeded admin.
 */

/** Admin legacy path Keystone is configured with in `server-boot.ts`. */
export const ADMIN_LEGACY_PATH = 'keystone';

/** Canonical admin API path Keystone is configured with in `server-boot.ts`. */
export const ADMIN_API_PATH = 'keystone-api';

/** Email of the admin user seeded by `server-boot.ts`. */
export const TEST_ADMIN_EMAIL = 'admin@example.com';

/** Password of the admin user seeded by `server-boot.ts`. */
// Test fixture credential — never used outside the e2e harness.
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const TEST_ADMIN_PASSWORD = 'admin-password-123';

/** Base path under which the admin API router is mounted. */
export const API_BASE = `/${ADMIN_API_PATH}`;
