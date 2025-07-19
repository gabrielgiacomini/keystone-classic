/**
 * @fileoverview This file defines the `expandSort` function, which expands a
 * sort string into a sort object. It also includes a `truthy` helper function.
 */
var listToArray = require('list-to-array');

/**
 * Returns `true` if the value is truthy.
 *
 * @param {*} i The value to check.
 * @return {boolean}
 */
function truthy (i) { return i; }

/**
 * Expands a sort string into a sort object.
 *
 * @param {string} input The sort string to expand.
 * @return {Object} The expanded sort object.
 */
function expandSort (input) {
	var fields = this.fields;
	var sort = {
		rawInput: input || this.defaultSort,
		isDefaultSort: false,
	};
	sort.input = sort.rawInput;

	// If the input is '__default__', use the default sort
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = this.sortable ? 'sortOrder' : this.namePath;
	}

	// Expand the sort paths
	sort.paths = listToArray(sort.input).map(function (path) {
		var invert = false;
		// Check for descending sort
		if (path.charAt(0) === '-') {
			invert = true;
			path = path.substr(1);
		}
		var field = fields[path];
		if (!field) {
			return;
		}
		return {
			field: field,
			invert: invert,
			path: field.path,
		};
	}).filter(truthy);

	// Generate the sort string
	sort.string = sort.paths.map(function (i) {
		if (i.field.getSortString) {
			return i.field.getSortString(i);
		}
		return i.invert ? '-' + i.path : i.path;
	}).join(' ');

	// Return the sort object
	return sort;
}

module.exports = expandSort;
