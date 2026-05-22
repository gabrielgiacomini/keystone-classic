import fs from 'node:fs';
import { expect } from 'chai';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sinon from 'sinon';
import { upload } from 'keystone/admin/server/api/s3';

interface MockResponse {
	format: sinon.SinonStub;
	json: sinon.SinonSpy;
	send: sinon.SinonSpy;
	status: sinon.SinonStub;
}

function createResponse(): MockResponse {
	const res = {} as MockResponse;
	res.json = sinon.spy();
	res.send = sinon.spy();
	res.status = sinon.stub().returns(res);
	res.format = sinon.stub().callsFake(function (handlers: { html?: () => void; json?: () => void }) {
		handlers.json?.();
		return res;
	});
	return res;
}

function createRequest(overrides: Record<string, unknown> = {}) {
	return {
		body: { authenticity_token: 'token' },
		files: {
			file: {
				filename: 'upload-temp',
				mimetype: 'image/png',
				originalname: 'hero.image.png',
				path: '/tmp/hero-image.png',
			},
		},
		keystone: {
			get: sinon.stub().callsFake(function (key: string) {
				if (key !== 's3 config') return undefined;
				return {
					bucket: 'content-assets',
					endpoint: 'https://s3.example.test',
					forcePathStyle: true,
					key: 'access-key',
					region: 'eu-west-1',
					root: 'https://cdn.example.test/assets',
					s3path: 'uploads/editor',
					secret: 'secret-key',
					'default headers': {
						'Cache-Control': 'max-age=31536000',
						'x-amz-meta-origin': 'admin-api',
						'x-amz-server-side-encryption': 'AES256',
					},
				};
			}),
			security: {
				csrf: {
					validate: sinon.stub().returns(true),
				},
			},
		},
		...overrides,
	};
}

async function flushUpload(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
}

describe('admin s3 API', function () {
	let stubs: Array<{ restore(): void }>;

	beforeEach(function () {
		stubs = [];
	});

	afterEach(function () {
		stubs.forEach(function (stub) {
			stub.restore();
		});
	});

	it('rejects invalid upload CSRF before creating an S3 upload command', function () {
		const sendStub = sinon.stub(S3Client.prototype, 'send');
		const streamStub = sinon.stub(fs, 'createReadStream');
		stubs.push(sendStub, streamStub);
		const req = createRequest({
			keystone: {
				get: sinon.stub(),
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
		sinon.assert.notCalled(streamStub);
		sinon.assert.notCalled(sendStub);
	});

	it('returns the legacy missing-image response when no upload file is present', function () {
		const sendStub = sinon.stub(S3Client.prototype, 'send');
		const streamStub = sinon.stub(fs, 'createReadStream');
		stubs.push(sendStub, streamStub);
		const req = createRequest({ files: {} });
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.json, { error: { message: 'No image selected' } });
		sinon.assert.notCalled(streamStub);
		sinon.assert.notCalled(sendStub);
	});

	it('returns a configuration error before reading the file when S3 is not configured', function () {
		const sendStub = sinon.stub(S3Client.prototype, 'send');
		const streamStub = sinon.stub(fs, 'createReadStream');
		stubs.push(sendStub, streamStub);
		const req = createRequest({
			keystone: {
				get: sinon.stub().returns(undefined),
				security: {
					csrf: {
						validate: sinon.stub().returns(true),
					},
				},
			},
		});
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.json, { error: { message: 'S3 not configured' } });
		sinon.assert.notCalled(streamStub);
		sinon.assert.notCalled(sendStub);
	});

	it('uploads the first selected file with legacy headers and returns the configured root URL', async function () {
		const fakeBody = { readable: true } as unknown as ReturnType<typeof fs.createReadStream>;
		const sendStub = sinon.stub(S3Client.prototype, 'send').resolves({});
		const streamStub = sinon.stub(fs, 'createReadStream').returns(fakeBody);
		stubs.push(sendStub, streamStub);
		const req = createRequest({
			files: {
				file: [
					{
						filename: 'upload-temp',
						mimetype: 'image/png',
						originalname: 'hero.image.png',
						path: '/tmp/hero-image.png',
					},
					{
						filename: 'ignored',
						mimetype: 'image/png',
						originalname: 'ignored.png',
						path: '/tmp/ignored.png',
					},
				],
			},
		});
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushUpload();

		sinon.assert.calledWithExactly(streamStub, '/tmp/hero-image.png');
		sinon.assert.calledOnce(sendStub);
		const command = sendStub.firstCall.args[0] as PutObjectCommand;
		expect(command.input).to.include({
			ACL: 'public-read',
			Bucket: 'content-assets',
			CacheControl: 'max-age=31536000',
			ContentType: 'image/png',
			Key: 'uploads/editor/upload-temp.png',
			ServerSideEncryption: 'AES256',
		});
		expect(command.input.Body).to.equal(fakeBody);
		expect(command.input.Metadata).to.deep.equal({ origin: 'admin-api' });
		sinon.assert.calledOnce(res.format);
		sinon.assert.calledWithExactly(res.send, {
			image: { url: 'https://cdn.example.test/assets/upload-temp.png' },
		});
	});

	it('normalizes S3 upload failures into the legacy JSON error shape', async function () {
		const fakeBody = { readable: true } as unknown as ReturnType<typeof fs.createReadStream>;
		const sendStub = sinon.stub(S3Client.prototype, 'send').rejects(new Error('upload denied'));
		const streamStub = sinon.stub(fs, 'createReadStream').returns(fakeBody);
		stubs.push(sendStub, streamStub);
		const req = createRequest();
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);
		await flushUpload();

		sinon.assert.calledOnce(sendStub);
		sinon.assert.calledWithExactly(res.send, { error: { message: 'upload denied' } });
	});
});
