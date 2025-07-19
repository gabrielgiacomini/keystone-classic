/**
 * @fileoverview Initializes the 'trust proxy' setting in the KeystoneJS app.
 *
 * This script configures the Express 'trust proxy' setting, which is necessary
 * when running a Node.js application behind a reverse proxy (e.g., Nginx,
 * Heroku). It allows Express to correctly interpret the `X-Forwarded-For`
 * header.
 *
 * It is invoked by `server/createApp.js`.
 * @see {@link module:server/createApp}
 * @example
 * // In a KeystoneJS startup script
 * keystone.init({
 *   'trust proxy': true
 * });
 */
module.exports = function initTrustProxy (keystone, app) {
	// Enable or disable 'trust proxy' based on the Keystone configuration.
	if (keystone.get('trust proxy') === true) {
		app.enable('trust proxy');
	} else {
		app.disable('trust proxy');
	}
};
