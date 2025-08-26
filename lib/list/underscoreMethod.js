/**
 * @fileoverview This file defines the `underscoreMethod` function, which adds a
 * method to the underscoreMethods collection on the list. These methods are
 * then added to the schema before the list is registered with Mongoose.
 */

/**
 * Adds a method to the underscoreMethods collection on the list, which is then
 * added to the schema before the list is registered with mongoose.
 *
 * @param {string} path The path to the method.
 * @param {function} fn The function to add.
 * @return {import('./list')} The list instance.
 */
function underscoreMethod (path, fn) {
	var target = this.underscoreMethods;
	path = path.split('.');
	var last = path.pop();
	path.forEach(function (part) {
		if (!target[part]) target[part] = {};
		target = target[part];
	});
	target[last] = fn;
	return this;
}

module.exports = underscoreMethod;
