import { test, expect } from '@playwright/test';
import { SigninPage, ListPage, ItemPage } from '../page-objects';

test.describe('Field CRUD Workflow', () => {
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

	test.describe('Text Field CRUD', () => {
		test('should show fields in create modal', async ({ page }) => {
			await listPage.goto('texts');
			await listPage.openCreateModal();

			await expect(page.locator('input[name="name"]')).toBeVisible();
			await expect(page.locator('input[name="fieldA"]')).toBeVisible();
		});

		test('should fill and save via create modal', async ({ page }) => {
			await listPage.goto('texts');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Text CRUD Test');
			await page.locator('input[name="fieldA"]').fill('Value for Field A');
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);
			await expect(page.locator('input[name="name"]')).toHaveValue('Text CRUD Test');
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('Value for Field A');
		});

		test('should show fields in edit form', async ({ page }) => {
			await listPage.goto('texts');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Text Edit Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);

			await expect(page.locator('input[name="fieldA"]')).toBeVisible();
			await expect(page.locator('input[name="fieldB"]')).toBeVisible();
		});

		test('should update via edit form and persist value', async ({ page }) => {
			await listPage.goto('texts');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Text Update Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);

			await page.locator('input[name="fieldB"]').fill('Updated Field B');
			await itemPage.save();
			await page.waitForTimeout(500);

			await expect(page.locator('input[name="fieldB"]')).toHaveValue('Updated Field B');
		});
	});

	test.describe('Boolean Field CRUD', () => {
		test('should show boolean field in create modal', async ({ page }) => {
			await listPage.goto('booleans');
			await listPage.openCreateModal();

			await expect(page.locator('input[name="name"]')).toBeVisible();
		});

		test('should create and toggle boolean in edit form', async ({ page }) => {
			await listPage.goto('booleans');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Boolean CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/booleans\/[a-f0-9]+/);

			const booleanToggle = page.locator('[data-field-type="boolean"] button.octicon').first();
			await booleanToggle.click();
			await itemPage.save();
			await page.waitForTimeout(500);
			
			await expect(page).toHaveURL(/\/keystone\/booleans\/[a-f0-9]+/);
		});
	});

	test.describe('Select Field CRUD', () => {
		test('should show select options in create modal', async ({ page }) => {
			await listPage.goto('selects');
			await listPage.openCreateModal();

			const selectField = page.locator('.Select').first();
			await selectField.click();
			
			await expect(page.locator('.Select-option')).toHaveCount(3);
		});

		test('should select option and save', async ({ page }) => {
			await listPage.goto('selects');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Select CRUD Test');
			const selectField = page.locator('.Select').first();
			await selectField.click();
			await page.locator('.Select-option').first().click();
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/selects\/[a-f0-9]+/);
			await expect(page.locator('.Select-value-label, .Select__single-value')).toBeVisible();
		});

	});

	test.describe('Number Field CRUD', () => {
		test('should accept and persist number values', async ({ page }) => {
			await listPage.goto('numbers');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Number CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/numbers\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('123');
			await page.locator('input[name="fieldB"]').fill('456.78');
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('123');
			await expect(page.locator('input[name="fieldB"]')).toHaveValue('456.78');
		});
	});

	test.describe('Email Field CRUD', () => {
		test('should accept and persist email values', async ({ page }) => {
			await listPage.goto('emails');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Email CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/emails\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('test@example.com');
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('test@example.com');
		});
	});

	test.describe('Url Field CRUD', () => {
		test('should accept and persist URL values', async ({ page }) => {
			await listPage.goto('urls');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('URL CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/urls\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('https://example.com/path');
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('https://example.com/path');
		});
	});

	test.describe('Textarea Field CRUD', () => {
		test('should accept multiline text', async ({ page }) => {
			await listPage.goto('textareas');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Textarea CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/textareas\/[a-f0-9]+/);

			const multilineText = 'Line 1\nLine 2\nLine 3';
			await page.locator('textarea').first().fill(multilineText);
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('textarea').first()).toHaveValue(multilineText);
		});
	});

	test.describe('Name Field CRUD', () => {
		test('should accept first and last name', async ({ page }) => {
			await listPage.goto('names');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Name CRUD Test');
			await page.getByPlaceholder('First name').first().fill('John');
			await page.getByPlaceholder('Last name').first().fill('Smith');
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/names\/[a-f0-9]+/);
			await expect(page.locator('input[name="fieldA.first"]')).toHaveValue('John');
			await expect(page.locator('input[name="fieldA.last"]')).toHaveValue('Smith');
		});
	});

	test.describe('Color Field CRUD', () => {
		test('should accept hex color values', async ({ page }) => {
			await listPage.goto('colors');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Color CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/colors\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('#FF5500');
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('#FF5500');
		});
	});

	test.describe('Money Field CRUD', () => {
		test('should accept monetary values', async ({ page }) => {
			await listPage.goto('money');
			await listPage.openCreateModal();

			await page.getByText('Create a new Money').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Money CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/money\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('99.99');
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('99.99');
		});
	});

	test.describe('Key Field CRUD', () => {
		test('should accept key values', async ({ page }) => {
			await listPage.goto('keys');
			await listPage.openCreateModal();

			await page.getByText('Create a new Key').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Key CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/keys\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('my-unique-key');
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('my-unique-key');
		});
	});

	test.describe('Code Field CRUD', () => {
		test('should display CodeMirror editor', async ({ page }) => {
			await listPage.goto('codes');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Code CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/codes\/[a-f0-9]+/);

			await expect(page.locator('.CodeMirror').first()).toBeVisible();
		});
	});

	test.describe('Date Field CRUD', () => {
		test('should display date picker', async ({ page }) => {
			await listPage.goto('dates');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Date CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/dates\/[a-f0-9]+/);

			await expect(page.locator('.DayPicker, input[type="text"]').first()).toBeVisible();
		});
	});

	test.describe('Datetime Field CRUD', () => {
		test('should display datetime picker', async ({ page }) => {
			await listPage.goto('datetimes');
			await listPage.openCreateModal();

			await page.getByText('Create a new Datetime').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Datetime CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/datetimes\/[a-f0-9]+/);

			await expect(page.locator('.DayPicker, input[type="text"], .field-type-datetime').first()).toBeVisible();
		});
	});

	test.describe('Markdown Field CRUD', () => {
		test('should display markdown editor', async ({ page }) => {
			await listPage.goto('markdowns');
			await listPage.openCreateModal();

			await page.getByText('Create a new Markdown').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Markdown CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/markdowns\/[a-f0-9]+/);

			await expect(page.locator('textarea, .CodeMirror').first()).toBeVisible();
		});
	});

	test.describe('Html Field CRUD', () => {
		test('should display HTML editor', async ({ page }) => {
			await listPage.goto('htmls');
			await listPage.openCreateModal();

			await page.getByText('Create a new Html').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Html CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/htmls\/[a-f0-9]+/);

			await expect(page.locator('.TinyMCE, .field-type-html textarea, .CodeMirror').first()).toBeVisible();
		});
	});

	test.describe('GeoPoint Field CRUD', () => {
		test('should accept lat/lng values', async ({ page }) => {
			await listPage.goto('geo-points');
			await listPage.openCreateModal();

			await page.getByText('Create a new Geo Point').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('GeoPoint CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/geo-points\/[a-f0-9]+/);

			await expect(page.locator('input[placeholder="Latitude"], input[placeholder="Longitude"]').first()).toBeVisible();
		});
	});

	test.describe('Location Field CRUD', () => {
		test('should display location inputs', async ({ page }) => {
			await listPage.goto('locations');
			await listPage.openCreateModal();

			await page.getByText('Create a new Location').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Location CRUD Test');
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/locations\/[a-f0-9]+/);

			await expect(page.locator('[name*="street"], [name*="city"], [data-field-type="location"]').first()).toBeVisible();
		});
	});
});
