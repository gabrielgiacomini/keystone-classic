/**
 * Parity spec: Item edit (P4-30).
 *
 * Verifies that both adminLegacy (/keystone) and adminNext (/keystone-next):
 *   - Load the same item (same ObjectId) from the seeded Post list
 *   - Display the same title field value
 *   - Can edit the title, save, reload, and both show the updated value
 *
 * Each test re-seeds to guarantee a known ID is available.
 */

import { test, expect } from '../../fixtures/parity.js';
import { seedPostsAndEditors, withMongo } from '../../fixtures/seed.js';

test.describe.configure({ mode: 'serial' });

const LIST_KEY = 'Post';
const LIST_PATH = 'posts';

let sharedPostId: string;

test.beforeEach(async () => {
	const seed = await seedPostsAndEditors();
	// Use the first post for all parity item tests.
	sharedPostId = seed.postIds[0] ?? '';
	expect(sharedPostId, 'seed should produce at least one post').toBeTruthy();
});

test.describe('Parity: Item edit', () => {
	test('both UIs load the same item and display the same title', async ({
		adminLegacy,
		adminNext,
	}) => {
		// Read ground-truth from Mongo.
		const doc = await withMongo((db) =>
			db.collection('Post').findOne({ _id: toObjectId(sharedPostId) }),
		);
		expect(doc).not.toBeNull();
		const expectedTitle = doc?.title as string;

		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const adminLegacyTitle = await adminLegacy.getFieldValue('title');

		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const adminNextTitle = await adminNext.getFieldValue('title');

		// Both UIs must render the same title.
		expect(adminLegacyTitle).toBe(expectedTitle);
		expect(adminNextTitle).toBe(expectedTitle);
	});

	test('editing title in adminLegacy → save → both UIs show updated value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const NEW_TITLE = `Parity Updated Title ${Date.now()}`;

		// Edit via adminLegacy.
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		await adminLegacy.fillField('title', NEW_TITLE);
		await adminLegacy.saveItem();

		// Reload in adminLegacy and verify.
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const adminLegacyTitle = await adminLegacy.getFieldValue('title');
		expect(adminLegacyTitle).toBe(NEW_TITLE);

		// Load the same item in adminNext and verify it shows the updated value.
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const adminNextTitle = await adminNext.getFieldValue('title');
		expect(adminNextTitle).toBe(NEW_TITLE);
	});

	test('editing title in adminNext → save → both UIs show updated value', async ({
		adminLegacy,
		adminNext,
	}) => {
		const NEW_TITLE = `Parity Admin Next Updated ${Date.now()}`;

		// Edit via adminNext.
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		await adminNext.fillField('title', NEW_TITLE);
		await adminNext.saveItem();

		// Reload in adminNext and verify.
		await adminNext.gotoItem(LIST_KEY, sharedPostId);
		const adminNextTitle = await adminNext.getFieldValue('title');
		expect(adminNextTitle).toBe(NEW_TITLE);

		// Load the same item in adminLegacy and verify it shows the updated value.
		await adminLegacy.gotoItem(LIST_PATH, sharedPostId);
		const adminLegacyTitle = await adminLegacy.getFieldValue('title');
		expect(adminLegacyTitle).toBe(NEW_TITLE);
	});
});

import { Types } from 'mongoose';
function toObjectId (id: string): Types.ObjectId {
	return new Types.ObjectId(id);
}
