/**
 * @fileoverview This file defines the `redirect` function for Keystone, which is
 * used to set up URL redirections.
 *
 * This function allows developers to configure permanent (301) redirects for specific
 * URLs. It can be used to handle moved content, legacy URLs, or other routing needs.
 * The redirects are processed before the 404 handler, ensuring that valid redirect
 * rules are applied first.
 *
 * It uses 'lodash' for object extension and 'keystone-utils' for type checking.
 * @example
 * // Single redirect
 * keystone.redirect('/old-url', '/new-url');
 *
 * // Multiple redirects
 * keystone.redirect({
 *   '/about-us': '/about',
 *   '/contact-us': '/contact'
 * });
 */
var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * Adds one or more URL redirections.
 *
 * This function can be called in two ways:
 * 1. With two string arguments to define a single redirect from a source URL to a destination URL.
 * 2. With a single object argument to define multiple redirects, where keys are source URLs
 *    and values are destination URLs.
 *
 * Redirections are stored in the `_redirects` property of the Keystone instance and are
 * handled by a middleware that is set up during Keystone's initialization.
 *
 * @param {string|Object} from - The source URL or an object of redirects.
 * @param {string} [to] - The destination URL (if `from` is a string).
 * @returns {this} The Keystone instance, for chaining.
 * @example
 * // Single redirect
 * keystone.redirect('/old-path', '/new-path');
 *
 * // Multiple redirects
 * keystone.redirect({
 *   '/about-us': '/about',
 *   '/contact-us': '/contact'
 * });
 */
function redirect () {
	// Handle object-based redirects.
	if (arguments.length === 1 && utils.isObject(arguments[0])) {
		_.extend(this._redirects, arguments[0]);
	}
	// Handle string-based redirects.
	else if (arguments.length === 2 && typeof arguments[0] === 'string' && typeof arguments[1] === 'string') {
		this._redirects[arguments[0]] = arguments[1];
	}
	return this;
}

module.exports = redirect;
