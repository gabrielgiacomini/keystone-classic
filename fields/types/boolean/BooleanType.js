/**
 * @fileoverview This file defines the Boolean field type in KeystoneJS.
 *
 * It is used for storing true/false values.
 *
 * @see module:keystone/lib/field
 */

var FieldType = require('../Type');
var utils = require('keystone-utils');
var util = require('util');

/**
 * Boolean FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 */
function boolean (list, path, options) {
	this._nativeType = Boolean;
	this._properties = ['indent'];
	this._fixedSize = 'full';
	this.indent = (options.indent) ? true : false;
	boolean.super_.call(this, list, path, options);
}
boolean.properName = 'Boolean';
util.inherits(boolean, FieldType);

boolean.prototype.defaults = {
	default: false,
};

/**
 * Validates the input for this field.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
boolean.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = true;
	if (value !== undefined
		&& value !== null
		&& typeof value !== 'string'
		&& typeof value !== 'number'
		&& typeof value !== 'boolean') {
		result = false;
	}
	utils.defer(callback, result);
};

/**
 * Validates that a required value for this field is present.
 *
 * @param {Object} item The item being validated.
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
boolean.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = value && value !== 'false'
		? true
		: false;
	utils.defer(callback, result);
};

/**
 * Adds filters to a query.
 *
 * @param {Object} filter The filter to apply.
 * @return {Object} The query object.
 */
boolean.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (!filter.value || filter.value === 'false') {
		query[this.path] = { $ne: true };
	} else {
		query[this.path] = true;
	}
	return query;
};

/**
 * Validates that a truthy value for this field has been provided in a data object.
 * Useful for checkboxes that are required to be true (e.g. agreed to terms and cond's).
 *
 * @deprecated
 * @param {Object} data The data to validate.
 * @param {Boolean} required Whether the field is required.
 * @return {Boolean}
 */
boolean.prototype.inputIsValid = function (data, required) {
	if (required) {
		return (data[this.path] === true || data[this.path] === 'true') ? true : false;
	} else {
		return true;
	}
};

/**
 * Updates the value for this field in the item from a data object.
 * Only updates the value if it has changed.
 * Treats a falsy value or the string "false" as false, everything else as true.
 *
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function.
 */
boolean.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (typeof value === 'undefined') {
		return process.nextTick(callback);
	}
	if (!value || value === 'false') {
		if (item.get(this.path) !== false) {
			item.set(this.path, false);
		}
	} else if (!item.get(this.path)) {
		item.set(this.path, true);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = boolean;
