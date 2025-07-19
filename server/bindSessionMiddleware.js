/**
 * @fileoverview Binds session-related middleware to the KeystoneJS app.
 *
 * This script configures and binds middleware for session management, including
 * cookie parsing, session persistence, and flash messages. It is a key part
 * of the authentication and user management system.
 *
 * It is invoked by `server/createApp.js`.
 * @see {@link module:server/createApp}
 */
module.exports = function bindSessionMiddleware (keystone, app) {
	// Bind the cookie parser middleware.
	app.use(keystone.get('session options').cookieParser);

	// Execute 'pre:session' hooks.
	if (typeof keystone.get('pre:session') === 'function') {
		keystone.get('pre:session')(app);
	}
	app.use(function (req, res, next) {
		keystone.callHook('pre:session', req, res, next);
	});

	// Bind the express-session middleware.
	app.use(keystone.expressSession);

	// Bind the connect-flash middleware for flash messages.
	app.use(require('connect-flash')());

	// Bind session persistence middleware if 'session' is enabled.
	if (keystone.get('session') === true) {
		app.use(keystone.session.persist);
	} else if (typeof keystone.get('session') === 'function') {
		// Bind a custom session middleware if provided.
		app.use(keystone.get('session'));
	}
};
