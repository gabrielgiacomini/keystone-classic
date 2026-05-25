/**
 * Playwright configuration for the modern admin parity e2e suite.
 *
 * Drives a real Chromium browser against the historical admin path
 * (/keystone) and the explicit modern alias (/keystone-next). After legacy
 * client decommission both paths serve the modern admin shell.
 *
 * Port assignment: 3008 (hard constraint from roadmap P4-30).
 * DB: keystone-e2e-ui (MongoDB).
 *
 * The Keystone server is booted via the `webServer` block from
 * `fixtures/server-boot-both.ts`, which sets `admin ui: 'both'`.
 *
 * Local prerequisite: MongoDB reachable at MONGO_URI
 *   docker run -d --rm -p 27017:27017 mongo:7
 */

import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = '3008';
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const NODE_OPTIONS = process.env.NODE_OPTIONS ?? '--max-old-space-size=4096';

export default defineConfig({
	testDir: './tests',
	testMatch: [/.*\/tests\/decommission\.spec\.ts/, /.*\/tests\/visual-identity\.spec\.ts/],
	fullyParallel: false,
	workers: 1,
	retries: 1,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: 'playwright-report' }],
	],
	timeout: 30_000,
	expect: { timeout: 10_000 },
	use: {
		baseURL: BASE_URL,
		headless: true,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	globalSetup: './fixtures/global-setup.ts',
	webServer: {
		command: 'jiti fixtures/server-boot-both.ts',
		cwd: __dirname,
		url: `${BASE_URL}/keystone/signin`,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		stdout: 'pipe',
		stderr: 'pipe',
		env: {
			MONGO_URI:
				process.env.MONGO_URI ??
				'mongodb://localhost:27017/keystone-e2e-ui',
			PORT,
			NODE_ENV: 'test',
			NODE_OPTIONS,
			KEYSTONE_PREBUILD_ADMIN: 'true',
		},
	},
});
