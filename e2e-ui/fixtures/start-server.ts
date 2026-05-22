/**
 * @file Server boot wrapper for the UI-driven Playwright suite.
 *
 * The API suite's `npm run dev:e2e-api` script hard-codes
 * `DISABLE_CSRF=true` because pure-API specs can't run a CSRF
 * bootstrap dance. The UI suite, by contrast, must exercise the
 * real CSRF flow (the React signin form bootstraps the token from
 * the EJS template's `Keystone.csrf.header` global). So this
 * wrapper just delegates to the standard server-boot script with
 * CSRF intact.
 *
 * Required env (set by the Playwright `webServer.env` block):
 *   - MONGO_URI    (default mongodb://localhost:27017/keystone-e2e-ui)
 *   - PORT         (default 3005 via the delegated API boot script)
 *   - NODE_ENV=test
 */

// Defensive: ensure DISABLE_CSRF is not inherited from a parent shell.
delete process.env.DISABLE_CSRF;

await import('../../e2e-api/fixtures/server-boot.ts');
