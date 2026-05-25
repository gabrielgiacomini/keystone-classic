import { test, expect } from '@playwright/test';

import {
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from '../fixtures/constants.js';

async function signin(page: import('@playwright/test').Page, prefix: string): Promise<void> {
	await page.goto(`${prefix}/signin`);
	await page.locator('input#email').fill(TEST_ADMIN_EMAIL);
	await page.locator('input#password').fill(TEST_ADMIN_PASSWORD);
	const response = page.waitForResponse(
		(r) => r.url().includes('/keystone-api/session/signin') && r.request().method() === 'POST',
	);
	await page.locator('button[type="submit"]').click();
	await expect((await response).status()).toBe(200);
	await expect(page).toHaveURL(new RegExp(`${prefix}/?$`));
}

test.describe('Legacy client decommission', () => {
	test('historical /keystone signin and list deep links are served by the modern shell', async ({ page }) => {
		await signin(page, '/keystone');

		await page.goto('/keystone/posts');
		await expect(page.locator('[data-list-table][data-list-path="posts"]')).toBeVisible();
		await expect(page.locator('[data-list-row][data-item-id]').first()).toBeVisible();
		await expect(page.locator('[data-list-table][data-list-key="Post"]')).toBeVisible();
	});

	test('explicit /keystone-next alias still serves the modern shell', async ({ page }) => {
		await signin(page, '/keystone-next');

		await page.goto('/keystone-next/posts');
		await expect(page.locator('[data-list-table][data-list-path="posts"]')).toBeVisible();
		await expect(page.locator('[data-list-row][data-item-id]').first()).toBeVisible();
		await expect(page.locator('[data-list-table][data-list-key="Post"]')).toBeVisible();
	});
});
