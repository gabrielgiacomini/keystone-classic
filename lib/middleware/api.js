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
 * @fileoverview Exports a middleware that adds JSON API response methods to the `res` object.
 *
 * @see {@link module:keystone.index}
 */

/**
 * @typedef {function(Object): void} APIResponse
 * @param {Object} data The data to send.
 */

/**
 * @typedef {function(string=, Object=, string=, number=): void} APIError
 * @param {string} [key='unknown error'] - The error key.
 * @param {Object} [err] - The error object.
 * @param {string} [msg='Error'] - The error message.
 * @param {number} [code=500] - The HTTP status code.
 */

/**
 * @typedef {function(Object=, string=): void} APINotFound
 * @param {Object} [err] - The error object.
 * @param {string} [msg='not found'] - The error message.
 */

/**
 * @typedef {function(Object=, string=): void} APINotAllowed
 * @param {Object} [err] - The error object.
 * @param {string} [msg='not allowed'] - The error message.
 */

/**
 * @typedef {Object} APIResponseLocals
 * @property {APIResponse} apiResponse
 * @property {APIError} apiError
 * @property {APINotFound} apiNotFound
 * @property {APINotAllowed} apiNotAllowed
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
 * @param {import('../../index').Keystone} keystone The Keystone instance.
 * @returns {import('express').RequestHandler} A middleware function.
 *
 * @example
 * app.all('/api*', keystone.middleware.api);
 */
module.exports = function (keystone) {
	// The exported function returns a closure that retains
	// a reference to the keystone instance, so it can be
	// passed as middeware to the express app.
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
