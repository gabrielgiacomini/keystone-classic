/**
 * @fileoverview This file defines the `initExpressApp` method for the Keystone instance.
 * It is responsible for initializing the Express application.
 * @module lib/core/initExpressApp
 */

/**
 * Initializes the Express application.
 *
 * @param {import('express').Application} [customApp] A custom Express app instance.
 * @returns {this} The Keystone instance for chaining.
 */
module.exports = function initExpressApp (customApp) {
	if (this.app) return this;
	this.initDatabaseConfig();
	this.initExpressSession(this.mongoose);
	if (customApp) {
		this.app = customApp;
		require('../../server/createApp')(this);
	} else {
		this.app = require('../../server/createApp')(this);
	}
	return this;
};
