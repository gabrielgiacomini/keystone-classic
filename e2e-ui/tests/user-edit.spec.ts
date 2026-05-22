/**
 * Section F — User edit + password-change round-trip.
 *
 * The runbook deferred the password-change flow because Chrome MCP
 * couldn't populate React-15 controlled inputs. Playwright can.
 *
 * Cleanup contract: regardless of test outcome, `afterAll` restores the
 * admin's original password directly via Mongoose. A failed save in the
 * middle of the round-trip won't leave the suite stuck on a wrong
 * password — every subsequent run starts from a known-good state.
 */

import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { test, expect } from '../fixtures/auth.js';
import { signInViaForm } from '../fixtures/auth.js';
import { resetWithoutPosts, withMongo, getAdminId } from '../fixtures/seed.js';
import {
	ADMIN_LEGACY_PATH,
	API_BASE,
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
} from '../fixtures/constants.js';

test.describe.configure({ mode: 'serial' });

let adminId: string;

/** Test fixture credential — never used outside this spec. */
const TEMP_PASSWORD = 'temp-password-456';

test.beforeAll(async () => {
	await resetWithoutPosts();
	adminId = await getAdminId();
});

test.afterAll(async () => {
	// Defensive: restore the admin's original password no matter what
	// happened during this spec. We hash via bcryptjs (not via the
	// Keystone List API — saving via Mongoose bypasses the
	// PasswordType pre-save hook, but `bcrypt.hash` matches what
	// Keystone would have written).
	const hash = await bcrypt.hash(TEST_ADMIN_PASSWORD, 10);
	await withMongo((db) =>
		db
			.collection('User')
			.updateOne({ email: TEST_ADMIN_EMAIL }, { $set: { password: hash } }),
	);
});

test.describe('F. User edit', () => {
	test('admin user detail renders Name + Email + Password fields', async ({
		signedInPage,
	}) => {
		const page = signedInPage;
		const itemLoad = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/users/${adminId}`)
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}/users/${adminId}`);
		await itemLoad;

		// Name field renders compound first/last subfields. The Keystone
		// Name type uses sub-paths `name.first` and `name.last`.
		await expect(page.locator('input[name="name.first"]')).toBeVisible();
		await expect(page.locator('input[name="name.last"]')).toBeVisible();
		// Email field.
		await expect(page.locator('input[name="email"]')).toBeVisible();
		// Password label + the "Change Password" button (because the
		// admin already has a password set).
		await expect(page.locator('label', { hasText: /^Password$/ })).toBeVisible();
		await expect(
			page.getByRole('button', { name: /Change Password/i }),
		).toBeVisible();
	});

	test('password-change round-trip: change → sign out → sign in with new pw', async ({
		signedInPage,
	}) => {
		const page = signedInPage;
		const itemLoad = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/users/${adminId}`)
				&& r.request().method() === 'GET'
				&& r.status() === 200,
		);
		await page.goto(`/${ADMIN_LEGACY_PATH}/users/${adminId}`);
		await itemLoad;

		// Reveal the inline password-change UI.
		await page.getByRole('button', { name: /Change Password/i }).click();

		// PasswordField renders two `<FormInput type="password">` inputs.
		// Their names are `password` and `password_confirm`.
		const newPwInput = page.locator('input[name="password"]');
		const confirmInput = page.locator('input[name="password_confirm"]');
		await expect(newPwInput).toBeVisible();
		await expect(confirmInput).toBeVisible();
		await newPwInput.fill(TEMP_PASSWORD);
		await confirmInput.fill(TEMP_PASSWORD);

		// Click Save. The save endpoint is POST /api/users/<id>.
		const savePromise = page.waitForResponse(
			(r) =>
				r.url().includes(`${API_BASE}/users/${adminId}`)
				&& r.request().method() === 'POST',
		);
		await page.getByRole('button', { name: /^Save$/ }).click();
		const saveRes = await savePromise;
		expect(saveRes.status()).toBe(200);

		// Sign out.
		await page.goto(`/${ADMIN_LEGACY_PATH}/signout`);
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/signin\\?signedout`));

		// Sign in with the NEW password.
		await signInViaForm(page, TEST_ADMIN_EMAIL, TEMP_PASSWORD);
		await expect(page).toHaveURL(new RegExp(`/${ADMIN_LEGACY_PATH}/?$`));

		// Sign out, then sign back in with the ORIGINAL password should
		// NOT work yet (we haven't restored it via the form). The
		// afterAll will restore it via Mongoose so subsequent specs
		// keep working — but we want to assert the change actually
		// "took". Verify the bcrypt hash on the user doc no longer
		// matches the original password.
		const stored = await withMongo((db) =>
			db.collection('User').findOne({ _id: new Types.ObjectId(adminId) }),
		);
		const matchesOldPw = await bcrypt.compare(
			TEST_ADMIN_PASSWORD,
			(stored?.password as string) ?? '',
		);
		expect(matchesOldPw).toBe(false);
		const matchesNewPw = await bcrypt.compare(
			TEMP_PASSWORD,
			(stored?.password as string) ?? '',
		);
		expect(matchesNewPw).toBe(true);
	});
});
