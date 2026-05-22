import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.FIELDS_PORT ?? '3009';
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const NODE_OPTIONS = process.env.NODE_OPTIONS ?? '--max-old-space-size=4096';
const MONGO_URI =
	process.env.MONGO_URI ??
	'mongodb://localhost:27017/keystone-e2e-ui-fields';

process.env.MONGO_URI = MONGO_URI;
process.env.E2E_BASE_URL = BASE_URL;

export default defineConfig({
	testDir: './tests/fields',
	fullyParallel: false,
	workers: 1,
	retries: 1,
	reporter: [
		['list'],
		['html', { open: 'never', outputFolder: 'playwright-report-fields' }],
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
			name: 'chromium-fields',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	globalSetup: './fixtures/global-setup.ts',
	webServer: {
		command: 'jiti fixtures/field-complete/server-boot.ts',
		cwd: __dirname,
		url: `${BASE_URL}/keystone/signin`,
		reuseExistingServer: false,
		timeout: 180_000,
		stdout: 'pipe',
		stderr: 'pipe',
		env: {
			MONGO_URI,
			PORT,
			NODE_ENV: 'test',
			NODE_OPTIONS,
			KEYSTONE_PREBUILD_ADMIN: 'true',
			TZ: 'UTC',
		},
	},
});
