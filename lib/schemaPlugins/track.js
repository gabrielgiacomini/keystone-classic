/**
 * @fileoverview This file implements the `track` schema plugin for KeystoneJS.
 *
 * The `track` plugin adds fields to a list's schema to track when a document
 * is created and updated, and by whom.
 *
 * The plugin is configured on a list with a `track` option. This can be a boolean
 * or an object to customize the fields.
 *
 * When enabled, the plugin adds a `pre('save')` hook to the schema to automatically
 * set the tracking fields.
 */
var _ = require("lodash");
var keystone = require("../../");
var Types = require("../fieldTypes");

/**
 * The main exported function for the `track` plugin.
 *
 * This function is called on a list to add the tracking behavior.
 * It reads the `track` option from the list, adds the tracking fields
 * to the schema, and sets up a `pre('save')` hook to update the fields.
 *
 * @api public
 */
module.exports = function track() {
	var list = this;
	var options = list.get("track");
	var userModel = keystone.get("user model");

	// If the track setting is falsy, bail
	if (!options) {
		return;
	}

	var defaultOptions = {
		createdAt: false,
		createdBy: false,
		updatedAt: false,
		updatedBy: false
	};
	var fields = {};

	// Ensure track is a boolean or an object
	if (!_.isBoolean(options) && !_.isObject(options)) {
		throw new Error(
			'Invalid List "track" option for ' +
				list.key +
				"\n" +
				'"track" must be a boolean or an object.\n\n' +
				"See http://v4.keystonejs.com/docs/database/#lists-options for more information."
		);
	}

	// Shorthand: { track: true } sets all tracked fields to true
	if (_.isBoolean(options)) {
		options = {
			createdAt: true,
			createdBy: true,
			updatedAt: true,
			updatedBy: true
		};
	}

	// If all track fields are set to false, then there's nothing to track
	if (
		!options.createdAt &&
		!options.createdBy &&
		!options.updatedAt &&
		!options.updatedBy
	) {
		return;
	}

	// Merge user options with default options
	options = _.extend({}, defaultOptions, options);

	// Validate option fields
	_.forEach(options, function(value, key) {
		var fieldName;

		// Make sure the key isn't already defined as a field
		if (_.has(list.fields, key)) {
			throw new Error(
				'Invalid List "track" option for ' +
					list.key +
					"\n" +
					'"' +
					key +
					'" is already defined in the Schema.'
			);
		}

		// Make sure it's a valid track option field
		if (_.has(defaultOptions, key)) {
			// Make sure the option field value is either a boolean or a string
			if (!_.isBoolean(value) && typeof value !== "string") {
				throw new Error(
					'Invalid List "track" option for ' +
						list.key +
						"\n" +
						'"' +
						key +
						'" must be a boolean or a string.\n\n' +
						"See http://v4.keystonejs.com/docs/database/#lists-options for more information."
				);
			}

			if (value) {
				// Determine the field name
				fieldName = value === true ? key : value;
				options[key] = fieldName;
				list.map(key, fieldName);

				// Add the field to the schema
				switch (key) {
					case "createdAt":
					case "updatedAt":
						fields[fieldName] = {
							type: Date,
							noedit: true,
							collapse: true,
							index: true
						};
						break;

					case "createdBy":
					case "updatedBy":
						fields[fieldName] = {
							type: Types.Relationship,
							ref: userModel,
							noedit: true,
							collapse: true,
							index: true
						};
						break;
				}
			}
		} else {
			throw new Error(
				'Invalid List "track" option for ' +
					list.key +
					"\n" +
					'valid field options are "createdAt", "createdBy", "updatedAt", an "updatedBy".\n\n' +
					"See http://v4.keystonejs.com/docs/database/#lists-options for more information."
			);
		}
	});

	// Add track fields to the schema
	list.add("Meta", fields);

	list.tracking = options;

	// Add the pre-save schema plugin
	list.schema.pre("save", function(next) {
		var now = new Date();

		// Set createdAt/createdBy on new docs
		if (this.isNew) {
			if (options.createdAt && !this.get(options.createdAt)) {
				this.set(options.createdAt, now);
			}
			if (options.createdBy && this._req_user && !this.get(options.createdBy)) {
				this.set(options.createdBy, this._req_user._id);
			}
		}

		// Set updatedAt/updatedBy when doc is modified
		if (this.isNew || this.isModified()) {
			if (options.updatedAt) {
				this.set(options.updatedAt, now);
			}
			if (options.updatedBy && this._req_user) {
				this.set(options.updatedBy, this._req_user._id);
			}
		}

		next();
	});
};
