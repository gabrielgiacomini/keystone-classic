import { updateQueryParams, stringifyColumns, parametizeFilters, createSortQueryParams, createPageQueryParams } from '../../utils/queryParams.mjs';
import { replace, push } from '../../routerRedux.mjs';
import { select, put, call } from 'redux-saga/effects';
import * as actions from '../screens/List/constants.mjs';

import { loadItems } from '../screens/List/actions/index.mjs';

import isEqual from 'lodash/isEqual';
import { columnsParser, sortParser, filtersParser } from '../parsers/index.mjs';

/**
 * Pushes or replaces the browser history entry based on whether the
 * query (excluding the search field) has changed relative to the cache.
 * A changed query triggers a push; an unchanged query triggers a replace.
 * @param {object} query - The new query-parameter object.
 * @param {object} cache - The previously cached query-parameter object.
 * @param {string} pathname - The current URL pathname.
 * @yields {void} Redux saga put effects.
 */
export function * urlUpdate (query, cache, pathname) {
	const { search: _sq, ...attenuatedQuery } = query;
	const { search: _sc, ...attenuatedCache } = cache;
	if (!isEqual(attenuatedQuery, attenuatedCache)) {
		yield put(push({
			pathname,
			query,
		}));
	} else {
		yield put(replace({
			pathname,
			query,
		}));
	}
}
/**
 * Update the query params based on the current state.
 * Serialises active sort, page, columns, search, and filters into URL query
 * params, caches the result, updates the browser history, and triggers an
 * item reload.
 * @yields {void} Redux saga select, put, and call effects.
 */
export function * updateParams () {
	// Select all the things
	const activeState = yield select((state) => state.active);
	const currentList = yield select((state) => state.lists.currentList);
	const location = yield select((state) => state.routing.locationBeforeTransitions);
	const { index } = yield select((state) => state.lists.page);

	// Get the data into the right format, set the defaults
	const sort = createSortQueryParams(activeState.sort.rawInput, currentList.defaultSort);
	const page = createPageQueryParams(index, 1);

	const columns = stringifyColumns(activeState.columns, currentList.defaultColumnPaths);
	const search = activeState.search;

	const filters = parametizeFilters(activeState.filters);

	const newParams = updateQueryParams({
		page,
		columns,
		sort,
		search,
		filters,
	}, location);

	// TODO: Starting or clearing a search pushes a new history state, but updating
	// the current search replaces it for nicer history navigation support

	yield put({ type: actions.REPLACE_CACHED_QUERY, cachedQuery: newParams });
	yield * urlUpdate(newParams, activeState.cachedQuery, location.pathname);
	yield put(loadItems());
}


/**
 * Evaluates the current URL query params against the cached query.
 * If the current pathname does not match the active list, returns early.
 * If the params are unchanged, dispatches QUERY_HAS_NOT_CHANGED and loads items.
 * Otherwise parses the params and dispatches QUERY_HAS_CHANGED.
 * @yields {void} Redux saga select, put, and call effects.
 */
export function * evalQueryParams () {
	const { pathname, query } = yield select(state => state.routing.locationBeforeTransitions);

	const { cachedQuery } = yield select(state => state.active);
	const { currentList } = yield select(state => state.lists);

	if (pathname !== `${Keystone.adminLegacyPath}/${currentList.id}`) return;

	if (isEqual(query, cachedQuery)) {
		yield put({ type: actions.QUERY_HAS_NOT_CHANGED });
		yield put(loadItems());
	} else {
		const parsedQuery = yield call(parseQueryParams, query, currentList);
		yield put({ type: actions.QUERY_HAS_CHANGED, parsedQuery });
	}
}

/**
 * Parses raw URL query params into the structured active-state shape expected
 * by the Redux store, applying list-aware column, sort, and filter parsers.
 * @param {object} query - Raw query-parameter object from the URL.
 * @param {object} currentList - The currently active Keystone list descriptor.
 * @returns {object} Parsed query object with columns, sort, filters, currentPage, and search.
 */
export function parseQueryParams (query, currentList) {
	const columns = columnsParser(query.columns, currentList);
	const sort = sortParser(query.sort, currentList);
	const filters = filtersParser(query.filters, currentList);
	const currentPage = query.page || 1;
	const search = query.search || '';

	return {
		columns,
		sort,
		filters,
		currentPage,
		search,
	};
}
