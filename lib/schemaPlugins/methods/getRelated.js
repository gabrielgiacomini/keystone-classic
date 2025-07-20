/**
 * @fileoverview This file defines the `getRelated` method for KeystoneJS lists.
 *
 * The `getRelated` method is used to fetch and populate related data from other lists.
 * It allows for complex population of related data, including nested relationships.
 *
 * For example, if you have a `Post` list with a relationship to a `User` list, you can use
 * `getRelated` on a post document to fetch the related user. You can also populate fields
 * on the user document at the same time.
 *
 * This method is added to the list's prototype, so it can be called on any document.
 */

var keystone = require('../../../');
var _ = require('lodash');
var async = require('async');

/**
 * @callback getRelatedCallback
 * @param {Error} err - An error object if an error occurred.
 * @param {Object.<string, keystone.Item[]>} results - An object containing the related documents, keyed by path.
 */

/**
 * Gets related data for a document.
 *
 * @param {string|string[]} paths - A string or array of strings specifying the relationship paths to populate.
 *   Paths can include a populate string in brackets, e.g., 'user[name email]'.
 * @param {getRelatedCallback} callback - A callback function to execute when the related data has been fetched.
 * @param {boolean} [nocollapse=false] - If `true`, the results will not be collapsed into a single object
 *   when only one path is specified.
 *
 * @example
 * // In a post model method:
 * post.getRelated('author[name, email]', function(err, result) {
 *   if (err) {
 *     console.error(err);
 *   } else {
 *     console.log(result.author.name);
 *     console.log(result.author.email);
 *   }
 * });
 *
 * @api public
 */
module.exports = function getRelated (paths, callback, nocollapse) {

	var item = this;
	var list = this.list;
	var queue = {};

	if (typeof callback !== 'function') {
		throw new Error('List.getRelated(paths, callback, nocollapse) requires a callback function.');
	}

	// Ensure paths is an array
	if (typeof paths === 'string') {
		var pathsArr = paths.split(' ');
		var lastPath = '';
		paths = [];
		for (var i = 0; i < pathsArr.length; i++) {
			lastPath += (lastPath.length ? ' ' : '') + pathsArr[i];
			if (lastPath.indexOf('[') < 0 || lastPath.charAt(lastPath.length - 1) === ']') {
				paths.push(lastPath);
				lastPath = '';
			}
		}
	}

	// Process each path
	_.forEach(paths, function (options) {

		var populateString = '';

		// Parse path options
		if (typeof options === 'string') {
			if (options.indexOf('[') > 0) {
				populateString = options.substring(options.indexOf('[') + 1, options.indexOf(']'));
				options = options.substr(0, options.indexOf('['));
			}
			options = { path: options };
		}
		options.populate = options.populate || [];
		options.related = options.related || [];

		// Get the relationship definition
		var relationship = list.relationships[options.path];
		if (!relationship) throw new Error('List.getRelated: list ' + list.key + ' does not have a relationship ' + options.path + '.');

		// Get the referenced list
		var refList = keystone.list(relationship.ref);
		if (!refList) throw new Error('List.getRelated: list ' + relationship.ref + ' does not exist.');

		// Get the relationship field on the referenced list
		var relField = refList.fields[relationship.refPath];
		if (!relField || relField.type !== 'relationship') throw new Error('List.getRelated: relationship ' + relationship.ref + ' on list ' + list.key + ' refers to a path (' + relationship.refPath + ') which is not a relationship field.');

		// Parse the populate string
		if (populateString.length) {
			_.forEach(populateString.split(' '), function (key) {
				if (refList.relationships[key]) {
					options.related.push(key);
				} else {
					options.populate.push(key);
				}
			});
		}

		// Add a function to the queue to fetch the related data
		queue[relationship.path] = function (done) {

			var query = refList.model.find().where(relField.path);

			// Populate the query
			if (options.populate) {
				query.populate(options.populate);
			}

			// Add the where clause to the query
			if (relField.many) {
				query.in([item.id]);
			} else {
				query.equals(item.id);
			}

			// Add sorting to the query
			query.sort(options.sort || relationship.sort || refList.defaultSort);

			// If there are related fields to populate, do it in parallel
			if (options.related.length) {
				query.exec(function (err, results) {
					if (err || !results.length) {
						return done(err, results);
					}
					async.parallel(results.map(function (item) {
						return function (done) {
							item.populateRelated(options.related, done);
						};
					}),
					function (err) {
						done(err, results);
					});
				});
			} else {
				query.exec(done);
			}

		};

		// Keep track of populated relationships
		if (!item._populatedRelationships) item._populatedRelationships = {};
		item._populatedRelationships[relationship.path] = true;

	});

	// Execute the queue in parallel
	async.parallel(queue, function (err, results) {
		// Collapse the results if required
		if (!nocollapse && results && paths.length === 1) {
			results = results[paths[0]];
		}
		callback(err, results);
	});

};
