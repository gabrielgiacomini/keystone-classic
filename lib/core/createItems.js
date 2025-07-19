/**
 * @fileoverview This file defines the `createItems` function for Keystone, which
 * provides a powerful way to bulk-create and link items across multiple lists.
 *
 * This function is particularly useful for seeding a database, running tests, or
 * performing data migrations. It processes a data object that specifies the items
 * to create for each list, and it can handle relationships between items, even
 * when they are being created in the same operation.
 *
 * It relies on 'lodash', 'async', 'keystone-utils', and 'debug' for its functionality.
 */
var _ = require('lodash');
var async = require('async');
var utils = require('keystone-utils');
var debug = require('debug')('keystone:core:createItems');

// Regular expression for validating MongoDB ObjectIDs.
var MONGO_ID_REGEXP = /^[0-9a-fA-F]{8}[0-9a-fA-F]{6}[0-9a-fA-F]{4}[0-9a-fA-F]{6}$/;

/**
 * Checks if a value is a valid MongoDB ObjectID.
 *
 * @param {string} value - The value to check.
 * @returns {boolean} - True if the value is a valid ObjectID, false otherwise.
 * @private
 */
function isMongoId (value) {
	return MONGO_ID_REGEXP.test(value);
}

/**
 * Creates multiple items in one or more Keystone lists.
 *
 * This function processes a `data` object where keys are list keys and values are
 * arrays of item data. It first creates all the items and then, in a second
 * pass, populates the relationships between them.
 *
 * @param {Object} data - The data to create.
 * @param {Object} [ops] - Options for the creation process.
 * @param {boolean} [ops.verbose=false] - Whether to log detailed output.
 * @param {boolean} [ops.strict=true] - Whether to stop on errors.
 * @param {Object} [ops.refs=null] - An object to store references to created items.
 * @param {Function} [callback] - A function to call when the process is complete.
 */
function createItems (data, ops, callback) {
	var keystone = this;
	var options = {
		verbose: false,
		strict: true,
		refs: null,
	};
	var dashes = '------------------------------------------------';

	if (!_.isObject(data)) {
		throw new Error('keystone.createItems() requires a data object as the first argument.');
	}

	if (_.isObject(ops)) {
		_.extend(options, ops);
	} else if (typeof ops === 'function') {
		callback = ops;
	}

	var lists = _.keys(data);
	var refs = options.refs || {};
	var stats = {};

	function writeLog (data) {
		console.log(keystone.get('name') + ': ' + data);
	}

	async.waterfall([
		// First pass: create all items without relationships.
		function (next) {
			async.eachSeries(lists, function (key, doneList) {
				var list = keystone.list(key);
				var relationshipPaths = _.map(_.filter(list.fields, { type: 'relationship' }), 'path');

				if (!list) {
					if (options.strict) {
						return doneList({ type: 'invalid list', message: 'List key ' + key + ' is invalid.' });
					}
					if (options.verbose) {
						writeLog('Skipping invalid list: ' + key);
					}
					return doneList();
				}

				if (!refs[list.key]) {
					refs[list.key] = {};
				}

				stats[list.key] = {
					singular: list.singular,
					plural: list.plural,
					created: 0,
					warnings: 0,
				};

				var itemsProcessed = 0;
				var totalItems = data[key].length;

				if (options.verbose) {
					writeLog(dashes);
					writeLog('Processing list: ' + key + ' (' + totalItems + ' items)');
					writeLog(dashes);
				}

				async.eachSeries(data[key], function (itemData, doneItem) {
					itemsProcessed++;

					_.forEach(itemData, function (value, field) {
						if (typeof value === 'function' && relationshipPaths.indexOf(field) === -1) {
							itemData[field] = value();
						}
					});

					var doc = itemData.__doc = new list.model();
					if (itemData.__ref) {
						refs[list.key][itemData.__ref] = doc;
					}

					async.each(list.fieldsArray, function (field, doneField) {
						if (field.type !== 'relationship') {
							field.updateItem(doc, itemData, doneField);
						} else {
							doneField();
						}
					}, function (err) {
						if (err) return doneItem(err);
						if (options.verbose) {
							writeLog('Creating item ' + itemsProcessed + ' of ' + totalItems + ': ' + list.getDocumentName(doc));
						}
						doc.save(function (err) {
							if (err) {
								err.model = key;
								err.data = itemData;
								debug('error saving ' + key, err);
							} else {
								stats[list.key].created++;
							}
							doneItem(err);
						});
					});
				}, doneList);
			}, next);
		},

		// Second pass: link all the items.
		function (next) {
			async.each(lists, function (key, doneList) {
				var list = keystone.list(key);
				var relationships = _.filter(list.fields, { type: 'relationship' });

				if (!list || !relationships.length) {
					return doneList();
				}

				var itemsProcessed = 0;
				var totalItems = data[key].length;

				if (options.verbose) {
					writeLog(dashes);
					writeLog('Processing relationships for: ' + key + ' (' + totalItems + ' items)');
					writeLog(dashes);
				}

				async.each(data[key], function (srcData, doneItem) {
					var doc = srcData.__doc;
					var relationshipsUpdated = 0;
					itemsProcessed++;

					if (options.verbose) {
						writeLog('Processing item ' + itemsProcessed + ' of ' + totalItems + ': ' + list.getDocumentName(doc));
					}

					async.each(relationships, function (field, doneField) {
						var fieldValue = srcData[field.path];
						if (!fieldValue) return doneField();

						var refsLookup = refs[field.refList.key];

						function processRef (ref, done) {
							if (typeof ref === 'function') {
								var query = ref.apply(keystone, _.map(ref.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].split(','), function (i) {
									return keystone.list(i.trim());
								}));
								query.exec(function (err, results) {
									done(err, results);
								});
							} else if (isMongoId(ref)) {
								done(null, ref);
							} else if (refsLookup && refsLookup[ref]) {
								done(null, refsLookup[ref].id);
							} else {
								done(options.strict ? { type: 'invalid ref', message: 'Invalid reference: ' + ref } : null);
							}
						}

						if (_.isArray(fieldValue)) {
							if (!field.many) {
								return doneField({ type: 'invalid data', message: 'Array provided for single-value relationship.' });
							}
							async.map(fieldValue, processRef, function (err, result) {
								if (err) return doneField(err);
								relationshipsUpdated++;
								doc.set(field.path, _.compact(result));
								doneField();
							});
						} else {
							processRef(fieldValue, function (err, result) {
								if (err) return doneField(err);
								relationshipsUpdated++;
								doc.set(field.path, field.many ? [result] : result);
								doneField();
							});
						}
					}, function (err) {
						if (err) return doneItem(err);
						if (options.verbose && relationshipsUpdated) {
							writeLog('Populated ' + utils.plural(relationshipsUpdated, '* relationship', '* relationships') + '.');
						}
						if (relationshipsUpdated) {
							doc.save(doneItem);
						} else {
							doneItem();
						}
					});
				}, doneList);
			}, next);
		},
	], function (err) {
		if (err) {
			console.error(err);
			if (err.stack) {
				console.trace(err.stack);
			}
			return callback && callback(err);
		}

		var msg = '\nSuccessfully created:\n';
		_.forEach(stats, function (listStats) {
			msg += '\n*   ' + utils.plural(listStats.created, '* ' + listStats.singular, '* ' + listStats.plural);
			if (listStats.warnings) {
				msg += '\n    ' + utils.plural(listStats.warnings, '* warning', '* warnings');
			}
		});
		stats.message = msg + '\n';

		callback(null, stats);
	});
}

module.exports = createItems;
