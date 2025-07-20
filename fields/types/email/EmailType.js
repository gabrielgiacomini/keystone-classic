/**
 * @fileoverview This file defines the Email field type in KeystoneJS.
 *
 * It inherits from the `Text` field type and is used for storing and validating
 * email addresses. It also provides a method for generating Gravatar URLs.
 *
 * @see module:keystone/lib/field
 * @see module:keystone/lib/fields/types/text/TextType
 */

var crypto = require('crypto');
var FieldType = require('../Type');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Email FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 */
function email (list, path, options) {
	// Set the native type of the field
	this._nativeType = String;
	// Add gravatarUrl to the underscore methods
	this._underscoreMethods = ['gravatarUrl'];
	// Set the type description
	this.typeDescription = 'email address';
	// Call the super constructor
	email.super_.call(this, list, path, options);
}
email.properName = 'Email';
util.inherits(email, FieldType);

/* Inherit from TextType prototype */
email.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/**
 * Generate a gravatar image request url.
 *
 * @param {Object} item The item containing the email address.
 * @param {Number} [size=80] The size of the gravatar image.
 * @param {String} [defaultImage='identicon'] The default image to use if the user does not have a gravatar.
 * @param {String} [rating='g'] The rating of the gravatar image.
 * @return {String} The gravatar URL.
 */
email.prototype.gravatarUrl = function (item, size, defaultImage, rating) {
	var value = item.get(this.path);
	if (typeof value !== 'string') {
		return '';
	}
	return [
		// base url protocol-less for both http/https
		'//www.gravatar.com/avatar/',
		// md5 hash the trimmed lowercase email
		crypto.createHash('md5').update(value.toLowerCase().trim()).digest('hex'),
		// size of images ranging from 1 to 2048 pixels, square
		'?s=' + (/^(?:[1-9][0-9]{0,2}|1[0-9]{3}|20[0-3][0-9]|204[0-8])$/.test(size) ? size : 80),
		// default image url encoded href or one of the built in options: 404, mm, identicon, monsterid, wavatar, retro, blank
		'&d=' + (defaultImage ? encodeURIComponent(defaultImage) : 'identicon'),
		// rating, g, pg, r or x
		'&r=' + (/^(?:g|pg|r|x)$/i.test(rating) ? rating.toLowerCase() : 'g'),
	].join('');
};

/**
 * Asynchronously confirms that the provided email is valid.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function to call with the validation result.
 */
email.prototype.validateInput = function (data, callback) {
	var input = this.getValueFromData(data);
	var result = true;
	// If there is an input, check if it is a valid email
	if (input) {
		result = utils.isEmail(input);
	}
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that required input is present.
 */
email.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/**
 * Validates that a valid email has been provided in a data object.
 *
 * @deprecated
 * @param {Object} data The data to validate.
 * @param {Boolean} required Whether the field is required.
 * @param {Object} item The item being validated.
 * @return {Boolean} True if the input is valid, false otherwise.
 */
email.prototype.inputIsValid = function (data, required, item) {
	var value = this.getValueFromData(data);
	// If there is a value, check if it is a valid email
	if (value) {
		return utils.isEmail(value);
	} else {
		// If there is no value, it is valid if not required or if the item has a value
		return (!required || (item && item.get(this.path))) ? true : false;
	}
};

/**
 * Updates the value for this field in the item from a data object.
 * Ensures that the email address is lowercase.
 *
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function to call when done.
 */
email.prototype.updateItem = function (item, data, callback) {
	var newValue = this.getValueFromData(data);
	// If the new value is a string, convert it to lowercase
	if (typeof newValue === 'string') {
		newValue = newValue.toLowerCase();
	}
	// If the new value is different from the old value, update it
	if (newValue !== undefined && newValue !== item.get(this.path)) {
		item.set(this.path, newValue);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = email;
