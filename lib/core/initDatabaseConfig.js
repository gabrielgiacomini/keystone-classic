/**
 * @fileoverview This file defines the `initDatabaseConfig` function for Keystone,
 * which is responsible for setting up the MongoDB connection string if it has not
 * already been provided.
 *
 * This function ensures that Keystone has a valid MongoDB connection URL by checking
 * for a 'mongo' option. If one is not found, it attempts to construct one from
 * environment variables or default settings. This simplifies the configuration
 * process for developers in common hosting environments.
 *
 * It uses the 'keystone-utils' library for creating URL-friendly slugs.
 */
var utils = require('keystone-utils');

/**
 * Initializes the database configuration for Keystone.
 *
 * This function sets the 'mongo' option, which is the connection string for the
 * MongoDB database. If the 'mongo' option is not already set, it will be
 * derived from the 'db name' and 'name' options, or from a series of common
 * environment variables used by hosting providers.
 *
 * The order of precedence for the database URL is:
 * 1. The 'mongo' option.
 * 2. The `MONGO_URI` environment variable.
 * 3. The `MONGODB_URI` environment variable.
 * 4. The `MONGO_URL` environment variable.
 * 5. The `MONGODB_URL` environment variable.
 * 6. The `MONGOLAB_URI` environment variable.
 * 7. The `MONGOLAB_URL` environment variable.
 * 8. The `OPENSHIFT_MONGODB_DB_URL` environment variable, with the database name appended.
 * 9. A default of `mongodb://localhost/` with the database name appended.
 *
 * The database name is determined by the 'db name' option, or a slugified version
 * of the 'name' option.
 *
 * @returns {this} The Keystone instance, for chaining.
 */
module.exports = function initDatabaseConfig () {
	// Only configure the database if the 'mongo' option has not been set.
	if (!this.get('mongo')) {
		// Determine the database name from options, or slugify the app name.
		var dbName = this.get('db name')
			|| utils.slug(this.get('name'));

		// Determine the database URL from environment variables or use a default.
		var dbUrl = process.env.MONGO_URI
			|| process.env.MONGODB_URI
			|| process.env.MONGO_URL
			|| process.env.MONGODB_URL
			|| process.env.MONGOLAB_URI
			|| process.env.MONGOLAB_URL
			|| (process.env.OPENSHIFT_MONGODB_DB_URL
			|| 'mongodb://localhost/') + dbName;

		// Set the 'mongo' option with the determined URL.
		this.set('mongo', dbUrl);
	}
	return this;
};
