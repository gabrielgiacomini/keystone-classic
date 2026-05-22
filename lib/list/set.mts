import type { KeystoneList } from '../list.mjs';

export default function set(this: KeystoneList, key: string, value?: unknown): unknown {
	if (arguments.length === 1) {
		return this.options[key];
	}
	this.options[key] = value;
	return value;
}
