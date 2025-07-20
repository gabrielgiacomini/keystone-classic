/**
 * @fileoverview This file defines the Textarea field type in KeystoneJS.
 *
 * It inherits from the `Text` field type and is used for multi-line text input.
 * The Textarea field supports formatting and cropping.
 *
 * @see module:keystone/lib/field
 * @see module:keystone/lib/fields/types/text/TextType
 */

var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Textarea FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {Number} [options.height=90] The height of the textarea in pixels.
 */
function textarea (list, path, options) {
	// Set the native type of the field
	this._nativeType = String;
	// Add format and crop to the underscore methods
	this._underscoreMethods = ['format', 'crop'];
	// Set the height of the textarea
	this.height = options.height || 90;
	// This is a multiline field
	this.multiline = true;
	// Expose height and multiline properties
	this._properties = ['height', 'multiline'];
	// Call the super constructor
	textarea.super_.call(this, list, path, options);
}
textarea.properName = 'Textarea';
util.inherits(textarea, FieldType);


// Inherit from TextType prototype
textarea.prototype.validateInput = TextType.prototype.validateInput;
textarea.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
textarea.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
textarea.prototype.crop = TextType.prototype.crop;

/**
 * Formats the field value.
 *
 * Converts newlines to HTML `<br>` tags.
 *
 * @api public
 * @param {Object} item The item containing the field value.
 * @return {String} The formatted value.
 */
textarea.prototype.format = function (item) {
	return utils.textToHTML(item.get(this.path));
};

/* Export Field Type */
module.exports = textarea;
