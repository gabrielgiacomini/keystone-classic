/**
 * @fileoverview This file defines the Number field type in KeystoneJS.
 *
 * It is used for storing numeric values.
 *
 * @see module:keystone/lib/field
 */

var FieldType = require('../Type');
var numeral = require('numeral');
var util = require('util');
var utils = require('keystone-utils');


/**
 * Number FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {String} [options.format] The format string to use for formatting the numbers.
 */
function number (list, path, options) {
	this._nativeType = Number;
	this._fixedSize = 'small';
	this._underscoreMethods = ['format'];
	this.formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
	if (this.formatString && typeof this.formatString !== 'string') {
		throw new Error('FieldType.Number: options.format must be a string.');
	}
	number.super_.call(this, list, path, options);
}
number.properName = 'Number';
util.inherits(number, FieldType);

/**
 * Validates the input for this field.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
number.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = value === undefined || typeof value === 'number' || value === null;
	if (typeof value === 'string') {
		if (value === '') {
			result = true;
		} else {
			value = utils.number(value);
			result = !isNaN(value);
		}
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
number.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = !!(value || typeof value === 'number');
	if (value === undefined && typeof item.get(this.path) === 'number') {
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
number.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (filter.mode === 'equals' && !filter.value) {
		query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		return query;
	}
	if (filter.mode === 'between') {
		var min = utils.number(filter.value.min);
		var max = utils.number(filter.value.max);
		if (!isNaN(min) && !isNaN(max)) {
			if (filter.inverted) {
				var gte = {}; gte[this.path] = { $gt: max };
				var lte = {}; lte[this.path] = { $lt: min };
				query.$or = [gte, lte];
			} else {
				query[this.path] = { $gte: min, $lte: max };
			}
		}
		return query;
	}
	var value = utils.number(filter.value);
	if (!isNaN(value)) {
		if (filter.mode === 'gt') {
			query[this.path] = filter.inverted ? { $lt: value } : { $gt: value };
		}
		else if (filter.mode === 'lt') {
			query[this.path] = filter.inverted ? { $gt: value } : { $lt: value };
		}
		else {
			query[this.path] = filter.inverted ? { $ne: value } : value;
		}
	}
	return query;
};

/**
 * Formats the field value.
 *
 * @param {Object} item The item to format.
 * @param {String} [format] The format string to use.
 * @return {String} The formatted value.
 */
number.prototype.format = function (item, format) {
	var value = item.get(this.path);
	if (format || this.formatString) {
		return (typeof value === 'number') ? numeral(value).format(format || this.formatString) : '';
	} else {
		return value || value === 0 ? String(value) : '';
	}
};

/**
 * Checks that a valid number has been provided in a data object.
 * An empty value clears the stored value and is considered valid.
 *
 * @deprecated
 * @param {Object} data The data to validate.
 * @param {Boolean} required Whether the field is required.
 * @param {Object} item The item being validated.
 * @return {Boolean}
 */
number.prototype.inputIsValid = function (data, required, item) {
	var value = this.getValueFromData(data);
	if (value === undefined && item && (item.get(this.path) || item.get(this.path) === 0)) {
		return true;
	}
	if (value !== undefined && value !== '') {
		var newValue = utils.number(value);
		return (!isNaN(newValue));
	} else {
		return (required) ? false : true;
	}
};

/**
 * Updates the value for this field in the item from a data object.
 *
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function.
 */
number.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (value === undefined) {
		return process.nextTick(callback);
	}
	var newValue = utils.number(value);
	if (!isNaN(newValue)) {
		if (newValue !== item.get(this.path)) {
			item.set(this.path, newValue);
		}
	} else if (typeof item.get(this.path) === 'number') {
		item.set(this.path, null);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = number;
