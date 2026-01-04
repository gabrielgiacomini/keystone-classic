var async = require("async");
var keystone = require("../..");
var ReactEngine = require("react-engine");
var engine = ReactEngine.server.create({});
var request = require("superagent");
var moment = require("moment");
var mongoose = require("mongoose");
var path = require("path");

var dbName = "/e2e" + (process.env.KEYSTONEJS_PORT || 3000);
var mongoHost = process.env.MONGO_HOST || "localhost";
var mongoPort = process.env.MONGO_PORT || "27017";
var mongoUri =
	process.env.MONGO_URI || ("mongodb://" + mongoHost + ":" + mongoPort + dbName);

function dropTestDatabase(done) {
	console.log(
		[moment().format("HH:mm:ss:SSS")] +
			" e2e: dropping test database: " +
			mongoUri
	);

	mongoose.connect(
		mongoUri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		function (err) {
			if (!err) {
				mongoose.connection.db.dropDatabase(function (err) {
					if (!err) {
						console.log(
							[moment().format("HH:mm:ss:SSS")] +
								" e2e: dropped test database: " +
								mongoUri
						);
					}
					mongoose.connection.close(function (err) {
						done(err);
					});
				});
			} else {
				console.error(
					[moment().format("HH:mm:ss:SSS")] +
						" e2e: failed to connect to mongo: " +
						err
				);
				done(err);
			}
		}
	);
}

function checkKeystoneReady(done) {
	async.retry(
		{
			times: 10,
			interval: 3000,
		},
		function (done, result) {
			console.log(
				[moment().format("HH:mm:ss:SSS")] +
					" e2e: checking if KeystoneJS ready for request"
			);
			request
				.get(
					"http://" +
						keystone.get("host") +
						":" +
						keystone.get("port") +
						"/keystone"
				)
				.end(done);
		},
		function (err, result) {
			if (!err) {
				console.log(
					[moment().format("HH:mm:ss:SSS")] + " e2e: KeystoneJS Ready!"
				);
				done();
			} else {
				console.log(
					[moment().format("HH:mm:ss:SSS")] +
						" e2e: KeystoneJS does not appear ready!"
				);
				done(err);
			}
		}
	);
}

function runKeystone(cb) {
	console.log(
		[moment().format("HH:mm:ss:SSS")] + " e2e: starting KeystoneJS..."
	);

	keystone.init({
		name: "e2e",
		brand: "e2e",

		host: process.env.KEYSTONEJS_HOST || "localhost",
		port: process.env.KEYSTONEJS_PORT || 3000,

		mongo: mongoUri,

		static: "frontend",
		favicon: "adminuiCustom/favicon.ico",
		less: "frontend",
		views: "frontend",
		"view engine": "jade",

		"auto update": true,
		session: true,
		auth: true,
		"user model": "User",
		"cookie secret": "Secret",
		"adminui custom styles": "adminuiCustom/styles.less",

		"cloudinary config": "cloudinary://api_key:api_secret@cloud_name",
	});

	keystone.import("models");

	keystone.set("routes", require("./routes"));

	keystone.set("nav", {
		access: ["users"],
		fields: [
			"booleans",
			"cloudinary-images",
			"cloudinary-image-multiples",
			"codes",
			"colors",
			"dates",
			"date-arrays",
			"datetimes",
			"emails",
			"files",
			"geo-points",
			"htmls",
			"keys",
			"locations",
			"markdowns",
			"money",
			"names",
			"numbers",
			"number-arrays",
			"passwords",
			"relationships",
			"selects",
			"texts",
			"text-arrays",
			"textareas",
			"urls",
		],
		Miscs: [
			"date-field-maps",
			"depends-ons",
			"field-attributes",
			"no-default-columns",
			"inline-relationships",
			"many-relationships",
			"hidden-relationships",
			"source-relationships",
			"target-relationships",
		],
	});

	keystone.start({
		onMount: function () {
			console.log(
				[moment().format("HH:mm:ss:SSS")] +
					" e2e: KeystoneJS mounted Successfully"
			);
		},
		onStart: function () {
			console.log(
				[moment().format("HH:mm:ss:SSS")] +
					" e2e: KeystoneJS Started Successfully"
			);
			cb();
		},
	});
}

function start() {
	var dropDB = process.argv.indexOf("--nodrop") === -1;

	async.series(
		[
			function (cb) {
				if (dropDB) {
					dropTestDatabase(cb);
				} else {
					cb();
				}
			},

			function (cb) {
				runKeystone(cb);
			},

			function (cb) {
				checkKeystoneReady(cb);
			},
		],
		function (err) {
			if (err) {
				console.error([moment().format("HH:mm:ss:SSS")] + " e2e: " + err);
				process.exit(1);
			}
			console.log([moment().format("HH:mm:ss:SSS")] + " e2e: Server ready for Playwright tests");
		}
	);
}

start();
