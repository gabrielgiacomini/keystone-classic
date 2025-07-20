/**
 * @fileoverview This file contains the parsers for the filters.
 *
 * The filters are used to filter the items in the list view.
 * The parsers are used to convert the filters from a string representation
 * to an array of filter objects.
 */
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';

/**
 * Returns an array of expanded filter objects,
 * given (a string representation | an array of filters) and a currentList object.
 *
 * @param {string|Array} filters Either a string representation of an array of filter objects, or an array of filter objects.
 * @param {Object} currentList The current instantiation of the List prototype used for the <List/> scene.
 * @returns {Array} of {Objects} as an expanded representation of the filters passed in.
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
 * Returns an array of expanded filter objects,
 * given (a string representation | an array of filters) and a currentList object.
 *
 * @param {Object} filterObject Filter object containing the following key value pairs {path} and {value}.
 * @param {Array} activeFilters of {Objects} an array of the currently active filters.
 * @param {Object} currentList The current instantiation of the List prototype used for the <List/> scene.
 * @returns {Object} an expanded representation of the passed in filter {Object}.
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

/**
 * Returns a filter object
 * given a path, a value, and the fields within an instance of the List prototype.
 *
 * @param {string} path The filter path.
 * @param {Object} value of filter values.
 * @param {Object} currentListFields of fields from the current instance of the List prototype.
 * @returns {Object} a filter comprised of the:filters.js
 * - corresponding field value within the current List,
 * - and the passed in value {Object}.
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
