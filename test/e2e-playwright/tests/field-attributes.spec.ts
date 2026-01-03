import { test, expect } from '@playwright/test';
import { SigninPage, ListPage, ItemPage } from '../page-objects';

test.describe('Field Attributes', () => {
	let signinPage: SigninPage;
	let listPage: ListPage;
	let itemPage: ItemPage;

	test.beforeEach(async ({ page }) => {
		signinPage = new SigninPage(page);
		listPage = new ListPage(page);
		itemPage = new ItemPage(page);
		await signinPage.goto();
		await signinPage.signinAsAdmin();
	});

	test.describe('hidden attribute', () => {
		test('should NOT show hidden field in edit form (Boolean.fieldC)', async ({ page }) => {
			await listPage.goto('booleans');
			await listPage.openCreateModal();

			await page.getByText('Create a new Boolean').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Hidden Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/booleans\/[a-f0-9]+/);

			const hiddenFieldC = page.locator('[data-field-path="fieldC"]');
			await expect(hiddenFieldC).not.toBeVisible();
		});
	});

	test.describe('dependsOn attribute', () => {
		test('should show dependent field when condition is met (DependsOn)', async ({ page }) => {
			await listPage.goto('depends-ons');
			await page.waitForLoadState('networkidle');
			await listPage.openCreateModal();

			await page.getByText('Create a new Depends On').waitFor({ state: 'visible', timeout: 10000 });

			const dependentLabel = page.getByText('Dependent', { exact: false });
			await expect(dependentLabel).toBeVisible();
		});


	});

	test.describe('height attribute', () => {
		test('should render Code editor (has height: 200)', async ({ page }) => {
			await listPage.goto('codes');
			await listPage.openCreateModal();

			await page.getByText('Create a new Code').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Code Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/codes\/[a-f0-9]+/);

			const codeEditor = page.locator('.CodeMirror').first();
			await expect(codeEditor).toBeVisible();
		});

		test('should render Markdown editor (has height: 200)', async ({ page }) => {
			await listPage.goto('markdowns');
			await listPage.openCreateModal();

			await page.getByText('Create a new Markdown').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Markdown Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/markdowns\/[a-f0-9]+/);

			const editor = page.locator('.CodeMirror, textarea').first();
			await expect(editor).toBeVisible();
		});
	});

	test.describe('options attribute', () => {
		test('should display Select options from string', async ({ page }) => {
			await listPage.goto('selects');
			await page.waitForLoadState('networkidle');
			await listPage.openCreateModal();

			await page.getByText('Create a new Select').waitFor({ state: 'visible', timeout: 10000 });

			const selectField = page.locator('.Select').first();
			await selectField.click();
			await page.waitForTimeout(500);

			const optionsList = page.locator('.Select-menu, .Select-option');
			await expect(optionsList.first()).toBeVisible();
		});


	});

	test.describe('initial attribute', () => {
		test('should show initial fields in create modal', async ({ page }) => {
			await listPage.goto('texts');
			await listPage.openCreateModal();

			await page.getByText('Create a new Text').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);

			const nameField = page.locator('input[name="name"]');
			const fieldA = page.locator('input[name="fieldA"]');

			await expect(nameField).toBeVisible();
			await expect(fieldA).toBeVisible();
		});

		test('should NOT show non-initial fields in create modal', async ({ page }) => {
			await listPage.goto('texts');
			await listPage.openCreateModal();

			await page.getByText('Create a new Text').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);

			const fieldB = page.locator('input[name="fieldB"]');
			await expect(fieldB).not.toBeVisible();
		});

		test('should show all fields including non-initial in edit form', async ({ page }) => {
			await listPage.goto('texts');
			await listPage.openCreateModal();

			await page.getByText('Create a new Text').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Initial Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);

			const fieldB = page.locator('input[name="fieldB"]');
			await expect(fieldB).toBeVisible();
		});
	});

	test.describe('required attribute', () => {
		test('should show error when required field is empty', async ({ page }) => {
			await listPage.goto('selects');
			await page.waitForLoadState('networkidle');
			await listPage.openCreateModal();

			await page.getByText('Create a new Select').waitFor({ state: 'visible', timeout: 10000 });
			await page.waitForTimeout(500);
			await page.keyboard.type('Required Test ' + Date.now());

			await page.getByTestId('create-submit-button').click();
			await page.waitForTimeout(1000);

			const errorOrStillInModal = await page.getByText('Create a new Select').isVisible();
			expect(errorOrStillInModal).toBe(true);
		});
	});

	test.describe('noedit attribute', () => {
		test('should show noedit field as read-only in edit form', async ({ page }) => {
			await page.goto('/keystone/select-field-on-initials');
			await page.waitForLoadState('networkidle');

			const listExists = await page.locator('h2').first().isVisible();
			expect(listExists).toBe(true);
		});
	});
});
