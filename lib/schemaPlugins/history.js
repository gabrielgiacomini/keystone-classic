/**
 * @fileoverview This file implements the `history` schema plugin for KeystoneJS.
 *
 * The `history` plugin enables document versioning by saving a revision of a document
 * to a separate collection every time it is saved or removed.
 *
 * The plugin is enabled on a list by setting the `history` option to `true`.
 *
 * When enabled, the plugin creates a new Mongoose model for the history collection
 * and adds `pre('save')` and `pre('remove')` hooks to the list's schema. These hooks
 * create a new revision document in the history collection.
 */
var keystone = require('../../');

var historyModelSuffix = '_revisions';

/**
 * Gets the name of the history model for a given list.
 *
 * @param {keystone.List} list The list to get the history model name for.
 * @returns {string} The name of the history model.
 * @api private
 */
function getHistoryModelName (list) {
	return list.options.schema.collection + historyModelSuffix;
}

/**
 * Gets the history model for a given list.
 *
 * @param {keystone.List} list The list to get the history model for.
 * @param {string} userModel The name of the user model.
 * @returns {import('mongoose').Model<any>} The history model.
 * @api private
 */
function getHistoryModel (list, userModel) {

	var collection = getHistoryModelName(list);

	var schema = new keystone.mongoose.Schema({
		i: { type: keystone.mongoose.Schema.Types.ObjectId, ref: collection }, // item
		t: { type: Date, index: true, required: true }, // timestamp
		o: { type: String, index: true, required: true }, // operation (c, u, d)
		c: { type: [String], index: true }, // changed paths
		d: { type: keystone.mongoose.Schema.Types.Mixed, required: true }, // data
	}, {
		id: true,
		versionKey: false,
	});

	if (userModel) {
		schema.add({
			u: { type: keystone.mongoose.Schema.Types.ObjectId, ref: userModel }, // user
		});
	}

	return keystone.mongoose.model(collection, schema, collection);

}

/**
 * The main exported function for the `history` plugin.
 *
 * This function is called on a list to add the history behavior.
 * It creates the history model, adds a revision number field to the schema,
 * and sets up `pre('save')` and `pre('remove')` hooks.
 *
 * @param {keystone.List} list The list to add the history behavior to.
 * @api public
 */
module.exports = function history () {

	var list = this;

	// If model already exists for a '_revisions' in an inherited model, log a warning but skip creating the new model (inherited _revisions model will be used).
	var collectionName = getHistoryModelName(list);
	if (list.get('inherits')
		&& collectionName.indexOf(historyModelSuffix, collectionName.length - historyModelSuffix.length) !== -1
		&& keystone.mongoose.models[collectionName]) {
		console.log('List/model already exists for ' + collectionName + '.\nWon\'t re-create, keystone continuing.');
		return;
	}

	var userModel = keystone.get('user model');

	// Create the history model
	var HistoryModel = list.HistoryModel = getHistoryModel(this, userModel);

	// Add the revision number field to the schema
	list.schema.add({
		__rev: Number,
	});

	// Pre-save hook to create a revision
	list.schema.pre('save', function (next) {
		// Increment the revision number
		this.__rev = (typeof this.__rev === 'number') ? this.__rev + 1 : 1;

		// Create the revision document data
		var data = this.toObject();
		delete data._id;
		delete data.__v;
		delete data.__rev;

		var doc = {
			i: this.id,
			t: Date.now(),
			o: this.isNew ? 'c' : 'u', // 'c' for create, 'u' for update
			c: [],
			d: data,
		};

		// Record the changed paths
		for (var path in list.fields) {
			if (this.isModified(path)) {
				doc.c.push(path);
			}
		}

		// Record the changed autokey path
		if (list.autokey) {
			if (this.isModified(list.autokey.path)) {
				doc.c.push(list.autokey.path);
			}
		}

		// Record the user who made the change
		if (userModel && this._req_user) {
			doc.u = this._req_user;
		}

		// Save the revision document
		new HistoryModel(doc).save(next);
	});

	// Pre-remove hook to create a revision
	list.schema.pre('remove', function (next) {
		// Create the revision document data
		var data = this.toObject();
		data.__v = undefined;

		var doc = {
			t: Date.now(),
			o: 'd', // 'd' for delete
			d: data,
		};

		// Record the user who made the change
		if (userModel && this._req_user) {
			doc.u = this._req_user;
		}

		// Save the revision document
		new HistoryModel(doc).save(next);
	});

};
