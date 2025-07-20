/**
 * @fileoverview This file defines the `set` function, which is used to get and
 * set list options. It is aliased as `.get()`.
 */

/**
 * Gets and Sets list options. Aliased as .get()
 *
 * Example:
 *     list.set('test') // returns the 'test' value
 *     list.set('test', value) // sets the 'test' option to `value`
 *
 * @param {string} key The option key.
 * @param {*} [value] The value to set.
 * @return {*} The value of the option.
 */
function set (key, value) {
	if (arguments.length === 1) {
		return this.options[key];
	}
	this.options[key] = value;
	return value;
}

module.exports = set;
