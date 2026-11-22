/**
 * Helpers that keep Password-type field values (stored hashes) out of
 * anything Keystone serializes to a client.
 *
 * Detection is by the field's `type` (`'password'`), never by its name, so a
 * Password field registered under any path is covered.
 */

import { types } from 'node:util';

/** The parts of a Keystone list these helpers read; duck-typed so stubs work in tests. */
export interface PasswordAwareList {
	fields?: Record<string, unknown>;
}

interface FieldLike {
	type?: unknown;
	refList?: PasswordAwareList;
}

function fieldAt(list: PasswordAwareList | null | undefined, path: string): FieldLike | undefined {
	const fields = list?.fields;
	if (!fields || !Object.prototype.hasOwnProperty.call(fields, path)) return undefined;
	const field = fields[path];
	return field && typeof field === 'object' ? field as FieldLike : undefined;
}

function fieldTypeIs(field: FieldLike | undefined, type: string): boolean {
	return typeof field?.type === 'string' && field.type.toLowerCase() === type;
}

/**
 * Whether `path` on the list is a Password-type field.
 *
 * @param list - The list to inspect, if known.
 * @param path - Field path to inspect.
 * @returns `true` when the path is a Password-type field.
 */
export function isPasswordField(list: PasswordAwareList | null | undefined, path: string): boolean {
	return fieldTypeIs(fieldAt(list, path), 'password');
}

/**
 * Paths of every Password-type field on the list.
 *
 * @param list - The list to inspect, if known.
 * @returns The Password-type field paths (empty when there are none).
 */
export function getPasswordFieldPaths(list: PasswordAwareList | null | undefined): string[] {
	return Object.keys(list?.fields ?? {}).filter((path) => isPasswordField(list, path));
}

/**
 * Whether a value is a hydrated Mongoose document (for example a populated
 * relationship) rather than an id or a plain value.
 *
 * @param value - Value to inspect.
 * @returns `true` for hydrated documents.
 */
export function isHydratedDocument(value: unknown): value is { _id?: unknown; id?: unknown; toObject(): unknown } {
	return value !== null
		&& typeof value === 'object'
		&& '$__' in value
		&& typeof (value as { toObject?: unknown }).toObject === 'function';
}

/**
 * The BSON type tag of a value (`'DBRef'`, `'Code'`, `'ObjectId'`, ...), if it has one.
 *
 * @param value - Value to inspect.
 * @returns The tag, or `undefined` for anything that is not a BSON value.
 */
function bsonTypeOf(value: unknown): string | undefined {
	if (value === null || typeof value !== 'object') return undefined;
	const tag = (value as { _bsontype?: unknown })._bsontype;
	return typeof tag === 'string' ? tag : undefined;
}

/**
 * Whether `value` is, or holds anywhere below it, a BSON value that carries
 * nested data under its own keys: a DBRef (its extra `fields`) or a Code with
 * a `scope`. Such values serialize to a shape that differs from their
 * structure, so a dotted path cannot be matched against them reliably.
 *
 * @param value - Value to inspect.
 * @returns `true` when a DBRef or a Code with a scope is reachable.
 */
function holdsNestingBsonValue(value: unknown): boolean {
	const seen = new Set<object>();
	const pending: unknown[] = [value];
	while (pending.length) {
		const current = pending.pop();
		if (current === null || typeof current !== 'object' || seen.has(current)) continue;
		seen.add(current);
		const tag = bsonTypeOf(current);
		if (tag === 'DBRef') return true;
		if (tag === 'Code') {
			if ((current as { scope?: unknown }).scope != null) return true;
			continue;
		}
		// Other BSON values (ObjectId, Binary, Decimal128, ...) and binary buffers hold no nested data.
		if (tag !== undefined || ArrayBuffer.isView(current)) continue;
		if (isHydratedDocument(current)) {
			pending.push((current as { _doc?: unknown })._doc);
			continue;
		}
		if (current instanceof Map) {
			for (const entry of current.values()) pending.push(entry);
			continue;
		}
		if (Array.isArray(current)) {
			for (const entry of current) pending.push(entry);
			continue;
		}
		for (const key of Object.keys(current)) pending.push((current as Record<string, unknown>)[key]);
	}
	return false;
}

/**
 * Whether `value` is, or holds anywhere below it, a hydrated Mongoose
 * document (for example a populated relationship nested in a plain object).
 *
 * @param value - Value to inspect.
 * @returns `true` when a hydrated document is reachable.
 */
export function holdsHydratedDocument(value: unknown): boolean {
	const seen = new Set<object>();
	const pending: unknown[] = [value];
	while (pending.length) {
		const current = pending.pop();
		if (current === null || typeof current !== 'object' || seen.has(current)) continue;
		seen.add(current);
		if (isHydratedDocument(current)) return true;
		const tag = bsonTypeOf(current);
		if (tag === 'DBRef') {
			pending.push((current as { fields?: unknown }).fields);
			continue;
		}
		if (tag === 'Code') {
			pending.push((current as { scope?: unknown }).scope);
			continue;
		}
		if (tag !== undefined || ArrayBuffer.isView(current)) continue;
		if (current instanceof Map) {
			for (const entry of current.values()) pending.push(entry);
			continue;
		}
		if (Array.isArray(current)) {
			for (const entry of current) pending.push(entry);
			continue;
		}
		for (const key of Object.keys(current)) pending.push((current as Record<string, unknown>)[key]);
	}
	return false;
}

function isIndex(segment: string): boolean {
	return /^\d+$/.test(segment);
}

function withoutIndexes(segments: readonly string[]): string[] {
	return segments.filter((segment) => !isIndex(segment));
}

/**
 * Whether reading an arbitrary dotted path from an item of `list` could return
 * a Password-type field value or a raw related document.
 *
 * Used to vet caller-supplied paths that are not registered fields before they
 * are resolved with `item.get(path)`: such a path can address a Password field
 * through a sub-path (`password.x`), contain one (`profile` when
 * `profile.pin` is a Password field), or reach into a populated relationship
 * (`author.password`, `editors.0`, `editors.password`).
 *
 * With `resolve` (reading a path from the item), a path is also refused when
 * it shares a parent with a Password field path and the value at that parent
 * holds a DBRef or a Code with a scope: those serialize under different keys
 * than their structure (a DBRef's `fields` are flattened into it), so the
 * Password value may lie beneath the path even though the path strings differ.
 *
 * Array indexes are ignored when matching (`secret.0.pin` is `secret.pin`),
 * because reading a path through an array reaches the same values for every
 * element: `item.get('secret.pin')` maps over a stored `secret: [{ pin }]`.
 *
 * @param list - The list the path is resolved against.
 * @param path - Caller-supplied dotted path.
 * @param resolve - Optional reader of a dotted path on the item.
 * @returns `true` when the path must not be resolved for a client.
 */
export function isSensitivePath(list: PasswordAwareList | null | undefined, path: string, resolve?: (path: string) => unknown): boolean {
	const segments = withoutIndexes(path.split('.'));
	const normalized = segments.join('.');
	for (let i = 1; i <= segments.length; i++) {
		const field = fieldAt(list, segments.slice(0, i).join('.'));
		if (!field) continue;
		if (fieldTypeIs(field, 'password')) return true;
		if (fieldTypeIs(field, 'relationship')) {
			const rest = segments.slice(i);
			// Nothing left means the path addresses whole related documents.
			if (!rest.length) return true;
			// Without a known related list we cannot vet the remainder, so refuse it.
			if (!field.refList) return true;
			const prefix = segments.slice(0, i).join('.');
			return isSensitivePath(field.refList, rest.join('.'), resolve && ((relatedPath) => resolve(prefix + '.' + relatedPath)));
		}
	}
	for (const passwordPath of getPasswordFieldPaths(list)) {
		const passwordSegments = withoutIndexes(passwordPath.split('.'));
		// A parent of a Password field path returns the Password value along with its siblings.
		if (passwordSegments.join('.').startsWith(normalized + '.')) return true;
		if (!resolve) continue;
		let shared = 0;
		while (shared < segments.length && shared < passwordSegments.length && segments[shared] === passwordSegments[shared]) shared++;
		if (shared > 0 && holdsNestingBsonValue(resolve(segments.slice(0, shared).join('.')))) return true;
	}
	return false;
}


/**
 * Other nodes a node of a tree answers to, so that a Password path matches
 * whichever form of a DBRef it was written against:
 * - `named`: a segment that names another node. The JSON node of a DBRef
 *   answers to `fields` with itself, because `DBRef#toJSON` flattens its
 *   extra fields into it (`{ $ref, $id, ...fields }`).
 * - `through`: a node whose keys this node also answers to. A copied DBRef
 *   answers to the keys of its `fields`, the flattened form of its path.
 */
interface Alias {
	named?: Record<string, object>;
	through?: object;
}

type Aliases = WeakMap<object, Alias>;

/**
 * Every node `segment` names under `target`: its own property and its aliases.
 * An array stands for each of its elements, as Mongoose reads a path through
 * an array (`secret.pin` over `secret: [{ pin }]`), unless the segment is an index.
 *
 * @param target - A node of a tree.
 * @param segment - One path segment.
 * @param aliases - Aliases of the tree's nodes.
 * @returns The nodes found.
 */
function step(target: unknown, segment: string, aliases: Aliases): unknown[] {
	if (target === null || typeof target !== 'object') return [];
	if (Array.isArray(target)) {
		if (isIndex(segment)) return Object.prototype.hasOwnProperty.call(target, segment) ? [target[Number(segment)]] : [];
		return target.flatMap((entry) => step(entry, segment, aliases));
	}
	const found: unknown[] = [];
	const alias = aliases.get(target);
	const named = alias?.named?.[segment];
	if (named !== undefined) found.push(named);
	for (const owner of alias?.through ? [target, alias.through] : [target]) {
		if (!Object.prototype.hasOwnProperty.call(owner, segment)) continue;
		const own = (owner as Record<string, unknown>)[segment];
		if (!found.includes(own)) found.push(own);
	}
	return found;
}

/**
 * Every value a dotted path reaches in a tree.
 *
 * @param target - The tree.
 * @param segments - The path's segments (none reaches the tree itself).
 * @param aliases - Aliases of the tree's nodes.
 * @returns The values found.
 */
function getPaths(target: unknown, segments: readonly string[], aliases: Aliases): unknown[] {
	let current: unknown[] = [target];
	for (const segment of segments) {
		current = current.flatMap((entry) => step(entry, segment, aliases));
	}
	return current;
}

function deleteKey(owner: unknown, key: string, aliases: Aliases): void {
	if (owner === null || typeof owner !== 'object') return;
	if (Array.isArray(owner) && !isIndex(key)) {
		for (const entry of owner) deleteKey(entry, key, aliases);
		return;
	}
	Reflect.deleteProperty(owner, key);
	const through = aliases.get(owner)?.through;
	if (through) Reflect.deleteProperty(through, key);
}

/**
 * Removes every value a dotted path reaches in a tree.
 *
 * @param target - The tree.
 * @param path - Dotted path.
 * @param aliases - Aliases of the tree's nodes.
 */
function deletePaths(target: unknown, path: string, aliases: Aliases): void {
	const segments = path.split('.');
	const last = segments.pop() ?? '';
	for (const owner of getPaths(target, segments, aliases)) deleteKey(owner, last, aliases);
}

/**
 * Removes the Password paths of `list` from a tree, following populated
 * relationships into their related lists. The tree must be a copy: it is edited in place.
 *
 * @param list - The list the tree belongs to.
 * @param value - The tree (a document, or an array of documents).
 * @param aliases - Aliases of the tree's nodes.
 */
function redactInPlace(list: PasswordAwareList | null | undefined, value: unknown, aliases: Aliases): void {
	if (Array.isArray(value)) {
		for (const entry of value) redactInPlace(list, entry, aliases);
		return;
	}
	if (value === null || typeof value !== 'object') return;
	for (const path of getPasswordFieldPaths(list)) {
		deletePaths(value, path, aliases);
	}
	// Populated relationships carry whole related documents: redact those against their own list.
	for (const path of Object.keys(list?.fields ?? {})) {
		const field = fieldAt(list, path);
		if (!fieldTypeIs(field, 'relationship')) continue;
		for (const related of getPaths(value, path.split('.'), aliases)) {
			if (related !== null && typeof related === 'object') redactInPlace(field?.refList, related, aliases);
		}
	}
}

/**
 * Copies every plain object, array, DBRef and Code of `value`, so that the
 * copy can be edited without touching the original. A copied DBRef or Code
 * keeps its prototype, so it serializes exactly as the original; a DBRef's
 * copy is recorded in `aliases` to answer to the keys of its `fields`. Other
 * values (ObjectId, Date, Binary, ...) hold no nested data and are shared.
 *
 * @param value - Value to copy (for example the result of `toObject()`).
 * @param aliases - Where DBRef copies are recorded.
 * @param copies - Copies made so far, so shared and cyclic references stay so.
 * @returns The copy.
 */
function copyStructure(value: unknown, aliases: Aliases, copies = new Map<object, unknown>()): unknown {
	if (value === null || typeof value !== 'object') return value;
	const known = copies.get(value);
	if (known !== undefined) return known;
	if (Array.isArray(value)) {
		const source: readonly unknown[] = value;
		const copy: unknown[] = [];
		copies.set(value, copy);
		for (let index = 0; index < source.length; index++) {
			if (Object.prototype.hasOwnProperty.call(source, index)) copy[index] = copyStructure(source[index], aliases, copies);
		}
		copy.length = source.length;
		return copy;
	}
	const tag = bsonTypeOf(value);
	const prototype = Object.getPrototypeOf(value) as object | null;
	if (tag !== 'DBRef' && tag !== 'Code' && prototype !== Object.prototype && prototype !== null) return value;
	const copy = Object.create(prototype) as Record<PropertyKey, unknown>;
	copies.set(value, copy);
	for (const property of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, property);
		if (!descriptor) continue;
		if ('value' in descriptor) {
			descriptor.value = copyStructure(descriptor.value, aliases, copies);
			descriptor.writable = true;
		}
		descriptor.configurable = true;
		Object.defineProperty(copy, property, descriptor);
	}
	const fields = tag === 'DBRef' ? copy['fields'] : undefined;
	if (fields !== null && typeof fields === 'object') aliases.set(copy, { through: fields });
	return copy;
}

/**
 * Converts a document of `list` into a plain object with every Password-type
 * field removed. Use it wherever a whole document (rather than `list.getData`)
 * is about to be serialized, e.g. populated relationship values.
 *
 * A hydrated document is converted with `toObject()` and the result is copied
 * before anything is removed, so the document itself is never changed. A
 * Password path reaches into a DBRef's extra `fields` whether it is written
 * against the stored structure (`ref.fields.pin`) or the flattened JSON form
 * (`ref.pin`), and through arrays.
 *
 * @param list - The list the document belongs to.
 * @param doc - A hydrated Mongoose document or a plain object.
 * @returns A plain copy without Password-type fields.
 */
export function withoutPasswordFields(list: PasswordAwareList | null | undefined, doc: unknown): Record<string, unknown> {
	if (isHydratedDocument(doc)) {
		const aliases: Aliases = new WeakMap();
		const plain = copyStructure(doc.toObject(), aliases) as Record<string, unknown>;
		redactInPlace(list, plain, aliases);
		return plain;
	}
	if (doc === null || typeof doc !== 'object') return {};
	return toJSONWithoutPasswordFields(list, doc) as Record<string, unknown>;
}

function isRawJSON(value: object): boolean {
	const check = (JSON as { isRawJSON?: (candidate: unknown) => boolean }).isRawJSON;
	return typeof check === 'function' && check(value);
}

/**
 * Throws the error `JSON.stringify` throws for a cyclic value, with its message.
 *
 * @param value - An object that is its own ancestor.
 */
function throwCircular(value: object): never {
	try {
		JSON.stringify(value);
	} catch (error) {
		if (error instanceof TypeError) throw error;
	}
	throw new TypeError('Converting circular structure to JSON');
}

/**
 * Builds the tree `JSON.stringify(value)` would serialize: every `toJSON` is
 * called exactly as `JSON.stringify` calls it (same receiver, same key, same
 * order), boxed primitives become their primitive, and objects and arrays are
 * copied with the same keys in the same order, leaving out what
 * `JSON.stringify` leaves out (undefined, functions and symbols in objects;
 * `null` in their place in arrays). Serializing the tree therefore gives
 * exactly `JSON.stringify(value)`, while the tree can still be edited first,
 * and no `toJSON` is left in it to be called a second time. The original
 * value is never mutated: the tree holds fresh objects and arrays only.
 *
 * The node built from a DBRef is recorded in `aliases` so that a path walk can
 * step into the DBRef's `fields` even though they were flattened.
 *
 * @param value - The value to serialize.
 * @param key - The key `JSON.stringify` passes to `toJSON` (`''` at the top).
 * @param ancestors - Objects being copied above this one, to refuse cycles as `JSON.stringify` does.
 * @param aliases - Where DBRef nodes are recorded.
 * @returns The tree, or the value itself when it is not an object.
 */
function toJSONTree(value: unknown, key: string, ancestors: Set<object>, aliases: Aliases): unknown {
	let current = value;
	let fromDBRef = false;
	if ((typeof current === 'object' && current !== null) || typeof current === 'function' || typeof current === 'bigint') {
		const toJSON = (current as { toJSON?: unknown }).toJSON;
		if (typeof toJSON === 'function') {
			fromDBRef = bsonTypeOf(current) === 'DBRef';
			current = toJSON.call(current, key) as unknown;
		}
	}
	if (current === null || typeof current !== 'object') return current;
	if (!Array.isArray(current)) {
		// Converted as `JSON.stringify` converts them.
		if (types.isNumberObject(current)) return Number(current);
		if (types.isStringObject(current)) return String(current);
		if (types.isBooleanObject(current)) return Boolean.prototype.valueOf.call(current);
		// Left to the final `JSON.stringify`: a BigInt object (it throws there as it would have) and raw JSON text.
		if (types.isBigIntObject(current) || isRawJSON(current)) return current;
	}
	if (ancestors.has(current)) throwCircular(current);
	ancestors.add(current);
	let node: Record<string, unknown> | unknown[];
	if (Array.isArray(current)) {
		const source: readonly unknown[] = current;
		node = [];
		for (let index = 0; index < source.length; index++) {
			const entry = toJSONTree(source[index], String(index), ancestors, aliases);
			node.push(entry === undefined || typeof entry === 'function' || typeof entry === 'symbol' ? null : entry);
		}
	} else {
		const source = current as Record<string, unknown>;
		const copy: Record<string, unknown> = {};
		for (const property of Object.keys(source)) {
			const entry = toJSONTree(source[property], property, ancestors, aliases);
			if (entry === undefined || typeof entry === 'function' || typeof entry === 'symbol') continue;
			if (property === '__proto__') {
				Object.defineProperty(copy, property, { value: entry, enumerable: true, writable: true, configurable: true });
			} else {
				copy[property] = entry;
			}
		}
		node = copy;
	}
	ancestors.delete(current);
	if (fromDBRef) aliases.set(node, { named: { fields: node } });
	return node;
}

/**
 * Returns the JSON form of `value` (what `res.json` would send) with every
 * Password-type field of `list` removed, following populated relationships
 * into their related lists. Accepts a document, a plain object or an array of
 * either; anything else is returned as it would serialize.
 *
 * The Password paths are removed before the value is serialized, from the
 * tree `JSON.stringify` would walk, in which BSON values have their own
 * structure: a path steps into a DBRef's extra `fields` (which its JSON form
 * flattens), through a Code's `scope` and through arrays. Everything that is
 * not removed serializes exactly as `JSON.stringify(value)` would have.
 *
 * Unlike {@link withoutPasswordFields} this serializes through `toJSON`, so
 * the response keeps the exact shape the document would otherwise have had.
 *
 * @param list - The list the value belongs to.
 * @param value - A hydrated document, plain object, array, or primitive.
 * @returns A JSON-safe copy without Password-type fields.
 */
export function toJSONWithoutPasswordFields(list: PasswordAwareList | null | undefined, value: unknown): unknown {
	const aliases: Aliases = new WeakMap();
	const tree = toJSONTree(value, '', new Set(), aliases);
	redactInPlace(list, tree, aliases);
	// JUSTIFIED: JSON.stringify returns undefined for undefined, functions and symbols; its declared type omits that.
	const json = JSON.stringify(tree) as string | undefined;
	if (json === undefined) return value;
	return JSON.parse(json) as unknown;
}
