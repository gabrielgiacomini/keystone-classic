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
	// console.log('getting document name for ' + doc.id, 'nameField: ' + this.nameField, 'namePath: ' + this.namePath);
	// console.log('raw name value: ', doc.get(this.namePath));
	// if (this.nameField) console.log('formatted name value: ', this.nameField.format(doc));
	var name = String(this.nameField ? this.nameField.format(doc) : doc.get(this.namePath));
	return (escape) ? utils.encodeHTMLEntities(name) : name;
}

module.exports = getDocumentName;
