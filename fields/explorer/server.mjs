/**
 * @file
 * This file is the server for the KeystoneJS Field Types Explorer.
 * It sets up an Express server to serve the explorer's HTML, CSS, and JavaScript files.
 * It also provides a stub API for relationship fields.
 * @see {@link http://localhost:8001}
 */
import swcify from 'swcify';
import browserify from 'browserify-middleware';
import express from 'express';
import fs from 'node:fs/promises';
import less from 'less';
import path from 'path';
import { fileURLToPath } from 'node:url';
import brfs from 'brfs';

import packages from '../../admin/client-legacy/packages.mjs';

const app = new express();

function createLessMiddleware(rootPath, options = {}) {
	const root = path.resolve(rootPath);
	return async function lessCompiler(req, res, next) {
		if (req.method !== 'GET' && req.method !== 'HEAD' || !req.path.endsWith('.css')) {
			next();
			return;
		}

		const decodedPath = decodeURIComponent(req.path);
		const minified = decodedPath.endsWith('.min.css');
		const cssRelativePath = path.normalize(decodedPath).replace(/^[/\\]+/, '');
		const lessRelativePath = cssRelativePath.replace(/(?:\.min)?\.css$/, '.less');
		const sourcePath = path.resolve(root, lessRelativePath);
		const rootPrefix = root.endsWith(path.sep) ? root : root + path.sep;
		if (sourcePath !== root && !sourcePath.startsWith(rootPrefix)) {
			next();
			return;
		}

		try {
			const renderOptions = {
				...(options.render || {}),
				filename: sourcePath,
				paths: [path.dirname(sourcePath)],
			};
			if (minified && renderOptions.compress === undefined) renderOptions.compress = true;
			const output = await less.render(await fs.readFile(sourcePath, 'utf8'), renderOptions);
			res.type('css').send(output.css);
		} catch (err) {
			if (err && err.code === 'ENOENT') {
				next();
				return;
			}
			next(err);
		}
	};
}

// Serve the explorer stylesheet
app.get('/index.css', (_req, res) => res.sendFile(path.resolve('./fields/explorer/index.css')));

// Serve script bundles
app.get('/js/explorer.js', browserify('./fields/explorer/index.mjs', {
	external: packages.concat(['FieldTypes']),
	transform: [
		// Configured via .swcrc at the repo root.
		swcify,
		brfs,
	],
}));


// Serve stylesheet and static assets
// import.meta.resolve returns a file:// URL; convert to a filesystem path.
const elementalPath = path.resolve('./admin/client-legacy/vendor/elemental');
const reactSelectPath = path.join(path.dirname(fileURLToPath(import.meta.resolve('react-select'))), '..');
const lessOptions = {
	render: {
		modifyVars: {
			adminLegacyPath: JSON.stringify('/'),
			customStylesPath: '',
			elementalPath: JSON.stringify(elementalPath),
			reactSelectPath: JSON.stringify(reactSelectPath),
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
