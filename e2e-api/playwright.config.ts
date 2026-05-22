/**
 * Playwright configuration for the API-only e2e suite (roadmap step 38a).
 *
 * The suite uses ONLY the `request` fixture — no browser, no UI selectors.
 * `npx playwright install` is therefore not required for the specs
 * themselves; CI runs `npx playwright install --with-deps chromium` for
 * canonical-bootstrap parity, but skipping it works locally too.
 *
 * Local-run prerequisite: a MongoDB instance must be reachable at the URI
 * specified by `MONGO_URI` (default `mongodb://localhost:27017/keystone-e2e-api`).
 * In CI we use the `mongo:7` service container; locally start mongo with:
 *   docker run -d --rm --name keystone-e2e-mongo -p 27017:27017 mongo:7
 *
 * UI-driven Playwright (step 38b) is deferred — it lives behind the
 * admin legacy/admin next decision in P4.
 */

import { defineConfig } from '@playwright/test';

const PORT = process.env.PORT ?? '3005';
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
	testDir: './tests',
	// DB state is shared across the suite (single Keystone process,
	// single Mongo db). Disable parallelism to keep specs deterministic.
	fullyParallel: false,
	workers: 1,
	retries: 0,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: 'playwright-report' }],
	],
	timeout: 30_000,
	expect: { timeout: 10_000 },
	use: {
		baseURL: BASE_URL,
		extraHTTPHeaders: {
			Accept: 'application/json',
		},
		trace: 'retain-on-failure',
	},
	webServer: {
		command: 'npm run dev:e2e-api',
		// Probe a known-public path. /keystone/signin is served as HTML by
		// the admin route stack and only requires the server to be up,
		// without needing seed data to exist yet.
		url: `${BASE_URL}/keystone/signin`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		stdout: 'pipe',
		stderr: 'pipe',
		env: {
			MONGO_URI:
				process.env.MONGO_URI ??
				'mongodb://localhost:27017/keystone-e2e-api',
			PORT,
			DISABLE_CSRF: 'true',
			NODE_ENV: 'test',
		},
	},
});
