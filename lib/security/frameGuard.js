/**
 * @fileoverview This file provides middleware for adding iframe protection headers to HTTP responses.
 * It helps prevent clickjacking attacks by controlling how the site can be framed.
 * The behavior is configured via the 'frame guard' option in KeystoneJS.
 * @module lib/security/frameGuard
 * @see module:server/createApp
 */

/**
 * Middleware to add iframe protection headers to the response.
 *
 * ####Example:
 *
 *     app.use(keystone.security.frameGuard(keystone));
 *
 * @param {object} keystone The KeystoneJS instance.
 * @returns {function} An Express middleware function.
 * @api public
 */
module.exports = function (keystone) {
	/**
	 * Express middleware to set the X-Frame-Options header.
	 *
	 * @param {object} req The Express request object.
	 * @param {object} res The Express response object.
	 * @param {function} next The next middleware function in the stack.
	 */
	return function frameGuard (req, res, next) {
		// Get the 'frame guard' option from Keystone's configuration.
		var options = keystone.get('frame guard');
		// If the option is set, add the 'x-frame-options' header to the response.
		if (options) {
			res.header('x-frame-options', options);
		}
		// Pass control to the next middleware.
		next();
	};
};
