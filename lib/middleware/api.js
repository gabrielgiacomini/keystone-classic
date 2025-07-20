/**
 * Adds shortcut methods for JSON API responses:
 *
 *   * `res.apiResponse(data)`
 *   * `res.apiError(key, err, msg, code)`
 *   * `res.apiNotFound(err, msg)`
 *   * `res.apiNotAllowed(err, msg)`
 *
 * ####Example:
 *
 *     app.all('/api*', keystone.middleware.api);
 *
 * @param {app.request} req
 * @param {app.response} res
 * @param {function} next
 * @api public
 */

/**
 * @fileoverview Exports a middleware that extends Express's `res` object with
 * methods for sending standardized JSON API responses. This is crucial for
 * building consistent and predictable APIs.
 *
 * @see {@link module:keystone.index}
 */

/**
 * @template T
 * @typedef {function(T): void} APIResponseFn
 * @param {T} data - The data to be sent in the JSON response.
 */

/**
 * @typedef {function(string=, any=, string=, number=): void} APIErrorFn
 * @param {string} [key='unknown error'] - A machine-readable key for the error.
 * @param {any} [err] - Additional error details, often an Error object or validation result.
 * @param {string} [msg='Error'] - A human-readable message for the error.
 * @param {number} [code=500] - The HTTP status code for the response.
 */

/**
 * @typedef {function(any=, string=): void} APINotFoundFn
 * @param {any} [err] - Additional error details.
 * @param {string} [msg='not found'] - A human-readable message.
 */

/**
 * @typedef {function(any=, string=): void} APINotAllowedFn
 * @param {any} [err] - Additional error details.
 * @param {string} [msg='not allowed'] - A human-readable message.
 */

/**
 * Extends the `express.Response` interface with custom API methods.
 * @see {@link https://expressjs.com/en/api.html#res}
 * @typedef {Object} APIResponseLocals
 * @property {APIResponseFn<any>} apiResponse - Sends a successful JSON response.
 * @property {APIErrorFn} apiError - Sends a JSON response with an error message.
 * @property {APINotFoundFn} apiNotFound - Sends a 404 Not Found error response.
 * @property {APINotAllowedFn} apiNotAllowed - Sends a 403 Forbidden error response.
 */

/**
 * Creates a middleware that enhances the `res` object with API response methods.
 *
 * This middleware attaches several functions to the `res` object, which can then be
 * used in API route handlers to send structured JSON responses for success and error
 * cases.
 *
 * @param {import('../../index').Keystone} keystone - The Keystone instance.
 * @returns {import('express').RequestHandler} An Express middleware that extends the response object.
 *
 * @example
 * app.use(keystone.middleware.api);
 * app.get('/api/users', (req, res) => {
 *   // res is now extended with API methods
 *   res.apiResponse({ users: [...] });
 * });
 */
module.exports = function (keystone) {
	return function initAPI (req, res, next) {

		res.apiResponse = function (data) {
			if (req.query.callback) {
				res.jsonp(data);
			} else {
				res.json(data);
			}
		};

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

		res.apiNotFound = function (err, msg) {
			res.apiError('data not found', err, msg || 'not found', 404);
		};

		res.apiNotAllowed = function (err, msg) {
			res.apiError('access not allowed', err, msg || 'not allowed', 403);
		};

		next();
	};
};
