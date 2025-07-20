/**
 * @fileoverview This file defines the Money field type in KeystoneJS.
 *
 * It is used for storing monetary values and inherits from the `Number` field type.
 * It provides a `format` method to format the value as a currency string.
 *
 * @see module:keystone/lib/field
 * @see module:keystone/lib/fields/types/number/NumberType
 */

var FieldType = require('../Type');
var NumberType = require('../number/NumberType');
var numeral = require('numeral');
var util = require('util');

/**
 * Money FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {String} [options.format='$0,0.00'] The format string to use for formatting the value.
 */
function money (list, path, options) {
	// The currency option has been deprecated. A formatString should be provided instead.
	if (options.currency) {
		throw new Error('The currency option from money has been deprecated. Provide a formatString instead');
	}
	// Set the native type of the field
	this._nativeType = Number;
	// Add format to the underscore methods
	this._underscoreMethods = ['format'];
	// Set the properties of the field
	this._properties = ['currency'];
	// Set the fixed size of the field
	this._fixedSize = 'small';
	// Set the format string
	this._formatString = (options.format === false) ? false : (options.format || '$0,0.00');
	// Ensure the format string is a string
	if (this._formatString && typeof this._formatString !== 'string') {
		throw new Error('FieldType.Money: options.format must be a string.');
	}
	// Call the super constructor
	money.super_.call(this, list, path, options);
}
money.properName = 'Money';
util.inherits(money, FieldType);


// Inherit from NumberType prototype
money.prototype.validateInput = NumberType.prototype.validateInput;
money.prototype.validateRequiredInput = NumberType.prototype.validateRequiredInput;

/* Inherit from NumberType prototype */
money.prototype.updateItem = NumberType.prototype.updateItem;
money.prototype.inputIsValid = NumberType.prototype.inputIsValid;
money.prototype.addFilterToQuery = NumberType.prototype.addFilterToQuery;

/**
 * Formats the field value.
 *
 * @param {Object} item The item to format.
 * @param {String} [format] The format string to use.
 * @return {String} The formatted value.
 */
money.prototype.format = function (item, format) {
	// If a format string is provided, use it
	if (format || this._formatString) {
		return (typeof item.get(this.path) === 'number') ? numeral(item.get(this.path)).format(format || this._formatString) : '';
	// Otherwise, return the raw value
	} else {
		return item.get(this.path) || '';
	}
};

/* Export Field Type */
module.exports = money;
