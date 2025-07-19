/**
 * @fileoverview This file defines the `Content` class, which is the main interface
 * for managing content in KeystoneJS. It provides methods for fetching, storing,
 * and registering pages, as well as initializing the underlying Mongoose model
 * for content storage. This module is typically accessed via `keystone.content`.
 *
 * It relies on `lodash`, the main `keystone` module, and `keystone.utils`.
 */

var _ = require('lodash');
var keystone = require('../../');
var utils = keystone.utils;

/**
 * Content Class
 * Provides an interface for managing content within KeystoneJS.
 * Accessed via `Keystone.content`.
 * @constructor
 * @api public
 */
var Content = function () {};

/**
 * Loads page content by a page key. If no key is provided, it returns a hash
 * of all page contents from the database.
 *
 * @param {String} [page] - The key of the page to fetch.
 * @param {Function} callback - A callback function to handle the results.
 *   @param {Error} callback.err - An error object if an error occurred.
 *   @param {Object} callback.content - The fetched content.
 * @api public
 * @example
 * keystone.content.fetch('home', function(err, content) {
 *   if (err) throw err;
 *   console.log(content);
 * });
 */
Content.prototype.fetch = function (page, callback) {
	// If the 'page' argument is a function, treat it as the callback.
	if (utils.isFunction(page)) {
		callback = page;
		page = null;
	}

	var content = this;

	// Check if any pages have been registered.
	if (!this.AppContent) {
		return callback({ error: 'invalid page', message: 'No pages have been registered.' });
	}

	if (page) {
		// If a page key is provided, fetch a single page.
		if (!this.pages[page]) {
			return callback({ error: 'invalid page', message: 'The page ' + page + ' does not exist.' });
		}

		this.AppContent.findOne({ key: page }, function (err, result) {
			if (err) return callback(err);
			// Populate the page with data from the database or an empty object.
			return callback(null, content.pages[page].populate(result ? result.content.data : {}));
		});
	} else {
		// If no page key is provided, fetch all pages.
		this.AppContent.find(function (err, results) {
			if (err) return callback(err);

			var data = {};
			// Populate data for pages found in the database.
			results.forEach(function (i) {
				if (content.pages[i.key]) {
					data[i.key] = content.pages[i.key].populate(i.content.data);
				}
			});

			// Populate data for registered pages not yet in the database.
			_.forEach(content.pages, function (i) {
				if (!data[i.key]) {
					data[i.key] = i.populate();
				}
			});

			return callback(null, data);
		});
	}
};

/**
 * Sets page content by page key, merging it with existing content.
 *
 * @param {String} page - The key of the page to store content for.
 * @param {Object} content - The content to store.
 * @param {Function} callback - A callback function to handle the result.
 *   @param {Error} callback.err - An error object if an error occurred.
 * @api public
 * @example
 * keystone.content.store('home', { title: 'Welcome' }, function(err) {
 *   if (err) throw err;
 *   console.log('Content stored successfully.');
 * });
 */
Content.prototype.store = function (page, content, callback) {
	// Ensure the page exists.
	if (!this.pages[page]) {
		return callback({ error: 'invalid page', message: 'The page ' + page + ' does not exist.' });
	}

	// Validate the content against the page's schema.
	content = this.pages[page].validate(content);

	// TODO: Handle validation errors properly.
	this.AppContent.findOne({ key: page }, function (err, doc) {
		if (err) return callback(err);

		if (doc) {
			// If the document exists, archive the current content and merge the new content.
			if (doc.content) {
				doc.history.push(doc.content);
			}
			_.defaults(content, doc.content);
		} else {
			// If the document doesn't exist, create a new one.
			doc = new this.AppContent({ key: page });
		}

		// Clean the content and set the last change date.
		doc.content = { data: this.pages[page].clean(content) };
		doc.lastChangeDate = Date.now();

		// Save the document.
		doc.save(callback);
	}.bind(this));
};

/**
 * Registers a page. This method should not be called directly; use
 * `Page.register()` instead.
 *
 * @param {String} key - The key of the page to register.
 * @param {Page} page - The page object to register.
 * @returns {Page} The registered page.
 * @api private
 */
Content.prototype.page = function (key, page) {
	// Initialize the pages object if it doesn't exist.
	if (!this.pages) {
		this.pages = {};
	}

	// If only a key is provided, return the existing page.
	if (arguments.length === 1) {
		if (!this.pages[key]) {
			throw new Error('keystone.content.page() Error: page ' + key + ' cannot be retrieved before being registered.');
		}
		return this.pages[key];
	}

	// Initialize the Mongoose model if it hasn't been already.
	this.initModel();

	// Prevent duplicate page registration.
	if (this.pages[key]) {
		throw new Error('keystone.content.page() Error: page ' + key + ' cannot be registered more than once.');
	}

	// Store the page and return it.
	this.pages[key] = page;
	return page;
};

/**
 * Ensures the Mongoose model for storing content is initialized. This method
 * is called automatically when pages are added.
 *
 * @api private
 */
Content.prototype.initModel = function () {
	// Do nothing if the model is already initialized.
	if (this.AppContent) return;

	// Define the schema for content history.
	var contentSchemaDef = {
		createdAt: { type: Date, default: Date.now },
		data: { type: keystone.mongoose.Schema.Types.Mixed },
	};
	var ContentSchema = new keystone.mongoose.Schema(contentSchemaDef);

	// Define the main schema for pages.
	var PageSchema = new keystone.mongoose.Schema({
		key: { type: String, index: true },
		lastChangeDate: { type: Date, index: true },
		content: contentSchemaDef,
		history: [ContentSchema],
	}, { collection: 'app_content' });

	// Create the Mongoose model.
	this.AppContent = keystone.mongoose.model('App_Content', PageSchema);
};

/**
 * Outputs client-side editable data for content management. This is used
 * by the Keystone UI.
 *
 * @param {Object} user - The current user object.
 * @param {Object} options - Options for generating editable data.
 *   @param {String} options.list - The key of the list to edit.
 *   @param {String} [options.id] - The ID of the item to edit.
 * @returns {String|undefined} A JSON string with editable data, or undefined if the user cannot access Keystone.
 * @api private
 */
Content.prototype.editable = function (user, options) {
	// Only return data for users who can access Keystone.
	if (!user || !user.canAccessKeystone) {
		return undefined;
	}

	if (options.list) {
		// Get the list by its key.
		var list = keystone.list(options.list);

		// Handle cases where the list is not found.
		if (!list) {
			return JSON.stringify({ type: 'error', err: 'list not found' });
		}

		// Prepare the data object for the client-side UI.
		var data = {
			type: 'list',
			path: list.getAdminURL(),
			singular: list.singular,
			plural: list.plural,
		};

		// Include the item ID if provided.
		if (options.id) {
			data.id = options.id;
		}

		return JSON.stringify(data);
	}
};

/**
 * The exports object is an instance of Content, making it the main interface
 * for this module.
 *
 * @api public
 */
module.exports = new Content();

/**
 * Expose the Page and Types classes for easier access.
 */
exports.Page = require('./page');
exports.Types = require('./types');
