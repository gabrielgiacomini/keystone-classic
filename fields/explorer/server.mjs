/**
 * @file
 * This file is the server for the KeystoneJS Field Types Explorer.
 * It sets up an Express server to serve the explorer's HTML, CSS, and JavaScript files.
 * It also provides a stub API for relationship fields.
 * @see {@link http://localhost:8001}
 */
import { build } from 'esbuild';
import express from 'express';
import path from 'path';
import createLessMiddleware from '../../lib/middleware/less.mts';

const app = new express();

const globalFieldTypesPlugin = {
	name: 'global-field-types',
	setup (builder) {
		builder.onResolve({ filter: /^FieldTypes$/ }, () => ({
			path: 'FieldTypes',
			namespace: 'global-field-types',
		}));
		builder.onLoad({ filter: /.*/, namespace: 'global-field-types' }, () => ({
			contents: [
				'const fieldTypes = globalThis.FieldTypes || {};',
				'export const Columns = fieldTypes.Columns || {};',
				'export const Fields = fieldTypes.Fields || {};',
				'export const Filters = fieldTypes.Filters || {};',
				'export default fieldTypes;',
			].join('\n'),
		}));
	},
};

function createBundleHandler(entry) {
	return async function bundleHandler(_req, res, next) {
		try {
			const result = await build({
				entryPoints: [entry],
				bundle: true,
				format: 'iife',
				globalName: 'KeystoneFieldExplorer',
				platform: 'browser',
				write: false,
				sourcemap: 'inline',
				loader: {
					'.mjs': 'jsx',
				},
				plugins: [globalFieldTypesPlugin],
			});
			res.type('js').send(result.outputFiles[0]?.text ?? '');
		} catch (err) {
			next(err);
		}
	};
}

// Serve the explorer stylesheet
app.get('/index.css', (_req, res) => res.sendFile(path.resolve('./fields/explorer/index.css')));

// Serve script bundles
app.get('/js/explorer.js', createBundleHandler('./fields/explorer/index.mjs'));


// Serve stylesheet and static assets
const elementalPath = path.resolve('./admin/client-legacy/vendor/elemental');
const keystoneTinymcePath = path.resolve('./admin/public-legacy/styles/optional-tinymce');
const lessOptions = {
	render: {
		javascriptEnabled: true,
		modifyVars: {
			adminLegacyPath: JSON.stringify('/'),
			customStylesPath: JSON.stringify(''),
			elementalPath: JSON.stringify(elementalPath),
			keystoneTinymcePath: JSON.stringify(keystoneTinymcePath),
		},
	},
};
app.use('/styles', createLessMiddleware(path.resolve('./admin/public-legacy/styles'), lessOptions));
app.use('/styles/fonts', express.static(
	path.resolve('./admin/public-legacy/js/lib/tinymce/skins/keystone/fonts')
));
app.use(express.static('./admin/public-legacy'));

// Stub API for Relationships
app.get('/api/flavours', (_req, res) => res.json({
	results: [
		{ id: 'chocolate', name: 'Chocolate' },
		{ id: 'vanilla', name: 'Vanilla' },
		{ id: 'strawberry', name: 'Strawberry' },
	],
	count: 3,
}));

// Serve the index template
app.use('/', (_req, res) => res.sendFile(path.resolve('./fields/explorer/index.html')));

// 8001 — secondary dev tool, avoids reserved 8000 (port-cluster rule)
app.listen(8001, function () {
	console.log('Field Types Explorer ready on http://localhost:8001');
});
