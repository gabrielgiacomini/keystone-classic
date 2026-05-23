import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import type * as playwright from '@playwright/test';
import { test, expect } from '../fixtures/auth.js';
import { seedPostsAndEditors, withMongo } from '../fixtures/seed.js';
import { ADMIN_LEGACY_PATH, API_BASE } from '../fixtures/constants.js';

const FIELD_EXPLORER_URL = 'http://127.0.0.1:8001';

test.describe.configure({ mode: 'serial', timeout: 60_000 });

let fieldExplorer: ChildProcessWithoutNullStreams | undefined;

test.beforeAll(async () => {
	await seedPostsAndEditors();
});

test.afterAll(async () => {
	if (fieldExplorer && !fieldExplorer.killed) {
		fieldExplorer.kill();
	}
});

async function waitForListLoad (page: playwright.Page): Promise<void> {
	await page.waitForResponse(
		(r) =>
			r.url().includes(`${API_BASE}/posts`) &&
			r.request().method() === 'GET' &&
			r.status() === 200,
	);
}

async function gotoPostsList (page: playwright.Page): Promise<void> {
	const load = waitForListLoad(page);
	await page.goto(`/${ADMIN_LEGACY_PATH}/posts`);
	await load;
	await expect(page.locator('[data-screen-id="list"]')).toBeVisible();
}

async function resetSortableItems (): Promise<void> {
	await withMongo(async (db) => {
		const collection = db.collection('SortableItem');
		for (let i = 1; i <= 5; i++) {
			await collection.updateOne(
				{ name: `Sortable Item ${String(i).padStart(2, '0')}` },
				{
					$setOnInsert: { name: `Sortable Item ${String(i).padStart(2, '0')}` },
					$set: { sortOrder: i },
				},
				{ upsert: true },
			);
		}
	});
}

async function gotoSortableItemsList (page: playwright.Page): Promise<void> {
	const load = page.waitForResponse(
		(r) =>
			r.url().includes(`${API_BASE}/sortable-items`) &&
			r.request().method() === 'GET' &&
			r.status() === 200,
	);
	await page.goto(`/${ADMIN_LEGACY_PATH}/sortable-items`);
	await load;
	await expect(page.locator('[data-screen-id="list"]')).toBeVisible();
}

async function visibleSortableItemNames (page: playwright.Page): Promise<string[]> {
	return page.locator('table tbody tr[data-list-row]').evaluateAll((rows) =>
		rows.map((row) => row.textContent?.replace(/\s+/g, ' ').trim() ?? ''),
	);
}

async function ensureFieldExplorer (): Promise<void> {
	try {
		const response = await fetch(FIELD_EXPLORER_URL);
		if (response.ok) return;
	} catch {
		// Start the explorer below when the fixed dev port is not already serving.
	}

	fieldExplorer = spawn('node', ['./fields/explorer/server.mjs'], {
		cwd: process.cwd(),
		env: { ...process.env, NODE_ENV: 'test' },
	});

	await expect
		.poll(async () => {
			try {
				const response = await fetch(FIELD_EXPLORER_URL);
				return response.ok;
			} catch {
				return false;
			}
		}, { timeout: 30_000 })
		.toBe(true);
}

test.describe('React 17 legacy event boundaries', () => {
	test('popouts keep inside clicks and close on blockout clicks', async ({ signedInPage }) => {
		const page = signedInPage;
		await gotoPostsList(page);

		await page.locator('#listHeaderColumnButton').click();
		const popout = page.locator('.Popout');
		await expect(popout).toBeVisible();
		await expect(popout).toContainText('Columns');

		await page.locator('.Popout__inner').click();
		await expect(popout).toBeVisible();

		await page.locator('.blockout').click({ position: { x: 2, y: 2 } });
		await expect(popout).toBeHidden();
	});

	test('create modal keeps backdrop clicks and closes on Escape', async ({ signedInPage }) => {
		const page = signedInPage;
		await gotoPostsList(page);

		await page.getByRole('button', { name: /Create Post/i }).click();
		const dialog = page.locator('[data-screen-id="modal-dialog"]');
		await expect(dialog).toBeVisible();
		await expect(dialog).toContainText(/Create a new Post/i);

		await page.mouse.click(5, 5);
		await expect(dialog).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();
	});

	test('confirm modal keeps inside clicks and closes from Escape and backdrop', async ({ signedInPage }) => {
		const page = signedInPage;
		await gotoPostsList(page);

		await page.locator('button', { hasText: /^Manage$/ }).click();
		await page.evaluate(() => {
			const firstRowButton = document.querySelector('table tbody tr button');
			if (firstRowButton instanceof HTMLButtonElement) firstRowButton.click();
		});
		await expect(page.getByText(/1\s+selected/i)).toBeVisible();

		await page.locator('button[alt="delete"]').click();
		const dialog = page.locator('[data-screen-id="modal-dialog"]');
		await expect(dialog).toBeVisible();
		await dialog.click();
		await expect(dialog).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(dialog).toBeHidden();

		await page.locator('button[alt="delete"]').click();
		await expect(dialog).toBeVisible();
		await page.mouse.click(5, 5);
		await expect(dialog).toBeHidden();
	});

	test('mobile navigation keeps menu clicks and closes on Escape', async ({ signedInPage }) => {
		const page = signedInPage;
		await page.setViewportSize({ width: 375, height: 667 });
		await gotoPostsList(page);

		await page.locator('.MobileNavigation__bar__button--menu').click();
		const menu = page.locator('.MobileNavigation__menu');
		await expect(menu).toBeVisible();

		await menu.click();
		await expect(menu).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(menu).toBeHidden();
	});

	test('field explorer renders through its legacy React root', async ({ page }) => {
		await ensureFieldExplorer();
		await page.goto(FIELD_EXPLORER_URL);

		await expect(page.locator('.fx-welcome')).toBeVisible();
		const fieldLinks = page.locator('.fx-sidebar__item');
		await expect(fieldLinks.first()).toBeVisible();

		await fieldLinks.first().click();
		await expect(page.locator('.fx-page')).toBeVisible();
	});

	test('sortable row drag emits one reorder request', async ({ signedInPage }) => {
		const page = signedInPage;
		await resetSortableItems();
		await gotoSortableItemsList(page);

		const handles = page.locator('[data-list-row-control="sortable"]');
		await expect(handles).toHaveCount(5);
		const rows = page.locator('table tbody tr[data-list-row]');
		await expect(rows).toHaveCount(5);
		await expect.poll(() => visibleSortableItemNames(page)).toEqual([
			'Sortable Item 01',
			'Sortable Item 02',
			'Sortable Item 03',
			'Sortable Item 04',
			'Sortable Item 05',
		]);

		const reorderRequests: string[] = [];
		page.on('request', (request) => {
			if (
				request.method() === 'POST' &&
				request.url().includes(`${API_BASE}/sortable-items/`) &&
				request.url().includes('/sortOrder/')
			) {
				reorderRequests.push(request.url());
			}
		});

		const reorder = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/sortable-items/`) &&
				r.url().includes('/sortOrder/') &&
				r.request().method() === 'POST',
		);
		await handles.nth(0).dragTo(rows.nth(2));
		const response = await reorder;

		expect(reorderRequests).toHaveLength(1);
		expect(reorderRequests[0]).not.toContain('NaN');
		expect(response.status()).toBe(200);
		await gotoSortableItemsList(page);
		await expect.poll(() => visibleSortableItemNames(page)).toEqual([
			'Sortable Item 02',
			'Sortable Item 03',
			'Sortable Item 01',
			'Sortable Item 04',
			'Sortable Item 05',
		]);
	});
});
