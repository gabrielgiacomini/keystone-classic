/**
 * @fileoverview This file defines the `importer` method for the Keystone instance.
 * It provides a simple way to import all modules from a directory.
 * @module lib/core/importer
 */
var fs = require('fs');
var debug = require('debug')('keystone:core:importer');
var path = require('path');

/**
 * Returns a function that looks in a specified path relative to the current
 * directory, and returns all .js modules in it (recursively).
 *
 * @param {string} rel__dirname The directory to import modules from, relative to the current working directory.
 * @returns {function(string): object} A function that takes a path and returns an object containing the imported modules.
 * @example
 * // In your main app file:
 * var importRoutes = keystone.importer(__dirname);
 *
 * var routes = {
 *   site: importRoutes('./routes/site'),
 *   api: importRoutes('./routes/api')
 * };
 *
 * // routes.api now contains all the modules exported from the ./routes/api directory
 *
 * @api public
 */
function dispatchImporter (rel__dirname) {

	/**
	 * The importer function.
	 *
	 * @param {string} from The path to import modules from, relative to the `rel__dirname` provided to the factory.
	 * @returns {object} An object containing the imported modules.
	 * @private
	 */
	function importer (from) {
		debug('importing ', from);
		var imported = {};
		var joinPath = function () {
			return '.' + path.sep + path.join.apply(path, arguments);
		};

		var fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
		fs.readdirSync(fsPath).forEach(function (name) {
			var info = fs.statSync(path.join(fsPath, name));
			debug('recur');
			if (info.isDirectory()) {
				imported[name] = importer(joinPath(from, name));
			} else {
				// only import files that we can `require`
				var ext = path.extname(name);
				var base = path.basename(name, ext);
				if (require.extensions[ext]) {
					imported[base] = require(path.join(rel__dirname, from, name));
				} else {
					debug('cannot require ', ext);
				}
			}
		});

		return imported;
	}

	return importer;
}

module.exports = dispatchImporter;
