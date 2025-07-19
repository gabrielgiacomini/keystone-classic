/**
 * @fileoverview Creates and configures an Express app for KeystoneJS.
 *
 * This script initializes an Express app, sets up essential middleware,
 * and binds various Keystone-specific functionality such as the Admin UI,
 * database configuration, and error handlers. It is the core of Keystone's
 * server setup.
 *
 * It is invoked by `keystone.start()`.
 * @see {@link Keystone#start}
 * @example
 * // In a KeystoneJS startup script
 * keystone.start();
 */
var compression = require('compression');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var morgan = require('morgan');

var language = require('../lib/middleware/language');

/**
 * Creates and configures an Express app.
 *
 * @param {Keystone} keystone The Keystone instance.
 * @param {Function} express The Express constructor.
 * @returns {Object} The configured Express app.
 */
module.exports = function createApp (keystone, express) {

	// Create a new Express app if one hasn't been provided.
	if (!keystone.app) {
		if (!express) {
			express = require('express');
		}
		keystone.app = express();
	}

	var app = keystone.app;

	// Initialize Let's Encrypt and SSL redirection.
	require('./initLetsEncrypt')(keystone, app);
	require('./initSslRedirect')(keystone, app);

	// Initialize database and session configuration.
	keystone.initDatabaseConfig();
	keystone.initExpressSession(keystone.mongoose);

	// Initialize various server settings.
	require('./initTrustProxy')(keystone, app);
	require('./initViewEngine')(keystone, app);
	require('./initViewLocals')(keystone, app);
	require('./bindIPRestrictions')(keystone, app);

	// Compress response bodies if the 'compress' option is enabled.
	if (keystone.get('compress')) {
		app.use(compression());
	}

	// Execute 'pre:static' hooks.
	if (typeof keystone.get('pre:static') === 'function') {
		keystone.get('pre:static')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:static', req, res, next);
	});

	// Serve the favicon if one is specified.
	if (keystone.get('favicon')) {
		app.use(favicon(keystone.getPath('favicon')));
	}

	// Bind the Admin UI's static router unless in headless mode.
	if (!keystone.get('headless')) {
		app.use('/' + keystone.get('admin path'), require('../admin/server').createStaticRouter(keystone));
	}

	// Bind middleware for CSS pre-processors and static assets.
	require('./bindLessMiddleware')(keystone, app);
	require('./bindSassMiddleware')(keystone, app);
	require('./bindStylusMiddleware')(keystone, app);
	require('./bindStaticMiddleware')(keystone, app);

	// Bind session middleware.
	require('./bindSessionMiddleware')(keystone, app);

	// Execute 'pre:logger' hooks before logging requests.
	app.use(function (req, res, next) {
		keystone.callHook('pre:logger', req, res, next);
	});

	// Bind the default logger (morgan) if 'logger' is enabled.
	if (keystone.get('logger')) {
		var loggerOptions = keystone.get('logger options');
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		// Add custom morgan tokens if provided.
		if (loggerOptions && typeof loggerOptions.tokens === 'object') {
			for (var key in loggerOptions.tokens) {
				if (hasOwnProperty.call(loggerOptions.tokens, key) && typeof loggerOptions.tokens[key] === 'function') {
					morgan.token(key, loggerOptions.tokens[key]);
				}
			}
		}
		app.use(morgan(keystone.get('logger'), loggerOptions));
	}

	// Bind custom logging middleware if provided.
	if (keystone.get('logging middleware')) {
		app.use(keystone.get('logging middleware'));
	}

	// Bind the Admin UI's dynamic router unless in headless mode.
	if (!keystone.get('headless')) {
		// Execute 'pre:admin' hooks.
		if (typeof keystone.get('pre:admin') === 'function') {
			keystone.get('pre:admin')(app);
		}
		app.use(function (req, res, next) {
			keystone.callHook('pre:admin', req, res, next);
		});
		// Bind the Admin UI router.
		app.use('/' + keystone.get('admin path'), require('../admin/server').createDynamicRouter(keystone));
	}
	// Execute 'pre:bodyparser' hooks.
	if (typeof keystone.get('pre:bodyparser') === 'function') {
		keystone.get('pre:bodyparser')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:bodyparser', req, res, next);
	});
	// Bind body-parser and method-override middleware.
	require('./bindBodyParser')(keystone, app);
	app.use(methodOverride());

	// Set language preferences if the 'language options' are not disabled.
	var languageOptions = keystone.get('language options') || {};
	if (!languageOptions.disable) {
		app.use(language(keystone));
	}

	// Add the 'X-Frame-Options' header for clickjacking protection.
	if (keystone.get('frame guard')) {
		app.use(require('../lib/security/frameGuard')(keystone));
	}

	// Execute 'pre:routes' hooks.
	if (typeof keystone.get('pre:routes') === 'function') {
		keystone.get('pre:routes')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:routes', req, res, next);
	});

	// Configure application routes.
	var appRouter = keystone.get('routes');
	if (typeof appRouter === 'function') {
		if (appRouter.length === 3) {
			// New router pattern:
			// var myRouter = new express.Router();
			// myRouter.get('/', (req, res) => res.send('hello world'));
			// keystone.set('routes', myRouter);
			app.use(appRouter);
		} else {
			// Old router pattern:
			// var initRoutes = function (app) {
			//   app.get('/', (req, res) => res.send('hello world'));
			// }
			// keystone.set('routes', initRoutes);
			appRouter(app);
		}
	}

	// Bind redirects handler.
	require('./bindRedirectsHandler')(keystone, app);

	// Execute 'pre:error' hooks.
	if (typeof keystone.get('pre:error') === 'function') {
		keystone.get('pre:error')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:error', req, res, next);
	});

	// Bind error handlers.
	require('./bindErrorHandlers')(keystone, app);

	return app;
};
