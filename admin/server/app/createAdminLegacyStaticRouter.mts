import type { Keystone } from '../../../index.mjs';
import type { Router as ExpressRouter } from 'express';
import browserify from '../middleware/browserify.mjs';
import express from 'express';
import path from 'path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { getAdminLegacyPath } from '../../../lib/core/adminSurfacePathUtils.mjs';
import createLessMiddleware from '../../../lib/middleware/less.mjs';
import { resolveOptionalPackageDir, resolvePackageDir } from '../../../lib/optionalPackage.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const builtInLegacyFieldTypeNames = new Set([
	'boolean',
	'cloudinary',
	'cloudinaryimage',
	'cloudinaryimages',
	'code',
	'color',
	'date',
	'datearray',
	'datetime',
	'email',
	'file',
	'geopoint',
	'html',
	'key',
	'localfile',
	'localfiles',
	'location',
	'markdown',
	'money',
	'name',
	'number',
	'numberarray',
	'password',
	'relationship',
	'select',
	'text',
	'textarea',
	'textarray',
	'url',
]);

function buildFieldTypesStream(fieldTypes: Record<string, string>): Readable {
	const lines: string[] = [];
	const imports: string[] = [];
	const types = Object.keys(fieldTypes).filter((t) => typeof fieldTypes[t] === 'string');
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

function hasCustomLegacyFieldTypes(fieldTypes: Record<string, unknown>): boolean {
	return Object.keys(fieldTypes).some((typeName) => !builtInLegacyFieldTypeNames.has(typeName));
}

export default function createAdminLegacyStaticRouter(keystone: Keystone): ExpressRouter {
	const keystoneHash = keystone.createKeystoneHash();
	const writeToDisk = keystone.get('cache admin bundles');
	const router = express.Router();
	const shouldUseRuntimeBundler =
		process.env.KEYSTONE_DEV === 'true'
		|| process.env.KEYSTONE_PREBUILD_ADMIN === 'true'
		|| process.env.KEYSTONE_LEGACY_RUNTIME_BUNDLER === 'true'
		|| hasCustomLegacyFieldTypes(keystone.fieldTypes as Record<string, string>);

	const bundles = {
		fields: browserify({
			stream: buildFieldTypesStream(keystone.fieldTypes as Record<string, string>),
			expose: 'FieldTypes',
			file: './FieldTypes.mjs',
			hash: keystoneHash,
			writeToDisk: writeToDisk,
		}),
		signin: browserify({
			file: './Signin/index.mjs',
			hash: keystoneHash,
			writeToDisk: writeToDisk,
		}),
		admin: browserify({
			file: './App/index.mjs',
			hash: keystoneHash,
			writeToDisk: writeToDisk,
		}),
	};

	const elementalPath = path.join(resolvePackageDir('elemental'), '..');
	const reactSelectPath = path.join(resolvePackageDir('react-select'), '..');
	const keystoneTinymcePath = resolvePackageDir('keystone-tinymce');
	const tinymcePath = resolveOptionalPackageDir('tinymce');
	const customStylesPath = keystone.getPath('adminui custom styles') || '';

	const lessOptions = {
		render: {
			javascriptEnabled: true,
			modifyVars: {
				elementalPath: JSON.stringify(elementalPath),
				reactSelectPath: JSON.stringify(reactSelectPath),
				keystoneTinymcePath: JSON.stringify(keystoneTinymcePath),
				customStylesPath: JSON.stringify(customStylesPath),
				adminLegacyPath: JSON.stringify(getAdminLegacyPath(keystone).slice(1)),
			},
		},
	};

	router.use('/styles', createLessMiddleware(path.resolve(__dirname + '/../../public-legacy/styles'), lessOptions));
	router.use('/styles/fonts', express.static(`${keystoneTinymcePath}/skin/fonts`));
		if (shouldUseRuntimeBundler) {
			if (process.env.KEYSTONE_DEV === 'true' || process.env.KEYSTONE_PREBUILD_ADMIN === 'true') {
				void bundles.fields.build();
				void bundles.signin.build();
				void bundles.admin.build();
			}
		router.get('/js/fields.js', bundles.fields.serve);
		router.get('/js/signin.js', bundles.signin.serve);
		router.get('/js/admin.js', bundles.admin.serve);
	}
	router.use('/js/lib/tinymce/skins/keystone', express.static(`${keystoneTinymcePath}/skin`));
	router.use('/js/lib/tinymce/plugins/uploadimage', express.static(`${keystoneTinymcePath}/plugins/uploadimage`));
	if (tinymcePath) {
		router.use('/js/lib/tinymce', express.static(tinymcePath));
	}
	router.use(express.static(path.resolve(__dirname + '/../../public-legacy')));

	return router;
}
