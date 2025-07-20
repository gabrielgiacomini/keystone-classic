/**
 * @fileoverview This file defines the Key field type in KeystoneJS.
 *
 * It is used for generating unique, URL-friendly keys from other strings.
 * It inherits from the `Text` field type.
 *
 * @see module:keystone/lib/field
 * @see module:keystone/lib/fields/types/text/TextType
 */

var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Key FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {String} [options.separator='-'] The separator to use in the generated key.
 */
function key (list, path, options) {
	// Set the native type of the field
	this._nativeType = String;
	// Set the default size of the field
	this._defaultSize = 'medium';
	// Set the separator
	this.separator = options.separator || '-';
	// Call the super constructor
	key.super_.call(this, list, path, options);
}
key.properName = 'Key';
util.inherits(key, FieldType);

/* Inherit from TextType prototype */
key.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
key.prototype.validateInput = TextType.prototype.validateInput;
key.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/**
 * Generates a valid key from a string.
 *
 * @param {String} str The string to generate the key from.
 * @return {String} The generated key.
 */
key.prototype.generateKey = function (str) {
	return utils.slug(String(str), this.separator);
};

/**
 * Checks that a valid key has been provided in a data object.
 *
 * @deprecated
 * @param {Object} data The data to check.
 * @param {Boolean} required Whether the field is required.
 * @param {Object} item The item being checked.
 * @return {Boolean} `true` if the key is valid, otherwise `false`.
 */
key.prototype.inputIsValid = function (data, required, item) {
	var value = this.getValueFromData(data);
	// If the value is undefined and the item has a value, it's valid
	if (value === undefined && item && item.get(this.path)) {
		return true;
	}
	// Generate the key from the value
	value = this.generateKey(value);
	// If the value is valid or the field is not required, it's valid
	return (value || !required) ? true : false;
};

/**
 * Updates the value for this field in the item from a data object.
 *
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function.
 */
key.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	// If the value is undefined, do nothing
	if (value === undefined) {
		return process.nextTick(callback);
	}
	// Generate the key from the value
	value = this.generateKey(value);
	// If the generated key is different from the current key, update it
	if (item.get(this.path) !== value) {
		item.set(this.path, value);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = key;
