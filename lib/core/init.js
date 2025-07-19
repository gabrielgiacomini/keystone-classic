/**
 * @fileoverview This file defines the `init` function for Keystone.
 *
 * The `init` function is responsible for initializing a Keystone instance with a
 * given set of options. It serves as the entry point for configuring the Keystone
 * application before starting it. This function is a core part of the Keystone
_V4_
 * setup process.
 *
 * It is a simple wrapper around the `options` function, ensuring that any provided
 * configurations are properly set on the Keystone instance.
 */

/**
 * Initializes the Keystone instance with the provided options.
 *
 * This function takes an `options` object and applies it to the Keystone instance.
 * It is the first step in setting up a Keystone application, allowing developers
 to
 * configure various settings such as the application name, database connection,
 * and other operational parameters.
 *
 * @param {Object} options - An object containing the configuration options for Keystone.
 * @returns {this} The Keystone instance, to allow for method chaining.
 * @see Keystone.prototype.options
 * @example
 * const keystone = require('keystone');
 * keystone.init({
 *   'name': 'My Awesome App',
 *   'brand': 'My Brand',
 *   'mongo': 'mongodb://localhost/my-db',
 * });
 */
function init (options) {
	// The 'options' function handles the actual processing and setting of the options.
	// It is called here to apply the provided configuration to the Keystone instance.
	this.options(options);
	// Returning 'this' allows for method chaining, which is a common pattern in Keystone setup.
	return this;
}

module.exports = init;
