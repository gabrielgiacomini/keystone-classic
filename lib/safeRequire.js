/**
 * @fileoverview This file provides a `safeRequire` function, a utility for
 * safely requiring modules that may not be installed. It is used throughout
 * Keystone to handle optional dependencies, providing helpful error messages
 * to the user if a required package is missing.
 *
 * If the module is not found, it logs a user-friendly error message and exits
 * the process, guiding the user to install the necessary package.
 *
 * @module lib/safeRequire
 */

/**
 * Safely requires a module, providing a helpful error message if the module
 * is not found.
 *
 * @param {string} library - The name of the module to require.
 * @param {string} feature - The name of the feature that requires the module.
 * @returns {*} The required module.
 * @throws {Error} If the module is not found, the process will exit.
 * @api public
 */
module.exports = function safeRequire (library, feature) {
	try {
		return require(library);
	} catch (error) {
		if (error.code === 'MODULE_NOT_FOUND') {
			// If the module is not found, display a user-friendly error message
			// and exit the process.
			console.error('\nTo use ' + feature + ' install ' + library);
			process.exit(1);
			return;
		}

		throw error;
	}
};
