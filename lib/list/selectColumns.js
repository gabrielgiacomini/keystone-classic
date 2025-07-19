/**
 * @fileoverview This file defines the `selectColumns` function, which specifies
 * select and populate options for a Mongoose query based on the provided columns.
 */

/**
 * Specifies select and populate options for a query based on the provided columns.
 *
 * @param {Query} q The Mongoose query to modify.
 * @param {Array} cols The columns to select and populate.
 */
function selectColumns (q, cols) {
	// Initialize select and populate options
	var select = [];
	var populate = {};
	var path;

	// Iterate over the columns to build the select and populate options
	cols.forEach(function (col) {
		// Add the column path to the select array
		select.push(col.path);
		// If the column has a populate option, add it to the populate object
		if (col.populate) {
			if (!populate[col.populate.path]) {
				populate[col.populate.path] = [];
			}
			populate[col.populate.path].push(col.populate.subpath);
		}
	});

	// Apply the select options to the query
	q.select(select.join(' '));

	// Apply the populate options to the query
	for (path in populate) {
		if (populate.hasOwnProperty(path)) {
			q.populate(path, populate[path].join(' '));
		}
	}
}

module.exports = selectColumns;
