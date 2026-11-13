import type { KeystoneList } from '../list.mjs';
import { getSecretFieldPaths, isSecretFieldObject, isSensitivePath } from '../security/secretFieldRedaction.mjs';

type SearchField = { path: string | null; field?: { paths?: Record<string, string>; path?: string } };

/**
 * Builds the `$text` index definition for the list's search fields.
 *
 * Secret fields (Password-type or `secret: true`) are never indexed.
 *
 * @returns The index definition, or `false` when no search field can be indexed.
 */
export default function buildSearchTextIndex(this: KeystoneList): Record<string, string> | false {
	const searchFields = (this as KeystoneList & { searchFields?: SearchField[] }).searchFields ?? [];
	const idxDef: Record<string, string> = {};
	for (const sf of searchFields) {
		if (!sf.path || !sf.field) continue;
		if (isSecretFieldObject(sf.field)) continue;
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

function declaredTextIndexPaths(list: KeystoneList): string[] {
	const schema = list.schema as { indexes?: () => Array<[Record<string, unknown>, unknown]> } | undefined;
	if (typeof schema?.indexes !== 'function') return [];
	const paths: string[] = [];
	for (const index of schema.indexes()) {
		for (const [path, kind] of Object.entries(index[0])) {
			if (typeof kind === 'string' && kind.toLowerCase() === 'text') paths.push(path);
		}
	}
	return paths;
}

/**
 * Whether a `?search=` on the list may be answered with a `$text` query.
 *
 * `$text` matches against every path of the collection's text index, so it is
 * only used when that index holds no secret field: either the index Keystone
 * generates from the non-secret search fields (see {@link buildSearchTextIndex}),
 * or a text index declared on the schema that covers no secret path. When the
 * only search fields are secret there is no index to query (and a stale one
 * from before the field was marked secret must not be queried), so callers
 * fall back to the regular-expression search, which skips secret fields.
 * The same fallback applies when `ensureTextIndex` found a text index in the
 * database that Keystone did not create and that covers a secret path
 * (`_unmanagedTextIndexCoversSecret`): MongoDB would answer `$text` from it.
 *
 * @param list - The list being searched.
 * @returns `true` when `searchUsesTextIndex` is on and `$text` cannot reach a secret field.
 */
export function canSearchWithTextIndex(list: KeystoneList): boolean {
	if (!list.options.searchUsesTextIndex) return false;
	if (list._unmanagedTextIndexCoversSecret) return false;
	const declared = declaredTextIndexPaths(list);
	if (declared.length) {
		const hasSecrets = getSecretFieldPaths(list).length > 0;
		// A wildcard text index (`$**`) covers every string path, secret ones included.
		return !declared.some((path) => path.includes('$**') ? hasSecrets : isSensitivePath(list, path));
	}
	return buildSearchTextIndex.call(list) !== false;
}
