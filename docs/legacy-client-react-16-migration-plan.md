# Legacy Client React 16 Migration Plan

Last updated: 2026-05-23

Branch: `migration/react-16`

## Purpose

This document is the working plan for migrating Keystone Classic's legacy admin
client from React 15 to React 16 while preserving current legacy admin behavior.
The target of this plan is React 16.14, not React 18. React 16 is the necessary
compatibility bridge because the legacy client still depends on React 15-era
APIs and packages, while the newer admin client already uses React 18 aliases.

The migration must keep these surfaces working:

- Admin legacy app at `/keystone`.
- Admin legacy signin page.
- Admin legacy field type components and filters.
- Field explorer.
- Runtime Browserify middleware and prebuilt legacy bundles.
- Public compatibility for custom field components that depend on legacy admin
  packages exposed through `packages.js`.
- Existing API and server behavior.

## Target Outcome

The first complete React 16 milestone is:

- `react` and `react-dom` resolve to `16.14.x` at the root.
- Legacy admin bundles compile through Browserify and SWC.
- Legacy admin pages mount without fatal render errors.
- Development console is free of React 16 migration warnings that are in our
  code, except explicitly documented third-party warnings that have an owner and
  follow-up.
- Existing e2e coverage for auth, home, list, item edit, create, filters,
  relationship fields, upload fields, modal/popout behavior, and parity still
  passes.
- `npm ls react react-dom` does not report invalid direct peer dependencies for
  the legacy client stack.
- The React 18 alias workaround remains untouched for admin-next during this
  React 16 milestone. React 16 does not solve TipTap/TanStack peer conflicts.

## Non-Goals

- Do not convert the legacy app to hooks.
- Do not replace React Router 3 in this milestone.
- Do not replace Redux 3, redux-saga, or react-router-redux unless required by
  React 16 compatibility.
- Do not move the legacy app to Vite or Webpack in this milestone.
- Do not target React 17, 18, or 19 in this milestone.
- Do not remove the admin-next React 18 aliases as part of the React 16 work.

## Why React 16 First

React 16 is the smallest useful major-version step. React 16 removes
`React.createClass` and `React.PropTypes` from the core package, but it still
supports enough class component, legacy context, string ref, and
`ReactDOM.render` behavior to let the legacy client keep running while the code
is modernized in controlled passes.

React 18 is not a safe direct target for this codebase. The current legacy
client uses:

- `React.createClass`
- `React.PropTypes`
- string refs and `this.refs`
- legacy context APIs
- `componentWillMount`, `componentWillReceiveProps`, and `componentWillUpdate`
- `findDOMNode`
- old React addon packages
- Enzyme 2
- old third-party packages whose peer ranges stop at React 15

React 16 lets us fix the hard removals first, then reduce warnings and risk
before a later React 18 migration.

## Current Architecture Inventory

### Legacy Entrypoints

- `admin/client-legacy/App/index.mjs`
  - Main admin legacy SPA entrypoint.
  - Uses `ReactDOM.render`.
  - Uses `react-router@3`, `react-redux`, and `react-router-redux`.
- `admin/client-legacy/Signin/index.mjs`
  - Signin page entrypoint.
  - Uses `ReactDOM.render`.
- `fields/explorer/index.mjs`
  - Field explorer entrypoint.
  - Uses `ReactDOM.render`.
- `admin/client-legacy/App/shared/Portal.mjs`
  - Custom portal-like implementation.
  - Uses `React.createClass` and `ReactDOM.render` into a detached DOM node.
- `admin/client-legacy/App/elemental/Portal/index.mjs`
  - Elemental portal wrapper.
  - Uses `render` from `react-dom` into a detached DOM node.

React 16 still supports `ReactDOM.render` for client-side rendering, so the app
entrypoints do not need to move to `createRoot` in this milestone. However,
internal detached-node rendering should be reviewed because React 16 introduced
first-class portals via `ReactDOM.createPortal`.

### Legacy Bundling

- `admin/client-legacy/packages.mjs`
  - Declares third-party packages exposed through `packages.js`.
  - Any package renamed, removed, or shimmed here can affect custom legacy field
    code.
- `scripts/build-legacy-admin-bundles.ts`
  - Builds `packages.js`, `fields.js`, `signin.js`, and `admin.js`.
  - Excludes package names from app bundles and field bundles.
- `admin/server/middleware/browserify.mts`
  - Runtime Browserify middleware for development/non-prebuilt operation.
- `admin/server/templates-legacy/index.html`
  - Loads `packages.js`, `fields.js`, and `admin.js`.
- `admin/server/templates-legacy/signin.html`
  - Loads `packages.js` and `signin.js`.

The migration must verify both prebuilt bundles and runtime Browserify serving.

### Field Component Surface

Legacy field runtime code is under:

- `fields/types/**`
- `fields/components/**`
- `fields/mixins/**`
- `fields/explorer/**`

The field code is part of the legacy client. It must be migrated and tested
with the app, not treated as server-only code.

## Current Dependency Inventory

Installed versions are from the current lockfile on `migration/react-16`.

| Package | Current | React peer status | Required action |
| --- | ---: | --- | --- |
| `react` | `15.7.0` | Root runtime | Upgrade to `^16.14.0`. |
| `react-dom` | `15.7.0` | Root runtime | Upgrade to `^16.14.0`. |
| `create-react-class` | `15.7.0` | Already transitive | Add direct dependency and import it wherever `React.createClass` remains. |
| `prop-types` | `15.8.1` | Already transitive | Add direct dependency and import it wherever `React.PropTypes` or `{ PropTypes } from 'react'` exists. |
| `react-addons-css-transition-group` | `15.6.2` | Peers `react@^15.4.2` | Replace with `react-transition-group@1.x` drop-in import or vendor a compatibility wrapper. |
| `elemental` | `0.6.1` | Peers React 0.14/15 only | Remove, replace with local Elemental exports, or vendor/fork with React 16 peer range. Do not leave an invalid peer. |
| `react-day-picker` | `2.5.0` | Peers React 0.13/0.14/15 only | Upgrade to a React 16-compatible v7 release or vendor/fork. Verify `DayPicker` refs, `showMonth`, modifiers, and styles. |
| `react-domify` | `0.2.6` | Peers React 0.14/15 only | Replace in field explorer or vendor/fork. It is currently used by `fields/explorer/components/FieldSpec.mjs`. |
| `enzyme` | `2.9.1` | Peers React 0.13/0.14/15 | Upgrade to Enzyme 3 and configure `enzyme-adapter-react-16`. |
| `react-router` | `3.2.6` | Supports React 0.14/15/16 | Keep for React 16 milestone. |
| `react-redux` | `5.1.2` | Supports React 0.14/15/16 | Keep for React 16 milestone. |
| `react-router-redux` | `4.0.8` | No blocking React peer in current audit | Keep for React 16 milestone. |
| `react-select` | `1.3.0` | Supports React 0.14/15/16 | Keep for React 16 milestone, test relationship/select fields. |
| `react-dnd` | `2.6.0` | Peer `react: *` | Keep for React 16 milestone, test drag sorting and related item panels. |
| `react-dnd-html5-backend` | `2.6.0` | No blocking React peer in current audit | Keep for React 16 milestone. |
| `react-images` | `0.5.19` | Supports React 15/16 | Keep, test Cloudinary image lightbox. |
| `react-color` | `2.19.3` | Peer `react: *` | Keep, test color field. |
| `react-markdown` | `2.5.1` | Peer `react >=0.13.3` | Keep for field explorer/readme usage. |
| `react-engine` | `4.5.1` | Supports React 15/16 | Keep, verify server-side view tests still pass. |

### Direct Dependency Edits

Planned first dependency commit:

- Change root `dependencies.react` to `^16.14.0`.
- Change root `dependencies.react-dom` to `^16.14.0`.
- Add direct `dependencies.create-react-class` at `^15.7.0`.
- Add direct `dependencies.prop-types` at `^15.8.1`.
- Add direct `dependencies.react-transition-group` at `^1.2.1` if we replace
  `react-addons-css-transition-group` immediately.
- Upgrade or replace `react-day-picker` only in the phase that updates the date
  fields.
- Upgrade `devDependencies.enzyme` to `^3.11.0`.
- Add `devDependencies.enzyme-adapter-react-16` at `^1.15.8`.

Do not remove `react18` or `react-dom18` aliases in this React 16 milestone.
They are still needed by `admin/client-next`.

## React API Usage Inventory

Generated with:

```sh
rg -l "React\\.createClass" admin/client-legacy fields | wc -l
rg -o "React\\.createClass" admin/client-legacy fields | wc -l
rg -l "React\\.PropTypes|import .*PropTypes.* from ['\\\"]react" admin/client-legacy fields | wc -l
rg -o "React\\.PropTypes|import .*PropTypes.* from ['\\\"]react" admin/client-legacy fields | wc -l
rg -l "ref=\\\"|this\\.refs|refs\\." admin/client-legacy fields | wc -l
rg -o "ref=\\\"|this\\.refs|refs\\." admin/client-legacy fields | wc -l
rg -l "findDOMNode" admin/client-legacy fields | wc -l
rg -o "findDOMNode" admin/client-legacy fields | wc -l
rg -l "componentWill(Mount|ReceiveProps|Update)" admin/client-legacy fields | wc -l
rg -o "componentWill(Mount|ReceiveProps|Update)" admin/client-legacy fields | wc -l
rg -l "contextTypes|childContextTypes|getChildContext" admin/client-legacy fields | wc -l
rg -o "contextTypes|childContextTypes|getChildContext" admin/client-legacy fields | wc -l
```

| Pattern | Files | Occurrences | React 16 impact |
| --- | ---: | ---: | --- |
| `React.createClass` | 82 | 83 | Removed from `react` in React 16. Must migrate or import `create-react-class`. |
| `React.PropTypes` / `PropTypes from react` | 147 | 372 | Removed from `react` in React 16. Must import `prop-types`. |
| String refs / `this.refs` | 52 | 143 | Still works in React 16, but legacy and blocks later React versions. Prefer callback refs when touching files. |
| `findDOMNode` | 18 | 47 | Still works in React 16 outside StrictMode, but deprecated. Prefer direct DOM refs where possible. |
| `componentWill*` lifecycles | 19 | 24 | Work in React 16, but warn in React 16.9+. Rename or refactor. |
| Legacy context APIs | 15 | 22 | Work for all React 16.x, but removed later. Do not expand usage. |

### `React.createClass` Files

These files must be touched by the createClass pass. Use `create-react-class`
first for low risk; convert simple components to ES classes or functions only
when the conversion is trivial and covered.

- `admin/client-legacy/App/components/Footer/index.mjs`
- `admin/client-legacy/App/components/Navigation/Mobile/ListItem.mjs`
- `admin/client-legacy/App/components/Navigation/Mobile/SectionItem.mjs`
- `admin/client-legacy/App/components/Navigation/Mobile/index.mjs`
- `admin/client-legacy/App/components/Navigation/Primary/index.mjs`
- `admin/client-legacy/App/components/Navigation/Secondary/NavItem.mjs`
- `admin/client-legacy/App/components/Navigation/Secondary/index.mjs`
- `admin/client-legacy/App/screens/Home/components/ListTile.mjs`
- `admin/client-legacy/App/screens/Home/index.mjs`
- `admin/client-legacy/App/screens/Item/components/EditForm.mjs`
- `admin/client-legacy/App/screens/Item/components/EditFormHeader.mjs`
- `admin/client-legacy/App/screens/Item/components/FooterBar.mjs`
- `admin/client-legacy/App/screens/Item/components/FormHeading.mjs`
- `admin/client-legacy/App/screens/Item/components/RelatedItemsList/RelatedItemsList.mjs`
- `admin/client-legacy/App/screens/Item/index.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAdd.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAddForm.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTable.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDrop.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDropZone.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDropZoneTarget.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableRow.mjs`
- `admin/client-legacy/App/screens/List/components/ListColumnsForm.mjs`
- `admin/client-legacy/App/screens/List/components/ListControl.mjs`
- `admin/client-legacy/App/screens/List/components/ListDownloadForm.mjs`
- `admin/client-legacy/App/screens/List/components/ListSort.mjs`
- `admin/client-legacy/App/screens/List/components/UpdateForm.mjs`
- `admin/client-legacy/App/screens/List/index.mjs`
- `admin/client-legacy/App/shared/AlertMessages.mjs`
- `admin/client-legacy/App/shared/CreateForm.mjs`
- `admin/client-legacy/App/shared/FlashMessage.mjs`
- `admin/client-legacy/App/shared/FlashMessages.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutBody.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutFooter.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutHeader.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutList.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutListHeading.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutListItem.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutPane.mjs`
- `admin/client-legacy/App/shared/Popout/index.mjs`
- `admin/client-legacy/App/shared/Portal.mjs`
- `admin/client-legacy/Signin/Signin.mjs`
- `fields/components/Checkbox.mjs`
- `fields/components/DateInput.mjs`
- `fields/components/columns/ArrayColumn.mjs`
- `fields/components/columns/CloudinaryImageSummary.mjs`
- `fields/components/columns/IdColumn.mjs`
- `fields/components/columns/InvalidColumn.mjs`
- `fields/explorer/components/FieldSpec.mjs`
- `fields/explorer/components/FieldType.mjs`
- `fields/types/Field.mjs`
- `fields/types/boolean/BooleanColumn.mjs`
- `fields/types/boolean/BooleanFilter.mjs`
- `fields/types/cloudinaryimage/CloudinaryImageColumn.mjs`
- `fields/types/cloudinaryimage/CloudinaryImageFilter.mjs`
- `fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs`
- `fields/types/color/ColorColumn.mjs`
- `fields/types/date/DateColumn.mjs`
- `fields/types/date/DateFilter.mjs`
- `fields/types/datearray/DateArrayFilter.mjs`
- `fields/types/email/EmailColumn.mjs`
- `fields/types/file/FileColumn.mjs`
- `fields/types/geopoint/GeoPointColumn.mjs`
- `fields/types/geopoint/GeoPointFilter.mjs`
- `fields/types/localfiles/LocalFilesColumn.mjs`
- `fields/types/localfiles/LocalFilesField.mjs`
- `fields/types/location/LocationColumn.mjs`
- `fields/types/location/LocationFilter.mjs`
- `fields/types/markdown/MarkdownColumn.mjs`
- `fields/types/name/NameColumn.mjs`
- `fields/types/number/NumberColumn.mjs`
- `fields/types/number/NumberFilter.mjs`
- `fields/types/numberarray/NumberArrayFilter.mjs`
- `fields/types/password/PasswordColumn.mjs`
- `fields/types/password/PasswordFilter.mjs`
- `fields/types/relationship/RelationshipColumn.mjs`
- `fields/types/relationship/RelationshipFilter.mjs`
- `fields/types/select/SelectColumn.mjs`
- `fields/types/text/TextColumn.mjs`
- `fields/types/text/TextFilter.mjs`
- `fields/types/textarray/TextArrayFilter.mjs`
- `fields/types/url/UrlColumn.mjs`

### PropTypes Files

These files must be touched by the PropTypes pass. Move `React.PropTypes` and
`{ PropTypes } from 'react'` to `import PropTypes from 'prop-types'`.

- `admin/client-legacy/App/components/Footer/index.mjs`
- `admin/client-legacy/App/components/Navigation/Mobile/ListItem.mjs`
- `admin/client-legacy/App/components/Navigation/Mobile/SectionItem.mjs`
- `admin/client-legacy/App/components/Navigation/Mobile/index.mjs`
- `admin/client-legacy/App/components/Navigation/Primary/NavItem.mjs`
- `admin/client-legacy/App/components/Navigation/Primary/index.mjs`
- `admin/client-legacy/App/components/Navigation/Secondary/NavItem.mjs`
- `admin/client-legacy/App/components/Navigation/Secondary/index.mjs`
- `admin/client-legacy/App/elemental/Alert/index.mjs`
- `admin/client-legacy/App/elemental/BlankState/index.mjs`
- `admin/client-legacy/App/elemental/Button/index.mjs`
- `admin/client-legacy/App/elemental/Center/index.mjs`
- `admin/client-legacy/App/elemental/Chip/index.mjs`
- `admin/client-legacy/App/elemental/Container/index.mjs`
- `admin/client-legacy/App/elemental/Form/index.mjs`
- `admin/client-legacy/App/elemental/FormField/index.mjs`
- `admin/client-legacy/App/elemental/FormInput/index.mjs`
- `admin/client-legacy/App/elemental/FormInput/noedit.mjs`
- `admin/client-legacy/App/elemental/FormLabel/index.mjs`
- `admin/client-legacy/App/elemental/FormNote/index.mjs`
- `admin/client-legacy/App/elemental/FormSelect/index.mjs`
- `admin/client-legacy/App/elemental/Glyph/index.mjs`
- `admin/client-legacy/App/elemental/GlyphButton/index.mjs`
- `admin/client-legacy/App/elemental/GlyphField/index.mjs`
- `admin/client-legacy/App/elemental/GridCol/index.mjs`
- `admin/client-legacy/App/elemental/GridRow/index.mjs`
- `admin/client-legacy/App/elemental/InlineGroup/index.mjs`
- `admin/client-legacy/App/elemental/InlineGroupSection/index.mjs`
- `admin/client-legacy/App/elemental/LabelledControl/index.mjs`
- `admin/client-legacy/App/elemental/LoadingButton/index.mjs`
- `admin/client-legacy/App/elemental/Modal/dialog.mjs`
- `admin/client-legacy/App/elemental/Modal/footer.mjs`
- `admin/client-legacy/App/elemental/Modal/header.mjs`
- `admin/client-legacy/App/elemental/Pagination/index.mjs`
- `admin/client-legacy/App/elemental/Pagination/page.mjs`
- `admin/client-legacy/App/elemental/PassContext/index.mjs`
- `admin/client-legacy/App/elemental/Portal/index.mjs`
- `admin/client-legacy/App/elemental/ResponsiveText/index.mjs`
- `admin/client-legacy/App/elemental/SegmentedControl/index.mjs`
- `admin/client-legacy/App/elemental/Spinner/index.mjs`
- `admin/client-legacy/App/screens/Home/components/ListTile.mjs`
- `admin/client-legacy/App/screens/Home/components/Lists.mjs`
- `admin/client-legacy/App/screens/Home/components/Section.mjs`
- `admin/client-legacy/App/screens/Item/components/AltText.mjs`
- `admin/client-legacy/App/screens/Item/components/Drilldown.mjs`
- `admin/client-legacy/App/screens/Item/components/DrilldownItem.mjs`
- `admin/client-legacy/App/screens/Item/components/EditForm.mjs`
- `admin/client-legacy/App/screens/Item/components/EditFormHeader.mjs`
- `admin/client-legacy/App/screens/Item/components/EditFormHeaderSearch.mjs`
- `admin/client-legacy/App/screens/Item/components/FooterBar.mjs`
- `admin/client-legacy/App/screens/Item/components/FormHeading.mjs`
- `admin/client-legacy/App/screens/Item/components/RelatedItemsList/RelatedItemsList.mjs`
- `admin/client-legacy/App/screens/Item/components/RelatedItemsList/RelatedItemsListDragDrop.mjs`
- `admin/client-legacy/App/screens/Item/components/RelatedItemsList/RelatedItemsListRow.mjs`
- `admin/client-legacy/App/screens/Item/components/Toolbar/ToolbarSection.mjs`
- `admin/client-legacy/App/screens/Item/components/Toolbar/index.mjs`
- `admin/client-legacy/App/screens/Item/index.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/Filter.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFilters.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAdd.mjs`
- `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAddForm.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTable.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDrop.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDropZone.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableDragDropZoneTarget.mjs`
- `admin/client-legacy/App/screens/List/components/ItemsTable/ItemsTableRow.mjs`
- `admin/client-legacy/App/screens/List/components/ListControl.mjs`
- `admin/client-legacy/App/screens/List/components/ListDownloadForm.mjs`
- `admin/client-legacy/App/screens/List/components/ListHeaderButton.mjs`
- `admin/client-legacy/App/screens/List/components/ListHeaderSearch.mjs`
- `admin/client-legacy/App/screens/List/components/ListHeaderTitle.mjs`
- `admin/client-legacy/App/screens/List/components/ListHeaderToolbar.mjs`
- `admin/client-legacy/App/screens/List/components/ListManagement.mjs`
- `admin/client-legacy/App/screens/List/components/ListSort.mjs`
- `admin/client-legacy/App/screens/List/components/UpdateForm.mjs`
- `admin/client-legacy/App/screens/List/index.mjs`
- `admin/client-legacy/App/shared/AlertMessages.mjs`
- `admin/client-legacy/App/shared/ConfirmationDialog.mjs`
- `admin/client-legacy/App/shared/CreateForm.mjs`
- `admin/client-legacy/App/shared/FlashMessage.mjs`
- `admin/client-legacy/App/shared/FlashMessages.mjs`
- `admin/client-legacy/App/shared/InvalidFieldType.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutBody.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutFooter.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutHeader.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutList.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutListHeading.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutListItem.mjs`
- `admin/client-legacy/App/shared/Popout/PopoutPane.mjs`
- `admin/client-legacy/App/shared/Popout/index.mjs`
- `admin/client-legacy/Signin/components/Alert.mjs`
- `admin/client-legacy/Signin/components/LoginForm.mjs`
- `admin/client-legacy/Signin/components/UserInfo.mjs`
- `fields/components/Checkbox.mjs`
- `fields/components/DateInput.mjs`
- `fields/components/FileChangeMessage.mjs`
- `fields/components/HiddenFileInput.mjs`
- `fields/components/ImageThumbnail.mjs`
- `fields/components/ItemsTableValue.mjs`
- `fields/components/columns/ArrayColumn.mjs`
- `fields/components/columns/CloudinaryImageSummary.mjs`
- `fields/components/columns/IdColumn.mjs`
- `fields/components/columns/InvalidColumn.mjs`
- `fields/explorer/components/Col.mjs`
- `fields/explorer/components/FieldSpec.mjs`
- `fields/explorer/components/FieldType.mjs`
- `fields/explorer/components/Row.mjs`
- `fields/explorer/index.mjs`
- `fields/types/boolean/BooleanColumn.mjs`
- `fields/types/boolean/BooleanField.mjs`
- `fields/types/boolean/BooleanFilter.mjs`
- `fields/types/cloudinaryimage/CloudinaryImageColumn.mjs`
- `fields/types/cloudinaryimage/CloudinaryImageField.mjs`
- `fields/types/cloudinaryimage/CloudinaryImageFilter.mjs`
- `fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs`
- `fields/types/cloudinaryimages/CloudinaryImagesThumbnail.mjs`
- `fields/types/color/ColorColumn.mjs`
- `fields/types/color/ColorField.mjs`
- `fields/types/date/DateColumn.mjs`
- `fields/types/date/DateField.mjs`
- `fields/types/date/DateFilter.mjs`
- `fields/types/datearray/DateArrayField.mjs`
- `fields/types/datearray/DateArrayFilter.mjs`
- `fields/types/email/EmailColumn.mjs`
- `fields/types/email/EmailField.mjs`
- `fields/types/file/FileField.mjs`
- `fields/types/geopoint/GeoPointColumn.mjs`
- `fields/types/geopoint/GeoPointFilter.mjs`
- `fields/types/localfiles/LocalFilesField.mjs`
- `fields/types/location/LocationColumn.mjs`
- `fields/types/location/LocationFilter.mjs`
- `fields/types/markdown/MarkdownColumn.mjs`
- `fields/types/money/MoneyField.mjs`
- `fields/types/name/NameColumn.mjs`
- `fields/types/name/NameField.mjs`
- `fields/types/number/NumberColumn.mjs`
- `fields/types/numberarray/NumberArrayFilter.mjs`
- `fields/types/password/PasswordColumn.mjs`
- `fields/types/password/PasswordFilter.mjs`
- `fields/types/relationship/RelationshipColumn.mjs`
- `fields/types/relationship/RelationshipFilter.mjs`
- `fields/types/select/SelectColumn.mjs`
- `fields/types/select/SelectFilter.mjs`
- `fields/types/text/TextColumn.mjs`
- `fields/types/text/TextFilter.mjs`
- `fields/types/textarray/TextArrayFilter.mjs`
- `fields/types/url/UrlColumn.mjs`

### String Ref and `this.refs` Files

These are not hard blockers for React 16, but they are the main ref-related
legacy surface. Prefer callback refs when a file is already being edited, and
make sure these areas are included in manual smoke testing.

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

These files need focused regression testing because `findDOMNode` is used for
focus management, CodeMirror mounting, popout layout, and filters.

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

These work in React 16.14 but produce development warnings. Prefer refactoring
where behavior is clear; otherwise rename to `UNSAFE_*` to make the technical
debt explicit.

- `admin/client-legacy/App/elemental/Modal/dialog.mjs`
- `admin/client-legacy/App/elemental/ScrollLock/index.mjs`
- `admin/client-legacy/App/screens/Item/index.mjs`
- `admin/client-legacy/App/screens/List/index.mjs`
- `admin/client-legacy/App/shared/Popout/index.mjs`
- `fields/components/DateInput.mjs`
- `fields/mixins/ArrayField.mjs`
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

These APIs continue to work in React 16.x. Do not expand their usage. Migrate
only when touching the relevant Elemental wrappers or when preparing for React
17+.

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

### Phase 0: Baseline and Safety Net

Before changing dependencies:

1. Confirm branch and clean state:

   ```sh
   git status -sb
   git branch --show-current
   ```

2. Capture the React 15 baseline:

   ```sh
   npm ci
   npm run build-dev
   npm run build:server
   npm run test:unit
   npm run admin-next:build
   npm run test:e2e-ui
   npm run test:e2e-ui:fields
   ```

3. Save e2e screenshots/traces from any flaky areas before migration.

4. Record current bundle sizes:

   ```sh
   wc -c admin/public-legacy/js/packages.js \
     admin/public-legacy/js/fields.js \
     admin/public-legacy/js/signin.js \
     admin/public-legacy/js/admin.js
   ```

5. Record current dependency state:

   ```sh
   npm ls react react-dom react-addons-css-transition-group elemental \
     react-day-picker react-domify enzyme --depth=1
   ```

Phase 0 is complete only when the baseline is known. Do not start React 16 work
from a failing or unknown baseline.

### Phase 1: Make Removed React 16 APIs Explicit

Goal: the app still runs on React 15, but no source imports removed APIs from
`react`.

Tasks:

1. Add direct dependencies:

   ```sh
   npm install create-react-class@^15.7.0 prop-types@^15.8.1
   ```

2. Convert `React.createClass`:

   Preferred low-risk pattern:

   ```js
   import React from 'react';
   import createReactClass from 'create-react-class';

   export default createReactClass({
     displayName: 'ComponentName',
     render() {
       return <div />;
     },
   });
   ```

   Use ES classes or functions only when there are no mixins, statics, autobound
   method assumptions, or complex refs.

3. Convert prop types:

   ```js
   import React from 'react';
   import PropTypes from 'prop-types';

   Component.propTypes = {
     label: PropTypes.string,
   };
   ```

4. Preserve `contextTypes` and `childContextTypes` behavior by using
   `PropTypes` from `prop-types`.

5. Rerun:

   ```sh
   rg "React\\.createClass|React\\.PropTypes|import .*PropTypes.* from ['\\\"]react" admin/client-legacy fields
   npm run build-dev
   npm run test:unit
   ```

Acceptance:

- No `React.createClass`.
- No `React.PropTypes`.
- No `{ PropTypes } from 'react'`.
- Legacy bundles still compile on React 15.

### Phase 2: Replace React 15-Only Packages

Goal: remove dependency blockers before installing React 16.

Tasks:

1. Replace `react-addons-css-transition-group`.

   Current imports:

   - `admin/client-legacy/App/components/Navigation/Mobile/index.mjs`
   - `admin/client-legacy/App/screens/List/components/Filtering/ListFiltersAdd.mjs`
   - `admin/client-legacy/App/shared/Popout/PopoutHeader.mjs`
   - `admin/client-legacy/App/shared/Popout/index.mjs`
   - `admin/client-legacy/App/elemental/Portal/index.mjs`

   Low-risk option:

   ```js
   import Transition from 'react-transition-group/CSSTransitionGroup';
   ```

   with `react-transition-group@1.x`.

   Do not jump to `react-transition-group@2+` in this milestone; v2+ is not a
   drop-in replacement for the old addon API.

2. Resolve `elemental`.

   Current risk:

   - `admin/client-legacy/packages.mjs` exposes external `elemental`.
   - `fields/mixins/ArrayField.mjs` imports from external `elemental`.
   - Most admin code imports local `admin/client-legacy/App/elemental`.

   Preferred preservation strategy:

   - Create a local compatibility package or Browserify alias named `elemental`
     that re-exports `admin/client-legacy/App/elemental`.
   - Keep `elemental` exposed in `packages.js` for custom field compatibility.
   - Remove the npm `elemental@0.6.1` dependency once the shim is in place.

   Alternative:

   - Fork `elemental@0.6.1`, update its peer range to include React 16, and keep
     runtime behavior unchanged.

3. Resolve `react-day-picker`.

   Affected files:

   - `fields/components/DateInput.mjs`
   - `fields/types/datearray/DateArrayFilter.mjs`

   Current usage depends on:

   - default `DayPicker` import
   - `onDayClick`
   - `modifiers`
   - `ref` access to `showMonth`
   - `react-day-picker` CSS class names

   Preferred option:

   - Upgrade to `react-day-picker@7.4.10`, which supports React 16 and keeps the
     default `DayPicker` component API close enough to audit.
   - Verify `showMonth` still exists on the component instance.
   - Verify selected-day modifiers and datearray between-mode behavior.

   Avoid `react-day-picker@8+` in this milestone because it has a different API
   shape and extra `date-fns` peer.

4. Resolve `react-domify`.

   Affected file:

   - `fields/explorer/components/FieldSpec.mjs`

   Options:

   - Replace with a tiny local JSON/value renderer in field explorer.
   - Fork/vendor `react-domify` with a React 16 peer range.

5. Upgrade Enzyme tests.

   ```sh
   npm install --save-dev enzyme@^3.11.0 enzyme-adapter-react-16@^1.15.8
   ```

   Add a shared test setup that runs:

   ```js
   import Enzyme from 'enzyme';
   import Adapter from 'enzyme-adapter-react-16';

   Enzyme.configure({ adapter: new Adapter() });
   ```

   Then wire that setup into Mocha/Jiti test boot. Audit Enzyme 3 behavior
   changes, especially stale wrappers after state changes and selector matching.

Acceptance:

- `npm ls` no longer reports legacy React 15-only package peers that block
  React 16.
- Unit tests still run on React 15 or in a temporary React 16 install branch.
- `packages.js` still exposes the same public package names unless an explicit
  compatibility decision is documented.

### Phase 3: Install React 16

Goal: update the runtime major version.

Tasks:

1. Install React 16:

   ```sh
   npm install react@^16.14.0 react-dom@^16.14.0
   ```

2. Regenerate `package-lock.json`.

3. Verify package resolution:

   ```sh
   npm ls react react-dom --depth=2
   npm ls react-addons-css-transition-group elemental react-day-picker react-domify enzyme --depth=1
   ```

4. Run build checks:

   ```sh
   npm run build-dev
   npm run build:server
   npm run admin-next:build
   ```

5. Inspect generated legacy bundles for obvious duplicate React copies:

   ```sh
   rg "React\\.version|16\\.14|15\\.7|react-dom" admin/public-legacy/js/packages.js
   ```

Acceptance:

- Root `react` and `react-dom` resolve to React 16.14.
- No duplicate React 15 runtime remains in the legacy browser bundle.
- Admin-next still builds via `react18`/`react-dom18` aliases.

### Phase 4: React 16 Runtime Warning Cleanup

Goal: eliminate warnings we own and document warnings we do not own.

Tasks:

1. Run legacy admin in development mode with console warning capture.

2. Address our `componentWill*` warnings:

   - Refactor to `componentDidMount` / `componentDidUpdate` /
     `getDerivedStateFromProps` where behavior is clear.
   - Rename to `UNSAFE_*` only when a real refactor is too risky for this
     milestone.

3. Address string refs opportunistically in high-risk files:

   - Date fields
   - Filter popouts
   - CodeMirror field
   - File upload fields
   - Relationship filter/search controls

4. Replace `findDOMNode` in files where direct DOM refs are straightforward.

5. Consider introducing an admin legacy error boundary around major routes:

   - Home
   - List
   - Item
   - Signin

   React 16 unmounts the full tree for uncaught render/lifecycle errors, so an
   error boundary can preserve a better failure mode. This is optional for the
   initial migration but should be considered if e2e reveals blank screens.

Acceptance:

- No warning from our code for removed React 15 APIs.
- Every remaining lifecycle/string-ref/findDOMNode warning has an owner and a
  follow-up issue or checklist item.

### Phase 5: Functional Regression Pass

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

Also run targeted specs:

```sh
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/auth.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/home.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/list-view.spec.ts
playwright test --config=e2e-ui/playwright.config.ts e2e-ui/tests/item-edit.spec.ts
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
- Edit markdown, HTML, code, password, select, boolean, text, textarea,
  number, money, URL, email, key, name, location, geopoint, file, localfiles,
  Cloudinary image, and Cloudinary images fields.
- Verify Cloudinary image lightbox.
- Verify drag sorting for sortable lists and related item rows.
- Verify field explorer renders.

Browser console gate:

- Treat uncaught errors as failures.
- Treat React migration warnings as failures unless listed in the warning
  allowlist created in Phase 4.

### Phase 6: Package and Public API Verification

Goal: preserve Keystone package consumers.

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

If the `elemental` package exposure changes, verify a representative custom
field bundle can still import `elemental` from the legacy browser package bundle.

## Risk Areas and Preservation Notes

### `create-react-class` and Autobinding

`React.createClass` autobinds methods. ES classes do not. For any component that
passes instance methods directly as callbacks, converting directly to a class can
break `this`. Use `create-react-class` for the first migration pass unless the
component is trivial.

### Mixins

`fields/types/Field.mjs` dynamically creates field components and mixins are
used by array fields. Keep `create-react-class` for these areas until the field
factory is redesigned. Do not attempt a broad class conversion here.

### String Refs

String refs still work in React 16, but they are a later migration blocker. If a
file must be touched for React 16 compatibility and the ref conversion is local,
prefer callback refs:

```js
setInputRef = (input) => {
  this.input = input;
};
```

For `create-react-class` components, define a method in the spec and assign
`ref={this.setInputRef}`.

### `findDOMNode`

`findDOMNode` is mostly used for focus and CodeMirror mounting. Replace only
when the target component can expose a DOM ref without changing behavior. Do not
wrap fields in extra DOM nodes to avoid `findDOMNode` unless CSS/layout has been
checked.

### Portals and Popouts

The app has custom detached-node rendering. React 16 supports `createPortal`.
Migration options:

- Leave current `ReactDOM.render` portal implementations for React 16 if they
  work and are covered.
- Convert `admin/client-legacy/App/shared/Portal.mjs` and
  `admin/client-legacy/App/elemental/Portal/index.mjs` to `createPortal` once
  popout positioning and transition behavior are covered by tests.

Do not rewrite popouts without e2e coverage around filters, date pickers,
modals, and relationship dropdowns.

### Date Pickers

`react-day-picker@2.5.0` is a hard React 16 peer blocker. Date behavior is
high-risk because it combines moment parsing, custom formats, popouts, and
imperative `showMonth`.

Tests must cover:

- `DateInput` focus opens the picker.
- Selecting a day writes the formatted value.
- Typing a valid date and pressing Enter updates state.
- Invalid date text does not submit.
- Date filters apply on/after/before/between modes.
- Datearray between mode alternates active inputs correctly.

### Elemental

There is both a local Elemental implementation and an external `elemental`
package. The external package is a peer blocker and also a public compatibility
surface because it is bundled into `packages.js`.

Do not simply remove `elemental` from `packages.mjs` unless custom field
compatibility has been intentionally dropped. The safer approach is a local shim
that preserves the package name while re-exporting the local implementation.

### Enzyme

Enzyme 3 requires an adapter. Most shallow tests may pass with minimal edits,
but Enzyme 3 has behavior differences:

- Wrappers may need to be re-found after state changes.
- `children()` semantics changed.
- `find()` may return both composite and host nodes.

Keep Enzyme migration commits separate from React runtime commits so failures
are easier to diagnose.

### Admin-Next Peer Conflicts

React 16 does not solve the current `@tiptap/react` or TanStack peer conflicts:

- `@tiptap/react@3.x` requires React 17, 18, or 19.
- `@tanstack/react-query@5` and `@tanstack/react-router@1` require React 18 or
  newer.

React 16 is still useful because it reduces the legacy migration gap. The peer
conflict cleanup still requires either:

- a later root migration to React 18, or
- dependency isolation for `admin/client-next`.

## Commit Strategy

Use small, reviewable commits:

1. Add migration plan document.
2. Add `create-react-class` and `prop-types` direct dependencies.
3. Convert `React.createClass`.
4. Convert `React.PropTypes` and `PropTypes from react`.
5. Replace transition addon.
6. Resolve Elemental package exposure.
7. Upgrade/replace DayPicker.
8. Replace/remove `react-domify`.
9. Upgrade Enzyme and configure adapter.
10. Install React 16.
11. React 16 warning cleanup.
12. E2E/test stabilization.

Avoid combining dependency upgrades with large source rewrites. If a test fails,
the owner should be obvious from the commit.

## Rollback Strategy

If React 16 breaks a legacy workflow:

1. Reproduce with a specific test or manual route.
2. Check whether the failure comes from:
   - React runtime version.
   - Package replacement.
   - createClass/PropTypes codemod.
   - Enzyme/test-only behavior.
   - Browserify package exposure.
3. Revert only the smallest commit that introduced the failure.
4. Keep dependency and source changes separated so rollback does not remove
   unrelated migration progress.

Do not use `git reset --hard` during migration unless explicitly agreed.

## Definition of Done

React 16 migration is complete when:

- Root `react` and `react-dom` are `16.14.x`.
- `rg "React\\.createClass|React\\.PropTypes|import .*PropTypes.* from ['\\\"]react" admin/client-legacy fields` returns no matches.
- React 15-only direct dependencies have been replaced, forked, or shimmed.
- `npm ls react react-dom` is clean for the legacy dependency tree.
- `npm run build-dev` passes.
- `npm run build` passes.
- `npm run test:unit` passes.
- `npm run test:e2e-ui` passes.
- `npm run test:e2e-ui:fields` passes.
- Legacy admin manual smoke checks pass.
- Browser console has no uncaught errors and no undocumented React migration
  warnings.
- Package verification passes.
- The migration notes in this document are updated with any deviations.

## Reference Links

- React 15.5 migration notes for `React.PropTypes`, `React.createClass`, addons,
  and codemods: https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html
- React 16 release and upgrade notes: https://legacy.reactjs.org/blog/2017/09/26/react-v16.0.html
- React async rendering and unsafe lifecycle migration guidance:
  https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html
- React 16.9 lifecycle warning and `rename-unsafe-lifecycles` codemod:
  https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html
- Legacy context documentation:
  https://legacy.reactjs.org/docs/legacy-context.html
- Refs and DOM refs documentation:
  https://legacy.reactjs.org/docs/refs-and-the-dom.html
- React portal documentation:
  https://legacy.reactjs.org/docs/portals.html
- React error boundaries documentation:
  https://legacy.reactjs.org/docs/error-boundaries.html
- React legacy API reference:
  https://react.dev/reference/react/legacy
- Enzyme 2 to 3 migration guide:
  https://enzymejs.github.io/enzyme/docs/guides/migration-from-2-to-3.html
- Enzyme installation and React adapter documentation:
  https://enzymejs.github.io/enzyme/docs/installation/index.html
- `react-addons-css-transition-group` replacement note:
  https://www.npmjs.com/package/react-addons-css-transition-group
- React Transition Group documentation:
  https://reactcommunity.org/react-transition-group/
- React Day Picker v7 documentation:
  https://react-day-picker-v7.netlify.app/docs/getting-started/
