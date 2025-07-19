/**
 * @fileoverview Binds Stylus middleware to the KeystoneJS app.
 *
 * This script enables the Stylus pre-processor for CSS. It can be configured
 * with a single path or an array of paths to watch for `.styl` files.
 *
 * It is invoked by `server/createApp.js`.
 * @see {@link module:server/createApp}
 */
module.exports = function bindStylusMiddleware (keystone, app) {
	// The 'stylus' option can be a single path or an array of paths.
	// When set, we configure the stylus middleware.
	var stylusPaths = keystone.get('stylus');
	var stylusOptions = keystone.get('stylus options') || {};
	var debug = require('debug')('keystone:core:bindStylusMiddleware');
	var _ = require('lodash');
	var safeRequire = require('../lib/safeRequire');

	// Ensure stylusPaths is an array.
	if (typeof stylusPaths === 'string') {
		stylusPaths = [stylusPaths];
	}

	// If stylusPaths is an array, bind the middleware.
	if (Array.isArray(stylusPaths)) {
		debug('adding stylus');
		var stylusMiddleware = safeRequire('stylus', 'stylus').middleware;

		// Bind the middleware for each path.
		stylusPaths.forEach(function (path) {
			app.use(stylusMiddleware(_.extend({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				compress: keystone.get('env') === 'production',
			}, stylusOptions)));
		});
	}
};
