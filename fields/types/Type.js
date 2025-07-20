/*!
 * Module dependencies.
 */
var _ = require('lodash');
var assign = require('object-assign');
var di = require('asyncdi');
var marked = 'marked';
var Path = require('../../lib/path');
var utils = require('keystone-utils');
var evalDependsOn = require('../utils/evalDependsOn.js');
var definePrototypeGetters = require('../utils/definePrototypeGetters.js');
var debug = require('debug')('keystone:fields:types:Type');

var DEFAULT_OPTION_KEYS = [
	'path',
	'paths',
	'type',
	'label',
	'note',
	'size',
	'initial',
	'required',
	'col',
	'noedit',
	'nocol',
	'nosort',
	'indent',
	'hidden',
	'collapse',
	'dependsOn',
	'autoCleanup',
	'thumb',
];

/**
 * @typedef {Object} FieldOptions
 * @property {string} [label] - The label for the field.
 * @property {string} [note] - A note or description for the field.
 * @property {string} [type] - The type of the field.
 * @property {boolean} [initial] - Whether the field should be displayed in the initial form.
 * @property {boolean} [required] - Whether the field is required.
 * @property {Object} [dependsOn] - An object specifying dependencies on other fields.
 * @property {boolean} [hidden] - Whether the field should be hidden in the Admin UI.
 * @property {boolean} [collapse] - Whether the field should be collapsed by default in the Admin UI.
 * @property {function} [watch] - A function to watch for changes in other fields.
 * @property {*} [default] - The default value for the field.
 * @property {string} [size] - The size of the field in the Admin UI (small, medium, large, full).
 */

/**
 * The base `Field` class.
 *
 * This class is extended by all other field types. It provides the common
 * functionality and properties for all fields.
 *
 * @class Field
 * @param {List} list - The list that this field belongs to.
 * @param {string} path - The path of the field.
 * @param {FieldOptions} options - The options for the field.
 * @property {List} list - The list that this field belongs to.
 * @property {string} path - The path of the field.
 * @property {FieldOptions} options - The options for the field.
 * @property {string} type - The type of the field.
 * @property {string} label - The label for the field.
 * @property {string} typeDescription - A description of the field's type.
 */
function Field (list, path, options) {

	// Set field properties and options
	this.list = list;
	this._path = new Path(path);
	this.path = path;

	this.type = this.constructor.name;
	this.options = _.defaults({}, options, this.defaults);
	this.label = options.label || utils.keyToLabel(this.path);
	this.typeDescription = options.typeDescription || this.typeDescription || this.type;

	this.list.automap(this);

	// Warn on required fields that aren't initial
	if (this.options.required
		&& this.options.initial === undefined
		&& this.options.default === undefined
		&& !this.options.value
		&& !this.list.get('nocreate')
		&& this.path !== this.list.mappings.name
	) {
		console.error('\nError: Invalid Configuration\n\n'
		+ 'Field (' + list.key + '.' + path + ') is required but not initial, and has no default or generated value.\n'
		+ 'Please provide a default, remove the required setting, or set initial: false to override this error.\n');
		process.exit(1);
	}

	// if dependsOn and required, set required to a function for validation
	if (this.options.dependsOn && this.options.required === true) {
		var opts = this.options;
		this.options.required = function () {
			// `this` refers to the validating document
			debug('validate dependsOn required', evalDependsOn(opts.dependsOn, this.toObject()));
			return evalDependsOn(opts.dependsOn, this.toObject());
		};
	}

	// Add the field to the schema
	this.addToSchema(this.list.schema);

	// Add pre-save handler to the list if this field watches others
	if (this.options.watch) {
		this.list.schema.pre('save', this.getPreSaveWatcher());
	}

	// Convert notes from markdown to html
	var note = null;
	Object.defineProperty(this, 'note', {
		get: function () {
			return (note === null) ? (note = (this.options.note) ? marked(this.options.note) : '') : note;
		},
	});

}

/**
 * Gets the options for the Field, as used by the React components.
 *
 * @returns {Object} The field options.
 */
Field.prototype.getOptions = function () {
	if (!this.__options) {
		this.__options = {};
		var optionKeys = DEFAULT_OPTION_KEYS;
		if (_.isArray(this._properties)) {
			optionKeys = optionKeys.concat(this._properties);
		}
		optionKeys.forEach(function (key) {
			if (this[key]) {
				this.__options[key] = this[key];
			} else if (this.options[key]) {
				this.__options[key] = this.options[key];
			}
		}, this);
		if (this.getProperties) {
			assign(this.__options, this.getProperties());
		}
		this.__options.hasFilterMethod = this.addFilterToQuery ? true : false;
		this.__options.defaultValue = this.getDefaultValue();
	}
	return this.__options;
};

/**
 * Validates and returns the size of the field.
 *
 * @returns {string} The size of the field.
 */
Field.prototype.getSize = function () {
	if (!this.__size) {
		var size = this._fixedSize || this.options.size || this.options.width;
		if (size !== 'small' && size !== 'medium' && size !== 'large' && size !== 'full') {
			size = this._defaultSize || 'full';
		}
		this.__size = size;
	}
	return this.__size;
};

/**
 * Gets the default value for the field.
 *
 * @returns {*} The default value.
 */
Field.prototype.getDefaultValue = function () {
	return typeof this.options.default !== 'undefined' ? this.options.default : '';
};

/**
 * Gets the field's data from an item.
 *
 * @param {Object} item - The item to get the data from.
 * @returns {*} The field's data.
 */
Field.prototype.getData = function (item) {
	return item.get(this.path);
};

/**
 * Returns a pre-save watcher function for the field.
 *
 * This is used to implement the `watch` option.
 *
 * @returns {function} The pre-save watcher function.
 */
Field.prototype.getPreSaveWatcher = function () {
	var field = this;
	var applyValue;

	if (this.options.watch === true) {
		// watch == true means always apply the value method
		applyValue = function () { return true; };
	} else {
		// if watch is a string, convert it to a list of paths to watch
		if (typeof this.options.watch === 'string') {
			this.options.watch = this.options.watch.split(' ');
		}
		if (typeof this.options.watch === 'function') {
			applyValue = this.options.watch;
		} else if (_.isArray(this.options.watch)) {
			applyValue = function (item) {
				var pass = false;
				field.options.watch.forEach(function (path) {
					if (item.isModified(path)) pass = true;
				});
				return pass;
			};
		} else if (_.isObject(this.options.watch)) {
			applyValue = function (item) {
				var pass = false;
				_.forEach(field.options.watch, function (value, path) {
					if (item.isModified(path) && item.get(path) === value) pass = true;
				});
				return pass;
			};
		}
	}

	if (!applyValue) {
		console.error('\nError: Invalid Configuration\n\n'
		+ 'Invalid watch value (' + this.options.watch + ') provided for ' + this.list.key + '.' + this.path + ' (' + this.type + ')');
		process.exit(1);
	}

	if (typeof this.options.value !== 'function') {
		console.error('\nError: Invalid Configuration\n\n'
		+ 'Watch set with no value method provided for ' + this.list.key + '.' + this.path + ' (' + this.type + ')');
		process.exit(1);
	}

	return function (next) {
		if (!applyValue(this)) {
			return next();
		}
		di(field.options.value).call(this, function (err, val) {
			if (err) {
				console.error('\nError: '
				+ 'Watch set with value method for ' + field.list.key + '.' + field.path + ' (' + field.type + ') throws error:' + err);
			} else {
				this.set(field.path, val);
			}
			next();
		}.bind(this));
	};

};
module.exports = Field;

/**
 * Getter properties for the Field prototype.
 *
 * These properties are defined as getters so that they are only computed when
 * they are accessed.
 *
 * @property {string} size - The size of the field.
 * @property {boolean} initial - Whether the field is initial.
 * @property {boolean} required - Whether the field is required.
 * @property {string} note - The note for the field.
 * @property {boolean} col - Whether the field is a column.
 * @property {boolean} noedit - Whether the field is editable.
 * @property {boolean} nocol - Whether the field is a column.
 * @property {boolean} nosort - Whether the field is sortable.
 * @property {boolean} collapse - Whether the field is collapsed.
 * @property {boolean} hidden - Whether the field is hidden.
 * @property {Object} dependsOn - The dependencies for the field.
 */
definePrototypeGetters(Field, {
	size: function () { return this.getSize(); },
	initial: function () { return this.options.initial || false; },
	required: function () { return this.options.required || false; },
	note: function () { return this.options.note || ''; },
	col: function () { return this.options.col || false; },
	noedit: function () { return this.options.noedit || false; },
	nocol: function () { return this.options.nocol || false; },
	nosort: function () { return this.options.nosort || false; },
	collapse: function () { return this.options.collapse || false; },
	hidden: function () { return this.options.hidden || false; },
	dependsOn: function () { return this.options.dependsOn || false; },
});

/**
 * Adds the field to the Mongoose schema.
 *
 * @param {Object} schema - The Mongoose schema to add the field to.
 */
Field.prototype.addToSchema = function (schema) {
	var ops = (this._nativeType) ? _.defaults({ type: this._nativeType }, this.options) : this.options;
	schema.path(this.path, ops);
	this.bindUnderscoreMethods();
};

/**
 * Binds underscore methods to the field.
 *
 * This is used to add methods to the field's underscore object.
 */
Field.prototype.bindUnderscoreMethods = function () {
	var field = this;
	(this._underscoreMethods || []).concat({ fn: 'updateItem', as: 'update' }).forEach(function (method) {
		if (typeof method === 'string') {
			method = { fn: method, as: method };
		}
		if (typeof field[method.fn] !== 'function') {
			throw new Error('Invalid underscore method (' + method.fn + ') applied to ' + field.list.key + '.' + field.path + ' (' + field.type + ')');
		}
		field.underscoreMethod(method.as, function () {
			var args = [this].concat(Array.prototype.slice.call(arguments));
			return field[method.fn].apply(field, args);
		});
	});
};

/**
 * Adds an underscore method to the field.
 *
 * @param {string} path - The path of the method.
 * @param {function} fn - The method function.
 */
Field.prototype.underscoreMethod = function (path, fn) {
	this.list.underscoreMethod(this.path + '.' + path, function () {
		return fn.apply(this, arguments);
	});
};

/**
 * Formats the field's value.
 *
 * @param {Object} item - The item to format the value from.
 * @returns {string} The formatted value.
 */
Field.prototype.format = function (item) {
	var value = item.get(this.path);
	if (value === undefined) return '';
	return value;
};

/**
 * Checks if the field has been modified.
 *
 * @param {Object} item - The item to check.
 * @returns {boolean} Whether the field has been modified.
 */
Field.prototype.isModified = function (item) {
	return item.isModified(this.path);
};

/**
 * Validates the field's input.
 *
 * @param {Object} data - The data to validate.
 * @param {function} callback - The callback function.
 */
Field.prototype.validateInput = function (data, callback) {
	utils.defer(callback, this.inputIsValid(data));
};

/**
 * Validates that a value for this field has been provided in a data object,
 * taking into account existing data in an item.
 *
 * @param {Object} item - The item to check.
 * @param {Object} data - The data to validate.
 * @param {function} callback - The callback function.
 */
Field.prototype.validateRequiredInput = function (item, data, callback) {
	utils.defer(callback, this.inputIsValid(data, true, item));
};

/**
 * Checks if the field's input is valid.
 *
 * @param {Object} data - The data to validate.
 * @param {boolean} required - Whether the field is required.
 * @param {Object} item - The item to check.
 * @returns {boolean} Whether the input is valid.
 * @deprecated
 */
Field.prototype.inputIsValid = function (data, required, item) {
	if (!required) return true;
	var value = this.getValueFromData(data);
	if (value === undefined && item && item.get(this.path)) return true;
	if (typeof data[this.path] === 'string') {
		return (data[this.path].trim()) ? true : false;
	} else {
		return (data[this.path]) ? true : false;
	}
};

/**
 * Updates the field's value in an item.
 *
 * @param {Object} item - The item to update.
 * @param {Object} data - The data to update the item with.
 * @param {function} callback - The callback function.
 */
Field.prototype.updateItem = function (item, data, callback) {
	var value = this.getValueFromData(data);
	// This is a deliberate type coercion so that numbers from forms play nice
	if (value !== undefined && value != item.get(this.path)) { // eslint-disable-line eqeqeq
		item.set(this.path, value);
	}
	process.nextTick(callback);
};

/**
 * Retrieves the value from a data object.
 *
 * @param {Object} data - The data to retrieve the value from.
 * @param {string} [subpath] - The subpath to retrieve the value from.
 * @returns {*} The value.
 */
Field.prototype.getValueFromData = function (data, subpath) {
	return this._path.get(data, subpath);
};
