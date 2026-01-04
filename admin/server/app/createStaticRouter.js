var express = require('express');
var less = require('less-middleware');
var path = require('path');

var publicDir = path.resolve(__dirname + '/../../public');

module.exports = function createStaticRouter (keystone) {
	var router = express.Router();

	var elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
	var reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');
	var keystoneTinymcePath = path.dirname(require.resolve('keystone-tinymce'));
	var customStylesPath = keystone.getPath('adminui custom styles') || '';

	var lessOptions = {
		render: {
			javascriptEnabled: true,
			modifyVars: {
				elementalPath: JSON.stringify(elementalPath),
				reactSelectPath: JSON.stringify(reactSelectPath),
				keystoneTinymcePath: JSON.stringify(keystoneTinymcePath),
				customStylesPath: JSON.stringify(customStylesPath),
				adminPath: JSON.stringify(keystone.get('admin path')),
			},
		},
	};

	router.use('/styles', less(path.resolve(__dirname + '/../../public/styles'), lessOptions));
	router.use('/styles/fonts', express.static(`${keystoneTinymcePath}/skin/fonts`));

	router.use('/js', express.static(path.join(publicDir, 'js')));

	router.use('/js/lib/tinymce/skins/keystone', express.static(`${keystoneTinymcePath}/skin`));
	router.use('/js/lib/tinymce/plugins/uploadimage', express.static(`${keystoneTinymcePath}/plugins/uploadimage`));
	router.use('/js/lib/tinymce', express.static(path.dirname(require.resolve('tinymce'))));
	router.use(express.static(publicDir));

	return router;
};
