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
- Changed: a signed-out `GET /session` always answers `{ user: null }`.
- Changed: Password-type fields are omitted from populated relationships,
  exports, caller-supplied `fields` / `select` paths and `List.apiForGet`
  responses.
- Fixed: an id that cannot be cast to a list's `_id` type answers like an id
  that matches no item (`404`; delete skips it) instead of `500`. A plain
  object or an array sent in place of an id is refused the same way, before
  any query runs.
- Changed: a session or `keystone.uid` cookie that carries a user id which
  cannot be cast to the user list's `_id` type is treated as signed out.
- Added: field option `secret: true`. The field is stored and writable, is
  omitted from admin API, export and populate output, and is ignored by
  filters, search and sort. See `docs/api/Field/options.md`.
- Changed: secret and Password-type fields are removed from populated
  relationships on every level, down to 8 levels of populated documents; a
  related document deeper than that is replaced by its id.
- Changed: `autokey` refuses a `from` path that reads a secret or
  Password-type field: when the list registers, or at the first write
  (`save()`, `insertMany`, and the update and replace query operations) when
  the path goes through a relationship. An autokey path that is itself secret
  is still generated and stored, but is left out of admin API and export
  output and is not searched.
- Changed: `List.apiForGet` answers a failed query with
  `500 { err: 'database error' }` and logs the error on the server. A
  duplicate-key error on a unique secret field reports the path, not the
  value.
- Changed: with `searchUsesTextIndex`, a generated text index that covers a
  Password-type or secret path is dropped at start and rebuilt without it. It
  is dropped without being rebuilt when every search field is secret or when
  the schema declares its own text index.
- Changed: text indexes Keystone did not create are never dropped. When one
  covers a Password-type or secret path, a warning is logged and search for
  that list uses regular expressions instead of `$text` until the index is
  removed and the app restarted.
- Changed: search also uses regular expressions instead of `$text` while the
  text index check at start is still running, and after it failed at any
  step, until a later check succeeds.
- Fixed: the `ensureTextIndex` callback is called exactly once. An error it
  throws, or a rejected promise it returns, is logged instead of becoming an
  unhandled rejection.
- Fixed: signin and signout responses set a fresh `XSRF-TOKEN` cookie, so the
  first write after signing in no longer answers `403 invalid csrf`.
