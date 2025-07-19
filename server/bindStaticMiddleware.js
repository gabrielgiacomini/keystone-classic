/**
 * @fileoverview Binds static asset middleware to the KeystoneJS app.
 *
 * This script configures Express to serve static files from one or more
 * directories. It is used to serve assets like images, stylesheets, and
 * client-side JavaScript.
 *
 * It is invoked by `server/createApp.js`.
 * @see {@link module:server/createApp}
 * @example
 * // In a KeystoneJS startup script
 * keystone.init({
 *   'static': 'public'
 * });
 */
var express = require('express');

/**
 * Binds static asset middleware.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 */
module.exports = function bindStaticMiddleware (keystone, app) {
	// The 'static' option can be a single path or an array of paths.
	var staticPaths = keystone.get('static');
	var staticOptions = keystone.get('static options');

	// Ensure staticPaths is an array.
	if (typeof staticPaths === 'string') {
		staticPaths = [staticPaths];
	}

	// If staticPaths is an array, bind the middleware for each path.
	if (Array.isArray(staticPaths)) {
		staticPaths.forEach(function (value) {
			app.use(express.static(keystone.expandPath(value), staticOptions));
		});
	}
};
