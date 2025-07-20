/**
 * @fileoverview This file defines the `wrapHTMLError` method for the Keystone instance.
 * It is used to wrap an error in a simple HTML response for the browser.
 * @module lib/core/wrapHTMLError
 */

/**
 * Wraps an error in simple HTML to be sent as a response to the browser.
 *
 * @param {string} title The title of the error page.
 * @param {string|Error} err The error message or Error object to display.
 * @returns {string} The HTML error page.
 * @api public
 */
function wrapHTMLError (title, err) {
	return '<html><head><meta charset=\'utf-8\'><title>Error</title>'
	+ '<link rel=\'stylesheet\' href=\'/' + this.get('admin path') + '/styles/error.css\'>'
	+ '</head><body><div class=\'error\'><h1 class=\'error-title\'>' + title + '</h1>'
	+ '<div class="error-message">' + (err || '') + '</div></div></body></html>';
}

module.exports = wrapHTMLError;
