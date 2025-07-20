/**
 * @fileoverview This file defines the `start` method for the Keystone instance.
 * It is responsible for configuring and starting the Keystone application, including
 * connecting to the database, running updates, and starting the web server.
 * @module lib/core/start
 */
var async = require('async');

var dashes = '\n------------------------------------------------\n';

/**
 * Configures and starts a Keystone app in encapsulated mode.
 *
 * Connects to the database, runs updates, and listens for incoming requests.
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - `onMount`: After the Express app is mounted.
 *   - `onStart`: After the web server is started.
 *   - `onHttpServerCreated`: After the HTTP server is created.
 *   - `onHttpsServerCreated`: After the HTTPS server is created.
 *
 * If the `events` argument is a function, it is assumed to be the `onStart` event handler.
 *
 * @param {object|function} [events] An object of event handlers, or the `onStart` event handler.
 * @param {function} [events.onMount] The `onMount` event handler.
 * @param {function} [events.onStart] The `onStart` event handler.
 * @param {function} [events.onHttpServerCreated] The `onHttpServerCreated` event handler.
 * @param {function} [events.onHttpsServerCreated] The `onHttpsServerCreated` event handler.
 * @returns {this} The Keystone instance for chaining.
 * @api public
 */
function start (events) {

	if (typeof events === 'function') {
		events = { onStart: events };
	}
	if (!events) events = {};

	function fireEvent (name) {
		if (typeof events[name] === 'function') {
			events[name]();
		}
	}

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

	this.initExpressApp();

	var keystone = this;
	var app = keystone.app;

	this.openDatabaseConnection(function () {

		fireEvent('onMount');

		var ssl = keystone.get('ssl');
		var unixSocket = keystone.get('unix socket');
		var startupMessages = [`KeystoneJS v${keystone.version} started:`];

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
			// Unix Socket
			function (done) {
				if (!unixSocket) return done();
				require('../../server/startSocketServer')(keystone, app, function (err, msg) {
					fireEvent('onSocketServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
		], function serversStarted (err, messages) {
			if (keystone.get('logger')) {
				console.log(dashes + startupMessages.join('\n') + dashes);
			}
			fireEvent('onStart');
		});
	});

	return this;
}

module.exports = start;
