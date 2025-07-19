/**
 * @fileoverview This file defines the `automap` function, which automatically
 * maps a field path to itself if it is currently unmapped.
 */

/**
 * Checks to see if a field path matches a currently unmapped path, and
 * if so, adds a mapping for it.
 *
 * @param {Object} field The field to automap.
 * @return {List} The list instance for chaining.
 */
function automap (field) {
	if ((field.path in this.mappings) && !this.mappings[field.path]) {
		this.map(field.path, field.path);
	}
	return this;
}

module.exports = automap;
