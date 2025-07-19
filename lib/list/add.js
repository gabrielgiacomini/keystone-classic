/**
 * @fileoverview This file defines the `add` function, which is used to add one
 * or more fields to a Keystone list. It is based on Mongoose's `Schema.add`
 * method and supports adding fields, headings, and indentation to the list's UI.
 */
var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * Adds one or more fields to the List.
 *
 * This function is based on Mongoose's `Schema.add` method and supports
 * adding fields, headings, and indentation to the list's UI.
 *
 * @return {List} The list instance for chaining.
 */
function add () {
	/**
	 * Adds a field or a nested object of fields to the list.
	 *
	 * @param {Object} obj The field definition or a nested object of fields.
	 * @param {string} prefix The prefix for the field path.
	 */
	var add = function (obj, prefix) {
		prefix = prefix || '';
		var keys = Object.keys(obj);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			if (!obj[key]) {
				throw new Error(
					'Invalid value for schema path `' + prefix + key + '` in `' + this.key + '`.\n'
					+ 'Did you misspell the field type?\n'
				);
			}
			// If the value is a plain object, it's a nested schema
			if (utils.isObject(obj[key]) && (!obj[key].constructor || obj[key].constructor.name === 'Object') && (!obj[key].type || obj[key].type.type)) {
				if (Object.keys(obj[key]).length) {
					// Nested object, e.g. { last: { name: String }}
					this.schema.nested[prefix + key] = true;
					add(obj[key], prefix + key + '.');
				} else {
					// Mixed type field
					addField(prefix + key, obj[key]);
				}
			} else {
				// Simple field
				addField(prefix + key, obj[key]);
			}
		}
	}.bind(this);

	/**
	 * Adds a field to the list's UI elements.
	 *
	 * @param {string} path The path of the field.
	 * @param {Object} options The options for the field.
	 */
	var addField = function (path, options) {
		// Check if the path is reserved
		if (this.isReserved(path)) {
			throw new Error('Path ' + path + ' on list ' + this.key + ' is a reserved path');
		}
		// Add the field to the UI elements
		this.uiElements.push({
			type: 'field',
			field: this.field(path, options),
		});
	}.bind(this);

	// Get the arguments as an array
	var args = Array.prototype.slice.call(arguments);
	var self = this;

	// Iterate over the arguments and add them to the list
	_.forEach(args, function (def) {
		// Add the definition to the schema fields
		self.schemaFields.push(def);
		// If the definition is a string, it's a heading or indentation
		if (typeof def === 'string') {
			if (def === '>>>') {
				self.uiElements.push({
					type: 'indent',
				});
			} else if (def === '<<<') {
				self.uiElements.push({
					type: 'outdent',
				});
			} else {
				self.uiElements.push({
					type: 'heading',
					heading: def,
					options: {},
				});
			}
		} else {
			// If the definition has a heading, it's a heading
			if (def.heading && typeof def.heading === 'string') {
				self.uiElements.push({
					type: 'heading',
					heading: def.heading,
					options: def,
				});
			} else {
				// Otherwise, it's a field or a nested object of fields
				add(def);
			}
		}
	});

	// Return the list instance for chaining
	return this;
}

module.exports = add;
