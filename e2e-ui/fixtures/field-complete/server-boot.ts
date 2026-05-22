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
import { defineFieldCompleteLists } from './schema.ts';
import { FIELD_COMPLETE_SEED, seedFieldCompleteData } from './seed.ts';

const MONGO_URI =
	process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-ui-fields';
const PORT = process.env.PORT ?? '3008';
let uploadCounter = 0;
const cloudinarySdk = cloudinary.v2 ?? cloudinary;
const cloudinaryMock = cloudinarySdk as unknown as {
	api: {
		resource: (...args: unknown[]) => Promise<unknown>;
	};
	uploader: {
		destroy: (...args: unknown[]) => Promise<unknown>;
		upload: (...args: unknown[]) => Promise<unknown>;
	};
};

cloudinaryMock.uploader.upload = async function (_file: unknown, optionsOrCallback?: unknown, callback?: unknown): Promise<unknown> {
	uploadCounter += 1;
	const publicId = `field-complete/upload-${uploadCounter}`;
	const done = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
	const response = {
		public_id: publicId,
		version: uploadCounter,
		signature: `sig-${uploadCounter}`,
		format: 'png',
		resource_type: 'image',
		url: `http://res.cloudinary.test/${publicId}.png`,
		secure_url: `https://res.cloudinary.test/${publicId}.png`,
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
	const response = {
		public_id: publicId,
		version: 1,
		format: 'png',
		resource_type: 'image',
		url: `http://res.cloudinary.test/${publicIdString}.png`,
		secure_url: `https://res.cloudinary.test/${publicIdString}.png`,
		width: 64,
		height: 64,
	};
	if (typeof done === 'function') done(undefined, response);
	return response;
};

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
	'cloudinary config': {
		api_key: 'api_key',
		api_secret: 'api_secret',
		cloud_name: 'cloud_name',
	},
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
