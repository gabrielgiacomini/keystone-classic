/**
 * Exports an object of lists, keyed with their key instead of their name and
 * wrapped with the List helper (./List.js)
 */

import List from './List.mjs';

export const listsByKey = {};
export const listsByPath = {};

const keystone = typeof globalThis !== 'undefined' && globalThis.Keystone ? globalThis.Keystone : { lists: {} };

for (const key in keystone.lists) {
	// Guard for-ins
	if ({}.hasOwnProperty.call(keystone.lists, key)) {
		const list = new List(keystone.lists[key]);
		listsByKey[key] = list;
		listsByPath[list.path] = list;
	}
}
