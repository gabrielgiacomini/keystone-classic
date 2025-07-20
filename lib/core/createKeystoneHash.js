/**
 * @fileoverview This file defines the `createKeystoneHash` method for the Keystone instance.
 * It is used to create a hash of the Keystone version and list configurations, which can be used for cache busting.
 * @module lib/core/createKeystoneHash
 */
var crypto = require('crypto');
var forEach = require('lodash/forEach');

/**
 * Creates a hash of the Keystone version and list configurations.
 *
 * @returns {string} The generated hash.
 */
function createKeystoneHash () {
	var hash = crypto.createHash('md5');
	hash.update(this.version);

	forEach(this.lists, function (list, key) {
		hash.update(JSON.stringify(list.getOptions()));
	});

	return hash.digest('hex').slice(0, 6);
}

module.exports = createKeystoneHash;
