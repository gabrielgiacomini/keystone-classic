/**
 * @fileoverview This file defines the `addFiltersToQuery` function, which is
 * used to add filters to a query object based on the list's fields. It also
 * defines a helper function `combineQueries` to merge query conditions.
 */
var assign = require('object-assign');
var debug = require('debug')('keystone:core:list:addFiltersToQuery');

/**
 * Combines two query objects. If both queries have `$or` conditions, they are
 * merged into an `$and` condition.
 *
 * @param {Object} a The first query object.
 * @param {Object} b The second query object.
 * @return {Object} The combined query object.
 */
function combineQueries (a, b) {
	if (a.$or && b.$or) {
		if (!a.$and) {
			a.$and = [];
		}
		a.$and.push({ $or: a.$or });
		delete a.$or;
		b.$and.push({ $or: b.$or });
		delete b.$or;
	}
	return assign(a, b);
}

/**
 * Adds filters to a query object.
 *
 * @param {Object.<string, Object>} filters The filters to add.
 * @return {Object} The query object with the filters added.
 */
function addFiltersToQuery (filters) {
	var fields = Object.keys(this.fields);
	var query = {};
	fields.forEach(function (path) {
		var field = this.fields[path];
		if (!field.addFilterToQuery || !filters[field.path]) return;
		combineQueries(query, field.addFilterToQuery(filters[field.path]));
	}, this);

	debug('Adding filters to query, returned:', query);
	return query;
}

module.exports = addFiltersToQuery;
