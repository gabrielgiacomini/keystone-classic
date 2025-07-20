/**
 * @fileoverview This file contains the reducer for the Item screen. It handles
 * the item data and loading state.
 */
import assign from 'object-assign';
import {
	SELECT_ITEM,
	LOAD_DATA,
	DATA_LOADING_SUCCESS,
	DATA_LOADING_ERROR,
	DRAG_MOVE_ITEM,
	DRAG_RESET_ITEMS,
	LOAD_RELATIONSHIP_DATA,
} from './constants';

/**
 * The initial state of the Item screen.
 *
 * @property {null} data The item data.
 * @property {null} id The item ID.
 * @property {boolean} loading Whether the item is loading.
 * @property {boolean} ready Whether the item is ready.
 * @property {null} error The error, if any.
 * @property {object} relationshipData The relationship data.
 * @property {object} drag The drag and drop data.
 * @property {boolean} drag.clonedItems The cloned items.
 * @property {null} drag.newSortOrder The new sort order.
 * @property {boolean} drag.relationshipPath The relationship path.
 */
const initialState = {
	data: null,
	id: null,
	loading: false,
	ready: false,
	error: null,
	relationshipData: {},
	drag: {
		clonedItems: false,
		newSortOrder: null,
		relationshipPath: false,
	},
};

/**
 * The reducer for the Item screen.
 *
 * @param {object} state The previous state.
 * @param {object} action The action to perform.
 * @returns {object} The new state.
 */
function item (state = initialState, action) {
	switch (action.type) {
		case SELECT_ITEM:
			return assign({}, state, {
				ready: false,
				id: action.id,
				data: null,
			});
		case LOAD_DATA:
			return assign({}, state, {
				loading: true,
			});
		case DATA_LOADING_SUCCESS:
			Keystone.item = action.data; // Fix keystone filter
			return assign({}, state, {
				data: action.data,
				loading: false,
				ready: true,
				error: null,
			});
		case DATA_LOADING_ERROR:
			return assign({}, state, {
				data: null,
				loading: false,
				ready: true,
				error: action.error,
			});
		case DRAG_MOVE_ITEM:
			const currentItems = state.relationshipData[action.relationshipPath].results;
			// Cache a copy of the current items to reset the items when dismissing a drag and drop if a cached copy doesn't already exist
			const clonedItems = state.drag.clonedItems || currentItems;
			const item = currentItems[action.prevIndex];
			// Remove item at prevIndex from array and save that array in
			// itemsWithoutItem
			let itemsWithoutItem = currentItems
				.slice(0, action.prevIndex)
				.concat(
					currentItems.slice(
						action.prevIndex + 1,
						currentItems.length
					)
				);
			// Add item back in at new index
			itemsWithoutItem.splice(action.newIndex, 0, item);
			const newRelationshipData = assign({}, state.relationshipData[action.relationshipPath], {
				results: itemsWithoutItem,
			});
			return assign({}, state, {
				drag: {
					newSortOrder: action.newSortOrder,
					clonedItems: clonedItems,
					relationshipPath: action.relationshipPath,
				},
				relationshipData: {
					...state.relationshipData,
					[action.relationshipPath]: newRelationshipData,
				},
			});
		case DRAG_RESET_ITEMS:
			const originalRelationshipData = assign({}, state.relationshipData[state.drag.relationshipPath], {
				results: state.drag.clonedItems,
			});
			return assign({}, state, {
				drag: {
					newSortOrder: null,
					clonedItems: false,
					relationshipPath: false,
				},
				relationshipData: {
					...state.relationshipData,
					[state.drag.relationshipPath]: originalRelationshipData,
				},
			});
		case LOAD_RELATIONSHIP_DATA:
			return assign({}, state, {
				// Reset drag and drop when relationship data is loaded
				drag: {
					newSortOrder: null,
					clonedItems: false,
					relationshipPath: false,
				},
				relationshipData: {
					...state.relationshipData,
					[action.relationshipPath]: action.data,
				},
			});
		default:
			return state;
	}
}

export default item;
