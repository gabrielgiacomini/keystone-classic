/**
 * @fileoverview Exports a middleware that adds JSON API response methods to the `res` object.
 */

/**
 * Returns a middleware that adds shortcut methods for JSON API responses to the `res` object.
 *
 * The following methods are added:
 *
 * - `res.apiResponse(data)`
 * - `res.apiError(key, err, msg, code)`
 * - `res.apiNotFound(err, msg)`
 * - `res.apiNotAllowed(err, msg)`
 *
 * @param {Object} keystone The Keystone instance.
 * @returns {Function} A middleware function.
 *
 * @example
 * app.all('/api*', keystone.middleware.api);
 */
module.exports = function (keystone) {
	/**
	 * The API middleware function.
	 *
	 * @param {IncomingMessage} req The request object.
	 * @param {ServerResponse} res The response object.
	 * @param {Function} next The next middleware function.
	 */
	return function initAPI (req, res, next) {

		/**
		 * Sends a JSON response.
		 *
		 * If `req.query.callback` is present, it will be treated as a JSONP request.
		 *
		 * @param {Object} data The data to send.
		 */
		res.apiResponse = function (data) {
			if (req.query.callback) {
				res.jsonp(data);
			} else {
				res.json(data);
			}
		};

		/**
		 * Sends a JSON error response.
		 *
		 * @param {string} [key='unknown error'] - The error key.
		 * @param {Object} [err] - The error object.
		 * @param {string} [msg='Error'] - The error message.
		 * @param {number} [code=500] - The HTTP status code.
		 */
		res.apiError = function (key, err, msg, code) {
			msg = msg || 'Error';
			key = key || 'unknown error';
			msg += ' (' + key + ')';
			if (keystone.get('logger')) {
				console.log(msg + (err ? ':' : ''));
				if (err) {
					console.log(err);
				}
			}
			res.status(code || 500);
			res.apiResponse({ error: key || 'error', detail: err });
		};

		/**
		 * Sends a 404 Not Found response.
		 *
		 * @param {Object} [err] - The error object.
		 * @param {string} [msg='not found'] - The error message.
		 */
		res.apiNotFound = function (err, msg) {
			res.apiError('data not found', err, msg || 'not found', 404);
		};

		/**
		 * Sends a 403 Not Allowed response.
		 *
		 * @param {Object} [err] - The error object.
		 * @param {string} [msg='not allowed'] - The error message.
		 */
		res.apiNotAllowed = function (err, msg) {
			res.apiError('access not allowed', err, msg || 'not allowed', 403);
		};

		next();
	};
};
