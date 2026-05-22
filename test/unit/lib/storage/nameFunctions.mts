import { expect } from 'chai';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
	contentHashFilename,
	ensureCallback,
	getFilename,
	originalFilename,
	randomFilename,
	retryFilename,
	type NormalisedGenerateFilename,
	type StorageNameFile,
} from '../../../../lib/storage/nameFunctions.mts';

function generatedNameFromBuffer(buffer: Buffer, extension?: string): string {
	let filename = buffer.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '')
		.slice(0, 16);
	if (extension) filename = `${filename}.${extension}`;
	return filename;
}

function getGeneratedName(generator: NormalisedGenerateFilename, file: StorageNameFile, attempt = 0): Promise<string | undefined> {
	return new Promise((resolve, reject) => {
		generator(file, attempt, (err, filename) => {
			if (err) return reject(err);
			resolve(filename);
		});
	});
}

describe('lib/storage/nameFunctions', function () {
	it('normalizes sync filename functions and preserves original filename behavior', async function () {
		const normalized = ensureCallback(originalFilename);
		const filename = await getGeneratedName(normalized, {
			path: '/tmp/upload',
			originalname: 'invoice.pdf',
		});

		expect(filename).to.equal('invoice.pdf');
	});

	it('generates URL-safe random filenames with the file extension', async function () {
		const filename = await getGeneratedName(randomFilename, {
			path: '/tmp/upload',
			extension: 'txt',
		});

		expect(filename).to.match(/^[A-Za-z0-9_-]{16}\.txt$/);
	});

	it('generates content hash filenames from file contents', async function () {
		const root = await fs.mkdtemp(path.join(os.tmpdir(), 'keystone-storage-name-'));
		try {
			const filePath = path.join(root, 'payload');
			await fs.writeFile(filePath, 'payload');
			const expected = generatedNameFromBuffer(
				crypto.createHash('sha1').update('payload').digest(),
				'txt',
			);

			const filename = await getGeneratedName(contentHashFilename, {
				path: filePath,
				extension: 'txt',
			});

			expect(filename).to.equal(expected);
		} finally {
			await fs.rm(root, { recursive: true, force: true });
		}
	});

	it('retries generated filenames until a unique name is found', async function () {
		const adapter: ThisParameterType<typeof retryFilename> = {
			options: {
				generateFilename(_file, attempt, callback) {
					callback(null, attempt === 0 ? 'duplicate.txt' : 'unique.txt');
				},
				whenExists: 'retry',
				retryAttempts: 2,
			},
			fileExists(filename, callback) {
				callback(null, filename === 'duplicate.txt');
			},
			retryFilename,
		};

		const filename = await new Promise<string | undefined>((resolve, reject) => {
			getFilename.call(adapter, { path: '/tmp/upload' }, (err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});

		expect(filename).to.equal('unique.txt');
	});

	it('reports filename collisions when configured to error', async function () {
		const adapter: ThisParameterType<typeof retryFilename> = {
			options: {
				generateFilename(_file, _attempt, callback) {
					callback(null, 'existing.txt');
				},
				whenExists: 'error',
				retryAttempts: 0,
			},
			fileExists(_filename, callback) {
				callback(null, true);
			},
			retryFilename,
		};

		const err = await new Promise<Error | null>((resolve) => {
			getFilename.call(adapter, { path: '/tmp/upload' }, (filenameErr) => {
				resolve(filenameErr);
			});
		});

		expect(err).to.be.instanceOf(Error);
		expect(err?.message).to.equal('File already exists');
	});
});
