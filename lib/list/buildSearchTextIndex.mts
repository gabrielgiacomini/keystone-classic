import type { KeystoneList } from '../list.mjs';

type SearchField = { path: string | null; field?: { paths?: Record<string, string>; path?: string } };

export default function buildSearchTextIndex(this: KeystoneList): Record<string, string> | false {
	const searchFields = (this as KeystoneList & { searchFields: SearchField[] }).searchFields;
	const idxDef: Record<string, string> = {};
	for (const sf of searchFields) {
		if (!sf.path || !sf.field) continue;
		if (sf.field.paths) {
			const nFields = sf.field.paths;
			const nKeys = Object.keys(nFields);
			for (const nKey of nKeys) {
				const fieldPath = nFields[nKey];
				if (fieldPath) idxDef[fieldPath] = 'text';
			}
		} else if (sf.field.path) {
			idxDef[sf.field.path] = 'text';
		}
	}
	return Object.keys(idxDef).length > 0 ? idxDef : false;
}
