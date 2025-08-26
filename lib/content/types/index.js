/**
 * @fileoverview This file serves as an index for all the content types available
 * in the system. It exports the different content type classes, making them
 * accessible from a single point. This simplifies importing content types
 * in other parts of the application.
 * @module lib/content/types/index
 */

/**
 * Exports the Text content type.
 * @type {import('../type')}
 * @see module:lib/content/types/text
 */
exports.Text = require('./text');

/**
 * Exports the Html content type.
 * @type {import('../type')}
 * @see module:lib/content/types/html
 */
exports.Html = require('./html');
