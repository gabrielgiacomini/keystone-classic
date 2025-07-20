/**
 * @fileoverview
 * This file sets up an Express server to explore KeystoneJS field types.
 * It serves the explorer's HTML, CSS, and JavaScript, and includes a stub API
 * for relationship fields.
 */

const babelify = require('babelify');
const browserify = require('browserify-middleware');
const express = require('express');
const less = require('less-middleware');
const path = require('path');

const packages = require('../../admin/client/packages');

const app = new express();

// Serve the explorer stylesheet
app.get('/index.css', (req, res) => res.sendFile(path.resolve('./fields/explorer/index.css')));

/**
 * Serve script bundles
 *
 * @api public
 */
app.get('/js/explorer.js', browserify('./fields/explorer/index.js', {
	// Exclude these packages from the bundle
	external: packages.concat(['FieldTypes']),
	// Transforms to apply
	transform: [
		// Babelify for ES6+ and JSX
		babelify.configure({
			presets: ['@babel/preset-env', '@babel/preset-react'],
		}),
		// brfs for inlining file contents
		require('brfs'),
	],
}));


/**
 * Serve stylesheet and static assets
 *
 * @api public
 */
const elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
const reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');
const lessOptions = {
	render: {
		modifyVars: {
			adminPath: JSON.stringify('/'),
			customStylesPath: '',
			elementalPath: JSON.stringify(elementalPath),
			reactSelectPath: JSON.stringify(reactSelectPath),
		},
	},
};
app.use('/styles', less(path.resolve('./admin/public/styles'), lessOptions));
app.use('/styles/fonts', express.static(
	path.resolve('./admin/public/js/lib/tinymce/skins/keystone/fonts')
));
app.use(express.static('./admin/public'));

/**
 * Stub API for Relationships
 *
 * @api public
 */
app.get('/api/flavours', (req, res) => res.json({
	results: [
		{ id: 'chocolate', name: 'Chocolate' },
		{ id: 'vanilla', name: 'Vanilla' },
		{ id: 'strawberry', name: 'Strawberry' },
	],
	count: 3,
}));

/**
 * Serve the index template
 *
 * @api public
 */
app.use('/', (req, res) => res.sendFile(path.resolve('./fields/explorer/index.html')));

app.listen(8000, function () {
	console.log('Field Types Explorer ready on http://localhost:8000');
});
