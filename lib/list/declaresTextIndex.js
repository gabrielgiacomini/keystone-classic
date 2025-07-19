/**
 * @fileoverview This file defines the `declaresTextIndex` function, which
 * checks if a text index is defined in the current list schema.
 */

/**
 * Looks for a text index defined in the current list schema and returns a
 * boolean. Note that this does not check for text indexes that exist in the DB.
 *
 * @return {boolean} `true` if a text index is declared, otherwise `false`.
 */
function declaresTextIndex () {
	var indexes = this.schema.indexes();

	for (var i = 0; i < indexes.length; i++) {
		var fields = indexes[i][0];
		var fieldNames = Object.keys(fields);

		for (var h = 0; h < fieldNames.length; h++) {
			var val = fields[fieldNames[h]];
			if (typeof val === 'string' && val.toLowerCase() === 'text') return true;
		}
	}
	return false;
}

module.exports = declaresTextIndex;
