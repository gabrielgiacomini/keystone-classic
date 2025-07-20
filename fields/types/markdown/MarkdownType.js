/**
 * @fileoverview This file defines the Markdown field type in KeystoneJS.
 *
 * It is used for storing markdown content and provides a WYSIWYG editor
 * in the Admin UI.
 *
 * @see module:keystone/lib/field
 */

var FieldType = require('../Type');
var marked = require('marked');
var sanitizeHtml = require('sanitize-html');
var TextType = require('../text/TextType');
var util = require('util');
var utils = require('keystone-utils');

/**
 * Markdown FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {Object} [options.toolbarOptions] Options for the toolbar.
 * @param {Object} [options.markedOptions] Options for the marked library.
 * @param {Object} [options.sanitizeOptions] Options for the sanitize-html library.
 * @param {Number} [options.height=90] The height of the editor in pixels.
 * @param {Boolean} [options.wysiwyg=true] Whether to use the WYSIWYG editor.
 */
function markdown (list, path, options) {
	this._defaultSize = 'full';

	this.toolbarOptions = options.toolbarOptions || {};
	this.markedOptions = options.markedOptions || {};

	// See sanitize-html docs for defaults
	// .. https://www.npmjs.com/package/sanitize-html#what-are-the-default-options
	this.sanitizeOptions = options.sanitizeOptions || {};

	this.height = options.height || 90;
	this.wysiwyg = ('wysiwyg' in options) ? options.wysiwyg : true;

	this._properties = ['wysiwyg', 'height', 'toolbarOptions'];
	markdown.super_.call(this, list, path, options);
}
markdown.properName = 'Markdown';
util.inherits(markdown, FieldType);


markdown.prototype.validateInput = TextType.prototype.validateInput;
markdown.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * Adds String properties for `.md` and `.html` markdown, and a setter for `.md`
 * that generates html when it is updated.
 *
 * @param {Object} schema The Mongoose schema to add the field to.
 */
markdown.prototype.addToSchema = function (schema) {

	var paths = this.paths = {
		md: this.path + '.md',
		html: this.path + '.html',
	};

	var markedOptions = this.markedOptions;
	var sanitizeOptions = this.sanitizeOptions;

	var setMarkdown = function (value) {
		// Clear if saving invalid value
		if (typeof value !== 'string') {
			this.set(paths.md, undefined);
			this.set(paths.html, undefined);

			return undefined;
		}

		var newMd = sanitizeHtml(value, sanitizeOptions);
		var newHtml = marked(newMd, markedOptions);

		// Return early if no changes to save
		if (newMd === this.get(paths.md) && newHtml === this.get(paths.html)) {
			return newMd;
		}

		this.set(paths.md, newMd);
		this.set(paths.html, newHtml);

		return newMd;
	};

	schema.nested[this.path] = true;
	schema.add({
		html: { type: String },
		md: { type: String, set: setMarkdown },
	}, this.path + '.');

	this.bindUnderscoreMethods();
};

/**
 * Adds filters to a query (this is copy & pasted from the text field, with
 * the only difference being that the path isn't this.path but this.paths.md).
 *
 * @param {Object} filter The filter to apply.
 * @return {Object} The query object.
 */
markdown.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (filter.mode === 'exactly' && !filter.value) {
		query[this.paths.md] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		return query;
	}
	var value = utils.escapeRegExp(filter.value);
	if (filter.mode === 'beginsWith') {
		value = '^' + value;
	} else if (filter.mode === 'endsWith') {
		value = value + '$';
	} else if (filter.mode === 'exactly') {
		value = '^' + value + '$';
	}
	value = new RegExp(value, filter.caseSensitive ? '' : 'i');
	query[this.paths.md] = filter.inverted ? { $not: value } : value;
	return query;
};

/**
 * Formats the field value.
 *
 * @param {Object} item The item to format.
 * @return {String} The formatted value.
 */
markdown.prototype.format = function (item) {
	return item.get(this.paths.html);
};

/**
 * Gets the field's data from an Item, as used by the React components.
 *
 * @param {Object} item The item to get the data from.
 * @return {Object} The field's data.
 */
markdown.prototype.getData = function (item) {
	var value = item.get(this.path);
	return typeof value === 'object' ? value : {};
};

/**
 * Validates that a value for this field has been provided in a data object.
 *
 * @deprecated
 * @param {Object} data The data to validate.
 * @param {Boolean} required Whether the field is required.
 * @param {Object} item The item being validated.
 * @return {Boolean}
 */
markdown.prototype.inputIsValid = function (data, required, item) {
	if (!(this.path in data) && item && item.get(this.paths.md)) {
		return true;
	}
	return (!required || data[this.path]) ? true : false;
};

/**
 * Detects whether the field has been modified.
 *
 * @param {Object} item The item to check.
 * @return {Boolean} `true` if the field has been modified, otherwise `false`.
 */
markdown.prototype.isModified = function (item) {
	return item.isModified(this.paths.md);
};

/**
 * Updates the value for this field in the item from a data object.
 *
 * Will accept either the field path, or paths.md.
 *
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function.
 */
markdown.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	if (value !== undefined) {
		item.set(this.paths.md, value);
	}	else if (this.paths.md in data) {
		item.set(this.paths.md, data[this.paths.md]);
	}
	process.nextTick(callback);
};

/* Export Field Type */
module.exports = markdown;
