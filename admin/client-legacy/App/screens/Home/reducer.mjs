import {
	LOAD_COUNTS,
	COUNTS_LOADING_SUCCESS,
	COUNTS_LOADING_ERROR,
} from './constants.mjs';

const initialState = {
	counts: {},
	loading: false,
	error: null,
};

/**
 * Reducer for the Home screen, managing list counts and their loading state.
 * @param {object} state The current state, defaulting to initialState
 * @param {object} action The dispatched action
 * @returns {object} The next state after applying the action
 */
function home (state = initialState, action) {
	switch (action.type) {
		case LOAD_COUNTS:
			return Object.assign({}, state, {
				loading: true,
			});
		case COUNTS_LOADING_SUCCESS:
			return Object.assign({}, state, {
				loading: false,
				counts: action.counts,
				error: null,
			});
		case COUNTS_LOADING_ERROR:
			return Object.assign({}, state, {
				loading: false,
				error: action.error,
			});
		default:
			return state;
	}
}

export default home;
