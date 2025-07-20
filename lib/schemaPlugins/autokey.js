/**
 * @fileoverview This file implements the `autokey` schema plugin for KeystoneJS.
 *
 * The `autokey` plugin automatically generates a unique key for a list based on the values of other fields.
 * This is useful for creating human-readable URLs or identifiers.
 *
 * The plugin is configured on a list with an `autokey` option. This option specifies the `from` fields
 * (which fields to use to generate the key) and the `path` (where to store the generated key).
 * It can also be configured to ensure the generated key is `unique`.
 *
 * The plugin adds a `pre('save')` hook to the schema. Before saving a document, this hook checks if the
 * `from` fields have been modified. If they have, it generates a new key and, if uniqueness is required,
 * ensures the key is unique before saving.
 */

var _ = require('lodash');
var utils = require('keystone-utils');

/**
 * @typedef {Object} AutokeyOptions
 * @property {string|string[]} from - The field or fields to generate the key from.
 * @property {string} path - The path to store the generated key in.
 * @property {boolean} [unique=false] - Whether the key should be unique.
 * @property {string} [locale] - The locale to use for slug generation.
 * @property {boolean} [fixed=false] - If true, the key will not be updated after it has been set.
 * @property {boolean} [ingoreIncompleteSource=false] - If true, a key will be generated even if the source fields are not all set.
 */

/**
 * The main exported function for the `autokey` plugin.
 *
 * This function is called on a list to add the autokey behavior.
 * It reads the `autokey` option from the list, adds the specified
 * `path` to the schema, and sets up a `pre('save')` hook to generate
 * the key.
 *
 * @param {keystone.List} list The list to add the autokey behavior to.
 * @api public
 */
module.exports = function autokey () {

	var autokey = this.autokey = _.clone(this.get('autokey'));
	var def = {};
	var list = this;

	// Validate the autokey options
	if (!autokey.from) {
		var fromMsg = 'Invalid List Option (autokey) for ' + list.key + ' (from is required)\n';
		throw new Error(fromMsg);
	}
	if (!autokey.path) {
		var pathMsg = 'Invalid List Option (autokey) for ' + list.key + ' (path is required)\n';
		throw new Error(pathMsg);
	}

	// Ensure `from` is an array of objects
	if (typeof autokey.from === 'string') {
		autokey.from = autokey.from.split(' ');
	}

	autokey.from = autokey.from.map(function (i) {
		i = i.split(':');
		return { path: i[0], format: i[1] };
	});

	// Add the autokey path to the schema
	def[autokey.path] = {
		type: String,
		index: true,
	};

	// If uniqueness is required, add a unique index
	if (autokey.unique) {
		def[autokey.path].index = { unique: true };
	}

	this.schema.add(def);

	/**
	 * Generates a unique key by appending a numeric suffix if the key already exists.
	 *
	 * @param {keystone.Item} doc The document being saved.
	 * @param {string} src The proposed key.
	 * @param {(err?: Error) => void} callback The callback to execute when a unique key is found.
	 * @api private
	 */
	var getUniqueKey = function (doc, src, callback) {

		var q = list.model.find().where(autokey.path, src);

		// If there are additional uniqueness constraints, add them to the query
		if (_.isObject(autokey.unique)) {
			_.forEach(autokey.unique, function (k, v) {
				if (typeof v === 'string' && v.charAt(0) === ':') {
					q.where(k, doc.get(v.substr(1)));
				} else {
					q.where(k, v);
				}
			});
		}

		q.exec(function (err, results) {
			if (err) {
				return callback(err);
			}
			// If the key already exists, generate a new one
			// deliberate use of implicit type coercion with == because doc.id may need to become a String
			if (results.length && (results.length > 1 || results[0].id != doc.id)) { // eslint-disable-line eqeqeq
				var inc = src.match(/^(.+)\-(\d+)$/);
				if (inc && inc.length === 3) {
					// If the key already has a numeric suffix, increment it
					src = inc[1];
					inc = '-' + ((inc[2] * 1) + 1);
				} else {
					// Otherwise, add a numeric suffix
					inc = '-1';
				}
				// Recurse to check the new key for uniqueness
				return getUniqueKey(doc, src + inc, callback);
			} else {
				// If the key is unique, set it on the document
				doc.set(autokey.path, src);
				return callback();
			}
		});
	};

	// Pre-save hook to generate the autokey
	this.schema.pre('save', function (next) {

		var modified = false;
		var incomplete = false;
		var values = [];

		// Gather the values from the `from` fields
		autokey.from.forEach(function (ops) {
			if (list.fields[ops.path]) {
				values.push(list.fields[ops.path].format(this, ops.format));
				if (list.fields[ops.path].isModified(this)) {
					modified = true;
				}
				// if source field is neither selected nor modified we don't have a way to generate a complete autokey
				else if (!this.isSelected(ops.path)) {
					incomplete = true;
				}
			} else {
				values.push(this.get(ops.path));
				// virtual paths are always assumed to have changed, except 'id'
				if (ops.path !== 'id' && list.schema.pathType(ops.path) === 'virtual' || this.isModified(ops.path)) {
					modified = true;
				}
			}
		}, this);

		// if source fields are not completely selected or set, skip generation unless told to ignore the condition
		if (incomplete && !autokey.ingoreIncompleteSource) {
			return next();
		}

		// if has a value and is unmodified or fixed, don't update it
		if ((!modified || autokey.fixed) && (this.get(autokey.path) || !this.isSelected(autokey.path))) {
			return next();
		}

		// Generate the new key
		var newKey = utils.slug(values.join(' '), null, { locale: autokey.locale }) || this.id;

		// If uniqueness is required, find a unique key
		if (autokey.unique) {
			return getUniqueKey(this, newKey, next);
		} else {
			this.set(autokey.path, newKey);
			return next();
		}

	});

};
