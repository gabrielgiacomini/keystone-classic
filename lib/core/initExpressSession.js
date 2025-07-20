/**
 * @fileoverview This file defines the `initExpressSession` function for Keystone,
 * which is responsible for configuring and initializing Express session management.
 *
 * It sets up session middleware with support for various session stores like
 * connect-mongo and connect-redis. This is a crucial part of Keystone's
 * authentication and user management features.
 *
 * This module relies on 'lodash', 'express-session', 'cookie-parser', 'debug',
 * 'es6-promise', and a custom `safeRequire` utility.
 * @example
 * // Called internally by `keystone.initExpressApp()`.
 * // Not typically called directly by the user.
 */
var _ = require('lodash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var debug = require('debug')('keystone:core:initExpressSession');
var Promise = require('es6-promise').Promise;
var safeRequire = require('../safeRequire');

/**
 * Initializes Express session management for Keystone.
 *
 * This function configures and creates an Express session middleware. It ensures
 * that a 'cookie secret' is provided and sets up the session store based on
 * Keystone's configuration options.
 *
 * @param {Object} mongoose - The Mongoose instance used by Keystone.
 * @returns {this} The Keystone instance, for chaining.
 */
module.exports = function initExpressSession (mongoose) {

	// If session middleware is already initialized, do nothing.
	if (this.expressSession) return this;

	var sessionStorePromise;

	// Validate that a 'cookie secret' is set.
	if (!this.get('cookie secret')) {
		console.error('\nKeystoneJS Configuration Error:\n\nPlease provide a `cookie secret` value for session encryption.\n');
		process.exit(1);
	}

	// Get session options and set defaults.
	var sessionOptions = this.get('session options') || {};
	_.defaults(sessionOptions, {
		key: 'keystone.sid',
		resave: false,
		saveUninitialized: false,
		secret: this.get('cookie secret'),
	});

	// Set up cookie parser middleware.
	sessionOptions.cookieParser = cookieParser(this.get('cookie secret'));

	var sessionStore = this.get('session store');

	// Configure the session store.
	if (typeof sessionStore === 'function') {
		sessionOptions.store = sessionStore(session);
	} else if (sessionStore) {
		var sessionStoreOptions = this.get('session store options') || {};

		// Handle specific session store implementations.
		if (sessionStore === 'mongo') {
			sessionStore = 'connect-mongo';
		} else if (sessionStore === 'redis') {
			sessionStore = 'connect-redis';
		}

		switch (sessionStore) {
			case 'connect-mongo':
				debug('using connect-mongo session store');
				// Compatibility for older Node.js versions.
				if (process.version.substr(0, 4) === 'v0.1') {
					try {
						require('connect-mongo/es5');
						sessionStore = 'connect-mongo/es5';
					} catch (e) { /* ignore */ }
				}
				_.defaults(sessionStoreOptions, {
					collection: 'app_sessions',
					mongooseConnection: mongoose.connection,
				});
				break;

			case 'connect-mongostore':
				debug('using connect-mongostore session store');
				_.defaults(sessionStoreOptions, { collection: 'app_sessions' });
				if (!sessionStoreOptions.db) {
					console.error('\nERROR: connect-mongostore requires `session store options` to be set.\n');
					process.exit(1);
				}
				break;

			case 'connect-redis':
				debug('using connect-redis session store');
				break;

			default:
				console.error('\nERROR: unsupported session store ' + sessionStore + '.\n');
				process.exit(1);
		}

		// Initialize the session store.
		var SessionStore = safeRequire(sessionStore, this.get('session store') + ' as a `session store` option')(session);

		// Create a promise to handle asynchronous store initialization.
		sessionStorePromise = new Promise(function (resolve) {
			sessionOptions.store = new SessionStore(sessionStoreOptions, resolve);
			sessionOptions.store.on('connect', resolve);
			sessionOptions.store.on('connected', resolve);
			sessionOptions.store.on('disconnect', function () {
				console.error('\nThere was an error connecting to the ' + sessionStore + ' session store.\n');
				process.exit(1);
			});
		});
	}

	// Expose the initialized session middleware and options.
	this.set('session options', sessionOptions);
	this.expressSession = session(sessionOptions);
	this.sessionStorePromise = sessionStorePromise;

	return this;
};
