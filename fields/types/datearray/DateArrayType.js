/**
 * @fileoverview This file defines the DateArray field type in KeystoneJS.
 *
 * It is used for storing an array of dates.
 *
 * @see module:keystone/lib/field
 */

var FieldType = require('../Type');
var moment = require('moment');
var util = require('util');
var utils = require('keystone-utils');
var addPresenceToQuery = require('../../utils/addPresenceToQuery');
var DateType = require('../date/DateType');

/**
 * DateArray FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {String} [options.parseFormat='YYYY-MM-DD'] The format for parsing input.
 * @param {String} [options.format='Do MMM YYYY'] The format for displaying the dates.
 * @param {String} [options.separator=' | '] The separator to use when formatting the array.
 */
function datearray (list, path, options) {
	this._nativeType = [Date];
	this._defaultSize = 'medium';
	this._underscoreMethods = ['format'];
	this._properties = ['formatString'];
	this.parseFormatString = options.parseFormat || 'YYYY-MM-DD';
	this.formatString = (options.format === false) ? false : (options.format || 'Do MMM YYYY');
	if (this.formatString && typeof this.formatString !== 'string') {
		throw new Error('FieldType.DateArray: options.format must be a string.');
	}
	this.separator = options.separator || ' | ';
	datearray.super_.call(this, list, path, options);
}
datearray.properName = 'DateArray';
util.inherits(datearray, FieldType);

/**
 * Formats the field value.
 *
 * @param {Object} item The item to format.
 * @param {String} [format] The format string to use.
 * @param {String} [separator] The separator to use.
 * @return {String} The formatted value.
 */
datearray.prototype.format = function (item, format, separator) {
	var value = item.get(this.path);
	if (format || this.formatString) {
		value = value.map(function (d) {
			return moment(d).format(format || this._formatString);
		});
	}
	return value.join(separator || this.separator);
};

/**
 * Asynchronously confirms that the provided value is valid.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
datearray.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = true;
	if (value !== undefined && value !== null && value !== '') {
		if (!Array.isArray(value)) {
			value = [value];
		}
		for (var i = 0; i < value.length; i++) {
			var currentValue;
			// If we pass it an epoch, parse it without the format string
			if (typeof value[i] === 'number') {
				currentValue = moment(value[i]);
			} else {
				currentValue = moment(value[i], this.parseFormatString);
			}
			// If moment does not think it's a valid date, invalidate
			if (!currentValue.isValid()) {
				result = false;
				break;
			}
		}
	}
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that a value is present.
 *
 * @param {Object} item The item being validated.
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
datearray.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	// If the field is undefined but has a value saved already, validate
	if (value === undefined) {
		if (item.get(this.path) && item.get(this.path).length) {
			result = true;
		}
	}
	if (typeof value === 'string' || typeof value === 'number') {
		if (moment(value).isValid()) {
			result = true;
		}
	// If it's an array of only dates and/or dateify-able data, validate
	} else if (Array.isArray(value)) {
		var invalidContent = false;
		for (var i = 0; i < value.length; i++) {
			var currentValue;
			// If we pass it an epoch, parse it without the format string
			if (typeof value[i] === 'number') {
				currentValue = moment(value[i]);
			} else {
				currentValue = moment(value[i], this.parseFormatString);
			}
			// If even a single item is not a valid date, invalidate
			if (!currentValue.isValid()) {
				invalidContent = true;
				break;
			}
		}
		if (invalidContent === false) {
			result = true;
		}
	}
	utils.defer(callback, result);
};

/**
 * Adds filters to a query.
 *
 * @param {Object} filter The data from the frontend.
 * @param {String} filter.mode The filter mode, either "on", "after", "before", or "between".
 * @param {String} [filter.presence='some'] The presence mode, either "none" or "some". Default: 'some'.
 * @param {String|Object} filter.value The value that is filtered for.
 * @return {Object} The query object.
 */
datearray.prototype.addFilterToQuery = function (filter) {
	var dateTypeAddFilterToQuery = DateType.prototype.addFilterToQuery.bind(this);
	var query = dateTypeAddFilterToQuery(filter);
	if (query[this.path]) {
		query[this.path] = addPresenceToQuery(filter.presence || 'some', query[this.path]);
	}
	return query;
};

/**
 * Checks that a valid array of dates has been provided in a data object.
 * An empty value clears the stored value and is considered valid.
 *
 * @deprecated
 * @param {Object} data The data to validate.
 * @param {Boolean} required Whether the field is required.
 * @param {Object} item The item being validated.
 * @return {Boolean}
 */
datearray.prototype.inputIsValid = function (data, required, item) {

	var value = this.getValueFromData(data);
	var parseFormatString = this.parseFormatString;

	if (typeof value === 'string') {
		if (!moment(value, parseFormatString).isValid()) {
			return false;
		}
		value = [value];
	}

	if (required) {
		if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
			return true;
		}
		if (value === undefined || !Array.isArray(value)) {
			return false;
		}
		if (Array.isArray(value) && !value.length) {
			return false;
		}
	}

	if (Array.isArray(value)) {
		// filter out empty fields
		value = value.filter(function (date) {
			return date.trim() !== '';
		});
		// if there are no values left, and requried is true, return false
		if (required && !value.length) {
			return false;
		}
		// if any date in the array is invalid, return false
		if (value.some(function (dateValue) { return !moment(dateValue, parseFormatString).isValid(); })) {
			return false;
		}
	}

	return (value === undefined || Array.isArray(value));

};


/**
 * Updates the value for this field in the item from a data object.
 *
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function.
 */
datearray.prototype.updateItem = function (item, data, callback) {

	var value = this.getValueFromData(data);

	if (Array.isArray(value)) {
		// Only save valid dates
		value = value.filter(function (date) {
			return moment(date).isValid();
		});
	}
	if (value === null || value === undefined) {
		value = [];
	}
	if (typeof value === 'string') {
		if (moment(value).isValid()) {
			value = [value];
		}
	}
	if (Array.isArray(value)) {
		item.set(this.path, value);
	}

	process.nextTick(callback);
};

/* Export Field Type */
module.exports = datearray;
