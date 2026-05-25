# Admin-Next Custom Field Migration

This guide documents the supported custom field browser contract during the
legacy client modernization.

## Support Policy

Admin-next supports custom field browser code through same-origin ES module
scripts configured with `admin next custom field scripts`.

Supported:

- Modern component sets assigned to `window.Keystone.fieldComponents`.
- Legacy `Field`/`Filter`/`Column` component sets assigned to
  `window.Keystone.legacyFieldComponents`.
- The runtime adapter in `admin/shared/fields/legacyAdapters`.
- The helper build command:

  ```sh
  npm run admin-next:build-custom-fields -- \
    --entry ./admin/custom-fields.ts \
    --outDir ./admin/public-next/custom-fields \
    --fileName custom-fields.js
  ```

Not supported for admin-next:

- Depending on the historical `packages.js` vendor bundle.
- Importing React Router 3 from Keystone-provided browser packages.
- Depending on Browserify runtime bundling for built-in admin behavior.

Projects that still need the historical legacy custom field runtime should use
`admin ui: 'legacy'`, `admin ui: 'both'`, or `admin ui: 'auto'` until their
custom field module has been migrated.

## Configure Scripts

Register one or more module script URLs:

```js
keystone.set('admin next custom field scripts', [
  '/keystone-next/custom-fields/custom-fields.js',
]);
```

Keystone injects these scripts after the `window.Keystone` bootstrap and before
the admin-next app bundle, so custom components are registered before admin-next
renders.

## Modern Component Map

A modern custom field module should assign a component set by field type:

```ts
const runtime = globalThis.window ?? globalThis;

runtime.Keystone = {
  ...(runtime.Keystone ?? {}),
  fieldComponents: {
    ...(runtime.Keystone?.fieldComponents ?? {}),
    customText: {
      Field: CustomTextField,
      Filter: CustomTextFilter,
      Column: CustomTextColumn,
      defaultFilterValue: '',
    },
  },
};
```

The component props are the same modern field props exported from
`admin/shared/fields/types`.

## Legacy Component Map

Legacy custom field modules can keep their existing component shapes while
migrating by assigning `legacyFieldComponents`:

```ts
const runtime = globalThis.window ?? globalThis;

runtime.Keystone = {
  ...(runtime.Keystone ?? {}),
  legacyFieldComponents: {
    ...(runtime.Keystone?.legacyFieldComponents ?? {}),
    customText: {
      Field: LegacyCustomTextField,
      Filter: LegacyCustomTextFilter,
      Column: LegacyCustomTextColumn,
      defaultFilterValue: '',
    },
  },
};
```

Admin-next adapts that set through `registerLegacyFieldComponents()` before the
app renders. The adapter covers the tested legacy text-like, relationship-like,
and upload-style custom field patterns.

## Migration Checklist

1. Move the custom field browser entry to an ES module.
2. Replace imports from the old `packages.js` surface with normal package
   imports or local module code.
3. Replace React Router 3 navigation with normal links or the modern admin route
   APIs exposed to the module.
4. Assign either `window.Keystone.fieldComponents` or
   `window.Keystone.legacyFieldComponents`.
5. Build the module with `admin-next:build-custom-fields`.
6. Configure `admin next custom field scripts` with the generated same-origin
   URL.
7. Run the admin-next route and field parity tests that cover the custom field.

