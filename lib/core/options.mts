import type { KeystoneOptions } from './options-types.js';
import path from 'node:path';
import url from 'node:url';
import cloudinary from '../cloudinaryClient.mjs';

function getCallerData (): { filePath: string } {
	const lines = (new Error().stack ?? '').split('\n');
	const self = import.meta.url.replace('file://', '');
	for (let i = 2; i < lines.length; i++) {
		const line = lines[i];
		if (line === undefined) continue;
		const m = /at .+\((.+):\d+:\d+\)/.exec(line) ?? /at (.+):\d+:\d+/.exec(line);
		const file = m?.[1];
		if (file && !file.includes('node:') && !file.includes(self)) {
			return { filePath: file };
		}
	}
	return { filePath: '' };
}

function isAbsolutePath(value: string): boolean {
	return path.resolve(value) === path.normalize(value).replace(new RegExp(path.sep + '$'), '');
}

/** Shape of `this` inside the `set`/`get` implementation (the Keystone singleton). */
interface KeystoneThis {
	_options: Partial<KeystoneOptions>;
	get: (key: string, value?: unknown) => unknown;
	set: (key: string, value?: unknown) => unknown;
	expandPath: (pathValue: string) => string;
	nav?: unknown;
	app?: unknown;
	mongoose?: unknown;
	initNav?: (v: unknown) => unknown;
}

// Typed public overloads — get mode (1 arg)
export function set<K extends keyof KeystoneOptions>(this: KeystoneThis, key: K): KeystoneOptions[K] | undefined;
// Typed public overload — set mode (2 args)
export function set<K extends keyof KeystoneOptions>(this: KeystoneThis, key: K, value: KeystoneOptions[K]): KeystoneThis;
// Implementation signature — wider key/value types to accommodate internal branches
export function set(this: KeystoneThis, key: string, value?: unknown): unknown {

	if (arguments.length === 1) {
		return (this._options as Record<string, unknown>)[key];
	}

	switch (key) {
		case 'email rules':
			throw new Error('The option "' + key + '" is no longer supported. See https://github.com/keystonejs/keystone/wiki/0.3.x-to-0.4.x-Changes');

		case 'cloudinary config': {
			if (typeof value === 'string') {
				const parts = url.parse(value, true);
				const auth = parts.auth ? parts.auth.split(':') : [];
				value = {
					cloud_name: parts.host,
					api_key: auth[0],
					api_secret: auth[1],
					private_cdn: parts.pathname != null,
					secure_distribution: parts.pathname?.substring(1),
				};
			}
			(cloudinary).config(value);
			value = (cloudinary).config();
			break;
		}

		case 'auth':
			if (value === true && !this.get('session')) {
				this.set('session', true);
			}
			break;

		case 'nav':
			if (this.initNav) {
				this.nav = this.initNav(value);
			}
			break;

		case 'mongo':
			if (typeof value !== 'string') {
				if (Array.isArray(value) && (value.length === 2 || value.length === 3)) {
					console.log('\nWarning: using an array for the `mongo` option has been deprecated.\nPlease use a mongodb connection string, e.g. mongodb://localhost/db_name instead.\n\n'
					+ 'Support for arrays as the `mongo` setting will be removed in a future version.');
					value = (value.length === 2) ? 'mongodb://' + value[0] + '/' + value[1] : 'mongodb://' + value[0] + ':' + value[2] + '/' + value[1];
				} else {
					console.error('\nInvalid Configuration:\nThe `mongo` option must be a mongodb connection string, e.g. mongodb://localhost/db_name\n');
					process.exit(1);
				}
			}
			break;

		case 'module root':
			if (!isAbsolutePath(value as string)) {
				const caller = getCallerData();
				let callerPath: string = caller.filePath;
				if (callerPath.startsWith('file://')) {
					callerPath = url.fileURLToPath(callerPath);
				}
				value = path.resolve(path.dirname(callerPath), String(value));
			}
			break;

		case 'app':
			this.app = value;
			break;

		case 'mongoose':
			this.mongoose = value;
			break;

		case 'frame guard': {
			const validFrameGuardOptions = ['deny', 'sameorigin'];
			if (value === true) {
				value = 'deny';
			}
			if (typeof value === 'string') {
				value = (value).toLowerCase();
				if (!validFrameGuardOptions.includes(value as string)) {
					value = false;
				}
			} else if (typeof value !== 'boolean') {
				value = false;
			}
			break;
		}

		case 'cors allow origin':
			if (value === true) {
				throw new Error('The option "cors allow origin" must be an explicit origin string or string array; boolean true is not supported.');
			}
			break;
		}

	(this._options as Record<string, unknown>)[key] = value;
	return this;
}

export function options(this: KeystoneThis, opts?: Partial<KeystoneOptions>): KeystoneOptions | KeystoneThis {
	if (!arguments.length) {
		return this._options as KeystoneOptions;
	}
	if (typeof opts === 'object') {
		const keys = Object.keys(opts) as (keyof KeystoneOptions)[];
		let i = keys.length;
		while (i--) {
			const k = keys[i];
			if (k === undefined) continue;
			this.set(k, opts[k]);
		}
	}
	return this;
}

export const get = set;

export function getPath(this: KeystoneThis, key: string, defaultValue?: string): string {
	const val = this.get(key);
	return this.expandPath((typeof val === 'string' ? val : undefined) ?? defaultValue ?? '');
}

export function expandPath(this: KeystoneThis, pathValue: string): string {
	const moduleRoot = this.get('module root');
	pathValue = (typeof pathValue === 'string' && pathValue.slice(0, 1) !== path.sep && pathValue.slice(1, 3) !== ':\\')
		? path.join(typeof moduleRoot === 'string' ? moduleRoot : '', pathValue)
		: pathValue;
	return pathValue;
}

export default { set, options, get, getPath, expandPath };
