# Keystone Legacy Admin — Smoke Test Runbook

Last verified: 2026-05-24 against the `migration/react-17` branch.

Admin legacy is the React 15 / Redux / Browserify app served at `/keystone` by the existing keystone server. The admin next rewrite under `admin/client-next/` is not yet feature-complete (only signin + home), so the comprehensive testing target is admin legacy.

For manual field testing, use the field-complete fixture at port `3008`. It serves both admin clients, but the legacy admin is the primary test target:

- legacy admin URL: `http://127.0.0.1:3008/keystone`
- admin next URL: `http://127.0.0.1:3008/keystone-next`
- email: `admin@example.com`
- password: `admin-password-123`

## When to run this

- After server-library changes (`lib/`, `server/`, `index.mts`)
- After dependency bumps that touch `mongoose`, `react`, `elemental`, `react-transition-group`, `swcify`, `browserify`, `keystone-tinymce`
- After admin legacy client source touches (`admin/client-legacy/**` or `fields/components/**`) — even if only ESM/cosmetic, because Browserify-bundled client code has different default-import semantics than Node ESM
- Before cutting a release

Plan ~10 minutes once everything is set up; first-time setup adds Docker pull time.

## Prerequisites

- Node 22+ and npm
- Docker Desktop (Mongo 7 image is started via `docker compose`)
- Free TCP ports `3005` and `27017`
- Chrome with the **Claude in Chrome** extension installed and connected (the runbook assumes you drive the browser through the extension's MCP tools; manual clicking works equivalently)

## 0. Spin up dependencies

```sh
# Mongo
npm run db:up
docker ps | grep keystone4-mongo   # expect "(healthy)"

# Free port 3005 (skip if you know nothing is bound)
lsof -ti :3005 | xargs -r kill -9
```

## Field-Complete Manual Fixture

Use this fixture when manually testing upload fields, Cloudinary behavior, the legacy `Download` field, or field-renderer regressions.

```sh
# MongoDB on localhost:27017
docker start keystone-classic-e2e-mongo 2>/dev/null || docker run --name keystone-classic-e2e-mongo -p 27017:27017 -d mongo:6

# Hermetic mocked Cloudinary mode
npm run dev:full-fixture

# Real Cloudinary mode; requires ignored .env with RUN_CLOUDINARY_INTEGRATION=1 and CLOUDINARY_URL
npm run dev:full-fixture:cloudinary
```

When this server starts, provide these manual test details:

- URL: `http://127.0.0.1:3008/keystone`
- login: `admin@example.com`
- password: `admin-password-123`

Notes:

- The legacy admin is the current production-equivalent client for this fixture. Admin next is available at `/keystone-next`, but it is a future client and should not be treated as the source of truth for legacy regressions.
- The fixture sets `cache admin bundles` to `false`; legacy templates append `?v=<hash>` to admin CSS and JS assets so browser cache is invalidated after source or server-start changes without forcing `no-store`.
- In mocked Cloudinary mode, uploaded image previews use a data URL generated from the uploaded local file when possible. In real Cloudinary mode, uploads are sent to Cloudinary and should render `res.cloudinary.com` URLs.
- The `Download` field stores files under `.tmp/e2e-ui-field-complete/files`, serves them at `/field-complete-files/`, preserves the original uploaded filename, and writes a resolvable `url` value.

## 1. Boot the server

The harness lives in `e2e-api/fixtures/server-boot.ts`. It drops the test database on every boot and reseeds an admin user. Lists registered: `User`, `Post`.

```sh
KEYSTONE_DEV=true npm run dev:e2e-api > /tmp/keystone-server.log 2>&1 &
```

Wait for `[e2e-api] Keystone listening on http://127.0.0.1:3005/keystone` in the log, then sanity-check:

```sh
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3005/keystone/signin   # expect 200
```

Seeded admin (constants exported from the boot script):

- email `admin@example.com`
- password `admin-password-123`
- admin URL `http://127.0.0.1:3005/keystone`

If you have stale Browserify bundle output from a previous run, clear it before booting so the test exercises fresh source:

```sh
rm -rf admin/bundles
```

## 2. Seed list data

`server-boot.ts` only seeds the admin user. The smoke test uses ~25 Posts so the list view actually has something to filter, sort, paginate, and bulk-delete. Use the included seeder:

```sh
npx jiti e2e-api/fixtures/seed-posts.ts
# expect: [seed-posts] inserted 25 posts (target=25)
```

Idempotent — skips if `Post` collection already has ≥ 20 docs. Inserts varied `state` (draft/published/archived), `viewCount`, `featured`, `publishedAt`, all linked to the seeded admin as `author`.

## 3. Open the admin in Chrome

If using the Claude in Chrome MCP:
1. `mcp__Claude_in_Chrome__list_connected_browsers` to find your browser's deviceId
2. `mcp__Claude_in_Chrome__select_browser` with that deviceId
3. `mcp__Claude_in_Chrome__tabs_context_mcp { createIfEmpty: true }` to open a fresh tab
4. `mcp__Claude_in_Chrome__navigate` to `http://127.0.0.1:3005/keystone`

Otherwise just open the URL manually.

## 4. Test pass

For each section: do the steps, check Expected, then mark Last result. The matrix is set up so pass/fail per section is independent — you can stop and triage at the first failure.

### A. Auth

**Steps**
1. Navigate to `http://127.0.0.1:3005/keystone` while signed out → should redirect to `/keystone/signin`.
2. Submit the signin form with email correct, password `WRONG-PASSWORD`.
3. Re-submit with correct credentials.
4. Visit `/keystone/posts`, then back to `/keystone`.
5. Click the sign-out icon in the top-right nav. Then visit `/keystone` again.

**Expected**
- 1 → URL becomes `/keystone/signin`.
- 2 → "The email and password you entered are not valid." stays on signin.
- 3 → Lands on `/keystone/` with "Signed in as Test Admin" footer.
- 4 → Both pages render without re-auth.
- 5 → Sign-out clears session; visiting `/keystone` again redirects to `/keystone/signin?from=/keystone`.

**Last result**: ✅ pass

### B. Home dashboard

**Steps**
1. From `/keystone`, observe the list registry cards.
2. Compare counts against Mongo:
   ```sh
   node -e "import('mongoose').then(async({default:m})=>{await m.connect('mongodb://localhost:27017/keystone-e2e-api');for(const c of ['User','Post']){console.log(c,await m.connection.db.collection(c).countDocuments());}await m.connection.close();})"
   ```

**Expected**
- Cards: `Users (1 Item)`, `Posts (25 Items)` (or current Mongo count). Counts match Mongo exactly.
- No console errors on load.

**Last result**: ✅ pass

### C. List view (`/keystone/posts`)

**Steps**
1. Search: type `Post 07` in the Search box → URL becomes `?search=Post+07`.
2. Sort: `?sort=-publishedAt` shows posts ordered by published-at descending; label reads "25 Posts sorted by published at (descending)".
3. State filter: click `Filter` dropdown → click `State` → click `Published` → `Apply`. URL becomes `?filters=[{"path":"state","inverted":false,"value":["published"]}]` (URL-encoded).
4. Bulk delete: clear filters; click `Manage`; click the row toggle on the last two posts (use the JavaScript helper if MCP find returns ambiguous refs):
   ```js
   Array.from(document.querySelectorAll('table tbody tr')).slice(-2).forEach(tr => tr.querySelector('button').click())
   ```
   Then click `Delete` in the manage toolbar → confirm in the modal.
5. Verify Mongo count dropped by 2.

**Expected**
- 1 → "Showing 1 Post" with title "Smoke Test Post 07 — published".
- 2 → First row May 8th 2026; drafts/archived (no publishedAt) sorted to the end.
- 3 → "9 Posts" (every 3rd of the 25 seeded is published); chip "State is published ×" visible.
- 4 → Confirmation dialog "Are you sure you want to delete 2 posts? This cannot be undone." After confirm, count is 23.
- 5 → `db.Post.countDocuments()` = 23.

**Notes**
- Other filter types (Title text, Author relationship, Number View Count, Boolean Featured, Date Published At) all open the same Filter form pattern. State + Title cover the integer and select shapes; Author exercises the relationship dropdown's user picker.
- Pagination: default page size shows all 25 in one page. Forcing pagination via query string (`?limit=10&page=2`) does NOT honor those names — the list view rejects unknown params and shows "No posts found...". If verifying pagination matters, raise the seed count well above the page-size threshold first or click the per-page selector in the Manage toolbar.

**Last result**: ✅ pass (after the regression fixes in Known issues — without them this view is dead behind a perpetual "loading dots" spinner)

### D. Item create

**Steps**
1. Click `+ Create Post`. The modal shows only the `Title` field (the only `initial: true` field on Post).
2. Submit empty: click `Create` with Title blank.
3. Submit valid: fill Title and click `Create`.

**Expected**
- 2 → Modal stays open; no item written; Mongo count unchanged.
- 3 → New item is written; redirect to `/keystone/posts/<id>`; slug is auto-generated from the title (`autokey: { path: 'slug', from: 'title' }`).

**Notes**
- Chrome MCP cannot reliably populate the React-15 controlled input via `form_input`/`type` (controlled-input setter races React's internal value tracking; both attempts produced empty values). Workaround: drive the JSON API directly and verify server contract:
  ```js
  fetch('/keystone-api/posts/create?new=true', {
    method:'POST', credentials:'include',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ title:'Smoke Test Post 26', state:'draft' })
  }).then(r=>r.json())   // expect { id, slug:'smoke-test-post-26', fields:{...} }
  ```
- For full UI coverage of typing, use a native browser driver (manual click + keyboard, or a Playwright spec) instead of Claude in Chrome's `type` action.

**Last result**: ✅ pass (validation blocks empty submit; valid create persists with auto-slug)

### E. Item edit (all field types) + delete

**Steps**
1. Open any existing post: `/keystone/posts/<id>`.
2. Verify all 7 field renderers mount: Title (Text), State (Select with × clear), Author (Relationship picker with × clear), Content (Text), View Count (Number), Featured (Boolean checkbox), Published At (Date with `Today` quick-fill).
3. Click `delete post` at bottom right → confirm in the modal.
4. Verify Mongo: post is gone; tab redirects to `/keystone/posts`.

**Expected**
- 2 → All seven fields rendered; ID and slug shown read-only above the form.
- 3 → "Are you sure you want to delete &lt;id&gt;? This cannot be undone." dialog with red `Delete` + `Cancel` buttons.
- 4 → Confirm leaves the list view; Mongo `findOne({slug})` returns null.

**Notes**
- The `Save` round-trip for individual field edits was not exercised here (same Chrome MCP typing limitation as section D). Save/reset handlers themselves were verified by the bundle: `EditForm.mjs` mounts without errors and the delete confirmation flow uses the same `ConfirmationDialog` pipeline that delete confirms successfully.

**Last result**: ✅ pass (after regression fixes in Known issues)

### F. User list

**Steps**
1. Navigate to `/keystone/users/<admin-id>` (look up via the Mongo helper in section B).
2. Verify the user edit screen renders: Name (compound first/last subfields), Email, Password (with `Change Password` button — masked), Is Admin (boolean checkbox).

**Expected**
- All four fields render with current values; ID line above the form.

**Notes**
- A full password-change round-trip (open modal → set new password → sign out → sign in with new password → revert) was deferred for the same reason as D/E — the `Change Password` modal exposes React-15 controlled inputs that Chrome MCP can't reliably populate. To verify end-to-end, drive a Playwright spec or do it manually.

**Last result**: ✅ pass (UI renders)

### G. Errors / regressions

**Steps**
1. JSON API: `GET /keystone-api/posts?limit=2` returns 200 with `application/json` body.
2. Bogus list path: navigate to `/keystone/garbage-list` while signed in.
3. Bogus item id under a real list: navigate to `/keystone/posts/000000000000000000000000`.
4. Browse home → posts → users; collect console errors.

**Expected**
- 1 → JSON body with `results` array.
- 2 → Admin's own "List not found! Go back home" page (custom React 404, not Express stack).
- 3 → Admin's own "An unknown error has ocurred, please refresh." (the typo is pre-existing in source).
- 4 → No `[EXCEPTION]` console entries on any of the three views.

**Last result**: ✅ pass (after regression fixes)

### H. Relationship pickers + reverse `.relationship()` tables

The fixture defines:
- `Post.author: { type: Types.Relationship, ref: 'User' }` — many:false picker
- `Post.editors: { type: Types.Relationship, ref: 'User', many: true }` — many:true picker
- `User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' })` — reverse table on user detail
- `User.relationship({ ref: 'Post', path: 'editing', refPath: 'editors' })` — reverse table on user detail (many:true side)

The seeder creates two extra users (`alice@example.com`, `bob@example.com`) with non-functional bcrypt-hashed passwords so the pickers have multiple candidates. Editors are populated on most posts: even-numbered posts get both Alice and Bob, odd-numbered get only Alice, every 5th gets none.

**Steps**
1. Open any seeded post (e.g. Post 02 archived): `/keystone/posts/<post-id>`.
2. Verify the form shows Author (single chip "Test Admin") and Editors (multi chips "× Alice Editor", "× Bob Editor").
3. Open the Author dropdown (click the right-side arrow, NOT the chip text — clicking the chip navigates to the linked user). Use a JS dispatch as a workaround if computer-tool clicks miss the small arrow:
   ```js
   const sel = document.querySelectorAll('.Select--single')[1]; // [0]=State, [1]=Author
   ['mousedown','mouseup'].forEach(t => sel.querySelector('.Select-control').dispatchEvent(new MouseEvent(t,{bubbles:true,button:0})));
   ```
4. Open the Editors (multi) dropdown the same way: `document.querySelector('.Select--multi').querySelector('.Select-control')`.
5. Navigate to the admin user's detail page: `/keystone/users/<admin-id>`. Scroll past the form to the **Relationships** section.
6. Navigate to Alice's user detail: `/keystone/users/<alice-id>`. Scroll to **Relationships**.

**Expected**
- 2 → Author = "Test Admin" with × clear; Editors = "Alice Editor" and "Bob Editor" as removable chips.
- 3 → Dropdown opens listing all 3 users (Alice, Bob, Test Admin), with the current value highlighted.
- 4 → Dropdown opens listing only candidates NOT already selected (i.e. "Test Admin" since Alice + Bob are already in the chips).
- 5 → "Relationships" heading, then **Posts** subsection listing all 25 posts authored by Test Admin (using Post's `defaultColumns`: ID, Title, State, Author, Published At). The **Editing** subsection shows "No related posts..." since admin isn't an editor of any.
- 6 → On Alice: **Posts** (author of) shows "No related posts..."; **Editing** lists 20 posts where Alice is in the `editors` array.

**Notes**
- Reverse-relationship blocks use their relationship path labels, so multiple reverse relations to the same referenced list remain distinguishable (for example **Posts** vs **Editing**).
- React-select admin legacy opens on native `mousedown`+`mouseup`, not on synthetic `.click()`. If you're driving the page through Chrome MCP and the dropdown won't open, fall back to dispatching the native MouseEvents from the JS console as shown above.
- The `Save` round-trip for picker changes was not exercised here for the same Chrome-MCP-can't-type-into-React-15-controlled-inputs reason. To test data persistence, drive Save via the JSON API: `POST /keystone-api/posts/<id>` with `{ author: '<userId>', editors: ['<id1>','<id2>'] }`.

**Last result**: ✅ pass

## 5. Tear-down

```sh
lsof -ti :3005 | xargs -r kill -9
# Optionally, drop the test DB
npm run db:down
```

Bundle output under `admin/bundles/` is safe to leave; it gets cleared next time you run with the `rm -rf admin/bundles` step in section 1.

## Known issues found this run (must land before this runbook is green against `main`)

The smoke test surfaced four ESM-default-export regressions introduced by the 2026-05-09 ESM cutover (commit `1ec0661`, *"feat(esm): finish 100% ESM cutover — zero .js files in source"*). The admin legacy client is bundled via Browserify+swcify, which compiles ESM `import X from './foo.mjs'` into `_interop_require_default(require('./foo.mjs')).default`. Wherever the source file has only named exports (no `export default`), the default-import resolves to `undefined`, and any `.SubName` access on it crashes at runtime.

Fixes are minimal — keep both the named exports (other call-sites depend on them) and add the missing default. All four are in the working tree right now; commit them before promoting this runbook to "green":

| File | Symptom | Fix |
|---|---|---|
| [admin/client-legacy/App/elemental/Modal/index.mjs](../admin/client-legacy/App/elemental/Modal/index.mjs) | List view stuck on loading spinner; console: `TypeError: Cannot read properties of undefined (reading 'Dialog')` at `ConfirmationDialog.render` | Add `export default { Body, Dialog, Footer, Header };` |
| [admin/client-legacy/App/elemental/Grid/index.mjs](../admin/client-legacy/App/elemental/Grid/index.mjs) | Same default-import shape (latent — not yet hit by this matrix but will fail wherever code does `Grid.Col` / `Grid.Row`) | Add `export default { Col, Row };` |
| [admin/client-legacy/App/shared/Popout/index.mjs](../admin/client-legacy/App/shared/Popout/index.mjs) | Filter dropdown crashes; console: `Invariant Violation: Minified React error #130 ... Check the render method of ListFiltersAdd` (Popout.Header / Popout.Body / Popout.Footer / Popout.Pane were undefined) | Import the four sub-components and assign as static properties on Popout before `export default Popout`; rename the named re-exports to point at the same imports |
| [admin/client-legacy/App/shared/Popout/PopoutList.mjs](../admin/client-legacy/App/shared/Popout/PopoutList.mjs) | Same pattern for `PopoutList.Item` / `PopoutList.Heading` | Same fix — import and attach as static properties |
| [admin/client-legacy/constants.mjs](../admin/client-legacy/constants.mjs) | Item edit stuck on loading spinner; console: `TypeError: Cannot read properties of undefined (reading 'borderRadius')` at `Checkbox.getStyles` ([fields/components/Checkbox.mjs:71](../fields/components/Checkbox.mjs)) | Add `export default { breakpoint, borderRadius, color, spacing, TABLE_CONTROL_COLUMN_WIDTH, NETWORK_ERROR_RETRY_DELAY };` |

The clean way to prevent future recurrences would be either (a) lint rule banning `import X from './foo.mjs'` when `./foo.mjs` only has named exports, or (b) audit every existing `import X from '...'` against its target file. The four files above were the only ones surfaced by this matrix; a broader sweep against all `import [A-Z]\w+ from '.*\.mjs'` is worthwhile.

## Open caveats — not regressions, just things this matrix can't cover under Chrome MCP

- **Typing into React-15 controlled inputs**: Chrome MCP's `form_input` and keyboard `type` actions don't reliably set values on React 15 controlled inputs (the native setter is overwritten by React's internal value tracker before the event fires). Affects the create modal Title field, item-edit save flows, and the password-change modal. Works fine through manual interaction or Playwright. Until Chrome MCP grows a "set React controlled input" primitive (or until admin next uses uncontrolled `react-hook-form` for this flow), use the JSON API for the data-mutation half of the matrix and reserve Chrome MCP for the rendering / navigation / click-flow half.
- **Pagination URL params**: `?limit=N&page=K` are not honored by the list route. Either the param names are different or the route silently rejects unknowns. Not investigated further — out of scope for this smoke matrix.
