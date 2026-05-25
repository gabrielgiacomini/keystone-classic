import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

/**
 * Returns an array of expanded filter objects,
 * given (a string representation | an array of filters) and a currentList object.
 * @param {string|Array} filters - A string representation of an array of filter objects, or an array of filter objects.
 * @param {object} currentList - The current instantiation of the List prototype used for the List scene.
 * @returns {Array} An array of expanded filter objects.
 */
export function filtersParser (filters, currentList) {
	if (typeof filters === 'string') {
		try {
			filters = JSON.parse(filters);
		} catch (e) {
			console.warn('Invalid filters provided', filters);
			filters = void 0;
		}
	}

	if (!filters) return [];

	const assembledFilters = filters.map(filter => {
		const path = filter.path;
		const value = Object.assign({}, filter);
		delete value.path;
		return createFilterObject(path, value, currentList.fields);
	});

	filters = assembledFilters.filter(filter => filter);
	return filters;
}

/**
 * Returns an expanded filter object for a single filter,
 * updating an existing active filter if its path is already present,
 * or creating a new one via createFilterObject.
 * @param {object} filter - Filter object containing the key-value pairs path and value.
 * @param {string} filter.path - The field path the filter applies to.
 * @param {object} filter.value - An object of filter values.
 * @param {Array} activeFilters - An array of the currently active filter objects.
 * @param {object} currentList - The current instantiation of the List prototype used for the List scene.
 * @returns {object|undefined} An expanded filter object, or undefined if the path is invalid.
 */
export function filterParser ({ path, value }, activeFilters, currentList) {
	if (!activeFilters || !isArray(activeFilters)) {
		throw new Error('activeFilters must be an array');
	}
	if (!currentList) {
		throw new Error('No currentList selected');
	}

	if (!isObject(currentList) || isArray(currentList)) {
		throw new Error('currentList is expected to be an { Object }', currentList);
	}

	let filter = activeFilters.filter(i => i.field.path === path)[0];
	if (filter) {
		filter.value = value;
	} else {
		filter = createFilterObject(path, value, currentList.fields);
		if (!filter) {
			return void 0;
		}
	}
	return filter;
}

/*
* This method is a util, but has such a specific use that it is being left within
* the file that uses it.
*/

/**
 * Returns a filter object given a path, a value, and the fields of a List instance.
 * Returns undefined and logs a warning if the path is not found in currentListFields.
 * @param {string} path - The filter path corresponding to a field key in currentListFields.
 * @param {object} value - An object of filter values.
 * @param {object} currentListFields - A plain object of fields from the current List instance.
 * @returns {object|undefined} A filter object with a field and value property, or undefined if the path is invalid.
 */
export function createFilterObject (path, value, currentListFields) {
	if (!currentListFields || !isPlainObject(currentListFields)) {
		console.warn('currentListFields must be a plain object', currentListFields);
		return;
	}

	const field = currentListFields[path];

	if (!field) {
		console.warn('Invalid Filter path specified:', path);
		return;
	}

	return {
		field,
		value,
	};
}
