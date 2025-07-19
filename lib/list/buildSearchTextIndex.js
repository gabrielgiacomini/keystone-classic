/**
 * @fileoverview This file defines the `buildSearchTextIndex` function, which
 * builds a text index definition for the list's search fields.
 */

/**
 * Returns either false if the list has no search fields defined or a structure
 * describing the text index that should exist.
 *
 * @return {Object|boolean}
 */
function buildSearchTextIndex () {
	var idxDef = {};

	// Iterate over the search fields
	for (var i = 0; i < this.searchFields.length; i++) {
		var sf = this.searchFields[i];
		if (!sf.path || !sf.field) continue;

		// TODO: Allow fields to define their own `getTextIndex` method, so that
		// each type can define the right options for their schema. This is unlikely
		// to behave as expected for fields that aren't simple strings or names
		// until that has been done. Should error if the field type doesn't support
		// text indexing, as the list has been misconfigured.

		// Check if the field has nested paths (like 'name')
		if (sf.field.paths) {
			var nFields = sf.field.paths;
			var nKeys = Object.keys(nFields);
			for (var n = 0; n < nKeys.length; n++) {
				idxDef[nFields[nKeys[n]]] = 'text';
			}
		}
		// Otherwise, use the field's path
		else if (sf.field.path) {
			idxDef[sf.field.path] = 'text';
		}
	}

	// Return the index definition if it has any keys, otherwise return false
	// debug('text index for \'' + this.key + '\':', idxDef);
	return Object.keys(idxDef).length > 0 ? idxDef : false;
}

module.exports = buildSearchTextIndex;
