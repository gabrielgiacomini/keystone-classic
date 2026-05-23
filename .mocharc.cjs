// Mocha 11 configuration. Replaces the deprecated test/mocha.opts and
// test/mocha-admin.opts files.
//
// Tests are being migrated from .mjs to .mts. Mocha loads both extensions
// and uses Node 24's built-in `--experimental-strip-types` to transpile
// `.mts` files on import. Strip-types only removes TypeScript type syntax
// (annotations, `as` casts, interfaces, generic parameters); it does NOT
// rewrite module shape, perform `esModuleInterop`, or touch `.mjs` files.
// This is the critical property: any external TS loader that runs `.mjs`
// files through a TypeScript compile pass (ts-node/register, swc-node,
// esbuild-register, tsx in some configurations) silently corrupts plain
// JavaScript semantics — for example, conflating named/default exports
// or unwrapping async functions.
//
// Historical notes:
// - ts-node/register installs a CJS require hook and an ESM loader hook
//   that re-compiles `.mjs` through TypeScript. Rejected.
// - tsx (--import=tsx/esm, --loader=tsx/esm, register() from tsx/esm/api)
//   all install hooks that intercept Node 24's `require(esm)` integration.
//   Mocha's `require('./mocharc.json')` then routes through the ESM hook,
//   which produces JS source, and Node's `.json` extension handler crashes
//   trying to JSON.parse JS. Reproduces with
//     node --import tsx/esm node_modules/.bin/mocha --help
//   See SyntaxError: "Unexpected token 'v', \"var diff=t\"...". Rejected.
// - @swc-node/register/esm-register avoids the mocha crash but, like
//   ts-node, recompiles `.mjs` through SWC and changes runtime semantics
//   (observed: `getMongooseConnection.mjs`'s default export of a function
//   became the Mongoose instance). Rejected.
// - esbuild-register is a CJS-only require hook; under "type": "module"
//   it produces "ReferenceError: require is not defined". Rejected.
// - `--experimental-strip-types` is Node 24's built-in: zero-dep, only
//   touches `.ts`/`.mts`/`.cts`, preserves `.mjs` byte-for-byte. Selected.
//
// Mocha's config loader does NOT support `.mocharc.mjs` (only .js/.cjs/
// .json/.yml). With package.json `"type": "module"`, a `.js` mocharc
// would be loaded as ESM and break mocha's sync require(). So we use
// the explicit `.cjs` extension here.
//
// See .roadmap/P0-foundation/06-mocha-11.md for context.

module.exports = {
	extension: ['mts', 'mjs'],
	spec: ['test/unit/**/*.{mts,mjs}'],
	'node-option': ['experimental-strip-types', 'no-warnings=ExperimentalWarning'],
	timeout: 30000,
	reporter: 'spec',
	require: ['./test/enzyme.setup.cjs'],
	recursive: true,
	// Force process exit after tests complete. Several test helpers open
	// long-lived resources (mongoose connection in getMongooseConnection.mjs,
	// Express app via getExpressApp, etc.) that keep the event loop alive
	// indefinitely. Without --exit the test job sits forever after the test
	// summary prints.
	exit: true,
	ignore: [
		'test/e2e/**',
		'test/unit/typescript/**',
	],
};
