# E2E TESTING WITH PLAYWRIGHT

## OVERVIEW

Playwright E2E tests for the Keystone Admin UI. **167 tests** covering authentication, CRUD operations, all field types, filtering, bulk operations, and navigation.

## QUICK START

```bash
# Terminal 1: Start the E2E server
MONGO_PORT=27020 npm run test-e2e-server

# Terminal 2: Run tests
npm run test-playwright           # Run all tests
npm run test-playwright:headed    # Run with browser visible
npm run test-playwright:ui        # Interactive UI mode
npm run test-playwright:debug     # Debug mode with inspector
```

## TEST STRUCTURE

```
test/e2e-playwright/
├── tests/                    # Test specs (167 tests)
│   ├── signin.spec.ts        # Authentication (5 tests)
│   ├── home-dashboard.spec.ts # Dashboard UI (14 tests)
│   ├── app-navigation.spec.ts # Navigation (20 tests)
│   ├── list-view.spec.ts     # List page (10 tests)
│   ├── item-crud.spec.ts     # Create/Read/Update/Delete (12 tests)
│   ├── field-types.spec.ts   # Field rendering (34 tests)
│   ├── field-crud-workflow.spec.ts # Field CRUD (23 tests)
│   ├── field-attributes.spec.ts # Field options (10 tests)
│   ├── filters.spec.ts       # List filtering (16 tests)
│   ├── bulk-operations.spec.ts # Bulk actions (14 tests)
│   └── bug-regressions.spec.ts # Issue fixes (9 tests)
├── page-objects/             # Page Object classes
│   ├── signin.page.ts        # Login page
│   ├── dashboard.page.ts     # Home dashboard
│   ├── list.page.ts          # List view (filters, columns, rows)
│   ├── item.page.ts          # Item edit form
│   └── index.ts              # Exports
└── AGENTS.md                 # This file
```

## PAGE OBJECTS

### SigninPage
```typescript
await signinPage.goto();
await signinPage.signinAsAdmin();  // user@test.e2e / test
await signinPage.signout();
```

### ListPage
```typescript
await listPage.goto('users');           // Navigate to list
await listPage.openCreateModal();       // Open create dialog
await listPage.clickRowByName('John');  // Click item by name
await listPage.getRowCount();           // Count visible rows
await listPage.search('query');         // Search items
await listPage.applyTextFilter('name', 'contains', 'value');
await listPage.clearAllFilters();
```

### ItemPage
```typescript
await itemPage.save();                  // Save changes
await itemPage.delete();                // Delete item
await itemPage.confirmDelete();         // Confirm deletion
await itemPage.fillField('name', 'value');
await itemPage.expectFieldValue('name', 'expected');
```

## WRITING TESTS

### Test Pattern
```typescript
import { test, expect } from '@playwright/test';
import { SigninPage, ListPage, ItemPage } from '../page-objects';

test.describe('Feature Name', () => {
    let signinPage: SigninPage;
    let listPage: ListPage;

    test.beforeEach(async ({ page }) => {
        signinPage = new SigninPage(page);
        listPage = new ListPage(page);
        
        await signinPage.goto();
        await signinPage.signinAsAdmin();
    });

    test('should do something', async ({ page }) => {
        await listPage.goto('texts');
        await expect(page.locator('.some-element')).toBeVisible();
    });
});
```

### Selector Priority
1. `getByTestId()` — data-testid attributes (most stable)
2. `getByRole()` — ARIA roles (accessible)
3. `getByText()` — Text content (user-visible)
4. `locator()` — CSS selectors (last resort)

### Waiting Strategies
```typescript
await page.waitForURL(/\/keystone\/items\/[a-f0-9]+/);
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
```

## REFACTORING WORKFLOW

When modifying the Keystone framework, follow this workflow:

### 1. Before Starting
```bash
# Ensure all tests pass
npm run test-playwright

# Keep server running in background
MONGO_PORT=27020 npm run test-e2e-server
```

### 2. During Development
```bash
# Run specific test file while working on a feature
npx playwright test field-types.spec.ts --headed

# Run single test
npx playwright test -g "should create item with text field"

# Debug a failing test
npx playwright test field-types.spec.ts --debug
```

### 3. Test-Driven Refactoring
1. **Run affected tests** before changing code
2. **Make incremental changes** — small commits
3. **Run tests after each change** — catch regressions early
4. **Use headed mode** to see what's happening:
   ```bash
   npx playwright test --headed --workers=1
   ```

### 4. When Tests Fail
```bash
# View trace for failed test
npx playwright show-trace test-screenshots/.../trace.zip

# Check screenshots
ls test-screenshots/

# Run with debug to step through
npx playwright test failing-test.spec.ts --debug
```

### 5. Coverage by Area

| Area | Test File | Run Command |
|------|-----------|-------------|
| Authentication | signin.spec.ts | `npx playwright test signin` |
| Admin UI Nav | app-navigation.spec.ts | `npx playwright test app-navigation` |
| List Operations | list-view.spec.ts, filters.spec.ts | `npx playwright test list-view filters` |
| Item CRUD | item-crud.spec.ts | `npx playwright test item-crud` |
| Field Types | field-types.spec.ts, field-crud-workflow.spec.ts | `npx playwright test field-types field-crud` |
| Bulk Actions | bulk-operations.spec.ts | `npx playwright test bulk-operations` |

## ADDING NEW TESTS

### For New Field Types
1. Add test in `field-types.spec.ts`:
```typescript
test.describe('NewField Field', () => {
    test('should display correctly', async ({ page }) => {
        await listPage.goto('new-fields');
        await listPage.openCreateModal();
        // assertions...
    });
});
```

2. Add CRUD workflow in `field-crud-workflow.spec.ts`

### For Bug Fixes
Add regression test in `bug-regressions.spec.ts`:
```typescript
test.describe('Issue #1234', () => {
    test('should fix the specific bug', async ({ page }) => {
        // reproduce and verify fix
    });
});
```

### For New Features
Create new spec file following naming convention: `feature-name.spec.ts`

## E2E SERVER

The test server (`test/e2e/server.js`) runs a full Keystone instance:

- **Port**: 3000 (or `KEYSTONEJS_PORT`)
- **Database**: `e2e3000` on MongoDB (uses `MONGO_PORT`)
- **Credentials**: `user@test.e2e` / `test`
- **Models**: All field types in `test/e2e/models/`

### Server Commands
```bash
# Start with fresh database
MONGO_PORT=27020 node test/e2e/server.js

# Start without dropping database (faster iteration)
MONGO_PORT=27020 node test/e2e/server.js --nodrop

# Using npm script
MONGO_PORT=27020 npm run test-e2e-server
```

## CONFIGURATION

### playwright.config.ts
- **Base URL**: `http://localhost:3000`
- **Browser**: Chromium only
- **Workers**: Parallel by default
- **Retries**: 0 (fail fast)
- **Screenshots**: On failure
- **Traces**: On failure

### Environment Variables
| Variable | Default | Purpose |
|----------|---------|---------|
| `MONGO_PORT` | 27017 | MongoDB port |
| `KEYSTONEJS_PORT` | 3000 | Server port |
| `KEYSTONEJS_HOST` | localhost | Server host |

## TROUBLESHOOTING

### Tests timeout waiting for server
- Ensure E2E server is running on port 3000
- Check MongoDB is running on correct port

### Element not found
- Use `--headed` to see what's happening
- Check if selectors changed in Admin UI
- Add explicit waits if needed

### Flaky tests
- Avoid `waitForTimeout()` — use proper waits
- Ensure test isolation (each test independent)
- Check for race conditions in async operations
