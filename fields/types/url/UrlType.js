/**
 * @fileoverview This file defines the URL field type in KeystoneJS.
 *
 * It inherits from the `Text` field type and is used for storing URLs.
 * The URL field type provides a custom format method to remove the protocol
 * prefix from the URL for display.
 *
 * @see module:keystone/lib/field
 * @see module:keystone/lib/fields/types/text/TextType
 */

var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');


/**
 * URL FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 */
function url (list, path, options) {
	// Set the native type of the field
	this._nativeType = String;
	// Add format to the underscore methods
	this._underscoreMethods = ['format'];
	// Call the super constructor
	url.super_.call(this, list, path, options);
}
url.properName = 'Url';
util.inherits(url, FieldType);


// TODO: is it worth adding URL specific validation logic? it would have to be
// robust so as to not trigger invalid cases on valid input, might be so
// flexible that it's not worth adding.
url.prototype.validateInput = TextType.prototype.validateInput;
url.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
url.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/**
 * Formats the field value using either a supplied format function or default
 * which strips the leading protocol from the value for simpler display.
 *
 * @param {Object} item The item containing the field value.
 * @return {String} The formatted value.
 */
url.prototype.format = function (item) {
	var url = item.get(this.path) || '';
	// If a format function is provided, use it
	if (this.options.format === false) {
		return url;
	// If a format function is provided, use it
	} else if (typeof this.options.format === 'function') {
		return this.options.format(url);
	// Otherwise, remove the protocol prefix
	} else {
		return removeProtocolPrefix(url);
	}
};

/**
 * Remove the protocol prefix from a URL.
 *
 * @param {String} url The URL to process.
 * @return {String} The URL without the protocol prefix.
 */
function removeProtocolPrefix (url) {
	return url.replace(/^[a-zA-Z]+\:\/\//, '');
}

/* Export Field Type */
module.exports = url;
