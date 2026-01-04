import { defineConfig, Plugin } from 'vite';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

const externalPackages = [
	'glamor',
	'async',
	'blacklist',
	'classnames',
	'display-name',
	'elemental',
	'expression-match',
	'i',
	'list-to-array',
	'lodash',
	'marked',
	'moment',
	'numeral',
	'qs',
	'react-addons-css-transition-group',
	'react-color',
	'react-day-picker',
	'react-dnd-html5-backend',
	'react-dnd',
	'react-dom',
	'react-images',
	'react-redux',
	'react-router-redux',
	'react-router',
	'react-select',
	'react',
	'redux-saga',
	'redux-thunk',
	'redux',
	'vkey',
	'xhr',
];

const browserifyShimGlobals: Record<string, string> = {
	tinymce: 'tinymce',
	jquery: '$',
	codemirror: 'CodeMirror',
	underscore: '_',
};

function globalShimsPlugin(): Plugin {
	return {
		name: 'global-shims',
		resolveId(id) {
			if (id in browserifyShimGlobals) {
				return { id, external: true };
			}
			return null;
		},
		load(id) {
			if (browserifyShimGlobals[id]) {
				return `export default window.${browserifyShimGlobals[id]};`;
			}
			return null;
		},
	};
}

export default defineConfig(({ command, mode }) => {
	const isProd = mode === 'production';

	return {
		root: path.resolve(__dirname, 'admin/client'),
		
		plugins: [
			{
				...babel({
					babelHelpers: 'bundled',
					extensions: ['.js', '.jsx'],
					presets: [
						'@babel/preset-react',
						['@babel/preset-env', { modules: false }],
					],
					include: ['admin/**', 'fields/**'],
				}),
				enforce: 'pre',
			},
			commonjs({
				transformMixedEsModules: true,
				strictRequires: 'auto',
			}),
			globalShimsPlugin(),
		],

		esbuild: false,

		resolve: {
			alias: {
				'FieldTypes': path.resolve(__dirname, 'admin/client/FieldTypes.js'),
			},
			dedupe: ['react', 'react-dom'],
		},

		build: {
			outDir: path.resolve(__dirname, 'admin/public/js'),
			emptyOutDir: false,
			sourcemap: !isProd,
			minify: isProd ? 'esbuild' : false,

			rollupOptions: {
				input: {
					admin: path.resolve(__dirname, 'admin/client/App/index.js'),
					signin: path.resolve(__dirname, 'admin/client/Signin/index.js'),
					fields: path.resolve(__dirname, 'admin/client/FieldTypes.js'),
				},
				
				output: {
					entryFileNames: '[name].js',
					chunkFileNames: 'shared.js',
					assetFileNames: '[name].[ext]',
					manualChunks: undefined,
				},


			},
		},

		server: {
			port: 3001,
			strictPort: true,
			proxy: {
				'/keystone/api': {
					target: 'http://localhost:3000',
					changeOrigin: true,
				},
			},
		},

		optimizeDeps: {
			include: externalPackages,
			esbuildOptions: {
				target: 'es2015',
			},
		},
	};
});
