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
 * @return {Object} The list instance.
 */
function underscoreMethod (path, fn) {
	// Get the target object for the methods
	var target = this.underscoreMethods;
	// Split the path into parts
	path = path.split('.');
	// Get the last part of the path
	var last = path.pop();
	// Traverse the path to the target object
	path.forEach(function (part) {
		if (!target[part]) target[part] = {};
		target = target[part];
	});
	// Add the method to the target object
	target[last] = fn;
	// Return the list instance for chaining
	return this;
}

module.exports = underscoreMethod;
