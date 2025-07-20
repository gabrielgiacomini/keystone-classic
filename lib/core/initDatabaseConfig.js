/**
 * @fileoverview This file defines the `initDatabaseConfig` method for the Keystone instance.
 * It is responsible for initializing the database configuration, including determining the MongoDB connection string.
 * @module lib/core/initDatabaseConfig
 */
var utils = require('keystone-utils');

/**
 * Initializes the database configuration.
 *
 * If the `mongo` option is not set, it will be determined based on the `db name` option,
 * the application name, or environment variables.
 *
 * @returns {this} The Keystone instance for chaining.
 */
module.exports = function initDatabaseConfig () {
	if (!this.get('mongo')) {
		var dbName = this.get('db name')
			|| utils.slug(this.get('name'));
		var dbUrl = process.env.MONGO_URI
			|| process.env.MONGODB_URI
			|| process.env.MONGO_URL
			|| process.env.MONGODB_URL
			|| process.env.MONGOLAB_URI
			|| process.env.MONGOLAB_URL
			|| (process.env.OPENSHIFT_MONGODB_DB_URL
			|| 'mongodb://localhost/') + dbName;
		this.set('mongo', dbUrl);
	}
	return this;
};
