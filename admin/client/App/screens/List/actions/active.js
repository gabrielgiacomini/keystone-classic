/**
 * @fileoverview This file contains the actions for the active list.
 */
import {
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	CLEAR_CACHED_QUERY,
	SET_ACTIVE_SEARCH,
	SELECT_ACTIVE_SORT,
	SELECT_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
	SELECT_FILTER,
} from '../constants';

/**
 * Active actions
 */

/**
 * Sets the active search string.
 *
 * @param {string} searchString The search string.
 * @returns {object} The action object.
 */
export function setActiveSearch (searchString) {
	return {
		type: SET_ACTIVE_SEARCH,
		searchString,
	};
}

/**
 * Sets the active sort.
 *
 * @param {string} path The path of the sort.
 * @returns {object} The action object.
 */
export function setActiveSort (path) {
	return {
		type: SELECT_ACTIVE_SORT,
		path,
	};
}

/**
 * Sets the active columns.
 *
 * @param {string} columns The columns.
 * @returns {object} The action object.
 */
export function setActiveColumns (columns) {
	return {
		type: SELECT_ACTIVE_COLUMNS,
		columns,
	};
}

/**
 * Sets the active list.
 *
 * @param {object} list The list.
 * @param {string} id The id of the list.
 * @returns {object} The action object.
 */
export function setActiveList (list, id) {
	return {
		type: SET_ACTIVE_LIST,
		list,
		id,
	};
}

/**
 * Filtering actions
 */

/**
 * Clears the filter for the given path.
 *
 * @param {string} path The path of the filter to clear.
 * @returns {object} The action object.
 */
export function clearFilter (path) {
	return {
		type: CLEAR_FILTER,
		path,
	};
}

/**
 * Clears all filters.
 *
 * @returns {object} The action object.
 */
export function clearAllFilters () {
	return {
		type: CLEAR_ALL_FILTERS,
	};
}

/**
 * Sets the filter for the given path.
 *
 * @param {string} path The path of the filter.
 * @param {string} value The value of the filter.
 * @returns {object} The action object.
 */
export function setFilter (path, value) {
	return {
		type: SELECT_FILTER,
		filter: { path, value },
	};
}

/**
 * Clears the cached query.
 *
 * @returns {object} The action object.
 */
export function clearCachedQuery () {
	return {
		type: CLEAR_CACHED_QUERY,
	};
}
