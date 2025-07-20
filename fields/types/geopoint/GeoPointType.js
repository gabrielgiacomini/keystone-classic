/**
 * @fileoverview This file defines the GeoPoint field type in KeystoneJS.
 *
 * It is used for storing and validating geographic coordinates (latitude and longitude).
 * The field supports 2dsphere indexing for geospatial queries and provides
 * methods for formatting, validation, and filtering.
 *
 * @see module:keystone/lib/field
 */

var _ = require('lodash');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');

// Validation and value parsing regular expression
var REGEXP_LNGLAT = /^\s*(\-?\d+(?:\.\d+)?)\s*\,\s*(\-?\d+(?:\.\d+)?)\s*$/;

/**
 * GeoPoint FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 */
function geopoint (list, path, options) {
	this._fixedSize = 'medium';
	geopoint.super_.call(this, list, path, options);
}
geopoint.properName = 'GeoPoint';
util.inherits(geopoint, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 * Adds a 2dsphere indexed lat/lng pair.
 *
 * @param {Object} schema The Mongoose schema to add the path to.
 */
geopoint.prototype.addToSchema = function (schema) {
	// Add the path to the schema with a 2dsphere index
	schema.path(this.path, _.defaults({ type: [Number], index: '2dsphere' }, this.options));
	// Bind the underscore methods
	this.bindUnderscoreMethods();
};

/**
 * Gets the field's data from an Item, as used by the React components.
 *
 * @param {Object} item The item to get the data from.
 * @return {Array} The latitude and longitude values.
 */
geopoint.prototype.getData = function (item) {
	var points = item.get(this.path);
	return (points && points.length === 2) ? points : [];
};

/**
 * Formats the field value.
 *
 * @param {Object} item The item containing the field value.
 * @return {String} The formatted value (lat, lng).
 */
geopoint.prototype.format = function (item) {
	if (item.get(this.path)) {
		// reverse the array to get lat, lng
		return item.get(this.path).reverse().join(', ');
	}
	return null;
};

/**
 * Asynchronously confirms that the provided value is valid.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function to call with the validation result.
 */
geopoint.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	// If the value is undefined, null, an empty string, or an empty array, it's valid
	if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 2 && value.join('') === '')) {
		result = true;
	} else {
		// If the value is an array, join it to a string
		if (Array.isArray(value)) {
			value = value.length === 2 ? value.join(',') : '';
		}
		// If the value is a string, test it against the regex
		if (typeof value === 'string') {
			result = REGEXP_LNGLAT.test(value);
		}
	}
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that a value is present.
 *
 * @param {Object} item The item to check.
 * @param {Object} data The data to check.
 * @param {Function} callback The callback function to call with the validation result.
 */
geopoint.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	// A value is present if the value is not null, or if the item has a value
	var result = (value || (value === undefined && item.get(this.path) && item.get(this.path).length === 2)) ? true : false;
	utils.defer(callback, result);
};

/**
 * Validates that a value for this field has been provided in a data object.
 *
 * @deprecated
 * @param {Object} data The data to validate.
 * @param {Boolean} required Whether the field is required.
 * @return {Boolean} True if the input is valid, false otherwise.
 */
geopoint.prototype.inputIsValid = function (data, required, item) { // eslint-disable-line no-unused-vars
	var values = this.getValueFromData(data);
	// Input is valid if the field is not required, and not present
	if (values === undefined && !required) return true;
	// If the value is an array, join it to a string
	if (Array.isArray(values)) {
		values = values.length === 2 ? values.join(',') : '';
	}
	// If the value is not a string, it's invalid
	if (typeof values !== 'string') return false;
	// If the value is an empty string or has a leading/trailing comma, it's valid if not required
	if ((values === '' || values.charAt(0) === ',' || values.charAt(values.length - 1) === ',') && !required) return true;
	// Test the value against the regex
	return REGEXP_LNGLAT.test(values);
};

/**
 * Filters geopoints based on distance to a center point.
 *
 * @param {Object} filter The data from the frontend.
 * @param {Number} filter.lat The latitude of the center point.
 * @param {Number} filter.lon The longitude of the center point.
 * @param {String} filter.distance.mode The distance mode, either "max" or "min".
 * @param {Number} filter.distance.value The distance value in kilometers.
 * @return {Object} The query object.
 */
geopoint.prototype.addFilterToQuery = function (filter) {
	var query = {};
	// If latitude or longitude aren't specified, don't filter anything
	if (filter.lon && filter.lat) {
		// Create a $near query
		query[this.path] = {
			$near: {
				$geometry: {
					type: 'Point',
					coordinates: [filter.lon, filter.lat],
				},
			},
		};
		// MongoDB wants meters, but we accept kilometers via input so we * 1000
		var distance = (filter.distance.value && filter.distance.value * 1000) || 500000;
		// Set the min or max distance
		if (filter.distance.mode === 'min') {
			query[this.path].$near.$minDistance = distance;
		} else {
			query[this.path].$near.$maxDistance = distance;
		}
	}
	return query;
};

/**
 * Updates the value for this field in the item from a data object.
 *
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function to call when done.
 */
geopoint.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	// If the value is undefined, do nothing
	if (value === undefined) return process.nextTick(callback);
	// If the value is a string, parse it
	if (typeof value === 'string') {
		// Value should be formatted lng,lat
		var values = REGEXP_LNGLAT.exec(value);
		// If the value is valid, set it
		if (values) {
			item.set(this.path, [values[1], values[2]]);
		} else {
			// Otherwise, set the value to undefined
			item.set(this.path, undefined);
		}
	// If the value is an array, validate and set it
	} else if (Array.isArray(value)) {
		// If the value is a valid array, set it
		if (value.length === 2 && REGEXP_LNGLAT.test(_.compact(value).join(','))) {
			item.set(this.path, value);
		} else {
			// Otherwise, set the value to undefined
			item.set(this.path, undefined);
		}
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = geopoint;
