import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import type { Schema } from 'mongoose';
import { defer } from '../../../lib/utils/async.mjs';
import debugLib from 'debug';

const debug = debugLib('keystone:fields:file');

// ---------------------------------------------------------------------------
// Value type
// ---------------------------------------------------------------------------

/** Shape of a value stored by the File field on a Mongoose document. */
export interface FileValue {
	filename?: string;
	originalname?: string;
	path?: string;
	size?: number;
	filetype?: string;
	url?: string;
	[key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Storage adapter interface
// ---------------------------------------------------------------------------

/**
 * Minimal shape of the storage object required by the File field.
 * Returned by `new keystone.Storage(...)` — the field accesses `.schema`,
 * `.uploadFile`, and `.removeFile` at runtime.
 */
export interface KeystoneFileStorage {
	/** Map of schema field names to their JS type constructors (e.g. `{ size: Number, mimetype: String }`). */
	schema: Record<string, unknown>;
	/**
	 * Uploads a file and returns the stored metadata.
	 * @param file The uploaded file object (must have a `path` property).
	 * @param callback Called with `(err, result)` where `result` is the stored file metadata.
	 */
	uploadFile(file: Record<string, unknown>, callback: (err: Error | null, result?: Record<string, unknown>) => void): void;
	/**
	 * Removes a file from the storage backend.
	 * @param file The stored file metadata object.
	 */
	removeFile(file: Record<string, unknown>): void;
}

// ---------------------------------------------------------------------------
// Options interface
// ---------------------------------------------------------------------------

/**
 * Options bag for the File field type constructor.
 */
export interface KeystoneFieldOptionsForFileType extends FieldOptionsBase {
	/**
	 * A configured storage instance (required).
	 * Use `new keystone.Storage({ adapter, ... })` to create one.
	 */
	storage: KeystoneFileStorage;
	/** Reserved for field registry use — binds this options bag to the File type. */
	type?: unknown;
}

type FileTypeConstructorOptions = Omit<KeystoneFieldOptionsForFileType, 'storage'> & {
	storage?: KeystoneFileStorage;
};

function isEmptyObjectValue(value: unknown): boolean {
	return typeof value === 'object' && value !== null && !Object.keys(value as Record<string, unknown>).length;
}

// ---------------------------------------------------------------------------
// Class
// ---------------------------------------------------------------------------

class FileType extends FieldType<KeystoneFieldOptionsForFileType, FileValue> {
	static readonly properName = 'File';
	static readonly typeName = 'file';

	declare storage: KeystoneFileStorage | undefined;
	declare paths: Record<string, string>;

	override _underscoreMethods = ['format', 'upload', 'remove', 'reset'];
	override _fixedSize = 'full' as const;

	constructor(list: KeystoneList, path: string, options: FileTypeConstructorOptions) {
		if (!options.storage) {
			throw new Error('Invalid Configuration\n\n'
				+ 'File fields (' + list.key + '.' + path + ') require storage to be provided.');
		}
		super(list, path, options as KeystoneFieldOptionsForFileType);
		this.storage = options.storage;
	}

	override addToSchema(schema: Schema): void {
		const storage = this.storage ?? this.options.storage;
		this.storage = storage;
		const field = this;
		this.paths = {};
		Object.keys(storage.schema).forEach(function (p: string) {
			field.paths[p] = field.path + '.' + p;
		});
		const schemaPaths = (this._path as unknown as { addTo(target: Record<string, unknown>, schema: Record<string, unknown>): Record<string, unknown> }).addTo({}, storage.schema);
		schema.add(schemaPaths as Parameters<Schema['add']>[0]);
		this.bindUnderscoreMethods();
	}

	private getStorage(): KeystoneFileStorage {
		if (!this.storage) {
			throw new Error('File field storage is not initialized.');
		}
		return this.storage;
	}

	upload(item: MongooseDocument, uploadedFile: Record<string, unknown>, callback: (err: Error | null, result?: Record<string, unknown>) => void): void {
		const field = this;
		const storage = this.getStorage();
		debug('[%s.%s] Uploading file for item %s:', this.list.key, this.path, (item as unknown as Record<string, unknown>).id, uploadedFile);
		storage.uploadFile(uploadedFile, function (err: Error | null, result?: Record<string, unknown>) {
			if (err) return callback(err);
			debug('[%s.%s] Uploaded file for item %s with result:', field.list.key, field.path, (item as unknown as Record<string, unknown>).id, result);
			item.set(field.path, result);
			callback(null, result);
		});
	}

	reset(item: MongooseDocument): void {
		const storage = this.getStorage();
		const value: Record<string, null> = {};
		Object.keys(storage.schema).forEach(function (p: string) {
			value[p] = null;
		});
		item.set(this.path, value);
	}

	remove(item: MongooseDocument): void {
		this.getStorage().removeFile(item.get(this.path) as Record<string, unknown>);
		this.reset(item);
	}

	override format(item: MongooseDocument): string {
		const value = item.get(this.path) as FileValue | undefined;
		if (value) return value.filename || '';
		return '';
	}

	override isModified(item: MongooseDocument): boolean {
		let modified = false;
		const paths = this.paths;
		Object.keys(this.getStorage().schema).forEach(function (p: string) {
			const subpath = paths[p];
			if (subpath && item.isModified(subpath)) modified = true;
		});
		return modified;
	}

	override validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		debug('[%s.%s] Validating input: ', this.list.key, this.path, value);
		const result = validateInput(value);
		debug('[%s.%s] Validation result: ', this.list.key, this.path, result);
		defer(callback, result);
	}

	override validateRequiredInput(_item: MongooseDocument, _data: Record<string, unknown>, callback: (result: boolean) => void): void {
		defer(callback, true);
	}

	/**
	 * Updates the item from submitted data (handles upload/remove/set).
	 * NOTE: This method intentionally has a 4th `files` parameter so the
	 * dispatch layer in `lib/list/updateItem.mts` (which checks `.length > 3`)
	 * passes the uploaded-files map automatically. It overrides the base
	 * 3-param signature with a compatible superset (the `files` slot accepts
	 * the callback when called without files, preserving the base contract).
	 * @param item - The Mongoose document to update.
	 * @param data - The submitted form data.
	 * @param filesOrCallback - Either uploaded files map or callback.
	 * @param callback - Optional callback when files map is provided.
	 */
	override updateItem(
		item: MongooseDocument,
		data: Record<string, unknown>,
		filesOrCallback: Record<string, Record<string, unknown>> | (() => void) | undefined,
		callback?: () => void,
	): void {
		// Normalise: if called as base (3-arg: item, data, callback)
		let files: Record<string, Record<string, unknown>>;
		let cb: () => void;
		if (typeof filesOrCallback === 'function') {
			cb = filesOrCallback;
			files = {};
		} else {
			files = filesOrCallback ?? {};
			cb = callback ?? ((): void => { /* no-op */ });
		}
		this._updateItemImpl(item, data, files, cb);
	}

	private _updateItemImpl(
		item: MongooseDocument,
		data: Record<string, unknown>,
		files: Record<string, Record<string, unknown>>,
		callback: (err?: Error | null) => void,
	): void {
		let value = this.getValueFromData(data);
		let uploadedFile: Record<string, unknown> | undefined;

		if (value === 'remove') {
			this.remove(item);
			defer(callback);
			return;
		}

		if (typeof value === 'string' && value.startsWith('upload:')) {
			uploadedFile = files[value.slice(7)];
		} else {
			const fromPath = this.getValueFromData(files as Record<string, unknown>);
			const fromUpload = this.getValueFromData(files as Record<string, unknown>, '_upload');
			uploadedFile = (fromPath as Record<string, unknown> | undefined) || (fromUpload as Record<string, unknown> | undefined);
		}

		if (uploadedFile && !uploadedFile.path) uploadedFile = undefined;

		if (uploadedFile) {
			return this.upload(item, uploadedFile, callback);
		}

			if (value === null || value === '' || isEmptyObjectValue(value)) {
				this.reset(item);
				value = undefined;
			}

		if (typeof value === 'object' && value !== null) {
			item.set(this.path, value);
		}
		defer(callback);
	}
}

function validateInput(value: unknown): boolean {
	if (value === undefined || value === null || value === '') return true;
	if (typeof value === 'string' && /^(?:(upload:)|(delete$))/.test(value)) return true;
	if (typeof value === 'object' && (value as FileValue).filename) return true;
	return false;
}

export default FileType;

// ---------------------------------------------------------------------------
// Backward-compat alias
// ---------------------------------------------------------------------------

/** @deprecated Use `FileType` directly. */
export type KeystoneFieldForFileType = FileType;

/**
 * Shape of a File field instance (the object returned by `new FileType(...)`).
 * @deprecated Prefer the class type `FileType` directly.
 */
export interface KeystoneFieldOptionsForFileTypeInstance {
	/** The storage instance used by this field. */
	storage: KeystoneFileStorage;
	/** Field-specific options. */
	options: KeystoneFieldOptionsForFileType;
	/** The dot-separated field path on the schema. */
	path: string;
	/** Sub-field path names, populated after `addToSchema`. */
	paths: Record<string, string>;
}

/**
 * Constructor type for the File field type.
 */
export type KeystoneTypeConstructorForFileType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForFileType) => FileType;
