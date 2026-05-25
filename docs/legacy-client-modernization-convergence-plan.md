# Legacy Client Modernization and Admin-Next Convergence Plan

Last updated: 2026-05-24

Branch: `modernization/legacy-client-convergence`

## Purpose

This document is the implementation plan for modernizing Keystone Classic's
legacy admin client and converging it with the admin-next stack.

The React-version migration is no longer the main problem. The legacy client now
runs on React 18, but it still carries an older application architecture:
Browserify bundles, React Router 3, local Redux-style reducer state, createReactClass,
Elemental/LESS, old field components, old forked third-party packages, runtime
Browserify custom-field support, and a global `Keystone` bootstrap contract.

Admin-next is a different stack: Vite, TypeScript/TSX, React 18 StrictMode,
TanStack Router, TanStack Query, a typed field registry, fetch-based API access,
CSS modules, and modern field implementations.

The goal is to converge those stacks without losing Keystone Classic behavior,
custom field compatibility, or the existing `/keystone` admin surface until a
safe cutover is complete.

## Target Outcome

The modernization is complete when:

- The user-facing admin experience is served by the modern Vite/TanStack/TSX
  stack.
- The legacy Browserify admin bundles are no longer required for built-in admin
  behavior.
- Built-in field UI implementations live in one modern field registry.
- The admin data layer uses the fetch/TanStack Query API client instead of
  `xhr`, Redux action reducers, and sagas.
- The admin router uses TanStack Router instead of React Router 3 and
  `react-router-redux`.
- Legacy Elemental/LESS UI dependencies are either removed or isolated behind a
  compatibility layer.
- Custom legacy field support is either:
  - preserved through a documented compatibility adapter, or
  - intentionally versioned as a breaking change with migration guidance.
- The package no longer needs vendored React peer forks for built-in admin
  behavior.
- `npm run build`, `npm run test:unit`, `npm run test:e2e-ui`,
  `npm run test:e2e-ui:fields`, and `npm run package:verify` pass.
- Admin-next and the historical `/keystone` entrypoint have an explicit routing
  and compatibility policy.

## Non-Goals

- Do not do a single large rewrite that replaces the whole legacy app at once.
- Do not remove `/keystone` until all documented parity gates pass.
- Do not drop custom field compatibility silently.
- Do not change server APIs only to suit the frontend unless the old behavior is
  preserved or intentionally versioned.
- Do not replace the database/model/list APIs as part of this frontend
  modernization.
- Do not target React 19 in this project.
- Do not remove legacy assets before package verification and custom-field
  compatibility decisions are complete.
- Do not redesign the product UI beyond what is required to converge behavior.

## Guiding Strategy

Use a strangler migration, not a big-bang rewrite.

1. Build shared contracts first.
2. Move one route or feature at a time to the modern stack.
3. Keep parity tests running against both clients while both exist.
4. Use adapters for legacy custom-field and package surfaces.
5. Retire old dependencies only after the modern implementation owns the
   corresponding behavior.
6. Keep every phase independently shippable or revertible.

The expected final route shape is:

- `/keystone-next` continues to serve the modern admin during migration.
- `/keystone` continues to serve the legacy-compatible admin surface.
- At cutover, `/keystone` can serve the modern admin shell while preserving
  old URLs and redirects.
- `/keystone-next` can remain as an alias, redirect to `/keystone`, or be
  removed after a deprecation window.

## Current Stack Inventory

### Shared Runtime

Current root runtime:

| Package | Current role |
| --- | --- |
| `react@^18.3.1` | Shared React runtime. |
| `react-dom@^18.3.1` | Shared DOM runtime. |
| `@types/react@^18.3.x` | Shared React type definitions. |
| `@types/react-dom@^18.3.x` | Shared React DOM type definitions. |

The previous `react18` and `react-dom18` aliases are gone. React itself is no
longer the stack split.

### Legacy Client

Primary folders:

- `admin/client-legacy/**`
- `fields/**`
- `admin/server/templates-legacy/**`
- `admin/server/routes-legacy/**`
- `admin/server/app/createAdminLegacyStaticRouter.mts`
- `admin/server/app/createAdminLegacyRouter.mts`
- `admin/server/middleware/browserify.mts`
- `scripts/build-legacy-admin-bundles.ts`

Primary runtime and build traits:

- Browserify bundle generation for:
  - `packages.js`
  - `fields.js`
  - `signin.js`
  - `admin.js`
- Runtime Browserify support for custom field types.
- EJS templates that inject global `Keystone`.
- React Router 3.
- Local Redux-style reducer state for remaining list/item shell behavior.
- `xhr` for API requests.
- `create-react-class`.
- PropTypes.
- Elemental components and LESS styling.
- Legacy field component API: `Field`, `Filter`, `Column`.
- Custom field compatibility through `FieldTypes` and packages exposed in
  `packages.js`.

Legacy file counts at the start of this plan:

| Area | Files | Main types |
| --- | ---: | --- |
| `admin/client-legacy` | 273 | 216 `.mjs`, 53 `.less`, 2 `.js` |
| `fields` | 346 | 141 `.mjs`, 172 `.mts`, 1 `.css`, 1 `.less` |

Legacy dependency and API counts:

| Pattern | Files | Occurrences | Modernization impact |
| --- | ---: | ---: | --- |
| `createReactClass` / `create-react-class` | 82 | 247 | Convert or replace component implementation. |
| `findDOMNode` | 18 | 47 | Replace with refs before StrictMode. |
| Legacy context APIs | 15 | 22 | Replace with modern context. |
| Unsafe lifecycle methods | 19 | 24 | Refactor before StrictMode. |
| String refs / `this.refs` | 52 | 144 | Replace with callback/object refs. |
| React Router 3 / router-redux | 24 | 34 | Replace with TanStack Router. |
| `react-router-redux` | 5 | 7 | Remove with Redux/router migration. |
| Redux/saga/thunk/store/connect patterns | 12 | 17 | Replace route data with TanStack Query and local state. |
| PropTypes | 147 | 860 | Replace with TypeScript props as files are ported. |
| `react-select` | 6 | 9 | Replace old fork with modern select implementation. |
| `react-dnd` | 6 | 14 | Replace or isolate drag/drop behavior. |
| `react-images` | 3 | 3 | Replace Cloudinary lightbox path. |
| `react-day-picker` | 4 | 5 | Replace/finalize modern date picker path. |
| `glamor` / `aphrodite` / `less` | 72 | 117 | Converge styling to modern CSS modules/global CSS. |

### Admin-Next Client

Primary folders:

- `admin/client-next/src/**`
- `admin/client-next/vite.config.ts`
- `admin/server/app/createAdminNextStaticRouter.mts`
- `admin/public-next/**`

Primary runtime and build traits:

- Vite build.
- TypeScript and TSX.
- React 18 `createRoot`.
- StrictMode enabled.
- TanStack Router.
- TanStack Query.
- fetch-based API wrapper.
- Typed route context.
- Typed field registry.
- Function components and hooks.
- CSS modules and global CSS.
- Tiptap-based HTML editor.

Admin-next file counts at the start of this plan:

| Area | Files | Main types |
| --- | ---: | --- |
| `admin/client-next/src` | 159 | 103 `.tsx`, 42 `.ts`, 14 `.css` |

Admin-next target stack:

| Concern | Modern stack |
| --- | --- |
| Build | Vite |
| Language | TypeScript / TSX |
| Routing | TanStack Router |
| Server state | TanStack Query |
| API client | `fetch` wrapper in `admin/client-next/src/api/fetch.ts` |
| Field registry | `admin/client-next/src/fields/registry.ts` |
| HTML editor | Tiptap |
| Styling | CSS modules + global CSS |
| Root | React 18 `createRoot` + StrictMode |

## Desired End-State Architecture

### Admin Shell

The final admin shell should be the modern Vite app. It should own:

- Authentication pages.
- Home/dashboard.
- List view.
- Item create/edit view.
- Delete flows.
- Relationship panels.
- Field rendering.
- Upload flows.
- Navigation/layout.
- Error boundaries and loading states.

The historical `/keystone` URL should either:

- serve the modern app directly, or
- redirect to the modern app while preserving deep links.

This must be an explicit product/package decision. Do not let route behavior
change accidentally.

### Field System

The final built-in field UI should use the admin-next typed registry:

- `Field`
- `Filter`
- `Column`
- shared metadata types
- shared value normalization helpers

The server-side field type classes under `fields/types/*Type.mts` should remain
server/model code. The browser UI parts under `fields/types/*.mjs` should be
ported, replaced, or isolated behind compatibility adapters.

### API Layer

The final admin data layer should use:

- a shared fetch wrapper with CSRF/session behavior
- typed API normalization helpers
- TanStack Query for server state
- local component state for UI-only state
- route search params for URL-backed state

The final stack should not need:

- `xhr`
- Redux reducers for server state
- redux-saga for query-param/list behavior
- `react-router-redux`

### Styling

The final built-in admin UI should not depend on Elemental LESS as the primary
component system. Styling should converge toward:

- admin-next global base CSS
- CSS modules for route/component-specific styling
- reusable modern components under `admin/client-next/src/components`
- a small compatibility stylesheet only where required for legacy custom fields

### Custom Field Compatibility

Custom field compatibility is the hardest package surface. Today, legacy custom
fields can rely on:

- runtime Browserify
- `FieldTypes`
- packages exposed through `packages.js`
- Elemental component imports
- legacy field props and callback shapes

The modernization must choose and document one of these strategies:

1. **Compatibility Adapter**
   - Keep a legacy custom field runtime.
   - Provide adapters so old custom `Field`, `Filter`, and `Column` components
     can render inside the modern admin shell.
   - Keep a reduced compatibility bundle for third-party custom fields.

2. **Dual Client Support**
   - Built-in fields move to admin-next.
   - Sites with custom legacy fields keep using the legacy client.
   - Admin-next becomes default only when no custom legacy fields are detected.

3. **Breaking Change**
   - Remove legacy custom field browser compatibility.
   - Publish a migration guide for custom field authors.
   - Version the package accordingly.

Recommended first strategy: implement dual client support, then build a
compatibility adapter for the most common custom field patterns. Do not promise
full custom-field compatibility until it has tests.

## Compatibility Matrix

| Capability | Legacy today | Admin-next today | Target |
| --- | --- | --- | --- |
| Main route | `/keystone` | `/keystone-next` | modern app serves `/keystone`; `/keystone-next` optional alias |
| Build | Browserify + SWC | Vite | Vite for built-in admin |
| Runtime bundles | `packages.js`, `fields.js`, `signin.js`, `admin.js` | Vite chunks | Vite chunks; optional compatibility bundle |
| Routing | React Router 3 | TanStack Router | TanStack Router |
| Server state | Redux/saga/xhr | TanStack Query/fetch | TanStack Query/fetch |
| UI state | Redux + component state | component state + route search | route search + local state |
| Field UI | `fields/**/*.mjs` | `admin/client-next/src/fields/**/*.tsx` | one typed field registry |
| Custom fields | runtime Browserify | not fully compatible | adapter, dual support, or breaking change |
| Styling | Elemental/LESS/glamor | CSS modules/global CSS | modern CSS with compatibility layer |
| Tests | Enzyme + Playwright | TypeScript + Playwright | Playwright + React Testing Library for new code |
| StrictMode | not enabled | enabled | built-in modern app clean in StrictMode |

## Migration Phases

### Phase 0: Baseline and Governance

Goal: establish the React 18 baseline and define migration guardrails.

Tasks:

1. Confirm branch and clean state:

   ```sh
   git status -sb
   git branch --show-current
   npm ci
   ```

2. Run baseline checks:

   ```sh
   npm run lint
   npm run typecheck
   npm run build-dev
   npm run build
   npm run test:unit
   npm run test:e2e-ui
   npm run test:e2e-ui:fields
   npm run package:verify
   ```

3. Save dependency state:

   ```sh
   npm ls react react-dom --depth=3
   npm ls react-router react-router-redux redux redux-saga redux-thunk \
     react-select react-transition-group react-day-picker react-images \
     react-dnd react-dnd-html5-backend create-react-class xhr --depth=1
   ```

4. Create a migration tracking file:

   - `docs/legacy-client-modernization-progress.md`
   - Track each phase, commit, test status, and known regressions.

5. Define acceptance governance:

   - No phase lands without e2e coverage or documented manual coverage.
   - No old dependency is removed until its user-facing behavior has a modern
     owner.
   - No custom-field compatibility break lands without an explicit decision.

Acceptance:

- Baseline is known.
- Failing tests, if any, are documented before implementation starts.
- The modernization progress file exists.

### Phase 1: Contract Inventory and Parity Ledger

Goal: make all behavior that must survive explicit.

Tasks:

1. Create an admin parity ledger:

   - `docs/admin-modernization-parity-ledger.md`

2. Inventory every route and workflow:

   - signin
   - signout
   - home/dashboard
   - list navigation
   - list search
   - list sort
   - list pagination
   - list column configuration
   - list filters
   - CSV download
   - create modal
   - item edit
   - item delete
   - bulk delete
   - relationship select/search
   - inverse relationship panels
   - upload flows
   - field explorer

3. Inventory every built-in field type:

   - boolean
   - cloudinary
   - cloudinaryimage
   - cloudinaryimages
   - code
   - color
   - date
   - datearray
   - datetime
   - email
   - file
   - geopoint
   - html
   - key
   - localfile
   - localfiles
   - location
   - markdown
   - money
   - name
   - number
   - numberarray
   - password
   - relationship
   - select
   - text
   - textarea
   - textarray
   - url

4. For each field type, record:

   - legacy `Field`, `Filter`, `Column` implementation
   - admin-next `Field`, `Filter`, `Column` implementation
   - missing admin-next behavior
   - API payload shape
   - create/edit support
   - filter support
   - column render support
   - upload/media support
   - e2e coverage

5. Add or update Playwright tests to assert parity for missing behavior.

Acceptance:

- Every admin workflow has a parity row.
- Every built-in field has a parity row.
- Missing admin-next behavior is visible before migration starts.

### Phase 2: Shared API Contract Extraction

Goal: make legacy and next clients consume the same typed admin API contract.

Tasks:

1. Extract admin-next API helpers into a shared admin client module:

   Proposed location:

   - `admin/shared/api/fetch.ts`
   - `admin/shared/api/list.ts`
   - `admin/shared/api/session.ts`
   - `admin/shared/api/types.ts`

2. Move code from:

   - `admin/client-next/src/api/fetch.ts`
   - `admin/client-next/src/api/list.ts`
   - `admin/client-next/src/api/session.ts`

3. Keep admin-next imports working through re-exports or direct import updates.

4. Create a compatibility wrapper for legacy code that still expects callbacks
   or old list helper methods.

5. Start replacing `xhr` usage in legacy utilities:

   - `admin/client-legacy/utils/List.mjs`
   - `admin/client-legacy/App/screens/Home/actions.mjs`
   - `admin/client-legacy/Signin/Signin.mjs`

6. Preserve CSRF behavior:

   - safe methods do not require token
   - mutating methods send `x-xsrf-token`
   - credentials are included
   - FormData uploads do not force JSON content type

Acceptance:

- Admin-next still builds and runs.
- Legacy client can call the shared API wrapper for at least one low-risk
  workflow.
- CSRF/session behavior is covered by unit or e2e tests.

### Phase 3: Modern Field Contract and Registry Unification

Goal: create one browser field contract that both clients can use.

Tasks:

1. Promote `admin/client-next/src/fields/types.ts` and
   `admin/client-next/src/fields/registry.ts` into a shared module:

   Proposed location:

   - `admin/shared/fields/types.ts`
   - `admin/shared/fields/registry.ts`

2. Define stable field component props:

   - `FieldProps`
   - `FilterProps`
   - `ColumnProps`
   - field metadata
   - list metadata
   - item values
   - validation errors
   - upload callbacks

3. Add adapters:

   - `legacyFieldToModernField`
   - `modernFieldToLegacyField` if needed for transitional rendering
   - `legacyFilterToModernFilter`
   - `legacyColumnToModernColumn`

4. Create a test harness that renders each field in both contracts with the
   same data.

5. Move the lowest-risk fields fully to the modern registry first:

   - boolean
   - text
   - textarea
   - email
   - url
   - number
   - select

6. Then move complex fields:

   - date
   - datearray
   - relationship
   - file
   - localfile/localfiles
   - cloudinary variants
   - markdown/html/code

7. Keep server field type classes under `fields/types/*Type.mts` separate from
   browser field UI code.

Acceptance:

- Every built-in field has a modern registry owner.
- Legacy field UI can be removed or adapted without changing server model APIs.
- Field e2e tests pass for both list columns and edit forms.

### Phase 4: Admin-Next Parity Completion

Goal: make admin-next feature-complete enough to replace the legacy built-in
admin.

Tasks:

1. Close parity gaps from the ledger.

2. Focus on high-risk workflows first:

   - list filters
   - relationship fields
   - inverse relationship panels
   - media upload
   - HTML/Tiptap behavior
   - markdown preview
   - CSV download
   - bulk actions
   - list column management
   - sortable lists

3. Ensure route URL parity:

   - old `/keystone/:listId`
   - old `/keystone/:listId/:itemId`
   - create flows
   - query parameters for search/filter/sort/page/columns

4. Add redirect or route compatibility helpers in TanStack Router where exact
   URL parity cannot be preserved directly.

5. Make admin-next robust to the same server-injected config as legacy:

   - admin path
   - API path
   - brand
   - version
   - back URL
   - signed-in user
   - custom list names
   - custom field metadata

Acceptance:

- Admin-next passes all parity e2e tests currently used for legacy.
- The parity ledger marks all built-in workflows as complete or intentionally
  deferred.

### Phase 5: Route and Shell Convergence

Goal: make the modern shell capable of serving the historical admin surface.

Tasks:

1. Update server routing policy:

   Files:

   - `server/createApp.mts`
   - `admin/server/app/createAdminNextStaticRouter.mts`
   - `admin/server/app/createAdminLegacyStaticRouter.mts`
   - `admin/server/app/createAdminLegacyRouter.mts`
   - `lib/core/adminSurfacePathUtils.mjs`

2. Introduce explicit admin mode options:

   - `legacy`
   - `next`
   - `both`
   - `auto`

3. Define `auto`:

   - serve modern admin when no unsupported custom legacy field browser code is
     detected
   - serve legacy admin when custom legacy field compatibility is required
   - emit a startup warning that explains the decision

4. Let modern admin serve `/keystone` behind an opt-in flag first:

   Suggested env/config:

   - `KEYSTONE_ADMIN_CLIENT=next`
   - `KEYSTONE_ADMIN_CLIENT=legacy`
   - `KEYSTONE_ADMIN_CLIENT=both`
   - `KEYSTONE_ADMIN_CLIENT=auto`

5. Preserve deep links and sign-in redirects.

6. Add tests for:

   - `/keystone`
   - `/keystone-next`
   - `/keystone/signin`
   - `/keystone/signout`
   - custom admin path
   - custom API path

Acceptance:

- The modern shell can serve the historical admin path under an opt-in mode.
- Legacy shell remains available under `legacy` or `both` mode.
- Package consumers do not see an accidental route break.

### Phase 6: State Management Migration

Goal: remove Redux, redux-saga, redux-thunk, and router-redux from built-in admin
behavior.

Tasks:

1. Map legacy Redux state to modern owners:

   | Legacy state | Modern owner |
   | --- | --- |
   | list metadata | TanStack Query admin meta query |
   | active list | route params |
   | active item | route params + item query |
   | search | route search params |
   | filters | route search params |
   | sort | route search params |
   | columns | route search params or local storage |
   | counts | TanStack Query |
   | flash messages | local/toast state |
   | item form values | local form state |

2. Replace sagas with explicit helpers:

   - query param parsing
   - filter serialization
   - sort serialization
   - column serialization

3. Move reusable parsers from `admin/client-legacy/App/parsers` to shared
   modules with tests.

4. Delete or retire:

   - `admin/client-legacy/App/store.mjs`
   - `admin/client-legacy/App/sagas/**`
   - `admin/client-legacy/App/screens/*/reducers/**`
   - `react-router-redux`
   - `redux-saga`
   - `redux-thunk`

   Only delete once no built-in behavior imports them.

Acceptance:

- Built-in admin workflows no longer depend on Redux/saga/router-redux.
- Query parameter behavior remains covered by tests.

### Phase 7: Routing Migration

Goal: remove React Router 3 from built-in admin behavior.

Tasks:

1. Ensure every legacy route has a TanStack Router equivalent.

2. Port route behavior:

   - home
   - list
   - item
   - create
   - signin
   - signout

3. Replace `this.context.router` usage with modern navigation helpers.

4. Replace `Link` imports from React Router 3 with modern link components.

5. Remove React Router 3 dependency from built-in bundles.

6. Keep compatibility if custom legacy fields import `react-router` from
   exposed packages; do not remove from compatibility bundle until the custom
   field policy permits it.

Acceptance:

- Built-in admin no longer imports React Router 3.
- URL parity tests pass.
- Custom field compatibility decision is documented.

### Phase 8: UI Component and Styling Convergence

Goal: retire Elemental as the built-in UI system.

Tasks:

1. Inventory Elemental components used by built-in admin:

   - buttons
   - forms
   - modals
   - popouts
   - grids
   - pagination
   - alerts
   - glyphs/icons
   - responsive text
   - scroll lock

2. Map each to admin-next components:

   - `Layout`
   - `ConfirmDialog`
   - `CreateItemModal`
   - `FieldShell`
   - route-specific components
   - shared future components as needed

3. Move reusable modern components to:

   - `admin/client-next/src/components`
   - or `admin/shared/components` if both clients need them during transition

4. Replace LESS/glamor/aphrodite usage with:

   - CSS modules for route/component styles
   - shared CSS variables/tokens
   - global base styles only where appropriate

5. Keep a compatibility Elemental export only for old custom fields if required.

Acceptance:

- Built-in modern admin does not import `admin/client-legacy/App/elemental`.
- Built-in admin no longer depends on legacy LESS build.
- Visual parity tests or screenshots cover key workflows.

### Phase 9: Legacy API Cleanup and StrictMode Hardening

Goal: make built-in admin code clean under modern React constraints.

Tasks:

1. Remove remaining built-in uses of:

   - `create-react-class`
   - `findDOMNode`
   - string refs
   - legacy context
   - unsafe lifecycles
   - PropTypes in modernized code

2. Convert remaining built-in components to TypeScript/TSX.

3. Run admin-next StrictMode with all built-in modern routes.

4. Add React Testing Library for component-level tests that replace Enzyme
   coverage.

5. Retire Enzyme for built-in admin tests after equivalent coverage exists.

Acceptance:

- Built-in modern admin runs cleanly in StrictMode.
- No built-in admin route depends on createReactClass or findDOMNode.
- New component tests use modern React testing patterns.

### Phase 10: Build System Consolidation

Goal: stop requiring Browserify for built-in admin behavior.

Tasks:

1. Keep Vite as the built-in admin build system.

2. Replace or retire:

   - `scripts/build-legacy-admin-bundles.ts`
   - `admin/server/middleware/browserify.mts`
   - `admin/client-legacy/packages.mjs`
   - `admin/public-legacy/js/*.js` generation

3. Decide compatibility bundle policy:

   Option A: no compatibility bundle.

   - Breaking change.
   - Custom fields must migrate.

   Option B: compatibility bundle only when custom legacy fields exist.

   - Keep Browserify or create a compatibility Vite build.
   - Do not use it for built-in admin behavior.

   Option C: dedicated legacy package.

   - Extract legacy admin compatibility into separate package.
   - Main package defaults to modern admin.

4. Update package verification for the chosen policy.

5. Update build scripts:

   - `npm run build`
   - `npm run build-dev`
   - `npm run admin-next:build`
   - package publish verification

Acceptance:

- Built-in admin build no longer requires Browserify.
- Compatibility build behavior is explicit and tested.
- Package contents match the documented support policy.

### Phase 11: Dependency Retirement

Goal: remove old dependencies after their behavior has modern owners.

Candidate removals:

- `create-react-class`
- `react-router`
- `react-router-redux`
- `redux`
- `redux-saga`
- `redux-thunk`
- `xhr`
- `react-select` v1 fork
- `react-transition-group` v1 fork
- `react-day-picker` v7 fork
- `react-images`
- `react-dnd` v2 if replaced
- `react-dnd-html5-backend` v2 if replaced
- `glamor`
- `aphrodite`
- Elemental compatibility code if custom field policy permits
- Browserify-related dependencies used only by legacy built-in bundles
- Enzyme and Enzyme adapter after tests are migrated

Process:

1. For each dependency, run:

   ```sh
   rg "dependency-name" .
   npm ls dependency-name
   ```

2. Remove only when:

   - no built-in code imports it
   - no compatibility layer needs it
   - tests pass
   - package verification is updated

3. Keep removals in small commits grouped by subsystem.

Acceptance:

- Dependency removals are evidence-backed.
- No dependency is removed only because it looks old.

### Phase 12: Legacy Client Decommission

Goal: remove or isolate the old client after the modern stack owns built-in
admin behavior.

Tasks:

1. Confirm all parity ledger items are complete or intentionally out of scope.

2. Confirm custom field policy:

   - adapter supported
   - dual client supported
   - or breaking change documented

3. Remove or isolate:

   - `admin/client-legacy/App/**`
   - `admin/client-legacy/Signin/**`
   - `admin/client-legacy/packages.mjs`
   - `admin/server/templates-legacy/**`
   - `admin/server/routes-legacy/**`
   - `admin/public-legacy/**`

4. Keep server/model field classes:

   - `fields/types/*Type.mts`

5. Move modern browser field code to a stable location:

   - keep in `admin/client-next/src/fields`
   - or promote to `admin/client/src/fields`
   - or promote to `admin/shared/fields`

6. Rename admin-next if desired:

   - `admin/client-next` to `admin/client`
   - `admin/public-next` to `admin/public`
   - update scripts and package verification

7. Update docs:

   - admin client mode docs
   - custom field migration guide
   - package compatibility notes
   - upgrade guide

Acceptance:

- Built-in admin no longer depends on legacy client files.
- Package verification reflects the final support policy.
- Users have migration documentation for any removed legacy extension point.

## Custom Field Compatibility Plan

### Current Legacy Contract

Legacy custom field browser code may depend on:

- `FieldTypes`
- `fields/types/<type>/<Type>Field.mjs`
- `fields/types/<type>/<Type>Filter.mjs`
- `fields/types/<type>/<Type>Column.mjs`
- `fields/components/**`
- `admin/client-legacy/App/elemental`
- packages exposed through `packages.js`
- Browserify runtime bundling
- global `Keystone`

### Modern Contract Proposal

Define a new custom field browser contract:

```ts
export type AdminFieldComponents<TValue, TFilterValue = unknown> = {
  Field: React.ComponentType<FieldProps<TValue>>;
  Filter: React.ComponentType<FilterProps<TFilterValue>>;
  Column: React.ComponentType<ColumnProps<TValue>>;
};
```

Provide:

- typed props
- stable metadata format
- upload helpers
- API helper
- design-system components
- migration examples

Admin-next also supports a migration loading bridge through
`keystone.set('admin next custom field scripts', string | string[])`. The URLs
are emitted as same-origin module scripts before the app bundle, after the
server-provided `window.Keystone` bootstrap. Those scripts may populate
`window.Keystone.fieldComponents` with modern component sets or
`window.Keystone.legacyFieldComponents` with legacy component sets that are
adapted through `registerLegacyFieldComponents()`.

The companion repository helper
`npm run admin-next:build-custom-fields -- --entry <file>` builds an
operator-owned entry file into an ES module suitable for that setting. It
intentionally keeps custom field ownership in the deployment: the generated
module must assign the appropriate `window.Keystone` maps, while Keystone owns
the loading order and registration adapter.

Policy decision: custom field compatibility is supported through the modern
module-script bridge and the `window.Keystone.legacyFieldComponents` adapter,
not through the historical `packages.js` vendor bundle. Built-in admin behavior
does not ship React Router 3, and custom field browser code that previously
imported `react-router` from `packages.js` must migrate to normal links or the
modern admin route APIs available inside its module script.

### Adapter Requirements

If compatibility adapter is chosen, it must support:

- old `Field`, `Filter`, `Column` component shapes
- old value callbacks
- old validation error shape
- old column props
- Elemental compatibility exports
- enough exposed package names to avoid common custom field breaks
- no React Router 3 package exposure; navigation must use normal links or the
  modern admin route APIs

Adapter tests:

- a fake legacy custom text field
- a fake legacy custom relationship-like field
- a fake legacy custom upload field
- a fake modern custom field
- admin-next module script loading behavior
- admin-next custom field bundle production behavior

## Testing Strategy

### Baseline Commands

Run during every major phase:

```sh
npm run lint
npm run typecheck
npm run build-dev
npm run build
npm run test:unit
npm run test:e2e-ui
npm run test:e2e-ui:fields
npm run package:verify
```

### Targeted E2E Areas

Run targeted Playwright specs when touching related behavior:

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

### Manual Smoke Checks

Required before major cutovers:

- Sign in with correct credentials.
- Sign in with wrong credentials.
- Sign out.
- Open dashboard and verify list counts.
- Open list page.
- Search list.
- Sort list.
- Paginate list.
- Configure list columns.
- Download CSV.
- Create item.
- Edit item.
- Delete item.
- Bulk delete items.
- Apply and remove filters.
- Use relationship field search/select/remove.
- Exercise inverse relationship panels.
- Use upload fields.
- Use Cloudinary image and images fields.
- Use date and datearray filters.
- Use markdown preview.
- Use HTML editor.
- Use code field.
- Verify field explorer or its replacement.
- Verify custom admin path.
- Verify both `/keystone` and `/keystone-next` according to current mode.

### Test Modernization

Keep Playwright as the behavioral source of truth.

For component tests:

- Add React Testing Library for new TSX components.
- Do not add new Enzyme tests.
- Migrate Enzyme coverage only when touching the component or when the legacy
  component is replaced.
- Remove Enzyme only after coverage exists for remaining behavior.

## Rollout Strategy

### Internal Phase

- Keep both clients available.
- Modern client remains opt-in.
- Parity tests run against both where possible.

### Beta Phase

- Add `admin client` or `adminui client` config option if not already present.
- Let projects opt into modern admin on `/keystone`.
- Emit warnings for unsupported custom legacy fields.

### Default Phase

- Modern admin becomes default when safe.
- Legacy admin remains available behind config for one deprecation window.
- Publish custom field migration guide.

### Removal Phase

- Remove legacy built-in admin.
- Keep only the chosen custom-field compatibility surface.
- Remove old dependencies and package assets.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Custom legacy fields break | High | Dual client mode, adapter tests, migration guide. |
| URL/query parity breaks | High | Route parity ledger and Playwright coverage. |
| Field behavior diverges | High | Per-field parity matrix and field e2e suite. |
| Upload flows regress | High | Dedicated media/upload tests. |
| Relationship fields regress | High | Dedicated relationship variants tests. |
| Browserify removal breaks package consumers | High | Package verification and compatibility decision. |
| Visual regressions | Medium | Screenshot/manual review for key workflows. |
| Redux/saga removal changes timing | Medium | Move state ownership gradually and test query params. |
| StrictMode surfaces side effects | Medium | Do not enable for legacy until cleanup; harden modern routes. |
| Dependency removal is too broad | Medium | One subsystem per commit, `rg` and `npm ls` proof. |

## Commit Strategy

Use small, reviewable commits:

1. Add modernization convergence plan.
2. Add parity ledger and progress tracker.
3. Extract shared API contracts.
4. Add custom field compatibility decision document.
5. Extract/shared field registry contracts.
6. Port low-risk fields.
7. Port complex fields.
8. Complete admin-next parity gaps.
9. Add `/keystone` modern shell opt-in.
10. Migrate state/query-param ownership away from Redux/saga.
11. Migrate routing away from React Router 3.
12. Replace Elemental/LESS built-in usage.
13. Remove legacy built-in Browserify dependency.
14. Retire old dependencies.
15. Decommission or isolate legacy client.

Keep docs and behavior commits separate where possible. Keep dependency removals
separate from feature rewrites.

## Definition of Done

Modernization is complete when:

- Admin-next/modern admin owns all built-in admin workflows.
- `/keystone` can be served by the modern admin shell.
- Legacy route deep links are preserved or intentionally redirected.
- Built-in field UI is registered through the modern typed field registry.
- Built-in admin no longer imports `admin/client-legacy/App/**`.
- Built-in admin no longer imports `fields/**/*.mjs` browser UI components.
- Built-in admin no longer requires Browserify.
- Built-in admin no longer requires Redux, redux-saga, redux-thunk, React Router
  3, or react-router-redux.
- Built-in admin no longer requires createReactClass, findDOMNode, string refs,
  legacy context, or unsafe lifecycles.
- Custom field compatibility policy is implemented and documented.
- Old vendored React peer forks are removed or isolated to a compatibility
  package/surface.
- Enzyme is removed or isolated to legacy compatibility tests only.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm run test:unit` passes.
- `npm run test:e2e-ui` passes.
- `npm run test:e2e-ui:fields` passes.
- `npm run package:verify` passes.
- Upgrade/custom-field migration docs are published.

## Reference Links

- React StrictMode reference:
  https://react.dev/reference/react/StrictMode
- React `createRoot` reference:
  https://react.dev/reference/react-dom/client/createRoot
- React portals reference:
  https://react.dev/reference/react-dom/createPortal
- TanStack Router React overview:
  https://tanstack.com/router/latest/docs/framework/react/overview
- TanStack Query React overview:
  https://tanstack.com/query/latest/docs/framework/react/overview
- Vite guide:
  https://vite.dev/guide/
- React Testing Library introduction:
  https://testing-library.com/docs/react-testing-library/intro/
- Tiptap React integration:
  https://tiptap.dev/docs/editor/getting-started/install/react
