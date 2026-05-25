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

		assert.equal(result, 'http://res.cloudinary.com/demo-cloud/image/upload/q_80,w_100/demo/image');
	});

	it('supports secure URLs, source, version, and legacy transformation keys', () => {
		global.window = { Keystone: { cloudinary: { cloud_name: 'demo cloud' } } };

		const result = cloudinaryResize('folder/image', {
			crop: 'fit',
			dpr: 2,
			effect: 'grayscale',
			fetch_format: 'auto',
			flags: 'progressive',
			gravity: 'center',
			height: 90,
			radius: 4,
			secure: true,
			source: 'private',
			version: 123,
			width: 120,
		});

		assert.equal(
			result,
			'https://res.cloudinary.com/demo%20cloud/image/private/q_80,c_fit,dpr_2,e_grayscale,f_auto,fl_progressive,g_center,h_90,r_4,w_120/v123/folder/image'
		);
	});
});
