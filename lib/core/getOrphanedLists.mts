import type { Keystone } from '../../index.mjs';

export default function getOrphanedLists(this: Keystone): unknown[] {
	if (!this.nav) {
		return [];
	}
	const nav = this.nav;
	return Object.entries(this.lists).filter(([key, list]) => {
		if (list.get('hidden')) {
			return false;
		}
		return !nav.by.list[key];
	}).map(([, list]) => list);
}
