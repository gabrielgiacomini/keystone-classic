/**
 * @fileoverview This file defines the `getOrphanedLists` method for the Keystone instance.
 * It is used to retrieve a list of all registered Lists that are not assigned to a navigation section.
 * @module lib/core/getOrphanedLists
 */
var _ = require('lodash');

/**
 * Retrieves orphaned lists (those not in a nav section).
 *
 * @returns {Array<import('../../list')>} An array of orphaned List objects.
 */
function getOrphanedLists () {
	if (!this.nav) {
		return [];
	}
	return _.filter(this.lists, function (list, key) {
		if (list.get('hidden')) return false;
		return (!this.nav.by.list[key]) ? list : false;
	}.bind(this));
}

module.exports = getOrphanedLists;
