/**
 * @fileoverview Configures Let's Encrypt for automatic SSL certificate generation.
 *
 * This script integrates with `greenlock-express` to enable automated HTTPS
 * via Let's Encrypt. It requires specific configuration options to be set in
 * KeystoneJS, including email, domains, and agreement to the TOS.
 *
 * It is invoked by `server/createApp.js`.
 *
 * @api private
 * @see {@link module:server/createApp}
 */
var letsencrypt = require('greenlock-express');

/**
 * Initializes Let's Encrypt if the 'letsencrypt' option is enabled.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Object} app The Express app.
 */
module.exports = function (keystone, app) {
	// Get Let's Encrypt and SSL options.
	var options = keystone.get('letsencrypt');
	var ssl = keystone.get('ssl');

	// Do nothing if Let's Encrypt is not enabled.
	if (!options) {
		return;
	}

	// Validate SSL settings.
	if (!ssl) {
		console.error('Ignoring `letsencrypt` setting because `ssl` is not set.');
		return;
	}
	if (ssl === 'only') {
		console.error('To use Let\'s Encrypt you need to have a regular HTTP listener as well. Please set ssl to either `true` or `"force"`.');
		return;
	}

	// Extract Let's Encrypt configuration.
	var email = options.email;
	var approveDomains = options.domains;
	var server = options.production ? 'production' : 'staging';
	var agreeTos = options.tos;

	// Ensure approveDomains is an array.
	if (!Array.isArray(approveDomains)) {
		approveDomains = [approveDomains];
	}

	// Validate required options.
	if (!(agreeTos && email && approveDomains)) {
		console.error("For auto registation with Let's Encrypt you have to agree to the TOS (https://letsencrypt.org/repository/) (tos: true), provide domains (domains: ['mydomain.com', 'www.mydomain.com']) and a domain owner email (email: 'admin@mydomain.com')");
		return;
	}

	// Create a new Let's Encrypt instance.
	// TODO: Consider using le-store-mongo for persistence.
	var lex = letsencrypt.create({
		server: server,
		approveDomains: approveDomains,
		agreeTos: agreeTos,
		email: email,
	});

	// Set the HTTPS server options and bind the middleware.
	keystone.set('https server options', lex.httpsOptions);
	app.use(lex.middleware());
};
