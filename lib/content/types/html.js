/**
 * @fileoverview This file defines the `Html` content type, a specific implementation
 * of the base `Type`. It is designed to handle HTML content within the
 * KeystoneJS application, providing a structure for managing rich text.
 * @module lib/content/types/html
 */

/**
 * Module dependencies.
 * @private
 */
var util = require('util');
var super_ = require('../type');

/**
 * HTML ContentType Constructor.
 * Represents an HTML content type, extending the base Type.
 * @constructor
 * @extends {import('../type')}
 * @param {string} path - The path for the HTML content type.
 * @param {object} options - Configuration options for this content type.
 * @api public
 */
function html(path, options) {
	// Calls the constructor of the superclass (Type) to ensure proper initialization.
	html.super_.call(this, path, options);
}

/**
 * Inherit from Type.
 * This sets up the prototype chain, making `html` a subclass of `super_` (Type).
 * @private
 */
util.inherits(html, super_);

/**
 * Export class.
 * @type {import('../type')}
 */
module.exports = html;
