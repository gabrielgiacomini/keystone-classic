/**
 * @fileoverview This file defines the `list` function for Keystone, which is used
 * to retrieve a registered List by its key or path.
 *
 * The `list` function is a fundamental part of Keystone's data management, providing
 * a way to access the schema and model for a specific data structure. It ensures
 * that only valid, registered lists are accessed, throwing an error if an unknown
 * list is requested.
 * @example
 * const User = keystone.list('User');
 * User.model.find().exec((err, users) => {
 *   console.log(users);
 * });
 */

/**
 * Retrieves a registered Keystone List by its key or path.
 *
 * This function looks up a List from the `lists` collection on the Keystone instance,
 * first by the provided `key` and then by its path if no direct match is found.
 * If the list cannot be found, it throws a `ReferenceError`.
 *
 * @param {string} key - The key or path of the List to retrieve.
 * @returns {List} The requested List object.
 * @throws {ReferenceError} If the list key is not found.
 * @example
 * // Retrieve the 'User' list
 * const UserList = keystone.list('User');
 *
 * // Retrieve a list by its path
 * const PostList = keystone.list('posts');
 */
module.exports = function list (key) {
	// Attempt to find the list by its key or path.
	// The `this.paths` object maps list paths to their keys.
	var result = this.lists[key] || this.lists[this.paths[key]];

	// If no list is found, throw a ReferenceError to indicate an invalid key.
	if (!result) {
		throw new ReferenceError('Unknown keystone list ' + JSON.stringify(key));
	}

	// Return the found list.
	return result;
};
