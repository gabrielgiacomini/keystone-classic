/**
 * @fileoverview This script bundles the client-side packages required for the Admin UI.
 * It uses Browserify to create a bundle of all the packages specified in
 * `./admin/client/packages.js` and outputs it to `stdout`.
 *
 * This is typically used during the build process to generate the client-side
 * JavaScript bundle that powers the KeystoneJS Admin UI.
 * @module build
 * @requires module:browserify
 * @requires module:./admin/client/packages
 * @see {@link module:./admin/client/packages}
 * @example
 * // In package.json
 * "scripts": {
 *   "build": "node build.js > public/js/bundle.js"
 * }
 */

var browserify = require('browserify');
var packages = require('./admin/client/packages');
var path = require('path');

var b = browserify({
	debug: process.env.NODE_ENV !== 'production',
});

packages.forEach(function (i) {
	b.require(i);
});

b.add(path.resolve(__dirname, './admin/client/react-compat-shim.js'));

b.bundle().pipe(process.stdout);
