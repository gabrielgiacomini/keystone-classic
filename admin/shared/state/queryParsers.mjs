import { isObject, isPlainObject } from './valueGuards.mjs';

export function columnsParser(columns, currentList) {
	if (!currentList) {
		throw new Error('No currentList selected');
	}
	if (!columns || columns.length === 0) {
		return currentList.expandColumns(currentList.defaultColumns);
	}
	return currentList.expandColumns(columns);
}

export function sortParser(path, currentList) {
	if (!currentList) {
		throw new Error('No currentList selected');
	}
	if (!path) return currentList.expandSort(currentList.defaultSort);
	return currentList.expandSort(path);
}

export function filtersParser(filters, currentList) {
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

export function filterParser({ path, value }, activeFilters, currentList) {
	if (!activeFilters || !Array.isArray(activeFilters)) {
		throw new Error('activeFilters must be an array');
	}
	if (!currentList) {
		throw new Error('No currentList selected');
	}

	if (!isObject(currentList) || Array.isArray(currentList)) {
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

export function createFilterObject(path, value, currentListFields) {
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
