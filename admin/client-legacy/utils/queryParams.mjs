import isEqual from 'lodash/isEqual';

/**
 * Checks whether the query parameters have changed between the previous and
 * next props, taking into account the cached query stored in active state.
 * @param  {object} nextProps  The incoming props, including location and active
 * @param  {object} thisProps  The current props, including location
 * @returns {boolean} True if the query has meaningfully changed, false otherwise
 */
export function checkForQueryChange (nextProps, thisProps) {
	const { query } = nextProps.location;
	const { cachedQuery } = nextProps.active;

	const parsedQuery = Object.assign(
		{},
		query,
		{ page: parseInt(query.page) }
	);

	if (!parsedQuery.page) delete parsedQuery.page;

	const { search: _sq, ...attenuatedQuery } = parsedQuery;
	const { search: _sc, ...attenuatedCache } = cachedQuery;

	if (nextProps.location.pathname !== thisProps.location.pathname) return true;

	if (!isEqual(attenuatedQuery, attenuatedCache)) return true;

	return false;
}

/**
 * Returns undefined when the value equals the benchmark, otherwise returns the value.
 * Used to omit query params that match the default.
 * @param  {string|number} value     The value to test
 * @param  {string|number} benchmark The default value to compare against
 * @returns {string|number|undefined} The original value, or undefined if it equals the benchmark
 */
export function normaliseValue (value, benchmark) {
	if (value === benchmark) return void 0;
	return value;
}

/**
 * Returns the sort query param value, or undefined if it matches the default.
 * @param  {string} rawInput    The raw sort input string
 * @param  {string} defaultSort The default sort value for the list
 * @returns {string|undefined} The sort param value, or undefined if it is the default
 */
export function createSortQueryParams (rawInput, defaultSort) {
	return normaliseValue(rawInput, defaultSort);
}

/**
 * Returns the page query param value, or undefined if it matches the default.
 * @param  {number} page         The current page number
 * @param  {number} defaultValue The default page value
 * @returns {number|undefined} The page param value, or undefined if it is the default
 */
export function createPageQueryParams (page, defaultValue) {
	return normaliseValue(page, defaultValue);
}

/**
 * Updates the query parameters with the ones passed as the first argument
 * @param  {object} params   The new parameters to be added
 * @param  {object} location The current location object
 * @returns {object|undefined} The merged query params object, or undefined if no location
 */
export function updateQueryParams (params, location) {
	if (!location) return;
	const newParams = Object.assign({}, location.query);
	// Stringify nested objects inside the parameters
	Object.keys(params).forEach(i => {
		if (params[i]) {
			newParams[i] = params[i];
			if (typeof newParams[i] === 'object') {
				newParams[i] = JSON.stringify(newParams[i]);
			}
		} else {
			delete newParams[i];
		}
	});

	return newParams;
}

/**
 * Stringify the columns array from the state
 * @param  {Array}  columns            The columns from the active state
 * @param  {string} defaultColumnPaths The default column paths of the current list
 * @returns {string|undefined} The column array as a comma-separated string, or undefined
 */
export function stringifyColumns (columns, defaultColumnPaths) {
	if (!columns) {
		return;
	}
	// Turns [{ path: 'someColumn' }, { path: 'someOtherColumn' }]
	// into ['someColumn', 'someOtherColumn']
	let columnString = columns.map((column) => column.path);
	// Turns that array into 'someColumn,someOtherColumn'
	if (Array.isArray(columnString)) columnString = columnString.join(',');
	// If that is the same as the default columns, don't set the query param
	if (columnString === defaultColumnPaths) columnString = undefined;
	return columnString;
}


/**
 * Flattens filters from state into the minimum needed object to be used as a url param
 * @param  {Array} filterArray The array of filters from state
 * @returns {Array|undefined} The flattened filters array, or undefined if empty
 */
export function parametizeFilters (filterArray) {
	if (!filterArray || filterArray.length === 0) {
		return;
	}
	return filterArray.map((filter) => {
		return Object.assign({
			path: filter.field.path,
		}, filter.value);
	});
}
