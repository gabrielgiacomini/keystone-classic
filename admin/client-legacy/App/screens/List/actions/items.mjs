import {
	LOAD_ITEMS,
	ITEMS_LOADED,
	ITEM_LOADING_ERROR,
} from '../constants.mjs';

import { NETWORK_ERROR_RETRY_DELAY } from '../../../../constants.mjs';
/**
 * Loads the current list items from the server using the active search, filter,
 * sort, column, and page state. Bails out if the active list has changed or a
 * newer load request has been issued since this one started.
 * @param {object} [options] Optional hints (currently unused; reserved for future use).
 * @returns {function(): void} A thunk that dispatches LOAD_ITEMS, then either itemsLoaded or itemLoadingError.
 */
export function loadItems (options = {}) {
	return (dispatch, getState) => {
		const currentLoadCounter = getState().lists.loadCounter + 1;

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
 * Constructs a download URL for the current list with the active filters and
 * sort applied, then opens it in a new browser tab/window.
 * @param {string} format The download format (e.g. "csv" or "json").
 * @param {Array} [columns] Optional column definitions; falls back to the active columns.
 * @returns {function(): void} A thunk that opens the download URL.
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
 * Creates the action that stores freshly fetched list items in the Redux store.
 * @param {object} items The items payload returned by the server.
 * @returns {object} The ITEMS_LOADED action object.
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
 * @returns {function(): void} A thunk that dispatches ITEM_LOADING_ERROR then retries loadItems.
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
 * Deletes a set of items from the current list and reloads the list on completion.
 * @param {Array} ids An array of item IDs to delete.
 * @returns {function(): void} A thunk that calls the list's deleteItems API then dispatches loadItems.
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
