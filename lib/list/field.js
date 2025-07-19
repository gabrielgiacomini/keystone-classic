/**
 * @fileoverview This file defines the `field` function, which is used to
 * create a new field at a specified path with the provided options. It handles
 * various field types and options, and registers the field with the list.
 */

/**
 * Creates a new field at the specified path, with the provided options.
 * If no options are provided, it returns the field at the specified path.
 *
 * @param {string} path
 * @param {Object} options
 * @return {Object} The created or existing field.
 */
function field (path, options) {
	// Get the Field constructor from Keystone
	var Field = this.keystone.Field;

	// If only one argument is provided, return the existing field
	if (arguments.length === 1) {
		return this.fields[path];
	}

	// If options is a function, treat it as the type
	if (typeof options === 'function') {
		options = { type: options };
	}

	// If the list is set to noedit, apply it to the field
	if (this.get('noedit')) {
		options.noedit = true;
	}

	// If no note is provided, get it from the list's notes
	if (!options.note && this.get('notes')) {
		options.note = this.get('notes')[path];
	}

	// Ensure that the field type is a function
	if (typeof options.type !== 'function') {
		throw new Error('Fields must be specified with a type function');
	}

	// Convert native field types to their default Keystone counterpart
	if (!(options.type.prototype instanceof Field)) {
		if (options.type === String) {
			options.type = Field.Types.Text;
		} else if (options.type === Number) {
			options.type = Field.Types.Number;
		} else if (options.type === Boolean) {
			options.type = Field.Types.Boolean;
		} else if (options.type === Date) {
			options.type = Field.Types.Datetime;
		} else {
			throw new Error('Unrecognised field constructor: ' + options.type);
		}
	}

	// Note the presence of this field type for client-side script optimisation
	this.fieldTypes[options.type.name] = options.type.properName;

	// Handle Wysiwyg HTML fields as a special case
	if (options.type.name === 'html' && options.wysiwyg) {
		this.fieldTypes.wysiwyg = true;
	}

	// Create a new field instance
	var field = new options.type(this, path, options);

	// Add the field to the list's fields and fieldsArray
	this.fields[path] = field;
	this.fieldsArray.push(field);

	// If the field is a relationship, add it to the relationshipFields array
	if (field.type === 'relationship') {
		this.relationshipFields.push(field);
	}

	// Return the new field
	return field;
}

module.exports = field;
