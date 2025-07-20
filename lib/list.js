/**
 * @fileoverview This file defines the `List` class, the core of Keystone's data modeling.
 * It is responsible for constructing and managing lists, which are analogous to tables or
 * collections in a database. `List` handles schema definition, field registration, and
 * the configuration of various list-specific behaviors and properties.
 *
 * This class integrates with Mongoose to define the schema and model for each list,
 * and it dynamically attaches a suite of methods for data handling, such as querying,
 * updating, and paginating data.
 *
 * @module lib/list
 * @requires lodash
 * @requires keystone-utils
 * @see module:lib/fieldTypes
 * @see module:lib/updateHandler
 */

var _ = require('lodash');
var utils = require('keystone-utils');

module.exports = function (keystone) {

	/**
	 * @typedef {Object} ListOptions
	 * @property {Object} [schema] - Mongoose schema options.
	 * @property {boolean} [noedit] - Whether to disable editing of items in the Admin UI.
	 * @property {boolean} [nocreate] - Whether to disable creating new items in the Admin UI.
	 * @property {boolean} [nodelete] - Whether to disable deleting items in the Admin UI.
	 * @property {boolean} [autocreate] - Whether to automatically create a new item when the list is empty.
	 * @property {boolean} [sortable] - Whether to enable drag-and-drop sorting in the Admin UI.
	 * @property {boolean} [hidden] - Whether to hide the list from the Admin UI navigation.
	 * @property {boolean} [track] - Whether to track creation and modification timestamps.
	 * @property {List} [inherits] - Another list to inherit fields and options from.
	 * @property {number} [perPage] - The number of items to display per page in the Admin UI.
	 * @property {string} [searchFields] - The fields to search when a search query is submitted.
	 * @property {boolean} [searchUsesTextIndex] - Whether to use a text index for searching.
	 * @property {string} [defaultSort] - The default sort order for the list.
	 * @property {string} [defaultColumns] - The default columns to display in the list view.
	 * @property {Object} [map] - A map of field paths to use for special purposes (e.g., `name`, `createdBy`).
	 */

	/**
	 * The `List` class is the core of Keystone's data modeling. It is responsible
	 * for constructing and managing lists, which are analogous to tables or
	 * collections in a database.
	 *
	 * @class List
	 * @param {string} key - The unique key for the list.
	 * @param {ListOptions} options - The options for the list.
	 * @property {string} key - The unique key for the list.
	 * @property {ListOptions} options - The options for the list.
	 * @property {string} path - The path of the list.
	 * @property {Object} schema - The Mongoose schema for the list.
	 * @property {Array} schemaFields - An array of the fields in the schema.
	 * @property {Array} uiElements - An array of the UI elements for the list.
	 * @property {Object} underscoreMethods - An object containing the underscore methods for the list.
	 * @property {Object} fields - An object containing the fields for the list.
	 * @property {Array} fieldsArray - An array of the fields for the list.
	 * @property {Object} fieldTypes - An object containing the field types for the list.
	 * @property {Array} relationshipFields - An array of the relationship fields for the list.
	 * @property {Object} relationships - An object containing the relationships for the list.
	 * @property {Object} mappings - An object containing the mappings for the list.
	 */
	function List (key, options) {
		// Ensure the List is instantiated correctly
		if (!(this instanceof List)) return new List(key, options);
		this.keystone = keystone;

		// Default options for the list
		var defaultOptions = {
			schema: {
				collection: keystone.prefixModel(key),
			},
			noedit: false,
			nocreate: false,
			nodelete: false,
			autocreate: false,
			sortable: false,
			hidden: false,
			track: false,
			inherits: false,
			perPage: 100,
			searchFields: '__name__',
			searchUsesTextIndex: false,
			defaultSort: '__default__',
			defaultColumns: '__name__',
		};

		// initialFields values are initialised on demand by the getter
		var initialFields;

		// Inherit default options from parent list if it exists
		if (options && options.inherits) {
			if (options.inherits.options && options.inherits.options.inherits) {
				throw new Error('Inherited Lists may not contain any inheritance');
			}
			defaultOptions = utils.options(defaultOptions, options.inherits.options);
			// If the parent list is tracked, the child list should not be
			if (options.inherits.options.track) {
				options.track = false;
			}
		}

		this.options = utils.options(defaultOptions, options);

		// init properties
		this.key = key;
		this.path = this.get('path') || utils.keyToPath(key, true);
		this.schema = new keystone.mongoose.Schema({}, this.options.schema);
		this.schemaFields = [];
		this.uiElements = [];
		this.underscoreMethods = {};
		this.fields = {};
		this.fieldsArray = [];
		this.fieldTypes = {};
		this.relationshipFields = [];
		this.relationships = {};
		this.mappings = {
			name: null,
			createdBy: null,
			createdOn: null,
			modifiedBy: null,
			modifiedOn: null,
		};

		var self = this;

		// init mappings
		_.forEach(this.options.map, function (val, key) { self.map(key, val); });

		// define property getters
		Object.defineProperty(this, 'label', { get: function () {
			return this.get('label') || this.set('label', utils.plural(utils.keyToLabel(key)));
		} });
		Object.defineProperty(this, 'singular', { get: function () {
			return this.get('singular') || this.set('singular', utils.singular(this.label));
		} });
		Object.defineProperty(this, 'plural', { get: function () {
			return this.get('plural') || this.set('plural', utils.plural(this.singular));
		} });
		Object.defineProperty(this, 'namePath', { get: function () {
			return this.mappings.name || '_id';
		} });
		Object.defineProperty(this, 'nameField', { get: function () {
			return this.fields[this.mappings.name];
		} });
		Object.defineProperty(this, 'nameIsVirtual', { get: function () {
			return this.model.schema.virtuals[this.mappings.name] ? true : false;
		} });
		Object.defineProperty(this, 'nameFieldIsFormHeader', { get: function () {
			return (this.fields[this.mappings.name] && this.fields[this.mappings.name].type === 'text') ? !this.fields[this.mappings.name].noedit : false;
		} });
		Object.defineProperty(this, 'nameIsInitial', { get: function () {
			return (this.fields[this.mappings.name] && this.fields[this.mappings.name].options.initial === undefined);
		} });
		Object.defineProperty(this, 'initialFields', { get: function () {
			return initialFields || (initialFields = _.filter(this.fields, function (i) { return i.initial; }));
		} });

		// If the list inherits from another, add the parent's fields
		if (this.get('inherits')) {
			var parentFields = this.get('inherits').schemaFields;
			this.add.apply(this, parentFields);
		}
	}

	// TODO: Protect dynamic properties from being accessed until the List
	// has been registered (otherwise, incomplete schema could be cached)

	/**
	 * The fields to search when a search query is submitted.
	 *
	 * @property {string[]} searchFields
	 */
	Object.defineProperty(List.prototype, 'searchFields', {
		get: function () {
			if (!this._searchFields) {
				this._searchFields = this.expandPaths(this.get('searchFields'));
			}
			return this._searchFields;
		}, set: function (value) {
			this.set('searchFields', value);
			delete this._searchFields;
		},
	});

	/**
	 * The default sort field for the list.
	 *
	 * @property {string} defaultSort
	 */
	Object.defineProperty(List.prototype, 'defaultSort', {
		get: function () {
			var ds = this.get('defaultSort');
			return (ds === '__default__') ? (this.get('sortable') ? 'sortOrder' : this.namePath) : ds;
		}, set: function (value) {
			this.set('defaultSort', value);
		},
	});

	/**
	 * The default columns to display in the list view.
	 *
	 * @property {Column[]} defaultColumns
	 */
	Object.defineProperty(List.prototype, 'defaultColumns', {
		get: function () {
			if (!this._defaultColumns) {
				this._defaultColumns = this.expandColumns(this.get('defaultColumns'));
			}
			return this._defaultColumns;
		}, set: function (value) {
			this.set('defaultColumns', value);
			delete this._defaultColumns;
		},
	});

	// Add prototype methods
	List.prototype.add = require('./list/add');
	List.prototype.addFiltersToQuery = require('./list/addFiltersToQuery');
	List.prototype.addSearchToQuery = require('./list/addSearchToQuery');
	List.prototype.automap = require('./list/automap');
	List.prototype.apiForGet = require('./list/apiForGet');
	List.prototype.expandColumns = require('./list/expandColumns');
	List.prototype.expandPaths = require('./list/expandPaths');
	List.prototype.expandSort = require('./list/expandSort');
	List.prototype.field = require('./list/field');
	List.prototype.get = List.prototype.set = require('./list/set');
	List.prototype.getAdminURL = require('./list/getAdminURL');
	List.prototype.getCSVData = require('./list/getCSVData');
	List.prototype.getData = require('./list/getData');
	List.prototype.getDocumentName = require('./list/getDocumentName');
	List.prototype.getOptions = require('./list/getOptions');
	List.prototype.getPages = require('./list/getPages');
	List.prototype.getSearchFilters = require('./list/getSearchFilters');
	List.prototype.getUniqueValue = require('./list/getUniqueValue');
	List.prototype.isReserved = require('./list/isReserved');
	List.prototype.map = require('./list/map');
	List.prototype.paginate = require('./list/paginate');
	List.prototype.processFilters = require('./list/processFilters');
	List.prototype.register = require('./list/register');
	List.prototype.relationship = require('./list/relationship');
	List.prototype.selectColumns = require('./list/selectColumns');
	List.prototype.updateItem = require('./list/updateItem');
	List.prototype.underscoreMethod = require('./list/underscoreMethod');
	List.prototype.buildSearchTextIndex = require('./list/buildSearchTextIndex');
	List.prototype.declaresTextIndex = require('./list/declaresTextIndex');
	List.prototype.ensureTextIndex = require('./list/ensureTextIndex');

	return List;

};
