/**
 * @fileoverview This file defines the `expandColumns` function, which expands a
 * comma-separated string or array of columns into valid column objects for a
 * Keystone list. It handles different column formats, including fields, related
 * list fields, and schema paths, with optional width specifications.
 */
var utils = require('keystone-utils');

/**
 * Expands a comma-separated string or array of columns into valid column objects.
 *
 * Columns can be:
 *    - A Field, in the format "field|width"
 *    - A Field in a single related List, in the format "list:field|width"
 *    - Any valid path in the Schema, in the format "path|width"
 *
 * The width part is optional, and can be in the format "n%" or "npx".
 *
 * The path __name__ is automatically mapped to the namePath of the List.
 *
 * The field or path for the name of the item (defaults to ID if not set or detected)
 * is automatically prepended if not explicitly included.
 *
 * @param {string|Array} cols The columns to expand.
 * @return {Array} The expanded columns.
 */
function expandColumns (cols) {
	// If cols is a string, split it into an array
	if (typeof cols === 'string') {
		cols = cols.split(',');
	}
	// Ensure cols is an array
	if (!Array.isArray(cols)) {
		throw new Error('List.expandColumns: cols must be an array.');
	}

	var list = this;
	var expanded = [];
	var nameCol = false;

	/**
	 * Gets a column object from a definition.
	 *
	 * @param {Object} def The column definition.
	 * @return {Object} The column object.
	 */
	var getCol = function (def) {
		// If the path is '__name__', use the list's namePath
		if (def.path === '__name__') {
			def.path = list.namePath;
		}

		var field = list.fields[def.path];
		var col = null;

		if (field) {
			// The path corresponds to a field
			col = {
				field: field,
				path: field.path,
				type: field.type,
				label: def.label || field.label,
			};
			// If the field is a relationship, populate it
			if (col.type === 'relationship') {
				col.refList = col.field.refList;
				if (col.refList) {
					col.refPath = def.subpath || col.refList.namePath;
					col.subField = col.refList.fields[col.refPath];
					col.populate = { path: col.field.path, subpath: col.refPath };
				}
				if (!def.label && def.subpath) {
					col.label = field.label + ': ' + (col.subField ? col.subField.label : utils.keyToLabel(def.subpath));
				}
			}
		} else if (list.model.schema.paths[def.path] || list.model.schema.virtuals[def.path]) {
			// The path corresponds to a schema path or virtual
			col = {
				path: def.path,
				label: def.label || utils.keyToLabel(def.path),
			};
		}

		if (col) {
			// Set the width of the column
			col.width = def.width;
			// If the column is the name column, set the isName flag
			if (col.path === list.namePath) {
				col.isName = true;
				nameCol = col;
			}
			// Extend the column with any additional properties from the field
			if (field && field.col) {
				_.extend(col, field.col);
			}
		}
		return col;
	};

	// Iterate over the columns and expand them
	for (var i = 0; i < cols.length; i++) {
		var def = {};
		// If the column is a string, parse it
		if (typeof cols[i] === 'string') {
			var parts = cols[i].trim().split('|');
			def.width = parts[1] || false;
			parts = parts[0].split(':');
			def.path = parts[0];
			def.subpath = parts[1];
		}
		// Ensure the column definition is valid
		if (!utils.isObject(def) || !def.path) {
			throw new Error('List.expandColumns: column definition must contain a path.');
		}
		// Get the column object and add it to the expanded array
		var col = getCol(def);
		if (col) {
			expanded.push(col);
		}
	}

	// If the name column is not present, add it to the beginning of the array
	if (!nameCol) {
		nameCol = getCol({ path: list.namePath });
		if (nameCol) {
			expanded.unshift(nameCol);
		}
	}

	// Return the expanded columns
	return expanded;
}

module.exports = expandColumns;
