/**
 * @file Playwright global-setup for the UI parity suite (P4-30).
 *
 * Runs once before all parity specs. Waits for the Keystone server
 * (booted via `webServer` in playwright.parity.config.ts) to accept
 * connections on port 3008, then verifies the session API responds.
 *
 * The actual DB seed (admin + 5 Posts) happens inside
 * `server-boot-both.mjs` at boot time. Each parity spec's
 * `test.beforeEach` re-seeds via MongoDB if it needs a clean state.
 *
 * This file is referenced in `playwright.parity.config.ts` as
 * `globalSetup`.
 */

import { chromium } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3008';
const TIMEOUT_MS = 30_000;

/**
 * Wait until the Keystone signin page responds with HTTP 200.
 * The `webServer` block in the config already handles startup waiting,
 * but this gives a typed entrypoint for any additional global setup.
 */
export default async function globalSetup (): Promise<void> {
	const deadline = Date.now() + TIMEOUT_MS;
	let lastErr: unknown;

	while (Date.now() < deadline) {
		try {
			const browser = await chromium.launch({ headless: true });
			try {
				const ctx = await browser.newContext();
				const page = await ctx.newPage();
				const res = await page.goto(`${BASE_URL}/keystone/signin`, {
					waitUntil: 'load',
					timeout: 10_000,
				});
				if (res && res.status() === 200) {
					console.log(
						`[global-setup] Keystone ready at ${BASE_URL}/keystone/signin`,
					);
					return;
				}
				lastErr = new Error(`Unexpected status ${String(res?.status())}`);
			} finally {
				await browser.close();
			}
		} catch (err) {
			lastErr = err;
			await new Promise<void>((res) => { setTimeout(res, 2_000); });
		}
	}

	throw new Error(
		`[global-setup] Keystone did not become ready within ${TIMEOUT_MS}ms: ${String(lastErr)}`,
	);
}
