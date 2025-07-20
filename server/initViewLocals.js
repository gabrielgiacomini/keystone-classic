/**
 * @fileoverview Initializes view locals for the KeystoneJS app.
 *
 * This script applies custom `locals` to the Express app and sets the
 * default 'pretty html' option for non-production environments.
 *
 * It is invoked by `server/createApp.js`.
 * @module server/initViewLocals
 * @param {module:keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 * @see {@link module:server/createApp}
 * @example
 * // In a KeystoneJS startup script
 * keystone.init({
 *   'locals': {
 *     site_title: 'My Awesome Website',
 *   }
 * });
 */
var assign = require('object-assign');

/**
 * Initializes view locals.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 */
module.exports = function initViewLocals (keystone, app) {
	// Apply custom locals if they are configured.
	if (typeof keystone.get('locals') === 'object') {
		assign(app.locals, keystone.get('locals'));
	}

	// Set the default 'pretty html' mode in non-production environments
	// if it hasn't been explicitly set.
	if (app.locals.pretty === undefined && keystone.get('env') !== 'production') {
		app.locals.pretty = true;
	}
};
