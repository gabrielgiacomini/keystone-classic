/**
 * @fileoverview This file defines the `getDocumentName` function, which
 * retrieves the name of a document from the correct path, with an option to
 * escape HTML entities.
 */
var utils = require('keystone-utils');

/**
 * Gets the name of the provided document from the correct path.
 *
 * Example:
 *     var name = list.getDocumentName(item)
 *
 * @param {Object} doc The document to get the name from.
 * @param {boolean} [escape=false] Whether to escape HTML entities.
 * @return {string} The name of the document.
 */
function getDocumentName (doc, escape) {
	// Get the name of the document from the nameField if it exists, otherwise from the namePath
	// The name is cast to a string to prevent errors if it is null or undefined
	var name = String(this.nameField ? this.nameField.format(doc) : doc.get(this.namePath));
	// Escape HTML entities if the escape flag is true
	return (escape) ? utils.encodeHTMLEntities(name) : name;
}

module.exports = getDocumentName;
