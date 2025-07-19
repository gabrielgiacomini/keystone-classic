/**
 * @fileoverview This file defines the `wrapHTMLError` function for Keystone,
 * which is used to generate a simple HTML response for displaying errors.
 *
 * This function is a utility for creating a user-friendly error page when a more
 * complex error handling mechanism is not required. It is often used in development
 * or for non-critical errors where a simple message is sufficient.
 */

/**
 * Wraps an error message in a simple HTML structure.
 *
 * This function generates an HTML string containing a title and an error message,
 * styled with a basic error stylesheet from the Keystone admin UI. This provides
 * a consistent look and feel for error pages.
 *
 * @param {string} title - The title of the error page (e.g., 'Error 404').
 * @param {string} [err] - The error message or description to display.
 * @returns {string} An HTML string representing the error page.
 * @api public
 * @example
 * const errorHtml = keystone.wrapHTMLError('Not Found', 'The page you requested could not be found.');
 * res.status(404).send(errorHtml);
 */
function wrapHTMLError (title, err) {
	// Construct the HTML string with the provided title and error message.
	// It includes a link to the admin UI's error stylesheet for basic styling.
	return '<html><head><meta charset=\'utf-8\'><title>Error</title>'
	+ '<link rel=\'stylesheet\' href=\'/' + this.get('admin path') + '/styles/error.css\'>'
	+ '</head><body><div class=\'error\'><h1 class=\'error-title\'>' + title + '</h1>'
	+ '<div class="error-message">' + (err || '') + '</div></div></body></html>';
}

module.exports = wrapHTMLError;
