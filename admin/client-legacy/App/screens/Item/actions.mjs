import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
	DRAG_MOVE_ITEM,
	DRAG_RESET_ITEMS,
	LOAD_RELATIONSHIP_DATA,
} from './constants.mjs';

import {
	loadItems,
} from '../List/actions/index.mjs';

/**
 * Select an item
 * @param {string} itemId The item ID
 * @returns {object} Redux action with type SELECT_ITEM and the given id
 */
export function selectItem (itemId) {
	return {
		type: SELECT_ITEM,
		id: itemId,
	};
}

/**
 * Load the item data of the current item
 * @returns {object} Redux thunk that fetches the current item and dispatches data or error actions
 */
export function loadItemData () {
	return (dispatch, getState) => {
		// Hold on to the id of the item we currently want to load.
		// Dispatch this reference to our redux store to hold on to as a 'loadingRef'.
		const currentItemID = getState().item.id;
		dispatch({
			type: LOAD_DATA,
		});
		const state = getState();
		const list = state.lists.currentList;

		// const itemID = state.item.id;
		// Load a specific item with the utils/List.js helper
		list.loadItem(state.item.id, { drilldown: true }, (err, itemData) => {

			// Once this async request has fired this callback, check that
			// the item id referenced by thisLoadRef is the same id
			// referenced by loadingRef in the redux store.

			// If it is, then this is the latest request, and it is safe to resolve it normally.
			// If it is not the same id however,
			// this means that this request is NOT the latest fired request,
			// and so we'll bail out of it early.

			if (getState().item.id !== currentItemID) return;
			if (err || !itemData) {
				dispatch(dataLoadingError(err));
			} else {
				dispatch(dataLoaded(itemData));
			}
		});
	};
}

/**
 * Load items for a relationship field of the current item
 * @param {object} options Options object
 * @param {Array} options.columns Columns to include in the loaded items
 * @param {object} options.refList The related Keystone list
 * @param {object} options.relationship The relationship field descriptor
 * @param {string} options.relatedItemId The ID of the item owning the relationship
 * @returns {object} Redux thunk that fetches related items and dispatches a data action
 */
export function loadRelationshipItemData ({ columns, refList, relationship, relatedItemId }) {
	return (dispatch, getState) => {
		refList.loadItems({
			columns: columns,
			filters: [{
				field: refList.fields[relationship.refPath],
				value: { value: relatedItemId },
			}],
		}, (err, items) => {
			// // TODO: indicate pagination & link to main list view
			// this.setState({ items });
			dispatch(relationshipDataLoaded(relationship.path, items));
		});
	};
}


/**
 * Called when data of the current item is loaded
 * @param {object} data The item data
 * @returns {object} Redux action with type DATA_LOADING_SUCCESS and the loaded data
 */
export function dataLoaded (data) {
	return {
		type: DATA_LOADING_SUCCESS,
		loadingRef: null,
		data,
	};
}

/**
 * Called when relationship data for an item has been loaded
 * @param {string} path The relationship field path
 * @param {object} data The loaded relationship data
 * @returns {object} Redux action with type LOAD_RELATIONSHIP_DATA
 */
export function relationshipDataLoaded (path, data) {
	return {
		type: LOAD_RELATIONSHIP_DATA,
		relationshipPath: path,
		data,
	};
};

/**
 * Called when there was an error during the loading of the current item data,
 * will retry loading the data every NETWORK_ERROR_RETRY_DELAY milliseconds
 * @param {object} err The error
 * @returns {object} Redux action with type DATA_LOADING_ERROR containing the error
 */
export function dataLoadingError (err) {
	return {
		type: DATA_LOADING_ERROR,
		loadingRef: null,
		error: err,
	};
}

/**
 * Deletes an item and optionally redirects to the current list URL
 * @param {string} id The ID of the item we want to delete
 * @param {object} router A react-router router object. If this is passed, we
 *                        redirect to Keystone.adminLegacyPath/currentList.path!
 * @returns {object} Redux thunk that deletes the item and dispatches a load action
 */
export function deleteItem (id, router) {
	return (dispatch, getState) => {
		const state = getState();
		const list = state.lists.currentList;
		list.deleteItem(id, (err) => {
			// If a router is passed, redirect to the current list path,
			// otherwise stay where we are
			if (router) {
				let redirectUrl = `${Keystone.adminLegacyPath}/${list.path}`;
				if (state.lists.page.index && state.lists.page.index > 1) {
					redirectUrl = `${redirectUrl}?page=${state.lists.page.index}`;
				}
				router.push(redirectUrl);
			}
			// TODO Proper error handling
			if (err) {
				alert(err.error || 'Error deleting item, please try again!');
			} else {
				dispatch(loadItems());
			}
		});
	};
}

/**
 * Reorder a related item within a relationship list
 * @param {object} options Options object
 * @param {Array} options.columns Columns to include when reloading the list
 * @param {object} options.refList The related Keystone list
 * @param {object} options.relationship The relationship field descriptor
 * @param {string} options.relatedItemId The ID of the item owning the relationship
 * @param {object} options.item The item being reordered
 * @param {number} options.prevSortOrder The item's sort order before the move
 * @param {number} options.newSortOrder The item's desired sort order after the move
 * @returns {object} Redux thunk that persists the new sort order and dispatches a data action
 */
export function reorderItems ({ columns, refList, relationship, relatedItemId, item, prevSortOrder, newSortOrder }) {
	return (dispatch, getState) => {
		// Send the item, previous sortOrder and the new sortOrder
		// we should get the proper list and new page results in return
		refList.reorderItems(
			item,
			prevSortOrder,
			newSortOrder,
			{
				columns: columns,
				filters: [{
					field: refList.fields[relationship.refPath],
					value: { value: relatedItemId },
				}],
			},
			(err, items) => {
				dispatch(relationshipDataLoaded(relationship.path, items));
				// If err, flash the row alert
				// if (err) {
				// 	dispatch(resetItems(item.id));
				// 	// return this.resetItems(this.findItemById[item.id]);
				// } else {
				// 	dispatch(itemsLoaded(items));
				// 	dispatch(setRowAlert({
				// 		success: item.id,
				// 		fail: false,
				// 	}));
				// }
			}
		);
	};
}

/**
 * Optimistically move an item to a new index within a relationship list during drag-and-drop
 * @param {object} options Options object
 * @param {number} options.prevIndex The item's current index in the list
 * @param {number} options.newIndex The item's new index in the list
 * @param {string} options.relationshipPath The relationship field path being reordered
 * @param {number} options.newSortOrder The sort order value of the item being hovered over
 * @returns {object} Redux action with type DRAG_MOVE_ITEM
 */
export function moveItem ({ prevIndex, newIndex, relationshipPath, newSortOrder }) {
	return {
		type: DRAG_MOVE_ITEM,
		prevIndex,
		newIndex,
		relationshipPath,
		newSortOrder,
	};
}

/**
 * Reset all relationship list items back to their original order, discarding any in-progress drag
 * @returns {object} Redux action with type DRAG_RESET_ITEMS
 */
export function resetItems () {
	return {
		type: DRAG_RESET_ITEMS,
	};
}
