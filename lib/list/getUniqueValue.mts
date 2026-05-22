import type { KeystoneList } from '../list.mjs';

type UniqueValueCallback = (err: unknown, val?: unknown) => void;

export default function getUniqueValue(
	this: KeystoneList,
	path: string,
	generator: (() => unknown) | unknown[],
	limit: number | UniqueValueCallback,
	callback?: UniqueValueCallback,
): void {
	const model = this.model;
	let count = 0;
	let value: unknown;
	if (typeof limit === 'function') {
		callback = limit;
		limit = 10;
	}
	if (Array.isArray(generator)) {
		const fn = generator[0] as ((...a: unknown[]) => unknown);
		const args = generator.slice(1);
		generator = function () { return fn.apply(null, args); };
	}
	const cb = callback as UniqueValueCallback;
	const gen = generator as () => unknown;
	const lim = limit as number;
	const check = function () {
		if (count++ > lim) { return cb(undefined, undefined); }
		value = gen();
		(model.countDocuments() as unknown as { where(p: string, v: unknown): { exec(): Promise<number> } })
			.where(path, value).exec().then(function (matches: number) {
				if (matches) return check();
				cb(undefined, value);
			}, function (err: unknown) { cb(err); });
	};
	check();
}
