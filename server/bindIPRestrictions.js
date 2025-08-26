/**
 * @fileoverview Binds IP restriction middleware to the KeystoneJS app.
 *
 * This script checks for the 'allowed ip ranges' option and, if present,
 * configures middleware to restrict access to the application based on IP
 * address. It requires the 'trust proxy' setting to be enabled.
 *
 * It is invoked by `server/createApp.js`.
 * @module server/bindIPRestrictions
 * @param {module:keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 * @see {@link module:server/createApp}
 * @example
 * // In a KeystoneJS startup script
 * keystone.init({
 *   'allowed ip ranges': '127.0.0.1',
 *   'trust proxy': true,
 * });
 */
var debug = require('debug')('keystone:server:bindIpRestrictions');

/**
 * Binds IP restriction middleware if the 'allowed ip ranges' option is set.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 */
module.exports = function bindIPRestrictions (keystone, app) {
	// Check for IP range restrictions.
	if (keystone.get('allowed ip ranges')) {
		// Ensure 'trust proxy' is enabled, as it's required for IP restrictions.
		if (!app.get('trust proxy')) {
			console.log(
				'KeystoneJS Initialisaton Error:\n\n'
				+ 'to set IP range restrictions the "trust proxy" setting must be enabled.\n\n'
			);
			process.exit(1);
		}
		debug('adding IP ranges', keystone.get('allowed ip ranges'));
		// Bind the IP restriction middleware.
		app.use(require('../lib/security/ipRangeRestrict')(
			keystone.get('allowed ip ranges'),
			keystone.wrapHTMLError
		));
	}
};
