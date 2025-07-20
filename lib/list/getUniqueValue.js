/**
 * @fileoverview This file defines the `getUniqueValue` function, which gets a
 * unique value from a generator method by checking for documents with the same
 * value.
 */

/**
 * Gets a unique value from a generator method by checking for documents with the same value.
 *
 * To avoid infinite loops when a unique value cannot be found, it will bail and pass back an
 * undefined value after 10 attempts.
 *
 * WARNING: Because there will always be a small amount of time between checking for an
 * existing value and saving a document, race conditions can occur and it is possible that
 * another document has the 'unique' value assigned at the same time.
 *
 * Because of this, if true uniqueness is required, you should also create a unique index on
 * the database path, and handle duplicate errors thrown on save.
 *
 * @param {string} path Path to check for uniqueness.
 * @param {function(): any} generator Method to call to generate a new value.
 * @param {number} [limit=10] The maximum number of attempts.
 * @param {function(Error, any): void} callback `function(err, uniqueValue)`
 */
function getUniqueValue (path, generator, limit, callback) {
	var model = this.model;
	var count = 0;
	var value;
	if (typeof limit === 'function') {
		callback = limit;
		limit = 10;
	}
	if (Array.isArray(generator)) {
		var fn = generator[0];
		var args = generator.slice(1);
		generator = function () {
			return fn.apply(this, args);
		};
	}
	var check = function () {
		if (count++ > 10) {
			return callback(undefined, undefined);
		}
		value = generator();
		model.count().where(path, value).exec(function (err, matches) {
			if (err) return callback(err);
			if (matches) return check();
			callback(undefined, value);
		});
	};
	check();
}

module.exports = getUniqueValue;
