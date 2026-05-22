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
- **Admin next rewrite** (in progress) — admin next client in `admin/client-next/` (Vite, React 18, TanStack Router/Query, react-hook-form, zod); runs side-by-side with admin legacy via `keystone.set('admin ui', false | 'legacy' | 'next' | 'both')`; both clients use the standalone admin API at `/keystone-api`

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

- **`scripts/build-legacy-admin-bundles.ts`**: This script builds the prebuilt admin legacy browser bundles shipped in `admin/public-legacy/js/` and copied to `dist/admin/public-legacy/js/`. Browserify remains dev tooling for this build and for explicit runtime-bundler opt-in cases, but normal production installs serve the prebuilt `admin.js`, `fields.js`, `signin.js`, and `packages.js` files without Browserify in the production dependency graph.

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
