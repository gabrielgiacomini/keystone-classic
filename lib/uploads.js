/**
 * @fileoverview This file provides functionalities for handling file uploads
 * in Keystone. It integrates with the `multer` middleware to process multipart
 * form data and makes uploaded files available in a structured format.
 *
 * It also includes a cleanup mechanism to automatically remove temporary files
 * after the request is complete, ensuring that the server does not accumulate
 * unnecessary files.
 *
 * @module lib/uploads
 * @typedef {import('./list')} List
 * @requires fs
 * @requires multer
 * @requires os
 * @see module:lib/storage/index
 */
var fs = require('fs');
var multer = require('multer');
var os = require('os');
/**
 * Middleware for handling uploaded files.
 *
 * This function processes the `req.files` array from `multer` and organizes
 * it into an object where each key is the field name. It also sets up a
 * cleanup process to remove temporary files after the request is finished.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {function} next - The next middleware function.
 * @api private
 */
function handleUploadedFiles (req, res, next) {
	if (!req.files || !Array.isArray(req.files)) return next();
	var originalFiles = req.files;
	var files = {};
	originalFiles.forEach(function (i) {
		if (i.fieldname in files) {
			var tmp = files[i.fieldname];
			files[i.fieldname] = [tmp];
		}
		if (Array.isArray(files[i.fieldname])) {
			files[i.fieldname].push(i);
		} else {
			files[i.fieldname] = i;
		}
	});
	req.files = files;
	var cleanup = function () {
		originalFiles.forEach(function (i) {
			if (i.path) {
				fs.unlink(i.path, function () {});
			}
		});
	};
	res.on('close', cleanup);
	res.on('finish', cleanup);
	next();
};

exports.handleUploadedFiles = handleUploadedFiles;
/**
 * Configures the uploads middleware.
 *
 * This function sets up the `multer` middleware with the specified options
 * and adds the `handleUploadedFiles` middleware to the app.
 *
 * @param {Object} app - The Express app.
 * @param {Object} options - The options for `multer`.
 * @api public
 */
exports.configure = function (app, options) {
	var upload = multer(options || {
		dest: os.tmpdir(),
	});
	app.use(upload.any());
	app.use(handleUploadedFiles);
};
