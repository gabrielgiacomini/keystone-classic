import xhr from 'xhr';
import {
	LOAD_COUNTS,
	COUNTS_LOADING_SUCCESS,
	COUNTS_LOADING_ERROR,
} from './constants.mjs';
import { NETWORK_ERROR_RETRY_DELAY } from '../../../constants.mjs';

function getAdminApiPath () {
	return Keystone.adminApiPath || `${Keystone.adminLegacyPath}/api`;
}

/**
 * Load the counts of all lists
 * @returns {(dispatch: (action: object) => void) => void} A thunk that dispatches the load request and handles the response
 */
export function loadCounts () {
	return (dispatch) => {
		dispatch({
			type: LOAD_COUNTS,
		});
		xhr({
			url: `${getAdminApiPath()}/counts`,
		}, (err, resp, body) => {
			if (err) {
				dispatch(countsLoadingError(err));
				return;
			}
			try {
				body = JSON.parse(body);
				if (body.counts) {
					dispatch(countsLoaded(body.counts));
				}
			} catch (e) {
				console.log('Error parsing results json:', e, body);
				dispatch(countsLoadingError(e));
				return;
			}
		});
	};
}

/**
 * Dispatched when the counts were loaded
 * @param  {object} counts The counts object as returned by the API
 * @returns {object} A Redux action with type COUNTS_LOADING_SUCCESS and the counts payload
 */
export function countsLoaded (counts) {
	return {
		type: COUNTS_LOADING_SUCCESS,
		counts,
	};
}

/**
 * Dispatched when unsuccessfully trying to load the counts, will redispatch
 * loadCounts after NETWORK_ERROR_RETRY_DELAY until we get counts back
 * @param  {object} error The error
 * @returns {(dispatch: (action: object) => void) => void} A thunk that dispatches the error action and schedules a retry
 */
export function countsLoadingError (error) {
	return (dispatch, getState) => {
		dispatch({
			type: COUNTS_LOADING_ERROR,
			error,
		});
		setTimeout(() => {
			dispatch(loadCounts());
		}, NETWORK_ERROR_RETRY_DELAY);
	};
}
