import type { Request, Response } from 'express';
import type browserifyLib from 'browserify';
import type { Chalk } from 'chalk';
import chalkRaw from 'chalk';
import crypto from 'crypto';
import fs from 'fs-extra';
import dayjs from 'dayjs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import packages from '../../client-legacy/packages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// JUSTIFIED: chalk v2 CJS sets `module.exports = Chalk()` but its .d.ts uses `export default chalk`
// (ESM-style). With NodeNext resolution the default import resolves to the module namespace rather
// than the Chalk instance. The runtime value IS the Chalk instance; we narrow to the correct type.
const chalk = chalkRaw as unknown as Chalk;

const basedir = path.resolve(__dirname + '/../../client-legacy/');
const devMode = process.env.KEYSTONE_DEV === 'true';
const devWriteBundles = process.env.KEYSTONE_WRITE_BUNDLES === 'true';
const devWriteDisc = process.env.KEYSTONE_WRITE_DISC === 'true';

function ts(): string { return chalk.gray(dayjs().format('YYYY-MM-DD HH:MM:SS ')); }
function logInit(file: string): void { console.log(chalk.grey('Watching ') + chalk.underline(file) + chalk.grey(' for changes...')); }
function logRebuild(file: string): void { console.log(ts() + chalk.green('rebuilt ' + chalk.underline(file))); }
function logError(file: string, err: Error): void { console.log(ts() + chalk.red('error building ' + chalk.underline(file) + ':') + '\n' + err.message); }

/** Options for createBrowserifyMiddleware. */
export interface BrowserifyMiddlewareOptions {
	stream?: NodeJS.ReadableStream;
	expose?: string;
	file?: string;
	hash: string;
	writeToDisk?: boolean;
}

/** Browserify middleware with serve and build methods. */
export interface BrowserifyMiddleware {
	serve: (req: Request, res: Response) => void;
	build: () => Promise<void>;
}

/**
 * Creates a Browserify middleware for serving legacy admin JS bundles.
 * Supports watch mode and optional disk writes in dev.
 * @param opts - Middleware options.
 * @returns A Browserify middleware instance.
 */
export default function createBrowserifyMiddleware(opts: BrowserifyMiddlewareOptions): BrowserifyMiddleware {
	const stream = opts.stream;
	const expose = opts.expose;
	const file = opts.file ?? '';
	const hash = opts.hash;
	const writeToDisk = opts.writeToDisk;

	let b: browserifyLib.BrowserifyObject | undefined;
	let building = false;
	const queue: Array<[Request, Response]> = [];
	let src: Buffer | string | undefined;
	let etag: string | undefined;

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
		if (devWriteDisc) {
			const discFile = fileName.replace('.js', '.html');
			void import('disc').then(({ default: disc }) => {
				disc.bundle(buff, function (err: Error | null, html: string) {
					if (err) { logError(discFile, err); }
					else {
						void fs.outputFile(path.resolve(path.join(__dirname, '../../bundles/disc', discFile)), html, 'utf8');
						console.log(ts() + chalk.green('wrote disc for ' + chalk.underline(file)));
					}
				});
			});
		}
	}

	async function build(): Promise<void> {
		if (building) return;
		building = true;
		let swcify: typeof import('swcify');
		let browserify: typeof import('browserify');
		let watchify: typeof import('watchify');
		try {
			([{ default: swcify }, { default: browserify }, { default: watchify }] = await Promise.all([
				import('swcify'),
				import('browserify'),
				import('watchify'),
			]));
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			const message = 'Legacy admin runtime bundling requires browserify, watchify, and swcify. '
				+ 'Install the development bundling dependencies or use the prebuilt built-in legacy bundles.';
			logError(logName, new Error(`${message}\n${error.message}`));
			while (queue.length) {
				const entry = queue.shift();
				if (entry) { entry[1].status(500).type('text/plain').send(message); }
			}
			building = false;
			return;
		}
		const bOpts: browserifyLib.Options = { basedir: basedir };
		if (devMode) {
			logInit(logName);
			bOpts.debug = true;
			// cache and packageCache are runtime-required by watchify; they live on
			// the CustomOptions index signature ([propName: string]: any) in @types/browserify. // JUSTIFIED: occurrence is in a comment, not a type annotation
			(bOpts as Record<string, unknown>)['cache'] = {};
			(bOpts as Record<string, unknown>)['packageCache'] = {};
		}
		if (devWriteDisc) { bOpts.fullPaths = true; }

		if (stream) {
			b = browserify(bOpts);
			b.require(stream as unknown as browserifyLib.InputFile, { expose: expose });
		} else {
			b = browserify(file, bOpts);
		}

		b.transform(swcify);
		b.exclude('FieldTypes');
		packages.forEach(function (i: string) { b?.exclude(i); });

		if (devMode) { b = watchify(b, { poll: 500 }); }

		b.bundle(function (err: Error | null, buff: Buffer) {
			if (err) return logError(logName, err);
			updateBundle(buff);
			queue.forEach(function (reqres) { send(reqres[0], reqres[1]); });
			writeBundle(buff);
		});

		b.on('update', function () {
			b?.bundle(function (err: Error | null, buff: Buffer) {
				if (err) return logError(logName, err);
				else logRebuild(logName);
				updateBundle(buff);
				writeBundle(buff);
			});
		});
	}

	function serve(req: Request, res: Response): void {
		if (src) { return send(req, res); }
			fs.readFile(outputFilename, function (_err: NodeJS.ErrnoException | null, data?: Buffer) {
				if (data) {
					updateBundle(data);
					if (devMode) { void build(); }
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
