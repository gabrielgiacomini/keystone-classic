import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect } from 'chai';
import sinon from 'sinon';
import { upload } from 'keystone/admin/server/api/file';

interface MockResponse {
	json: sinon.SinonSpy;
	send: sinon.SinonSpy;
	status: sinon.SinonStub;
}

function createResponse(): MockResponse {
	const res = {} as MockResponse;
	res.json = sinon.spy();
	res.send = sinon.spy();
	res.status = sinon.stub().returns(res);
	return res;
}

function createRequest(overrides: Record<string, unknown> = {}) {
	return {
		files: {
			file: {
				mimetype: 'text/plain',
				originalname: 'release notes.txt',
				path: '/tmp/source-upload.txt',
				size: 42,
			},
		},
		keystone: {
			security: {
				csrf: {
					validate: sinon.stub().returns(true),
				},
			},
		},
		...overrides,
	};
}

describe('admin file API', function () {
	let stubs: Array<{ restore(): void }>;

	beforeEach(function () {
		stubs = [];
	});

	afterEach(function () {
		stubs.forEach(function (stub) {
			stub.restore();
		});
	});

	it('rejects invalid upload CSRF before touching the filesystem', function () {
		const mkdirStub = sinon.stub(fs, 'mkdirSync');
		const copyStub = sinon.stub(fs, 'copyFileSync');
		stubs.push(mkdirStub, copyStub);
		const req = createRequest({
			keystone: {
				security: {
					csrf: {
						validate: sinon.stub().returns(false),
					},
				},
			},
		});
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 403);
		sinon.assert.calledWithExactly(res.send, { error: { message: 'invalid csrf' } });
		sinon.assert.notCalled(mkdirStub);
		sinon.assert.notCalled(copyStub);
	});

	it('returns the legacy missing-file response when no file is present', function () {
		const mkdirStub = sinon.stub(fs, 'mkdirSync');
		const copyStub = sinon.stub(fs, 'copyFileSync');
		stubs.push(mkdirStub, copyStub);
		const req = createRequest({ files: {} });
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 400);
		sinon.assert.calledWithExactly(res.json, { error: { message: 'No file selected' } });
		sinon.assert.notCalled(mkdirStub);
		sinon.assert.notCalled(copyStub);
	});

	it('rejects unsafe upload extensions before touching the filesystem', function () {
		const mkdirStub = sinon.stub(fs, 'mkdirSync');
		const copyStub = sinon.stub(fs, 'copyFileSync');
		stubs.push(mkdirStub, copyStub);
		const req = createRequest({
			files: {
				file: {
					originalname: 'shell.php',
					path: '/tmp/shell.php',
				},
			},
		});
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.status, 400);
		sinon.assert.calledWithExactly(res.json, {
			error: { message: 'Unsupported upload file extension: .php' },
		});
		sinon.assert.notCalled(mkdirStub);
		sinon.assert.notCalled(copyStub);
	});

	it('copies the first selected file and returns Types.File-compatible metadata', function () {
		const mkdirStub = sinon.stub(fs, 'mkdirSync');
		const copyStub = sinon.stub(fs, 'copyFileSync');
		const nowStub = sinon.stub(Date, 'now').returns(1700000000000);
		stubs.push(mkdirStub, copyStub, nowStub);
		const req = createRequest({
			files: {
				file: [
					{
						mimetype: 'text/plain',
						originalname: 'release notes!.txt',
						path: '/tmp/release-notes.txt',
						size: 512,
					},
					{
						mimetype: 'text/plain',
						originalname: 'ignored.txt',
						path: '/tmp/ignored.txt',
						size: 1,
					},
				],
			},
		});
		const res = createResponse();
		const uploadDir = path.join(os.tmpdir(), 'keystone-admin-api-uploads');

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		const payload = res.json.firstCall.args[0] as {
			filename: string;
			mimetype: string;
			originalname: string;
			path: string;
			size: number;
			url: string;
		};
		expect(payload.filename).to.match(/^1700000000000-[a-f0-9]{12}-release-notes-\.txt$/u);
		sinon.assert.calledWithExactly(mkdirStub, uploadDir, { recursive: true });
		sinon.assert.calledWithExactly(copyStub, '/tmp/release-notes.txt', path.join(uploadDir, payload.filename));
		expect(payload).to.deep.equal({
			filename: payload.filename,
			originalname: 'release-notes-.txt',
			path: '/admin-api-uploads',
			size: 512,
			mimetype: 'text/plain',
			url: `/admin-api-uploads/${payload.filename}`,
		});
	});

	it('falls back to upload-safe defaults for missing optional file metadata', function () {
		const mkdirStub = sinon.stub(fs, 'mkdirSync');
		const copyStub = sinon.stub(fs, 'copyFileSync');
		const nowStub = sinon.stub(Date, 'now').returns(1700000000001);
		stubs.push(mkdirStub, copyStub, nowStub);
		const req = createRequest({
			files: {
				file: {
					originalname: 'README.md',
					path: '/tmp/readme',
				},
			},
		});
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		const payload = res.json.firstCall.args[0] as {
			filename: string;
			mimetype: string;
			originalname: string;
			path: string;
			size: number;
			url: string;
		};
		expect(payload.filename).to.match(/^1700000000001-[a-f0-9]{12}-README\.md$/u);
		expect(payload).to.deep.equal({
			filename: payload.filename,
			originalname: 'README.md',
			path: '/admin-api-uploads',
			size: 0,
			mimetype: 'application/octet-stream',
			url: `/admin-api-uploads/${payload.filename}`,
		});
	});
});
