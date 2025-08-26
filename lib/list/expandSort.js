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
 * @return {{rawInput: string, isDefaultSort: boolean, input: string, paths: {field: import('../field').Field, invert: boolean, path: string}[], string: string}} The expanded sort object.
 */
function expandSort (input) {
	var fields = this.fields;
	var sort = {
		rawInput: input || this.defaultSort,
		isDefaultSort: false,
	};
	sort.input = sort.rawInput;
	if (sort.input === '__default__') {
		sort.isDefaultSort = true;
		sort.input = this.sortable ? 'sortOrder' : this.namePath;
	}
	sort.paths = listToArray(sort.input).map(function (path) {
		var invert = false;
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
	sort.string = sort.paths.map(function (i) {
		if (i.field.getSortString) {
			return i.field.getSortString(i);
		}
		return i.invert ? '-' + i.path : i.path;
	}).join(' ');
	return sort;
}

module.exports = expandSort;
