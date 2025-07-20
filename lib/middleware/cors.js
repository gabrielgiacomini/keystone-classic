/**
 * Adds CORS headers to the response
 *
 * ####Example:
 *
 *     app.all('/api*', keystone.middleware.cors);
 *
 * @param {app.request} req
 * @param {app.response} res
 * @param {function} next
 * @api public
 */

/**
 * @fileoverview Exports a middleware for adding CORS (Cross-Origin Resource Sharing)
 * headers to responses. This is essential for allowing web applications hosted on
 * different domains to make requests to the Keystone API.
 *
 * @see {@link module:keystone.index}
 */

/**
 * Creates a middleware function for handling CORS headers.
 *
 * This middleware reads CORS settings from Keystone's configuration and applies
 * the appropriate `Access-Control-Allow-*` headers to the HTTP response.
 * It can be configured globally in Keystone's init options.
 *
 * @param {import('../../index').Keystone} keystone The Keystone instance, used to access configuration.
 * @returns {import('express').RequestHandler} An Express middleware function that sets CORS headers.
 *
 * @example
 * // To enable CORS for all API routes
 * app.all('/api*', keystone.middleware.cors);
 */
module.exports = function (keystone) {
	// This closure ensures the middleware has access to the Keystone instance.
	return function cors (req, res, next) {

		var origin = keystone.get('cors allow origin');
		if (origin) {
			// If `cors allow origin` is true, allow any origin by sending '*'.
			// Otherwise, send the configured origin string.
			res.header('Access-Control-Allow-Origin', origin === true ? '*' : origin);
		}

		// Set the `Access-Control-Allow-Methods` header. If not configured, defaults to a common set of methods.
		if (keystone.get('cors allow methods') !== false) {
			res.header('Access-Control-Allow-Methods', keystone.get('cors allow methods') || 'GET,PUT,POST,DELETE,OPTIONS');
		}

		// Set the `Access-Control-Allow-Headers` header. If not configured, defaults to common headers.
		if (keystone.get('cors allow headers') !== false) {
			res.header('Access-Control-Allow-Headers', keystone.get('cors allow headers') || 'Content-Type, Authorization');
		}

		next();
	};
};
