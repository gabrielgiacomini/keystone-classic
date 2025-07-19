/**
 * @fileoverview Defines the `Path` class, a utility for working with nested
 * object paths. This class provides methods for getting and setting values
 * in nested objects using a dot-separated path string.
 *
 * It is used throughout Keystone to safely access and manipulate properties
 * in complex configuration and data objects.
 *
 * @module lib/path
 * @requires keystone-utils
 * @see module:lib/list
 */
var utils = require('keystone-utils');

/**
 * Path constructor.
 *
 * @param {string} str - The dot-separated path string.
 * @constructor
 */
module.exports = function Path (str) {

	if (!(this instanceof Path)) {
		return new Path(str);
	}

	var parts = this.parts = str.split('.');
	var last = this.parts[this.parts.length - 1];
	/**
	 * Adds a value to an object at the specified path.
	 *
	 * @param {Object} obj - The object to add the value to.
	 * @param {*} val - The value to add.
	 * @returns {Object} The modified object.
	 * @api public
	 */
	this.addTo = function (obj, val) {
		var o = obj;
		for (var i = 0; i < parts.length - 1; i++) {
			if (!utils.isObject(o[parts[i]])) {
				o[parts[i]] = {};
			}
			o = o[parts[i]];
		}
		o[last] = val;
		return obj;
	};
	/**
	 * Gets a value from an object at the specified path.
	 *
	 * @param {Object} obj - The object to get the value from.
	 * @param {string} [subpath] - An optional subpath to append to the main path.
	 * @returns {*} The value at the specified path, or `undefined` if not found.
	 * @api public
	 */
	this.get = function (obj, subpath) {
		if (typeof obj !== 'object') throw new TypeError('Path.get: obj argument must be an Object');
		var i;
		if (subpath) {
			var nested = subpath.charAt(0) === '.';
			var flatPath = str + subpath;
			if (flatPath in obj) {
				return obj[flatPath];
			}
			for (i = 0; i < parts.length - (nested ? 0 : 1); i++) {
				if (typeof obj !== 'object') return undefined;
				obj = obj[parts[i]];
			}
			if (nested) {
				subpath = subpath.substr(1);
			} else {
				subpath = last + subpath;
			}
			return (typeof obj === 'object') ? obj[subpath] : undefined;
		} else if (str in obj) {
			return obj[str];
		} else {
			for (i = 0; i < parts.length; i++) {
				if (typeof obj !== 'object') return undefined;
				obj = obj[parts[i]];
			}
			return obj;
		}
	};

	return this;

};
