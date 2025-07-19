/**
 * @fileoverview This file defines a transform function for KeystoneJS lists.
 *
 * This transform function is used to modify the output of `toJSON` and `toObject` calls on a document.
 * It ensures that any relationships that have been populated using `getRelated` or `populateRelated`
 * are included in the output.
 *
 * This is configured as a `transform` option on the list's schema.
 */

var _ = require('lodash');

/**
 * The transform function.
 *
 * This function is called with the document and the returned object.
 * It checks for a `_populatedRelationships` property on the document, which is
 * set by the `getRelated` method. If this property exists, it iterates over
 * the populated relationships and adds them to the returned object.
 *
 * @param {Object} doc The mongoose document.
 * @param {Object} ret The object to be returned.
 * @api public
 */
module.exports = function transform (doc, ret) {
	// If there are populated relationships, add them to the returned object
	if (doc._populatedRelationships) {
		_.forEach(doc._populatedRelationships, function (on, key) {
			if (!on) return;
			ret[key] = doc[key];
		});
	}
};
