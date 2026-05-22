import { expect } from 'chai';
import { v2 as cloudinaryV2 } from 'cloudinary';
import sinon from 'sinon';
import { autocomplete, get, upload } from 'keystone/admin/server/api/cloudinary';

interface MockResponse {
	format: sinon.SinonStub;
	json: sinon.SinonSpy;
	send: sinon.SinonSpy;
	status: sinon.SinonStub;
}

type CloudinaryCallback = (error?: unknown, result?: Record<string, unknown>) => void;

function createResponse(): MockResponse {
	const res = {} as MockResponse;
	res.json = sinon.spy();
	res.send = sinon.spy();
	res.status = sinon.stub().returns(res);
	res.format = sinon.stub().callsFake(function (handlers: { json?: () => void }) {
		handlers.json?.();
		return res;
	});
	return res;
}

function createUploadRequest(overrides: Record<string, unknown> = {}) {
	return {
		files: {
			file: {
				originalname: 'hero-image.png',
				path: '/tmp/hero-image.png',
			},
		},
		keystone: {
			get: sinon.stub().callsFake(function (key: string) {
				if (key === 'wysiwyg cloudinary images filenameAsPublicID') return true;
				if (key === 'cloudinary secure') return true;
				return undefined;
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

describe('admin cloudinary API', function () {
	let cloudinaryStubs: Array<{ restore(): void }>;

	afterEach(function () {
		cloudinaryStubs.forEach(function (stub) {
			stub.restore();
		});
	});

	beforeEach(function () {
		cloudinaryStubs = [];
	});

	it('rejects invalid upload CSRF before calling the Cloudinary SDK', function () {
		const uploadStub = sinon.stub(cloudinaryV2.uploader, 'upload');
		cloudinaryStubs.push(uploadStub);
		const req = createUploadRequest({
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
		sinon.assert.notCalled(uploadStub);
	});

	it('returns the legacy missing-image response when no upload file is present', function () {
		const uploadStub = sinon.stub(cloudinaryV2.uploader, 'upload');
		cloudinaryStubs.push(uploadStub);
		const req = createUploadRequest({ files: {} });
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		sinon.assert.calledWithExactly(res.json, { error: { message: 'No image selected' } });
		sinon.assert.notCalled(uploadStub);
	});

	it('uploads the first selected file and returns the configured secure image URL', function () {
		const uploadStub = sinon.stub(cloudinaryV2.uploader, 'upload').callsFake(function (...args: unknown[]) {
			const callback = args[2] as CloudinaryCallback;
			callback(undefined, {
				public_id: 'hero-image',
				url: 'http://res.cloudinary.test/hero-image.png',
				secure_url: 'https://res.cloudinary.test/hero-image.png',
			});
			return Promise.resolve({ public_id: 'hero-image' }) as ReturnType<typeof cloudinaryV2.uploader.upload>;
		});
		cloudinaryStubs.push(uploadStub);
		const req = createUploadRequest({
			files: {
				file: [
					{ originalname: 'hero-image.png', path: '/tmp/hero-image.png' },
					{ originalname: 'ignored.png', path: '/tmp/ignored.png' },
				],
			},
		});
		const res = createResponse();

		upload(req as unknown as import('express').Request, res as unknown as import('express').Response);

		expect(uploadStub.firstCall.args[0]).to.equal('/tmp/hero-image.png');
		expect(uploadStub.firstCall.args[1]).to.deep.equal({ public_id: 'hero-image' });
		expect((uploadStub.firstCall.args as unknown[])[2]).to.be.a('function');
		sinon.assert.calledOnce(res.format);
		sinon.assert.calledWithExactly(res.send, {
			public_id: 'hero-image',
			url: 'http://res.cloudinary.test/hero-image.png',
			secure_url: 'https://res.cloudinary.test/hero-image.png',
			image: { url: 'https://res.cloudinary.test/hero-image.png' },
		});
	});

	it('maps Cloudinary autocomplete options and resources into the legacy JSON shape', function () {
		const resourcesStub = sinon.stub(cloudinaryV2.api, 'resources').callsFake(function (...args: unknown[]) {
			const callback = args[1] as CloudinaryCallback;
			callback(undefined, {
				next_cursor: 'next-page',
				resources: [{ public_id: 'hero-image' }],
			});
			return Promise.resolve({ resources: [] }) as ReturnType<typeof cloudinaryV2.api.resources>;
		});
		cloudinaryStubs.push(resourcesStub);
		const req = {
			query: {
				max: '25',
				next: 'cursor-1',
				prefix: 'posts/',
			},
		};
		const res = createResponse();

		autocomplete(req as unknown as import('express').Request, res as unknown as import('express').Response);

		expect(resourcesStub.firstCall.args[0]).to.deep.equal({
			type: 'upload',
			prefix: 'posts/',
			max_results: '25',
			next_cursor: 'cursor-1',
		});
		expect((resourcesStub.firstCall.args as unknown[])[1]).to.be.a('function');
		sinon.assert.calledWithExactly(res.json, {
			next: 'next-page',
			items: [{ public_id: 'hero-image' }],
		});
	});

	it('fetches a single Cloudinary resource and normalizes SDK errors', function () {
		const resourceStub = sinon.stub(cloudinaryV2.api, 'resource');
		cloudinaryStubs.push(resourceStub);
		resourceStub.onFirstCall().callsFake(function (...args: unknown[]) {
			const publicId = args[0] as string;
			const callback = args[2] as CloudinaryCallback;
			callback(undefined, { public_id: publicId, format: 'png' });
			return Promise.resolve({ public_id: publicId }) as ReturnType<typeof cloudinaryV2.api.resource>;
		});
		resourceStub.onSecondCall().callsFake(function (...args: unknown[]) {
			const callback = args[2] as CloudinaryCallback;
			callback({ message: 'not found' });
			return Promise.resolve({}) as ReturnType<typeof cloudinaryV2.api.resource>;
		});
		const firstRes = createResponse();
		const secondRes = createResponse();

		get({ query: { id: ['hero-image'] } } as unknown as import('express').Request, firstRes as unknown as import('express').Response);
		get({ query: { id: 'missing-image' } } as unknown as import('express').Request, secondRes as unknown as import('express').Response);

		expect(resourceStub.firstCall.args[0]).to.equal('hero-image');
		expect((resourceStub.firstCall.args as unknown[])[1]).to.deep.equal({});
		expect((resourceStub.firstCall.args as unknown[])[2]).to.be.a('function');
		sinon.assert.calledWithExactly(firstRes.json, { item: { public_id: 'hero-image', format: 'png' } });
		sinon.assert.calledWithExactly(secondRes.json, { error: { message: 'not found' } });
		expect(resourceStub.secondCall.args[0]).to.equal('missing-image');
	});
});
