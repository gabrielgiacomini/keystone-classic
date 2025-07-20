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
 * @example
 * keystone.openDatabaseConnection(() => {
 *   console.log('Successfully connected to the database.');
 * });
 */
var debug = require("debug")("keystone:core:openDatabaseConnection");

/**
 * Opens the database connection.
 *
 * @param {function} callback The function to call when the connection is established.
 */
module.exports = function openDatabaseConnection(callback) {
	var keystone = this;
	var mongoConnectionOpen = false;

	// support replica sets for mongoose
	if (keystone.get("mongo replica set")) {
		console.log(
			"keystonejs is using 'mongo replica set' config to connect to mongo"
		);

		// if (keystone.get('logger')) {
		// 	console.log(
		// 		'\nWarning: using the `mongo replica set` option has been deprecated and will be removed in'
		// 		+ ' a future version.\nInstead set the `mongo` connection string with your host details, e.g.'
		// 		+ ' mongodb://username:password@host:port,host:port,host:port/database and set any replica set options'
		// 		+ ' in `mongo options`.\n\nRefer to https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html'
		// 		+ ' for more details on the connection settings.'
		// 	);
		// }

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
			// useMongoClient: true,
		};

		debug("connecting to replica set");
		keystone.mongoose.connect(replica, options);

		console.log("keystone.mongoose.connect > replica", replica);
		console.log("keystone.mongoose.connect > options", options);
	} else if (keystone.get("mongo options")) {
		console.log(
			"keystonejs is using both 'mongo' connection string and 'mongo options' config to connect to mongo"
		);

		debug("connecting to mongo");
		keystone.initDatabaseConfig();
		var mongo_options = keystone.get("mongo options") || {};
		// Add modern MongoDB driver options to prevent deprecation warnings
		mongo_options.useNewUrlParser = mongo_options.useNewUrlParser !== false; // Allow override but default to true
		mongo_options.useUnifiedTopology =
			mongo_options.useUnifiedTopology !== false; // Allow override but default to true
		mongo_options.useCreateIndex = mongo_options.useCreateIndex !== false; // Allow override but default to true
		// mongo_options.useMongoClient = true;
		keystone.mongoose.connect(keystone.get("mongo"), mongo_options);

		console.log(
			"keystonejs is using 'mongo replica set' config to connect to mongo"
		);
		console.log("keystone.mongoose.connect > replica", replica);
		console.log("keystone.mongoose.connect > options", options);
	} else {
		console.log(
			"keystonejs is automatically configuring to connect to mongo by using only the 'mongo' connection string"
		);

		debug("connecting to mongo");
		keystone.initDatabaseConfig();
		var mongo_options = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		};
		// Add modern MongoDB driver options to prevent deprecation warnings

		keystone.mongoose.connect(keystone.get("mongo"), mongo_options);

		console.log("keystone.mongoose.connect > options", mongo_options);
	}

	keystone.mongoose.connection
		.on("error", function (err) {
			// The DB connection has been established previously and this a ValidationError caused by restrictions Mongoose is enforcing on the field value
			// We can ignore these here; they'll also be picked up by the 'error' event listener on the model; see /lib/list/register.js
			if (mongoConnectionOpen && err && err.name === "ValidationError") return;

			// Alternatively, the error is legitimate; output it
			console.error("------------------------------------------------");
			console.error('Mongoose connection "error" event fired with:');
			console.error(err);

			// There's been an error establishing the initial connection, ie. Keystone is attempting to start
			if (!mongoConnectionOpen) {
				throw new Error(
					"KeystoneJS (" +
						keystone.get("name") +
						") failed to start - Check that you are running `mongod` in a separate process."
				);
			}

			// Otherwise rethrow the initial error
			throw err;
		})
		.once("open", function () {
			debug("mongo connection open");
			mongoConnectionOpen = true;

			var connected = function () {
				if (keystone.get("auto update")) {
					debug("applying auto update");
					keystone.applyUpdates(callback);
				} else {
					callback();
				}
			};

			if (keystone.sessionStorePromise) {
				keystone.sessionStorePromise.then(connected);
			} else {
				connected();
			}
		});

	return this;
};
