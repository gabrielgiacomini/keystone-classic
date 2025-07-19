/**
 * @fileoverview This file defines the `expandPaths` function, which expands a
 * list of paths into an array of objects, each containing the path and its
 * corresponding field from the list. It handles special cases like `__name__`.
 */
var listToArray = require('list-to-array');

/**
 * Expands a comma-separated string or array of paths into valid path objects.
 *
 * The path `__name__` is automatically mapped to the namePath of the List.
 *
 * @param {string|Array} paths
 * @return {Array}
 */
function expandPaths (paths) {
	return listToArray(paths).map(function (path) {
		if (path === '__name__') {
			path = this.mappings.name;
		}
		return {
			path: path,
			field: this.fields[path],
		};
	}, this);
}

module.exports = expandPaths;
