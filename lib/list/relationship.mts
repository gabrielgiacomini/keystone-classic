import { downcase, keyToLabel, keyToProperty } from '../utils/string.mjs';
import type { KeystoneList } from '../list.mjs';

type RelationshipDef = {
	ref: string;
	refPath?: string;
	path?: string;
	label?: string;
	refList?: unknown;
	isValid?: boolean;
	[key: string]: unknown;
};

export default function relationship(this: KeystoneList, def?: string | RelationshipDef): KeystoneList {
	const keystone = this.keystone;
	if (arguments.length > 1) {
		for (const arg of Array.from(arguments)) {
			// Recursive call: arg may be a string or RelationshipDef at runtime
			(this.relationship as (def: string | RelationshipDef) => KeystoneList)(arg as string | RelationshipDef);
		}
		return this;
	}
	if (typeof def === 'string') {
		def = { ref: def };
	}
	if (!def || !def.ref) {
		throw new Error('List Relationships must be specified with an object containing ref (' + this.key + ')');
	}
	if (!def.refPath) {
		def.refPath = downcase(this.key);
	}
	if (!def.path) {
		def.path = keyToProperty(def.ref, true);
	}
	if (!def.label) {
		def.label = keyToLabel(def.path as string);
	}
	const resolvedDef = def as RelationshipDef & { path: string; ref: string };
	const keystoneLists = (keystone as unknown as { lists: Record<string, unknown> }).lists;
	Object.defineProperty(resolvedDef, 'refList', {
		get: function () { return keystoneLists[resolvedDef.ref]; },
	});
	Object.defineProperty(resolvedDef, 'isValid', {
		get: function () { return keystoneLists[resolvedDef.ref] ? true : false; },
	});
	this.relationships[resolvedDef.path] = resolvedDef;
	return this;
}
