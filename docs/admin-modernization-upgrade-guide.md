# Admin Modernization Upgrade Guide

This guide summarizes the compatibility policy for moving a Keystone 4 project
from the legacy admin client to admin-next.

## Choose an Admin Mode

Use `keystone.set('admin ui', mode)` or `KEYSTONE_ADMIN_CLIENT=mode`.

| Mode | Use when |
| --- | --- |
| `legacy` | You need the historical admin shell and legacy custom field browser runtime. |
| `both` | You are comparing legacy and admin-next in the same deployment. |
| `auto` | You want admin-next for built-in fields while keeping legacy for registered custom legacy field browser code. |
| `next` | You are ready for the modern shell to own both the historical admin path and the admin-next path. |
| `false` | You want the admin API without an admin browser UI. |

The canonical admin API is `admin api path`, default `/keystone-api`. The
historical `/{admin legacy path}/api` alias is compatibility-only and can be
disabled with `admin legacy api alias: false`.

## Custom Field Compatibility

Admin-next custom field browser code is loaded through same-origin ES module
scripts configured with `admin next custom field scripts`.

Supported custom field surfaces:

- `window.Keystone.fieldComponents` for modern component sets.
- `window.Keystone.legacyFieldComponents` for legacy `Field`/`Filter`/`Column`
  component sets adapted through `admin/shared/fields/legacyAdapters`.
- `npm run admin-next:build-custom-fields` for building deployment-owned module
  scripts.

Not supported in admin-next:

- Depending on the historical `packages.js` vendor bundle.
- Importing React Router 3 from Keystone-provided browser packages.
- Depending on Browserify runtime bundling for built-in admin behavior.

See `docs/admin-next-custom-field-migration.md` for examples and the migration
checklist.

## Package Compatibility Notes

The package now publishes only `dist` through `package.json#files`. The removed
vendored React peer fork tree is not part of the package surface.

Retired direct dependencies are guarded by `npm run package:verify`, including
React Router 3, Redux, redux-saga, redux-thunk, Browserify-related packages,
legacy React component helpers, Enzyme, lodash, moment, and legacy UI-only
packages that no longer own built-in behavior.

Stable compatibility surfaces that remain available during migration:

- Server/model field classes under `fields/types/*Type.mts`.
- Shared admin API helpers under `admin/shared/api/*`.
- Shared admin field registry and adapters under `admin/shared/fields/*`.
- Shared list-route state helpers under `admin/shared/state/*`.
- The admin-next custom field module-script bridge.

Legacy browser/server roots are not final support surfaces. The final
decommission gate requires these roots to stay out of the package tree:

- `admin/client-legacy/App`
- `admin/client-legacy/Signin`
- `admin/client-legacy/packages.mjs`
- `admin/server/templates-legacy`
- `admin/server/routes-legacy`
- `admin/public-legacy`

## Decommission Checklist

1. Run admin-next in `both` or `auto` mode and compare workflows.
2. Migrate custom fields to module scripts using
   `docs/admin-next-custom-field-migration.md`.
3. Close every row in `docs/admin-modernization-parity-ledger.md` as
   `Complete` or `Out of scope`.
4. Run the standard verification gates:

   ```sh
   npm run lint
   npm run typecheck
   npm run build
   npm run test:unit
   npm run test:e2e-ui
   npm run test:e2e-ui:fields
   npm run package:verify
   ```

5. Run `npm run admin-parity:final`.
6. Remove or isolate the legacy roots named above.
7. Re-run `npm run admin-parity:final` and package verification before release.
