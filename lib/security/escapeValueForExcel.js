/**
 * @fileoverview This file defines a utility function to escape values that are being exported to a CSV file to prevent macro injection.
 * It prepends a space to values that start with characters that could trigger formula execution in spreadsheet software like Excel.
 * @module lib/security/escapeValueForExcel
 * @see module:lib/list/getCSVData
 * @see module:admin/server/api/download
 */

// This comment explains the rationale for the implementation.
// It prevents macro injection for values included in a CSV by prepending some values with a space.
// Most resources suggest prepending an apostrophe, but Excel has a nasty habit of stripping leading apostrophes out when saving back to CSV files.
// Spaces have the benefits of:
//   - Being maintained by Excel.
//   - Not interfering with number parsing (e.g., " -100" is still automatically formatted as a number, whereas "'-100" is not).
//   - Being easier to deal with if the CSV file is consumed by another tool (i.e., the values can be trimmed before consumption).

/**
 * An array of characters that can trigger formula execution in Excel.
 * @const {string[]}
 */
const formulaTriggers = ['+', '-', '=', '@'];

/**
 * Escapes a value for safe inclusion in a CSV file, preventing Excel macro injection.
 * If the value starts with a character that could trigger a formula in Excel, it prepends a space to it.
 *
 * @param {*} value The value to escape. It will be converted to a string.
 * @returns {string} The escaped value, safe for CSV export.
 */
function escapeValueForExcel (value) {
	// Check if the first character of the string representation of the value is a formula trigger.
	if (formulaTriggers.indexOf(value.toString().slice(0, 1)) > 0) {
		// If it is, prepend a space to prevent it from being executed as a formula.
		return ' ' + value;
	}
	// Otherwise, return the value as is.
	return value;
};

module.exports = escapeValueForExcel;
