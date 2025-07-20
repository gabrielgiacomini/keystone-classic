/**
 * @fileoverview This file defines the Text field type in KeystoneJS.
 *
 * It is the base field type for other text-based fields.
 *
 * @see module:keystone/lib/field
 */

var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Text FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 */
function text (list, path, options) {
	this.options = options;
	this._nativeType = String;
	this._properties = ['monospace'];
	this._underscoreMethods = ['crop'];
	text.super_.call(this, list, path, options);
}
text.properName = 'Text';
util.inherits(text, FieldType);

/**
 * Validates the input for this field.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
text.prototype.validateInput = function (data, callback) {
	var max = this.options.max;
	var min = this.options.min;
	var value = this.getValueFromData(data);
	var result = value === undefined || value === null || typeof value === 'string';
	if (max && typeof value === 'string') {
		result = value.length < max;
	}
	if (min && typeof value === 'string') {
		result = value.length > min;
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
text.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = !!value;
	if (value === undefined && item.get(this.path)) {
		result = true;
	}
	utils.defer(callback, result);
};

/**
 * Adds filters to a query.
 *
 * @param {Object} filter The filter to apply.
 * @return {Object} The query object.
 */
text.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (filter.mode === 'exactly' && !filter.value) {
		query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		return query;
	}
	var value = utils.escapeRegExp(filter.value);
	if (filter.mode === 'beginsWith') {
		value = '^' + value;
	} else if (filter.mode === 'endsWith') {
		value = value + '$';
	} else if (filter.mode === 'exactly') {
		value = '^' + value + '$';
	}
	value = new RegExp(value, filter.caseSensitive ? '' : 'i');
	query[this.path] = filter.inverted ? { $not: value } : value;
	return query;
};

/**
 * Crops the string to the specified length.
 *
 * @param {Object} item The item to crop the string from.
 * @param {Number} length The desired length of the string.
 * @param {String} [append] The string to append if the string is cropped.
 * @param {Boolean} [preserveWords] Whether to preserve whole words.
 * @return {String} The cropped string.
 */
text.prototype.crop = function (item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};

/* Export Field Type */
module.exports = text;
