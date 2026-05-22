/**
 * Playwright configuration for the heavy-list parity specs.
 *
 * Boots a separate Keystone instance with three "heavy" list shapes that
 * mirror the stress dimensions of cloom-core's CLMUser (18 inverse relationship
 * panels), CLMThread (multi-section form + 3 rel fields), and
 * EarlyAccessApplication (5 sections + self-referential relationship).
 *
 * Separate from playwright.config.ts so it does not conflict with the main
 * parity suite's webServer on port 3008.
 *
 * Port: 3009
 * DB:   keystone-e2e-ui-heavy (MongoDB)
 */

import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.HEAVY_PORT ?? '3009';
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const NODE_OPTIONS = process.env.NODE_OPTIONS ?? '--max-old-space-size=4096';
const MONGO_URI =
	process.env.MONGO_URI ?? `mongodb://localhost:27017/keystone-e2e-ui-heavy`;

export default defineConfig({
	testDir: './tests/heavy',
	fullyParallel: false,
	workers: 1,
	retries: 1,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: 'playwright-report-heavy' }],
	],
	timeout: 45_000,
	expect: { timeout: 10_000 },
	use: {
		baseURL: BASE_URL,
		headless: true,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium-heavy',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	globalSetup: './fixtures/heavy-lists/global-setup.ts',
	webServer: {
		command: `jiti fixtures/heavy-lists/server-boot.ts`,
		cwd: __dirname,
		url: `${BASE_URL}/keystone/signin`,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		stdout: 'pipe',
		stderr: 'pipe',
		env: {
			MONGO_URI,
			PORT,
			NODE_ENV: 'test',
			NODE_OPTIONS,
			KEYSTONE_PREBUILD_ADMIN: 'true',
		},
	},
});
