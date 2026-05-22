import type { KeystoneList, KeystoneListMappings } from '../list.mjs';

export default function automap(this: KeystoneList, field: { path: string }): KeystoneList {
	const mappings = this.mappings as KeystoneListMappings & Record<string, string | null>;
	if ((field.path in mappings) && !mappings[field.path]) {
		this.map(field.path, field.path);
	}
	return this;
}
