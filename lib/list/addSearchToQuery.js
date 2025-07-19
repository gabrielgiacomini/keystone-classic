/**
 * @fileoverview This file defines the `addSearchToQuery` function, which adds
 * a search query to a Keystone list query. It supports both text index search
 * and regular expression search, and includes helper functions for creating
 * filters for name and string fields.
 */
var assign = require('object-assign');
var utils = require('keystone-utils');
var debug = require('debug')('keystone:core:list:addSearchToQuery');

/**
 * Trims a string.
 *
 * @param {string} i The string to trim.
 * @return {string} The trimmed string.
 */
function trim (i) { return i.trim(); }

/**
 * Returns `true` if the value is truthy.
 *
 * @param {*} i The value to check.
 * @return {boolean}
 */
function truthy (i) { return i; }

/**
 * Creates a filter for a name field.
 *
 * @param {Object} field The name field.
 * @param {string} searchString The search string.
 * @return {Object} The filter object.
 */
function getNameFilter (field, searchString) {
	// Split the search string into words, trim them, and escape them for regex
	var searchWords = searchString.split(' ').map(trim).filter(truthy).map(utils.escapeRegExp);
	// Create a regex to match any of the search words
	var nameSearchRegExp = new RegExp(searchWords.join('|'), 'i');
	var first = {};
	first[field.paths.first] = nameSearchRegExp;
	var last = {};
	last[field.paths.last] = nameSearchRegExp;
	// Return a filter that matches either the first or last name
	return {
		$or: [first, last],
	};
}

/**
 * Creates a filter for a string field.
 *
 * @param {string} path The path of the string field.
 * @param {RegExp} searchRegExp The regex to use for the search.
 * @return {Object} The filter object.
 */
function getStringFilter (path, searchRegExp) {
	var filter = {};
	filter[path] = searchRegExp;
	return filter;
}

/**
 * Adds a search query to a query object.
 *
 * @param {string} searchString The search string.
 * @return {Object} The query object with the search query added.
 */
function addSearchToQuery (searchString) {
	searchString = String(searchString || '').trim();
	var query = {};
	var searchFilters = [];
	if (!searchString) return query;

	// If the list uses a text index, use it
	if (this.options.searchUsesTextIndex) {
		debug('Using text search index for value: "' + searchString + '"');
		// Add a text search filter
		searchFilters.push({
			$text: {
				$search: searchString,
			},
		});

		// If the list has an autokey, add a filter for it
		if (this.autokey) {
			var strictAutokeyFilter = {};
			var autokeyRegExp = new RegExp('^' + utils.escapeRegExp(searchString));
			strictAutokeyFilter[this.autokey.path] = autokeyRegExp;
			searchFilters.push(strictAutokeyFilter);
		}
	} else {
		// Otherwise, use regular expression search
		debug('Using regular expression search for value: "' + searchString + '"');
		var searchRegExp = new RegExp(utils.escapeRegExp(searchString), 'i');
		// Create filters for the search fields
		searchFilters = this.searchFields.map(function (i) {
			if (i.field && i.field.type === 'name') {
				return getNameFilter(i.field, searchString);
			} else {
				return getStringFilter(i.path, searchRegExp);
			}
		}, this);

		// If the list has an autokey, add a filter for it
		if (this.autokey) {
			var autokeyFilter = {};
			autokeyFilter[this.autokey.path] = searchRegExp;
			searchFilters.push(autokeyFilter);
		}
	}

	// If the search string is a valid ObjectId, add a filter for it
	if (utils.isValidObjectId(searchString)) {
		searchFilters.push({
			_id: searchString,
		});
	}

	// If there are multiple search filters, combine them with $or
	if (searchFilters.length > 1) {
		query.$or = searchFilters;
	} else if (searchFilters.length) {
		// Otherwise, just use the single filter
		assign(query, searchFilters[0]);
	}

	debug('Built search query for value: "' + searchString + '"', query);
	return query;
}

module.exports = addSearchToQuery;
