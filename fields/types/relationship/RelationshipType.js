/**
 * @fileoverview This file defines the Relationship field type in KeystoneJS.
 *
 * It is used for creating relationships between different lists. It can be
 * used for one-to-one, one-to-many, and many-to-many relationships.
 *
 * @see module:keystone/lib/field
 */

var _ = require('lodash');
var FieldType = require('../Type');
var keystone = require('../../../');
var util = require('util');
var utils = require('keystone-utils');
var definePrototypeGetters = require('../../utils/definePrototypeGetters');

/**
 * Relationship FieldType Constructor.
 * @extends Field
 * @api public
 *
 * @param {Object} list The list instance this field belongs to.
 * @param {String} path The path of this field in the list.
 * @param {Object} options The field options.
 * @param {Boolean} [options.many=false] Whether it is a one-to-many relationship.
 * @param {Object} [options.filters] Filters to apply to the related list.
 * @param {Boolean} [options.createInline=false] Whether to allow creating related items inline.
 */
function relationship (list, path, options) {
	this.many = (options.many) ? true : false;
	this.filters = options.filters;
	this.createInline = (options.createInline) ? true : false;
	this._defaultSize = 'full';
	this._nativeType = keystone.mongoose.Schema.Types.ObjectId;
	this._underscoreMethods = ['format', 'getExpandedData'];
	this._properties = ['isValid', 'many', 'filters', 'createInline'];
	relationship.super_.call(this, list, path, options);
}
relationship.properName = 'Relationship';
util.inherits(relationship, FieldType);

/**
 * Get client-side properties to pass to react field.
 *
 * @return {Object} The client-side properties.
 */
relationship.prototype.getProperties = function () {
	var refList = this.refList;
	return {
		refList: {
			singular: refList.singular,
			plural: refList.plural,
			path: refList.path,
			key: refList.key,
		},
	};
};

/**
 * Gets id and name for the related item(s) from populated values.
 *
 * @param {Object} item The item to get the related data from.
 * @return {Object|Array} The related data.
 */
function expandRelatedItemData (item) {
	if (!item || !item.id) return undefined;
	return {
		id: item.id,
		name: this.refList.getDocumentName(item),
	};
}

/**
 * Returns true if the value is truthy.
 *
 * @param {*} value The value to check.
 * @return {Boolean}
 */
function truthy (value) {
	return value;
}

/**
 * Gets the expanded data for the related item(s).
 *
 * @param {Object} item The item to get the expanded data from.
 * @return {Object|Array} The expanded data.
 */
relationship.prototype.getExpandedData = function (item) {
	var value = item.get(this.path);
	if (this.many) {
		if (!value || !Array.isArray(value)) return [];
		return value.map(expandRelatedItemData.bind(this)).filter(truthy);
	} else {
		return expandRelatedItemData.call(this, value);
	}
};

/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @param {Object} schema The Mongoose schema to add the field to.
 */
relationship.prototype.addToSchema = function (schema) {
	var field = this;
	var def = {
		type: this._nativeType,
		ref: this.options.ref,
		index: (this.options.index ? true : false),
		required: (this.options.required ? true : false),
		unique: (this.options.unique ? true : false),
	};
	this.paths = {
		refList: this.options.refListPath || this.path + 'RefList',
	};
	schema.path(this.path, this.many ? [def] : def);
	schema.virtual(this.paths.refList).get(function () {
		return keystone.list(field.options.ref);
	});
	this.bindUnderscoreMethods();
};

/**
 * Gets the field's data from an Item, as used by the React components.
 *
 * @param {Object} item The item to get the data from.
 * @return {Object|Array} The field's data.
 */
relationship.prototype.getData = function (item) {
	var value = item.get(this.path);
	if (this.many) {
		return Array.isArray(value) ? value : [];
	} else {
		return value;
	}
};

/**
 * Adds filters to a query.
 *
 * @param {Object} filter The filter to apply.
 * @return {Object} The query object.
 */
relationship.prototype.addFilterToQuery = function (filter) {
	var query = {};
	if (!Array.isArray(filter.value)) {
		if (typeof filter.value === 'string' && filter.value) {
			filter.value = [filter.value];
		} else {
			filter.value = [];
		}
	}
	if (filter.value.length) {
		query[this.path] = (filter.inverted) ? { $nin: filter.value } : { $in: filter.value };
	} else {
		if (this.many) {
			query[this.path] = (filter.inverted) ? { $not: { $size: 0 } } : { $size: 0 };
		} else {
			query[this.path] = (filter.inverted) ? { $ne: null } : null;
		}
	}
	return query;
};

/**
 * Formats the field value.
 *
 * @param {Object} item The item to format.
 * @return {String} The formatted value.
 */
relationship.prototype.format = function (item) {
	var value = item.get(this.path);
	// force the formatted value to be a string - unexpected things happen with ObjectIds.
	return this.many ? value.join(', ') : (value || '') + '';
};

/**
 * Asynchronously confirms that the provided value is valid.
 *
 * TODO: might be a good idea to check the value provided looks like a MongoID
 * TODO: we're just testing for strings here, so actual MongoID Objects (from
 * mongoose) would fail validation. not sure if this is an issue.
 *
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
relationship.prototype.validateInput = function (data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	if (value === undefined || value === null || value === '') {
		result = true;
	} else {
		if (this.many) {
			if (!Array.isArray(value) && typeof value === 'string' && value.length) {
				value = [value];
			}
			if (Array.isArray(value)) {
				result = true;
			}
		} else {
			if (typeof value === 'string' && value.length) {
				result = true;
			}
			if (typeof value === 'object' && value.id) {
				result = true;
			}
		}
	}
	utils.defer(callback, result);
};

/**
 * Asynchronously confirms that the provided value is present.
 *
 * @param {Object} item The item being validated.
 * @param {Object} data The data to validate.
 * @param {Function} callback The callback function.
 */
relationship.prototype.validateRequiredInput = function (item, data, callback) {
	var value = this.getValueFromData(data);
	var result = false;
	if (value === undefined) {
		if (this.many) {
			if (item.get(this.path).length) {
				result = true;
			}
		} else {
			if (item.get(this.path)) {
				result = true;
			}
		}
	} else if (this.many) {
		if (!Array.isArray(value) && typeof value === 'string' && value.length) {
			value = [value];
		}
		if (Array.isArray(value) && value.length) {
			result = true;
		}
	} else {
		if (value) {
			result = true;
		}
	}
	utils.defer(callback, result);
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
relationship.prototype.inputIsValid = function (data, required, item) {
	if (!required) return true;
	if (!(this.path in data) && item && ((this.many && item.get(this.path).length) || item.get(this.path))) return true;
	if (typeof data[this.path] === 'string') {
		return (data[this.path].trim()) ? true : false;
	} else {
		return (data[this.path]) ? true : false;
	}
};

/**
 * Updates the value for this field in the item from a data object.
 * Only updates the value if it has changed.
 * Treats an empty string as a null value.
 * If data object does not contain the path field, then leave the field untouched.
 * falsey values such as `null` or an empty string will reset the field.
 *
 * @param {Object} item The item to update.
 * @param {Object} data The data to update from.
 * @param {Function} callback The callback function.
 */
relationship.prototype.updateItem = function (item, data, callback) {
	if (item.populated(this.path)) {
		throw new Error('fieldTypes.relationship.updateItem() Error - You cannot update populated relationships.');
	}

	var value = this.getValueFromData(data);
	if (value === undefined) {
		return process.nextTick(callback);
	}

	// Are we handling a many relationship or just one value?
	if (this.many) {
		var arr = item.get(this.path);
		var _old = arr.map(function (i) { return String(i); });
		var _new = value;
		if (!utils.isArray(_new)) {
			_new = String(_new || '').split(',');
		}
		_new = _.compact(_new);
		// Only update if the lists aren't the same
		if (!_.isEqual(_old, _new)) {
			item.set(this.path, _new);
		}
	} else {
		// Ok, it's one value, should I do anything with it?
		if (value && value !== item.get(this.path)) {
			// If it's set and has changed, I do.
			item.set(this.path, value);
		} else if (!value && item.get(this.path)) {
			// If it's not set and it was set previously, I need to clear.
			item.set(this.path, null);
		}
		// Otherwise, ignore.
	}
	process.nextTick(callback);
};

definePrototypeGetters(relationship, {
	// Returns true if the relationship configuration is valid
	isValid: function () {
		return keystone.list(this.options.ref) ? true : false;
	},
	// Returns the Related List
	refList: function () {
		return keystone.list(this.options.ref);
	},
	// Whether the field has any filters defined
	hasFilters: function () {
		return (this.filters && _.keys(this.filters).length);
	},
});

/* Export Field Type */
module.exports = relationship;
