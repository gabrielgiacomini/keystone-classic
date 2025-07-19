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
 * @fileoverview Exports a middleware for adding CORS headers to responses.
 *
 * @see {@link module:keystone.index}
 */

/**
 * Returns a middleware that adds CORS headers to the response.
 *
 * The middleware can be configured via the following `keystone.get` options:
 *
 * - `cors allow origin`
 * - `cors allow methods`
 * - `cors allow headers`
 *
 * @param {Object} keystone The Keystone instance.
 * @returns {Function} A middleware function.
 *
 * @example
 * app.all('/api*', keystone.middleware.cors);
 */
module.exports = function (keystone) {
	// The exported function returns a closure that retains
	// a reference to the keystone instance, so it can be
	// passed as middeware to the express app.
	return function cors (req, res, next) {

		var origin = keystone.get('cors allow origin');
		if (origin) {
			// If `cors allow origin` is true, allow any origin.
			res.header('Access-Control-Allow-Origin', origin === true ? '*' : origin);
		}

		// Set the `Access-Control-Allow-Methods` header.
		if (keystone.get('cors allow methods') !== false) {
			res.header('Access-Control-Allow-Methods', keystone.get('cors allow methods') || 'GET,PUT,POST,DELETE,OPTIONS');
		}

		// Set the `Access-Control-Allow-Headers` header.
		if (keystone.get('cors allow headers') !== false) {
			res.header('Access-Control-Allow-Headers', keystone.get('cors allow headers') || 'Content-Type, Authorization');
		}

		next();
	};
};
