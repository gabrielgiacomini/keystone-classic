/**
 * @fileoverview This file defines the Color field type in KeystoneJS.
 *
 * It is used for storing hex color values and provides a color picker in the
 * Admin UI. It inherits from the `Text` field type.
 *
 * @see module:keystone/lib/field
 * @see module:keystone/lib/fields/types/text/TextType
 */

var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * Color FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 */
function color (list, path, options) {
	// Set the native type of the field
	this._nativeType = String;
	// Call the super constructor
	color.super_.call(this, list, path, options);
}
color.properName = 'Color';
util.inherits(color, FieldType);

// Inherit from TextType prototype
color.prototype.validateInput = TextType.prototype.validateInput;
color.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
color.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = color;
