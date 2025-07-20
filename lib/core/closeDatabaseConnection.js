/**
 * @fileoverview This file defines the `closeDatabaseConnection` function for Keystone.
 *
 * This function is responsible for gracefully disconnecting from the MongoDB
 * database. It is a crucial part of the application shutdown process, ensuring
 * that all database connections are properly closed to prevent resource leaks.
 *
 * It uses the 'debug' module for logging the connection status.
 * @example
 * keystone.closeDatabaseConnection(() => {
 *   console.log('Database connection closed.');
 * });
 */
var debug = require('debug')('keystone:core:closeDatabaseConnection');

/**
 * Closes the connection to the MongoDB database.
 *
 * This function calls the `disconnect` method on the Mongoose instance to close
 * the database connection. A debug message is logged upon successful disconnection.
 * An optional callback can be provided to be executed after the connection is closed.
 *
 * @param {Function} [callback] - A callback function to execute once the connection is closed.
 * @returns {this} The Keystone instance, to allow for method chaining.
 * @example
 * keystone.closeDatabaseConnection(() => {
 *   console.log('Database connection closed.');
 * });
 */
module.exports = function closeDatabaseConnection (callback) {
	// Use Mongoose to disconnect from the database.
	this.mongoose.disconnect(function () {
		// Log that the connection has been closed for debugging purposes.
		debug('mongo connection closed');
		// If a callback function is provided, execute it.
		if (callback) {
			callback();
		}
	});
	// Return the Keystone instance to allow for method chaining.
	return this;
};
