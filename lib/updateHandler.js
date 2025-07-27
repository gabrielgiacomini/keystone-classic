/**
 * @fileoverview This file defines the `UpdateHandler` class, a utility for
 * processing and validating form data before updating a Keystone item. It is
 * designed to be used in routes and controllers to handle the data submitted
 * from forms, including file uploads.
 *
 * The `UpdateHandler` simplifies the process of updating items by providing a
 * consistent interface for handling validation errors, flashing error messages,
 * and managing uploaded files. It integrates with Keystone's `List.updateItem`
 * method to perform the actual update.
 *
 * @module lib/updateHandler
 * @typedef {import('./list')} List
 * @typedef {import('./item')} Item
 * @requires lodash
 * @requires object-assign
 * @see module:lib/list
 */
var _ = require('lodash');
var assign = require('object-assign');

/**
 * UpdateHandler constructor.
 *
 * @param {List} list
 * @param {Item} item
 * @param {import('express').Request} req
 * @param {Object} options
 * @param {string|string[]} options.fields
 * @param {Object} options.files
 * @param {string|string[]|Object} options.required
 * @param {import('../list/user')} options.user
 * @param {boolean|string} options.flashErrors
 * @param {string} options.errorMessage
 * @param {Object} options.invalidMessages
 * @param {Object} options.requiredMessages
 * @constructor
 */
// NOTE: the old signature was UpdateHandler (list, item, req, res, options)
// the `res` argument has been deprecated, but we still detect and handle it
function UpdateHandler (list, item, req, options) {
	this.list = list;
	this.item = item;
	this.req = req;
	if (arguments.length === 5) {
		// old signature; set options to the last argument
		options = arguments[4];
	}
	this.options = options || {};
}

/*
Options:

(passed to List.updateItem)
options.fields: list or array of fields to process
options.files: files object for processing uploads, defaults to req.files
options.required: list or array or object of keys: true | false
options.user: the user to provide for item tracking, defaults to req.user

(UpdateHandler specific)
options.flashErrors: whether to put error messages in req.flash
options.errorMessage: string, error message to display w/ req.flash
options.invalidMessages: object of keys: message to display for invalid fields
options.requiredMessages: object of keys: message to display for required fields
*/

/*
TODO:
We could allow a custom function for formatting errors that are put in
req.flash, because most use-cases will be covered by the generic handling
but it's an "all or none" proposition at the moment
*/
/**
 * Processes the update request.
 *
 * @param {Object} data - The data to update the item with.
 * @param {Object} options - The options for the update.
 * @param {function} callback - The callback to call when the update is complete.
 * @api public
 */
UpdateHandler.prototype.process = function (data, options, callback) {

	// options is not required
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	var item = this.item;
	var list = this.list;
	var req = this.req;
	options = assign({}, this.options, options);

	// pass the user from the request by default
	if (!options.user) {
		options.user = req && req.user;
	}

	// pass the uploaded files object from the request by default
	if (!options.files) {
		options.files = req && req.files;
	}
	/**
	 * Flashes validation errors to the request.
	 *
	 * @param {Object} err - The error object.
	 * @private
	 */
	function flashErrors (err) {
		var errorMessage = options.errorMessage || 'There was a problem saving your changes';
		// Detect Keystone validation errors
		if (err.error === 'validation errors') {
			if (options.flashErrors === true || options.flashErrors === 'validation') {
				req.flash('error', {
					type: 'ValidationError',
					title: errorMessage,
					// TODO: Apply custom invalidMessages / requiredMessages
					list: _.map(err.detail, 'error'),
				});
			}
		}
		// Detect Mongoose validation errors
		else if (err.name === 'ValidationError') {
			if (options.flashErrors === true || options.flashErrors === 'validation') {
				req.flash('error', {
					type: 'ValidationError',
					title: errorMessage,
					list: _.map(err.errors, 'message'),
				});
			}
		}
		// Detect Keystone field update errors
		else if (err.error === 'field errors') {
			if (options.flashErrors === true || options.flashErrors === 'update') {
				req.flash('error', {
					type: 'UpdateError',
					title: errorMessage,
					list: _.map(err.detail, 'error'),
				});
			}
		}
		// Fallback
		else {
			if (options.flashErrors === true || options.flashErrors === 'update') {
				var errors = [];
				if (typeof err.error === 'string') {
					errors.push(err.error);
				}
				if (typeof err.detail === 'string') {
					errors.push(err.detail);
				}
				req.flash('error', {
					type: 'UpdateError',
					title: errorMessage,
					list: errors.length ? errors : undefined,
				});
			}
		}
	}

	this.list.updateItem(this.item, data, options, function (err) {
		if (err) {
			if (options.logErrors) {
				console.log('Error saving changes to ' + list.singular + ' ' + item.id + ':', err);
			}
			if (options.flashErrors) {
				flashErrors(err);
			}
		}
		callback(err);
	});

};

module.exports = UpdateHandler;
