/**
 * @fileoverview This file contains the reducer for the Home screen.
 *
 * The reducer is a pure function that takes the previous state and an action,
 * and returns the next state.
 *
 * @see http://redux.js.org/docs/basics/Reducers.html
 */
import assign from 'object-assign';
import {
	LOAD_COUNTS,
	COUNTS_LOADING_SUCCESS,
	COUNTS_LOADING_ERROR,
} from './constants';

/**
 * The initial state for the Home screen.
 *
 * @property {object} counts - The counts for each list.
 * @property {boolean} loading - Whether the counts are loading.
 * @property {object} error - The error object if there was an error loading the counts.
 */
const initialState = {
	counts: {},
	loading: false,
	error: null,
};

/**
 * The reducer for the Home screen.
 *
 * @param {object} state The previous state.
 * @param {object} action The action to perform.
 * @returns {object} The new state.
 */
function home (state = initialState, action) {
	switch (action.type) {
		case LOAD_COUNTS:
			return assign({}, state, {
				loading: true,
			});
		case COUNTS_LOADING_SUCCESS:
			return assign({}, state, {
				loading: false,
				counts: action.counts,
				error: null,
			});
		case COUNTS_LOADING_ERROR:
			return assign({}, state, {
				loading: false,
				error: action.error,
			});
		default:
			return state;
	}
}

export default home;
