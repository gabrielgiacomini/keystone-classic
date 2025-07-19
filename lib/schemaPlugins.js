/**
 * @fileoverview This file serves as a central export point for all schema
 * plugins available in Keystone. Schema plugins are used to extend Mongoose
 * schemas with additional functionality, such as tracking, history, and
 * autokey generation.
 *
 * By centralizing the exports, this file makes it easy to discover and import
 * the available schema plugins from other parts of the Keystone application.
 *
 * @module lib/schemaPlugins
 */

/**
 * Exports the `sortable` schema plugin.
 * @see module:lib/schemaPlugins/sortable
 */
exports.sortable = require('./schemaPlugins/sortable');

/**
 * Exports the `autokey` schema plugin.
 * @see module:lib/schemaPlugins/autokey
 */
exports.autokey = require('./schemaPlugins/autokey');

/**
 * Exports the `track` schema plugin.
 * @see module:lib/schemaPlugins/track
 */
exports.track = require('./schemaPlugins/track');

/**
 * Exports the `history` schema plugin.
 * @see module:lib/schemaPlugins/history
 */
exports.history = require('./schemaPlugins/history');

/**
 * Exports schema methods.
 * @property {function} getRelated - The `getRelated` method.
 * @property {function} populateRelated - The `populateRelated` method.
 */
exports.methods = {
	getRelated: require('./schemaPlugins/methods/getRelated'),
	populateRelated: require('./schemaPlugins/methods/populateRelated'),
};

/**
 * Exports schema options.
 * @property {function} transform - The `transform` option.
 */
exports.options = {
	transform: require('./schemaPlugins/options/transform'),
};
