/**
 * @fileoverview Binds SASS middleware to the KeystoneJS app.
 *
 * This script enables the SASS pre-processor for CSS. It can be configured
 * with a single path or an array of paths to watch for `.scss` files.
 *
 * It is invoked by `server/createApp.js`.
 */
module.exports = function bindSassMiddleware (keystone, app) {
	// The 'sass' option can be a single path or an array of paths.
	// When set, we configure the node-sass middleware.
	var sassPaths = keystone.get('sass');
	var sassOptions = keystone.get('sass options') || {};
	var debug = require('debug')('keystone:core:bindSassMiddleware');
	var _ = require('lodash');
	var safeRequire = require('../lib/safeRequire');

	// Ensure sassPaths is an array.
	if (typeof sassPaths === 'string') {
		sassPaths = [sassPaths];
	}

	// If sassPaths is an array, bind the middleware.
	if (Array.isArray(sassPaths)) {
		debug('adding sass');
		var sassMiddleware = safeRequire('node-sass-middleware', 'sass');

		// Set the output style based on the environment.
		var outputStyle = keystone.get('env') === 'production' ? 'compressed' : 'nested';

		// Bind the middleware for each path.
		sassPaths.forEach(function (path) {
			app.use(sassMiddleware(_.extend({
				src: keystone.expandPath(path),
				dest: keystone.expandPath(path),
				outputStyle: outputStyle,
			}, sassOptions)));
		});
	}
};
