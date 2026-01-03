import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const screenshotDir = path.join('test-screenshots', timestamp);

export default defineConfig({
	testDir: './test/e2e-playwright/tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	outputDir: path.join(screenshotDir, 'artifacts'),
	reporter: [
		['html', { outputFolder: path.join(screenshotDir, 'report') }],
		['list'],
		['json', { outputFile: path.join(screenshotDir, 'results.json') }]
	],
	use: {
		baseURL: process.env.KEYSTONE_URL || 'http://localhost:3000',
		trace: 'on',
		screenshot: 'on',
		video: 'on',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'MONGO_PORT=27020 node test/e2e/server.js --notest',
		url: 'http://localhost:3000/keystone/signin',
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},
	timeout: 30000,
	expect: {
		timeout: 5000,
	},
});
