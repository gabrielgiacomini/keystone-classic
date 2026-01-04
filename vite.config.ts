import { defineConfig, Plugin } from 'vite';
import { babel } from '@rollup/plugin-babel';
import path from 'path';

const browserifyShimGlobals: Record<string, string> = {
	tinymce: 'tinymce',
	jquery: '$',
	codemirror: 'CodeMirror',
	underscore: '_',
};

function injectReactPropTypesShim(): Plugin {
	return {
		name: 'inject-react-proptypes-shim',
		renderChunk(code, chunk) {
			if (chunk.fileName.includes('shared-') && code.includes('propTypesExports')) {
				return code.replace(
					/var propTypesExports = propTypes\$1\.exports;/,
					`var propTypesExports = propTypes$1.exports;
// React 15/16 compat: add PropTypes to React for old packages
if (typeof reactExports !== 'undefined' && !reactExports.PropTypes) {
  reactExports.PropTypes = propTypesExports;
}`
				);
			}
			return null;
		},
	};
}

// react-router@3.x has broken ESM build (es/ imports from react-is incorrectly)
const forceCjsPackages = ['react-router', 'react-router-redux'];

function globalShimsPlugin(): Plugin {
	return {
		name: 'global-shims',
		resolveId(id) {
			if (id in browserifyShimGlobals) {
				return { id: `\0global:${id}`, external: false };
			}
			return null;
		},
		load(id) {
			if (id.startsWith('\0global:')) {
				const pkg = id.replace('\0global:', '');
				const globalVar = browserifyShimGlobals[pkg];
				return `export default window.${globalVar};`;
			}
			return null;
		},
	};
}

function forceCjsPlugin(): Plugin {
	return {
		name: 'force-cjs',
		enforce: 'pre',
		resolveId(id, importer, options) {
			if (forceCjsPackages.includes(id)) {
				return this.resolve(`${id}/lib/index`, importer, { ...options, skipSelf: true });
			}
			for (const pkg of forceCjsPackages) {
				if (id.startsWith(`${pkg}/es/`)) {
					const newId = id.replace(`${pkg}/es/`, `${pkg}/lib/`);
					return this.resolve(newId, importer, { ...options, skipSelf: true });
				}
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
			forceCjsPlugin(),
			{
				...babel({
					babelHelpers: 'bundled',
					extensions: ['.js', '.jsx'],
					presets: [
						['@babel/preset-react', { runtime: 'classic' }],
						['@babel/preset-env', { modules: false, targets: '> 0.25%, not dead' }],
					],
					plugins: ['add-module-exports'],
				}),
				enforce: 'pre',
			},
			globalShimsPlugin(),
			injectReactPropTypesShim(),
		],

		esbuild: false,

		resolve: {
			alias: {
				'FieldTypes': path.resolve(__dirname, 'admin/client/FieldTypes.js'),
			},
			dedupe: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'prop-types'],
		},

	build: {
		outDir: path.resolve(__dirname, 'admin/public/js'),
		emptyOutDir: false,
			sourcemap: !isProd,
			minify: isProd ? 'esbuild' : false,
			target: 'es2015',
			commonjsOptions: {
				include: [/node_modules/, /fields\/utils/],
				transformMixedEsModules: true,
				defaultIsModuleExports: true,
				strictRequires: 'auto',
				esmExternals: true,
			},
			
			rollupOptions: {
				input: {
					admin: path.resolve(__dirname, 'admin/client/App/index.js'),
					signin: path.resolve(__dirname, 'admin/client/Signin/index.js'),
				},
				
				output: {
					entryFileNames: '[name].js',
					chunkFileNames: 'shared-[hash].js',
					assetFileNames: '[name].[ext]',
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return 'vendor';
						}
					},
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
			include: [
				'prop-types',
				'react',
				'react-dom',
				'react-router',
				'react-redux',
				'redux',
				'redux-saga',
				'redux-thunk',
				'glamor',
				'lodash',
				'moment',
				'create-react-class',
				'classnames',
				'blacklist',
				'qs',
				'xhr',
			],
			force: true,
			esbuildOptions: {
				target: 'es2015',
			},
		},
	};
});
