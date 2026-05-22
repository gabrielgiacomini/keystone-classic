import listToArray from './listToArray.mjs';
import evalDependsOn from '../../fields/utils/evalDependsOn.mjs';

const MONGO_INDEX_CONSTRAINT_ERROR_REGEXP = /E11000 duplicate key error index\: [^\$]+\$(\w+) dup key\: \{ \: "([^"]+)" \}/;

/** Subset of a Keystone field instance used by this module. */
interface KeystoneField {
	path: string;
	label: string;
	type: string;
	required: boolean | (() => boolean);
	noedit: boolean;
	dependsOn: Record<string, unknown> | false;
	validateInput(
		data: Record<string, unknown>,
		callback: (valid: boolean, detail?: unknown) => void,
	): void;
	validateRequiredInput(
		item: MongooseDoc,
		data: Record<string, unknown>,
		callback: (valid: boolean, detail?: unknown) => void,
	): void;
	/** Length indicates whether the `files` argument is expected. */
	updateItem(
		item: MongooseDoc,
		data: Record<string, unknown>,
		...args: unknown[]
	): void;
	/** `apply` is inherited from Function — typed explicitly for the call-site below. */
	apply(thisArg: KeystoneField, args: unknown[]): void;
}

/** Minimal shape of a Mongoose document as used here. */
interface MongooseDoc {
	_req_user?: unknown;
	save(): Promise<void>;
}

/** Options accepted by `updateItem`. */
interface UpdateItemOptions {
	fields?: string | string[];
	ignoreNoEdit?: boolean;
	required?: string | string[] | Record<string, boolean>;
	requiredMessages?: Record<string, string>;
	invalidMessages?: Record<string, string>;
	files?: unknown;
	user?: unknown;
}

/** Keystone list context (`this` inside updateItem). */
interface KeystoneList {
	fieldsArray: KeystoneField[];
	fields: Record<string, KeystoneField>;
	key: string;
}

/** Structured error passed to the callback on validation / DB failure. */
interface UpdateItemError {
	error: string;
	detail?: unknown;
}

/** Shape of a MongoDB duplicate-key (E11000) error. */
interface MongoE11000Error extends Error {
	code: 11000;
	errmsg: string;
}

/** Validation / field-error payloads tagged with `.error` by this module. */
interface TaggedError extends Error {
	error: string;
	detail: Record<string, ValidationErrorEntry | FieldUpdateErrorEntry>;
}

interface ValidationErrorEntry {
	type: string;
	error: string;
	detail: unknown;
	fieldLabel: string;
	fieldType: string;
}

interface FieldUpdateErrorEntry {
	error: string;
	detail: unknown;
	fieldLabel: string;
	fieldType: string;
}

function addValidationError(
	options: UpdateItemOptions,
	errors: Record<string, ValidationErrorEntry>,
	field: KeystoneField,
	type: string,
	detail: unknown,
): void {
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	let error = '';
	if (typeof detail === 'string') {
		error = detail;
	} else {
		const requiredOverride = options.requiredMessages?.[field.path];
		const invalidOverride = options.invalidMessages?.[field.path];
		if (type === 'required' && requiredOverride) {
			error = requiredOverride;
		} else if (type === 'invalid' && invalidOverride) {
			error = invalidOverride;
		} else {
			error = field.path.slice(0, 1).toUpperCase() + field.path.slice(1) + ' is ' + type;
		}
	}
	errors[field.path] = {
		type: type,
		error: error,
		detail: typeof detail === 'object' ? detail : undefined,
		fieldLabel: field.label,
		fieldType: field.type,
	};
}

function addFieldUpdateError(
	errors: Record<string, FieldUpdateErrorEntry>,
	field: KeystoneField,
	detail: unknown,
): void {
	if (detail instanceof Error) {
		detail = detail.name !== 'Error' ? detail.name + ': ' + detail.message : detail.message;
	}
	errors[field.path] = {
		error: typeof detail === 'string' ? detail : field.path + ' error',
		detail: typeof detail === 'object' ? detail : undefined,
		fieldLabel: field.label,
		fieldType: field.type,
	};
}

/**
 * Validates and applies `data` to `item`, then saves it to the database.
 * Runs `validateInput` and `validateRequiredInput` on each field before updating.
 * Calls `callback` with a structured error object on validation or database failure.
 */
export default function updateItem(this: KeystoneList, item: MongooseDoc, data: Record<string, unknown>, options: UpdateItemOptions | ((err?: UpdateItemError) => void), callback: (err?: UpdateItemError) => void): void {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	const ignoreNoEdit = !!(options.fields || options.ignoreNoEdit);
	const fieldsSource: KeystoneField[] | string | string[] = options.fields || this.fieldsArray;
	const resolvedFields: (KeystoneField | undefined)[] = listToArray(fieldsSource).map(function (this: KeystoneList, field: string | KeystoneField) {
		return (typeof field === 'string') ? this.fields[field] : field;
	}, this);

	if (resolvedFields.includes(undefined)) {
		const fieldsForMessage = Array.isArray(options.fields)
			? options.fields.join(', ')
			: options.fields ?? '';
		return callback({
			error: 'invalid configuration',
			detail: 'Invalid path specified in fields to update [' + fieldsForMessage + '] for list ' + this.key,
		});
	}

	let fields = resolvedFields as KeystoneField[];

	if (!ignoreNoEdit) {
		fields = fields.filter(function (i: KeystoneField) { return !i.noedit; });
	}

	let requiredFields = options.required;
	let requiredFieldPaths: Record<string, boolean> = {};
	if (typeof requiredFields === 'string') {
		requiredFields = listToArray(requiredFields);
	}
	if (Array.isArray(requiredFields)) {
		requiredFields.forEach(function (path: string) { requiredFieldPaths[path] = true; });
	} else if (typeof requiredFields === 'object') {
		requiredFieldPaths = requiredFields;
	}

	const validationErrors: Record<string, ValidationErrorEntry> = {};
	function doFieldValidation(field: KeystoneField, done: () => void) {
		field.validateInput(data, function (valid: boolean, detail: unknown) {
			if (!valid) {
				addValidationError(options as UpdateItemOptions, validationErrors, field, 'invalid', detail);
				done();
			} else {
				if ((field.required || requiredFieldPaths[field.path])
					&& (!field.dependsOn || evalDependsOn(field.dependsOn, data))
				) {
					field.validateRequiredInput(item, data, function (valid2: boolean, detail2: unknown) {
						if (!valid2) { addValidationError(options as UpdateItemOptions, validationErrors, field, 'required', detail2); }
						done();
					});
				} else {
					done();
				}
			}
		});
	}

	const updateErrors: Record<string, FieldUpdateErrorEntry> = {};
	function doFieldUpdate(field: KeystoneField, done: () => void) {
		const cb = function (err: unknown) {
			if (err) { addFieldUpdateError(updateErrors, field, err); }
			done();
		};
	const updateArgs: unknown[] = [item, data];
	if (field.updateItem.length > 3) { updateArgs.push((options as UpdateItemOptions).files); }
	updateArgs.push(cb);
	field.updateItem.apply(field, updateArgs as [MongooseDoc, Record<string, unknown>, ...unknown[]]);
}

	if (options.user) { item._req_user = options.user; }

	(async function () {
		await Promise.all(fields.map(function (field: KeystoneField) {
			return new Promise<void>(function (resolve) { doFieldValidation(field, resolve); });
		}));
		if (Object.keys(validationErrors).length) {
			const validationErr = Object.assign(new Error('validation errors'), {
				error: 'validation errors',
				detail: validationErrors,
			});
			throw validationErr;
		}

		await Promise.all(fields.map(function (field: KeystoneField) {
			return new Promise<void>(function (resolve) { doFieldUpdate(field, resolve); });
		}));
		if (Object.keys(updateErrors).length) {
			const fieldErr = Object.assign(new Error('field errors'), {
				error: 'field errors',
				detail: updateErrors,
			});
			throw fieldErr;
		}

		await item.save();
	}()).then(function () {
		return callback();
	}, function (err: unknown) {
		if (err instanceof Error) {
			// Validation/field errors thrown above are tagged with `err.error`
			// (e.g. 'validation errors', 'field errors') so callers can map
			// them to a 400 response. Preserve that classification rather
			// than re-wrapping as a 'database error'.
			if ((err as TaggedError).error) {
				return callback(err as TaggedError);
			}
			const mongoErr = err as Partial<MongoE11000Error>;
			if (mongoErr.code === 11000 && typeof mongoErr.errmsg === 'string') {
				const indexConstraintError = MONGO_INDEX_CONSTRAINT_ERROR_REGEXP.exec(mongoErr.errmsg);
				if (indexConstraintError) {
					let probableFieldPath = indexConstraintError[1] ?? '';
					probableFieldPath = probableFieldPath.slice(0, probableFieldPath.lastIndexOf('_'));
					return callback({
						error: 'database error',
						detail: 'Duplicate ' + probableFieldPath + ' value "' + (indexConstraintError[2] ?? '') + '" already exists',
					});
				}
			}
			return callback({ error: 'database error', detail: err });
		}
		return callback(err as UpdateItemError | undefined);
	});
}
