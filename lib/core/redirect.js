/**
 * @fileoverview This file defines the `redirect` method for the Keystone instance.
 * It is used to configure URL redirections for the application.
 * @module lib/core/redirect
 */
var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * Adds one or more redirections.
 * Redirections are URL paths that will be redirected to a different URL when no matching
 * routes are found, before treating the request as a 404.
 *
 * @param {string|object} from The URL path to redirect from, or an object of from: to mappings.
 * @param {string} [to] The URL path to redirect to.
 * @returns {this} The Keystone instance for chaining.
 * @example
 * // Redirect a single path
 * keystone.redirect('/old-route', '/new-route');
 *
 * // Redirect multiple paths
 * keystone.redirect({
 *   '/old-path': '/new-path',
 *   '/another-old-path': '/another-new-path'
 * });
 */
function redirect () {
	if (arguments.length === 1 && utils.isObject(arguments[0])) {
		_.extend(this._redirects, arguments[0]);
	} else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
		this._redirects[arguments[0]] = arguments[1];
	}
	return this;
}

module.exports = redirect;
