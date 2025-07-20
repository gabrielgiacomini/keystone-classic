/**
 * @fileoverview This file defines the `createKeystoneHash` function for Keystone,
 * which is used to generate a unique hash based on the Keystone version and the
 * configuration of all registered lists.
 *
 * This hash can be used for cache-busting or as a quick identifier for the current
 * state of the application's data model. It provides a way to detect changes in
 * the list configurations that might require invalidating caches or other dependent data.
 *
 * It uses the 'crypto' module for hash generation and 'lodash/forEach' for iterating
 * over the lists.
 * @example
 * const appHash = keystone.createKeystoneHash();
 * console.log(`Application hash: ${appHash}`);
 */
var crypto = require('crypto');
var forEach = require('lodash/forEach');

/**
 * Creates a hash based on the Keystone version and list configurations.
 *
 * This function generates an MD5 hash that is derived from the Keystone application's
 * version and the options of all registered lists. The resulting hash is a short,
 * 6-character hexadecimal string.
 *
 * The hash is created by:
 * 1. Initializing an MD5 hash object.
 * 2. Updating the hash with the Keystone version string.
 * 3. Iterating over all lists and updating the hash with the JSON representation
 *    of each list's options.
 * 4. Digesting the hash and returning the first 6 characters.
 *
 * @returns {string} A 6-character hexadecimal hash string.
 * @example
 * const keystoneHash = keystone.createKeystoneHash();
 * console.log('Current Keystone hash:', keystoneHash);
 */
function createKeystoneHash () {
	// Initialize an MD5 hash object.
	var hash = crypto.createHash('md5');

	// Add the Keystone version to the hash.
	hash.update(this.version);

	// Add the options of each list to the hash.
	forEach(this.lists, function (list, key) {
		// Stringify the list options to ensure a consistent representation.
		hash.update(JSON.stringify(list.getOptions()));
	});

	// Return the first 6 characters of the hexadecimal hash digest.
	return hash.digest('hex').slice(0, 6);
}

module.exports = createKeystoneHash;
