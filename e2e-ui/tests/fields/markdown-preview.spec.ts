/**
 * Markdown field preview pane spec.
 *
 * Verifies that admin next renders a live preview pane next to the
 * markdown textarea, that the preview reflects heading and bold markup,
 * and that script injection is sanitised out by DOMPurify.
 *
 * Uses the field-complete fixture server (Article list, bodyMarkdown field).
 */

import { Types } from 'mongoose';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Article';

function toObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}

async function getArticleId(): Promise<string> {
  const doc = await withMongo((db) =>
    db.collection('Article').findOne({ fixtureKey: 'article-launch-playbook' }),
  );
  if (!doc) throw new Error('article-launch-playbook fixture not found');
  return doc._id.toString();
}

async function gotoAdminNextItem(
  page: import('@playwright/test').Page,
  listKey: string,
  id: string,
): Promise<void> {
  const load = page.waitForResponse(
    (r) =>
      r.url().includes(`/keystone-api/${listKey}/${id}`) &&
      r.request().method() === 'GET' &&
      r.status() === 200,
  );
  await page.goto(`/keystone-next/${listKey}/${id}`);
  await load;
  await expect(page.locator('form')).toBeVisible();
}

async function saveAdminNextItem(
  page: import('@playwright/test').Page,
  listKey: string,
  id: string,
): Promise<void> {
  const save = page.waitForResponse(
    (r) =>
      r.url().includes(`/keystone-api/${listKey}/${id}`) &&
      r.request().method() === 'POST',
  );
  await page.getByRole('button', { name: /^Save$/ }).click();
  const res = await save;
  if (res.status() !== 200) {
    throw new Error(`Save failed: ${res.status()} ${await res.text()}`);
  }
}

test.describe('Markdown field: preview pane', () => {
  test('preview pane renders heading and bold markup', async ({ signedInPage }) => {
    const page = signedInPage;
    const articleId = await getArticleId();
    await gotoAdminNextItem(page, LIST_KEY, articleId);

    const textarea = page.locator('textarea#bodyMarkdown');
    await expect(textarea).toBeVisible();

    // Type markdown with heading + bold word.
    await textarea.fill('# Hello\n\n**world**');

    // Wait for preview to appear (libraries lazy-load on first render,
    // typically < 200 ms; allow up to the suite expect timeout).
    const preview = page.locator('[data-field-markdown-preview]');
    await expect(preview).toBeVisible();

    // Heading: DOMPurify keeps standard heading elements.
    await expect(preview.locator('h1')).toContainText('Hello');

    // Bold: marked renders **word** as <strong>.
    await expect(preview.locator('strong')).toContainText('world');
  });

  test('script tags are sanitised out of the preview', async ({ signedInPage }) => {
    const page = signedInPage;
    const articleId = await getArticleId();
    await gotoAdminNextItem(page, LIST_KEY, articleId);

    const textarea = page.locator('textarea#bodyMarkdown');
    await expect(textarea).toBeVisible();

    // Inject a script tag. DOMPurify must strip it.
    await textarea.fill('<script>alert(1)</script>');

    const preview = page.locator('[data-field-markdown-preview]');
    await expect(preview).toBeVisible();

    // The <script> element must not exist inside the preview div.
    await expect(preview.locator('script')).toHaveCount(0);

    // alert(1) text should not be literally visible as executable script.
    // (DOMPurify strips the element entirely; text content may or may not
    // remain depending on marked rendering — assert the element is gone.)
    const scriptCount = await preview.locator('script').count();
    expect(scriptCount).toBe(0);
  });

  test('saved item persists raw markdown, not rendered HTML', async ({ signedInPage }) => {
    const page = signedInPage;
    const articleId = await getArticleId();
    await gotoAdminNextItem(page, LIST_KEY, articleId);

    const rawMarkdown = '# Save Test\n\nThis is **raw** markdown.';
    const textarea = page.locator('textarea#bodyMarkdown');
    await expect(textarea).toBeVisible();
    await textarea.fill(rawMarkdown);

    await saveAdminNextItem(page, LIST_KEY, articleId);

    // Verify Mongo stored raw markdown string, not HTML.
    const doc = await withMongo((db) =>
      db
        .collection('Article')
        .findOne({ _id: toObjectId(articleId) }),
    );
    expect(doc).not.toBeNull();
    const stored = (doc as Record<string, unknown>).bodyMarkdown as { md?: string } | null;
    expect(stored?.md).toBe(rawMarkdown);

    // Reload and verify the textarea still shows raw markdown.
    await gotoAdminNextItem(page, LIST_KEY, articleId);
    await expect(page.locator('textarea#bodyMarkdown')).toHaveValue(rawMarkdown);
  });
});
