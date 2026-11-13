# Changelog

This file records changes made by this modernization fork. The original
KeystoneJS changelog is preserved in [HISTORY.md](HISTORY.md).

## Unreleased

- Rebased the fork on Keystone Classic `v4.1.1` with curated public history.
- Converted server, field, and admin-server sources to TypeScript/ESM-first
  modules with generated declarations in `dist/`.
- Added package export maps with ESM entries and CJS compatibility shims for
  main entry points.
- Updated the runtime baseline to Node.js `>=20.19.0`.
- Upgraded the data layer to Mongoose 7 and kept compatibility coverage for
  legacy Keystone list and field behavior.
- Reworked admin delivery into a legacy admin surface plus an in-progress
  `admin/client-next` React/Vite client backed by `/keystone-api`.
- Added unit, public type, API, and Playwright regression suites for the
  modernization work.
- Changed: `GET /session` and `POST /session/signin` return
  `{ id, name, email, canAccessKeystone }` for the signed-in user instead of
  the raw user document. Clients that read other user fields from these
  responses need to fetch them from the item API.
- Changed: Password-type fields are omitted from populated relationships,
  exports, caller-supplied `fields` / `select` paths and `List.apiForGet`
  responses.
- Fixed: an id that cannot be cast to a list's `_id` type answers like an id
  that matches no item (`404`; delete skips it) instead of `500`.
- Added: field option `secret: true`. The field is stored and writable, is
  omitted from admin API, export and populate output, and is ignored by
  filters, search and sort. See `docs/api/Field/options.md`.
- Changed: with `searchUsesTextIndex`, a generated text index that covers a
  Password-type or secret path is dropped and rebuilt without it at start.
  Text indexes Keystone did not create are left alone.
- Fixed: signin and signout responses set a fresh `XSRF-TOKEN` cookie, so the
  first write after signing in no longer answers `403 invalid csrf`.
