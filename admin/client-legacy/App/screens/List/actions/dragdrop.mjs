import {
	SET_ROW_ALERT,
	RESET_DRAG_PAGE,
	RESET_DRAG_ITEMS,
	SET_DRAG_ITEM,
	SET_DRAG_INDEX,
	DRAG_MOVE_ITEM,
} from '../constants.mjs';

import {
	setCurrentPage,
	itemsLoaded,
	loadItems,
} from '../actions/index.mjs';

/**
 * Initialises the drag-and-drop base state by resetting the drag page and items,
 * then optionally sets the dragged item and its starting index.
 * @param {object} item The list item being dragged.
 * @param {number} [index] The starting index of the dragged item.
 * @returns {function(): void} A thunk that dispatches the reset and set actions.
 */
export function setDragBase (item, index) {
	return (dispatch) => {
		dispatch(resetDragPage());
		dispatch(resetDragItems());
		if (item) {
			dispatch(setDragItem(item));
			if (index) {
				dispatch(setDragIndex(index));
			}
		}
	};
};

/**
 * Resets the drag page state to its initial value.
 * @returns {object} The RESET_DRAG_PAGE action object.
 */
export function resetDragPage () {
	return {
		type: RESET_DRAG_PAGE,
	};
}

/**
 * Resets the drag items state to its initial value.
 * @returns {object} The RESET_DRAG_ITEMS action object.
 */
export function resetDragItems () {
	return {
		type: RESET_DRAG_ITEMS,
	};
}

/**
 * Records the item currently being dragged.
 * @param {object} item The list item being dragged.
 * @returns {object} The SET_DRAG_ITEM action object.
 */
export function setDragItem (item) {
	return {
		type: SET_DRAG_ITEM,
		item,
	};
}

/**
 * Records the starting index of the item being dragged.
 * @param {number} index The original list index of the dragged item.
 * @returns {object} The SET_DRAG_INDEX action object.
 */
export function setDragIndex (index) {
	return {
		type: SET_DRAG_INDEX,
		index,
	};
}

/**
 * Sets a row alert to visually indicate drag success or failure on a row.
 * @param {object} data An object with `success` and `fail` item ID fields.
 * @returns {object} The SET_ROW_ALERT action object.
 */
export function setRowAlert (data) {
	return {
		type: SET_ROW_ALERT,
		data,
	};
}

/**
 * Moves an item in the list from one index to another in the local state.
 * @param {number} prevIndex The index the item is moving from.
 * @param {number} newIndex The index the item is moving to.
 * @param {object} options Additional options for the move operation.
 * @returns {object} The DRAG_MOVE_ITEM action object.
 */
export function moveItem (prevIndex, newIndex, options) {
	return {
		type: DRAG_MOVE_ITEM,
		prevIndex,
		newIndex,
		options,
	};
}

/**
 * Persists a drag-and-drop reorder to the server and updates the list on success,
 * or resets the list to its prior state on failure.
 * @param {object} item The item that was reordered.
 * @param {number} prevSortOrder The item's sort order before the drag.
 * @param {number} newSortOrder The item's desired sort order after the drag.
 * @param {number} [goToPage] Optional page number to navigate to before reordering.
 * @returns {function(): void} A thunk that calls the list's reorderItems API method.
 */
export function reorderItems (item, prevSortOrder, newSortOrder, goToPage) {
	// // reset drag
	// defaultDrag();
	return (dispatch, getState) => {
		if (goToPage) {
			// TODO FIGURE OUT IF THIS IS A RACE CONDITION
			dispatch(setCurrentPage(goToPage));
		}
		const state = getState();
		const list = state.lists.currentList;

		// Send the item, previous sortOrder and the new sortOrder
		// we should get the proper list and new page results in return
		list.reorderItems(
			item,
			prevSortOrder,
			newSortOrder,
			{
				search: state.active.search,
				filters: state.active.filters,
				sort: state.active.sort,
				columns: state.active.columns,
				page: state.lists.page,
			}, (err, items) => {
				// If err, flash the row alert
				if (err) {
					dispatch(resetItems(item.id));
					// return this.resetItems(this.findItemById[item.id]);
				} else {
					dispatch(itemsLoaded(items));
					dispatch(setRowAlert({
						success: item.id,
						fail: false,
					}));
				}
			}
		);
	};
}

/**
 * Resets the list to its pre-drag state after a failed reorder.
 * If the current page differs from the original drag page, navigates back and
 * reloads items. Always dispatches a failure row alert for the given item.
 * @param {string} itemId The ID of the item whose reorder failed.
 * @returns {function(): void} A thunk that restores the list and shows a failure alert.
 */
export function resetItems (itemId) {
	return (dispatch, getState) => {
		const state = getState();
		const { page, drag } = state.lists;

		if (page.index !== drag.page) {
			// We are not on the original page so we need to move back to it
			dispatch(setCurrentPage(drag.page));
			dispatch(loadItems({
				fail: true,
				id: itemId,
			}));
			// reset drag
			// return defaultDrag();
		}

		// Reset the list if dragout or error
		dispatch(setRowAlert({
			success: false,
			fail: itemId,
		}));
		// we use the cached clone since this is the same page
		// the clone contains the proper index numbers which get overwritten on drag
		// _items.results = drag.clonedItems;
		// defaultDrag();
		// this.notifyChange();
	};
}
