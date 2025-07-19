/**
 * @fileoverview This file defines the `paginate` function, which provides a
 * special Query object for paginating documents in a Keystone list. It handles
 * options for page number, results per page, and maximum pages, and returns a
 * paginated result set.
 */

/**
 * Gets a special Query object that will paginate documents in the list.
 *
 * Example:
 *     list.paginate({
 *         page: 1,
 *         perPage: 100,
 *         maxPages: 10
 *     }).exec(function(err, results) {
 *         // do something
 *     });
 *
 * @param {Object} options The pagination options.
 * @param {function} [callback] Optional callback function.
 * @return {Query} A special Query object for pagination.
 */
function paginate (options, callback) {
	var list = this;
	var model = this.model;

	options = options || {};

	// Create a query to find the documents
	var query = model.find(options.filters, options.optionalExpression);
	// Create a query to count the documents
	var countQuery = model.find(options.filters);

	// Store the original exec, sort, and select methods
	query._original_exec = query.exec;
	query._original_sort = query.sort;
	query._original_select = query.select;

	// Get pagination options
	var currentPage = Number(options.page) || 1;
	var resultsPerPage = Number(options.perPage) || 50;
	var maxPages = Number(options.maxPages) || 10;
	var skip = (currentPage - 1) * resultsPerPage;

	list.pagination = { maxPages: maxPages };

	// Defer sorting and field selection until after the count has been executed
	query.select = function () {
		options.select = arguments[0];
		return query;
	};

	query.sort = function () {
		options.sort = arguments[0];
		return query;
	};

	// Override the exec method to perform pagination
	query.exec = function (callback) {
		// Count the total number of documents
		countQuery.count(function (err, count) {
			if (err) return callback(err);

			// Find the documents for the current page
			query.find().limit(resultsPerPage).skip(skip);

			// Apply the select and sort options before calling exec
			if (options.select) {
				query._original_select(options.select);
			}

			if (options.sort) {
				query._original_sort(options.sort);
			}

			// Execute the original exec method
			query._original_exec(function (err, results) {
				if (err) return callback(err);
				var totalPages = Math.ceil(count / resultsPerPage);
				// Prepare the pagination results
				var rtn = {
					total: count,
					results: results,
					currentPage: currentPage,
					totalPages: totalPages,
					pages: [],
					previous: (currentPage > 1) ? (currentPage - 1) : false,
					next: (currentPage < totalPages) ? (currentPage + 1) : false,
					first: skip + 1,
					last: skip + results.length,
				};
				// Generate the page array
				list.getPages(rtn, maxPages);
				// Call the callback with the results
				callback(err, rtn);
			});
		});
	};

	// If a callback is provided, execute the query
	if (callback) {
		return query(callback);
	} else {
		// Otherwise, return the query object
		return query;
	}
}

module.exports = paginate;
