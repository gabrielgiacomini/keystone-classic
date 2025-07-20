/**
 * @fileoverview Implements the FS (File System) adapter for Keystone's storage
 * system. This adapter allows Keystone to store and manage files on the local
 * file system. It handles file uploads, deletions, and URL generation for
 * accessing the files.
 *
 * It relies on `keystone-storage-namefunctions` for filename generation and
 * retry logic, and uses `fs-extra` for file system operations.
 *
 * @module lib/storage/adapters/fs/index
 * @typedef {import('../../../list')} List
 * @typedef {import('../../../field')} Field
 * @requires object-assign
 * @requires keystone-storage-namefunctions
 * @requires fs-extra
 * @requires path
 * @requires sanitize-filename
 * @requires url
 * @requires debug
 * @see module:lib/storage/index
 */
var assign = require('object-assign');
var ensureCallback = require('keystone-storage-namefunctions/ensureCallback');
var fs = require('fs-extra');
var nameFunctions = require('keystone-storage-namefunctions');
var path = require('path');
var prototypeMethods = require('keystone-storage-namefunctions/prototypeMethods');
var sanitize = require('sanitize-filename');
var url = require('url');

var debug = require('debug')('keystone:storage:adapter:fs');

var DEFAULT_OPTIONS = {
	generateFilename: nameFunctions.randomFilename,
	whenExists: 'retry',
	retryAttempts: 3, // For whenExists: 'retry'.
};
/**
 * Ensures that the specified path exists and is writable. This is a synchronous
 * operation that is performed on server startup.
 *
 * If the path does not exist, it will be created. If the path is not a directory
 * or is not writable, an error will be thrown.
 *
 * @param {string} path - The path to ensure exists.
 * @private
 */
function ensurePath (path) {
	// Ensure that the specified path exists and is writable. This is quick and
	// happens on server startup, so sync functions are ok.
	try {
		// accessSync throws if the item doesn't exist or we don't have
		// permission to read + write it.
		fs.accessSync(path, fs.R_OK | fs.W_OK);

		if (!fs.statSync(path).isDirectory()) {
			throw Error('Specified output path is not a directory');
		}
	} catch (e) {
		if (e.code === 'ENOENT') {
			// Recover by creating the directory.
			fs.mkdirsSync(path);
			debug('Storage output path \'' + path + '\' created');
			return;
		}
		throw e;
	}
}
/**
 * FSAdapter constructor.
 *
 * @param {Object} options - The options for the adapter.
 * @param {Object} schema - The schema for the storage field.
 * @constructor
 */
function FSAdapter (options, schema) {
	if (!schema.filename) throw Error('Cannot use FSAdapter without storing filename');

	this.options = assign({}, DEFAULT_OPTIONS, options.fs);
	debug('Initialising FS Adapter with options', this.options);

	this.options.generateFilename = ensureCallback(this.options.generateFilename);
	ensurePath(this.options.path);
}

FSAdapter.compatibilityLevel = 1;

// All the extra schema fields supported by this adapter.
FSAdapter.SCHEMA_TYPES = {
	// This adapter stores its key in the name of a file on disk.
	filename: String,
};

FSAdapter.SCHEMA_FIELD_DEFAULTS = {
	filename: true,
};

/**
	Inherit common prototype behaviours for generating and retrying filenames
	from the keystone-storage-namefunctions package
*/
FSAdapter.prototype.getFilename = prototypeMethods.getFilename;
FSAdapter.prototype.retryFilename = prototypeMethods.retryFilename;

/**
	Gets the public path of a stored file by combining the publicPath option
	with the filename in the field value
*/
FSAdapter.prototype.getFileURL = function (file) {
	var publicPath = this.options.publicPath;
	if (!publicPath) return null; // No URL.

	return url.resolve(publicPath, file.filename);
};

/**
	Private function for getting the on-disk filename
*/
FSAdapter.prototype.pathForFile = function (filename) {
	return path.resolve(this.options.path, sanitize(filename));
};

/**
 * Uploads a file at the specified path and returns the value to be stored
 * in the field value. The file argument must be an object as per the [multer
 * file information spec](https://github.com/expressjs/multer#file-information)
 *
 * @param {Object} file - The file object from multer.
 * @param {function} callback - The callback to call when the upload is complete.
 * @api public
 */
FSAdapter.prototype.uploadFile = function (file, callback) {
	debug('Uploading file', file);
	var options = this.options;
	this.getFilename(file, function (err, filename) {
		if (err) return callback(err);
		filename = sanitize(filename) + path.parse(file.originalname).ext;
		debug('Uploading file with filename: %s', filename);
		var uploadPath = path.resolve(options.path, filename);
		var fsOptions = {};
		fsOptions.clobber = options.whenExists === 'overwrite';
		fs.move(file.path, uploadPath, fsOptions, function (err) {
			if (err) return callback(err);

			// TODO: Chmod the file.

			var data = {
				filename: filename,
				size: file.size,
				mimetype: file.mimetype,
				path: options.path,
				originalname: file.originalname,
			};
			debug('Uploaded file, returning data', data);
			callback(null, data);
		});
	});
};
/**
 * Removes a file from the file system.
 *
 * @param {Object} file - The file object to remove.
 * @param {function} callback - The callback to call when the file is removed.
 * @api public
 */
FSAdapter.prototype.removeFile = function (file, callback) {
	debug('Removing file', file);
	fs.unlink(this.pathForFile(file.filename), function (err) {
		if (err && err.code === 'ENOENT') {
			// The file doesn't exist.
			console.warn('Attempted to remove a non-existant file');
			return callback();
		}

		callback(err);
	});
};
/**
 * Checks if a file exists on the file system.
 *
 * @param {string} filename - The name of the file to check.
 * @param {function} callback - The callback to call with the result.
 * @api public
 */
FSAdapter.prototype.fileExists = function (filename, callback) {
	var path = this.pathForFile(filename);
	debug('Checking for file at path %s', filename);
	// Returns (err, bool) to the callback based on whether or not the file
	// already exists. Used if whenExists: 'error' or 'retry' in the options
	fs.stat(path, function (err, stats) {
		if (err && err.code === 'ENOENT') {
			// File does not exist
			callback(null, false);
		} else if (err) {
			// Other error getting file info
			callback(err);
		} else if (stats.isFile()) {
			// File does exist
			callback(null, true);
		} else {
			// Object at path is not a file
			callback(Error('Invalid save destination - dest is not a file'));
		}
	});
};

module.exports = FSAdapter;
