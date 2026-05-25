/**
 * A few helper methods for strings
 */

function collectionSize(value) {
	if (!value) return 0;
	if (typeof value.length === 'number') return value.length;
	return Object.keys(value).length;
}

function compact(values) {
	return values.filter(Boolean);
}

function asciiWords(value) {
	return String(value)
		.replace(/['\u2019]/g, '')
		.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g) || [];
}

function localCamelCase(value) {
	const words = asciiWords(value).map(word => word.toLowerCase());
	return words.map((word, index) => {
		return index === 0 ? word : upcase(word);
	}).join('');
}

/**
 * Displays the singular or plural of a string based on a number
 * or number of items in an array.
 * If arity is 1, returns the plural form of the word.
 * @param {string|number|Array} count    The count, or a value to pluralize if called with one argument
 * @param {string} singular              The singular form of the word
 * @param {string} plural                The plural form of the word (defaults to inflected singular)
 * @returns {string} The singular or plural form; "*" in the string is replaced with count
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
		count = collectionSize(count);
	}
	return (count === 1 ? sn : pl).replace('*', count);
};


/**
 * Converts the first letter in a string to uppercase
 * @param {string} str The input string
 * @returns {string} The string with its first character uppercased
 */

export const upcase = function (str) {
	if (str && str.toString) str = str.toString();
	if (typeof str !== 'string' || !str.length) return '';
	return (str.slice(0, 1).toUpperCase() + str.slice(1));
};


/**
 * Converts the first letter in a string to lowercase
 * @param {string} str The input string
 * @returns {string} The string with its first character lowercased
 */

export const downcase = function (str) {
	if (str && str.toString) str = str.toString();
	if (typeof str !== 'string' || !str.length) return '';
	return (str.slice(0, 1).toLowerCase() + str.slice(1));
};


/**
 * Converts a string to title case
 * @param {string} str The input string
 * @returns {string} The title-case form of str
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
	return compact(parts).join(' ');
};


/**
 * Converts a string to camel case
 * @param {string}  str                The input string
 * @param {boolean} lowercaseFirstWord Whether to lowercase the first word
 * @returns {string} The camel-case form of str
 */

export const camelcase = function (str, lc) {
	const value = localCamelCase(str);
	return lc ? value : upcase(value);
};
