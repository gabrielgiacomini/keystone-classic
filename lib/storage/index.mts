import fs from 'fs-extra';
import path from 'path';
import mime from 'mime-types';
import debugLib from 'debug';

import FSAdapter from './adapters/fs/index.mjs';
import nameFunctions from './nameFunctions.mjs';

const debug = debugLib('keystone:storage:adapter:fs');

const ADAPTER_COMPATIBILITY_LEVEL = 1;

/** Schema field-name → JS constructor (e.g. Number, String). */
type SchemaTypeMap = Record<string, unknown>;

/** Which schema fields are enabled by default. */
type SchemaFieldDefaults = Record<string, boolean>;

/** Minimal file object passed through the storage pipeline. */
interface StorageFile {
	path: string;
	originalname?: string;
	name?: string;
	size?: number;
	mimetype?: string;
	filename?: string;
	url?: string;
	[key: string]: unknown;
}

/**
 * Error union for storage pipeline callbacks (generic or fs `errno` errors).
 * @see lib/storage/index.mts
 */
type KeystoneStorageCallbackError = Error | NodeJS.ErrnoException;

/** Node-style callback for upload results. */
type UploadCallback = (err: KeystoneStorageCallbackError | null, result?: StorageFile) => void;

/** Node-style callback for remove operations. */
type RemoveCallback = (err: KeystoneStorageCallbackError | null) => void;

/** An instantiated storage adapter. */
interface AdapterInstance {
	uploadFile(file: StorageFile, callback: UploadCallback): void;
	removeFile(file: StorageFile, callback: RemoveCallback): void;
	getFileURL?(file: StorageFile): string | null;
}

/** Options forwarded to the adapter constructor (everything except `adapter` and `schema`). */
type AdapterOptions = Record<string, unknown>;

/** The constructor-side interface for a storage adapter class. */
interface AdapterConstructor {
	new(options: AdapterOptions, schema: SchemaTypeMap): AdapterInstance;
	name: string;
	compatibilityLevel: number;
	SCHEMA_TYPES: SchemaTypeMap;
	SCHEMA_FIELD_DEFAULTS: SchemaFieldDefaults;
	prototype: AdapterInstance;
}

/** Options passed to the Storage constructor. */
interface StorageOptions {
	adapter: AdapterConstructor;
	schema?: SchemaFieldDefaults;
	[key: string]: unknown;
}

const SCHEMA_TYPES: SchemaTypeMap = {
	size: Number,
	mimetype: String,
	path: String,
	originalname: String,
	url: String,
};

const SCHEMA_FIELD_DEFAULTS: SchemaFieldDefaults = {
	size: true,
	mimetype: true,
	path: false,
	originalname: false,
	url: false,
};

function getSize (file: StorageFile, callback: (err: KeystoneStorageCallbackError | null, size?: number | null) => void) {
	if (file.size) return callback(null, file.size);
	fs.stat(file.path, function (err: NodeJS.ErrnoException | null, stats: fs.Stats) {
		if (!stats.isFile()) {
			return callback(Error(file.path + ' is not a file'));
		}
		callback(err, stats.size);
	});
}

function normalizeFile (file: StorageFile, schema: SchemaTypeMap, callback: (err: Error | NodeJS.ErrnoException | null, file?: StorageFile) => void) {
	if (schema.mimetype && !file.mimetype) file.mimetype = mime.lookup(file.path) || undefined;

	if (!file.originalname) {
		file.originalname = file.name
			|| (file.path) ? path.parse(file.path).base : 'unnamedfile';
	}

	if (schema.size && !file.size) {
		getSize(file, function (err, size) {
			if (err) return callback(err);
			file.size = size ?? undefined;
			callback(null, file);
		});
	} else callback(null, file);
}

class Storage {
	schema: SchemaTypeMap;
	adapter: AdapterInstance;

	static Adapters: { FS: typeof FSAdapter; [key: string]: unknown } = { FS: FSAdapter };

	constructor (options: StorageOptions) {
		const { adapter: AdapterType, schema: schemaOverride, ...adapterOptions } = options;

		if (typeof AdapterType !== 'function') {
			throw new Error('Invalid Storage Adapter\n'
				+ 'The storage adapter specified is not a function. Did you '
				+ 'require the right package?\n');
		}

		debug('Initialising Storage with adapter ' + AdapterType.name);

		if (AdapterType.compatibilityLevel !== ADAPTER_COMPATIBILITY_LEVEL) {
			throw new Error('Incompatible Storage Adapter\n'
				+ 'The storage adapter specified (' + AdapterType.name + ') '
				+ 'does not match the compatibility level required for this '
				+ 'version of Keystone.\n');
		}

		const schemaFields: SchemaFieldDefaults = Object.assign({}, SCHEMA_FIELD_DEFAULTS, AdapterType.SCHEMA_FIELD_DEFAULTS, schemaOverride);

		this.schema = {};
		for (const p in schemaFields) {
			if (!schemaFields[p]) continue;
			const type = AdapterType.SCHEMA_TYPES[p] ?? SCHEMA_TYPES[p];
			if (!type) throw Error('Unknown type for requested schema field ' + p);
			this.schema[p] = type;
		}

		if (this.schema.url && typeof AdapterType.prototype.getFileURL !== 'function') {
			throw Error('URL schema field is not supported by the ' + AdapterType.name + ' adapter');
		}

		this.adapter = new AdapterType(adapterOptions, this.schema);
	}

	uploadFile (file: StorageFile, callback: UploadCallback) {
		const self = this;
		if (!file.path) return callback(Error('Cannot upload file - No source path'));

		normalizeFile(file, this.schema, function (normalizeErr, normalizedFile) {
			if (normalizeErr) return callback(normalizeErr);
			if (!normalizedFile) return callback(Error('Cannot upload file - normalization returned no file'));
			self.adapter.uploadFile(normalizedFile, function (uploadErr: NodeJS.ErrnoException | Error | null, result?: StorageFile) {
				if (uploadErr) return callback(uploadErr);
				if (self.schema.url && self.adapter.getFileURL && result) {
					result.url = self.adapter.getFileURL(result) ?? undefined;
				}
				callback(null, result);
			});
		});
	}

	removeFile (value: StorageFile, callback: RemoveCallback) {
		this.adapter.removeFile(value, callback);
	}
}

Object.assign(Storage, nameFunctions);

export default Storage;
