/**
 * @fileoverview This file defines the `getOptions` function, which retrieves
 * the options for a Keystone list, formatted for use by React components.
 */
var _ = require('lodash');

/**
 * Gets the options for the List, as used by the React components.
 *
 * @return {Object} The list options.
 */
function getOptions () {
	// Initialize the options object with list properties
	var ops = {
		autocreate: this.options.autocreate,
		autokey: this.autokey,
		defaultColumns: this.options.defaultColumns,
		defaultSort: this.options.defaultSort,
		fields: {},
		hidden: this.options.hidden,
		initialFields: _.map(this.initialFields, 'path'),
		key: this.key,
		label: this.label,
		nameField: this.nameField ? this.nameField.getOptions() : null,
		nameFieldIsFormHeader: this.nameFieldIsFormHeader,
		nameIsInitial: this.nameIsInitial,
		nameIsVirtual: this.nameIsVirtual,
		namePath: this.namePath,
		nocreate: this.options.nocreate,
		nodelete: this.options.nodelete,
		noedit: this.options.noedit,
		path: this.path,
		perPage: this.options.perPage,
		plural: this.plural,
		searchFields: this.options.searchFields,
		singular: this.singular,
		sortable: this.options.sortable,
		sortContext: this.options.sortContext,
		track: this.options.track,
		tracking: this.tracking,
		relationships: this.relationships,
		uiElements: [],
	};

	// Process UI elements
	_.forEach(this.uiElements, function (el) {
		switch (el.type) {
			// TODO: handle indentation
			case 'field':
				// Add the field options by path
				ops.fields[el.field.path] = el.field.getOptions();
				// Don't output hidden fields
				if (el.field.hidden) {
					return;
				}
				// Add the field to the elements array
				ops.uiElements.push({
					type: 'field',
					field: el.field.path,
				});
				break;
			case 'heading':
				// Add heading elements
				ops.uiElements.push({
					type: 'heading',
					content: el.heading,
					options: el.options,
				});
				break;
		}
	});

	// Return the processed options
	return ops;
}

module.exports = getOptions;
