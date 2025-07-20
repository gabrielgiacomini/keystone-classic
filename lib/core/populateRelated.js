/**
 * @fileoverview This file defines the `populateRelated` function for Keystone,
 * which is used to populate relationship fields on Mongoose documents.
 *
 * This function provides a convenient way to load related data for a document or
 * an array of documents. It is a wrapper around the `populateRelated` method that
 * is added to Mongoose documents by Keystone, and it handles both single documents
 * and arrays of documents.
 *
 * It uses the 'async' library to handle asynchronous iteration over arrays of documents.
 */
var async = require('async');

/**
 * Populates relationship fields on a document or an array of documents.
 *
 * This function is a utility to simplify the process of populating related data.
 * It checks if the input is an array and iterates over it, calling `populateRelated`
 * on each document. If it's a single document, it calls `populateRelated` on it directly.
 *
 * @param {Object|Array} docs - A Mongoose document or an array of Mongoose documents.
 * @param {string|Object} relationships - The relationship fields to populate.
 *   Can be a space-separated string of paths or an options object.
 * @param {Function} callback - A callback function to be executed when population is complete.
 * @returns {this} The Keystone instance, for chaining.
 * @api public
 * @example
 * // Populate a single document's 'author' and 'categories' fields
 * keystone.populateRelated(myPost, 'author categories', (err) => {
 *   if (err) {
 *     console.error('Error populating related data:', err);
 *   } else {
 *     console.log('Author:', myPost.author.name);
 *   }
 * });
 */
module.exports = function populateRelated (docs, relationships, callback) {
	// If `docs` is an array, iterate over each document and populate its relationships.
	if (Array.isArray(docs)) {
		async.each(docs, function (doc, done) {
			doc.populateRelated(relationships, done);
		}, callback);
	} else if (docs && docs.populateRelated) {
		// If `docs` is a single document with a `populateRelated` method, call it.
		docs.populateRelated(relationships, callback);
	} else {
		// If `docs` is not a valid document or array, simply call the callback.
		callback();
	}
	return this;
};
