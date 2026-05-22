import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import keystone from 'keystone';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const FIELD_COMPLETE_UPLOAD_ROOT = path.join(
	__dirname,
	'../../../.tmp/e2e-ui-field-complete/files',
);

fs.ensureDirSync(FIELD_COMPLETE_UPLOAD_ROOT);

const Storage = keystone.Storage as {
	new (options: Record<string, unknown>): unknown;
	Adapters: { FS: unknown };
};

export const fieldCompleteFileStorage = new Storage({
	adapter: Storage.Adapters.FS,
	fs: {
		path: FIELD_COMPLETE_UPLOAD_ROOT,
		publicPath: '/field-complete-files',
	},
	schema: {
		filename: true,
		originalname: true,
		path: true,
		size: true,
		mimetype: true,
		url: true,
	},
});
