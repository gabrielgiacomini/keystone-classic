/**
 * @fileoverview This file defines the `start` function for Keystone, which is responsible
 * for configuring and launching a Keystone application. It handles database connections,
 * server setup (HTTP, HTTPS, and Unix sockets), and event emissions for lifecycle hooks.
 *
 * The `start` function orchestrates the entire startup process, ensuring that all
 * necessary components are initialized before the application begins accepting requests.
 * It also includes error handling for common issues like port conflicts.
 *
 * This module relies on the 'async' library to manage asynchronous operations during startup.
 * @example
 * keystone.start({
 *   onStart: () => {
 *     console.log('Keystone has started!');
 *   },
 * });
 */

var async = require('async');

// A string of dashes for formatting console output.
var dashes = '\n------------------------------------------------\n';

/**
 * Configures and starts a Keystone app.
 *
 * This function connects to the database, runs updates, and starts the server to
 * listen for incoming requests. It supports various startup events to allow for
 * customization of the initialization process.
 *
 * @param {Object|Function} [events] - An object of event callbacks or a single `onStart` callback.
 * @param {Function} [events.onMount] - Fired after the database connection is opened.
 * @param {Function} [events.onStart] - Fired after the servers have started.
 * @param {Function} [events.onHttpServerCreated] - Fired when the HTTP server is created.
 * @param {Function} [events.onHttpsServerCreated] - Fired when the HTTPS server is created.
 * @param {Function} [events.onSocketServerCreated] - Fired when the Unix socket server is created.
 * @returns {this} The Keystone instance for chaining.
 * @api public
 */
function start (events) {

	// If `events` is a function, treat it as the `onStart` callback.
	if (typeof events === 'function') {
		events = { onStart: events };
	}
	// Ensure `events` is an object.
	if (!events) events = {};

	/**
	 * Fires a startup event if it exists.
	 * @param {string} name - The name of the event to fire.
	 * @private
	 */
	function fireEvent (name) {
		if (typeof events[name] === 'function') {
			events[name]();
		}
	}

	// Handle uncaught exceptions, with a special case for 'EADDRINUSE'.
	process.on('uncaughtException', function (e) {
		if (e.code === 'EADDRINUSE') {
			console.log(dashes
				+ keystone.get('name') + ' failed to start: address already in use\n'
				+ 'Please check you are not already running a server on the specified port.\n');
			process.exit();
		} else {
			console.log(e.stack || e);
			process.exit(1);
		}
	});

	// Initialize the Express application.
	this.initExpressApp();

	var keystone = this;
	var app = keystone.app;

	// Open the database connection before starting the servers.
	this.openDatabaseConnection(function () {

		// Fire the 'onMount' event, indicating the database is ready.
		fireEvent('onMount');

		var ssl = keystone.get('ssl');
		var unixSocket = keystone.get('unix socket');
		var startupMessages = [`KeystoneJS v${keystone.version} started:`];

		// Use async.parallel to start all required servers.
		async.parallel([
			// HTTP Server
			function (done) {
				if (ssl === 'only' || unixSocket) return done();
				require('../../server/startHTTPServer')(keystone, app, function (err, msg) {
					fireEvent('onHttpServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
			// HTTPS Server
			function (done) {
				if (!ssl || unixSocket) return done();
				require('../../server/startSecureServer')(keystone, app, function () {
					fireEvent('onHttpsServerCreated');
				}, function (err, msg) {
					startupMessages.push(msg);
					done(err);
				});
			},
			// Unix Socket Server
			function (done) {
				if (!unixSocket) return done();
				require('../../server/startSocketServer')(keystone, app, function (err, msg) {
					fireEvent('onSocketServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
		], function serversStarted (err) {
			// Log startup messages if a logger is configured.
			if (keystone.get('logger')) {
				console.log(dashes + startupMessages.join('\n') + dashes);
			}
			// Fire the 'onStart' event to signal that the application is running.
			fireEvent('onStart');
		});
	});

	return this;
}

module.exports = start;
