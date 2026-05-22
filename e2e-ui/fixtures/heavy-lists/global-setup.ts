/**
 * @file Playwright global-setup for the heavy-list parity suite.
 *
 * Same wait logic as `fixtures/global-setup.ts` but targets port 3009
 * (the heavy-list server) instead of the default 3008.
 */

import { chromium } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3009';
const TIMEOUT_MS = 30_000;

export default async function globalSetup(): Promise<void> {
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
					console.log(`[global-setup-heavy] Keystone ready at ${BASE_URL}/keystone/signin`);
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
		`[global-setup-heavy] Keystone did not become ready within ${TIMEOUT_MS}ms: ${String(lastErr)}`,
	);
}
