/**
 * Exports an object of lists, keyed with their key instead of their name and
 * wrapped with the List helper (./List.js)
 */

import List from './List';

export const listsByKey = {};
export const listsByPath = {};

for (const key in Keystone.lists) {
	if ({}.hasOwnProperty.call(Keystone.lists, key)) {
		var list = new List(Keystone.lists[key]);
		listsByKey[key] = list;
		listsByPath[list.path] = list;
	}
}

export default { listsByKey, listsByPath };
