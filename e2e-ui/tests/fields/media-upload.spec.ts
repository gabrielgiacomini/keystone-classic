import { Types } from 'mongoose';
import type { Page } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.js';
import { withMongo } from '../../fixtures/seed.js';

type MongoDoc = Record<string, unknown> & { _id: Types.ObjectId };

const PNG_BUFFER = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lJt9WQAAAABJRU5ErkJggg==',
	'base64',
);

function asRecord(value: unknown): Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? value as Record<string, unknown>
		: {};
}

function objectIdText(value: unknown): string {
	return value instanceof Types.ObjectId ? value.toString() : String(value ?? '');
}

function cloudinaryImage(publicId: string, width = 1200, height = 800): Record<string, unknown> {
	return {
		public_id: publicId,
		version: 1,
		signature: `sig-${publicId}`,
		format: 'jpg',
		resource_type: 'image',
		url: `http://res.cloudinary.test/${publicId}.jpg`,
		width,
		height,
		secure_url: `https://res.cloudinary.test/${publicId}.jpg`,
	};
}

async function mediaFixture(): Promise<MongoDoc> {
	const doc = await withMongo((db) =>
		db.collection('MediaAsset').findOne({ fixtureKey: 'media-hero' }),
	);
	expect(doc, 'media fixture should exist').toBeTruthy();
	return doc as MongoDoc;
}

async function restoreLegacyCloudinaryFixture(id: string): Promise<void> {
	await withMongo((db) =>
		db.collection('MediaAsset').updateOne(
			{ _id: new Types.ObjectId(id) },
			{
				$set: {
					legacyImage: cloudinaryImage('field-complete/legacy-hero', 1600, 900),
					legacyGallery: [
						cloudinaryImage('field-complete/gallery-1', 1200, 800),
						cloudinaryImage('field-complete/gallery-2', 900, 900),
					],
				},
			},
		),
	);
}

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

async function gotoLegacyMediaItem(page: Page, id: string): Promise<void> {
	const load = page.waitForResponse(
		(r) =>
			(
				r.url().includes(`/keystone-api/MediaAsset/${id}`) ||
				r.url().includes(`/keystone-api/media-assets/${id}`)
			) &&
			r.request().method() === 'GET' &&
			r.status() === 200,
	);
	await page.goto(`/keystone/media-assets/${id}`);
	await load;
	await expect(page.locator('[data-screen-id="item"]')).toBeVisible();
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
	test('legacy Cloudinary image lightbox opens, advances, and closes', async ({
		signedInPage,
	}) => {
		const media = await mediaFixture();
		const mediaId = objectIdText(media._id);
		await restoreLegacyCloudinaryFixture(mediaId);

		await gotoLegacyMediaItem(signedInPage, mediaId);

		await signedInPage
			.locator('.field-type-cloudinaryimage a', { has: signedInPage.locator('img') })
			.first()
			.click();
		const closeButton = signedInPage.getByTitle('Close (Esc)');
		await expect(closeButton).toBeVisible();
		await signedInPage.keyboard.press('Escape');
		await expect(closeButton).toBeHidden();

		await signedInPage
			.locator('.field-type-cloudinaryimages a', { has: signedInPage.locator('img') })
			.first()
			.click();
		await expect(closeButton).toBeVisible();
		await signedInPage.getByTitle('Next (Right arrow key)').click();
		await expect(closeButton).toBeVisible();
		await closeButton.click();
		await expect(closeButton).toBeHidden();
	});

	test('admin next uploads, replaces, and removes file and Cloudinary media hermetically', async ({
		signedInPage,
	}) => {
		const media = await mediaFixture();
		const mediaId = objectIdText(media._id);

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
		const imageUploadBody = await (await imageUpload).json() as { public_id?: string };
		expect(imageUploadBody.public_id).toBeTruthy();
		await saveMediaItem(signedInPage, mediaId);

		stored = await mediaFixture();
		expect(asRecord(stored.legacyImage).public_id).toBe(imageUploadBody.public_id);

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
		const galleryUploadBody = await (await galleryUpload).json() as { public_id?: string };
		expect(galleryUploadBody.public_id).toBeTruthy();
		await saveMediaItem(signedInPage, mediaId);

		stored = await mediaFixture();
		expect(stored.legacyGallery).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ public_id: galleryUploadBody.public_id }),
			]),
		);

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
		const directImageUploadBody = await (await directImageUpload).json() as { public_id?: string };
		expect(directImageUploadBody.public_id).toBeTruthy();
		await saveMediaItem(signedInPage, mediaId);

		stored = await mediaFixture();
		expect(asRecord(stored.cloudinaryDirectImage).public_id).toBe(directImageUploadBody.public_id);

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
		const directGalleryUploadBody = await (await directGalleryUpload).json() as { public_id?: string };
		expect(directGalleryUploadBody.public_id).toBeTruthy();
		await saveMediaItem(signedInPage, mediaId);

		stored = await mediaFixture();
		expect(stored.cloudinaryDirectGallery).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ public_id: directGalleryUploadBody.public_id }),
			]),
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
	});
});
