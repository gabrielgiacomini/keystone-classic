import assert from 'node:assert/strict';
import cloudinaryResize from '../cloudinaryResize.mjs';

describe('cloudinaryResize()', () => {
	let originalWindow;

	beforeEach(() => {
		originalWindow = global.window;
	});

	afterEach(() => {
		if (originalWindow === undefined) {
			delete global.window;
		} else {
			global.window = originalWindow;
		}
	});

	it('returns false when the admin has no Cloudinary config', () => {
		global.window = { Keystone: {} };

		assert.equal(cloudinaryResize('demo/image'), false);
	});

	it('builds a Cloudinary URL when the admin exposes a cloud name', () => {
		global.window = { Keystone: { cloudinary: { cloud_name: 'demo-cloud' } } };

		const result = cloudinaryResize('demo/image', { width: 100 });

		assert.equal(typeof result, 'string');
		assert.match(result, /demo-cloud/);
		assert.match(result, /demo\/image/);
	});
});
