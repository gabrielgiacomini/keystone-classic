/**
 * @fileoverview Binds LESS middleware to the KeystoneJS app.
 *
 * This script enables the LESS pre-processor for CSS. It can be configured
 * with a single path or an array of paths to watch for `.less` files.
 *
 * It is invoked by `server/createApp.js`.
 */
module.exports = function bindLessMiddleware (keystone, app) {
	// The 'less' option can be a single path or an array of paths.
	// When set, we configure the less middleware.
	var lessPaths = keystone.get('less');
	var lessOptions = keystone.get('less options') || {};

	// Ensure lessPaths is an array.
	if (typeof lessPaths === 'string') {
		lessPaths = [lessPaths];
	}

	// If lessPaths is an array, bind the middleware.
	if (Array.isArray(lessPaths)) {
		lessPaths.forEach(function (path) {
			app.use(require('less-middleware')(keystone.expandPath(path), lessOptions));
		});
	}
};
