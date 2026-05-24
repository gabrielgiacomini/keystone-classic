/**
 * Standalone Keystone test server for field-complete UI coverage.
 *
 * This boot script is separate from `fixtures/server-boot-both.ts` so the
 * smoke/parity fixture can stay small while field coverage gets a realistic
 * multi-collection schema.
 */

import keystone from 'keystone';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { parse } from 'node:url';
import { defineFieldCompleteLists } from './schema.ts';
import { FIELD_COMPLETE_SEED, seedFieldCompleteData } from './seed.ts';

const MONGO_URI =
	process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-ui-fields';
const PORT = process.env.PORT ?? '3008';
let uploadCounter = 0;
const cloudinarySdk = cloudinary.v2 ?? cloudinary;
const useRealCloudinary =
	process.env.RUN_CLOUDINARY_INTEGRATION === '1' && Boolean(process.env.CLOUDINARY_URL);
const cloudinaryMock = cloudinarySdk as unknown as {
	api: {
		resource: (...args: unknown[]) => Promise<unknown>;
	};
	uploader: {
		destroy: (...args: unknown[]) => Promise<unknown>;
		upload: (...args: unknown[]) => Promise<unknown>;
	};
};

function fixtureImageDataUrl (publicId: string, width: number, height: number): string {
	const label = publicId.split('/').pop() ?? publicId;
	const svg = [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
		'<rect width="100%" height="100%" fill="#e8f1fb"/>',
		'<rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#2f80ed" stroke-width="12"/>',
		`<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(24, Math.floor(width / 18))}" fill="#1f2937">${label}</text>`,
		'</svg>',
	].join('');
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function cloudinaryConfig () {
	if (!process.env.CLOUDINARY_URL) {
		return {
			api_key: 'api_key',
			api_secret: 'api_secret',
			cloud_name: 'cloud_name',
		};
	}

	const parts = parse(process.env.CLOUDINARY_URL);
	const [apiKey, apiSecret] = (parts.auth ?? '').split(':');
	return {
		api_key: apiKey,
		api_secret: apiSecret,
		cloud_name: parts.host ?? undefined,
		private_cdn: parts.pathname != null,
		secure_distribution: parts.pathname?.substring(1),
	};
}

if (!useRealCloudinary) {
	cloudinaryMock.uploader.upload = async function (_file: unknown, optionsOrCallback?: unknown, callback?: unknown): Promise<unknown> {
		uploadCounter += 1;
		const publicId = `field-complete/upload-${uploadCounter}`;
		const url = fixtureImageDataUrl(publicId, 64, 64);
		const done = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
		const response = {
			public_id: publicId,
			version: uploadCounter,
			signature: `sig-${uploadCounter}`,
			format: 'png',
			resource_type: 'image',
			url,
			secure_url: url,
			width: 64,
			height: 64,
		};
		if (typeof done === 'function') done(undefined, response);
		return response;
	};

	cloudinaryMock.uploader.destroy = async function (_publicId: unknown, optionsOrCallback?: unknown, callback?: unknown): Promise<unknown> {
		const done = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
		const response = { result: 'ok' };
		if (typeof done === 'function') done(undefined, response);
		return response;
	};

	cloudinaryMock.api.resource = async function (publicId: unknown, optionsOrCallback?: unknown, callback?: unknown): Promise<unknown> {
		const done = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
		const publicIdString = String(publicId);
		const url = fixtureImageDataUrl(publicIdString, 64, 64);
		const response = {
			public_id: publicId,
			version: 1,
			format: 'png',
			resource_type: 'image',
			url,
			secure_url: url,
			width: 64,
			height: 64,
		};
		if (typeof done === 'function') done(undefined, response);
		return response;
	};
}

async function dropDatabase () {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		if (conn.db) await conn.db.dropDatabase();
	} finally {
		await conn.close();
	}
}

await dropDatabase();

keystone.init({
	'name': 'keystone-e2e-ui-field-complete',
	'brand': 'Field Complete Admin',
	'host': '127.0.0.1',
	'port': PORT,
	'mongo': MONGO_URI,
	'auto update': false,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'keystone-e2e-ui-field-complete-secret',
	'admin legacy path': 'keystone',
	'admin next path': 'keystone-next',
	'admin api path': 'keystone-api',
	'admin legacy api alias': false,
	'admin ui': 'both',
	'headless': false,
	'logger': false,
	'cloudinary config': cloudinaryConfig(),
	'cloudinary secure': true,
});

defineFieldCompleteLists(keystone);

await new Promise((resolve, reject) => {
	keystone.start({
		onStart: () => resolve(undefined),
		onHttpServerCreated: () => {
			const server = keystone.httpServer;
			if (server) server.on('error', reject);
		},
	});
});

await seedFieldCompleteData(keystone);

console.log(
	`[e2e-ui-fields] Keystone listening on http://127.0.0.1:${PORT}/keystone`,
);
console.log(
	`[e2e-ui-fields] admin next mounted at http://127.0.0.1:${PORT}/keystone-next`,
);
console.log(
	`[e2e-ui-fields] admin API mounted at http://127.0.0.1:${PORT}/keystone-api`,
);
console.log(`[e2e-ui-fields] admin email: ${FIELD_COMPLETE_SEED.adminEmail}`);
