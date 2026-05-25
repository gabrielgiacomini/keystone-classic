import { test, expect } from '@playwright/test';

import {
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from '../fixtures/constants.js';

async function signin(page: import('@playwright/test').Page, prefix: string): Promise<void> {
	await page.goto(`${prefix}/signin`);
	await page.locator('input#email, input[name="email"]').fill(TEST_ADMIN_EMAIL);
	await page.locator('input#password, input[name="password"]').fill(TEST_ADMIN_PASSWORD);
	const response = page.waitForResponse(
		(r) => r.url().includes('/keystone-api/session/signin') && r.request().method() === 'POST',
	);
	await page.locator('button[type="submit"]').click();
	await expect((await response).status()).toBe(200);
	await expect(page).toHaveURL(new RegExp(`${prefix}/?$`));
}

test.describe('Dual admin routing', () => {
	test('historical /keystone signin and list deep links are served by the React 18 legacy shell', async ({ page }) => {
		await signin(page, '/keystone');

		await page.goto('/keystone/users');
		await expect(page.locator('#react-root')).toBeVisible();
		await expect(page.locator('[data-screen-id="list"]')).toBeVisible();
		await expect(page.locator('table')).toBeVisible();
		await expect(page.locator('script[src*="/keystone/js/admin.js"]')).toHaveCount(1);
		await expect(page.locator('script[src*="packages.js"]')).toHaveCount(0);
	});

	test('explicit /keystone-next alias still serves the modern shell', async ({ page }) => {
		await signin(page, '/keystone-next');

		await page.goto('/keystone-next/users');
		await expect(page.locator('[data-list-table][data-list-path="users"]')).toBeVisible();
		await expect(page.locator('[data-list-row][data-item-id]').first()).toBeVisible();
		await expect(page.locator('[data-list-table][data-list-key="User"]')).toBeVisible();
	});
});
