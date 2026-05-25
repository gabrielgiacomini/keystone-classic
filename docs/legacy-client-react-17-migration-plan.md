# Legacy Client React 17 Migration Plan

Last updated: 2026-05-23

Branch: `migration/react-17`

## Purpose

This document is the working plan for migrating Keystone Classic's legacy admin
client from React 16.14 to React 17.0.2 while preserving current legacy admin
behavior.

React 17 is the next migration checkpoint, not the final destination. It is
valuable because it moves the root runtime past React 16 and validates the
legacy client against React's changed event delegation behavior. It does not
finish the admin-next peer dependency cleanup because TanStack packages still
require React 18 or newer.

The migration must keep these surfaces working:

- Admin legacy app at `/keystone`.
- Admin legacy signin page.
- Admin legacy field type components and filters.
- Field explorer.
- Runtime Browserify middleware and prebuilt legacy bundles.
- Public compatibility for custom field components that depend on packages
  exposed through `packages.js`.
- Existing API, server rendering, and test fixture behavior.
- Admin-next build behavior through the existing React 18 aliases.

## Target Outcome

The React 17 milestone is complete when:

- Root `react` and `react-dom` resolve to `17.0.2`.
- Legacy admin bundles compile through Browserify and SWC.
- Legacy admin pages mount without fatal render errors.
- `npm ls react react-dom` does not report invalid direct peer dependencies
  except for explicitly documented admin-next React 18 peer conflicts that are
  isolated from the legacy client runtime.
- React 17 event behavior is verified for popouts, modals, portals, lightboxes,
  dropdowns, native document/window listeners, drag/drop, filters, and form
  submission.
- Existing e2e coverage for auth, home, list, item edit, create, filters,
  relationship fields, upload fields, modal/popout behavior, and parity passes.
- The React 18 alias workaround remains untouched unless the migration plan is
  intentionally expanded.

## Non-Goals

- Do not convert the legacy app to hooks.
- Do not replace React Router 3 unless peer dependency strategy explicitly
  chooses that larger migration.
- Do not replace Redux 3, redux-saga, or react-router-redux unless required by
  verified React 17 breakage.
- Do not move the legacy app to Vite or Webpack.
- Do not target React 18 or React 19 in this milestone.
- Do not remove `react18` or `react-dom18` aliases used by admin-next.
- Do not switch to the new JSX transform in this milestone.
- Do not convert app entrypoints from `ReactDOM.render` to `createRoot`; that
  is a React 18 migration task.

## Why React 17 Next

React 17 was designed as a stepping-stone release. It has fewer application API
changes than React 16 or React 18, but it changes where React attaches event
listeners. React 16 delegates most synthetic events through `document`; React 17
delegates through each React root container.

That matters for this codebase because the legacy admin has:

- Multiple React roots (`admin`, `signin`, field explorer).
- Detached roots created by custom portal implementations.
- Native `document` and `window` event listeners.
- Popouts and modals that depend on outside-click and keyboard behavior.
- Field controls that mix React events with imperative DOM access.
- Drag/drop, lightbox, and dropdown libraries from the React 15/16 era.

React 17 is therefore the correct next checkpoint before React 18. It lets us
find event-boundary problems and remaining peer dependency issues before
introducing React 18's `createRoot`, automatic batching, and stricter
development behavior.

## Current State Inventory

The current branch starts after the React 16 migration.

Root runtime dependencies:

| Package | Current |
| --- | ---: |
| `react` | `^16.14.0` |
| `react-dom` | `^16.14.0` |

Resolved lockfile versions:

| Package | Resolved | Current peer status |
| --- | ---: | --- |
| `react` | `16.14.0` | Root runtime. |
| `react-dom` | `16.14.0` | Peers `react@^16.14.0`. |
| `create-react-class` | `15.7.0` | Keep while `create-react-class` components remain. |
| `prop-types` | `15.8.1` | Keep. |
| `react-transition-group` | removed | Legacy `CSSTransitionGroup` call sites now use a local compatibility component. |
| `react-day-picker` | removed | Date fields and filters now use a local DayPicker-compatible component. |
| `react-router` | `3.2.6` | Peers React 0.14/15/16 only. React 17 blocker unless forked or replaced. |
| `react-redux` | `5.1.2` | Peers React 0.14/15/16 only. Upgrade or fork. |
| `react-router-redux` | `4.0.8` | No direct blocking peer in current audit, but coupled to React Router 3 and Redux routing behavior. |
| `react-select` | `1.3.0` | Peers React 0.14/15/16 only. React 17 blocker unless forked or replaced. |
| `react-dnd` | `2.6.0` | Peer `react: *`. Keep and test drag sorting. |
| `react-dnd-html5-backend` | `2.6.0` | No blocking React peer in current audit. |
| `react-images` | removed | Cloudinary fields now use a local lightbox component. |
| `react-color` | `2.19.3` | Peer `react: *`. Keep and test color field. |
| `react-markdown` | removed | Field explorer readmes now use a local `marked`-backed component. |
| `react-engine` | `4.5.1` | Peers React 15/16 only. React 17 blocker for test/e2e server rendering unless forked, removed, or replaced. |
| `enzyme` | `3.11.0` | Keep. |
| `enzyme-adapter-react-16` | `1.15.8` | Replace with a React 17 adapter. |
| `@tiptap/react` | `3.23.4` | Supports React 17/18/19. React 17 satisfies this peer. |
| `@tanstack/react-query` | `5.100.9` | Requires React 18/19. React 17 does not satisfy this peer. |
| `@tanstack/react-router` | `1.169.2` | Requires React 18/19. React 17 does not satisfy this peer. |
| `react18` | `npm:react@^18.3.1` | Keep for admin-next aliasing. |
| `react-dom18` | `npm:react-dom@^18.3.1` | Keep for admin-next aliasing. |

## Dependency Strategy

React 17 itself is a small runtime upgrade:

```sh
npm install react@^17.0.2 react-dom@^17.0.2
```

The harder part is the peer dependency surface around old packages. Do not
force the runtime upgrade and leave peers unexplained. Choose one explicit
strategy per package.

### Required Package Decisions

| Package | Recommended React 17 action | Notes |
| --- | --- | --- |
| `react-router@3.2.6` | Fork or package-alias the same runtime with a React 17 peer range. | A React Router 3 to 5 migration is larger than this checkpoint. Keep route semantics stable. |
| `react-redux@5.1.2` | Prefer upgrade to `react-redux@^7.2.9`; fallback is a peer-range fork of v5. | `connect` remains available in v7. Test `Provider`, route sync, and connected screens. |
| `react-router-redux@4.0.8` | Keep initially. | Verify `syncHistoryWithStore`, `routerReducer`, `routerMiddleware`, `push`, and `replace`. |
| `react-transition-group@1.2.1` | Replaced with a local compatibility component. | Current code no longer imports `react-transition-group/CSSTransitionGroup`. |
| `react-select@1.3.0` | Prefer a peer-range fork for React 17; consider a later v5 migration for React 18 readiness. | v5 supports React 18 but has a much larger API/styling migration. |
| `react-images@0.5.19` | Replaced with a small local lightbox. | Used only by Cloudinary image fields; covered by media upload/lightbox e2e. |
| `react-engine@4.5.1` | Fork peer range or remove/replace if only test fixtures need it. | Current usage is `test/e2e/server.mjs`. Do not break server rendering tests. |
| `enzyme-adapter-react-16` | Replace with `@wojtekmaj/enzyme-adapter-react-17`. | This is an unofficial adapter but is the practical Enzyme 3 path for React 17. |

### Dependency Commands

Recommended first dependency edit after the React 16 baseline is green:

```sh
npm uninstall enzyme-adapter-react-16
npm install --save-dev @wojtekmaj/enzyme-adapter-react-17@^0.8.0
```

Then update `test/enzyme.setup.cjs`:

```js
const Enzyme = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

Enzyme.configure({ adapter: new Adapter() });
```

React 17 runtime install should happen only after the peer blocker decisions
above are implemented or intentionally documented:

```sh
npm install react@^17.0.2 react-dom@^17.0.2
```

Verify:

```sh
npm ls react react-dom --depth=3
npm ls react-router react-redux react-router-redux react-transition-group \
  react-select react-images react-engine enzyme @wojtekmaj/enzyme-adapter-react-17 --depth=1
```

### Implemented Package Strategy

Current branch implementation, recorded 2026-05-23:

| Package | Strategy | Fork source | Fork version | Runtime code change | Rollback path |
| --- | --- | --- | --- | --- | --- |
| `react-router` | Local peer-range fork. | `react-router@3.2.6` copied from the resolved npm package into `vendor/react17-peer-forks/react-router`. | `3.2.6-react17.0` | None. Package metadata only; dev-only files are pruned. | Restore dependency to `^3.0.2` and remove the local fork. |
| `react-redux` | Upgrade to a React 17-compatible release. | Published npm package. | `7.2.9` | Yes, package runtime upgrade. Legacy `Provider` and `connect` imports are preserved. | Revert dependency to `^5.0.6` or replace with a peer-range fork of v5 if regression tests require it. |
| `react-transition-group` | Removed. | `CSSTransitionGroup` usage is covered by `admin/client-legacy/App/shared/CSSTransitionGroup.mjs`. | n/a | Removes the old peer-range fork. | No rollback planned. |
| `react-select` | Local peer-range fork. | `react-select@1.3.0` copied from the resolved npm package into `vendor/react17-peer-forks/react-select`. | `1.3.0-react17.0` | Metadata only for `react-select`; its `react-input-autosize` helper is also forked for a React 17 peer range. | Restore dependency to `^1.2.4` and remove the local forks. |
| `react-input-autosize` | Local transitive peer-range fork for `react-select`. | `react-input-autosize@2.2.2` copied from the resolved npm package into `vendor/react17-peer-forks/react-input-autosize`. | `2.2.2-react17.0` | None. Package metadata only. | Restore `react-select` dependency on the published helper. |
| `react-images` | Removed. | Cloudinary fields use `fields/components/Lightbox.mjs`. | n/a | Removes the old fork and its portal/scroll-lock helper path. | No rollback planned; keep e2e lightbox coverage. |
| `react-scrolllock` | Removed. | Was only retained for the old `react-images` fork path. | n/a | No remaining built-in owner. | No rollback planned. |
| `react-prop-toggle` | Removed. | Was only retained for the old `react-scrolllock` fork path. | n/a | No remaining built-in owner. | No rollback planned. |
| `react-lifecycles-compat` | Removed. | Was only retained for the old vendored `react-images` transition helper path. | n/a | No remaining built-in owner. | No rollback planned. |
| `react-engine` | Local peer-range fork. | `react-engine@4.5.1` copied from the resolved npm package into `vendor/react17-peer-forks/react-engine`. | `4.5.1-react17.0` | None. Package metadata only; used by the e2e server fixture surface. | Restore dev dependency to `^4.5.1` and remove the local fork. |
| `enzyme-adapter-react-16` | Replaced. | Published `@wojtekmaj/enzyme-adapter-react-17`. | `0.8.0` | Test adapter change only. | Restore `enzyme-adapter-react-16` and `test/enzyme.setup.cjs` if rolling back to React 16. |

The local forks intentionally preserve the original package names so
`packages.js` and custom legacy field bundles can continue resolving the public
compatibility names documented below.

## React API and Risk Inventory

Generated from the current post-React-16 tree with:

```sh
rg -l "React\\.createClass" admin/client-legacy fields | wc -l
rg -o "React\\.createClass" admin/client-legacy fields | wc -l
rg -l "React\\.PropTypes|import .*PropTypes.* from ['\\\"]react" admin/client-legacy fields | wc -l
rg -o "React\\.PropTypes|import .*PropTypes.* from ['\\\"]react" admin/client-legacy fields | wc -l
rg -l "ref=\\\"|this\\.refs|refs\\." admin/client-legacy fields | wc -l
rg -o "ref=\\\"|this\\.refs|refs\\." admin/client-legacy fields | wc -l
rg -l "findDOMNode" admin/client-legacy fields | wc -l
rg -o "findDOMNode" admin/client-legacy fields | wc -l
rg -l "componentWill(Mount|ReceiveProps|Update)|UNSAFE_componentWill(Mount|ReceiveProps|Update)" admin/client-legacy fields | wc -l
rg -o "componentWill(Mount|ReceiveProps|Update)|UNSAFE_componentWill(Mount|ReceiveProps|Update)" admin/client-legacy fields | wc -l
rg -l "contextTypes|childContextTypes|getChildContext" admin/client-legacy fields | wc -l
rg -o "contextTypes|childContextTypes|getChildContext" admin/client-legacy fields | wc -l
rg -l "document\\.addEventListener|window\\.addEventListener|addEventListener\\(" admin/client-legacy fields | wc -l
rg -o "document\\.addEventListener|window\\.addEventListener|addEventListener\\(" admin/client-legacy fields | wc -l
rg -l "stopPropagation|preventDefault|persist\\(" admin/client-legacy fields | wc -l
rg -o "stopPropagation|preventDefault|persist\\(" admin/client-legacy fields | wc -l
```

| Pattern | Files | Occurrences | React 17 impact |
| --- | ---: | ---: | --- |
| `React.createClass` | 0 | 0 | Already migrated in the React 16 work. |
| `React.PropTypes` / `PropTypes from react` | 0 | 0 | Already migrated in the React 16 work. |
| String refs / `this.refs` | 52 | 143 | Still works, but remains a React 18+ cleanup target. |
| `findDOMNode` | 18 | 47 | Still works outside StrictMode, but remains a React 18+ cleanup target. |
| `componentWill*` / `UNSAFE_componentWill*` lifecycles | 19 | 24 | Works, but should not expand. Refactor when touching files. |
| Legacy context APIs | 15 | 22 | Works in React 17, but blocks long-term modernization. |
| Native event listeners | 12 | 17 | High-priority React 17 event regression surface. |
| `stopPropagation` / `preventDefault` / `persist` | 13 | 20 | High-priority React 17 event regression surface. |

## ReactDOM Root Inventory

React 17 still uses `ReactDOM.render`; do not move app entrypoints to
`createRoot` in this milestone. However, detached roots are high-risk because
React 17 event delegation is root-scoped.

Files that render React roots:

- `admin/client-legacy/App/index.mjs`
  - Main admin legacy root.
  - Uses `ReactDOM.render`.
- `admin/client-legacy/Signin/index.mjs`
  - Signin root.
  - Uses `ReactDOM.render`.
- `fields/explorer/index.mjs`
  - Field explorer root.
  - Uses `ReactDOM.render`.
- `admin/client-legacy/App/shared/Portal.mjs`
  - Detached root for popouts/lightbox behavior.
  - Uses `ReactDOM.render` from `componentDidUpdate`.
- `admin/client-legacy/App/elemental/Portal/index.mjs`
  - Detached root for Elemental portal behavior.
  - Uses `render` imported from `react-dom`.

Recommended React 17 handling:

- Keep main app, signin, and field explorer entrypoints on `ReactDOM.render`.
- Prefer converting detached portal roots to `ReactDOM.createPortal` before or
  during React 17 stabilization if tests cover popout and lightbox behavior.
- If detached roots are left as-is, add explicit e2e/manual checks for click,
  keyboard, focus, and context behavior inside those detached roots.

Do not use React 18 `createRoot` yet.

## Event-Sensitive Inventory

React 17 event delegation can expose bugs where native event listeners and
React synthetic events interact. The following files need targeted review and
regression tests.

### Native Event Listener Files

- `admin/client-legacy/App/components/Navigation/Mobile/index.mjs`
- `admin/client-legacy/App/components/Navigation/Primary/index.mjs`
- `admin/client-legacy/App/components/Navigation/Secondary/index.mjs`
- `admin/client-legacy/App/elemental/Modal/dialog.mjs`
- `admin/client-legacy/App/elemental/ResponsiveText/index.mjs`
- `admin/client-legacy/App/screens/Item/components/AltText.mjs`
- `admin/client-legacy/App/screens/Item/components/FooterBar.mjs`
- `admin/client-legacy/App/screens/List/components/ListSort.mjs`
- `admin/client-legacy/App/shared/CreateForm.mjs`
- `admin/client-legacy/App/shared/Popout/index.mjs`
- `fields/components/Checkbox.mjs`
- `fields/types/select/SelectFilter.mjs`

### Propagation and Default-Prevention Files

- `admin/client-legacy/App/components/Navigation/Primary/NavItem.mjs`
- `admin/client-legacy/App/components/Navigation/Secondary/index.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/Filter.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAddForm.mjs`
- `admin/client-legacy/App/screens/List/index.mjs`
- `admin/client-legacy/App/shared/CreateForm.mjs`
- `admin/client-legacy/Signin/Signin.mjs`
- `fields/components/DateInput.mjs`
- `fields/mixins/ArrayField.mjs`
- `fields/types/cloudinaryimage/CloudinaryImageField.mjs`
- `fields/types/cloudinaryimages/CloudinaryImagesField.mjs`
- `fields/types/color/ColorField.mjs`
- `fields/types/markdown/lib/bootstrap-markdown.mjs`

Event-specific checks:

- Outside-click closes popouts and modals.
- Inside-click does not close popouts and modals.
- Escape closes modals, popouts, and lightboxes where supported.
- Enter submits signin and date input flows only where expected.
- Native document listeners are removed on unmount.
- Nested React roots do not swallow or duplicate events.
- `event.persist()` assumptions are removed if they become unnecessary.
- `onScroll` behavior is manually checked where scroll handlers exist because
  React 17 aligns scroll behavior more closely with the browser.

## Remaining Legacy API Inventory

These are not hard blockers for React 17, but they should be tracked because
they are React 18 and StrictMode risk areas.

### String Ref and `this.refs` Files

- `admin/client-legacy/App/components/Footer/index.mjs`
- `admin/client-legacy/App/components/Footer/test/component.test.mjs`
- `admin/client-legacy/App/components/Navigation/Secondary/test/NavItem.test.mjs`
- `admin/client-legacy/App/elemental/Modal/dialog.mjs`
- `admin/client-legacy/App/screens/Item/components/EditForm.mjs`
- `admin/client-legacy/App/screens/Item/components/EditFormHeader.mjs`
- `admin/client-legacy/App/screens/Item/components/EditFormHeaderSearch.mjs`
- `admin/client-legacy/App/screens/Item/components/FooterBar.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/Filter.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAdd.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAddForm.mjs`
- `admin/client-legacy/App/screens/List/components/ListSort.mjs`
- `admin/client-legacy/App/screens/List/components/UpdateForm.mjs`
- `admin/client-legacy/App/screens/List/index.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutPane.mjs`
- `admin/client-legacy/App/shared/Popout/index.mjs`
- `admin/client-legacy/Signin/Signin.mjs`
- `admin/client-legacy/Signin/components/Brand.mjs`
- `admin/client-legacy/Signin/components/test/Brand.test.mjs`
- `fields/components/DateInput.mjs`
- `fields/components/HiddenFileInput.d.mts`
- `fields/components/HiddenFileInput.mjs`
- `fields/components/test/ItemTableValue.test.mjs`
- `fields/explorer/index.html`
- `fields/mixins/ArrayField.mjs`
- `fields/types/Field.mjs`
- `fields/types/cloudinaryimage/CloudinaryImageField.mjs`
- `fields/types/cloudinaryimages/CloudinaryImagesField.mjs`
- `fields/types/code/CodeField.mjs`
- `fields/types/color/ColorField.mjs`
- `fields/types/date/DateField.mjs`
- `fields/types/date/DateFilter.mjs`
- `fields/types/datearray/DateArrayFilter.mjs`
- `fields/types/datetime/DatetimeField.mjs`
- `fields/types/email/EmailField.mjs`
- `fields/types/file/FileField.mjs`
- `fields/types/geopoint/GeoPointField.mjs`
- `fields/types/geopoint/GeoPointFilter.mjs`
- `fields/types/localfiles/LocalFilesField.mjs`
- `fields/types/location/LocationFilter.mjs`
- `fields/types/markdown/MarkdownField.mjs`
- `fields/types/markdown/lib/bootstrap-markdown.mjs`
- `fields/types/money/MoneyField.mjs`
- `fields/types/number/NumberField.mjs`
- `fields/types/number/NumberFilter.mjs`
- `fields/types/numberarray/NumberArrayFilter.mjs`
- `fields/types/password/PasswordField.mjs`
- `fields/types/relationship/RelationshipFilter.mjs`
- `fields/types/text/TextFilter.mjs`
- `fields/types/textarea/TextareaField.mjs`
- `fields/types/textarray/TextArrayFilter.mjs`
- `fields/types/url/UrlField.mjs`

### `findDOMNode` Files

- `admin/client-legacy/App/screens/Item/components/EditFormHeader.mjs`
- `admin/client-legacy/App/screens/Item/components/EditFormHeaderSearch.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAdd.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAddForm.mjs`
- `admin/client-legacy/App/screens/List/components/UpdateForm.mjs`
- `admin/client-legacy/App/screens/List/index.mjs`
- `fields/components/DateInput.mjs`
- `fields/mixins/ArrayField.mjs`
- `fields/types/Field.mjs`
- `fields/types/code/CodeField.mjs`
- `fields/types/date/DateFilter.mjs`
- `fields/types/datearray/DateArrayFilter.mjs`
- `fields/types/location/LocationFilter.mjs`
- `fields/types/number/NumberFilter.mjs`
- `fields/types/numberarray/NumberArrayFilter.mjs`
- `fields/types/relationship/RelationshipFilter.mjs`
- `fields/types/text/TextFilter.mjs`
- `fields/types/textarray/TextArrayFilter.mjs`

### Legacy Lifecycle Files

- `admin/client-legacy/App/elemental/Modal/dialog.mjs`
- `admin/client-legacy/App/elemental/ScrollLock/index.mjs`
- `admin/client-legacy/App/screens/Item/index.mjs`
- `admin/client-legacy/App/screens/List/index.mjs`
- `admin/client-legacy/App/shared/Popout/index.mjs`
- `fields/components/DateInput.mjs`
- `fields/explorer/components/FieldType.mjs`
- `fields/mixins/ArrayField.d.mts`
- `fields/mixins/ArrayField.mjs`
- `fields/types/Field.d.mts`
- `fields/types/Field.mjs`
- `fields/types/cloudinaryimage/CloudinaryImageField.mjs`
- `fields/types/cloudinaryimages/CloudinaryImagesField.mjs`
- `fields/types/code/CodeField.mjs`
- `fields/types/file/FileField.mjs`
- `fields/types/html/HtmlField.mjs`
- `fields/types/location/LocationField.mjs`
- `fields/types/relationship/RelationshipField.mjs`
- `fields/types/relationship/RelationshipFilter.mjs`

### Legacy Context Files

- `admin/client-legacy/App/elemental/Form/index.mjs`
- `admin/client-legacy/App/elemental/FormField/index.mjs`
- `admin/client-legacy/App/elemental/FormInput/index.mjs`
- `admin/client-legacy/App/elemental/FormLabel/index.mjs`
- `admin/client-legacy/App/elemental/FormSelect/index.mjs`
- `admin/client-legacy/App/elemental/GridCol/index.mjs`
- `admin/client-legacy/App/elemental/GridRow/index.mjs`
- `admin/client-legacy/App/elemental/Modal/dialog.mjs`
- `admin/client-legacy/App/elemental/Modal/header.mjs`
- `admin/client-legacy/App/elemental/PassContext/index.mjs`
- `admin/client-legacy/App/elemental/Portal/index.mjs`
- `admin/client-legacy/App/screens/Item/index.mjs`
- `admin/client-legacy/App/screens/List/index.mjs`
- `fields/explorer/components/Col.mjs`
- `fields/explorer/components/Row.mjs`

## Migration Phases

### Phase 0: React 16 Baseline

Goal: prove the starting point is known before changing dependencies.

Run:

```sh
git status -sb
git branch --show-current
npm ci
npm run build-dev
npm run build:server
npm run test:unit
npm run admin-next:build
npm run test:e2e-ui
npm run test:e2e-ui:fields
```

Record dependency state:

```sh
npm ls react react-dom --depth=3
npm ls react-router react-redux react-router-redux react-transition-group \
  react-select react-images react-engine enzyme enzyme-adapter-react-16 --depth=1
```

Acceptance:

- React 16 baseline checks are either green or failures are documented before
  source changes.
- Worktree is clean before dependency edits.

### Phase 1: Resolve Test Adapter and Peer Blocker Strategy

Goal: make peer dependency decisions before installing React 17.

Tasks:

1. Replace the Enzyme adapter:

   ```sh
   npm uninstall enzyme-adapter-react-16
   npm install --save-dev @wojtekmaj/enzyme-adapter-react-17@^0.8.0
   ```

2. Update `test/enzyme.setup.cjs`.

3. Decide package strategy for:

   - `react-router`
   - `react-redux`
   - `react-transition-group`
   - `react-select`
   - `react-images`
   - `react-engine`

4. For forked packages, document:

   - fork source
   - package version
   - peer range change
   - runtime code change, if any
   - rollback path

5. Run unit tests before runtime upgrade:

   ```sh
   npm run test:unit
   ```

Acceptance:

- Enzyme setup points at a React 17 adapter.
- Each React 17 peer blocker has an explicit upgrade, fork, replacement, or
  accepted temporary exception.
- No package is silently left invalid.

### Phase 2: Portal and Event Boundary Preparation

Goal: reduce React 17 event delegation risk before the runtime upgrade.

Tasks:

1. Review detached portal roots:

   - `admin/client-legacy/App/shared/Portal.mjs`
   - `admin/client-legacy/App/elemental/Portal/index.mjs`

2. Decide whether to convert detached `ReactDOM.render` portal roots to
   `ReactDOM.createPortal`.

   Preferred when covered by tests:

   - Convert to `createPortal`.
   - Preserve legacy context behavior.
   - Preserve `getPortalDOMNode`.
   - Preserve mount/unmount cleanup.
   - Preserve popout positioning and lightbox behavior.

   Conservative alternative:

   - Leave detached roots unchanged for the first React 17 install.
   - Add explicit tests/manual checks for event propagation and outside-click
     behavior across detached roots.

3. Review native event listener files listed above.

4. Confirm every listener added in mount/update is removed on unmount.

Acceptance:

- Portal strategy is documented in the migration commit.
- Popout/modal/lightbox behavior has explicit test or manual coverage.

### Phase 3: Install React 17

Goal: update the root runtime to React 17.0.2.

Run:

```sh
npm install react@^17.0.2 react-dom@^17.0.2
```

Then verify:

```sh
node -p "require('./package.json').dependencies.react + ' / ' + require('./package.json').dependencies['react-dom']"
npm ls react react-dom --depth=3
npm run build-dev
npm run build:server
npm run test:unit
npm run admin-next:build
```

Acceptance:

- Root `react` and `react-dom` are `^17.0.2`.
- Lockfile resolves both to `17.0.2`.
- Legacy admin bundles compile.
- Unit tests pass.
- Admin-next still builds through React 18 aliases.

Current evidence, 2026-05-23:

- `node -p "require('./package.json').dependencies.react + ' / ' + require('./package.json').dependencies['react-dom']"` returns `^17.0.2 / ^17.0.2`.
- `require('react/package.json').version` and `require('react-dom/package.json').version` both resolve to `17.0.2`.
- `npm ls react react-dom --depth=3` reports React 17 as invalid only through the documented admin-next React 18 requirements from `@tanstack/react-query`, `@tanstack/react-router`, and the `react-dom18` alias.
- `npm ls react-router react-redux react-router-redux react-transition-group react-select react-images react-engine enzyme @wojtekmaj/enzyme-adapter-react-17 --depth=1` resolves the legacy peer blockers to the chosen upgrade/forks and exits successfully.
- `npm run build-dev` passes.
- `npm run admin-next:build` passes.
- `npm run test:unit` passes with 1315 passing and 3 pending.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm run package:verify` passes.

### Phase 4: React 17 Functional Regression Pass

Goal: prove the migrated legacy client preserves behavior.

Run:

```sh
npm run lint
npm run typecheck
npm run build-dev
npm run build
npm run test:unit
npm run test:e2e-ui
npm run test:e2e-ui:fields
```

Targeted Playwright specs:

```sh
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/auth.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/home.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/list-view.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/item-create.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/item-edit.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/relationships.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/localfiles-field.spec.ts
playwright test --config=e2e-ui/playwright.fields.config.ts
```

Manual smoke checks:

- Sign in with correct credentials.
- Sign in with wrong credentials.
- Sign out.
- Open dashboard and verify list counts.
- Open list page.
- Search list.
- Sort list.
- Open create modal and create an item.
- Open item edit page and save.
- Delete item from item page.
- Bulk select and delete from list page.
- Open filters popout and apply filters.
- Add/remove list columns.
- Download CSV.
- Open relationship field dropdown and select/remove values.
- Exercise inverse relationship panels.
- Use date and datearray filters.
- Edit markdown, HTML, code, password, select, boolean, text, textarea, number,
  money, URL, email, key, name, location, geopoint, file, localfiles, Cloudinary
  image, and Cloudinary images fields.
- Verify Cloudinary image lightbox.
- Verify drag sorting for sortable lists and related item rows.
- Verify field explorer renders.

React 17 event-specific smoke checks:

- Opening a popout does not immediately close it.
- Clicking outside a popout closes it.
- Clicking inside a popout does not close it.
- Modal backdrop click behavior is unchanged.
- Escape key behavior is unchanged for modals/popouts/lightboxes.
- Relationship dropdown keyboard and click behavior is unchanged.
- Date picker day click, month navigation, and manual text entry work.
- Drag/drop row sorting still emits exactly one reorder action.
- Cloudinary lightbox opens, advances, closes, and does not trap the app.
- Mobile navigation open/close behavior is unchanged.

Browser console gate:

- Treat uncaught errors as failures.
- Treat React warnings introduced by the migration as failures unless listed in
  a warning allowlist with an owner.

Current evidence, 2026-05-23:

- `npm run test:e2e-ui` passes with 76 tests, including a browser drag of a
  sortable legacy list row that emits one numeric reorder request.
- `npm run test:e2e-ui:fields` passes with 77 tests.
- `e2e-ui/tests/react17-events.spec.ts` covers detached-root/popout click
  behavior, create modal Escape/backdrop behavior, confirmation modal
  Escape/backdrop behavior, mobile navigation open/inside/Escape behavior, the
  legacy field explorer React root, and sortable row drag/reorder behavior.
- `e2e-ui/tests/fields/media-upload.spec.ts` covers the legacy CloudinaryImage
  and CloudinaryImages lightbox: open, Escape close, next navigation, and close
  button behavior against the `react-images` fork.
- Existing e2e coverage continues to cover auth, dashboard counts, list search,
  list sort query behavior, filters, create/edit/delete, bulk delete
  confirmation dialogs, relationship dropdowns, inverse relationship panels,
  CSV/JSON download, field rendering, field round trips, markdown/HTML/code
  editors, media upload/clear, localfiles, and browser console gates.
- Sortable coverage now includes a browser-level sortable legacy list drag in
  `e2e-ui/tests/react17-events.spec.ts`, plus action/API/schema-plugin coverage
  in:
  `test/unit/admin/server/api/item-sort-order.test.mts`,
  `test/unit/lib/list/sortable.mts`, and legacy drag/drop action tests.

### Phase 5: Package and Public API Verification

Goal: preserve Keystone package consumers and runtime Browserify behavior.

Run:

```sh
npm run package:verify
npm pack --dry-run
```

Verify the package still includes:

- `dist/admin/public-legacy/js/packages.js`
- `dist/admin/public-legacy/js/fields.js`
- `dist/admin/public-legacy/js/signin.js`
- `dist/admin/public-legacy/js/admin.js`
- `dist/admin/client-legacy/**`
- `dist/admin/server/templates-legacy/**`

Verify package consumers can still import:

- `keystone`
- `keystone/admin/server`
- `keystone/fields/types/*`
- `keystone/fields/components/*`

Verify `packages.js` still exposes expected public package names:

- `react`
- `react-dom`
- `react-router`
- `react-router-redux`
- `react-redux`
- `react-select`
- `react-transition-group/CSSTransitionGroup`
- `react-images`
- `react-dnd`
- `react-dnd-html5-backend`

If any package is forked, aliased, or replaced, verify custom field bundles can
still resolve the original public package name unless compatibility is
intentionally removed and documented.

Current evidence, 2026-05-23:

- `npm run package:verify` passes and verifies `dist` plus
  `vendor/react17-peer-forks` publication coverage.
- `npm pack --dry-run` includes `vendor/react17-peer-forks`.
- Installing the generated tarball into a temporary consumer project with
  `npm install <tarball> --ignore-scripts` succeeds.
- The installed tarball resolves `react@17.0.2`, `react-dom@17.0.2`,
  `react-router@3.2.6-react17.0`, `react-select@1.3.0-react17.0`,
  `react-images@0.5.19-react17.0`, and
  `react-transition-group@1.2.1-react17.0`.
- The generated `dist/admin/public-legacy/js/packages.js` contains the expected
  public Browserify package names: `react`, `react-dom`, `react-router`,
  `react-router-redux`, `react-redux`, `react-select`,
  `react-transition-group/CSSTransitionGroup`, `react-images`, `react-dnd`, and
  `react-dnd-html5-backend`.

### Phase 6: React 18 Readiness Cleanup

Goal: leave the codebase positioned for the next major migration.

React 17 does not solve all peer conflicts:

- `@tiptap/react@3.x` is satisfied by React 17.
- `@tanstack/react-query@5` still requires React 18 or 19.
- `@tanstack/react-router@1` still requires React 18 or 19.

Track these before opening a React 18 branch:

- Replace or modernize packages that were only peer-forked for React 17.
- Convert detached portal roots to `createPortal` if not already done.
- Reduce string refs and `this.refs`.
- Reduce `findDOMNode`.
- Refactor remaining unsafe lifecycle methods.
- Reduce legacy context usage in Elemental wrappers.
- Plan the `ReactDOM.render` to `createRoot` conversion.
- Decide whether Enzyme remains acceptable or whether tests should move toward
  React Testing Library before React 18.

## Risk Areas and Preservation Notes

### React 17 Event Delegation

React 17 attaches event listeners to the root container instead of `document`.
This can affect code that uses both React synthetic events and native DOM
listeners. The most important behaviors to preserve are outside-click, Escape,
focus, blur, scroll, and form submission behavior.

### Detached Portal Roots

The legacy client has portal components that create separate React roots in
`document.body`. Separate roots are more visible under React 17's event model.
`createPortal` preserves the React tree relationship better than creating a
second root, but it must be tested carefully because these portals also preserve
legacy context and expose DOM nodes for positioning.

### React Router 3

React Router 3 has no published React 17-compatible peer range. A router rewrite
is higher risk than the React 17 checkpoint. Prefer a fork with no runtime code
change unless tests prove React Router 3 is incompatible at runtime.

### React Redux 5 to 7

React Redux 7 is a practical upgrade path and supports React 17. Test the
connected screens, `Provider`, and `react-router-redux` integration carefully.
If React Redux 7 changes behavior around subscriptions or context, fallback to
a peer-range fork of React Redux 5 for the React 17 checkpoint.

### React Select

`react-select@1` is used by list update flows and is exposed through
`packages.js`. A major upgrade changes styles and value handling. Prefer a
peer-range fork for React 17 unless a broader select-field regression budget is
available.

### React Images

`react-images` is used by Cloudinary image fields. There is no obvious
React 17-compatible release in the existing package line. A local replacement is
reasonable, but only if image lightbox behavior is covered by tests.

### Enzyme

Enzyme has no official React 17 adapter from the original package maintainers.
Use `@wojtekmaj/enzyme-adapter-react-17` for this milestone, keep the change in
its own commit, and treat Enzyme-specific failures separately from runtime app
failures.

### Admin-Next Peer Conflicts

React 17 improves the TipTap peer situation but does not satisfy TanStack. Do
not remove React 18 aliases in this milestone unless admin-next dependency
isolation is intentionally redesigned.

## Commit Strategy

Use small, reviewable commits:

1. Add React 17 migration plan document.
2. Replace Enzyme React 16 adapter with React 17 adapter.
3. Resolve peer blocker package strategy.
4. Convert or document portal event-boundary strategy.
5. Install React 17.
6. Fix React 17 event regressions.
7. Stabilize tests and package verification.
8. Add React 18 readiness notes discovered during migration.

Avoid combining dependency upgrades with source rewrites. If a test fails, the
owner should be obvious from the commit.

## Rollback Strategy

If React 17 breaks a legacy workflow:

1. Reproduce with a specific test or manual route.
2. Determine whether the failure comes from:
   - React runtime version.
   - Peer blocker package replacement/fork.
   - React Redux upgrade.
   - Portal event boundary behavior.
   - Native event listener behavior.
   - Enzyme adapter behavior.
   - Browserify package exposure.
3. Revert only the smallest commit that introduced the failure.
4. Keep runtime, package, portal, and test adapter changes separated so rollback
   does not remove unrelated progress.

Do not use `git reset --hard` during migration unless explicitly agreed.

## Definition of Done

React 17 migration is complete when:

- Root `react` and `react-dom` are `17.0.2`.
- `npm ls react react-dom --depth=3` is clean or has only documented,
  intentionally isolated admin-next React 18 peer conflicts.
- React 17 peer blockers have explicit upgrade, fork, replacement, or exception
  records.
- `test/enzyme.setup.cjs` uses a React 17 adapter.
- `npm run build-dev` passes.
- `npm run build` passes.
- `npm run test:unit` passes.
- `npm run test:e2e-ui` passes.
- `npm run test:e2e-ui:fields` passes.
- Legacy admin manual smoke checks pass.
- React 17 event-specific smoke checks pass.
- Browser console has no uncaught errors and no undocumented migration warnings.
- Package verification passes.
- `packages.js` public package names remain compatible or deviations are
  documented.
- React 18 readiness notes are added for any debt intentionally left behind.

## Reference Links

- React 17 release notes:
  https://legacy.reactjs.org/blog/2020/10/20/react-v17.html
- React 17 release candidate notes with event delegation details:
  https://legacy.reactjs.org/blog/2020/08/10/react-v17-rc.html
- React 18 upgrade guide for the next migration after React 17:
  https://react.dev/blog/2022/03/08/react-18-upgrade-guide
- React portals documentation:
  https://legacy.reactjs.org/docs/portals.html
- React refs and DOM documentation:
  https://legacy.reactjs.org/docs/refs-and-the-dom.html
- React legacy context documentation:
  https://legacy.reactjs.org/docs/legacy-context.html
- React legacy API reference:
  https://react.dev/reference/react/legacy
- React Transition Group documentation:
  https://reactcommunity.org/react-transition-group/
- Enzyme installation documentation:
  https://enzymejs.github.io/enzyme/docs/installation/index.html
- `@wojtekmaj/enzyme-adapter-react-17` package:
  https://www.npmjs.com/package/@wojtekmaj/enzyme-adapter-react-17
- React Router 3 package:
  https://www.npmjs.com/package/react-router/v/3.2.6
- React Redux package:
  https://www.npmjs.com/package/react-redux
- React Select package:
  https://www.npmjs.com/package/react-select
- React Images package:
  https://www.npmjs.com/package/react-images
