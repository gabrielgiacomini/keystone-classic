import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { createJiti } from 'jiti';
import semver from 'semver';
import keystone from '../index.mjs';
import { plural } from './utils/string.mjs';

const _dashes_ = '------------------------------------------------';
const requireUpdate = createRequire(import.meta.url);
const supportedUpdateExtensions = new Set(['.js', '.mjs', '.ts', '.mts', '.coffee']);
const jitiUpdateExtensions = new Set(['.ts', '.mts']);
const testUpdateFilePattern = /\.(?:spec|test)\.(?:js|mjs|ts|mts)$/;

interface UpdateFile {
	filename: string;
	key: string;
}

interface UpdateModule {
	create?: unknown;
	default?: unknown;
	options?: Record<string, unknown>;
	__background__?: boolean;
	__defer__?: boolean;
	__commit__?: boolean;
}

type UpdateDone = (err?: Error | null) => void;
type UpdateFn = ((this: typeof keystone, done: UpdateDone) => unknown) & UpdateModule;

function isRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === 'object';
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
	return !!value && (typeof value === 'object' || typeof value === 'function') && typeof (value as { then?: unknown }).then === 'function';
}

function isRequireEsmError(error: unknown): boolean {
	if (!isRecord(error)) return false;
	return error['code'] === 'ERR_REQUIRE_ESM' || error['code'] === 'ERR_REQUIRE_ASYNC_MODULE';
}

function isTestUpdateFile(filename: string): boolean {
	return testUpdateFilePattern.test(filename);
}

async function importUpdateFile(filePath: string): Promise<unknown> {
	const url = pathToFileURL(filePath);
	url.searchParams.set('mtime', String(fs.statSync(filePath).mtimeMs));
	return import(url.href);
}

async function loadUpdateFile(filePath: string, ext: string): Promise<unknown> {
	if (jitiUpdateExtensions.has(ext)) {
		const jiti = createJiti(filePath, {
			interopDefault: false,
			moduleCache: false,
		});
		return jiti.import(filePath);
	}
	if (ext === '.mjs') {
		return importUpdateFile(filePath);
	}
	try {
		return requireUpdate(filePath);
	} catch (error) {
		if (ext === '.js' && isRequireEsmError(error)) {
			return importUpdateFile(filePath);
		}
		throw error;
	}
}

function resolveUpdateExport(rawUpdate: unknown): unknown {
	if (!isRecord(rawUpdate) || !('default' in rawUpdate)) {
		return rawUpdate;
	}
	const defaultExport = rawUpdate['default'];
	if (typeof defaultExport === 'function') {
		const update = defaultExport as UpdateFn;
		for (const key of ['__background__', '__defer__', '__commit__'] as const) {
			if (update[key] === undefined && rawUpdate[key] !== undefined) {
				update[key] = rawUpdate[key] as boolean | undefined;
			}
		}
		return update;
	}
	if (isRecord(defaultExport) && 'create' in defaultExport) {
		return defaultExport;
	}
	return rawUpdate;
}

function runUpdate(update: UpdateFn): Promise<void> {
	return new Promise<void>(function (resolve, reject) {
		let settled = false;
		const done: UpdateDone = function (err) {
			if (settled) return;
			settled = true;
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		};

		let result: unknown;
		try {
			result = update.call(keystone, done);
		} catch (err) {
			done(err instanceof Error ? err : new Error(String(err)));
			return;
		}

		if (isPromiseLike(result)) {
			result.then(function () {
				done(null);
			}, function (err: unknown) {
				done(err instanceof Error ? err : new Error(String(err)));
			});
			return;
		}

		if (update.length === 0) {
			done(null);
		}
	});
}

export const apply = async function (callback: () => void): Promise<void> {
	const mongoose = keystone.mongoose;
	// JUSTIFIED: Mongoose.model returns a generic Model<any> — the Update model is internal-only and not
	// referenced by any public type; widening to the same loosely-typed model is safe here.
	const Update = ('App_Update' in mongoose.models
		? mongoose.models['App_Update']
		: mongoose.model('App_Update', new mongoose.Schema(
			{
				key: { type: String, index: true },
				appliedOn: { type: Date, default: Date.now },
			},
			{ collection: 'app_updates' }
		))) as { findOne(q: object): { exec(): Promise<unknown> }; new(data: object): { save(): Promise<unknown> } };
	let updateCount = 0;
	let deferCount = 0;
	let skipCount = 0;

	const updatesPath = keystone.getPath('updates', 'updates');

	const logError = function (...args: unknown[]): void {
		for (let i = 0, len = args.length; i < len; ++i) {
			process.stderr.write(String(args[i]) + '\n');
		}
	};

	const applyUpdate = async function (file: UpdateFile): Promise<void> {
		const updateRecord = await Update.findOne({ key: file.key }).exec();
		if (updateRecord) return;

		const ext = path.extname(file.filename);
		const rawUpdate: unknown = resolveUpdateExport(await loadUpdateFile(path.join(updatesPath, file.filename), ext));
		if (!rawUpdate) {
			skipCount++;
			return;
		}
		const updateMeta = rawUpdate as UpdateModule;
		let update: UpdateFn;
		if (typeof rawUpdate !== 'function' && updateMeta.create !== null && (typeof updateMeta.create === 'object' || typeof updateMeta.create === 'function')) {
			const items = updateMeta.create;
			const ops = updateMeta.options ?? {};
			const background_mode = updateMeta.__background__ ? ' (background mode) ' : '';

			const fn: UpdateFn = function (done: UpdateDone) {
				keystone.createItems(items as Record<string, unknown[]>, ops, function (err: Error | null, stats: unknown) {
					if (!err) {
						const statsMsg = stats ? (stats as { message?: string }).message : '';
						console.log('\n' + _dashes_, '\n' + keystone.get('name') + ': Successfully applied update ' + file.key + background_mode + '.', '\n' + statsMsg, '\n');
						done(null);
					} else {
						logError('\n' + _dashes_, '\n' + keystone.get('name') + ': Update ' + file.key + background_mode + ' failed with errors:', '\n' + String(err), '\n');
						process.nextTick(function () { done(err); });
					}
				});
			};
			fn.__background__ = updateMeta.__background__;
			fn.__defer__ = updateMeta.__defer__;
			fn.__commit__ = updateMeta.__commit__;
			update = fn;
		} else if (typeof rawUpdate === 'function') {
			update = rawUpdate as UpdateFn;
		} else {
			console.log('\nError in update file ./updates/' + file.filename + '\nUpdate files must export a function\n');
			process.exit();
			return;
		}
		if (update.__defer__) {
			deferCount++;
			return;
		}
		if (deferCount) {
			skipCount++;
			return;
		}
		console.log(_dashes_ + '\nApplying update ' + file.key + '...');
		if (update.__background__) {
			updateCount++;
			void runUpdate(update).then(function () {
				if (update.__commit__ !== false) {
					void new Update({ key: file.key }).save();
				}
			}, function () {});
		} else {
			await runUpdate(update);
			updateCount++;
			if (update.__commit__ !== false) {
				await new Update({ key: file.key }).save();
			}
		}
	};

	if (!fs.existsSync(updatesPath)) {
		console.log('\nKeystoneJS Update Error:\n\nAn updates folder must exist in your project root to use automatic updates.\nIf you want to use a custom path for your updates, set the `updates` option.\nIf you don\'t want to use updates, set the `auto update` option to `false`.\nSee http://v4.keystonejs.com/docs/configuration/#updates for more information.\n');
		process.exit();
	}

	const updates = fs
		.readdirSync(updatesPath)
		.map(function (i) {
			const ext = path.extname(i);
			return !supportedUpdateExtensions.has(ext) || isTestUpdateFile(i)
				? false
				: { filename: i, key: path.basename(i, ext) };
		})
		.filter(function (i): i is UpdateFile {
			return !!(i && semver.valid(i.key.split('-')[0] ?? ''));
		})
		.sort(function (a, b) {
			return semver.compare(a.key.split('-')[0] ?? '', b.key.split('-')[0] ?? '');
		});

	let updateErr: unknown = null;
	for (const file of updates) {
		try {
			await applyUpdate(file);
		} catch (e) {
			updateErr = e;
			break;
		}
	}

	if (updateCount || deferCount || skipCount) {
		let status = '';
		if (updateCount) {
			status += 'Successfully applied ' + plural(updateCount, '* update');
			if (skipCount || deferCount) { status += ', '; }
		}
		if (deferCount) {
			status += 'Deferred ' + plural(deferCount, '* update');
			if (skipCount) { status += ', '; }
		}
		if (skipCount) {
			status += 'Skipped ' + plural(skipCount, '* update');
		}
		status += '.';
		console.log(_dashes_ + '\n' + status + '\n' + _dashes_);
	}
	if (updateErr) {
		let errmsg = 'An error occurred applying updates, bailing on Keystone init.\n\nError details:';
		if (!(updateCount || deferCount || skipCount)) {
			errmsg = _dashes_ + '\n' + errmsg;
		}
		logError(errmsg);
		logError(updateErr);
		process.nextTick(function () { process.exit(1); });
		return;
	}
	callback();
};

export default { apply };
