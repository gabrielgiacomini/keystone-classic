/**
 * Spec: code field JSON — CodeMirror 6 JSON editor (Wave 2).
 *
 * Verifies that the Code field with language: 'json' mounts a CodeMirror 6
 * editor (.cm-editor), shows lint markers on invalid JSON, clears them on
 * valid JSON, and round-trips the value through save → reload.
 *
 * Uses the field-complete fixture server (playwright.fields.config.ts).
 * The Article list has a `jsonConfig` field with `language: 'json'`.
 */

import { Types } from 'mongoose';
import type { Page } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Article';
const FIELD_PATH = 'jsonConfig';
const FIXTURE_KEY = 'article-launch-playbook';

async function getArticleId (): Promise<string> {
	const doc = await withMongo((db) =>
		db.collection('Article').findOne({ fixtureKey: FIXTURE_KEY }),
	);
	if (!doc) throw new Error('code-field-json spec: article fixture not found');
	return (doc._id as Types.ObjectId).toString();
}

async function gotoArticle (page: Page, id: string): Promise<void> {
	const load = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/${LIST_KEY}/${id}`) &&
			r.request().method() === 'GET' &&
			r.status() === 200,
		{ timeout: 20_000 },
	);
	await page.goto(`/keystone-next/${LIST_KEY}/${id}`);
	await load;
	await expect(page.locator('form')).toBeVisible();
}

/**
 * Replace the CodeMirror editor's content by selecting all and typing.
 * CodeMirror intercepts keyboard events on its inner div (.cm-content).
 */
async function fillCodeMirror (page: Page, fieldName: string, value: string): Promise<void> {
	const content = page.locator(
		`[data-codemirror-field="${fieldName}"] .cm-content`,
	);
	await content.click();
	// Select all existing content and replace it.
	await page.keyboard.press('ControlOrMeta+a');
	await page.keyboard.type(value);
}

test.describe('code field JSON — CodeMirror 6 editor', () => {
	test('CodeMirror editor mounts, lint marks invalid JSON, clears on valid, round-trips save', async ({
		signedInPage: page,
	}) => {
		const id = await getArticleId();
		await gotoArticle(page, id);

		// ------------------------------------------------------------------ 1.
		// Confirm CodeMirror mounted: .cm-editor must be present inside the
		// field container.
		const cmEditor = page.locator(
			`[data-codemirror-field="${FIELD_PATH}"] .cm-editor`,
		);
		await expect(cmEditor).toBeVisible({ timeout: 10_000 });

		// ------------------------------------------------------------------ 2.
		// Type invalid JSON → lint gutter marker must appear.
		await fillCodeMirror(page, FIELD_PATH, '{invalid json here');

		// CodeMirror's lint runs asynchronously (350 ms debounce by default).
		// Wait up to 4 s for a diagnostic marker to appear.
		const lintMarker = page.locator(
			`[data-codemirror-field="${FIELD_PATH}"] .cm-lint-marker`,
		);
		await expect(lintMarker).toBeVisible({ timeout: 4_000 });

		// ------------------------------------------------------------------ 3.
		// Type valid JSON → lint markers must disappear.
		const validJson = '{"env":"staging","version":2}';
		await fillCodeMirror(page, FIELD_PATH, validJson);

		await expect(lintMarker).toHaveCount(0, { timeout: 4_000 });

		// ------------------------------------------------------------------ 4.
		// Save and verify the value persisted in MongoDB.
		const save = page.waitForResponse(
			(r) =>
				r.url().includes(`/keystone-api/${LIST_KEY}/${id}`) &&
				r.request().method() === 'POST',
		);
		await page.getByRole('button', { name: /^Save$/ }).click();
		const res = await save;
		expect(res.status()).toBe(200);

		const doc = await withMongo((db) =>
			db.collection('Article').findOne({ fixtureKey: FIXTURE_KEY }),
		);
		expect(doc?.jsonConfig).toBe(validJson);

		// ------------------------------------------------------------------ 5.
		// Reload and confirm .cm-editor is still there (editor survives save).
		await gotoArticle(page, id);
		await expect(
			page.locator(`[data-codemirror-field="${FIELD_PATH}"] .cm-editor`),
		).toBeVisible({ timeout: 10_000 });
	});
});
