/**
 * @fileoverview This file serves as an index for all the content types available
 * in the system. It exports the different content type classes, making them
 * accessible from a single point. This simplifies importing content types
 * in other parts of the application.
 */

/**
 * Exports the Text content type.
 * @type {function}
 * @see {@link module:Text}
 */
exports.Text = require('./text');

/**
 * Exports the Html content type.
 * @type {function}
 * @see {@link module:Html}
 */
exports.Html = require('./html');
