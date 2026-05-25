export const CALL_HISTORY_METHOD = '@@keystoneLegacyRouter/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@keystoneLegacyRouter/LOCATION_CHANGE';

function createHistoryAction(method, location) {
	return {
		type: CALL_HISTORY_METHOD,
		payload: { method, location },
	};
}

export function push(location) {
	return createHistoryAction('push', location);
}

export function replace(location) {
	return createHistoryAction('replace', location);
}

export function routerMiddleware(history) {
	return function () {
		return function (next) {
			return function (action) {
				if (action && action.type === CALL_HISTORY_METHOD) {
					const { method, location } = action.payload;
					history[method](location);
					return action;
				}
				return next(action);
			};
		};
	};
}

export function routerReducer(state = { locationBeforeTransitions: null }, action) {
	if (action && action.type === LOCATION_CHANGE) {
		return {
			...state,
			locationBeforeTransitions: action.payload,
		};
	}
	return state;
}

export function syncHistoryWithStore(history, store) {
	const dispatchLocation = location => {
		store.dispatch({ type: LOCATION_CHANGE, payload: location });
	};
	if (typeof history.getCurrentLocation === 'function') {
		dispatchLocation(history.getCurrentLocation());
	}
	history.listen(dispatchLocation);
	return history;
}
