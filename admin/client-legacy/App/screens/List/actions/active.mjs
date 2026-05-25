import {
	CLEAR_FILTER,
	CLEAR_ALL_FILTERS,
	CLEAR_CACHED_QUERY,
	SET_ACTIVE_SEARCH,
	SELECT_ACTIVE_SORT,
	SELECT_ACTIVE_COLUMNS,
	SET_ACTIVE_LIST,
	SELECT_FILTER,
	SET_FILTERS,
} from '../constants.mjs';


/**
 * Active actions
 */

/**
 * Sets the active search string used to filter list items.
 * @param {string} searchString The search query entered by the user.
 * @returns {object} The SET_ACTIVE_SEARCH action object.
 */
export function setActiveSearch (searchString) {
	return {
		type: SET_ACTIVE_SEARCH,
		searchString,
	};
}

/**
 * Sets the active sort path for the list.
 * @param {string} path The field path to sort by.
 * @returns {object} The SELECT_ACTIVE_SORT action object.
 */
export function setActiveSort (path) {
	return {
		type: SELECT_ACTIVE_SORT,
		path,
	};
}

/**
 * Sets the active columns displayed in the list.
 * @param {Array} columns The array of column definitions to display.
 * @returns {object} The SELECT_ACTIVE_COLUMNS action object.
 */
export function setActiveColumns (columns) {
	return {
		type: SELECT_ACTIVE_COLUMNS,
		columns,
	};
}

/**
 * Sets the active list and its ID in the store.
 * @param {object} list The list object from the lists data map.
 * @param {string} id The list ID.
 * @returns {object} The SET_ACTIVE_LIST action object.
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
 * Clears the filter for a specific field path.
 * @param {string} path The field path whose filter should be cleared.
 * @returns {object} The CLEAR_FILTER action object.
 */
export function clearFilter (path) {
	return {
		type: CLEAR_FILTER,
		path,
	};
}

/**
 * Clears all active filters.
 * @returns {object} The CLEAR_ALL_FILTERS action object.
 */
export function clearAllFilters () {
	return {
		type: CLEAR_ALL_FILTERS,
	};
}

/**
 * Sets a filter for a specific field path and value.
 * @param {string} path The field path to filter on.
 * @param {string|number|boolean|Array} value The filter value.
 * @returns {object} The SELECT_FILTER action object containing the filter.
 */
export function setFilter (path, value) {
	return {
		type: SELECT_FILTER,
		filter: { path, value },
	};
}

/**
 * Replaces all active filters with a parsed filter array.
 * @param {Array} filters The filters parsed from the current query string.
 * @returns {object} The SET_FILTERS action object.
 */
export function setActiveFilters (filters) {
	return {
		type: SET_FILTERS,
		filters,
	};
}

/**
 * Clears the cached query so a fresh fetch is performed on next load.
 * @returns {object} The CLEAR_CACHED_QUERY action object.
 */
export function clearCachedQuery () {
	return {
		type: CLEAR_CACHED_QUERY,
	};
}
