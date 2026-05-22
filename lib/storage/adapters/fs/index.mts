import fs from 'fs-extra';
import path from 'path';
import sanitize from 'sanitize-filename';
import url from 'url';
import debugLib from 'debug';
import { assertAllowedUploadExtension, type UploadExtensionList } from '../../../security/uploadPolicy.mjs';
import {
	ensureCallback,
	getFilename,
	randomFilename,
	retryFilename,
	type NormalisedGenerateFilename,
} from '../../nameFunctions.mjs';

const debug = debugLib('keystone:storage:adapter:fs');

/** Callback used by async name functions: (err, filename) */
type NameCallback = (err: NodeJS.ErrnoException | null, filename?: string) => void;

/** File object provided by multer / the storage layer for an upload. */
interface UploadFile {
	path: string;
	originalname: string;
	size?: number;
	mimetype?: string;
	filename?: string;
	extension?: string;
}

/** Options accepted in the `fs` key of the storage config. */
interface FSAdapterOptions {
	path: string;
	publicPath?: string;
	generateFilename: NormalisedGenerateFilename;
	whenExists: 'retry' | 'overwrite' | 'error';
	retryAttempts: number;
	allowedExtensions?: UploadExtensionList;
}

/** Schema passed to the adapter constructor (field-name → constructor). */
interface FSAdapterSchema {
	filename?: BooleanConstructor | StringConstructor;
	[key: string]: unknown;
}

/** Minimal data returned after a successful upload. */
interface UploadResult {
	filename: string;
	size: number | undefined;
	mimetype: string | undefined;
	path: string;
	originalname: string;
}

/** Generic node-style callback used in this adapter. */
type NodeCallback<T = void> = (err: NodeJS.ErrnoException | null, result?: T) => void;

/** Instance interface of the FS storage adapter. */
interface FSAdapterInstance {
	options: FSAdapterOptions;
	getFilename(file: UploadFile, callback: NameCallback): void;
	retryFilename(attempt: number, file: UploadFile, callback: NameCallback): void;
	getFileURL(file: UploadFile): string | null;
	pathForFile(filename: string): string;
	uploadFile(file: UploadFile, callback: NodeCallback<UploadResult>): void;
	removeFile(file: UploadFile, callback: NodeCallback): void;
	fileExists(filename: string, callback: (err: NodeJS.ErrnoException | null, exists?: boolean) => void): void;
}

const DEFAULT_OPTIONS = {
	generateFilename: randomFilename,
	whenExists: 'retry' as const,
	retryAttempts: 3,
};

function ensurePath (p: string) {
	try {
		fs.accessSync(p, fs.constants.R_OK | fs.constants.W_OK);
		if (!fs.statSync(p).isDirectory()) {
			throw Error('Specified output path is not a directory');
		}
	} catch (e: unknown) {
		if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
			fs.mkdirsSync(p);
			debug('Storage output path \'' + p + '\' created');
			return;
		}
		throw e;
	}
}

// ---- Constructor ----

function FSAdapter (this: FSAdapterInstance, options: { fs?: Partial<FSAdapterOptions>; [key: string]: unknown }, schema: FSAdapterSchema) {
	if (!schema.filename) throw Error('Cannot use FSAdapter without storing filename');
	this.options = Object.assign({}, DEFAULT_OPTIONS, options.fs) as FSAdapterOptions;
	debug('Initialising FS Adapter with options', this.options);
	this.options.generateFilename = ensureCallback(this.options.generateFilename);
	ensurePath(this.options.path);
}

// ---- Prototype methods ----

const proto = FSAdapter.prototype as FSAdapterInstance;

proto.getFilename = getFilename;
proto.retryFilename = retryFilename;

proto.getFileURL = function (this: FSAdapterInstance, file: UploadFile): string | null {
	const publicPath = this.options.publicPath;
	if (!publicPath) return null;
	return url.resolve(publicPath, file.filename ?? '');
};

proto.pathForFile = function (this: FSAdapterInstance, filename: string): string {
	return path.resolve(this.options.path, sanitize(filename));
};

proto.uploadFile = function (this: FSAdapterInstance, file: UploadFile, callback: NodeCallback<UploadResult>) {
	debug('Uploading file', file);
	const options = this.options;
	this.getFilename(file, function (err: NodeJS.ErrnoException | null, filename?: string) {
		if (err) return callback(err);
		try {
			assertAllowedUploadExtension(file.originalname, options.allowedExtensions);
		} catch (validationErr) {
			return callback(validationErr as NodeJS.ErrnoException);
		}
		filename = sanitize(filename ?? '') + path.parse(file.originalname).ext;
		debug('Uploading file with filename: %s', filename);
		const uploadPath = path.resolve(options.path, filename);
		const fsOptions: fs.MoveOptions = { overwrite: options.whenExists === 'overwrite' };
		fs.move(file.path, uploadPath, fsOptions, function (moveErr: NodeJS.ErrnoException | null | undefined) {
			if (moveErr) return callback(moveErr);
			const data: UploadResult = {
				filename,
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

proto.removeFile = function (this: FSAdapterInstance, file: UploadFile, callback: NodeCallback) {
	debug('Removing file', file);
	fs.unlink(this.pathForFile(file.filename ?? ''), function (err: NodeJS.ErrnoException | null) {
		if (err?.code === 'ENOENT') {
			console.warn('Attempted to remove a non-existant file');
			return callback(null);
		}
		callback(err);
	});
};

proto.fileExists = function (this: FSAdapterInstance, filename: string, callback: (err: NodeJS.ErrnoException | null, exists?: boolean) => void) {
	const p = this.pathForFile(filename);
	debug('Checking for file at path %s', filename);
	fs.stat(p, function (err: NodeJS.ErrnoException | null, stats: fs.Stats) {
		if (err?.code === 'ENOENT') {
			callback(null, false);
		} else if (err) {
			callback(err);
		} else if (stats.isFile()) {
			callback(null, true);
		} else {
			callback(Error('Invalid save destination - dest is not a file'));
		}
	});
};

// ---- Static properties ----

const FSAdapterFull = Object.assign(FSAdapter, {
	compatibilityLevel: 1,
	SCHEMA_TYPES: { filename: String },
	SCHEMA_FIELD_DEFAULTS: { filename: true },
});

export default FSAdapterFull;
