import type { KeystoneList, UnderscoreMethodNode } from '../list.mjs';

export default function underscoreMethod(
	this: KeystoneList,
	path: string,
	fn: (...args: unknown[]) => unknown,
): KeystoneList {
	let target: UnderscoreMethodNode = this.underscoreMethods;
	const parts = path.split('.');
	const last = parts.pop() ?? '';
	parts.forEach(function (part: string) {
		const existing = target[part];
		if (!existing || typeof existing === 'function') {
			target[part] = {};
		}
		target = target[part] as UnderscoreMethodNode;
	});
	target[last] = fn;
	return this;
}
