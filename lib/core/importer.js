/**
 * @fileoverview This file provides a utility for recursively importing modules from a directory.
 *
 * The `dispatchImporter` function returns an importer function that can be used to load all `.js`
 * files within a specified directory tree. This is particularly useful for organizing routes,
 * models, or other components of a Keystone application into separate files and directories.
 *
 * This module uses 'fs' for file system operations, 'debug' for logging, and 'path' for
 * handling file paths.
 */
var fs = require('fs');
var debug = require('debug')('keystone:core:importer');
var path = require('path');

/**
 * Creates and returns an importer function for a given base directory.
 *
 * The returned function can be used to recursively import all `.js` modules from a
 * specified path relative to the base directory. The imported modules are returned
 * as a nested object that mirrors the directory structure.
 *
 * @param {string} rel__dirname - The base directory from which to import, typically `__dirname`.
 * @returns {Function} An importer function.
 * @api public
 * @example
 * // In your main application file
 * const keystone = require('keystone');
 * const importRoutes = keystone.importer(__dirname);
 *
 * // Import all routes from the './routes' directory
 * const routes = {
 *   site: importRoutes('./routes/site'),
 *   api: importRoutes('./routes/api')
 * };
 */
function dispatchImporter (rel__dirname) {

	/**
	 * Recursively imports modules from a given path.
	 *
	 * @param {string} from - The path to import modules from, relative to `rel__dirname`.
	 * @returns {Object} A nested object containing the imported modules.
	 * @private
	 */
	function importer (from) {
		debug('importing ', from);
		var imported = {};
		var joinPath = function () {
			return '.' + path.sep + path.join.apply(path, arguments);
		};

		// Construct the full file system path.
		var fsPath = joinPath(path.relative(process.cwd(), rel__dirname), from);
		fs.readdirSync(fsPath).forEach(function (name) {
			var info = fs.statSync(path.join(fsPath, name));
			debug('recur');
			if (info.isDirectory()) {
				// If it's a directory, recurse into it.
				imported[name] = importer(joinPath(from, name));
			} else {
				// If it's a file, check if it's a require-able module.
				var ext = path.extname(name);
				var base = path.basename(name, ext);
				if (require.extensions[ext]) {
					// If so, require it and add it to the imported object.
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
