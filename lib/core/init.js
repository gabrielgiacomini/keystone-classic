/**
 * @fileoverview This file defines the `init` method for the Keystone instance.
 * It is used to initialize Keystone with a set of options.
 * @module lib/core/init
 */

/**
 * Initializes Keystone with the provided options.
 *
 * @param {object} options The options to initialize Keystone with.
 * @returns {this} The Keystone instance for chaining.
 */
function init (options) {
	this.options(options);
	return this;
}

module.exports = init;
