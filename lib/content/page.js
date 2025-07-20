/**
 * @fileoverview This file defines the `Page` class, which is a central component
 * for managing content structures in KeystoneJS. It allows developers to define
 * pages with different fields and content types, register them, and then
 * perform operations like data population, validation, and cleaning.
 *
 * This file depends on `lodash`, `object-assign`, the main `keystone` module,
 * `keystone.utils`, and the base `Type` class.
 * @module lib/content/page
 */

var _ = require('lodash');
var assign = require('object-assign');
var keystone = require('../../');
var utils = keystone.utils;
var Type = require('./type');

/**
 * Represents a page with a specific set of fields and content types.
 * @class
 * @param {string} key - A unique key for the page.
 * @param {object} options - Configuration options for the page.
 * @property {string} key - The unique key for the page.
 * @property {object} options - Configuration options for the page.
 * @property {Object.<string, import('./type')>} fields - The fields added to the page.
 * @api public
 */
function Page(key, options) {
	// Ensure the constructor is called with `new`.
	if (!(this instanceof Page)) {
		return new Page(key, options);
	}

	this.options = assign({}, options);
	this.key = key;
	this.fields = {};
}

/**
 * Defines the `name` property for a Page instance.
 * It returns the provided name or generates a default name from the key.
 *
 * @type {string}
 * @name Page#name
 */
Object.defineProperty(Page.prototype, 'name', {
	get: function () {
		// Return the existing name or generate a new one from the key.
		return this.get('name') || this.set('name', utils.keyToLabel(this.key));
	},
});

/**
 * Sets a configuration option for the page.
 *
 * @param {string} key - The key of the option to set.
 * @param {*} value - The value to set for the option.
 * @returns {*} The value that was set.
 * @api public
 * @example
 * page.set('test', 'value');
 */
Page.prototype.set = function (key, value) {
	// Ensure a key is provided.
	if (!key) {
		throw new Error('keystone.content.Page.set() Error: must be provided with a key to set a value.');
	}

	// Set the value, defaulting to null if not provided.
	value = value || null;
	this.options[key] = value;
	return value;
};

/**
 * Gets a configuration option for the page.
 *
 * @param {string} key - The key of the option to get.
 * @returns {*} The value of the option, or null if it doesn't exist.
 * @api public
 * @example
 * var testValue = page.get('test');
 */
Page.prototype.get = function (key) {
	// Ensure a key is provided.
	if (!key) {
		throw new Error('keystone.content.Page.get() Error: must be provided with a key to get a value.');
	}

	// Return the value if the key exists, otherwise null.
	if (!this.options.hasOwnProperty(key)) {
		return null;
	}

	return this.options[key];
};

/**
 * Adds one or more fields to the page.
 *
 * @param {Object.<string, (function(new:import('./type'), string, object)|{type: function(new:import('./type'), string, object)})>} fields - An object where keys are field paths and values are field options or a constructor.
 * @returns {this} The Page instance, to allow for method chaining.
 * @api public
 */
Page.prototype.add = function (fields) {
	// TODO: Implement support for nested paths.
	if (!utils.isObject(fields)) {
		throw new Error('keystone.content.Page.add() Error: fields must be an object.');
	}

	var self = this;

	_.forEach(fields, function (options, path) {
		// If options is a function, treat it as the type.
		if (typeof options === 'function') {
			options = { type: options };
		}

		// Ensure the field type is a function.
		if (typeof options.type !== 'function') {
			throw new Error('keystone.content.page.add() Error: Page fields must be specified with a type function');
		}

		// Check if the type is a subclass of the base Type.
		if (options.type.prototype.__proto__ !== Type.prototype) { // eslint-disable-line no-proto
			// Convert native JavaScript types to their Keystone counterparts.
			if (options.type === String) {
				options.type = keystone.content.Types.Text;
			}
			// TODO: Add support for more native types (Number, Boolean, Date).
			else {
				throw new Error('keystone.content.page.add() Error: Unrecognised field constructor: ' + options.type);
			}
		}

		// Create a new field instance and add it to the fields object.
		self.fields[path] = new options.type(path, options);
	});

	return this;
};

/**
 * Registers the page with Keystone, making it available for use.
 *
 * @returns {this} The registered Page instance.
 * @api public
 * @example
 * var homePage = new keystone.content.Page('home');
 * homePage.register();
 * // Later, you can retrieve the page using:
 * // var homePage = keystone.content.page('home');
 */
Page.prototype.register = function () {
	return keystone.content.page(this.key, this);
};

/**
 * Populates a data structure based on the defined fields.
 *
 * @param {object} data - The data to populate.
 * @returns {object} The populated data.
 * @api public
 */
Page.prototype.populate = function (data) {
	// Ensure data is an object.
	if (typeof data !== 'object') {
		data = {};
	}

	// TODO: Implement schema-based population logic.
	return data;
};

/**
 * Validates a data structure against the defined fields.
 *
 * @param {object} data - The data to validate.
 * @returns {object} The validated data.
 * @api public
 */
Page.prototype.validate = function (data) {
	// Ensure data is an object.
	if (typeof data !== 'object') {
		data = {};
	}

	// TODO: Implement schema-based validation logic.
	return data;
};

/**
 * Cleans a data structure, removing any fields not defined in the page.
 *
 * @param {object} data - The data to clean.
 * @returns {object} The cleaned data.
 * @api public
 */
Page.prototype.clean = function (data) {
	// Ensure data is an object.
	if (typeof data !== 'object') {
		data = {};
	}

	// TODO: Implement schema-based cleaning logic.
	return data;
};

/**
 * Export the Page class.
 * @type {function(new:Page, string, object)}
 */
module.exports = Page;
