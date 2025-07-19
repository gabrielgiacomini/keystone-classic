/**
 * @fileoverview Configures and starts the Express server.
 *
 * This script creates an HTTP server and listens on the configured host and port.
 * It is a core part of the KeystoneJS startup process.
 *
 * It is invoked by `lib/core/start.js`.
 *
 * @api private
 */
var http = require('http');

/**
 * Starts the HTTP server.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 * @param {Function} callback The callback to execute when the server is ready.
 */
module.exports = function (keystone, app, callback) {
	// Get the host, port, and SSL settings.
	var host = keystone.get('host');
	var port = keystone.get('port');
	var forceSsl = (keystone.get('ssl') === 'force');

	// Create the HTTP server.
	keystone.httpServer = http
		.createServer(app)
		.listen(port, host, function ready (err) {
			if (err) { return callback(err); }

			// Log the success message.
			var message = keystone.get('name') + ' is ready on '
				+ 'http://' + host + ':' + port
				+ (forceSsl ? ' (SSL redirect)' : '');
			callback(null, message);
		});
};
