import {
	SELECT_LIST,
	SET_CURRENT_PAGE,
	INITIAL_LIST_LOAD,
} from '../constants.mjs';

import { setActiveList } from './active.mjs';

/**
 * Select a list, and set it as the active list. Called whenever the main
 * List component mounts or the list changes.
 * @param {string} id The list ID, passed via this.props.params.listId
 * @returns {function(): void} A thunk that dispatches SELECT_LIST and sets the active list.
 */
export function selectList (id) {
	return (dispatch, getState) => {
		dispatch({
			type: SELECT_LIST,
			id,
		});
		dispatch(setActiveList(getState().lists.data[id], id));
	};
}

/**
 * Signals that the initial items load has been triggered.
 * @returns {object} The INITIAL_LIST_LOAD action object.
 */
export function loadInitialItems () {
	return {
		type: INITIAL_LIST_LOAD,
	};
}

/**
 * Set the current page
 * @param {number} index The page number we want to be on
 * @returns {object} The SET_CURRENT_PAGE action object with the parsed integer index.
 */
export function setCurrentPage (index) {
	return {
		type: SET_CURRENT_PAGE,
		index: parseInt(index),
	};
}

// Export all actions from here again for easier usability, that they're split up
// should be an implementation detail of List

import {
	setFilter,
	clearFilter,
	clearAllFilters,
	setActiveFilters,
	setActiveSearch,
	setActiveColumns,
	clearCachedQuery,
	setActiveSort,
} from './active.mjs';

import {
	loadItems,
	itemsLoaded,
	itemLoadingError,
	deleteItems,
	downloadItems,
} from './items.mjs';

import {
	setDragBase,
	resetItems,
	reorderItems,
	setRowAlert,
	moveItem,
} from './dragdrop.mjs';

export {
	setFilter,
	clearFilter,
	clearAllFilters,
	setActiveFilters,
	setActiveSearch,
	setActiveColumns,
	setActiveSort,
	clearCachedQuery,
	loadItems,
	itemsLoaded,
	itemLoadingError,
	deleteItems,
	setDragBase,
	resetItems,
	reorderItems,
	setRowAlert,
	moveItem,
	downloadItems,
};
