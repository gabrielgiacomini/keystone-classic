/**
 * @fileoverview This file defines the `getOrphanedLists` function for Keystone,
 * which is used to find lists that are not assigned to any navigation section.
 *
 * This function is useful for administrative UI generation, where it can be used
 * to display lists that have been defined but not explicitly organized in the
 * main navigation structure. It helps ensure that all lists are accessible, even
 * if they haven't been categorized.
 *
 * It uses the 'lodash' library for filtering the lists.
 * @example
 * const orphanedLists = keystone.getOrphanedLists();
 * orphanedLists.forEach(list => {
 *   console.log(`Orphaned list: ${list.label}`);
 * });
 */
var _ = require('lodash');

/**
 * Retrieves lists that are not associated with any navigation section.
 *
 * This function iterates through all registered lists in the Keystone instance
 * and filters out those that are marked as hidden or are included in the
 * navigation configuration (`keystone.nav`).
 *
 * @returns {Array<List>} An array of List objects that are considered "orphaned."
 *                        Returns an empty array if navigation is not configured.
 * @example
 * const orphanedLists = keystone.getOrphanedLists();
 * if (orphanedLists.length > 0) {
 *   console.log('The following lists are not in the navigation:');
 *   orphanedLists.forEach(list => {
 *     console.log(`- ${list.label}`);
 *   });
 * }
 */
function getOrphanedLists () {
	// If the navigation structure is not defined, there are no orphaned lists.
	if (!this.nav) {
		return [];
	}

	// Filter the lists to find those that are not hidden and not in the navigation.
	return _.filter(this.lists, function (list, key) {
		// Exclude hidden lists from the result.
		if (list.get('hidden')) {
			return false;
		}
		// A list is orphaned if it's not present in the `nav.by.list` map.
		return !this.nav.by.list[key] ? list : false;
	}.bind(this));
}

module.exports = getOrphanedLists;
