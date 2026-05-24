/**
 * This is the main entry file, which we compile the main JS bundle from. It
 * only contains the client side routing setup.
 */

// `@babel/polyfill` (deprecated) was previously required here for ES6
// generator support. Modern browsers ship native generators; if older
// targets need to be re-supported, add `core-js/stable` and
// `regenerator-runtime/runtime` as direct imports here.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './App.mjs';
import Home from './screens/Home/index.mjs';
import Item from './screens/Item/index.mjs';
import List from './screens/List/index.mjs';

import store from './store.mjs';

// Sync the browser history to the Redux store
const history = syncHistoryWithStore(browserHistory, store);

// Initialise Keystone.User list
import { listsByKey } from '../utils/lists.mjs';
Keystone.User = listsByKey[Keystone.userList];

const rootElement = document.getElementById('react-root');
if (!rootElement) {
	throw new Error('Legacy admin root element not found');
}

createRoot(rootElement).render(
	<Provider store={store}>
		<Router history={history}>
			<Route path={Keystone.adminLegacyPath} component={App}>
				<IndexRoute component={Home} />
				<Route path=":listId" component={List} />
				<Route path=":listId/:itemId" component={Item} />
			</Route>
		</Router>
	</Provider>
);
