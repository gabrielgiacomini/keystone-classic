/**
 * @fileoverview This file defines the `relationship` function, which is used
 * to register relationships to a Keystone list that are defined on other lists.
 */
var utils = require('keystone-utils');

/**
 * Registers relationships to this list defined on others.
 *
 * @param {Object|string} def The relationship definition.
 * @return {List} The list instance for chaining.
 */
function relationship (def) {
	var keystone = this.keystone;

	// If more than one argument is passed, recursively call the function
	if (arguments.length > 1) {
		for (var i = 0; i < arguments.length; i++) {
			this.relationship(arguments[i]);
		}
		return this;
	}

	// If the definition is a string, convert it to an object
	if (typeof def === 'string') {
		def = { ref: def };
	}

	// Ensure that the relationship has a ref
	if (!def.ref) {
		throw new Error('List Relationships must be specified with an object containing ref (' + this.key + ')');
	}

	// Default the refPath to the downcased key of the list
	if (!def.refPath) {
		def.refPath = utils.downcase(this.key);
	}

	// Default the path to the key of the ref
	if (!def.path) {
		def.path = utils.keyToProperty(def.ref, true);
	}

	// Add a getter for the refList
	Object.defineProperty(def, 'refList', {
		get: function () {
			return keystone.list(def.ref);
		},
	});

	// Add a getter for the isValid property
	Object.defineProperty(def, 'isValid', {
		get: function () {
			return keystone.list(def.ref) ? true : false;
		},
	});

	// Add the relationship to the list's relationships
	this.relationships[def.path] = def;

	// Return the list instance for chaining
	return this;
}

module.exports = relationship;
