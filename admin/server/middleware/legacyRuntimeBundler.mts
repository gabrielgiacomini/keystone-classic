import type { Request, Response } from 'express';
import { build as buildWithEsbuild, type Plugin } from 'esbuild';
import crypto from 'crypto';
import fs from 'fs-extra';
import dayjs from 'dayjs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basedir = path.resolve(__dirname + '/../../client-legacy/');
const devMode = process.env.KEYSTONE_DEV === 'true';
const prebuildMode = process.env.KEYSTONE_PREBUILD_ADMIN === 'true';
const devWriteBundles = process.env.KEYSTONE_WRITE_BUNDLES === 'true';

function ts(): string { return dayjs().format('YYYY-MM-DD HH:MM:SS '); }
function logInit(file: string): void { console.log(`Building ${file} with the legacy runtime bundler...`); }
function logError(file: string, err: Error): void { console.log(`${ts()}error building ${file}:\n${err.message}`); }

/** Options for createLegacyRuntimeBundler. */
export interface LegacyRuntimeBundlerOptions {
	stream?: NodeJS.ReadableStream;
	file?: string;
	hash: string;
	writeToDisk?: boolean;
}

/** Legacy runtime bundle middleware with serve and build methods. */
export interface LegacyRuntimeBundleMiddleware {
	serve: (req: Request, res: Response) => void;
	build: () => Promise<void>;
}

/**
 * Creates middleware for serving legacy admin JS bundles that still need runtime compatibility.
 * Supports optional disk writes in dev.
 * @param opts - Middleware options.
 * @returns A legacy runtime bundle middleware instance.
 */
export default function createLegacyRuntimeBundler(opts: LegacyRuntimeBundlerOptions): LegacyRuntimeBundleMiddleware {
	const stream = opts.stream;
	const file = opts.file ?? '';
	const hash = opts.hash;
	const writeToDisk = opts.writeToDisk;

	let building = false;
	const queue: Array<[Request, Response]> = [];
	let src: Buffer | string | undefined;
	let etag: string | undefined;
	let streamSource: Promise<string> | undefined;

	const logName = file.replace(/^\.\//, '');
	const fileName = logName;
	const outputFilename = path.resolve(path.join(__dirname, '../../bundles/js', hash + '-' + fileName));

	function updateBundle(newSrc: Buffer | string): void {
		src = newSrc;
		etag = crypto.createHash('md5').update(newSrc).digest('hex').slice(0, 6);
	}

	function writeBundle(buff: Buffer | string): void {
		if (devWriteBundles || writeToDisk) {
			fs.outputFile(outputFilename, buff, 'utf8', function (err: Error | null) {
				if (err) { return logError(fileName, err); }
			});
		}
	}

	function readStreamSource(): Promise<string> {
		if (!stream) return Promise.resolve('');
		streamSource ??= new Promise((resolve, reject) => {
			const chunks: Buffer[] = [];
			stream.on('data', (chunk: Buffer | string) => {
				chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
			});
			stream.on('error', reject);
			stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
		});
		return streamSource;
	}

	function fieldTypesGlobalPlugin(): Plugin {
		return {
			name: 'legacy-runtime-field-types-global',
			setup(pluginBuild) {
				pluginBuild.onResolve({ filter: /^FieldTypes$/ }, () => ({
					path: 'FieldTypes',
					namespace: 'legacy-runtime-field-types-global',
				}));
				pluginBuild.onLoad({ filter: /^FieldTypes$/, namespace: 'legacy-runtime-field-types-global' }, () => ({
					contents: [
						'const fieldTypes = globalThis.FieldTypes || {};',
						'export const Columns = fieldTypes.Columns || {};',
						'export const Fields = fieldTypes.Fields || {};',
						'export const Filters = fieldTypes.Filters || {};',
						'export default fieldTypes;',
					].join('\n'),
					loader: 'js',
				}));
			},
		};
	}

	function fieldTypesStreamPlugin(contents: string): Plugin {
		return {
			name: 'legacy-runtime-field-types-stream',
			setup(pluginBuild) {
				pluginBuild.onResolve({ filter: /^FieldTypes$/ }, () => ({
					path: 'FieldTypes',
					namespace: 'legacy-runtime-field-types-stream',
				}));
				pluginBuild.onLoad({ filter: /^FieldTypes$/, namespace: 'legacy-runtime-field-types-stream' }, () => ({
					contents: [
						contents,
						'globalThis.FieldTypes = { Columns, Fields, Filters };',
						'export default globalThis.FieldTypes;',
					].join('\n'),
					loader: 'js',
					resolveDir: basedir,
				}));
			},
		};
	}

	async function bundleWithEsbuild(): Promise<string> {
		if (stream) {
			const result = await buildWithEsbuild({
				absWorkingDir: basedir,
				bundle: true,
				entryPoints: ['FieldTypes'],
				format: 'iife',
				globalName: 'KeystoneLegacyRuntimeFieldTypes',
				jsx: 'transform',
				loader: { '.mjs': 'jsx' },
				logLevel: 'silent',
				platform: 'browser',
				plugins: [fieldTypesStreamPlugin(await readStreamSource())],
				sourcemap: devMode,
				target: ['es2018'],
				write: false,
			});
			return result.outputFiles[0]?.text ?? '';
		}

		const result = await buildWithEsbuild({
			absWorkingDir: basedir,
			bundle: true,
			define: {
				'process.env.NODE_ENV': JSON.stringify(devMode ? 'development' : 'production'),
			},
			entryPoints: [file],
			format: 'iife',
			globalName: `KeystoneLegacyRuntime${fileName.replace(/[^A-Za-z0-9_$]/g, '_')}`,
			jsx: 'transform',
			loader: { '.mjs': 'jsx' },
			logLevel: 'silent',
			platform: 'browser',
			plugins: [fieldTypesGlobalPlugin()],
			sourcemap: devMode,
			target: ['es2018'],
			write: false,
		});
		return result.outputFiles[0]?.text ?? '';
	}

	async function build(): Promise<void> {
		if (building) return;
		building = true;
		try {
			if (devMode) logInit(logName);
			const buff = await bundleWithEsbuild();
			updateBundle(buff);
			while (queue.length) {
				const entry = queue.shift();
				if (entry) { send(entry[0], entry[1]); }
			}
			writeBundle(buff);
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			logError(logName, error);
			while (queue.length) {
				const entry = queue.shift();
				if (entry) { entry[1].status(500).type('text/plain').send(error.message); }
			}
		} finally {
			building = false;
		}
	}

	function serve(req: Request, res: Response): void {
		if (src) { return send(req, res); }
		if (devMode || prebuildMode) {
			queue.push([req, res]);
			void build();
			return;
		}
		fs.readFile(outputFilename, function (_err: NodeJS.ErrnoException | null, data?: Buffer) {
			if (data) {
				updateBundle(data);
				send(req, res);
			} else {
				queue.push([req, res]);
				void build();
			}
		});
	}

	function send(req: Request, res: Response): void {
		res.setHeader('Content-Type', 'application/javascript');
		if (etag === req.get('If-None-Match')) {
			res.status(304);
			res.end();
		} else {
			if (etag) { res.set('ETag', etag); }
			res.set('Vary', 'Accept-Encoding');
			res.send(src);
		}
	}

	return { serve: serve, build: build };
}
