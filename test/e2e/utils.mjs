import _, { camelCase, upperFirst } from 'lodash';


/**
 * Displays the singular or plural of a string based on a number
 * or number of items in an array.
 *
 * If arity is 1, returns the plural form of the word.
 * @param {string} count
 * @param {string} singular string
 * @param {string} plural string
 * @returns {string} singular or plural, * is replaced with count
 * @api public
 */

export const plural = function (count, sn, pl) {
	if (arguments.length === 1) {
		return typeof count === 'string' ? count + 's' : count;
	}
	if (typeof sn !== 'string') sn = '';
	if (!pl) {
		pl = sn + 's';
	}
	if (typeof count === 'string') {
		count = Number(count);
	} else if (typeof count !== 'number') {
		count = _.size(count);
	}
	return (count === 1 ? sn : pl).replace('*', count);
};


/**
 * Converts the first letter in a string to uppercase
 * @param {string} str
 * @returns {string} Str
 * @api public
 */

export const upcase = function (str) {
	if (str && str.toString) str = str.toString();
	if (typeof str !== 'string' || !str.length) return '';
	return (str.substr(0, 1).toUpperCase() + str.substr(1));
};


/**
 * Converts the first letter in a string to lowercase
 * @param {string} Str
 * @returns {string} str
 * @api public
 */

export const downcase = function (str) {
	if (str && str.toString) str = str.toString();
	if (typeof str !== 'string' || !str.length) return '';
	return (str.substr(0, 1).toLowerCase() + str.substr(1));
};


/**
 * Converts a string to title case
 * @param {string} str
 * @returns {string} Title Case form of str
 * @api public
 */

export const titlecase = function (str) {
	if (str && str.toString) str = str.toString();
	if (typeof str !== 'string' || !str.length) return '';
	str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	const parts = str.split(/\s|_|\-/);
	for (let i = 0; i < parts.length; i++) {
		if (parts[i] && !/^[A-Z0-9]+$/.test(parts[i])) {
			parts[i] = upcase(parts[i]);
		}
	}
	return _.compact(parts).join(' ');
};


/**
 * Converts a string to camel case
 * @param {string} str
 * @param {boolean} lowercaseFirstWord
 * @returns {string} camel-case form of str
 * @api public
 */

export const camelcase = function (str, lc) {
	return lc ? camelCase(str) : upperFirst(camelCase(str));
};
