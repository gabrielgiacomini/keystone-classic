/**
 * @fileoverview This file defines the `populateRelated` method for KeystoneJS lists.
 *
 * The `populateRelated` method is a convenience method that fetches related data
 * and populates it directly onto the document. It uses the `getRelated` method
 * to fetch the data.
 *
 * This method is added to the list's prototype, so it can be called on any document.
 */

var _ = require('lodash');

/**
 * Populates related data on a document.
 *
 * @param {string|string[]} rel - A string or array of strings specifying the relationship paths to populate.
 * @param {function} callback - A callback function to execute when the related data has been populated.
 *   It receives two arguments: `(err, results)`.
 *
 * @example
 * // In a post model method:
 * post.populateRelated('author', function(err, result) {
 *   if (err) {
 *     console.error(err);
 *   } else {
 *     console.log(post.author.name);
 *   }
 * });
 *
 * @api public
 */
module.exports = function populateRelated (rel, callback) {

	var item = this;

	if (typeof callback !== 'function') {
		throw new Error('List.populateRelated(rel, callback) requires a callback function.');
	}

	// Use getRelated to fetch the data
	this.getRelated(rel, function (err, results) {
		// Populate the data onto the item
		_.forEach(results, function (data, key) {
			item[key] = data;
		});
		callback(err, results);
	}, true);

};
