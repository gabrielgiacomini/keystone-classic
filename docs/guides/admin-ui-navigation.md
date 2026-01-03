# Keystone Admin UI Navigation Guide

This guide documents how to navigate and use the Keystone Admin UI.

## Quick Start

### Running the Admin UI

```bash
# Start with MongoDB on custom port
MONGO_PORT=27020 node test/e2e/server.js --notest

# Or with default MongoDB (port 27017)
node test/e2e/server.js --notest

# Without dropping the database
node test/e2e/server.js --notest --nodrop
```

The admin UI will be available at: `http://localhost:3000/keystone/`

### Default Test Credentials

| Email | Password | Role |
|-------|----------|------|
| `user@test.e2e` | `test` | Admin |
| `member@test.e2e` | `test` | Member + Admin |

---

## UI Structure

### 1. Sign-In Page (`/keystone/signin`)

The sign-in page provides authentication for the admin UI.

**Elements:**
- **Logo**: Displays the application brand (configurable)
- **Email Field**: User's email address
- **Password Field**: User's password
- **Sign In Button**: Submits the login form
- **Footer**: "Powered by KeystoneJS" link

**URL Pattern:** `/keystone/signin`

---

### 2. Home Dashboard (`/keystone/`)

The dashboard displays all Lists (data models) grouped by navigation categories.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Home] │ Access │ Fields │ Miscs │          [🌐] [🚪]  │  ← Primary Nav
├─────────────────────────────────────────────────────────┤
│ AppName                                                 │
├─────────────────────────────────────────────────────────┤
│ • Access                                                │
│   ┌──────────────┐                                      │
│   │ Users     [+]│                                      │
│   │ 2 Items      │                                      │
│   └──────────────┘                                      │
│                                                         │
│ • Fields                                                │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│   │ Booleans │ │ Codes    │ │ Dates    │ ...           │
│   │ 0 Items  │ │ 0 Items  │ │ 0 Items  │               │
│   └──────────┘ └──────────┘ └──────────┘               │
└─────────────────────────────────────────────────────────┘
```

**Navigation Elements:**
- **Primary Nav Bar** (green): Home, nav groups (Access, Fields, Miscs)
- **Secondary Nav** (appears on hover): Lists within each group
- **Dashboard Cards**: Click to view list, [+] button to create new item
- **Footer**: App name, KeystoneJS version, signed-in user

---

### 3. List View (`/keystone/{list-name}`)

Displays all items in a list with search, filter, and management tools.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Home] │ Access │ Fields │ Miscs │          [🌐] [🚪]  │
├─────────────────────────────────────────────────────────┤
│ Users                                              ▼    │  ← Secondary Nav
├─────────────────────────────────────────────────────────┤
│ 2 Users sorted by name ▼                                │
│                                                         │
│ [Search...        🔍] [Filter ▼] [Columns ▼] [Download] │
│                                              [+ Create] │
│                                                         │
│ [Manage]  Showing 2 Users                               │
│                                                         │
│ ┌───┬────────────┬─────────────────┬─────────┬────────┐│
│ │   │ Name     ▲ │ Email           │ Is Admin│Is Member│
│ ├───┼────────────┼─────────────────┼─────────┼────────┤│
│ │ 🗑│ e2e member │ member@test.e2e │    ✕    │   ✓    ││
│ │ 🗑│ e2e user   │ user@test.e2e   │    ✓    │   ✕    ││
│ └───┴────────────┴─────────────────┴─────────┴────────┘│
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Search Bar**: Full-text search across searchable fields
- **Filter Dropdown**: Filter by any field (Name, Email, Is Admin, etc.)
- **Columns Dropdown**: Show/hide table columns
- **Download Button**: Export list data (CSV)
- **Create Button**: Opens create modal
- **Manage Button**: Bulk selection mode
- **Sortable Columns**: Click column header to sort
- **Row Actions**: Click row to edit, trash icon for delete

**URL Patterns:**
- List view: `/keystone/users`
- With create modal: `/keystone/users?create`
- Filtered: `/keystone/users?isAdmin=true`

---

### 4. Item Edit View (`/keystone/{list-name}/{item-id}`)

Edit form for a single item.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Home] │ Access │ Fields │ Miscs │          [🌐] [🚪]  │
├─────────────────────────────────────────────────────────┤
│ Users                                              ▼    │
├─────────────────────────────────────────────────────────┤
│ ← Users   🔍 Search                        [+ New User] │
│                                                         │
│ e2e user                                                │
│ Key: e2e-user                                           │
│                                                         │
│ Name        [e2e          ] [user         ]             │
│ Email       [user@test.e2e                ]             │
│ Password    [Change Password]                           │
│ ☑ Is Admin                                              │
│ ☐ Is Member                                             │
│                                                         │
│ Meta                                                    │
│ Created At  2026-01-02 11:13:28 pm                      │
│ Updated At  2026-01-02 11:13:28 pm                      │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│ [Save]  reset changes                      delete user  │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Breadcrumb**: Back to list, search
- **Item Title**: Display name (from name field or ID)
- **Key Field**: Auto-generated slug (if autokey enabled)
- **Form Fields**: All editable fields for the model
- **Meta Section**: Created/Updated timestamps (if track enabled)
- **Save Button**: Save changes
- **Reset Changes**: Revert unsaved changes
- **Delete Button**: Delete the item (with confirmation)

---

### 5. Create Modal

Modal dialog for creating new items. Shows only fields marked with `initial: true`.

**Layout:**
```
┌────────────────────────────────────────┐
│ Create a new User                    ✕ │
├────────────────────────────────────────┤
│ Name      [First name   ] [Last name ] │
│ Email     [                          ] │
│ Password  [New password ] [Confirm   ] │
├────────────────────────────────────────┤
│ [Create]  Cancel                       │
└────────────────────────────────────────┘
```

**Triggered by:**
- Clicking [+ Create] button on list view
- Clicking [+] button on dashboard card
- URL: `/keystone/{list}?create`

---

## Field Type UI Components

Each field type has a specific UI component:

| Field Type | UI Component | Notes |
|------------|--------------|-------|
| **Text** | Single-line text input | Basic string input |
| **Textarea** | Multi-line text area | For longer text |
| **Email** | Text input with email link | Clickable mailto link in list |
| **Password** | Hidden with "Change Password" button | Never displays actual value |
| **Boolean** | Checkbox | Toggle true/false |
| **Select** | Dropdown | Single selection |
| **Number** | Number input | With increment/decrement |
| **Money** | Number input with currency | Formatted display |
| **Date** | Date picker | Calendar widget |
| **Datetime** | Date + time picker | Calendar + time |
| **Code** | CodeMirror editor | Syntax highlighting, line numbers |
| **Html** | TinyMCE WYSIWYG | Rich text editor |
| **Markdown** | Text area + preview | Live preview |
| **Color** | Text input + color picker | Visual color selection |
| **Name** | First + Last name fields | Composite field |
| **Location** | Multiple address fields | Google Places integration |
| **Relationship** | Searchable dropdown | Links to other lists |
| **File** | Upload button | File storage |
| **CloudinaryImage** | Upload + preview | Cloud image storage |

---

## Navigation Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Alt` | Reveal item ID in edit view |
| `Escape` | Close modal |
| `Enter` | Submit form (in modals) |

---

## URL Patterns Reference

| Pattern | Description |
|---------|-------------|
| `/keystone/` | Home dashboard |
| `/keystone/signin` | Sign-in page |
| `/keystone/signout` | Sign-out (redirects to signin) |
| `/keystone/{list}` | List view |
| `/keystone/{list}?create` | List view with create modal |
| `/keystone/{list}/{id}` | Item edit view |

---

## Configuration

### Navigation Groups

Configure via `keystone.set('nav', {...})`:

```javascript
keystone.set('nav', {
  'access': ['users'],           // Group name: [list keys]
  'content': ['posts', 'pages'],
  'media': ['galleries', 'images']
});
```

### Admin UI Customization

```javascript
keystone.init({
  'name': 'My App',                    // App name in header
  'brand': 'My Brand',                 // Brand name
  'adminui custom styles': 'path/to/styles.less',  // Custom CSS
  'signin logo': '/images/logo.png',   // Login page logo
});
```

---

## Testing the Admin UI

### Manual Testing Checklist

1. **Sign In**
   - [ ] Can sign in with valid credentials
   - [ ] Shows error for invalid credentials
   - [ ] Redirects to dashboard after login

2. **Dashboard**
   - [ ] All nav groups visible
   - [ ] List cards show correct item counts
   - [ ] Create buttons open modals

3. **List View**
   - [ ] Search filters results
   - [ ] Filter dropdown works
   - [ ] Column visibility toggles
   - [ ] Sorting by column works
   - [ ] Pagination (if many items)

4. **Item Edit**
   - [ ] All fields editable
   - [ ] Save persists changes
   - [ ] Reset reverts changes
   - [ ] Delete removes item

5. **Create Modal**
   - [ ] Initial fields shown
   - [ ] Validation errors displayed
   - [ ] Create saves and redirects to edit view

### Running E2E Tests

```bash
# Run all e2e tests (Nightwatch)
npm run test-e2e

# Run specific test group
node test/e2e/server.js --env default --group test/e2e/adminUI/tests/group001Login

# Run single test
node test/e2e/server.js --env default --test test/e2e/adminUI/tests/group001Login/uxTestSigninView.js
```

---

## Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Ensure MongoDB is running on the configured port
- Check `MONGO_PORT` or `MONGO_URI` environment variables

**"Session expired"**
- Clear cookies and sign in again
- Check `cookie secret` configuration

**"List not appearing"**
- Ensure list is registered with `List.register()`
- Check nav configuration includes the list

**Slow Admin UI**
- Enable `KEYSTONE_PREBUILD_ADMIN=true` for production
- Run `npm run build` to prebuild admin bundle
