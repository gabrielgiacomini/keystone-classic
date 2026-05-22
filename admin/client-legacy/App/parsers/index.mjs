import { filtersParser, filterParser, createFilterObject } from './filters.mjs';

/**
 * Returns an array of expanded column objects, given a columns value and a currentList object.
 * Falls back to the list's default columns when columns is empty or falsy.
 * @param {string} columns - A string representation of a list of columns.
 * @param {object} currentList - The current instantiation of the List prototype used for the List scene.
 * @returns {Array} An array of expanded column objects.
 */
function columnsParser (columns, currentList) {
	if (!currentList) {
		throw new Error('No currentList selected');
	}
	if (!columns || columns.length === 0) {
		return currentList.expandColumns(currentList.defaultColumns);
	}
	return currentList.expandColumns(columns);
};

/**
 * Returns an expanded sort object, given a sort path and a currentList object.
 * Falls back to the list's default sort when path is falsy.
 * @param {string} path - A string representation of the sort path.
 * @param {object} currentList - The current instantiation of the List prototype used for the List scene.
 * @returns {object} An expanded representation of the sort path.
 */
function sortParser (path, currentList) {
	if (!currentList) {
		throw new Error('No currentList selected');
	}
	if (!path) return currentList.expandSort(currentList.defaultSort);
	return currentList.expandSort(path);
}

export {
	createFilterObject,
	filtersParser,
	filterParser,
	sortParser,
	columnsParser,
};
