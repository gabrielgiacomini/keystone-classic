# ![KeystoneJS](http://v3.keystonejs.com/images/logo.svg)

> **This is a modernization fork of Keystone v4.** It is not the upstream
> [keystonejs/keystone-classic](https://github.com/keystonejs/keystone-classic)
> repository. See [CHANGELOG.md](CHANGELOG.md) for the public change summary.

- [About Keystone](#about-keystone)
- [Getting Started](#getting-started)
- [Project Status](#project-status)
- [License](#license)

## About Keystone

[KeystoneJS](http://v4.keystonejs.com) is a powerful Node.js content management system and web app framework built on the [Express](https://expressjs.com/) web framework and [Mongoose ODM](http://mongoosejs.com). Keystone makes it easy to create sophisticated web sites and apps, and comes with a beautiful auto-generated Admin UI.

This fork currently modernizes Keystone v4 to:

- **ESM-first package output** — server, field, and admin-server sources are native ESM; `package.json` carries `"type": "module"`; package exports include CJS compatibility shims for the main entry points
- **TypeScript build and declarations** — TypeScript sources and generated package declarations are emitted under `dist/`; `strict` and `noUncheckedIndexedAccess` are enabled
- **Mongoose 7** — upgraded from Mongoose 5, with compatibility work for hooks, queries, and legacy list APIs
- **Mocha 11 + chai** — test runner and assertion library modernized
- **Node 20+** — `engines: { "node": ">=20.19.0" }`
- **Admin next rewrite** (in progress) — admin next client in `admin/client-next/` (Vite, React 18, TanStack Router/Query, react-hook-form, zod); runs side-by-side with admin legacy via `keystone.set('admin ui', false | 'legacy' | 'next' | 'both' | 'auto')`; both clients use the standalone admin API at `/keystone-api`

### Documentation

For upstream Keystone v4 documentation and guides, see [v4.keystonejs.com](https://v4.keystonejs.com).

For upstream Keystone v0.3 documentation, see [v3.keystonejs.com](https://v3.keystonejs.com).

## Getting Started

This section provides a short intro to Keystone. The upstream Keystone Classic docs remain the best reference for the original v4 API.

### Requirements

Node.js `>=20.19.0` and MongoDB are required.

### Installation

This fork is currently consumed from Git or from a local checkout unless/until it is published under a package name you control:

```bash
npm install github:gabrielgiacomini/keystone-classic
```

Then import and configure it:

```javascript
import keystone from 'keystone';
```

Read through the [upstream v4 documentation](https://v4.keystonejs.com) to understand the original API surface. Some internals and build/runtime requirements differ in this fork.

### Configuration

Config variables can be passed in an object to the `keystone.init` method, or can be set any time before `keystone.start` is called using `keystone.set(key, value)`. This allows for a more flexible order of execution. For example, if you refer to Lists in your routes you can set the routes after configuring your Lists.

See the [upstream KeystoneJS configuration documentation](https://v4.keystonejs.com/documentation/configuration) for the original option model.

### Admin client modes

This fork separates the admin UI shell from the admin JSON/session/upload API.
The canonical admin API defaults to `/keystone-api`; during migration,
`/{admin legacy path}/api` remains a compatibility alias unless
`keystone.set('admin legacy api alias', false)` is used.

The admin UI shell is selected with `keystone.set('admin ui', mode)` or, for
deployment-time overrides, `KEYSTONE_ADMIN_CLIENT=mode`:

| Mode | Route behavior |
| --- | --- |
| `false` | No admin UI is mounted. The admin API can still be enabled with `admin api`. |
| `legacy` | Legacy Browserify admin is served from `admin legacy path`, default `/keystone`. |
| `next` | Modern Vite admin is served from both `admin legacy path` and `admin next path`, default `/keystone` and `/keystone-next`. This is the opt-in historical-path cutover mode. |
| `both` | Legacy admin stays on `admin legacy path`; modern admin is served from `admin next path`. |
| `auto` | Modern admin is selected when only built-in legacy field browser types are registered; legacy admin is selected when custom legacy field browser code is detected. Startup logs the decision. |

Related path options:

- `admin legacy path`: historical admin route, default `keystone`.
- `admin next path`: migration route for the modern shell, default `keystone-next`.
- `admin api path`: canonical admin API route, default `keystone-api`.

The `next` and `auto -> next` modes are still migration modes. Projects with
custom legacy field browser code should use `auto`, `legacy`, or `both` until
their custom fields are covered by the modern field adapter policy.

Admin-next can load deployment-owned custom field bundles before the app starts:

```js
keystone.set('admin next custom field scripts', [
  '/keystone-next/custom-fields/custom-fields.js',
]);
```

Each script is loaded as a same-origin `<script type="module">` and may assign
`window.Keystone.fieldComponents` for modern component sets or
`window.Keystone.legacyFieldComponents` for legacy `Field`/`Filter`/`Column`
sets. Admin-next registers both maps before rendering.

When building from this repository, you can produce that script with the Vite
helper:

```sh
npm run admin-next:build-custom-fields -- \
  --entry ./admin/custom-fields.ts \
  --outDir ./admin/public-next/custom-fields \
  --fileName custom-fields.js
```

The entry is a normal ES module. It should populate `window.Keystone` with the
custom field maps described above.

The modern custom field compatibility surface is intentionally scoped to those
module scripts and the `window.Keystone.legacyFieldComponents` adapter. The old
legacy `packages.js` vendor bundle is not a supported way to keep using
React Router 3 in custom field browser code; custom field navigation should use
normal links or the modern admin route APIs provided by the custom field module.
See `docs/admin-next-custom-field-migration.md` for the migration checklist and
support policy.
See `docs/admin-modernization-upgrade-guide.md` for the admin mode, package
compatibility, and final decommission checklist.

### Database field types

Keystone builds on the basic data types provided by MongoDB and allows you to easily add rich, functional fields to your application's models.

You get helper methods on your models for dealing with each field type easily (such as formatting a date or number, resizing an image, getting an array of the available options for a select field, or using Google's Places API to improve addresses) as well as a beautiful, responsive admin UI to edit your data with.

See the [upstream KeystoneJS database documentation](https://v4.keystonejs.com/documentation/database) for the original field type and model concepts.

### Core Files

- **`index.mts` / `dist/index.mjs`**: The source and emitted package entry point for the KeystoneJS framework. It initializes a new Keystone instance, configures it with default settings, and extends it with the core functionality required to run a Keystone application. It also exposes the major components of the framework such as `List`, `Field`, and `View`. The exported `keystone` object is a singleton instance of the `Keystone` class, which is the main interface for developers to interact with the framework.

  **Usage**:
  ```javascript
  import keystone from 'keystone';
  ```

- **`admin/client-next` / `admin/public-next`**: The modern admin client source and built static assets. Historical admin paths serve this shell; the legacy browser bundle build has been removed from the package build.

  **Usage**:
  ```bash
  npm run build
  ```

### Running KeystoneJS in Production

When you deploy your KeystoneJS app to production, set `NODE_ENV=production`.

You can do this in your environment or in a `.env` file loaded by your application.

Setting your environment enables certain features (including template caching, simpler error reporting, and HTML minification) that are important in production but annoying in development.

## Project Status

This repository is a maintained modernization fork, not the official Keystone project. Public history is intentionally curated from upstream Keystone Classic `v4.1.1` plus a small set of migration commits.

Use the upstream Keystone Classic documentation for historical behavior, and this repository's source, tests, and [CHANGELOG.md](CHANGELOG.md) for fork-specific behavior.

Issues and pull requests should be opened against this fork if they concern the TypeScript modernization, package build, admin-next work, or compatibility tests.

### Thanks

KeystoneJS is a free and open source community-driven project. Thanks to our many [contributors](https://github.com/keystonejs/keystone/graphs/contributors) and [users](https://github.com/keystonejs/keystone/stargazers) for making it great.

Keystone's development has been led by key contributors including [Jed Watson](https://github.com/JedWatson), [Joss Mackison](https://github.com/jossmac), and [Max Stoiber](https://github.com/mxstbr) and is proudly supported by [Thinkmill](https://thinkmill.com.au) in Sydney, Australia.

## License

(The MIT License)

Copyright (c) 2016-2019 Jed Watson

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
