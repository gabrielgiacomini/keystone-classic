/**
 * @fileoverview This file contains methods for managing Keystone's options.
 *
 * It provides functions for setting, getting, and processing configuration options
 * that control various aspects of a Keystone application, such as database connections,
 * security settings, and module paths. All exports are added to the Keystone.prototype.
 *
 * This module relies on 'caller-id', 'path', and 'url' to handle file paths and URLs.
 * @example
 * // Set a single option
 * keystone.set('name', 'My Awesome Website');
 *
 * // Set multiple options
 * keystone.options({
 *   'brand': 'My Brand',
 *   'mongo': 'mongodb://localhost/my-db'
 * });
 *
 * // Get an option
 * const appName = keystone.get('name');
 */
var callerId = require('caller-id');
var path = require('path');
var url = require('url');

/**
 * Determines if a given path is absolute.
 *
 * An absolute path is a path that starts from the root directory of the file system.
 * This function checks if the resolved path is identical to the normalized path,
 * which indicates it is absolute.
 *
 * @param {string} value - The path to check.
 * @returns {boolean} - True if the path is absolute, false otherwise.
 * @private
 */
function isAbsolutePath (value) {
	// A path is absolute if its resolved form is the same as its normalized form.
	// We also remove any trailing path separator to ensure a consistent comparison.
	return path.resolve(value) === path.normalize(value).replace(new RegExp(path.sep + '$'), '');
}

/**
 * Sets a Keystone option.
 *
 * This function allows setting individual configuration options for the Keystone instance.
 * It handles special cases for certain keys, such as 'cloudinary config', 'auth', 'nav',
 * 'mongo', 'module root', 'app', 'mongoose', and 'frame guard'.
 *
 * If only a key is provided, it returns the current value of that option.
 *
 * @param {string} key - The option key to set.
 * @param {*} [value] - The value to set for the option.
 * @returns {*} - The Keystone instance for chaining, or the option value if only a key is provided.
 * @example
 * // Set the 'user model' option
 * keystone.set('user model', 'User');
 *
 * // Get the 'user model' option
 * const userModel = keystone.get('user model');
 */
exports.set = function (key, value) {

	// If only one argument is provided, act as a getter.
	if (arguments.length === 1) {
		return this._options[key];
	}

	// Process the option based on its key.
	switch (key) {
		// Throw an error for unsupported options.
		case 'email rules':
			throw new Error('The option "' + key + '" is no longer supported. See https://github.com/keystonejs/keystone/wiki/0.3.x-to-0.4.x-Changes');

		// Handle special settings for Cloudinary configuration.
		case 'cloudinary config':
			var cloudinary = require('cloudinary');
			// If the value is a string, parse it as a URL.
			if (typeof value === 'string') {
				var parts = url.parse(value, true);
				var auth = parts.auth ? parts.auth.split(':') : [];
				value = {
					cloud_name: parts.host,
					api_key: auth[0],
					api_secret: auth[1],
					private_cdn: parts.pathname != null,
					secure_distribution: parts.pathname && parts.pathname.substring(1),
				};
			}
			// Configure Cloudinary and store the configuration.
			cloudinary.config(value);
			value = cloudinary.config();
			break;

		// Ensure session is enabled when 'auth' is true.
		case 'auth':
			if (value === true && !this.get('session')) {
				this.set('session', true);
			}
			break;

		// Initialize navigation with the provided value.
		case 'nav':
			this.nav = this.initNav(value);
			break;

		// Handle MongoDB connection string.
		case 'mongo':
			if (typeof value !== 'string') {
				// Deprecated: Handle array-based MongoDB configuration.
				if (Array.isArray(value) && (value.length === 2 || value.length === 3)) {
					console.log('\nWarning: using an array for the `mongo` option has been deprecated.\nPlease use a mongodb connection string, e.g. mongodb://localhost/db_name instead.\n\n'
					+ 'Support for arrays as the `mongo` setting will be removed in a future version.');
					value = (value.length === 2) ? 'mongodb://' + value[0] + '/' + value[1] : 'mongodb://' + value[0] + ':' + value[2] + '/' + value[1];
				} else {
					// Exit if the configuration is invalid.
					console.error('\nInvalid Configuration:\nThe `mongo` option must be a mongodb connection string, e.g. mongodb://localhost/db_name\n');
					process.exit(1);
				}
			}
			break;

		// Resolve 'module root' path relative to the caller's path if it's not absolute.
		case 'module root':
			if (!isAbsolutePath(value)) {
				var caller = callerId.getData();
				value = path.resolve(path.dirname(caller.filePath), value);
			}
			break;

		// Set the Express app instance.
		case 'app':
			this.app = value;
			break;

		// Set the Mongoose instance.
		case 'mongoose':
			this.mongoose = value;
			break;

		// Configure the 'frame guard' option.
		case 'frame guard':
			var validFrameGuardOptions = ['deny', 'sameorigin'];
			if (value === true) {
				value = 'deny';
			}
			if (typeof value === 'string') {
				value = value.toLowerCase();
				if (validFrameGuardOptions.indexOf(value) < 0) {
					value = false;
				}
			} else if (typeof value !== 'boolean') {
				value = false;
			}
			break;
	}

	// Store the processed option value.
	this._options[key] = value;
	return this;
};

/**
 * Sets multiple Keystone options from an object.
 *
 * This function iterates over the properties of an object and sets each one as a
 * Keystone option using `keystone.set()`.
 *
 * @param {Object} [options] - An object of options to set.
 * @returns {Object} - The full options object.
 * @example
 * keystone.options({
 *   'name': 'My Awesome Site',
 *   'brand': 'My Brand'
 * });
 */
exports.options = function (options) {
	// If no arguments, return the current options.
	if (!arguments.length) {
		return this._options;
	}
	// If an object is provided, set each option.
	if (typeof options === 'object') {
		var keys = Object.keys(options);
		var i = keys.length;
		var k;
		while (i--) {
			k = keys[i];
			this.set(k, options[k]);
		}
	}
	return this._options;
};

/**
 * Gets a Keystone option.
 *
 * This is an alias for `keystone.set(key)`.
 *
 * @param {string} key - The option key to get.
 * @returns {*} - The value of the option.
 * @example
 * const appName = keystone.get('name');
 */
exports.get = exports.set;

/**
 * Gets an expanded path option.
 *
 * This function retrieves a path option and expands it to be an absolute path
 * if it is relative, using the 'module root' option as the base.
 *
 * @param {string} key - The path option key.
 * @param {string} [defaultValue] - A default value if the option is not set.
 * @returns {string} - The expanded path.
 * @example
 * const templatesPath = keystone.getPath('templates', 'templates');
 */
exports.getPath = function (key, defaultValue) {
	// Get the path value or use the default, and then expand it.
	return this.expandPath(this.get(key) || defaultValue);
};

/**
 * Expands a path to be absolute.
 *
 * If the path is relative, it is joined with the 'module root' option to make it absolute.
 * This is useful for ensuring consistent pathing for modules and resources.
 *
 * @param {string} pathValue - The path to expand.
 * @returns {string} - The expanded, absolute path.
 */
exports.expandPath = function (pathValue) {
	// Check if the path is relative and not a Windows-style path with a drive letter.
	pathValue = (typeof pathValue === 'string' && pathValue.substr(0, 1) !== path.sep && pathValue.substr(1, 2) !== ':\\')
		? path.join(this.get('module root'), pathValue) // Join with module root if relative.
		: pathValue; // Otherwise, use the path as is.
	return pathValue;
};
