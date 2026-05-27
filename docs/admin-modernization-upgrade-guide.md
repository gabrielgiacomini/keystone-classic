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

The package now publishes only `dist` through `package.json#files`. The emitted
package currently includes the restored legacy React 18 admin for `/keystone`
and the modern admin assets for `/keystone-next`. The removed vendored React
peer fork tree is not part of the package surface.

`npm run package:verify` guards the current support policy. It rejects retired
package surfaces such as React Router 3, the historical `packages.js` manifest,
Browserify-related build dependencies, Enzyme, and old vendored peer forks.
Legacy-owned dependencies such as Redux, redux-saga, redux-thunk, `xhr`,
`glamor`, `prop-types`, `react-select`, `react-transition-group`, `react-dnd`,
lodash, and moment remain while the legacy admin shell owns `/keystone`.

Stable compatibility surfaces that remain available during migration:

- Server/model field classes under `fields/types/*Type.mts`.
- Shared admin API helpers under `admin/shared/api/*`.
- Shared admin field registry and adapters under `admin/shared/fields/*`.
- Shared list-route state helpers under `admin/shared/state/*`.
- The admin-next custom field module-script bridge.
- The legacy React 18 admin shell for deployments that need the historical
  admin experience.

The following legacy browser/server roots are intentionally present while the
legacy admin shell remains the supported `/keystone` experience:

- `admin/client-legacy/App`
- `admin/client-legacy/Signin`
- `admin/server/templates-legacy`
- `admin/server/routes-legacy`
- `admin/public-legacy`

## Stabilization Checklist

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
6. Keep the protected `admin-parity` required check green for the documented
   soak window before release.
