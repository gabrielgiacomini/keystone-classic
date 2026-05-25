# Legacy Client React 18 Migration Plan

Last updated: 2026-05-25

Branch: `master`

## Purpose

This document is the current roadmap for Keystone Classic's legacy admin client
on React 18.3.1. The package/runtime migration has landed on `master`; the
remaining work is stabilization, regression coverage, CI parity, and the
external `admin-parity` soak window.

React 18 is the first target that can remove the root/admin-next peer split.
The root package can satisfy `@tiptap/react`, `@tanstack/react-query`, and
`@tanstack/react-router` once `react` and `react-dom` are upgraded to 18.
However, React 18 is more than a peer dependency cleanup. It introduces the new
root API, automatic batching under `createRoot`, stricter development behavior,
and server rendering API changes. The migration must be treated as a runtime
behavior change, not only a package.json edit.

The earlier React 17-to-React 18 execution notes remain below for context, but
the source of truth for current work is the status section immediately below.

The migration must keep these surfaces working:

- Admin legacy app at `/keystone`.
- Admin legacy signin page.
- Admin legacy field type components and filters.
- Field explorer.
- Runtime Browserify middleware and prebuilt legacy bundles.
- Public compatibility for custom field components that depend on packages
  exposed through `packages.js`.
- Existing API, server rendering, and test fixture behavior.
- Admin-next build and runtime behavior without React 18 aliases.

## Target Outcome

The React 18 milestone is complete when:

- Root `react` and `react-dom` resolve to `18.3.1`.
- The `react18` and `react-dom18` npm aliases are removed.
- `admin/client-next` builds against the root React 18 packages without Vite
  aliasing.
- Legacy admin browser entrypoints use `createRoot` from `react-dom/client`.
- Legacy detached portal rendering no longer uses deprecated
  `ReactDOM.render`.
- Legacy admin bundles compile through Browserify and SWC.
- Legacy admin pages mount without fatal render errors.
- `npm ls react react-dom --depth=3` is clean or any remaining invalid peer is
  intentionally documented with an owner and removal plan.
- React 18 automatic batching behavior is verified for async actions, popouts,
  filters, date pickers, drag/drop, upload fields, and relationship fields.
- Existing e2e coverage for auth, home, list, item edit, create, filters,
  relationship fields, upload fields, modal/popout behavior, and parity passes.
- Browser console has no React 18 migration warnings from our code.

## Current Status

As of 2026-05-25, the repository is on React 18 at the root:

- `react` and `react-dom` are `^18.3.1`.
- `/keystone` serves the restored legacy React 18 admin shell.
- `/keystone-next` serves the modern admin shell.
- The legacy admin source roots are present and intentionally active:
  `admin/client-legacy/App`, `admin/client-legacy/Signin`,
  `admin/server/routes-legacy`, and `admin/public-legacy`.
- The prior "legacy client decommission" route policy is superseded. The active
  product goal is legacy-admin parity on React 18, not legacy shell removal.

Recent `master` commits restored and hardened the legacy React 18 surface:

- `29bf2ee3` restored legacy admin parity on React 18.
- `49f7bd7d` fixed legacy date picker layout.
- `bfa3bad2` fixed date picker interactions, including month navigation, day
  selection, manual entry, `Now`, DateArray, and date filters.
- `ee801942` fixed the legacy no-default-column item route.
- `6e4835ec` restored legacy horizontal field label/control layout.
- `c77f853f` restored inline datetime controls so the date input, time input,
  and `Now` button render side by side.

Current local verification evidence:

- `npx playwright test --config=e2e-ui/playwright.config.ts`: 45 passing.
- `npx playwright test --config=e2e-ui/playwright.fields.config.ts`: 78 passing
  before `c77f853f`; after `c77f853f`, the field-complete legacy spacing audit
  passed.
- `npm run package:verify`: passing after the latest legacy datetime inline
  control fix.
- Live probes confirmed the restored no-default-column route, legacy field
  label/control spacing, and `Reviewed At` datetime controls.

Open gates before calling the React 18 legacy-admin stabilization complete:

- Rerun the full field-complete suite after `c77f853f`.
- Run the canonical `admin-parity` job on `master` without direct-push bypasses.
- Restart the 14-day clean `admin-parity` soak window after CI is green on the
  current `master` head.
- Keep the direct-push bypasses from `49f7bd7d` through `c77f853f` recorded as
  non-soak evidence; they do not satisfy the protected required-check window.

## Non-Goals

- Do not target React 19.
- Do not convert the legacy app to hooks.
- Do not replace React Router 3 unless the peer-fork strategy fails under
  React 18 runtime tests.
- Do not replace Redux 3, redux-saga, or react-router-redux unless required by
  verified React 18 breakage.
- Do not move the legacy app to Vite or Webpack.
- Do not switch the legacy client to the new JSX transform.
- Do not add `<StrictMode>` around the legacy admin root in the first React 18
  migration pass.
- Do not broaden the admin-next feature set during this migration.
- Do not rewrite unrelated UI, field, or server behavior.

## Why React 18 Now

React 16 removed APIs that the legacy client used directly. React 17 was the
event-delegation checkpoint. React 18 is the point where the root runtime can
match the newer admin client's requirements.

Current admin-next dependencies require React 18 or newer:

- `@tanstack/react-query@5.100.9` peers `react@^18 || ^19`.
- `@tanstack/react-router@1.169.2` peers `react@>=18.0.0 || >=19.0.0` and
  `react-dom@>=18.0.0 || >=19.0.0`.
- `@tiptap/react@3.23.4` peers React 17, 18, or 19, so it is already satisfied
  by React 17 but remains compatible with React 18.

Moving root React to 18 lets the repo remove the `react18`/`react-dom18` alias
workaround and makes npm peer resolution easier. The main risk shifts to legacy
runtime behavior, especially roots, portals, automatic batching, old package
forks, and tests.

## React 18 Behavior Changes That Matter Here

### New Client Root API

React 18 deprecates `ReactDOM.render`. If the app keeps using
`ReactDOM.render`, React logs a warning and the app behaves as if it is running
React 17. A real React 18 migration must use `createRoot` from
`react-dom/client`.

Required changes:

- Main legacy admin root: `admin/client-legacy/App/index.mjs`.
- Signin root: `admin/client-legacy/Signin/index.mjs`.
- Field explorer root: `fields/explorer/index.mjs`.
- Detached portal roots: `admin/client-legacy/App/shared/Portal.mjs` and
  `admin/client-legacy/App/elemental/Portal/index.mjs`.

### Automatic Batching

Automatic batching is enabled for updates under `createRoot`. Updates from
promises, timeouts, native event handlers, and other async sources may batch
together where React 17 would have rendered separately. This can affect code
that expects the DOM or component state to be updated immediately after a
`setState` call.

High-risk areas:

- List query/action flows.
- Item save/delete flows.
- Signin submit flow.
- Popout open/close and outside-click behavior.
- Date and datearray filters.
- Relationship field search/select behavior.
- Cloudinary image upload and lightbox behavior.
- Drag/drop row sorting.

Use `flushSync` only for proven DOM-read-after-update problems. Do not add it
preemptively.

### StrictMode

React 18 adds a development-only StrictMode check that simulates unmounting and
remounting components while preserving state. The legacy client still has
string refs, `findDOMNode`, legacy context, and unsafe lifecycle methods, so
wrapping the legacy admin root in `<StrictMode>` would add noise and risk.

Do not add StrictMode around the legacy root in the first React 18 migration.
StrictMode hardening should be a follow-up track after the app is stable on
React 18.

Admin-next already uses StrictMode in `admin/client-next/src/main.tsx`; keep
that behavior unless a verified React 18 issue requires a targeted adjustment.

### Server Rendering APIs

React 18 deprecates `renderToNodeStream` and introduces streaming APIs such as
`renderToPipeableStream`. This repo does not currently call
`renderToNodeStream`, but the vendored `react-engine` fork uses
`renderToString` and `renderToStaticMarkup`. Those still work with React 18 but
have limited Suspense support. Since these server rendering paths are test/e2e
support surfaces, update the peer range and verify tests rather than rewriting
server rendering in this milestone.

### Type Definitions

This repo already has React 18 type packages:

- `@types/react@^18.3.28`
- `@types/react-dom@^18.3.7`

Keep the type target on React 18. Do not jump to React 19 types. If npm updates
within React 18 are desired, use `@types/react@^18.3.29` and
`@types/react-dom@^18.3.7` based on the current npm inventory.

### Browser Requirements

React 18 drops Internet Explorer support and depends on modern browser features
such as `Promise`, `Symbol`, and `Object.assign`. The legacy client already uses
modern build tooling and browser tests, but this must be treated as an explicit
compatibility decision. If IE support is required, the project should stay on
React 17.

## Current State Inventory

The current branch starts after the React 17 migration.

Root runtime dependencies:

| Package | package.json | Lockfile |
| --- | ---: | ---: |
| `react` | `^17.0.2` | `17.0.2` |
| `react-dom` | `^17.0.2` | `17.0.2` |

Admin-next alias dependencies:

| Package | package.json | Lockfile |
| --- | ---: | ---: |
| `react18` | `npm:react@^18.3.1` | `18.3.1` |
| `react-dom18` | `npm:react-dom@^18.3.1` | `18.3.1` |

These aliases should be removed after root React is upgraded to 18.3.1.

Current admin-next alias site:

- `admin/client-next/vite.config.ts`
  - Resolves `react` to `react18`.
  - Resolves `react-dom` to `react-dom18`.
  - Comment still describes keeping old root React for the legacy Browserify
    bundle. That becomes obsolete in React 18 and must be updated.

Admin-next React root:

- `admin/client-next/src/main.tsx`
  - Already imports `createRoot` from `react-dom/client`.
  - Already wraps admin-next in `<StrictMode>`.

## Current Dependency Inventory

Installed versions are from the current React 17 lockfile.

| Package | Current | React 18 status | Required action |
| --- | ---: | --- | --- |
| `react` | `17.0.2` | Root runtime target is React 18. | Upgrade to `^18.3.1`. |
| `react-dom` | `17.0.2` | Root runtime target is React 18. | Upgrade to `^18.3.1`. |
| `react18` | `18.3.1` alias | Alias workaround becomes obsolete. | Remove from devDependencies. |
| `react-dom18` | `18.3.1` alias | Alias workaround becomes obsolete. | Remove from devDependencies. |
| `create-react-class` | `15.7.0` | No blocking peer. | Keep until createReactClass components are refactored later. |
| `prop-types` | `15.8.1` | No blocking peer. | Keep. |
| `react-day-picker` | removed | Date fields and filters now use a local DayPicker-compatible component. | Removed during legacy client modernization. |
| `react-router` | `file:vendor/react17-peer-forks/react-router` | Fork peers through React 17 only. | Extend fork peer range to React 18 or replace router. Prefer fork for this milestone. |
| `react-redux` | `7.2.9` | Supports React 18. | Keep. Do not jump to v9 unless also upgrading Redux. |
| `react-router-redux` | `4.0.8` | No direct React peer in current audit. | Keep, verify route sync. |
| `react-transition-group` | removed | Legacy `CSSTransitionGroup` call sites now use a local compatibility component. | Removed during legacy client modernization. |
| `react-select` | `file:vendor/react17-peer-forks/react-select` | Fork peers through React 17 only. | Extend fork peer range and nested fork peers, or migrate to v5. Prefer fork for this milestone. |
| `react-input-autosize` | vendored fork | Fork peers through React 17 only. | Extend fork peer range if still pulled by `react-select`. |
| `react-prop-toggle` | removed | Was only retained for the old `react-images` fork path. | Removed during legacy client modernization. |
| `react-scrolllock` | removed | Was only retained for the old `react-images` fork path. | Removed during legacy client modernization. |
| `react-images` | removed | Cloudinary fields now use a local lightbox component. | Removed during legacy client modernization. |
| `react-dnd` | `2.6.0` | Peer `react: *`. | Keep, test drag sorting. |
| `react-dnd-html5-backend` | `2.6.0` | No blocking peer in current audit. | Keep, test drag sorting. |
| `react-color` | `2.19.3` | Peer `react: *`. | Keep, test color field. |
| `react-markdown` | removed | Field explorer readmes now use a local `marked`-backed component. | Removed during legacy client modernization. |
| `react-engine` | `file:vendor/react17-peer-forks/react-engine` | Fork peers through React 17 only. | Extend fork peer range to React 18, verify e2e server. |
| `enzyme` | `3.11.0` | Enzyme itself can stay, adapter must change. | Keep initially. |
| `@wojtekmaj/enzyme-adapter-react-17` | `0.8.0` | React 17 adapter only. | Replace with `@cfaester/enzyme-adapter-react-18`. |
| `@tiptap/react` | `3.23.4` | Supports React 18. | Keep. |
| `@tanstack/react-query` | `5.100.9` | Requires React 18/19. | Root React 18 resolves this peer. |
| `@tanstack/react-router` | `1.169.2` | Requires React 18/19. | Root React 18 resolves this peer. |

## Vendored React 17 Peer Forks

These local packages were introduced to get React 17 peer ranges without broad
runtime rewrites. React 18 migration must revisit every one of them.

| Local package | Version | Current peer range | React 18 action |
| --- | ---: | --- | --- |
| `vendor/react17-peer-forks/react-router` | `3.2.6-react17.0` | React 0.14/15/16/17 | Extend to React 18 or replace router. |
| `vendor/react17-peer-forks/react-transition-group` | removed | Replaced by local `CSSTransitionGroup` compatibility component. |
| `vendor/react17-peer-forks/react-select` | `1.3.0-react17.0` | React 0.14/15/16/17 | Extend to React 18 or migrate to v5. |
| `vendor/react17-peer-forks/react-images` | removed | Replaced by local Cloudinary lightbox. |
| `vendor/react17-peer-forks/react-engine` | `4.5.1-react17.0` | React 15/16/17 | Extend to React 18 or remove/replace. |
| `vendor/react17-peer-forks/react-input-autosize` | `2.2.2-react17.0` | React 0.14/15/16/17 | Extend to React 18 if retained. |
| `vendor/react17-peer-forks/react-prop-toggle` | removed | Old `react-images` helper no longer used. |
| `vendor/react17-peer-forks/react-scrolllock` | removed | Old `react-images` helper no longer used. |

Conservative recommendation:

- Rename the fork directory to `vendor/react-peer-forks` or add a parallel
  `vendor/react18-peer-forks` directory so the package names no longer imply
  React 17 only.
- Keep runtime code unchanged in the first React 18 pass unless a test proves a
  runtime incompatibility.
- Change package versions to `*-react18.0` when peer ranges change.
- Document each peer-only fork in the commit message.

Do not silently leave React 17-only peer ranges in local forks after root React
is upgraded.

## React API and Risk Inventory

Generated from the current React 17 tree with:

```sh
rg -l "ReactDOM\\.render|import \\{[^}]*\\brender\\b[^}]*\\} from ['\\\"]react-dom['\\\"]|import ReactDOM from ['\\\"]react-dom['\\\"]" admin/client-legacy fields test e2e-ui | wc -l
rg -o "ReactDOM\\.render|import \\{[^}]*\\brender\\b[^}]*\\} from ['\\\"]react-dom['\\\"]|import ReactDOM from ['\\\"]react-dom['\\\"]" admin/client-legacy fields test e2e-ui | wc -l
rg -l "unmountComponentAtNode" admin/client-legacy fields test e2e-ui | wc -l
rg -o "unmountComponentAtNode" admin/client-legacy fields test e2e-ui | wc -l
rg -l "hydrate\\(" admin/client-legacy fields test e2e-ui | wc -l
rg -o "hydrate\\(" admin/client-legacy fields test e2e-ui | wc -l
rg -l "renderToNodeStream" admin/client-legacy fields test e2e-ui | wc -l
rg -o "renderToNodeStream" admin/client-legacy fields test e2e-ui | wc -l
rg -l "ref=\\\"|this\\.refs|refs\\." admin/client-legacy fields test e2e-ui | wc -l
rg -o "ref=\\\"|this\\.refs|refs\\." admin/client-legacy fields test e2e-ui | wc -l
rg -l "findDOMNode" admin/client-legacy fields test e2e-ui | wc -l
rg -o "findDOMNode" admin/client-legacy fields test e2e-ui | wc -l
rg -l "componentWill(Mount|ReceiveProps|Update)|UNSAFE_componentWill(Mount|ReceiveProps|Update)" admin/client-legacy fields test e2e-ui | wc -l
rg -o "componentWill(Mount|ReceiveProps|Update)|UNSAFE_componentWill(Mount|ReceiveProps|Update)" admin/client-legacy fields test e2e-ui | wc -l
rg -l "contextTypes|childContextTypes|getChildContext" admin/client-legacy fields test e2e-ui | wc -l
rg -o "contextTypes|childContextTypes|getChildContext" admin/client-legacy fields test e2e-ui | wc -l
rg -l "document\\.addEventListener|window\\.addEventListener|addEventListener\\(" admin/client-legacy fields test e2e-ui | wc -l
rg -o "document\\.addEventListener|window\\.addEventListener|addEventListener\\(" admin/client-legacy fields test e2e-ui | wc -l
rg -l "setTimeout|Promise\\.|then\\(|async |await " admin/client-legacy fields test e2e-ui | wc -l
rg -o "setTimeout|Promise\\.|then\\(|async |await " admin/client-legacy fields test e2e-ui | wc -l
```

| Pattern | Files | Occurrences | React 18 impact |
| --- | ---: | ---: | --- |
| `ReactDOM.render` / `render` from `react-dom` | 5 | 9 | Deprecated. Must migrate to `createRoot` or `createPortal`. |
| `unmountComponentAtNode` | 0 | 0 | No direct blocker. Use `root.unmount` if introduced. |
| `hydrate(` | 0 | 0 | No direct blocker. Use `hydrateRoot` only if hydration is introduced. |
| `renderToNodeStream` | 0 | 0 | No direct blocker. |
| String refs / `this.refs` | 54 | 147 | Works without StrictMode, but blocks StrictMode hardening. |
| `findDOMNode` | 20 | 51 | Works outside StrictMode, but blocks StrictMode hardening. |
| `componentWill*` / `UNSAFE_componentWill*` | 21 | 24 | Works, but StrictMode surfaces lifecycle debt. |
| Legacy context APIs | 15 | 22 | Works, but keep contained. |
| Native event listeners | 14 | 17 | Automatic batching and portal changes can affect behavior. |
| Async/promise/timer patterns | 150 | 2509 | Broad batching risk; focus on app/field runtime files first. |

## React Root Inventory

Files that must be touched by the root API pass:

- `admin/client-legacy/App/index.mjs`
  - Main admin legacy SPA root.
  - Replace `ReactDOM.render` with `createRoot`.
- `admin/client-legacy/Signin/index.mjs`
  - Signin page root.
  - Replace `ReactDOM.render` with `createRoot`.
- `fields/explorer/index.mjs`
  - Field explorer root.
  - Replace `ReactDOM.render` with `createRoot`.
- `admin/client-legacy/App/shared/Portal.mjs`
  - Detached portal root for popout/lightbox behavior.
  - Replace `ReactDOM.render` with `createPortal` or a managed `createRoot`.
- `admin/client-legacy/App/elemental/Portal/index.mjs`
  - Detached Elemental portal root.
  - Replace `render` imported from `react-dom` with `createPortal` or a managed
    `createRoot`.

Preferred top-level root pattern:

```js
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('react-root');
if (!rootElement) {
  throw new Error('Legacy admin root element not found');
}

createRoot(rootElement).render(
  <Provider store={store}>
    {/* app */}
  </Provider>
);
```

Do not wrap the legacy root in `<StrictMode>` during the first React 18 pass.

If the same root can be initialized more than once in development, add a small
local helper that stores the root on the DOM node or a module-level variable.
Do not call `createRoot` multiple times for the same DOM container.

## Portal Migration Strategy

React 18 deprecates `ReactDOM.render`, including detached render calls used by
portal-like components.

Preferred strategy:

- Convert detached roots to `createPortal` from `react-dom`.
- Preserve `getPortalDOMNode`.
- Preserve legacy context behavior.
- Preserve DOM node creation and removal.
- Preserve popout positioning and lightbox behavior.
- Add tests/manual checks for inside-click, outside-click, Escape, and focus.

Example shape for class/createReactClass components:

```js
import { createPortal } from 'react-dom';

componentDidMount() {
  this.portalElement = document.createElement('div');
  document.body.appendChild(this.portalElement);
  this.forceUpdate();
}

componentWillUnmount() {
  document.body.removeChild(this.portalElement);
}

render() {
  if (!this.portalElement) return null;
  return createPortal(<div {...this.props} />, this.portalElement);
}
```

Fallback strategy if `createPortal` changes behavior:

- Use `createRoot` from `react-dom/client` to manage the detached DOM node.
- Store the root on the component instance.
- Call `root.render(...)` in `componentDidMount` and `componentDidUpdate`.
- Call `root.unmount()` before removing the node.
- Document why `createPortal` was not used.

Avoid leaving `ReactDOM.render` in portal code.

## Async and Automatic Batching Inventory

React 18 automatic batching can change behavior anywhere code schedules state
updates through promises, timers, native events, or async actions. The full
pattern count is broad, so use this focused runtime list first:

- `admin/client-legacy/App/screens/Home/actions.mjs`
- `admin/client-legacy/App/screens/Item/actions.mjs`
- `admin/client-legacy/App/screens/List/actions/items.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDropZoneTarget.mjs`
- `admin/client-legacy/Signin/Signin.mjs`
- `fields/types/cloudinaryimages/CloudinaryImagesField.mjs`
- `fields/types/date/DateFilter.mjs`
- `fields/types/datearray/DateArrayFilter.mjs`
- `fields/types/markdown/lib/bootstrap-markdown.mjs`
- `fields/types/number/NumberFilter.mjs`
- `fields/types/relationship/RelationshipField.mjs`
- `fields/types/relationship/RelationshipFilter.mjs`

Also audit these non-browser or test-support files if related failures appear:

- `fields/explorer/server.mjs`
- `fields/types/cloudinary/CloudinaryType.mts`
- `fields/types/cloudinary/test/type.mts`
- `fields/types/relationship/test/filters.mts`
- `fields/types/relationship/test/type.mts`

Testing focus:

- Code that calls `setState` and then immediately reads DOM measurements.
- Code that calls `setState` and then expects a ref to exist immediately.
- Code that relies on sequential renders during promises or timers.
- Popout positioning after open/close.
- Date picker month/day updates.
- Relationship search response rendering.
- Upload progress and post-upload preview rendering.
- Drag/drop hover/drop state.

Use `flushSync` only if a concrete test proves the code requires synchronous
DOM commit before the next line.

## Native Event Listener Inventory

These files need targeted checks because React 18 batching and portal changes
can affect native listener ordering:

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

Checks:

- Every listener added on mount/update is removed on unmount.
- Outside-click behavior still closes the right surface.
- Inside-click behavior does not close the active surface.
- Escape closes only the active modal/popout/lightbox.
- Window resize listeners do not leak.
- Navigation listeners do not duplicate after route transitions.

## Remaining StrictMode Debt Inventory

These are not blockers for a React 18 migration without legacy StrictMode, but
they must be tracked because they block future StrictMode hardening.

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

### Phase 0: React 17 Baseline

Goal: prove the starting point is known before React 18 changes.

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
  react-select react-day-picker react-images react-engine enzyme \
  @wojtekmaj/enzyme-adapter-react-17 react18 react-dom18 --depth=1
```

Acceptance:

- React 17 baseline checks are green or failures are documented before source
  changes.
- Worktree is clean before dependency edits.
- Any known flaky tests have issue notes or retry evidence.

### Phase 1: Prepare React 18 Peer Strategy

Goal: eliminate known React 18 peer blockers before installing React 18.

Tasks:

1. Decide whether to rename `vendor/react17-peer-forks` or add a parallel
   React 18 fork directory.

2. Update peer ranges for conservative forks:

   - `react-router`
   - `react-transition-group`
   - `react-select`
   - `react-input-autosize`
   - `react-prop-toggle`
   - `react-images`
   - `react-engine`

3. Resolve `react-day-picker@7.4.10`:

   Preferred for this milestone:

   - Vendor/fork v7 with React 18 peer range.
   - Keep the existing API and CSS behavior.
   - Verify `showMonth`, modifiers, and custom class names.

   Alternative:

   - Replaced with a local DayPicker-compatible component.
   - Add `date-fns` peer/dependency.
   - Rewrite date field and datearray filter usage for v8 API changes.
   - Treat as a larger date-field migration commit.

4. Replace Enzyme adapter:

   ```sh
   npm uninstall @wojtekmaj/enzyme-adapter-react-17
   npm install --save-dev @cfaester/enzyme-adapter-react-18@^0.8.0
   ```

5. Update `test/enzyme.setup.cjs`:

   ```js
   const Enzyme = require('enzyme');
   const Adapter = require('@cfaester/enzyme-adapter-react-18');

   globalThis.IS_REACT_ACT_ENVIRONMENT = true;
   Enzyme.configure({ adapter: new Adapter() });
   ```

6. Run tests before root React changes:

   ```sh
   npm run test:unit
   npm run build-dev
   ```

Acceptance:

- Every React 18 peer blocker has an explicit upgrade, fork, replacement, or
  documented temporary exception.
- Test setup no longer references the React 17 Enzyme adapter.
- No runtime React 18 install has happened yet.

### Phase 2: Upgrade Root Runtime and Remove Aliases

Goal: make React 18 the root runtime and remove the admin-next alias workaround.

Tasks:

1. Install root React 18:

   ```sh
   npm install react@^18.3.1 react-dom@^18.3.1
   ```

2. Remove aliases:

   ```sh
   npm uninstall react18 react-dom18
   ```

3. Keep React 18 type packages:

   ```sh
   npm install --save-dev @types/react@^18.3.29 @types/react-dom@^18.3.7
   ```

   If npm resolves the existing compatible versions, do not churn the lockfile
   unnecessarily.

4. Update `admin/client-next/vite.config.ts`:

   - Remove `createRequire` and `path.dirname(require.resolve(...))` alias
     setup for `react18` and `react-dom18`.
   - Remove `resolve.alias.react` and `resolve.alias['react-dom']`.
   - Optionally add `resolve.dedupe: ['react', 'react-dom']` if Vite reports
     duplicate React copies.
   - Update the stale comment about root React being kept old for legacy
     Browserify.

5. Verify package resolution:

   ```sh
   npm ls react react-dom --depth=3
   npm ls @tiptap/react @tanstack/react-query @tanstack/react-router --depth=1
   rg "react18|react-dom18" package.json package-lock.json admin/client-next
   npm run admin-next:build
   ```

Acceptance:

- `package.json` root `react` and `react-dom` are `^18.3.1`.
- `package-lock.json` resolves root React packages to `18.3.1`.
- `react18` and `react-dom18` are gone from package manifests.
- Admin-next builds against root React 18.
- TanStack and TipTap peers are satisfied by root React.

### Phase 3: Convert Legacy Entrypoints to `createRoot`

Goal: stop running legacy admin entrypoints in React 17 compatibility mode.

Tasks:

1. Convert `admin/client-legacy/App/index.mjs`.

   - Replace `import ReactDOM from 'react-dom'` with
     `import { createRoot } from 'react-dom/client'`.
   - Validate `document.getElementById('react-root')`.
   - Call `createRoot(rootElement).render(...)`.
   - Do not add StrictMode.

2. Convert `admin/client-legacy/Signin/index.mjs`.

   - Replace `ReactDOM.render`.
   - Validate `document.getElementById('signin-view')`.
   - Preserve `from` sanitization and props.

3. Convert `fields/explorer/index.mjs`.

   - Replace `ReactDOM.render`.
   - Validate `document.getElementById('explorer')`.
   - Preserve router behavior.

4. Run:

   ```sh
   rg "ReactDOM\\.render|import ReactDOM from ['\\\"]react-dom['\\\"]|import \\{[^}]*\\brender\\b[^}]*\\} from ['\\\"]react-dom['\\\"]" admin/client-legacy fields
   npm run build-dev
   npm run test:unit
   ```

Acceptance:

- Top-level legacy entrypoints use `createRoot`.
- No top-level legacy root logs the React 18 `ReactDOM.render` warning.
- Legacy admin, signin, and field explorer still mount.

### Phase 4: Convert Detached Portal Rendering

Goal: remove deprecated render calls inside detached portal components.

Tasks:

1. Convert `admin/client-legacy/App/shared/Portal.mjs`.

   Preferred:

   - Import `createPortal` from `react-dom`.
   - Create the DOM node in `componentDidMount`.
   - Call `forceUpdate` after creating the node.
   - Return `createPortal(<div {...this.props} />, this.portalElement)` from
     `render`.
   - Preserve `getPortalDOMNode`.
   - Remove `ReactDOM.render`.

2. Convert `admin/client-legacy/App/elemental/Portal/index.mjs`.

   Preferred:

   - Import `createPortal` from `react-dom`.
   - Preserve the `PassContext` wrapper.
   - Preserve `Portal.contextTypes`.
   - Remove `render` import from `react-dom`.

3. Test portal behavior:

   ```sh
   npm run build-dev
   npm run test:unit
   playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/list-view.spec.ts
   playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/item-create.spec.ts
   playwright test --config=e2e-ui/playwright.fields.config.ts e2e-ui/tests/fields/media-upload.spec.ts
   ```

Acceptance:

- `rg "ReactDOM\\.render|import \\{[^}]*\\brender\\b[^}]*\\} from ['\\\"]react-dom['\\\"]" admin/client-legacy fields` returns no matches.
- Popouts, modals, and Cloudinary lightboxes still work.
- No detached DOM nodes leak after close/unmount.

### Phase 5: React 18 Runtime Stabilization

Goal: address behavior changes caused by `createRoot` and automatic batching.

Tasks:

1. Run focused tests for async/batching surfaces:

   ```sh
   playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/auth.spec.ts
   playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/list-view.spec.ts
   playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/item-edit.spec.ts
   playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/relationships.spec.ts
   playwright test --config=e2e-ui/playwright.fields.config.ts e2e-ui/tests/fields/field-filter-column.spec.ts
   playwright test --config=e2e-ui/playwright.fields.config.ts e2e-ui/tests/fields/media-upload.spec.ts
   playwright test --config=e2e-ui/playwright.fields.config.ts e2e-ui/tests/fields/relationship-variants.spec.ts
   ```

2. If failures appear, inspect for:

   - `setState` followed by immediate DOM reads.
   - Popout positioning after state changes.
   - Focus code running before a ref/DOM node exists.
   - Promise/timer updates that are now batched.
   - Native listener updates that are now batched.

3. Use `flushSync` only where a focused regression proves it is necessary.

4. Capture a console warning allowlist only for third-party warnings that cannot
   be fixed in this milestone.

Acceptance:

- No app-owned React 18 runtime warning remains.
- Every behavioral fix has a corresponding test or documented manual check.

### Phase 6: Full Functional Regression Pass

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
- Verify admin-next still mounts, routes, signs in, and renders HTML/Tiptap
  fields.

React 18-specific smoke checks:

- No `ReactDOM.render is no longer supported in React 18` warning appears.
- No duplicate React copy warning appears.
- Popout open/close behavior is unchanged under `createRoot`.
- Modal backdrop and Escape behavior is unchanged.
- Relationship dropdown keyboard and click behavior is unchanged.
- Date picker day click, month navigation, manual text entry, and datearray
  between mode work.
- Drag/drop row sorting emits exactly one reorder action.
- Cloudinary upload preview appears after upload.
- Cloudinary lightbox opens, advances, closes, and does not trap the app.
- Browser console has no uncaught errors.

### Phase 7: Package and Public API Verification

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

### Phase 8: Optional StrictMode Hardening

Goal: document what remains before the legacy client can run cleanly in
StrictMode.

This is not required for the first React 18 migration. If time allows, run a
temporary local StrictMode experiment after the main migration is green:

1. Wrap only a small subtree or test entrypoint in `<StrictMode>`.
2. Capture warnings for:
   - string refs
   - `findDOMNode`
   - legacy context
   - unsafe lifecycles
   - side effects in render
   - mount/unmount assumptions
3. Do not commit StrictMode wrapping unless the warning set is low and
   intentionally accepted.
4. Add follow-up issues or checklist entries for each remaining warning family.

## Risk Areas and Preservation Notes

### Root API Ordering

`createRoot(...).render(...)` does not accept the old render callback. This repo
does not currently use the callback form, so top-level conversions are
straightforward. Do not introduce callback assumptions.

### Automatic Batching

React 18 can batch updates from promises, timers, and native listeners. If code
opens a popout, sets state, and immediately reads DOM geometry, the read may
need to move to `componentDidUpdate`, a callback ref, or a narrow `flushSync`.
Prefer lifecycle/ref fixes over `flushSync`.

### Date Picker

`react-day-picker@7.4.10` is a new React 18 peer blocker. A v8 migration adds
API and `date-fns` changes. The safer React 18 milestone path is a v7 peer
fork, followed by a later date picker modernization.

Tests must cover:

- `DateInput` focus opens the picker.
- Selecting a day writes the formatted value.
- Typing a valid date and pressing Enter updates state.
- Invalid date text does not submit.
- Date filters apply on/after/before/between modes.
- Datearray between mode alternates active inputs correctly.

### Portal Context and Events

`createPortal` changes detached rendering from separate-root rendering to
same-tree portal rendering. This is usually the correct React model, but it can
change event bubbling and context behavior. The `PassContext` wrapper in the
Elemental portal must remain until legacy context is retired.

### React Select

The current `react-select` dependency is a fork of v1. v5 supports React 18 and
19, but the migration is large because styles, value shape, async behavior, and
internal dependencies changed. Prefer a React 18 peer fork for this milestone.

### React Router 3

React Router 3 does not publish a React 18-compatible peer range. A router
rewrite would be larger than the React 18 runtime migration. Prefer extending
the existing fork peer range if runtime tests pass.

### React Images

`react-images` has no stable React 18-compatible package line in the current
audit. A local lightbox replacement is viable, but only with complete
Cloudinary image and Cloudinary images regression coverage.

### Enzyme

React 18 Enzyme support relies on an unofficial adapter. Keep adapter changes
isolated from runtime changes. If Enzyme failures are severe, either:

- keep shallow tests on Enzyme with the React 18 adapter and add e2e coverage
  for behavior, or
- start a separate test migration to React Testing Library.

Do not mix a broad test framework migration into the initial React 18 runtime
commit.

### Admin-Next Alias Removal

Once root React is 18, keeping `react18` and `react-dom18` aliases is more risk
than value. Duplicate React copies can break hooks and context. Remove aliases
and make Vite resolve root React unless a verified blocker requires a temporary
exception.

## Commit Strategy

Use small, reviewable commits:

1. Add React 18 migration plan document.
2. Prepare React 18 peer forks or replacements.
3. Replace Enzyme React 17 adapter with React 18 adapter.
4. Upgrade root React and ReactDOM to 18.3.1.
5. Remove `react18` and `react-dom18` aliases and update admin-next Vite config.
6. Convert top-level legacy entrypoints to `createRoot`.
7. Convert detached portal rendering away from `ReactDOM.render`.
8. Fix React 18 automatic batching/runtime regressions.
9. Stabilize tests and package verification.
10. Add StrictMode debt notes discovered during migration.

Avoid combining dependency upgrades, root API conversions, portal rewrites, and
test adapter changes in one commit. If a test fails, the owner should be clear.

## Rollback Strategy

If React 18 breaks a legacy workflow:

1. Reproduce with a specific test or manual route.
2. Determine whether the failure comes from:
   - root React runtime version
   - removed admin-next aliases
   - peer fork package changes
   - Enzyme adapter
   - top-level `createRoot`
   - detached portal conversion
   - automatic batching
   - Browserify package exposure
3. Revert only the smallest commit that introduced the failure.
4. Keep root install, alias removal, createRoot conversion, and portal
   conversion separated so rollback does not remove unrelated progress.

Do not use `git reset --hard` during migration unless explicitly agreed.

## Definition of Done

React 18 migration is complete when:

- Root `react` and `react-dom` are `18.3.1`.
- `react18` and `react-dom18` aliases are removed from `package.json` and
  `package-lock.json`.
- `admin/client-next/vite.config.ts` no longer aliases React to React 18 package
  names.
- `npm ls react react-dom --depth=3` is clean or any remaining invalid peer is
  documented with an owner.
- `rg "ReactDOM\\.render|import ReactDOM from ['\\\"]react-dom['\\\"]|import \\{[^}]*\\brender\\b[^}]*\\} from ['\\\"]react-dom['\\\"]" admin/client-legacy fields`
  returns no matches.
- Top-level legacy roots use `createRoot`.
- Detached portal components no longer call deprecated render APIs.
- Enzyme setup uses a React 18 adapter.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build-dev` passes.
- `npm run build` passes.
- `npm run test:unit` passes.
- `npm run test:e2e-ui` passes.
- `npm run test:e2e-ui:fields` passes.
- Legacy admin manual smoke checks pass.
- React 18-specific smoke checks pass.
- Admin-next builds and runs against root React 18.
- Browser console has no uncaught errors and no undocumented React 18 warnings.
- Package verification passes.
- StrictMode debt is either reduced or explicitly documented for follow-up.

## Reference Links

- React 18 upgrade guide:
  https://react.dev/blog/2022/03/08/react-18-upgrade-guide
- React 18 release overview:
  https://react.dev/blog/2022/03/29/react-v18
- `createRoot` API reference:
  https://react.dev/reference/react-dom/client/createRoot
- `hydrateRoot` API reference:
  https://react.dev/reference/react-dom/client/hydrateRoot
- `flushSync` API reference:
  https://react.dev/reference/react-dom/flushSync
- React StrictMode reference:
  https://react.dev/reference/react/StrictMode
- React 18 server streaming API:
  https://react.dev/reference/react-dom/server/renderToPipeableStream
- React portals documentation:
  https://legacy.reactjs.org/docs/portals.html
- React refs and DOM documentation:
  https://legacy.reactjs.org/docs/refs-and-the-dom.html
- React legacy context documentation:
  https://legacy.reactjs.org/docs/legacy-context.html
- Enzyme installation documentation:
  https://enzymejs.github.io/enzyme/docs/installation/index.html
- `@cfaester/enzyme-adapter-react-18` package:
  https://www.npmjs.com/package/@cfaester/enzyme-adapter-react-18
- React Day Picker v8 documentation:
  https://daypicker.dev/v8
- React Transition Group documentation:
  https://reactcommunity.org/react-transition-group/
- React Select package:
  https://www.npmjs.com/package/react-select
