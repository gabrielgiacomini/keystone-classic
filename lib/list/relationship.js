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
	if (arguments.length > 1) {
		for (var i = 0; i < arguments.length; i++) {
			this.relationship(arguments[i]);
		}
		return this;
	}
	if (typeof def === 'string') {
		def = { ref: def };
	}
	if (!def.ref) {
		throw new Error('List Relationships must be specified with an object containing ref (' + this.key + ')');
	}
	if (!def.refPath) {
		def.refPath = utils.downcase(this.key);
	}
	if (!def.path) {
		def.path = utils.keyToProperty(def.ref, true);
	}
	Object.defineProperty(def, 'refList', {
		get: function () {
			return keystone.list(def.ref);
		},
	});
	Object.defineProperty(def, 'isValid', {
		get: function () {
			return keystone.list(def.ref) ? true : false;
		},
	});
	this.relationships[def.path] = def;
	return this;
}

module.exports = relationship;
