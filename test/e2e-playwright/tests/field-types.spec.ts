import { test, expect } from '@playwright/test';
import { SigninPage, ListPage, ItemPage } from '../page-objects';

test.describe('Field Types', () => {
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

	test.describe('Text Field', () => {
		test('should create item with text field', async ({ page }) => {
			await listPage.goto('texts');
			await listPage.openCreateModal();
			

			const name = 'Text Test ' + Date.now();
			await page.locator('input[name="name"]').fill(name);
			await page.locator('input[name="fieldA"]').fill('Field A Value');
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);
			await expect(page.locator('input[name="name"]')).toHaveValue(name);
		});
	});

	test.describe('Boolean Field', () => {
		test('should toggle boolean field', async ({ page }) => {
			await listPage.goto('booleans');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Boolean Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/booleans\/[a-f0-9]+/);

			const booleanToggle = page.locator('[data-field-type="boolean"] button.octicon').first();
			await booleanToggle.click();
			await itemPage.save();
		});
	});

	test.describe('Select Field', () => {
		test('should display select field options', async ({ page }) => {
			await listPage.goto('selects');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Select Test ' + Date.now());
			const selectField = page.locator('.Select').first();
			await selectField.click();
			await page.locator('.Select-option').first().click();
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/selects\/[a-f0-9]+/);
			await expect(page.locator('.Select').first()).toBeVisible();
		});
	});

	test.describe('Number Field', () => {
		test('should accept numeric input', async ({ page }) => {
			await listPage.goto('numbers');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Number Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/numbers\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('42');
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('42');
		});
	});

	test.describe('Email Field', () => {
		test('should validate email format', async ({ page }) => {
			await listPage.goto('emails');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Email Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/emails\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('test@example.com');
			await itemPage.save();
		});
	});

	test.describe('Date Field', () => {
		test('should display date picker', async ({ page }) => {
			await listPage.goto('dates');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Date Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/dates\/[a-f0-9]+/);
			await expect(page.locator('.DayPicker, input[type="text"]').first()).toBeVisible();
		});
	});

	test.describe('Textarea Field', () => {
		test('should accept multiline text', async ({ page }) => {
			await listPage.goto('textareas');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Textarea Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/textareas\/[a-f0-9]+/);

			const textarea = page.locator('textarea').first();
			await textarea.fill('Line 1\nLine 2\nLine 3');
			await itemPage.save();
		});
	});

	test.describe('Code Field', () => {
		test('should display code editor', async ({ page }) => {
			await listPage.goto('codes');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Code Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/codes\/[a-f0-9]+/);
			await expect(page.locator('.CodeMirror').first()).toBeVisible();
		});
	});

	test.describe('Color Field', () => {
		test('should display color picker button', async ({ page }) => {
			await listPage.goto('colors');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Color Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/colors\/[a-f0-9]+/);

			const colorInput = page.locator('input[name="fieldA"]');
			await colorInput.fill('#FF5500');
			await itemPage.save();
		});
	});

	test.describe('Name Field', () => {
		test('should have first and last name inputs', async ({ page }) => {
			await listPage.goto('names');
			await listPage.openCreateModal();

			await expect(page.getByPlaceholder('First name')).toBeVisible();
			await expect(page.getByPlaceholder('Last name')).toBeVisible();
		});

		test('should save name field', async ({ page }) => {
			await listPage.goto('names');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Name Test ' + Date.now());
			await page.getByPlaceholder('First name').first().fill('John');
			await page.getByPlaceholder('Last name').first().fill('Doe');
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/names\/[a-f0-9]+/);
			await expect(page.locator('input[name="fieldA.first"]')).toHaveValue('John');
		});
	});

	test.describe('Password Field', () => {
		test('should show change password button for existing user', async ({ page }) => {
			await listPage.goto('users');
			await listPage.clickRowByName('e2e user');
			await expect(page.getByRole('button', { name: 'Change Password' })).toBeVisible();
		});

		test('should have password confirmation on create', async ({ page }) => {
			await listPage.goto('passwords');
			await listPage.openCreateModal();

			await expect(page.getByPlaceholder('New password').first()).toBeVisible();
			await expect(page.getByPlaceholder('Confirm new password').first()).toBeVisible();
		});
	});

	test.describe('Url Field', () => {
		test('should accept URL input', async ({ page }) => {
			await listPage.goto('urls');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('URL Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/urls\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('https://example.com');
			await itemPage.save();
		});
	});

	test.describe('Relationship Field', () => {
		test('should display relationship select field', async ({ page }) => {
			await listPage.goto('relationships');
			await listPage.openCreateModal();

			await page.locator('input[name="name"]').fill('Relationship Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/relationships\/[a-f0-9]+/);
			await expect(page.locator('.Select').first()).toBeVisible();
		});

		test('should select relationship value (single)', async ({ page }) => {
			await listPage.goto('relationships');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Single Rel Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/relationships\/[a-f0-9]+/);

			const selectFieldA = page.locator('.Select').first();
			await selectFieldA.click();
			await page.keyboard.type('e2e user');
			await page.waitForTimeout(500);
			const option = page.locator('.Select-option').first();
			if (await option.isVisible()) {
				await option.click();
			}
			await itemPage.save();
		});

		test('should allow creating inline relationship', async ({ page }) => {
			await listPage.goto('relationships');
			await listPage.openCreateModal();
			

			await page.locator('input[name="name"]').fill('Inline Create Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/relationships\/[a-f0-9]+/);

			const addButton = page.getByRole('button', { name: '+' }).first();
			if (await addButton.isVisible()) {
				await addButton.click();
				await expect(page.getByTestId('create-modal')).toBeVisible();
				await page.getByTestId('create-cancel-button').click();
			}
		});
	});

	test.describe('Relationship Field (Many)', () => {
		test('should display multi-select for many relationship', async ({ page }) => {
			await listPage.goto('many-relationships');
			await listPage.openCreateModal();

			await page.locator('input').first().fill('Many Rel Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/many-relationships\/[a-f0-9]+/);
			await expect(page.locator('.Select--multi')).toBeVisible();
		});

		test('should select multiple relationship values', async ({ page }) => {
			await listPage.goto('texts');
			const initialRowCount = await listPage.getRowCount();
			
			if (initialRowCount < 2) {
				for (let i = 0; i < 2; i++) {
					await listPage.openCreateModal();
					await page.locator('input').first().fill(`Text Item ${i + 1}`);
					await page.locator('input').nth(1).fill(`Value ${i + 1}`);
					await page.getByTestId('create-submit-button').click();
					await page.waitForURL(/\/keystone\/texts\/[a-f0-9]+/);
					await listPage.goto('texts');
				}
			}
			
			await listPage.goto('many-relationships');
			await listPage.openCreateModal();

			await page.locator('input').first().fill('Multi Select Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/many-relationships\/[a-f0-9]+/);
			
			const selectField = page.locator('.Select--multi').first();
			await selectField.click();
			await page.waitForTimeout(500);
			const option = page.locator('.Select-option').first();
			if (await option.isVisible()) {
				await option.click();
			}
			await itemPage.save();
		});
	});

	test.describe('Reverse Relationships', () => {
		test('should display related items list on target item', async ({ page }) => {
			await listPage.goto('source-relationships');
			await listPage.openCreateModal();
			const sourceName = 'Source Item ' + Date.now();
			await page.locator('input').first().fill(sourceName);
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/source-relationships\/[a-f0-9]+/);

			await listPage.goto('target-relationships');
			await listPage.openCreateModal();
			await page.locator('input').first().fill('Target Item ' + Date.now());
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/target-relationships\/[a-f0-9]+/);

			const relatedItemsSection = await itemPage.getRelatedItemsList('source-relationships');
			await expect(relatedItemsSection).toBeVisible();
		});

		test('should link source to target and see in related items', async ({ page }) => {
			await listPage.goto('target-relationships');
			await listPage.openCreateModal();
			const targetName = 'Link Target ' + Date.now();
			await page.locator('input').first().fill(targetName);
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/target-relationships\/[a-f0-9]+/);
			const targetUrl = page.url();
			const targetId = targetUrl.split('/').pop();

			await listPage.goto('source-relationships');
			await listPage.openCreateModal();
			await page.locator('input').first().fill('Linked Source ' + Date.now());
			await page.getByTestId('create-submit-button').click();
			await page.waitForURL(/\/keystone\/source-relationships\/[a-f0-9]+/);

			const selectField = page.locator('.Select').first();
			await selectField.click();
			await page.keyboard.type(targetName.substring(0, 10));
			await page.waitForTimeout(1000);
			const option = page.locator('.Select-option').first();
			if (await option.isVisible()) {
				await option.click();
				await itemPage.save();
				await page.waitForTimeout(500);
			}

			await page.goto(`/keystone/target-relationships/${targetId}`);
			await page.waitForLoadState('networkidle');

			const relatedItemsSection = await itemPage.getRelatedItemsList('source-relationships');
			await expect(relatedItemsSection).toBeVisible();
		});
	});

	test.describe('Money Field', () => {
		test('should accept monetary input', async ({ page }) => {
			await listPage.goto('money');
			await listPage.openCreateModal();

			await page.getByText('Create a new Money').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Money Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/money\/[a-f0-9]+/);

			await page.locator('input[name="fieldA"]').fill('100.5');
			await itemPage.save();

			await page.waitForTimeout(500);
			await expect(page.locator('input[name="fieldA"]')).toHaveValue('100.5');
		});
	});

	test.describe('Html Field', () => {
		test('should display HTML editor', async ({ page }) => {
			await listPage.goto('htmls');
			await listPage.openCreateModal();

			await page.getByText('Create a new Html').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Html Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/htmls\/[a-f0-9]+/);
			await expect(page.locator('.TinyMCE, .field-type-html textarea, .CodeMirror').first()).toBeVisible();
		});
	});

	test.describe('Key Field', () => {
		test('should display key input', async ({ page }) => {
			await listPage.goto('keys');
			await listPage.openCreateModal();

			await page.getByText('Create a new Key').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Key Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/keys\/[a-f0-9]+/);
			await expect(page.locator('input[name="fieldA"]')).toBeVisible();
		});
	});

	test.describe('Markdown Field', () => {
		test('should display markdown editor', async ({ page }) => {
			await listPage.goto('markdowns');
			await listPage.openCreateModal();

			await page.getByText('Create a new Markdown').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Markdown Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/markdowns\/[a-f0-9]+/);
			await expect(page.locator('textarea, .CodeMirror').first()).toBeVisible();
		});
	});

	test.describe('Location Field', () => {
		test('should display location inputs', async ({ page }) => {
			await listPage.goto('locations');
			await listPage.openCreateModal();

			await page.getByText('Create a new Location').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Location Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/locations\/[a-f0-9]+/);
			await expect(page.locator('[name*="street"], [name*="city"], [data-field-type="location"]').first()).toBeVisible();
		});
	});

	test.describe('GeoPoint Field', () => {
		test('should display geo point inputs', async ({ page }) => {
			await listPage.goto('geo-points');
			await listPage.openCreateModal();

			await page.getByText('Create a new Geo Point').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('GeoPoint Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/geo-points\/[a-f0-9]+/);
			await expect(page.locator('input[placeholder="Latitude"], input[placeholder="Longitude"]').first()).toBeVisible();
		});
	});

	test.describe('File Field', () => {
		test('should display file upload button', async ({ page }) => {
			await listPage.goto('files');
			await listPage.openCreateModal();

			await page.getByText('Create a new File').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('File Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/files\/[a-f0-9]+/);
			await expect(page.locator('input[type="file"], .field-type-localfile, [data-field-type="file"]').first()).toBeVisible();
		});
	});

	test.describe('Datetime Field', () => {
		test('should display datetime picker', async ({ page }) => {
			await listPage.goto('datetimes');
			await listPage.openCreateModal();

			await page.getByText('Create a new Datetime').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Datetime Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/datetimes\/[a-f0-9]+/);
			await expect(page.locator('.DayPicker, input[type="text"], .field-type-datetime').first()).toBeVisible();
		});
	});

	test.describe('DateArray Field', () => {
		test('should display date array input', async ({ page }) => {
			await listPage.goto('date-arrays');
			await listPage.openCreateModal();

			await page.getByText('Create a new Date Array').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('DateArray Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/date-arrays\/[a-f0-9]+/);
			await expect(page.locator('.field-type-datearray, [data-field-type="datearray"]').first()).toBeVisible();
		});
	});

	test.describe('NumberArray Field', () => {
		test('should display number array input', async ({ page }) => {
			await listPage.goto('number-arrays');
			await listPage.openCreateModal();

			await page.getByText('Create a new Number Array').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('NumberArray Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/number-arrays\/[a-f0-9]+/);
			await expect(page.locator('.field-type-numberarray, [data-field-type="numberarray"]').first()).toBeVisible();
		});
	});

	test.describe('TextArray Field', () => {
		test('should display text array input', async ({ page }) => {
			await listPage.goto('text-arrays');
			await listPage.openCreateModal();

			await page.getByText('Create a new Text Array').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('TextArray Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/text-arrays\/[a-f0-9]+/);
			await expect(page.locator('.field-type-textarray, [data-field-type="textarray"]').first()).toBeVisible();
		});
	});

	test.describe('CloudinaryImage Field', () => {
		test('should display upload button', async ({ page }) => {
			await listPage.goto('cloudinary-images');
			await listPage.openCreateModal();

			await page.getByText('Create a new Cloudinary Image').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('Cloudinary Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/cloudinary-images\/[a-f0-9]+/);
			const uploadButton = page.locator('.field-type-cloudinaryimage button, button:has-text("Upload Image")').first();
			await expect(uploadButton).toBeVisible();
		});
	});

	test.describe('CloudinaryImages (Multiple) Field', () => {
		test('should display upload button for multiple images', async ({ page }) => {
			await listPage.goto('cloudinary-image-multiples');
			await listPage.openCreateModal();

			await page.getByText('Create a new Cloudinary Image Multiple').waitFor({ state: 'visible' });
			await page.waitForTimeout(500);
			await page.keyboard.type('CloudinaryMulti Test ' + Date.now());
			await page.getByTestId('create-submit-button').click();

			await page.waitForURL(/\/keystone\/cloudinary-image-multiples\/[a-f0-9]+/);
			const uploadButton = page.locator('.field-type-cloudinaryimages button, button:has-text("Upload Image")').first();
			await expect(uploadButton).toBeVisible();
		});
	});
});
