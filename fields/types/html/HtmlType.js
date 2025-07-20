/**
 * @fileoverview This file defines the HTML field type in KeystoneJS.
 *
 * It is used for storing HTML content and provides a WYSIWYG editor
 * in the Admin UI.
 *
 * @see module:keystone/lib/field
 */

var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * HTML FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {Boolean} [options.wysiwyg=false] Whether to use the WYSIWYG editor.
 * @param {Number} [options.height=180] The height of the editor in pixels.
 */
function html (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.wysiwyg = options.wysiwyg || false;
	this.height = options.height || 180;
	this._properties = ['wysiwyg', 'height'];
	html.super_.call(this, list, path, options);
}
html.properName = 'Html';
util.inherits(html, FieldType);


html.prototype.validateInput = TextType.prototype.validateInput;
html.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
html.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = html;
