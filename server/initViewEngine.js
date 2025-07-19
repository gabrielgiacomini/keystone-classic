/**
 * @fileoverview Initialises the view engine for the KeystoneJS app.
 *
 * This script configures the Express app to use the specified view engine.
 * It allows for custom view engines and sets the location of view templates.
 *
 * It is invoked by `server/createApp.js`.
 * @see {@link module:server/createApp}
 * @example
 * // In a KeystoneJS startup script
 * keystone.init({
 *   'view engine': 'pug',
 *   'views': 'templates/views'
 * });
 */
module.exports = function initViewEngine (keystone, app) {
	// Allow usage of custom view engines.
	// If a custom engine is specified, it is used to render the views.
	if (keystone.get('custom engine')) {
		app.engine(keystone.get('view engine'), keystone.get('custom engine'));
	}

	// Set the location of view templates.
	// The `views` path is configurable, defaulting to `./views`.
	app.set('views', keystone.getPath('views') || 'views');

	// Set the view engine.
	// This is typically 'jade', 'ejs', or another template engine.
	app.set('view engine', keystone.get('view engine'));

	// Set a custom view class.
	// This allows for advanced view rendering logic.
	var customView = keystone.get('view');
	if (customView) {
		app.set('view', customView);
	}
};
