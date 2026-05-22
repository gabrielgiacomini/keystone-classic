import crypto from 'node:crypto';
import fs from 'node:fs';

/** Minimal upload file shape accepted by storage filename helpers. */
export interface StorageNameFile {
	path: string;
	extension?: string;
	originalname?: string;
}

/** Callback used by async storage filename helpers. */
export type NameCallback = (err: Error | NodeJS.ErrnoException | null, filename?: string) => void;

/** Three-argument filename generator shape expected by storage adapters. */
export type NormalisedGenerateFilename = (
	file: StorageNameFile,
	attempt: number,
	callback: NameCallback
) => void;

/** Sync or async filename generator accepted from user configuration. */
export type RawGenerateFilename =
	| ((file: StorageNameFile) => string | undefined)
	| ((file: StorageNameFile, attempt: number) => string | undefined)
	| NormalisedGenerateFilename;

interface FilenameAdapter {
	options: {
		generateFilename: NormalisedGenerateFilename;
		whenExists: 'overwrite' | 'error' | 'retry';
		retryAttempts: number;
	};
	fileExists(filename: string | undefined, callback: (err: Error | NodeJS.ErrnoException | null, exists?: boolean) => void): void;
	retryFilename(attempt: number, file: StorageNameFile, callback: NameCallback): void;
}

function filenameFromBuffer(buffer: Buffer, extension?: string): string {
	let filename = buffer.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '')
		.slice(0, 16);

	if (extension) filename = `${filename}.${extension}`;

	return filename;
}

/**
 * Calculates a filename from the SHA-1 hash of the file contents.
 *
 * @param file - File descriptor containing a readable `path`.
 * @param _attempt - Current generation attempt, unused by this deterministic helper.
 * @param callback - Callback receiving the generated filename.
 */
export function contentHashFilename(file: StorageNameFile, _attempt: number, callback: NameCallback): void {
	const hash = crypto.createHash('sha1');
	let calledCallback = false;
	function done(err: Error | NodeJS.ErrnoException | null, filename?: string): void {
		if (calledCallback) return;
		calledCallback = true;
		callback(err, filename);
	}

	fs.createReadStream(file.path)
		.on('error', function (err: NodeJS.ErrnoException) {
			done(err);
		})
		.on('data', function (data: string | Buffer) {
			hash.update(typeof data === 'string' ? Buffer.from(data) : data);
		})
		.on('end', function () {
			done(null, filenameFromBuffer(hash.digest(), file.extension));
		});
}

/**
 * Returns the original filename provided in the file object.
 *
 * @param file - File descriptor containing an optional `originalname`.
 * @returns The original filename, if one was provided.
 */
export function originalFilename(file: StorageNameFile): string | undefined {
	return file.originalname;
}

/**
 * Generates a random filename using 16 random bytes.
 *
 * @param file - File descriptor containing an optional extension.
 * @param _attempt - Current generation attempt, unused by this random helper.
 * @param callback - Callback receiving the generated filename.
 */
export function randomFilename(file: StorageNameFile, _attempt: number, callback: NameCallback): void {
	crypto.randomBytes(16, function (err: Error | null, data: Buffer) {
		if (err) return callback(err);
		return callback(null, filenameFromBuffer(data, file.extension));
	});
}

/**
 * Normalises sync filename generators into the async adapter callback shape.
 *
 * @param fn - Sync or async filename generator.
 * @returns A three-argument filename generator.
 */
export function ensureCallback(fn: RawGenerateFilename): NormalisedGenerateFilename {
	if (fn.length <= 2) {
		const original = fn as (file: StorageNameFile, attempt: number) => string | undefined;
		return function generatedFilename(file: StorageNameFile, attempt: number, callback: NameCallback): void {
			callback(null, original(file, attempt));
		};
	}
	return fn as NormalisedGenerateFilename;
}

/**
 * Retries filename generation until the adapter reports a non-existing name.
 *
 * @param attempt - Current retry attempt number.
 * @param file - File descriptor passed to the configured filename generator.
 * @param callback - Callback receiving the unique filename or an error.
 * @returns Nothing.
 */
export function retryFilename(this: FilenameAdapter, attempt: number, file: StorageNameFile, callback: NameCallback): void {
	if (attempt > this.options.retryAttempts) {
		return callback(Error('Unique filename could not be generated; Maximum attempts exceeded'));
	}
	this.options.generateFilename(file, attempt, (err, filename) => {
		if (err) return callback(err);
		this.fileExists(filename, (existsErr, exists) => {
			if (existsErr) return callback(existsErr);
			if (exists) return this.retryFilename(attempt + 1, file, callback);
			callback(null, filename);
		});
	});
}

/**
 * Generates a filename according to the adapter's collision policy.
 *
 * @param file - File descriptor passed to the configured filename generator.
 * @param callback - Callback receiving the generated filename or an error.
 */
export function getFilename(this: FilenameAdapter, file: StorageNameFile, callback: NameCallback): void {
	switch (this.options.whenExists) {
		case 'overwrite':
			this.options.generateFilename(file, 0, callback);
			break;
		case 'error':
			this.options.generateFilename(file, 0, (err, filename) => {
				if (err) return callback(err);
				this.fileExists(filename, (existsErr, result) => {
					if (existsErr) return callback(existsErr);
					if (result === true) return callback(Error('File already exists'));
					callback(null, filename);
				});
			});
			break;
		case 'retry':
			this.retryFilename(0, file, callback);
			break;
	}
}

export default {
	contentHashFilename,
	originalFilename,
	randomFilename,
};
