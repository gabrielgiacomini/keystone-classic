/**
 * @fileoverview This file defines the Name field type in KeystoneJS.
 *
 * It is used for storing names with first and last name components.
 * It provides a virtual `full` property for convenience.
 *
 * @see module:keystone/lib/field
 */

var _ = require('lodash');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var displayName = require('display-name');

/**
 * Name FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 */
function name (list, path, options) {
	this._fixedSize = 'full';
	options.default = { first: '', last: '' };
	name.super_.call(this, list, path, options);
}
name.properName = 'Name';
util.inherits(name, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds String properties for `.first` and `.last` name, and a virtual
 * with `get()` and `set()` methods for `.full`.
 *
 * @api public
 */
name.prototype.addToSchema = function (schema) {
	var paths = this.paths = {
		first: this.path + '.first',
		last: this.path + '.last',
		full: this.path + '.full',
	};

	schema.nested[this.path] = true;
	schema.add({
		first: String,
		last: String,
	}, this.path + '.');

	schema.virtual(paths.full).get(function () {
		return displayName(this.get(paths.first), this.get(paths.last));
	});

	schema.virtual(paths.full).set(function (value) {
		if (typeof value !== 'string') {
			this.set(paths.first, undefined);
			this.set(paths.last, undefined);
			return;
		}
		var split = value.split(' ');
		this.set(paths.first, split.shift());
		this.set(paths.last, split.join(' ') || undefined);
	});

	this.bindUnderscoreMethods();
};

/**
 * Gets the string to use for sorting by this field.
 *
 * @param {Object} options The sort options.
 * @param {Boolean} options.invert Whether to invert the sort order.
 * @return {String} The sort string.
 */
name.prototype.getSortString = function (options) {
	if (options.invert) {
		return '-' + this.paths.first + ' -' + this.paths.last;
	}
	return this.paths.first + ' ' + this.paths.last;
};

/**
 * Adds filters to a query.
 *
 * @param {Object} filter The filter to apply.
 * @return {Object} The query object.
 */
name.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (filter.mode === 'exactly' && !filter.value) {
		query[this.paths.first] = query[this.paths.last] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
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
	if (filter.inverted) {
		query[this.paths.first] = query[this.paths.last] = { $not: value };
	} else {
		var first = {}; first[this.paths.first] = value;
		var last = {}; last[this.paths.last] = value;
		query.$or = [first, last];
	}
	return query;
};

/**
 * Formats the field value.
 *
 * @param {Object} item The item to format.
 * @return {String} The formatted value.
 */
name.prototype.format = function (item) {
	return item.get(this.paths.full);
};

/**
 * Get the value from a data object; may be simple or a pair of fields.
 *
 * @param {Object} data The data object.
 * @return {Object|String|null} The value.
 */
name.prototype.getInputFromData = function (data) {
	// this.getValueFromData throws an error if we pass name: null
	if (data[this.path] === null) {
		return null;
	}
	var first = this.getValueFromData(data, '_first');
	if (first === undefined) first = this.getValueFromData(data, '.first');
	var last = this.getValueFromData(data, '_last');
	if (last === undefined) last = this.getValueFromData(data, '.last');
	if (first !== undefined || last !== undefined) {
		return {
			first: first,
			last: last,
		};
	}
	return this.getValueFromData(data) || this.getValueFromData(data, '.full');
};

/**
 * Validates that a value for this field has been provided in a data object.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
name.prototype.validateInput = function (data, callback) {
	var value = this.getInputFromData(data);
	var result = value === undefined
		|| value === null
		|| typeof value === 'string'
		|| (typeof value === 'object' && (
			typeof value.first === 'string'
			|| value.first === null
			|| typeof value.last === 'string'
			|| value.last === null)
		);
	utils.defer(callback, result);
};

/**
 * Validates that input has been provided.
 *
 * @param {Object} item The item being validated.
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
name.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getInputFromData(data);
	var result;
	if (value === null) {
		result = false;
	} else {
		result = (
			typeof value === 'string' && value.length
			|| typeof value === 'object' && (
				typeof value.first === 'string' && value.first.length
				|| typeof value.last === 'string' && value.last.length)
			|| (item.get(this.paths.full)
				|| item.get(this.paths.first)
				|| item.get(this.paths.last))
					&& (value === undefined
					|| (value.first === undefined
						&& value.last === undefined))
		) ? true : false;
	}
	utils.defer(callback, result);
};

/**
 * Validates that a value for this field has been provided in a data object.
 *
 * @deprecated
 * @param {Object} data The data to validate.
 * @param {Boolean} required Whether the field is required.
 * @param {Object} item The item being validated.
 * @return {Boolean}
 */
name.prototype.inputIsValid = function (data, required, item) {
	// Input is valid if none was provided, but the item has data
	if (!(this.path in data || this.paths.first in data || this.paths.last in data || this.paths.full in data) && item && item.get(this.paths.full)) return true;
	// Input is valid if the field is not required
	if (!required) return true;
	// Otherwise check for valid strings in the provided data,
	// which may be nested or use flattened paths.
	if (_.isObject(data[this.path])) {
		return (data[this.path].full || data[this.path].first || data[this.path].last) ? true : false;
	} else {
		return (data[this.paths.full] || data[this.paths.first] || data[this.paths.last]) ? true : false;
	}
};

/**
 * Detects whether the field has been modified.
 *
 * @api public
 * @param {Object} item The item to check.
 * @return {Boolean} `true` if the field has been modified, otherwise `false`.
 */
name.prototype.isModified = function (item) {
	return item.isModified(this.paths.first) || item.isModified(this.paths.last);
};

/**
 * Updates the value for this field in the item from a data object.
 *
 * @api public
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function.
 */
name.prototype.updateItem = function (item, data, callback) {
	var paths = this.paths;
	var value = this.getInputFromData(data);
	if (typeof value === 'string' || value === null) {
		item.set(paths.full, value);
	} else if (typeof value === 'object') {
		if (typeof value.first === 'string' || value.first === null) {
			item.set(paths.first, value.first);
		}
		if (typeof value.last === 'string' || value.last === null) {
			item.set(paths.last, value.last);
		}
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = name;
