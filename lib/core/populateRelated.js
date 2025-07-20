/**
 * @fileoverview This file defines the `populateRelated` method for the Keystone instance.
 * It is used to populate relationships on a document or an array of documents.
 * @module lib/core/populateRelated
 */
var async = require('async');

/**
 * Populates relationships on a document or array of documents.
 *
 * WARNING: This is currently highly inefficient and should only be used in development, or for
 * small data sets. There are lots of things that can be done to improve performance... later.
 *
 * @param {object|object[]} docs The document or documents to populate.
 * @param {string|string[]} relationships The relationship paths to populate.
 * @param {function} callback The function to call when the population is complete.
 * @returns {this} The Keystone instance for chaining.
 * @api public
 */
module.exports = function populateRelated (docs, relationships, callback) {
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
};
