import { Types } from 'mongoose';
import type { Page } from '@playwright/test';
import cloudinary from 'cloudinary';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

type MongoDoc = Record<string, unknown> & { _id: Types.ObjectId };
type CloudinaryUploadBody = {
	public_id?: string;
	secure_url?: string;
	url?: string;
	width?: number;
	height?: number;
	format?: string;
	resource_type?: string;
};

const PNG_BUFFER = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lJt9WQAAAABJRU5ErkJggg==',
	'base64',
);
const RUNS_REAL_CLOUDINARY =
	process.env.RUN_CLOUDINARY_INTEGRATION === '1' && Boolean(process.env.CLOUDINARY_URL);
const CLOUDINARY_TEST_RUN_PREFIX = process.env.CLOUDINARY_TEST_RUN_PREFIX ?? '';
const cloudinarySdk = cloudinary.v2 ?? cloudinary;
const uploadedCloudinaryPublicIds = new Set<string>();

function asRecord(value: unknown): Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? value as Record<string, unknown>
		: {};
}

function objectIdText(value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

async function mediaFixture(): Promise<MongoDoc> {
	const doc = await withMongo((db) =>
		db.collection('MediaAsset').findOne({ fixtureKey: 'media-hero' }),
	);
	expect(doc, 'media fixture should exist').toBeTruthy();
	return doc as MongoDoc;
}

async function expectRenderableImages(page: Page, selector: string): Promise<void> {
	const images = page.locator(selector);
	const count = await images.count();
	expect(count).toBeGreaterThan(0);
	for (let i = 0; i < count; i += 1) {
		await expect(images.nth(i)).toHaveJSProperty('complete', true);
		const dimensions = await images.nth(i).evaluate((img) => ({
			width: (img as HTMLImageElement).naturalWidth,
			height: (img as HTMLImageElement).naturalHeight,
		}));
		expect(dimensions.width).toBeGreaterThan(0);
		expect(dimensions.height).toBeGreaterThan(0);
	}
}

function expectUploadBody(body: CloudinaryUploadBody): string {
	expect(body.public_id).toBeTruthy();
	expect(body.secure_url).toBeTruthy();
	expect(body.url).toBeTruthy();
	expect(body.width).toBeGreaterThan(0);
	expect(body.height).toBeGreaterThan(0);
	expect(body.format).toBeTruthy();
	expect(body.resource_type).toBe('image');
	if (RUNS_REAL_CLOUDINARY) {
		expect(body.public_id).toContain(`${CLOUDINARY_TEST_RUN_PREFIX}/`);
		expect(body.secure_url).toContain('res.cloudinary.com');
	}
	return body.public_id ?? '';
}

async function cleanupCloudinaryAssets(publicIds: string[]): Promise<void> {
	if (!RUNS_REAL_CLOUDINARY) return;
	const uniquePublicIds = [...new Set(publicIds)].filter((publicId) =>
		publicId.startsWith(`${CLOUDINARY_TEST_RUN_PREFIX}/`),
	);
	const failures: string[] = [];
	for (const publicId of uniquePublicIds) {
		try {
			await cloudinarySdk.uploader.destroy(publicId);
		} catch (err) {
			failures.push(`${publicId}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
	expect(failures, `Cloudinary cleanup failed:\n${failures.join('\n')}`).toEqual([]);
}

test.afterAll(async () => {
	await cleanupCloudinaryAssets([...uploadedCloudinaryPublicIds]);
});

async function gotoMediaItem(page: Page, id: string): Promise<void> {
	const load = page.waitForResponse(
		(r) =>
			(
				r.url().includes(`/keystone-api/MediaAsset/${id}`) ||
				r.url().includes(`/keystone-api/media-assets/${id}`)
			) &&
			r.request().method() === 'GET' &&
			r.status() === 200,
	);
	await page.goto(`/keystone-next/MediaAsset/${id}`);
	await load;
	await expect(page.locator('form')).toBeVisible();
}

async function saveMediaItem(page: Page, id: string): Promise<void> {
	const save = page.waitForResponse(
		(r) =>
			r.url().includes(`/keystone-api/MediaAsset/${id}`) &&
			r.request().method() === 'POST',
	);
	await page.getByRole('button', { name: /^Save$/ }).click();
	const res = await save;
	expect(res.status()).toBe(200);
	await expect(page.getByRole('status')).toContainText(/saved successfully/i);
}

function fieldShell(page: Page, fieldName: string, fieldType: string) {
	return page.locator(
		`[data-field-name="${fieldName}"][data-field-type="${fieldType}"]`,
	);
}

test.describe('field-complete media uploads', () => {
	test('admin next uploads, replaces, and removes file and Cloudinary media hermetically', async ({
		signedInPage,
	}) => {
		const uploadedPublicIds: string[] = [];
		const media = await mediaFixture();
		const mediaId = objectIdText(media._id);

		try {
			await gotoMediaItem(signedInPage, mediaId);

			const fileUpload = signedInPage.waitForResponse(
				(r) =>
					r.url().includes('/keystone-api/file/upload') &&
					r.request().method() === 'POST',
			);
			await fieldShell(signedInPage, 'download', 'file')
				.locator('input[type="file"]')
				.setInputFiles({
					name: 'field-complete-upload.txt',
					mimeType: 'text/plain',
					buffer: Buffer.from('field-complete upload'),
				});
			const fileUploadResponse = await fileUpload;
			expect(fileUploadResponse.status()).toBe(200);
			await saveMediaItem(signedInPage, mediaId);

			let stored = await mediaFixture();
			expect(asRecord(stored.download).originalname).toBe('field-complete-upload.txt');

			const replacementUpload = signedInPage.waitForResponse(
				(r) =>
					r.url().includes('/keystone-api/file/upload') &&
					r.request().method() === 'POST',
			);
			await fieldShell(signedInPage, 'download', 'file')
				.locator('input[type="file"]')
				.setInputFiles({
					name: 'field-complete-replacement.txt',
					mimeType: 'text/plain',
					buffer: Buffer.from('field-complete replacement'),
				});
			await replacementUpload;
			await saveMediaItem(signedInPage, mediaId);

			stored = await mediaFixture();
			expect(asRecord(stored.download).originalname).toBe('field-complete-replacement.txt');

			const imageUpload = signedInPage.waitForResponse(
				(r) =>
					r.url().includes('/keystone-api/cloudinary/upload') &&
					r.request().method() === 'POST',
			);
			await fieldShell(signedInPage, 'legacyImage', 'cloudinaryimage')
				.locator('input[type="file"]')
				.setInputFiles({
					name: 'field-complete-image.png',
					mimeType: 'image/png',
					buffer: PNG_BUFFER,
				});
			const imageUploadBody = await (await imageUpload).json() as CloudinaryUploadBody;
			uploadedPublicIds.push(expectUploadBody(imageUploadBody));
			await saveMediaItem(signedInPage, mediaId);

			stored = await mediaFixture();
			expect(asRecord(stored.legacyImage).public_id).toBe(imageUploadBody.public_id);
			await expectRenderableImages(signedInPage, '[data-field-name="legacyImage"] img');

			const galleryUpload = signedInPage.waitForResponse(
				(r) =>
					r.url().includes('/keystone-api/cloudinary/upload') &&
					r.request().method() === 'POST',
			);
			await fieldShell(signedInPage, 'legacyGallery', 'cloudinaryimages')
				.locator('input[type="file"]')
				.setInputFiles({
					name: 'field-complete-gallery.png',
					mimeType: 'image/png',
					buffer: PNG_BUFFER,
				});
			const galleryUploadBody = await (await galleryUpload).json() as CloudinaryUploadBody;
			uploadedPublicIds.push(expectUploadBody(galleryUploadBody));
			await saveMediaItem(signedInPage, mediaId);

			stored = await mediaFixture();
			expect(stored.legacyGallery).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ public_id: galleryUploadBody.public_id }),
				]),
			);
			await expectRenderableImages(signedInPage, '[data-field-name="legacyGallery"] img');

			const directImageUpload = signedInPage.waitForResponse(
				(r) =>
					r.url().includes('/keystone-api/cloudinary/upload') &&
					r.request().method() === 'POST',
			);
			await fieldShell(signedInPage, 'cloudinaryDirectImage', 'cloudinary')
				.locator('input[type="file"]')
				.setInputFiles({
					name: 'field-complete-direct-image.png',
					mimeType: 'image/png',
					buffer: PNG_BUFFER,
				});
			const directImageUploadBody = await (await directImageUpload).json() as CloudinaryUploadBody;
			uploadedPublicIds.push(expectUploadBody(directImageUploadBody));
			await saveMediaItem(signedInPage, mediaId);

			stored = await mediaFixture();
			expect(asRecord(stored.cloudinaryDirectImage).public_id).toBe(directImageUploadBody.public_id);
			await expectRenderableImages(signedInPage, '[data-field-name="cloudinaryDirectImage"] img');

			const directGalleryUpload = signedInPage.waitForResponse(
				(r) =>
					r.url().includes('/keystone-api/cloudinary/upload') &&
					r.request().method() === 'POST',
			);
			await fieldShell(signedInPage, 'cloudinaryDirectGallery', 'cloudinary')
				.locator('input[type="file"]')
				.setInputFiles({
					name: 'field-complete-direct-gallery.png',
					mimeType: 'image/png',
					buffer: PNG_BUFFER,
				});
			const directGalleryUploadBody = await (await directGalleryUpload).json() as CloudinaryUploadBody;
			uploadedPublicIds.push(expectUploadBody(directGalleryUploadBody));
			await saveMediaItem(signedInPage, mediaId);

			stored = await mediaFixture();
			expect(stored.cloudinaryDirectGallery).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ public_id: directGalleryUploadBody.public_id }),
				]),
			);
			await expectRenderableImages(signedInPage, '[data-field-name="cloudinaryDirectGallery"] img');

			await signedInPage.reload();
			await expect(signedInPage.locator('form')).toBeVisible();
			await expectRenderableImages(
				signedInPage,
				[
					'[data-field-name="legacyImage"] img',
					'[data-field-name="legacyGallery"] img',
					'[data-field-name="cloudinaryDirectImage"] img',
					'[data-field-name="cloudinaryDirectGallery"] img',
				].join(', '),
			);

			await fieldShell(signedInPage, 'download', 'file')
				.getByRole('button', { name: 'Remove' })
				.click();
			await fieldShell(signedInPage, 'legacyImage', 'cloudinaryimage')
				.getByRole('button', { name: 'Remove' })
				.click();
			await fieldShell(signedInPage, 'cloudinaryDirectImage', 'cloudinary')
				.getByRole('button', { name: 'Remove' })
				.click();

			const galleryField = fieldShell(signedInPage, 'legacyGallery', 'cloudinaryimages');
			while (await galleryField.getByRole('button', { name: 'Remove image' }).count()) {
				await galleryField.getByRole('button', { name: 'Remove image' }).first().click();
			}
			const directGalleryField = fieldShell(signedInPage, 'cloudinaryDirectGallery', 'cloudinary');
			while (await directGalleryField.getByRole('button', { name: 'Remove image' }).count()) {
				await directGalleryField.getByRole('button', { name: 'Remove image' }).first().click();
			}

			await saveMediaItem(signedInPage, mediaId);

			stored = await mediaFixture();
			expect(asRecord(stored.download).filename).toBeNull();
			expect(asRecord(stored.legacyImage).public_id).toBe('');
			expect(stored.legacyGallery).toEqual([]);
			expect(asRecord(stored.cloudinaryDirectImage).public_id).toBe('');
			expect(stored.cloudinaryDirectGallery).toEqual([]);
		} finally {
			uploadedPublicIds.forEach((publicId) => uploadedCloudinaryPublicIds.add(publicId));
			await cleanupCloudinaryAssets(uploadedPublicIds);
		}
	});
});
