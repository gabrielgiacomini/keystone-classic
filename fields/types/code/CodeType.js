/**
 * @fileoverview This file defines the Code field type in KeystoneJS.
 *
 * It is used for storing code snippets and provides a CodeMirror editor
 * in the Admin UI.
 *
 * @see module:keystone/lib/field
 * @see module:keystone/lib/fields/types/text/TextType
 */

var assign = require('object-assign');
var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * Code FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {Number} [options.height=180] The height of the editor in pixels.
 * @param {String} [options.lang] The language of the code.
 * @param {Object} [options.codemirror] Options to pass to the CodeMirror editor.
 */
function code (list, path, options) {
	// Set the native type of the field
	this._nativeType = String;
	// Set the default size of the field
	this._defaultSize = 'full';
	// Set the height of the editor
	this.height = options.height || 180;
	// Set the language of the code
	this.lang = options.lang || options.language;
	// Expose editor, height, and lang properties
	this._properties = ['editor', 'height', 'lang'];
	// Set the CodeMirror options
	this.codemirror = options.codemirror || {};
	// Merge the language into the CodeMirror options
	this.editor = assign({ mode: this.lang }, this.codemirror);
	// Call the super constructor
	code.super_.call(this, list, path, options);
}
code.properName = 'Code';
util.inherits(code, FieldType);


// Inherit from TextType prototype
code.prototype.validateInput = TextType.prototype.validateInput;
code.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
code.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = code;
