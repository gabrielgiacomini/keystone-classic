/**
 * @fileoverview Binds a middleware to handle URL redirects in KeystoneJS.
 *
 * This script checks for configured redirects and, if any exist, sets up a
 * middleware to handle them. Redirects are defined in the `keystone._redirects`
 * object.
 *
 * It is invoked by `server/createApp.js`.
 * @see {@link module:server/createApp}
 */
module.exports = function bindRedirectsHandler (keystone, app) {
	// If there are any redirects configured, bind the middleware.
	if (Object.keys(keystone._redirects).length) {
		app.use(function (req, res, next) {
			// Check if the request path matches a configured redirect.
			if (keystone._redirects[req.path]) {
				// If it matches, perform the redirect.
				res.redirect(keystone._redirects[req.path]);
			} else {
				// Otherwise, pass control to the next middleware.
				next();
			}
		});
	}
};
