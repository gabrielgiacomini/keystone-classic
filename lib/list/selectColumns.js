/**
 * @fileoverview This file defines the `selectColumns` function, which specifies
 * select and populate options for a Mongoose query based on the provided columns.
 */

/**
 * Specifies select and populate options for a query based on the provided columns.
 *
 * @param {import('mongoose').Query} q The Mongoose query to modify.
 * @param {Object[]} cols The columns to select and populate.
 */
function selectColumns (q, cols) {
	// Populate relationship columns
	var select = [];
	var populate = {};
	var path;
	cols.forEach(function (col) {
		select.push(col.path);
		if (col.populate) {
			if (!populate[col.populate.path]) {
				populate[col.populate.path] = [];
			}
			populate[col.populate.path].push(col.populate.subpath);
		}
	});
	q.select(select.join(' '));
	for (path in populate) {
		if (populate.hasOwnProperty(path)) {
			q.populate(path, populate[path].join(' '));
		}
	}
}

module.exports = selectColumns;
