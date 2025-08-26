/**
 * @fileoverview This file defines the `initExpressApp` function for Keystone,
 * which is responsible for initializing the Express application instance.
 *
 * This function ensures that a Keystone application has a configured Express app,
 * either by creating a new one or by wrapping a custom app provided by the user.
 * It also initializes database configuration and Express session management, which
 * are essential for the application to run correctly.
 * @example
 * // Basic initialization
 * keystone.initExpressApp();
 *
 * // Using a custom Express app
 * const myApp = require('express')();
 * keystone.initExpressApp(myApp);
 */

/**
 * Initializes the Express application for Keystone.
 *
 * This function sets up the Express app instance for the Keystone application.
 * If an Express app already exists on the Keystone instance, it does nothing.
 * Otherwise, it initializes the database configuration and Express session, and
 * then creates or configures the Express app.
 *
 * @param {Object} [customApp] - An optional, pre-existing Express app instance to use.
 *   If not provided, a new Express app will be created.
 * @returns {this} The Keystone instance, for chaining.
 * @example
 * // Initialize with a new Express app
 * keystone.initExpressApp();
 *
 * // Initialize with a custom Express app
 * const express = require('express');
 * const myApp = express();
 * keystone.initExpressApp(myApp);
 */
module.exports = function initExpressApp (customApp) {
	// If an Express app is already initialized, do nothing.
	if (this.app) return this;

	// Initialize database configuration and Express session support.
	this.initDatabaseConfig();
	this.initExpressSession(this.mongoose);

	// If a custom Express app is provided, use it.
	if (customApp) {
		this.app = customApp;
		// The `createApp` function from the server directory will add Keystone's
		// core middleware and routes to the app.
		require('../../server/createApp')(this);
	} else {
		// If no custom app is provided, create a new one.
		this.app = require('../../server/createApp')(this);
	}

	// Return the Keystone instance to allow for method chaining.
	return this;
};
