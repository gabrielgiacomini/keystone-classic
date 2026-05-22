/**
 * @file html-tiptap.spec.ts
 *
 * Verifies that the Html field renders a TipTap WYSIWYG editor (not a plain
 * textarea) and that toolbar actions produce the expected HTML output.
 *
 * Checks:
 *  1. TipTap editor mounts — .ProseMirror element is visible.
 *  2. Bold toolbar button wraps typed text in <strong>.
 *  3. Link toolbar button inserts <a href=…>.
 *  4. Save round-trip: editor HTML persists and reloads correctly.
 *
 * Uses the field-complete fixture (playwright.fields.config.ts).
 */

import { Types } from 'mongoose';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

function objectIdText(value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

async function fixtureArticle() {
	const doc = await withMongo((db) =>
		db.collection('Article').findOne({ fixtureKey: 'article-launch-playbook' }),
	);
	expect(doc, 'article-launch-playbook fixture must exist').toBeTruthy();
	return doc as Record<string, unknown> & { _id: Types.ObjectId };
}

async function gotoArticle(page: import('@playwright/test').Page, id: string) {
	const load = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/Article/${id}`) &&
			r.request().method() === 'GET' &&
			r.status() === 200,
	);
	await page.goto(`/keystone-next/Article/${id}`);
	await load;
	await expect(page.locator('form')).toBeVisible();
}

async function saveArticle(page: import('@playwright/test').Page, id: string) {
	const save = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/Article/${id}`) &&
			r.request().method() === 'POST',
	);
	await page.getByRole('button', { name: /^Save$/ }).click();
	const res = await save;
	expect(res.status(), 'save should return 200').toBe(200);
	await expect(page.getByRole('status')).toContainText(/saved successfully/i);
}

/** Wait for the TipTap ProseMirror contenteditable to appear. */
async function waitForEditor(page: import('@playwright/test').Page) {
	const editor = page.locator('[data-field-name="bodyHtml"] .ProseMirror');
	await expect(editor).toBeVisible({ timeout: 10_000 });
	return editor;
}

/** Select all and delete to empty the editor content. */
async function clearEditor(
	page: import('@playwright/test').Page,
	editor: import('@playwright/test').Locator,
) {
	await editor.click();
	await page.keyboard.press('Control+a');
	await page.keyboard.press('Delete');
}

test.describe('Html field — TipTap WYSIWYG editor', () => {
	test('TipTap editor mounts: .ProseMirror element is visible', async ({ signedInPage }) => {
		const article = await fixtureArticle();
		const id = objectIdText(article._id);

		await gotoArticle(signedInPage, id);

		// Confirm TipTap has rendered — NOT a plain textarea
		const editor = signedInPage.locator('[data-field-name="bodyHtml"] .ProseMirror');
		await expect(editor).toBeVisible({ timeout: 10_000 });

		const textarea = signedInPage.locator('[data-field-name="bodyHtml"] textarea');
		await expect(textarea).toHaveCount(0);
	});

	test('Bold toolbar button produces <strong> in saved HTML', async ({ signedInPage }) => {
		const article = await fixtureArticle();
		const id = objectIdText(article._id);

		await gotoArticle(signedInPage, id);
		const editor = await waitForEditor(signedInPage);
		await clearEditor(signedInPage, editor);

		await signedInPage
			.locator('[data-field-name="bodyHtml"] [role="toolbar"] button[title="Bold"]')
			.click();
		await editor.pressSequentially('TipTap bold');

		await saveArticle(signedInPage, id);

		const stored = await fixtureArticle();
		const html = stored.bodyHtml as string;
		expect(html).toMatch(/<strong>|<b>/);
		expect(html).toContain('TipTap bold');
	});

	test('Link toolbar button inserts <a href= in saved HTML', async ({ signedInPage }) => {
		const article = await fixtureArticle();
		const id = objectIdText(article._id);

		await gotoArticle(signedInPage, id);
		const editor = await waitForEditor(signedInPage);
		await clearEditor(signedInPage, editor);

		// Type the link text first, select it, then apply Link
		await editor.pressSequentially('Click here');
		await signedInPage.keyboard.press('Control+a');

		// The Link button opens a prompt — intercept window.prompt
		await signedInPage.evaluate(() => {
			window.prompt = () => 'https://example.com/tiptap-test';
		});
		await signedInPage
			.locator('[data-field-name="bodyHtml"] [role="toolbar"] button[title="Insert / edit link"]')
			.click();

		await saveArticle(signedInPage, id);

		const stored = await fixtureArticle();
		const html = stored.bodyHtml as string;
		// TipTap Link extension emits: <a target="_blank" rel="noopener…" href="…">
		// so href= may not be the first attribute. Check for the anchor tag and URL separately.
		expect(html).toMatch(/<a\b/);
		expect(html).toContain('href=');
		expect(html).toContain('https://example.com/tiptap-test');
	});

	test('Formatted content round-trips through save and reload', async ({ signedInPage }) => {
		const article = await fixtureArticle();
		const id = objectIdText(article._id);

		await gotoArticle(signedInPage, id);
		const editor = await waitForEditor(signedInPage);

		// Use the __tiptapEditor handle attached in HtmlEditor.tsx to set content
		// programmatically — avoids keyboard-state flakiness.
		await editor.evaluate((el) => {
			type TipTapEl = HTMLElement & {
				__tiptapEditor?: { commands: { setContent: (html: string) => void } };
			};
			(el as TipTapEl).__tiptapEditor?.commands.setContent(
				'<h2>Round-trip Heading</h2><p><strong>Persisted bold</strong></p>',
			);
		});

		// Hidden input mirrors the editor value — wait for it to update
		await expect(
			signedInPage.locator('[data-field-name="bodyHtml"] input[type="hidden"]'),
		).toHaveValue(/<h2>/);

		await saveArticle(signedInPage, id);

		// Verify Mongo has the structured HTML
		const stored = await fixtureArticle();
		const html = stored.bodyHtml as string;
		expect(html).toMatch(/<h2[^>]*>Round-trip Heading<\/h2>/);
		expect(html).toContain('<strong>Persisted bold</strong>');

		// Reload and verify editor displays the saved content
		await gotoArticle(signedInPage, id);
		const reloaded = await waitForEditor(signedInPage);
		await expect(reloaded.locator('h2')).toContainText('Round-trip Heading');
		await expect(reloaded.locator('strong')).toContainText('Persisted bold');
	});
});
