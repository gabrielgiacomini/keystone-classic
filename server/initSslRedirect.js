/**
 * @fileoverview Sets up SSL redirection middleware for the KeystoneJS app.
 *
 * This script configures a middleware to enforce SSL by redirecting HTTP
 * requests to HTTPS. It is enabled when the `ssl` option is set to 'force'.
 *
 * It is invoked by `server/createApp.js`.
 * @module server/initSslRedirect
 * @param {module:keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 * @see {@link module:server/createApp}
 * @example
 * // In a KeystoneJS startup script
 * keystone.init({
 *   'ssl': 'force',
 * });
 */
module.exports = function (keystone, app) {
	var portString;

	/**
	 * Middleware to redirect non-secure requests to HTTPS.
	 *
	 * @param {Object} req The Express request object.
	 * @param {Object} res The Express response object.
	 * @param {Function} next The next middleware function.
	 */
	function sslRedirect (req, res, next) {
		if (req.secure) {
			return next();
		}
		// Don't redirect connections from localhost.
		if (req.ip === '127.0.0.1') {
			return next();
		}
		res.redirect(302, 'https://' + req.hostname + portString + req.originalUrl);
	}

	// Bind the SSL redirection middleware if 'ssl' is forced.
	if (keystone.get('ssl') === 'force') {
		var port = keystone.get('ssl public port') || keystone.get('ssl port');
		// Construct the port string for the redirect URL.
		if (Number(port) === 443) {
			portString = '';
		} else {
			portString = ':' + port;
		}
		app.use(sslRedirect);
	}
};
