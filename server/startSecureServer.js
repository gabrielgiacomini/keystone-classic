/**
 * @fileoverview Configures and starts the secure (HTTPS/SPDY) server.
 *
 * This script sets up and starts an HTTPS or SPDY server, depending on the
 * availability of the `spdy` module. It handles SSL certificate loading,
 * SNI (Server Name Indication), and other security-related configurations.
 *
 * It is invoked by `lib/core/start.js`.
 *
 * @api private
 * @see {@link module:lib/core/start}
 */
var https;
try {
	// Use spdy if available for HTTP/2 support.
	https = require('spdy');
} catch (e) {
	// Fall back to the native https module.
	https = require('https');
}
var tls = require('tls');
var fs = require('fs');

/**
 * Starts the secure server.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 * @param {Function} created A callback to execute after the server is created.
 * @param {Function} callback The callback to execute when the server is ready.
 */
module.exports = function (keystone, app, created, callback) {
	// Get SSL configuration.
	var ssl = keystone.get('ssl');
	var host = keystone.get('ssl host') || keystone.get('host');
	var port = keystone.get('ssl port');
	var message = (ssl === 'only') ? keystone.get('name') + ' (SSL) is ready on ' : 'SSL Server is ready on ';
	var sniFunc;

	// Get HTTPS server options.
	var options = keystone.get('https server options') || {};
	if (options.NPNProtocols && options.NPNProtocols.length === 1 && options.NPNProtocols[0] === 'http/1.1') {
		// Remove default NPNProtocols value so spdy can use its own better ones.
		delete options.NPNProtocols;
	}

	// Load SSL certificate files.
	if (keystone.get('ssl cert') && fs.existsSync(keystone.getPath('ssl cert'))) {
		options.cert = fs.readFileSync(keystone.getPath('ssl cert'));
	}
	if (keystone.get('ssl key') && fs.existsSync(keystone.getPath('ssl key'))) {
		options.key = fs.readFileSync(keystone.getPath('ssl key'));
	}
	if (keystone.get('ssl ca') && fs.existsSync(keystone.getPath('ssl ca'))) {
		options.ca = fs.readFileSync(keystone.getPath('ssl ca'));
	}
	if (keystone.get('ssl pfx') && fs.existsSync(keystone.getPath('ssl pfx'))) {
		options.pfx = fs.readFileSync(keystone.getPath('ssl pfx'));
	}

	// Load SSL certificate data from strings.
	if (keystone.get('ssl cert data')) {
		options.cert = keystone.get('ssl cert');
	}
	if (keystone.get('ssl key data')) {
		options.key = keystone.get('ssl key');
	}
	if (keystone.get('ssl ca data')) {
		options.ca = keystone.get('ssl ca');
	}
	if (keystone.get('ssl pfx data')) {
		options.pfx = keystone.get('ssl pfx');
	}
	if (keystone.get('ssl passphrase')) {
		options.passphrase = keystone.get('ssl passphrase');
	}

	// Configure SNI (Server Name Indication) if a function is provided.
	sniFunc = keystone.get('ssl sni');
	if (sniFunc) {
		options.SNICallback = function (host, cb) {
			var ctx = sniFunc(host);
			cb(null, ctx && tls.createSecureContext(ctx));
		};
	}

	// Validate SSL configuration.
	if ((!options.key || !options.cert) && !options.pfx && !keystone.get('letsencrypt')) {
		if (sniFunc) {
			// Populate the config with what sniFunc returns for localhost.
			var localCtx = sniFunc('localhost');
			if (localCtx) {
				for (var prop in localCtx) {
					if (localCtx.hasOwnProperty(prop)) {
						options[prop] = localCtx[prop];
					}
				}
			}
		}
		if ((!options.key || !options.cert) && !options.pfx) {
			if (ssl === 'only') {
				console.log(keystone.get('name') + ' failed to start: invalid ssl configuration (certificate files required)');
				process.exit();
			}
			return callback(null, 'SSL Not Started: Invalid SSL Configuration (certificate files required)');
		}
	}

	// Create the HTTPS server.
	var server = https.createServer(options, app);
	created();

	// Callback function when the server is ready.
	function ready (err) {
		callback(err, message);
	}

	// Start listening on the configured host and port.
	message += 'https://' + host + ':' + port;
	keystone.httpsServer = server.listen(port, host, ready);
};
