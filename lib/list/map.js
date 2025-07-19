/**
 * @fileoverview This file defines the `map` function, which is used to map a
 * built-in field (e.g., name) to a specific path in the list's mappings.
 */

/**
 * Maps a built-in field (e.g. name) to a specific path.
 *
 * @param {string} field The field to map.
 * @param {string} path The path to map the field to.
 * @return {string} The mapped path.
 */
function map (field, path) {
	if (path) {
		this.mappings[field] = path;
	}
	return this.mappings[field];
}

module.exports = map;
