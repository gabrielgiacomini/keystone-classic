/**
 * @fileoverview This file defines the `apiForGet` function, which returns JSON
 * API middleware for a GET /:id endpoint. It allows for querying and
 * transforming the data before sending it as a JSON response.
 */

/**
 * Returns JSON API middleware for a GET /:id endpoint.
 *
 * Supports the following options:
 *
 * - `id` (string): Optional. Defaults to `"id"`. The name of the express URL
 *   param that contains the ID to get.
 * - `query` (function(query, req, res)): Optional. A function that modifies
 *   the query to find the item. You can use this to check anything about the
 *   request (e.g. permissions), and/or modify the conditions on the mongoose
 *   query. You can handle the response from within this function; return `false`
 *   to stop the API middleware from continuing.
 * - `query` (object): Optional. An object of additional `where` conditions to
 *   add to the `query`.
 * - `transform` (function(item, req, res)): A function that transforms the
 *   object before it is sent as JSON.
 *
 * @param {Object} options
 * @return {function}
 */
module.exports = function apiForGet (options) {
	// Get the ID parameter from the options or default to 'id'
	var idParam = options.id || 'id';
	var List = this;

	// Return a middleware function
	return function (req, res) {
		// Get the ID from the request parameters
		var id = req.params[idParam];
		// Create a query to find the item by ID
		var query = List.model.findById(id);

		// If a query function is provided, execute it
		if (typeof options.query === 'function') {
			var result = options.query(query, req, res);
			// If the query function returns false, stop processing
			if (result === false) return;
		} else if (typeof options.query === 'object') {
			// If a query object is provided, add it to the where clause
			query.where(options.query);
		}

		// Execute the query
		query.exec(function (err, item) {
			// Handle database errors
			if (err) return res.status(500).json({ err: 'database error', detail: err });
			// Handle not found errors
			if (!item) return res.status(404).json({ err: 'not found', id: id });

			// If a transform function is provided, execute it
			if (options.transform) {
				item = options.transform(item, req, res);
				// If the transform function returns false, stop processing
				if (item === false) return;
			}

			// Return the item as JSON
			return res.json({
				data: item,
			});
		});
	};
};
