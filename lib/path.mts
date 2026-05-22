import isObject from './utils/isObject.mjs';

interface PathInstance {
	parts: string[];
	addTo(obj: Record<string, unknown>, val: unknown): Record<string, unknown>;
	get(obj: Record<string, unknown>, subpath?: string): unknown;
}

export interface PathConstructor {
	new(str: string): PathInstance;
	(str: string): PathInstance;
}

const Path = function Path(this: PathInstance, str: string): PathInstance {

	if (!(this instanceof Path)) {
		return new (Path as PathConstructor)(str);
	}

	const parts: string[] = str.split('.');
	// `str.split('.')` always yields at least one element, so `last` is safe.
	const last = parts[parts.length - 1] ?? '';

	this.parts = parts;

	this.addTo = function (obj: Record<string, unknown>, val: unknown): Record<string, unknown> {
		let o = obj;
		for (const part of parts.slice(0, -1)) {
			if (!isObject(o[part])) {
				o[part] = {};
			}
			o = o[part] as Record<string, unknown>;
		}
		o[last] = val;
		return obj;
	};

	this.get = function (obj: Record<string, unknown>, subpath?: string): unknown {
		if (typeof obj !== 'object') throw new TypeError('Path.get: obj argument must be an Object');
		let i: number;
		if (subpath) {
			const nested = subpath.startsWith('.');
			const flatPath = str + subpath;
			if (flatPath in obj) {
				return obj[flatPath];
			}
			for (i = 0; i < parts.length - (nested ? 0 : 1); i++) {
				if (typeof obj !== 'object') return undefined;
				const part = parts[i];
				if (part === undefined) continue; // unreachable: i < parts.length
				obj = obj[part] as Record<string, unknown>;
			}
			subpath = nested ? subpath.slice(1) : last + subpath;
			return (typeof obj === 'object') ? obj[subpath] : undefined;
		} else if (str in obj) {
			return obj[str];
		} else {
			for (const part of parts) {
				if (typeof obj !== 'object') return undefined;
				obj = obj[part] as Record<string, unknown>;
			}
			return obj;
		}
	};

	return this;
} as unknown as PathConstructor;

export default Path;
