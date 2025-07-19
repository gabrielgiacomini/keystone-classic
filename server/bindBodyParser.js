/**
 * @fileoverview Binds body-parser middleware to the KeystoneJS app.
 *
 * This script configures and binds middleware for parsing request bodies,
 * including JSON and URL-encoded data. It also integrates with `multer` for
 * handling file uploads.
 *
 * It is invoked by `server/createApp.js`.
 * @see {@link module:server/createApp}
 * @example
 * // In a KeystoneJS startup script
 * keystone.init({
 *   'file limit': '10mb',
 *   'handle uploads': true,
 * });
 */
var bodyParser = require('body-parser');
var uploads = require('../lib/uploads');

/**
 * Binds body-parser middleware.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 */
module.exports = function bindBodyParser (keystone, app) {
	// Set up body-parser options.
	var bodyParserParams = {};
	if (keystone.get('file limit')) {
		bodyParserParams.limit = keystone.get('file limit');
	}

	// Bind middleware for parsing JSON and URL-encoded request bodies.
	app.use(bodyParser.json(bodyParserParams));
	bodyParserParams.extended = true;
	app.use(bodyParser.urlencoded(bodyParserParams));

	// Configure multer for file uploads if 'handle uploads' is enabled.
	if (keystone.get('handle uploads')) {
		uploads.configure(app, keystone.get('multer options'));
	}
};
