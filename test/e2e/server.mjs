import keystone from '../../index.mjs';
import mongoose from 'mongoose';
import path from 'node:path';
import keystoneNightwatchE2e from './keystone-nightwatch/index.mjs';
import e2eRoutes from './routes/index.mjs';

// Set app-specific env for nightwatch session
process.env.KNE_TEST_PATHS = "test/e2e/adminUI/tests";
process.env.KNE_EXCLUDE_TEST_PATHS =
	"test/e2e/adminUI/tests/group006Fields/commonFieldTestUtils.js,test/e2e/adminUI/tests/group999FixMe/*";

// determine the mongo uri and database name
const dbName = "/e2e" + (process.env.KEYSTONEJS_PORT || 3000);
const mongoUri =
	"mongodb://" + (process.env.KEYSTONEJS_HOST || "localhost") + dbName;

function timestamp() {
	const date = new Date();
	const pad = (value, length = 2) => String(value).padStart(length, "0");
	return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}:${pad(date.getMilliseconds(), 3)}`;
}

// Function that drops the test database before starting testing
function dropTestDatabase(done) {
	console.log(
		[timestamp()] +
			" e2e: dropping test database: " +
			mongoUri
	);

	(async function () {
		try {
			await mongoose.connect(mongoUri);
			try {
				await mongoose.connection.db.dropDatabase();
				console.log(
					[timestamp()] +
						" e2e: dropped test database: " +
						mongoUri
				);
			} finally {
				await mongoose.connection.close();
			}
			done();
		} catch (err) {
			console.error(
				[timestamp()] +
					" e2e: failed to connect to mongo: " +
					err
			);
			done(err);
		}
	})();
}

// Function that checks if keystone is ready before starting testing
function checkKeystoneReady(done) {
	let attempts = 0;
	const maxAttempts = 10;
	const interval = 3000;
	async function attempt() {
		attempts++;
		console.log(
			[timestamp()] +
				" e2e: checking if KeystoneJS ready for request"
		);
		try {
			const response = await fetch(
				"http://" +
					keystone.get("host") +
					":" +
					keystone.get("port") +
					"/keystone"
			);
			if (!response.ok) {
				throw new Error("KeystoneJS readiness request returned " + response.status);
			}
			console.log(
				[timestamp()] + " e2e: KeystoneJS Ready!"
			);
			done();
		} catch (err) {
			if (attempts < maxAttempts) {
				setTimeout(attempt, interval);
				return;
			}
			console.log(
				[timestamp()] +
					" e2e: KeystoneJS does not appear ready!"
			);
			done(err);
		}
	}
	attempt();
}

// Function that starts the e2e common framework
function runE2E(options, done) {
	console.log([timestamp()] + " e2e: starting tests...");

	keystoneNightwatchE2e.startE2E(options, done);
}

// Function that starts keystone
async function runKeystone(cb) {
	console.log(
		[timestamp()] + " e2e: starting KeystoneJS..."
	);

	// initialize keystone
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

	// import app models
	await keystone.import("models");

	// setup any custom routes
	keystone.set("routes", e2eRoutes);

	// setup application adminui navigation
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
				[timestamp()] +
					" e2e: KeystoneJS mounted Successfuly"
			);
		},
		onStart: function () {
			console.log(
				[timestamp()] +
					" e2e: KeystoneJS Started Successfully"
			);
			cb();
		},
	});
}

// Function that bootstraps the e2e test service
function start() {
	const runTests = process.argv.indexOf("--notest") === -1;
	const dropDB = process.argv.indexOf("--nodrop") === -1;

	const tasks = [
		function (cb) {
			if (dropDB) {
				dropTestDatabase(cb);
			} else {
				cb();
			}
		},
		function (cb) { runKeystone(cb); },
		function (cb) { checkKeystoneReady(cb); },
		function (cb) {
			if (runTests) {
				runE2E({ keystone: keystone }, cb);
			} else {
				cb();
			}
		},
	];
	tasks.reduce(function (chain, task) {
		return chain.then(function () {
			return new Promise(function (resolve, reject) {
				task(function (err) { if (err) reject(err); else resolve(); });
			});
		});
	}, Promise.resolve()).then(function () {
		if (runTests) {
			console.error([timestamp()] + " e2e: exiting");
			process.exit(0);
		}
	}, function (err) {
		console.error([timestamp()] + " e2e: " + err);
		console.error([timestamp()] + " e2e: exiting");
		process.exit(1);
	});
}

start();
