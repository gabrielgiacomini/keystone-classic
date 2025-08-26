/**
 * @fileoverview This file implements the `sortable` schema plugin for KeystoneJS.
 *
 * The `sortable` plugin adds a `sortOrder` field to a list's schema and provides
 * functionality to reorder documents.
 *
 * The plugin is enabled on a list by setting the `sortable` option to `true`.
 *
 * When a new document is created, it is assigned a `sortOrder`. By default, it is
 * added to the end of the list, but this can be configured to add it to the beginning.
 *
 * The plugin also adds a static `reorderItems` method to the schema to allow for
 * easy reordering of documents.
 */

/**
 * The main exported function for the `sortable` plugin.
 *
 * This function is called on a list to add the sortable behavior.
 * It adds the `sortOrder` field to the schema and a `pre('save')` hook
 * to automatically assign a `sortOrder` to new documents.
 *
 * @param {keystone.List} list The list to add the sortable behavior to.
 * @api public
 */
module.exports = function sortable () {

	var list = this;

	// Add the sortOrder field to the schema
	this.add({
		sortOrder: { type: Number, index: true, hidden: true },
	});

	// Pre-save hook to assign a sortOrder
	this.schema.pre('save', function (next) {

		// If a sortOrder is already assigned, do nothing
		if (typeof this.sortOrder === 'number') {
			return next();
		}

		var item = this;

		// Function to add the item to the end of the list
		var addLast = function (done) {
			list.model.findOne().sort('-sortOrder').exec(function (err, max) { // eslint-disable-line no-unused-vars, handle-callback-err
				item.sortOrder = (max && max.sortOrder) ? max.sortOrder + 1 : 1;
				done();
			});
		};

		// If the sortable option is set to 'unshift', add the item to the beginning of the list
		if (list.get('sortable') === 'unshift') {
			list.model.where('sortOrder')
				.setOptions({ multi: true })
				.update(
					{ $inc: { sortOrder: 1 } },
					function (err) {
						if (err) {
							console.log('err', err);
							return addLast(next);
						}
						item.sortOrder = 1;
						next();
					}
				);
		} else {
			// Otherwise, add the item to the end of the list
			addLast(next);
		}
	});

	/**
	 * Reorders a document in the list.
	 *
	 * @param {string} id The ID of the document to reorder.
	 * @param {number} prevOrder The previous sort order of the document.
	 * @param {number} newOrder The new sort order of the document.
	 * @param {(err?: Error) => void} cb A callback function to execute when the reordering is complete.
	 *
	 * @api public
	 */
	this.schema.statics.reorderItems = function reorderItems (id, prevOrder, newOrder, cb) {

		prevOrder = parseFloat(prevOrder);
		newOrder = parseFloat(newOrder);

		// Determine which way to shift the other items
		var whichWay = (newOrder > prevOrder) ? -1 : 1;
		var gte = (newOrder > prevOrder) ? prevOrder + 1 : newOrder;
		var lte = (newOrder > prevOrder) ? newOrder : prevOrder - 1;

		// Update the sortOrder of the other items
		return list.model
			.where('sortOrder')
			.gte(gte)
			.lte(lte)
			.setOptions({ multi: true })
			.update({ $inc: { sortOrder: whichWay } }, function (err) {
				if (err) {
					console.log('err', err);
				}
				// Update the sortOrder of the item being moved
				list.model.findOneAndUpdate({ _id: id }, { sortOrder: newOrder }).exec(cb);
			});
	};

};
