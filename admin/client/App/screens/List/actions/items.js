/**
 * @fileoverview This file contains the actions for the items in a list.
 */
import {
	LOAD_ITEMS,
	ITEMS_LOADED,
	ITEM_LOADING_ERROR,
} from '../constants';

import { NETWORK_ERROR_RETRY_DELAY } from '../../../../constants';

/**
 * Loads the items for the current list.
 *
 * @param {object} options The options for the request.
 * @returns {function} A thunk that dispatches an action.
 */
export function loadItems (options = {}) {
	return (dispatch, getState) => {
		let currentLoadCounter = getState().lists.loadCounter + 1;

		dispatch({
			type: LOAD_ITEMS,
			loadCounter: currentLoadCounter,
		});

		// Take a snapshot of the current redux state.
		const state = getState();
		// Hold a reference to the currentList in state.
		const currentList = state.lists.currentList;

		currentList.loadItems({
			search: state.active.search,
			filters: state.active.filters,
			sort: state.active.sort,
			columns: state.active.columns,
			page: state.lists.page,
		}, (err, items) => {

			// Create a new state snapshot and compare the current active list id
			// to the id of the currentList referenced above.
			// If they are the same, then this is the latest fetch request, we may resolve this normally.
			// If these are not the same, then it means that this is not the latest fetch request.
			// BAIL OUT!

			if (getState().active.id !== currentList.id) return;
			if (getState().lists.loadCounter > currentLoadCounter) return;
			if (items) {

				// if (page.index !== drag.page && drag.item) {
				// 	// add the dragging item
				// 	if (page.index > drag.page) {
				// 		_items.results.unshift(drag.item);
				// 	} else {
				// 		_items.results.push(drag.item);
				// 	}
				// }
				// _itemsResultsClone = items.results.slice(0);
				//

				// TODO Reenable this
				// if (options.success && options.id) {
				// 	// flashes a success background on the row
				// 	_rowAlert.success = options.id;
				// }
				// if (options.fail && options.id) {
				// 	// flashes a failure background on the row
				// 	_rowAlert.fail = options.id;
				// }

				// Successfully resolve this request in redux and set the loadCounter back to zero.
				dispatch(itemsLoaded(items));
			} else {
				// Catch this error in redux and set the loadCounter back to zero.
				dispatch(itemLoadingError(err));
			}
		});
	};
}

/**
 * Downloads the items for the current list.
 *
 * @param {string} format The format to download the items in.
 * @param {array} columns The columns to download.
 * @returns {function} A thunk that opens a new window with the download URL.
 */
export function downloadItems (format, columns) {
	return (dispatch, getState) => {
		const state = getState();
		const active = state.active;
		const currentList = state.lists.currentList;
		const url = currentList.getDownloadURL({
			search: active.search,
			filters: active.filters,
			sort: active.sort,
			columns: columns ? currentList.expandColumns(columns) : active.columns,
			format: format,
		});
		window.open(url);
	};
}

/**
 * Dispatched when the items were loaded.
 *
 * @param {object} items The items that were loaded.
 * @returns {object} The action object.
 */
export function itemsLoaded (items) {
	return {
		type: ITEMS_LOADED,
		items,
	};
}

/**
 * Dispatched when unsuccessfully trying to load the items, will redispatch
 * loadItems after NETWORK_ERROR_RETRY_DELAY milliseconds until we get items back.
 *
 * @returns {function} A thunk that dispatches an action.
 */
export function itemLoadingError () {
	return (dispatch) => {
		dispatch({
			type: ITEM_LOADING_ERROR,
			err: 'Network request failed',
		});
		setTimeout(() => {
			dispatch(loadItems());
		}, NETWORK_ERROR_RETRY_DELAY);
	};
}

/**
 * Deletes the items with the given ids.
 *
 * @param {array} ids The ids of the items to delete.
 * @returns {function} A thunk that dispatches an action.
 */
export function deleteItems (ids) {
	return (dispatch, getState) => {
		const list = getState().lists.currentList;
		list.deleteItems(ids, (err, data) => {
			// TODO ERROR HANDLING
			dispatch(loadItems());
		});
	};
}
