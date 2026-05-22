import type { KeystoneList, KeystoneListMappings } from '../list.mjs';

export default function map(this: KeystoneList, field: string, path?: string): string {
	const mappings = this.mappings as KeystoneListMappings & Record<string, string | null>;
	if (path) {
		mappings[field] = path;
	}
	return mappings[field] as string;
}
