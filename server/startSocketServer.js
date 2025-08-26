/**
 * @fileoverview Configures and starts the Express server on a Unix socket.
 *
 * This script is used to start the KeystoneJS application listening on a
 * Unix socket, which is useful for inter-process communication and can offer
 * better performance than TCP/IP on a single machine.
 *
 * It is invoked by `lib/core/start.js`.
 *
 * @module server/startSocketServer
 * @param {module:keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 * @param {Function} callback The callback to execute when the server is ready.
 * @api private
 * @see {@link module:lib/core/start}
 * @example
 * // In a KeystoneJS startup script
 * keystone.init({
 *   'unix socket': '/tmp/keystone.sock'
 * });
 * keystone.start();
 */
var fs = require('fs');

/**
 * Starts the server on a Unix socket.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 * @param {Function} callback The callback to execute when the server is ready.
 */
module.exports = function (keystone, app, callback) {
	// Get the Unix socket path.
	var unixSocket = keystone.get('unix socket');
	var message = keystone.get('name') + ' is ready on ' + unixSocket;

	// Unlink the socket file if it exists, then start listening.
	fs.unlink(unixSocket, function () {
		// We expect an error if the file doesn't exist, so we ignore it.
		keystone.httpServer = app.listen(unixSocket, function (err) {
			callback(err, message);
		});
		// Set file permissions to be world-writable.
		fs.chmod(unixSocket, 0x777);
	});
};
