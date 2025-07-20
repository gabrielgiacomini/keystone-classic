/**
 * @fileoverview This file defines the Password field type in KeystoneJS.
 *
 * It provides functionality for hashing and comparing passwords using bcrypt,
 * as well as validating password complexity and common passwords.
 *
 * @see module:keystone/lib/field
 */

var _ = require('lodash');
var bcrypt = require('bcrypt-nodejs');
var FieldType = require('../Type');
var util = require('util');
var utils = require('keystone-utils');
var dumbPasswords = require('dumb-passwords');


var regexChunk = {
	digitChar: /\d/,
	spChar: /[!@#\$%\^&\*()\+]/,
	asciiChar: /^[\u0020-\u007E]+$/,
	lowChar: /[a-z]/,
	upperChar: /[A-Z]/,
};
var detailMsg = {
	digitChar: 'enter at least one digit',
	spChar: 'enter at least one special character',
	asciiChar: 'only ASCII characters are allowed',
	lowChar: 'use at least one lower case character',
	upperChar: 'use at least one upper case character',
};
const defaultOptions = { min: 8, max: 72, workFactor: 10, rejectCommon: true };

/**
 * Password FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {Number} [options.min=8] The minimum password length.
 * @param {Number} [options.max=72] The maximum password length.
 * @param {Number} [options.workFactor=10] The bcrypt work factor.
 * @param {Boolean} [options.rejectCommon=true] Whether to reject common passwords.
 * @param {Object} [options.complexity] Password complexity rules.
 * @param {Boolean} [options.complexity.digitChar] Require at least one digit.
 * @param {Boolean} [options.complexity.spChar] Require at least one special character.
 * @param {Boolean} [options.complexity.asciiChar] Require only ASCII characters.
 * @param {Boolean} [options.complexity.lowChar] Require at least one lowercase character.
 * @param {Boolean} [options.complexity.upperChar] Require at least one uppercase character.
 */
function password (list, path, options) {
	// Apply default and enforced options (you can't sort on password fields)
	options = Object.assign({}, defaultOptions, options, { nosort: false });

	this._nativeType = String;
	this._underscoreMethods = ['format', 'compare'];
	this._fixedSize = 'full';

	password.super_.call(this, list, path, options);

	// Validate complexity options
	for (var key in this.options.complexity) {
		if ({}.hasOwnProperty.call(this.options.complexity, key)) {
			if (key in regexChunk !== key in this.options.complexity) {
				throw new Error('FieldType.Password: options.complexity - option does not exist.');
			}
			if (typeof this.options.complexity[key] !== 'boolean') {
				throw new Error('FieldType.Password: options.complexity - Value must be boolean.');
			}
		}
	}
	// Validate min/max options
	if (this.options.max && this.options.max < this.options.min) {
		throw new Error('FieldType.Password: options - maximum password length cannot be less than the minimum length.');
	}
}
password.properName = 'Password';
util.inherits(password, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds a path for the hashed password and a pre-save hook to hash the
 * password before saving.
 *
 * @api public
 */
password.prototype.addToSchema = function (schema) {
	var field = this;
	var needs_hashing = '__' + field.path + '_needs_hashing';

	// The path for the confirmation password
	this.paths = {
		confirm: this.options.confirmPath || this.path + '_confirm',
		hash: this.options.hashPath || this.path + '_hash',
	};

	// Add the password path to the schema
	schema.path(this.path, _.defaults({
		type: String,
		set: function (newValue) {
			// Mark the password as needing hashing
			this[needs_hashing] = true;
			return newValue;
		},
	}, this.options));

	// Add a virtual for the hashed password
	schema.virtual(this.paths.hash).set(function (newValue) {
		this.set(field.path, newValue);
		// Mark the password as not needing hashing
		this[needs_hashing] = false;
	});

	// Add a pre-save hook to hash the password
	schema.pre('save', function (next) {
		// If the password hasn't been modified or doesn't need hashing, skip
		if (!this.isModified(field.path) || !this[needs_hashing]) {
			return next();
		}
		// If the password is blank, clear the value and skip
		if (!this.get(field.path)) {
			this.set(field.path, undefined);
			this[needs_hashing] = false;
			return next();
		}
		var item = this;
		// Generate a salt and hash the password
		bcrypt.genSalt(field.options.workFactor, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(item.get(field.path), salt, function () {}, function (err, hash) {
				if (err) {
					return next(err);
				}
				// override the cleartext password with the hashed one
				item.set(field.path, hash);
				// reset [needs_hashing] so that new values can't be hashed more than once
				// (inherited models double up on pre save handlers for password fields)
				item[needs_hashing] = false;
				next();
			});
		});
	});
	this.bindUnderscoreMethods();
};

/**
 * Add filters to a query.
 *
 * @param {Object} filter The filter to apply.
 * @param {Boolean} filter.exists If true, filters for documents where the password is set.
 * @return {Object} The query object.
 */
password.prototype.addFilterToQuery = function (filter) {
	var query = {};
	query[this.path] = (filter.exists) ? { $ne: null } : null;
	return query;
};

/**
 * Retrieves the field value.
 *
 * Password fields values are returned as booleans to indicate whether a value
 * has been set or not, so that we don't leak hashed passwords via API.
 *
 * @api public
 * @param {Object} item The item to get the value from.
 * @return {Boolean} True if a password is set, false otherwise.
 */
password.prototype.getData = function (item) {
	return item.get(this.path) ? true : false;
};

/**
 * Formats the field value.
 *
 * Password fields are always formatted as a random no. of asterisks,
 * because the saved hash should never be displayed nor the length
 * of the actual password hinted at.
 *
 * @api public
 * @param {Object} item The item to format.
 * @return {String} A string of asterisks.
 */
password.prototype.format = function (item) {
	if (!item.get(this.path)) return '';
	var len = Math.round(Math.random() * 4) + 6;
	var stars = '';
	for (var i = 0; i < len; i++) stars += '*';
	return stars;
};

/**
 * Compares a candidate password with the hashed password.
 *
 * @api public
 * @param {Object} item The item to compare the password for.
 * @param {String} candidate The candidate password.
 * @param {Function} callback The callback function.
 */
password.prototype.compare = function (item, candidate, callback) {
	if (typeof callback !== 'function') throw new Error('Password.compare() requires a callback function.');
	var value = item.get(this.path);
	if (!value) return callback(null, false);
	bcrypt.compare(candidate, item.get(this.path), callback);
};

/**
 * Asynchronously confirms that the provided password is valid.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
password.prototype.validateInput = function (data, callback) {
	var { min, max, complexity, rejectCommon } = this.options;
	var confirmValue = this.getValueFromData(data, '_confirm');
	var passwordValue = this.getValueFromData(data);

	var validation = validate(passwordValue, confirmValue, min, max, complexity, rejectCommon);

	utils.defer(callback, validation.result, validation.detail);
};

/**
 * Validates a password against the defined rules.
 *
 * @param {String} pass The password to validate.
 * @param {String} confirm The confirmation password.
 * @param {Number} min The minimum password length.
 * @param {Number} max The maximum password length.
 * @param {Object} complexity The complexity rules.
 * @param {Boolean} rejectCommon Whether to reject common passwords.
 * @return {Object} The validation result.
 */
var validate = password.validate = function (pass, confirm, min, max, complexity, rejectCommon) {
	var messages = [];

	// Check if passwords match
	if (confirm !== undefined
		&& pass !== confirm) {
		messages.push('Passwords must match.');
	}

	// Check min length
	if (min && typeof pass === 'string' && pass.length < min) {
		messages.push('Password must be longer than ' + min + ' characters.');
	}

	// Check max length
	if (max && typeof pass === 'string' && pass.length > max) {
		messages.push('Password must not be longer than ' + max + ' characters.');
	}

	// Check complexity rules
	for (var prop in complexity) {
		if (complexity[prop] && typeof pass === 'string') {
			var complexityCheck = (regexChunk[prop]).test(pass);
			if (!complexityCheck) {
				messages.push(detailMsg[prop]);
			}
		}
	}

	// Check for common passwords
	if (pass && typeof pass === 'string' && rejectCommon && dumbPasswords.check(pass)) {
		messages.push('Password must not be a common, frequently-used password.');
	}

	// Return the validation result
	return {
		result: messages.length === 0,
		detail: messages.join(' \n'),
	};
};

/**
 * Asynchronously confirms that a password is present if required.
 *
 * @param {Object} item The item to validate.
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
password.prototype.validateRequiredInput = function (item, data, callback) {
	var hashValue = this.getValueFromData(data, '_hash');
	var passwordValue = this.getValueFromData(data);
	var result = hashValue || passwordValue ? true : false;
	if (!result && passwordValue === undefined && hashValue === undefined && item.get(this.path)) result = true;
	utils.defer(callback, result);
};

/**
 * If password fields are required, check that either a value has been
 * provided or already exists in the field.
 *
 * Otherwise, input is always considered valid, as providing an empty
 * value will not change the password.
 *
 * @deprecated
 * @param {Object} data The data to validate.
 * @param {Boolean} required Whether the field is required.
 * @param {Object} item The item to validate.
 * @return {Boolean} True if the input is valid, false otherwise.
 */
password.prototype.inputIsValid = function (data, required, item) {
	// If a password and confirmation are provided, they must match
	if (data[this.path] && this.paths.confirm in data) {
		return data[this.path] === data[this.paths.confirm] ? true : false;
	}
	// If a password or hash is provided, or if the item already has a password, it's valid
	if (data[this.path] || data[this.paths.hash] || (item && item.get(this.path))) return true;
	// If the field is required, it's invalid
	return required ? false : true;
};

/**
 * Updates the value for this field in the item from a data object.
 *
 * Will accept either the field path, or paths.hash to bypass bcrypt.
 *
 * @api public
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function.
 */
password.prototype.updateItem = function (item, data, callback) {
	var hashValue = this.getValueFromData(data, '_hash');
	var passwordValue = this.getValueFromData(data);
	// If a password value is provided, set it
	if (passwordValue !== undefined) {
		item.set(this.path, passwordValue);
	// If a hash value is provided, set it
	} else if (hashValue !== undefined) {
		item.set(this.paths.hash, hashValue);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = password;
