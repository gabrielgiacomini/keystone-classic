/**
 * @fileoverview This file defines the `list` method for the Keystone instance.
 * It is used to retrieve a registered List by its key or path.
 * @module lib/core/list
 */

/**
 * Retrieves a registered List by its key or path.
 *
 * @param {string} key The key or path of the List to retrieve.
 * @returns {import('../../list')} The List object.
 * @throws {ReferenceError} If the list is not found.
 * @example
 * // Get the User list
 * var User = keystone.list('User');
 */
module.exports = function list (key) {
	var result = this.lists[key] || this.lists[this.paths[key]];
	if (!result) throw new ReferenceError('Unknown keystone list ' + JSON.stringify(key));
	return result;
};
