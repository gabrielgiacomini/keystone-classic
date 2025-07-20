/**
 * @fileoverview This file defines the `Text` content type, which is a specific
 * implementation of the base `Type`. It is used to represent and handle plain
 * text content within the KeystoneJS application.
 * @module lib/content/types/text
 */

/**
 * Module dependencies.
 * @private
 */
var util = require('util');
var super_ = require('../type');

/**
 * Text ContentType Constructor.
 * Represents a plain text content type.
 * @constructor
 * @extends {import('../type')}
 * @param {string} path - The path for the text content type.
 * @param {object} options - Configuration options.
 * @api public
 */
function text(path, options) {
	// Invokes the constructor of the superclass (Type).
	text.super_.call(this, path, options);
}

/**
 * Inherit from Type.
 * This sets up the prototype chain, so that `text` inherits from `super_` (Type).
 * @private
 */
util.inherits(text, super_);

/**
 * Export class.
 * @type {import('../type')}
 */
module.exports = text;
