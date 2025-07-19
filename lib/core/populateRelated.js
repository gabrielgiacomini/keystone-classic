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
 * @example
 * // For a single document
 * keystone.populateRelated(myPost, 'author categories', (err) => { ... });
 *
 * // For an array of documents
 * keystone.populateRelated(allPosts, 'author', (err) => { ... });
 */
var async = require('async');

/**
 * Populates relationships on a document or array of documents
 *
 * WARNING: This is currently highly inefficient and should only be used in development, or for
 * small data sets. There are lots of things that can be done to improve performance... later.
 *
 * @api public
 */
function populateRelated (docs, relationships, callback) {
	if (Array.isArray(docs)) {
		async.each(docs, function (doc, done) {
			doc.populateRelated(relationships, done);
		}, callback);
	} else if (docs && docs.populateRelated) {
		docs.populateRelated(relationships, callback);
	} else {
		callback();
	}
	return this;
}
module.exports = populateRelated;
