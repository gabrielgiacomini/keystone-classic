/**
 * @fileoverview This file defines the `closeDatabaseConnection` method for the Keystone instance.
 * It is responsible for closing the connection to the MongoDB database.
 * @module lib/core/closeDatabaseConnection
 */
var debug = require('debug')('keystone:core:closeDatabaseConnection');

/**
 * Closes the database connection.
 *
 * @param {function} [callback] A function to call when the connection is closed.
 * @returns {this} The Keystone instance for chaining.
 */
module.exports = function closeDatabaseConnection (callback) {
	this.mongoose.disconnect(function () {
		debug('mongo connection closed');
		callback && callback();
	});
	return this;
};
