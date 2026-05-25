function collectionSize(value) {
	if (value == null) return 0;
	if (typeof value === 'string' || Array.isArray(value)) return value.length;
	if (typeof value.length === 'number') return value.length;
	if (typeof value.size === 'number') return value.size;
	if (typeof value === 'object') return Object.keys(value).length;
	return 0;
}

function asciiWords(value) {
	return String(value ?? '').match(/[A-Za-z0-9]+/g) || [];
}

function camelCase(value) {
	const words = asciiWords(value);
	return words.map((word, index) => {
		const lower = word.toLowerCase();
		return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
	}).join('');
}

function upperFirst(value) {
	const text = String(value ?? '');
	return text.charAt(0).toUpperCase() + text.slice(1);
}


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
		count = collectionSize(count);
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
	return (str[0].toUpperCase() + str.slice(1));
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
	return (str[0].toLowerCase() + str.slice(1));
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
	return parts.filter(Boolean).join(' ');
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
