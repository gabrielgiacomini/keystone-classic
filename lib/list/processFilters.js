/**
 * @fileoverview This file defines the `processFilters` function, which is used
 * to process a filter string into a filters object. This function is deprecated.
 */
var queryfilterlib = require('queryfilter');

/**
 * Processes a filter string into a filters object.
 *
 * NOTE: This function is deprecated in favor of List.prototype.addFiltersToQuery
 * and will be removed in a later version.
 *
 * @param {string} q The filter string to process.
 * @return {Object} The processed filters object.
 */
function processFilters (q) {
	var list = this;
	var filters = {};

	// Create a new query filter and get the filters
	queryfilterlib.QueryFilters.create(q).getFilters().forEach(function (filter) {
		// Alias filter.key to filter.path for backward compatibility
		filter.path = filter.key;
		// Get the field from the list
		filter.field = list.fields[filter.key];
		// Add the filter to the filters object
		filters[filter.path] = filter;
	});

	// Return the filters object
	return filters;
}

module.exports = processFilters;
