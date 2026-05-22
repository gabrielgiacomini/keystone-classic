/**
 * @file html-wysiwyg.spec.ts
 *
 * Verifies the TipTap WYSIWYG editor for the Html field type.
 *
 * Tests:
 *  1. Toolbar Bold button produces <strong> in stored HTML.
 *  2. Toolbar H2 button produces <h2> in stored HTML.
 *  3. Full round-trip: formatted content saves and reloads correctly.
 *
 * Uses the field-complete fixture server (playwright.fields.config.ts).
 */

import { Types } from 'mongoose';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

function objectIdText (value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

async function fixtureArticle () {
	const doc = await withMongo((db) =>
		db.collection('Article').findOne({ fixtureKey: 'article-launch-playbook' }),
	);
	expect(doc, 'article-launch-playbook fixture should exist').toBeTruthy();
	return doc as Record<string, unknown> & { _id: Types.ObjectId };
}

async function gotoArticle (page: import('@playwright/test').Page, id: string) {
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

async function saveArticle (page: import('@playwright/test').Page, id: string) {
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

/**
 * Wait for the TipTap editor to mount (ProseMirror contenteditable appears).
 */
async function waitForEditor (page: import('@playwright/test').Page) {
	const editor = page.locator('[data-field-name="bodyHtml"] .ProseMirror');
	await expect(editor).toBeVisible({ timeout: 10_000 });
	return editor;
}

/**
 * Clear the TipTap editor content by selecting all and deleting.
 */
async function clearEditor (page: import('@playwright/test').Page, editor: import('@playwright/test').Locator) {
	await editor.click();
	await page.keyboard.press('Control+a');
	await page.keyboard.press('Delete');
}

test.describe('Html field WYSIWYG (TipTap)', () => {
	test('Bold toolbar button wraps typed text in <strong>', async ({ signedInPage }) => {
		const article = await fixtureArticle();
		const articleId = objectIdText(article._id);

		await gotoArticle(signedInPage, articleId);
		const editor = await waitForEditor(signedInPage);
		await clearEditor(signedInPage, editor);

		// Click Bold button then type
		await signedInPage
			.locator('[data-field-name="bodyHtml"] [role="toolbar"] button[title="Bold"]')
			.click();
		await editor.pressSequentially('Bold text here');

		await saveArticle(signedInPage, articleId);

		const stored = await fixtureArticle();
		const html = stored.bodyHtml as string;
		expect(html).toContain('<strong>');
		expect(html).toContain('Bold text here');
	});

	test('H2 toolbar button wraps text in <h2>', async ({ signedInPage }) => {
		const article = await fixtureArticle();
		const articleId = objectIdText(article._id);

		await gotoArticle(signedInPage, articleId);
		const editor = await waitForEditor(signedInPage);
		await clearEditor(signedInPage, editor);

		// Click H2 button then type
		await signedInPage
			.locator('[data-field-name="bodyHtml"] [role="toolbar"] button[title="Heading 2"]')
			.click();
		await editor.pressSequentially('Section Heading');

		await saveArticle(signedInPage, articleId);

		const stored = await fixtureArticle();
		const html = stored.bodyHtml as string;
		expect(html).toContain('<h2>');
		expect(html).toContain('Section Heading');
	});

	test('formatted content round-trips: bold + h2 survive save and reload', async ({
		signedInPage,
	}) => {
		const article = await fixtureArticle();
		const articleId = objectIdText(article._id);

		await gotoArticle(signedInPage, articleId);
		const editor = await waitForEditor(signedInPage);

		// Use the TipTap editor instance (attached via __tiptapEditor) to set
		// structured content programmatically. This avoids all keyboard state issues.
		await editor.evaluate((el) => {
			type TipTapEl = HTMLElement & {
				__tiptapEditor?: {
					commands: {
						setContent: (html: string) => void;
					};
				};
			};
			(el as TipTapEl).__tiptapEditor?.commands.setContent(
				'<h2>My Heading</h2><p><strong>Bold paragraph</strong></p>',
			);
		});

		// Wait for the hidden input to reflect the new content before saving.
		await expect(
			signedInPage.locator('[data-field-name="bodyHtml"] input[type="hidden"]'),
		).toHaveValue(/<h2>/);
		await saveArticle(signedInPage, articleId);

		// Verify Mongo stored HTML
		const stored = await fixtureArticle();
		const html = stored.bodyHtml as string;
		expect(html).toMatch(/<h2[^>]*>My Heading<\/h2>/);
		expect(html).toContain('<strong>Bold paragraph</strong>');

		// Reload and verify editor shows the content
		await gotoArticle(signedInPage, articleId);
		const reloaded = await waitForEditor(signedInPage);
		await expect(reloaded.locator('h2')).toContainText('My Heading');
		await expect(reloaded.locator('strong')).toContainText('Bold paragraph');
	});
});
