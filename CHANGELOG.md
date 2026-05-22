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
