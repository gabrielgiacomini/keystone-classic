/**
 * Constants and small helpers describing the test server.
 *
 * The server itself boots via `e2e-api/fixtures/server-boot.ts`,
 * launched by Playwright's `webServer` config. This module is
 * pure-types / pure-constants so spec files don't have to repeat
 * URL prefixes or seeded credentials.
 */

/** Admin legacy path Keystone is configured with in `server-boot.ts`. */
export const ADMIN_LEGACY_PATH = 'keystone';

/** Canonical admin API path Keystone is configured with in `server-boot.ts`. */
export const ADMIN_API_PATH = 'keystone-api';

/** Base path under which the admin API router is mounted. */
export const API_BASE = `/${ADMIN_API_PATH}`;

/** Prefix of the application routes `server-boot.ts` builds with `List.apiForGet`. */
export const APP_GET_BASE = '/app-api';

/** Email of the admin user seeded by `server-boot.ts`. */
export const TEST_ADMIN_EMAIL = 'admin@example.com';

/**
 * Value of the seeded admin's `recoveryCode`, a Text field declared with
 * `secret: true` in `server-boot.ts`. No admin endpoint may ever return it.
 */
export const TEST_ADMIN_RECOVERY_CODE = 'e2e-admin-recovery-code-4c1d9a7e';

/** Password of the admin user seeded by `server-boot.ts`. */
// Test fixture credential — never used outside the e2e-api harness.
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const TEST_ADMIN_PASSWORD = 'admin-password-123';
