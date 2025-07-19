/**
 * @fileoverview This file defines the `updateItem` function, which is used to
 * update a Keystone item with new data. It handles field validation, updates,
 * and error handling. It also includes helper functions for adding validation
 * and field update errors.
 */
var async = require('async');
var listToArray = require('list-to-array');
var evalDependsOn = require('../../fields/utils/evalDependsOn.js');

var MONGO_INDEX_CONSTRAINT_ERROR_REGEXP = /E11000 duplicate key error index\: [^\$]+\$(\w+) dup key\: \{ \: "([^"]+)" \}/;

/**
 * Adds a validation message to the errors object in the common format.
 *
 * @param {Object} options The options for the validation.
 * @param {Object} errors The errors object to add the message to.
 * @param {Object} field The field that failed validation.
 * @param {string} type The type of validation error.
 * @param {*} detail The details of the validation error.
 */
function addValidationError (options, errors, field, type, detail) {
	// If the detail is an error, get its message
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	var error = '';
	if (typeof detail === 'string') {
		error = detail;
	} else {
		// Use custom messages if provided
		if (type === 'required' && options.requiredMessages && options.requiredMessages[field.path]) {
			error = options.requiredMessages[field.path];
		} else if (type === 'invalid' && options.invalidMessages && options.invalidMessages[field.path]) {
			error = options.invalidMessages[field.path];
		} else {
			// Otherwise, use a generic message
			error = field.path.substr(0, 1).toUpperCase() + field.path.substr(1) + ' is ' + type;
		}
	}
	// Add the error to the errors object
	errors[field.path] = {
		type: type,
		error: error,
		detail: typeof detail === 'object' ? detail : undefined,
		fieldLabel: field.label,
		fieldType: field.type,
	};
}

/**
 * Adds a field update error message to the errors object in the common format.
 *
 * @param {Object} errors The errors object to add the message to.
 * @param {Object} field The field that failed to update.
 * @param {*} detail The details of the update error.
 */
function addFieldUpdateError (errors, field, detail) {
	// If the detail is an error, get its message
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	// Add the error to the errors object
	errors[field.path] = {
		error: typeof detail === 'string' ? detail : field.path + ' error',
		detail: typeof detail === 'object' ? detail : undefined,
		fieldLabel: field.label,
		fieldType: field.type,
	};
}

/**
 * Updates a Keystone item with new data.
 *
 * @param {Object} item The Keystone item to update.
 * @param {Object} data The new data for the item.
 * @param {Object} options The options for the update.
 * @param {function} callback The callback function to execute after the update.
 */
function updateItem (item, data, options, callback) {
	// Process arguments and options
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	if (!options) {
		options = {};
	}

	// Ignore noedit fields if fields are explicitly provided or ignoreNoEdit is true
	var ignoreNoEdit = !!(options.fields || options.ignoreNoEdit);

	// Default to all fields in the list
	var fields = options.fields || this.fieldsArray;
	// Convert fields to an array of Field instances
	fields = listToArray(fields).map(function (field) {
		return (typeof field === 'string') ? this.fields[field] : field;
	}, this);
	// Check for invalid fields
	if (fields.indexOf(undefined) >= 0) {
		return callback({
			error: 'invalid configuration',
			detail: 'Invalid path specified in fields to update [' + options.fields + '] for list ' + this.key,
		});
	}

	// Strip out noedit fields
	if (!ignoreNoEdit) {
		fields = fields.filter(function (i) {
			return !i.noedit;
		});
	}

	// Handle required fields
	var requiredFields = options.required;
	var requiredFieldPaths = {};
	if (typeof requiredFields === 'string') {
		requiredFields = listToArray(requiredFields);
	}
	if (Array.isArray(requiredFields)) {
		requiredFields.forEach(function (path) {
			requiredFieldPaths[path] = true;
		});
	} else if (typeof requiredFields === 'object') {
		requiredFieldPaths = requiredFields;
	}

	// Field Validation
	var validationErrors = {};
	function doFieldValidation (field, done) {
		// Validate the field's input
		field.validateInput(data, function (valid, detail) {
			if (!valid) {
				addValidationError(options, validationErrors, field, 'invalid', detail);
				done();
			} else {
				// Validate required fields
				if ((field.required || requiredFieldPaths[field.path])
					&& (!field.dependsOn || evalDependsOn(field.dependsOn, data))) {
					field.validateRequiredInput(item, data, function (valid, detail) {
						if (!valid) {
							addValidationError(options, validationErrors, field, 'required', detail);
						}
						done();
					});
				} else {
					done();
				}
			}
		});
	}

	// Field Updates
	var updateErrors = {};
	function doFieldUpdate (field, done) {
		var callback = function (err) {
			// If there's an error, add it to the updateErrors object
			if (err) {
				addFieldUpdateError(updateErrors, field, err);
			}
			done();
		};
		// Prepare arguments for the updateItem method
		var updateArgs = [item, data];
		if (field.updateItem.length > 3) {
			updateArgs.push(options.files);
		}
		updateArgs.push(callback);
		// Call the updateItem method
		field.updateItem.apply(field, updateArgs);
	}

	// Track plugin support
	if (options.user) {
		item._req_user = options.user;
	}

	// Flow control
	async.series([
		// Process validation
		function (doneValidation) {
			async.each(fields, doFieldValidation, function () {
				if (Object.keys(validationErrors).length) {
					return doneValidation({
						error: 'validation errors',
						detail: validationErrors,
					});
				}
				doneValidation();
			});
		},
		// Apply updates to fields
		function (doneUpdate) {
			async.each(fields, doFieldUpdate, function () {
				if (Object.keys(updateErrors).length) {
					return doneUpdate({
						error: 'field errors',
						detail: updateErrors,
					});
				}
				item.save(doneUpdate);
			});
		},
	],

	// Done
	function (err) {
		if (err) {
			if (err instanceof Error) {
				// Handle Mongoose index constraint errors
				if (err.code === 11000) {
					var indexConstraintError = MONGO_INDEX_CONSTRAINT_ERROR_REGEXP.exec(err.errmsg);
					if (indexConstraintError) {
						var probableFieldPath = indexConstraintError[1];
						probableFieldPath = probableFieldPath.substr(0, probableFieldPath.lastIndexOf('_'));
						return callback({
							error: 'database error',
							detail: 'Duplicate ' + probableFieldPath + ' value "' + indexConstraintError[2] + '" already exists',
						});
					}
				}
				// Wrap other errors
				return callback({
					error: 'database error',
					detail: err,
				});
			} else {
				// Return other error objects directly
				return callback(err);
			}
		}
		// If there are no errors, call the callback without arguments
		return callback();
	});
}

module.exports = updateItem;
