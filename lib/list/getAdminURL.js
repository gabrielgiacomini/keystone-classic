/**
 * @fileoverview This file defines the `getAdminURL` function, which returns the
 * URL to the admin UI for a list or a specific item in the list.
 */

/**
 * Gets the Admin URL to view the list (or an item if provided).
 *
 * Example:
 *     var listURL = list.getAdminURL()
 *     var itemURL = list.getAdminURL(item)
 *
 * @param {Object} [item] The item to get the URL for.
 * @return {string} The admin URL.
 */
function getAdminURL (item) {
	return '/' + this.keystone.get('admin path') + '/' + this.path + (item ? '/' + item.id : '');
}

module.exports = getAdminURL;
