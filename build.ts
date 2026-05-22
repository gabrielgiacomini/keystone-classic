/**
 * @file Bundles the client-side packages required for the Admin UI via
 * Browserify. Reads the entry list from ./admin/client-legacy/packages.mjs and
 * pipes the bundle to stdout.
 * @module build
 * @example
 * // In package.json
 * "scripts": { "build": "jiti build.ts > public/js/bundle.js" }
 */

import browserify from 'browserify';
import packages from './admin/client-legacy/packages.mjs';

const packageNames = packages as string[];
const b = browserify({
	debug: process.env.NODE_ENV !== 'production',
});

const browserifyAliases: Record<string, string> = {
	marked: 'marked/marked.min.js',
};

packageNames.forEach(function (i) {
	b.require(browserifyAliases[i] ?? i, { expose: i });
});

b.bundle().pipe(process.stdout);
