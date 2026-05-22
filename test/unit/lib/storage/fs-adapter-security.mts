import { expect } from 'chai';
import Storage from 'keystone/lib/storage/index';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

describe('lib/storage/adapters/fs security', function () {
	let root: string;

	beforeEach(async function () {
		root = await fs.mkdtemp(path.join(os.tmpdir(), 'keystone-fs-storage-'));
	});

	afterEach(async function () {
		await fs.rm(root, { recursive: true, force: true });
	});

	it('rejects uploads whose original extension is outside the allowlist', async function () {
		const sourcePath = path.join(root, 'incoming-upload');
		await fs.writeFile(sourcePath, 'payload');
		const storage = new Storage({
			adapter: Storage.Adapters.FS as unknown as ConstructorParameters<typeof Storage>[0]['adapter'],
			fs: {
				path: root,
				allowedExtensions: ['.txt'],
			},
		});

		const err = await new Promise<Error | null>((resolve) => {
			storage.uploadFile({
				path: sourcePath,
				originalname: 'shell.php',
				size: 7,
				mimetype: 'application/x-php',
			}, function (uploadErr) {
				resolve(uploadErr);
			});
		});

		expect(err).to.be.instanceOf(Error);
		expect(err?.message).to.equal('Unsupported upload file extension: .php');
	});

	it('stores uploads whose original extension is explicitly allowed', async function () {
		const sourcePath = path.join(root, 'incoming-upload');
		await fs.writeFile(sourcePath, 'payload');
		const storage = new Storage({
			adapter: Storage.Adapters.FS as unknown as ConstructorParameters<typeof Storage>[0]['adapter'],
			fs: {
				path: root,
				allowedExtensions: ['.txt'],
			},
		});

		const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
			storage.uploadFile({
				path: sourcePath,
				originalname: 'notes.txt',
				size: 7,
				mimetype: 'text/plain',
			}, function (uploadErr, uploadResult) {
				if (uploadErr) return reject(uploadErr);
				resolve(uploadResult ?? {});
			});
		});

		expect(result.originalname).to.equal('notes.txt');
		expect(result.filename).to.match(/\.txt$/);
	});
});
