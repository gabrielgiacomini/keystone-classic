/**
 * @fileoverview This file defines the `getData` function, which retrieves data
 * from a Keystone item, preparing it for serialization for client-side use in
 * React components and the Admin API.
 */
var listToArray = require('list-to-array');

/**
 * Gets the data from an Item ready to be serialised for client-side use, as
 * used by the React components and the Admin API.
 *
 * @param {Object} item The Keystone item to get data from.
 * @param {string|Array} [fields] The fields to include in the returned data.
 * @param {boolean} [expandRelationshipFields=false] Whether to expand relationship fields.
 * @return {Object} The processed data object.
 */
function getData (item, fields, expandRelationshipFields) {
	// Initialize the data object with the item's id and name
	var data = {
		id: item.id,
		name: this.getDocumentName(item),
	};

	// Add the autokey value if it exists
	if (this.autokey) {
		data[this.autokey.path] = item.get(this.autokey.path);
	}

	// Add the sortOrder if the list is sortable
	if (this.options.sortable) {
		data.sortOrder = item.sortOrder;
	}

	// If no fields are specified, get all fields from the list
	if (fields === undefined) {
		fields = Object.keys(this.fields);
	}

	// If fields are specified, process them
	if (fields) {
		// If fields is a string, convert it to an array
		if (typeof fields === 'string') {
			fields = listToArray(fields);
		}

		// Ensure fields is an array
		if (!Array.isArray(fields)) {
			throw new Error('List.getData: fields must be undefined, a string, or an array.');
		}

		// Initialize the fields object in the data
		data.fields = {};

		// Iterate over the fields and add them to the data
		fields.forEach(function (path) {
			var field = this.fields[path];
			if (field) {
				// If the field is a relationship and we want to expand it, get the expanded data
				if (field.type === 'relationship' && expandRelationshipFields) {
					data.fields[path] = field.getExpandedData(item);
				} else {
					// Otherwise, get the field's data
					data.fields[path] = field.getData(item);
				}
			} else {
				// If the path is not a field, get the value directly from the item
				data.fields[path] = item.get(path);
			}
		}, this);
	}

	// Return the processed data
	return data;
}

module.exports = getData;
