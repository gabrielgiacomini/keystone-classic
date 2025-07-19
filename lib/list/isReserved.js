/**
 * @fileoverview This file defines the `isReserved` function, which checks
 * whether a given path is a reserved path. Reserved paths include
 * `Object.prototype` method keys and internal mongo paths.
 */

/**
 * Check whether or not a `path` is a reserved path. This restricts the use
 * of `Object.prototype` method keys as well as internal mongo paths.
 *
 * @param {string} path The path to check.
 * @return {boolean} `true` if the path is reserved, otherwise `false`.
 */
var reservedPaths = [
	'_',
	'__defineGetter__',
	'__defineSetter__',
	'__lookupGetter__',
	'__lookupSetter__',
	'__proto__',
	'_id',
	'hasOwnProperty',
	'id',
	'isPrototypeOf',
	'list',
	'propertyIsEnumerable',
	'prototype',
	'toLocaleString',
	'toString',
	'valueOf',
];

/**
 * Checks if the given path is in the reservedPaths array.
 *
 * @param {string} path The path to check.
 * @return {boolean} `true` if the path is reserved, otherwise `false`.
 */
function isReserved (path) {
	// Check if the path is in the reservedPaths array
	return reservedPaths.indexOf(path) >= 0;
}

module.exports = isReserved;
