/**
 * @fileoverview This file defines the `getCSVData` function, which is used to
 * get the data from an item ready to be serialized to CSV for download. It
 * handles field transformations, relationship expansion, and data flattening.
 */
var _ = require('lodash');
var listToArray = require('list-to-array');
var escapeValueForExcel = require('../security/escapeValueForExcel');

/**
 * Applies option field transforms to get the CSV value for a field.
 *
 * @param {Object} field The field to transform.
 * @param {Object} item The item to get the value from.
 * @param {Object} options The options for the transformation.
 * @return {*} The transformed value.
 */
function transformFieldValue (field, item, options) {
	// Get the transform option from the field
	var transform = typeof field.options.toCSV === 'string'
		? listToArray(field.options.toCSV)
		: field.options.toCSV;

	// If the transform is a function, call it
	if (typeof transform === 'function') {
		return transform.call(item, field, options);
	}

	// If the transform is an array, pick the values from the item
	if (Array.isArray(transform)) {
		var value = item.get(field.path);
		if (transform.length === 1) {
			return value[transform[0]];
		} else {
			return _.pick(value, transform);
		}
	}

	// Otherwise, format the field value
	return field.format(item);
}

/**
 * Gets the data from an Item ready to be serialised to CSV for download.
 *
 * @param {Object} item The item to get the data from.
 * @param {Object} options The options for getting the data.
 * @return {Object} The data ready for CSV serialization.
 */
function getCSVData (item, options) {
	// Ensure options is an object
	if (!options) {
		options = {};
	}
	options.fields;

	// Default fields to all fields in the list
	if (options.fields === undefined) {
		options.fields = Object.keys(this.options.fields);
	}

	// Initialize the data object with the item's ID
	var data = {
		id: String(item.id),
	};

	// Add the autokey if it exists
	if (this.autokey) {
		data[this.autokey.path] = item.get(this.autokey.path);
	}

	// Process the fields
	if (options.fields) {
		// Convert fields to an array if it's a string
		if (typeof options.fields === 'string') {
			options.fields = listToArray(options.fields);
		}

		// Ensure fields is an array
		if (!Array.isArray(options.fields)) {
			throw new Error('List.getCSV: options.fields must be undefined, a string, or an array.');
		}

		// Iterate over the fields
		options.fields.forEach(function (path) {
			var field = this.fields[path];

			// If the path is not a field, just add the value from the mongoose document
			if (!field) {
				data[path] = item.get(path);
				return;
			}

			// If the field is not a relationship or we are not expanding it, transform the value
			if (field.type !== 'relationship' || !options.expandRelationshipFields) {
				data[path] = transformFieldValue(field, item, options);
				return;
			}

			// Expand relationship values
			var expanded = field.getExpandedData(item);
			if (field.many) {
				// For many-to-many relationships, create a comma-separated list of 'name (id)'
				data[path] = (Array.isArray(expanded) ? expanded : []).map(function (i) {
					return i.name ? i.name + ' (' + i.id + ')' : i.id;
				}).join(', ');
			} else if (typeof expanded === 'object') {
				// For one-to-many relationships, add separate name and id columns
				data[path] = expanded.name;
				data[path + 'Id'] = expanded.id;
			}
		}, this);
	}

	// If the item has a getCSVData method, call it
	if (typeof item.getCSVData === 'function') {
		var ext = item.getCSVData(data, options);
		if (typeof ext === 'object') {
			_.forOwn(ext, function (value, key) {
				if (value === undefined) {
					delete data[key];
				} else {
					data[key] = value;
				}
			});
		}
	}

	// Flatten arrays and objects into separate columns
	var rtn = {};
	_.forOwn(data, function (value, prop) {
		if (Array.isArray(value)) {
			rtn[prop] = JSON.stringify(value);
		} else if (typeof value === 'object') {
			_.forOwn(value, function (v, i) {
				var suffix = i.substr(0, 1).toUpperCase() + i.substr(1);
				rtn[prop + suffix] = (typeof v === 'object') ? JSON.stringify(v) : v;
			});
		} else {
			rtn[prop] = value;
		}
	});

	// Prevent CSV macro injection
	_.forOwn(rtn, (value, prop) => {
		rtn[prop] = escapeValueForExcel(value);
	});

	// Return the final data object
	return rtn;
}

module.exports = getCSVData;
