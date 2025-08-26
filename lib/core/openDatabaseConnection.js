/**
 * @fileoverview This file defines the `openDatabaseConnection` function for Keystone,
 * which handles the process of connecting to the MongoDB database.
 *
 * It supports various connection methods, including replica sets and standard connection
 * strings, and manages connection events such as errors and successful opening.
 * This function is a critical part of Keystone's startup process, ensuring that the
 * application is connected to its database before proceeding with other initializations.
 *
 * It uses 'debug' for logging connection information.
 */
var debug = require("debug")("keystone:core:openDatabaseConnection");

/**
 * Opens the connection to the MongoDB database.
 *
 * This function reads the database configuration from Keystone's options and
 * establishes a connection using Mongoose. It handles different connection
 * scenarios, such as using a replica set or providing custom MongoDB options.
 *
 * Once the connection is open, it calls the provided callback, and can also
 * trigger automatic updates if configured.
 *
 * @param {Function} callback - A callback function to be executed after the connection is established.
 * @returns {this} The Keystone instance, for chaining.
 */
module.exports = function openDatabaseConnection(callback) {
	var keystone = this;
	var mongoConnectionOpen = false;

	// Support for replica sets for Mongoose.
	if (keystone.get("mongo replica set")) {
		debug("setting up mongo replica set");
		var replicaData = keystone.get("mongo replica set");
		var replica = "";
		var credentials =
			replicaData.username && replicaData.password
				? replicaData.username + ":" + replicaData.password + "@"
				: "";

		replicaData.db.servers.forEach(function (server) {
			replica +=
				"mongodb://" +
				credentials +
				server.host +
				":" +
				server.port +
				"/" +
				replicaData.db.name +
				",";
		});

		var options = {
			auth: { authSource: replicaData.authSource },
			replset: {
				rs_name: replicaData.db.replicaSetOptions.rs_name,
				readPreference: replicaData.db.replicaSetOptions.readPreference,
			},
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		};

		debug("connecting to replica set");
		keystone.mongoose.connect(replica, options);
	} else if (keystone.get("mongo options")) {
		// Connection with custom MongoDB options.
		debug("connecting to mongo with custom options");
		keystone.initDatabaseConfig();
		var mongo_options = keystone.get("mongo options") || {};
		mongo_options.useNewUrlParser = mongo_options.useNewUrlParser !== false;
		mongo_options.useUnifiedTopology =
			mongo_options.useUnifiedTopology !== false;
		mongo_options.useCreateIndex = mongo_options.useCreateIndex !== false;
		keystone.mongoose.connect(keystone.get("mongo"), mongo_options);
	} else {
		// Standard connection using a connection string.
		debug("connecting to mongo");
		keystone.initDatabaseConfig();
		var mongo_options = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		};
		keystone.mongoose.connect(keystone.get("mongo"), mongo_options);
	}

	// Set up Mongoose connection event listeners.
	keystone.mongoose.connection
		.on("error", function (err) {
			// Ignore validation errors, as they are handled elsewhere.
			if (mongoConnectionOpen && err && err.name === "ValidationError") return;

			// Log the error for debugging.
			console.error("------------------------------------------------");
			console.error('Mongoose connection "error" event fired with:');
			console.error(err);

			// If the initial connection fails, throw a more helpful error.
			if (!mongoConnectionOpen) {
				throw new Error(
					"KeystoneJS (" +
						keystone.get("name") +
						") failed to start - Check that you are running `mongod` in a separate process."
				);
			}

			// Rethrow other errors.
			throw err;
		})
		.once("open", function () {
			debug("mongo connection open");
			mongoConnectionOpen = true;

			// Function to be called after connection is established.
			var connected = function () {
				if (keystone.get("auto update")) {
					debug("applying auto update");
					keystone.applyUpdates(callback);
				} else {
					callback();
				}
			};

			// If a session store promise exists, wait for it to resolve.
			if (keystone.sessionStorePromise) {
				keystone.sessionStorePromise.then(connected);
			} else {
				connected();
			}
		});

	return this;
};
