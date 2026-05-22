/**
 * Visual identity guard for P4-30.
 *
 * This intentionally checks representative computed styles instead of
 * full-page screenshots. The goal is to catch product-identity drift away from
 * Keystone 4 legacy admin tokens without making harmless rendering differences
 * between React 15/glamor and React 18/CSS modules brittle.
 */

import type { Locator } from '@playwright/test';
import { test, expect } from '../fixtures/parity.js';
import { seedPostsAndEditors } from '../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';

let postId = '';

interface VisualSnapshot {
	backgroundColor: string;
	backgroundImage: string;
	borderColor: string;
	borderRadius: string;
	boxShadow: string;
	color: string;
	fontFamily: string;
	fontSize: string;
	fontWeight: string;
	height: number;
	paddingBottom: string;
	paddingTop: string;
	textTransform: string;
	width: number;
	x: number;
	y: number;
}

async function readVisual (locator: Locator): Promise<VisualSnapshot> {
	return locator.evaluate((node) => {
		const style = window.getComputedStyle(node);
		const rect = node.getBoundingClientRect();
		return {
			backgroundColor: style.backgroundColor,
			backgroundImage: style.backgroundImage,
			borderColor: style.borderColor,
			borderRadius: style.borderRadius,
			boxShadow: style.boxShadow,
			color: style.color,
			fontFamily: style.fontFamily,
			fontSize: style.fontSize,
			fontWeight: style.fontWeight,
			height: rect.height,
			paddingBottom: style.paddingBottom,
			paddingTop: style.paddingTop,
			textTransform: style.textTransform,
			width: rect.width,
			x: rect.x,
			y: rect.y,
		};
	});
}

function colorChannels (value: string): [number, number, number] {
	const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
	expect(match, `expected CSS rgb() color, received "${value}"`).not.toBeNull();
	return [
		Number(match?.[1] ?? 0),
		Number(match?.[2] ?? 0),
		Number(match?.[3] ?? 0),
	];
}

function expectColorNear (
	actual: string,
	expected: [number, number, number],
	label: string,
	tolerance = 3,
): void {
	const channels = colorChannels(actual);
	for (const [index, channel] of channels.entries()) {
		const expectedChannel = expected[index];
		if (expectedChannel === undefined) {
			throw new Error(`missing expected color channel ${index} for ${label}`);
		}
		expect(
			Math.abs(channel - expectedChannel),
			`${label}: expected ${actual} near rgb(${expected.join(', ')})`,
		).toBeLessThanOrEqual(tolerance);
	}
}

function expectRadiusNear (actual: string, expected: number, label: string): void {
	expect(
		Math.abs(parseFloat(actual) - expected),
		`${label}: expected radius ${actual} near ${expected}px`,
	).toBeLessThanOrEqual(1);
}

test.beforeEach(async () => {
	const seed = await seedPostsAndEditors();
	postId = seed.postIds[0] ?? '';
	expect(postId, 'seed should produce at least one post').toMatch(/^[0-9a-f]{24}$/);
});

test.describe('Visual identity: admin next', () => {
	test('uses legacy typography, body background, and top navigation treatment', async ({
		adminNext,
	}) => {
		await adminNext.gotoHome();

		const body = await readVisual(adminNext.page.locator('body'));
		expect(body.fontFamily.toLowerCase()).toContain('helvetica');
		expectColorNear(body.backgroundColor, [250, 250, 250], 'body background');
		expectColorNear(body.color, [26, 26, 26], 'body text');

		const nav = adminNext.page.locator('nav[aria-label="Primary"]');
		await expect(nav).toBeVisible();
		const navVisual = await readVisual(nav);
		expectColorNear(navVisual.backgroundColor, [19, 133, 229], 'primary navigation background');
		expect(navVisual.width).toBeGreaterThan(1000);
		expect(navVisual.height).toBeGreaterThanOrEqual(40);
		expect(navVisual.height).toBeLessThanOrEqual(56);
		expect(navVisual.y).toBeLessThanOrEqual(1);

		const navLink = adminNext.page.locator('[data-nav-list-link]').first();
		await expect(navLink).toBeVisible();
		const navLinkVisual = await readVisual(navLink);
		expectColorNear(navLinkVisual.color, [255, 255, 255], 'primary navigation link');

		const main = await readVisual(adminNext.page.locator('main'));
		expect(main.y).toBeGreaterThanOrEqual(navVisual.height - 1);
	});

	test('keeps dashboard cards and list tables on legacy Keystone tokens', async ({
		adminNext,
	}) => {
		await adminNext.gotoHome();

		const card = adminNext.page.locator('[data-dashboard-list]').first();
		await expect(card).toBeVisible();
		const cardVisual = await readVisual(card);
		expectColorNear(cardVisual.backgroundColor, [255, 255, 255], 'dashboard card background');
		expectRadiusNear(cardVisual.borderRadius, 4.8, 'dashboard card');
		expect(cardVisual.boxShadow).not.toBe('none');

		// The manage link container uses color:inherit (dark text); the card title
		// span inside it carries the primary-blue colour from --ks-primary.
		const cardTitle = adminNext.page.locator('[data-dashboard-list-manage] > div').first();
		const cardTitleVisual = await readVisual(cardTitle);
		expectColorNear(cardTitleVisual.color, [19, 133, 229], 'dashboard card title');

		await adminNext.gotoList(LIST_KEY);

		const createButton = adminNext.page.locator('[data-list-create]');
		await expect(createButton).toBeVisible();
		const createVisual = await readVisual(createButton);
		expect(createVisual.backgroundImage).toContain('linear-gradient');
		// The success-green border is a multi-stop shorthand; the resolved single
		// colour differs slightly by browser. Use a wider tolerance (15) to guard
		// against non-green without pixel-pinning the exact shade.
		expectColorNear(createVisual.borderColor, [44, 165, 55], 'create button border', 15);
		expectRadiusNear(createVisual.borderRadius, 4.8, 'create button');

		const searchInput = adminNext.page.locator('input[type="search"]');
		await expect(searchInput).toBeVisible();
		const searchVisual = await readVisual(searchInput);
		expectColorNear(searchVisual.borderColor, [204, 204, 204], 'search input border');
		expectRadiusNear(searchVisual.borderRadius, 4.8, 'search input');
		expect(searchVisual.height).toBeGreaterThanOrEqual(34);
		expect(searchVisual.height).toBeLessThanOrEqual(42);

		const tableHeader = adminNext.page.locator('[data-list-table] thead th').nth(1);
		await expect(tableHeader).toBeVisible();
		const headerVisual = await readVisual(tableHeader);
		expectColorNear(headerVisual.backgroundColor, [250, 250, 250], 'table header background');
		expectColorNear(headerVisual.color, [102, 102, 102], 'table header text');
		expect(headerVisual.textTransform).toBe('uppercase');
		expect(parseFloat(headerVisual.paddingTop)).toBeLessThanOrEqual(9);
		expect(parseFloat(headerVisual.paddingBottom)).toBeLessThanOrEqual(9);

		const tableCell = adminNext.page.locator('[data-list-row] td').nth(1);
		await expect(tableCell).toBeVisible();
		const cellVisual = await readVisual(tableCell);
		expect(cellVisual.height).toBeLessThanOrEqual(44);
		expectColorNear(cellVisual.color, [26, 26, 26], 'table cell text');
	});

	test('keeps edit forms and delete dialogs aligned with legacy controls', async ({
		adminNext,
	}) => {
		await adminNext.gotoItem(LIST_KEY, postId);

		// The edit form itself is a transparent container — it inherits the
		// #fafafa body background.  The item-form container is NOT rendered as
		// a white card; visual structure comes from FieldShell rows and the
		// footer bar below.  We verify [data-item-form] is visible and that the
		// surrounding page body uses the correct background token.
		const form = adminNext.page.locator('[data-item-form]');
		await expect(form).toBeVisible();
		// Body background should be the legacy body-bg token (~#fafafa).
		const bodyVisual = await readVisual(adminNext.page.locator('body'));
		expectColorNear(bodyVisual.backgroundColor, [250, 250, 250], 'page body background');

		const label = adminNext.page.locator('[data-field-name="title"] label').first();
		await expect(label).toBeVisible();
		const labelVisual = await readVisual(label);
		expectColorNear(labelVisual.color, [127, 127, 127], 'field label');
		expect(labelVisual.fontWeight).toBe('400');

		// The admin-next save button is a flat primary-blue button (no gradient).
		// It uses background: var(--ks-primary) = #1385e5 = rgb(19, 133, 229)
		// and border: 0 with border-radius: var(--ks-radius) = 0.3rem ≈ 4.8px.
		const saveButton = adminNext.page.getByRole('button', { name: /^Save$/ });
		await expect(saveButton).toBeVisible();
		const saveVisual = await readVisual(saveButton);
		expectColorNear(saveVisual.backgroundColor, [19, 133, 229], 'save button background', 8);
		expectRadiusNear(saveVisual.borderRadius, 4.8, 'save button');

		// /$list/create redirects to /$list?create=true which opens the modal overlay.
		await adminNext.page.goto(`${adminNext.prefix}/${LIST_KEY}/create`);
		const createModal = adminNext.page.locator('[data-create-item-modal]');
		await expect(createModal).toBeVisible();

		// The modal renders an h2, not a standalone h1 page title.
		await expect(adminNext.page.locator('[data-create-item-modal] h2')).toBeVisible();

		// Visual checks target the modal card (which has white bg + shadow).
		const createFormVisual = await readVisual(createModal);
		expectColorNear(createFormVisual.backgroundColor, [255, 255, 255], 'create form background');
		expectRadiusNear(createFormVisual.borderRadius, 4.8, 'create form');
		expect(createFormVisual.boxShadow).not.toBe('none');

		const submitButton = adminNext.page.getByRole('button', { name: /^Create$/ });
		const submitVisual = await readVisual(submitButton);
		expect(submitVisual.backgroundImage).toContain('linear-gradient');
		// Create submit button uses a green gradient (#2ca335 border).
		expectColorNear(submitVisual.borderColor, [44, 163, 53], 'create submit button border', 10);
		expectRadiusNear(submitVisual.borderRadius, 4.8, 'create submit button');

		await adminNext.gotoList(LIST_KEY);
		const ids = await adminNext.getRowIds();
		expect(ids.length).toBeGreaterThan(0);
		const firstId = ids[0];
		if (firstId === undefined) {
			throw new Error('expected at least one row id for visual dialog guard');
		}
		await adminNext.selectRows([firstId]);
		await adminNext.page.locator('[data-list-management-delete]').click();

		const dialog = adminNext.page.locator('[data-confirm-dialog]');
		await expect(dialog).toBeVisible();
		const dialogVisual = await readVisual(dialog);
		expectRadiusNear(dialogVisual.borderRadius, 4.8, 'delete dialog');

		const confirm = dialog.locator('[data-confirm-delete]');
		const confirmVisual = await readVisual(confirm);
		expect(confirmVisual.backgroundImage).toContain('linear-gradient');
		expectColorNear(confirmVisual.borderColor, [169, 42, 42], 'delete dialog confirm border', 8);
		expectRadiusNear(confirmVisual.borderRadius, 4.8, 'delete dialog confirm');
	});
});
