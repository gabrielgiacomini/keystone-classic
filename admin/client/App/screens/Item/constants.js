/**
 * @fileoverview This file contains the constants for the Item screen.
 */

/**
 * The action type for selecting an item.
 * @type {string}
 */
export const SELECT_ITEM = 'app/Item/SELECT_ITEM';

/**
 * The action type for loading data.
 * @type {string}
 */
export const LOAD_DATA = 'app/Item/LOAD_DATA';

/**
 * The action type for when data has been loaded successfully.
 * @type {string}
 */
export const DATA_LOADING_SUCCESS = 'app/Item/DATA_LOADING_SUCCESS';

/**
 * The action type for when there was an error loading data.
 * @type {string}
 */
export const DATA_LOADING_ERROR = 'app/Item/DATA_LOADING_ERROR';

/**
 * The action type for moving a drag item.
 * @type {string}
 */
export const DRAG_MOVE_ITEM = 'app/Item/DRAG_MOVE_ITEM';

/**
 * The action type for resetting the drag items.
 * @type {string}
 */
export const DRAG_RESET_ITEMS = 'app/Item/DRAG_RESET_ITEMS';

/**
 * The action type for loading relationship data.
 * @type {string}
 */
export const LOAD_RELATIONSHIP_DATA = 'app/Item/LOAD_RELATIONSHIP_DATA';

/**
 * The action type for when an async field is loading.
 * @type {string}
 */
export const ASYNC_FIELD_LOADING = 'loading';

/**
 * The action type for when an async field has been loaded.
 * @type {string}
 */
export const ASYNC_FIELD_LOADED = 'loaded';
