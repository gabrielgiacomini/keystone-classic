import type { Keystone } from '../../../index.mjs';
import type { Router as ExpressRouter } from 'express';
import express from 'express';
import path from 'path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import createLegacyRuntimeBundler from '../middleware/legacyRuntimeBundler.mjs';
import { resolveOptionalPackageDir } from '../../../lib/optionalPackage.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function buildFieldTypesStream(fieldTypes: Record<string, string>): Readable {
	const lines: string[] = [];
	const imports: string[] = [];
	const types = Object.keys(fieldTypes).filter((type) => typeof fieldTypes[type] === 'string');
	['Column', 'Field', 'Filter'].forEach(function (kind) {
		types.forEach(function (type) {
			const binding = type + '$' + kind;
			imports.push(`import ${binding} from "../../fields/types/${type}/${fieldTypes[type]}${kind}.mjs";`);
		});
	});
	imports.push('import id$Column from "../../fields/components/columns/IdColumn.mjs";');
	imports.push('import unrecognised$Column from "../../fields/components/columns/InvalidColumn.mjs";');
	lines.push(...imports, '');
	['Column', 'Field', 'Filter'].forEach(function (kind) {
		lines.push(`export const ${kind}s = {`);
		types.forEach(function (type) {
			lines.push(`\t${type}: ${type}$${kind},`);
		});
		if (kind === 'Column') {
			lines.push('\tid: id$Column,');
			lines.push('\t__unrecognised__: unrecognised$Column,');
		}
		lines.push('};');
	});
	return Readable.from(lines.join('\n') + '\n');
}

/**
 * Serves the React 17-era legacy admin static assets through React 18 bundles.
 * @param keystone - Keystone instance providing hash, config, and field type metadata.
 * @returns Express router for legacy admin assets.
 */
export default function createAdminLegacyStaticRouter(keystone: Keystone): ExpressRouter {
	const keystoneHash = keystone.createKeystoneHash();
	const writeToDisk = keystone.get('cache admin bundles');
	const router = express.Router();
	const bundles = {
		fields: createLegacyRuntimeBundler({
			stream: buildFieldTypesStream(keystone.fieldTypes as Record<string, string>),
			file: './FieldTypes.mjs',
			hash: keystoneHash,
			writeToDisk,
		}),
		signin: createLegacyRuntimeBundler({
			file: './Signin/index.mjs',
			hash: keystoneHash,
			writeToDisk,
		}),
		admin: createLegacyRuntimeBundler({
			file: './App/index.mjs',
			hash: keystoneHash,
			writeToDisk,
		}),
	};
	if (process.env.KEYSTONE_DEV === 'true' || process.env.KEYSTONE_PREBUILD_ADMIN === 'true') {
		void bundles.fields.build();
		void bundles.signin.build();
		void bundles.admin.build();
	}
	const keystoneTinymcePath = resolveOptionalPackageDir('keystone-tinymce');
	const tinymcePath = resolveOptionalPackageDir('tinymce');

	router.get('/js/fields.js', bundles.fields.serve);
	router.get('/js/signin.js', bundles.signin.serve);
	router.get('/js/admin.js', bundles.admin.serve);
	if (keystoneTinymcePath) {
		router.use('/js/lib/tinymce/skins/keystone', express.static(`${keystoneTinymcePath}/skin`));
		router.use('/js/lib/tinymce/plugins/uploadimage', express.static(`${keystoneTinymcePath}/plugins/uploadimage`));
	}
	if (tinymcePath) {
		router.use('/js/lib/tinymce', express.static(tinymcePath));
	}
	router.use(express.static(path.resolve(__dirname + '/../../public-legacy')));
	return router;
}
