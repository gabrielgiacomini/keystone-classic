/**
 * Helpers that keep Password-type field values (stored hashes) out of
 * anything Keystone serializes to a client.
 *
 * Detection is by the field's `type` (`'password'`), never by its name, so a
 * Password field registered under any path is covered.
 */

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
 * Whether reading an arbitrary dotted path from an item of `list` could return
 * a Password-type field value or a raw related document.
 *
 * Used to vet caller-supplied paths that are not registered fields before they
 * are resolved with `item.get(path)`: such a path can address a Password field
 * through a sub-path (`password.x`), or reach into a populated relationship
 * (`author.password`, `editors.0`, `editors.password`).
 *
 * @param list - The list the path is resolved against.
 * @param path - Caller-supplied dotted path.
 * @returns `true` when the path must not be resolved for a client.
 */
export function isSensitivePath(list: PasswordAwareList | null | undefined, path: string): boolean {
	const segments = path.split('.');
	for (let i = 1; i <= segments.length; i++) {
		const field = fieldAt(list, segments.slice(0, i).join('.'));
		if (!field) continue;
		if (fieldTypeIs(field, 'password')) return true;
		if (fieldTypeIs(field, 'relationship')) {
			// Skip array indexes (`editors.0.password`) to reach the related document's path.
			const rest = segments.slice(i).filter((segment) => !/^\d+$/.test(segment));
			// Nothing left means the path addresses whole related documents.
			if (!rest.length) return true;
			// Without a known related list we cannot vet the remainder, so refuse it.
			if (!field.refList) return true;
			return isSensitivePath(field.refList, rest.join('.'));
		}
	}
	return false;
}

function deletePath(target: Record<string, unknown>, path: string): void {
	const segments = path.split('.');
	let current: unknown = target;
	for (let i = 0; i < segments.length - 1; i++) {
		if (current === null || typeof current !== 'object') return;
		current = (current as Record<string, unknown>)[segments[i] ?? ''];
	}
	if (current !== null && typeof current === 'object') {
		Reflect.deleteProperty(current, segments[segments.length - 1] ?? '');
	}
}

/**
 * Converts a document of `list` into a plain object with every Password-type
 * field removed. Use it wherever a whole document (rather than `list.getData`)
 * is about to be serialized, e.g. populated relationship values.
 *
 * @param list - The list the document belongs to.
 * @param doc - A hydrated Mongoose document or a plain object.
 * @returns A plain copy without Password-type fields.
 */
export function withoutPasswordFields(list: PasswordAwareList | null | undefined, doc: unknown): Record<string, unknown> {
	const plain = isHydratedDocument(doc)
		? doc.toObject() as Record<string, unknown>
		: structuredCloneSafe(doc);
	for (const path of getPasswordFieldPaths(list)) {
		deletePath(plain, path);
	}
	return plain;
}

function structuredCloneSafe(value: unknown): Record<string, unknown> {
	if (value === null || typeof value !== 'object') return {};
	return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function getPath(target: Record<string, unknown>, path: string): unknown {
	let current: unknown = target;
	for (const segment of path.split('.')) {
		if (current === null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[segment];
	}
	return current;
}

function redactInPlace(list: PasswordAwareList | null | undefined, value: unknown): void {
	if (Array.isArray(value)) {
		for (const entry of value) redactInPlace(list, entry);
		return;
	}
	if (value === null || typeof value !== 'object') return;
	const target = value as Record<string, unknown>;
	for (const path of getPasswordFieldPaths(list)) {
		deletePath(target, path);
	}
	// Populated relationships carry whole related documents: redact those against their own list.
	for (const path of Object.keys(list?.fields ?? {})) {
		const field = fieldAt(list, path);
		if (!fieldTypeIs(field, 'relationship')) continue;
		const related = getPath(target, path);
		if (related !== null && typeof related === 'object') redactInPlace(field?.refList, related);
	}
}

/**
 * Returns the JSON form of `value` (what `res.json` would send) with every
 * Password-type field of `list` removed, following populated relationships
 * into their related lists. Accepts a document, a plain object or an array of
 * either; anything else is returned as it would serialize.
 *
 * Unlike {@link withoutPasswordFields} this serializes through `toJSON`, so
 * the response keeps the exact shape the document would otherwise have had.
 *
 * @param list - The list the value belongs to.
 * @param value - A hydrated document, plain object, array, or primitive.
 * @returns A JSON-safe copy without Password-type fields.
 */
export function toJSONWithoutPasswordFields(list: PasswordAwareList | null | undefined, value: unknown): unknown {
	// JUSTIFIED: JSON.stringify returns undefined for undefined, functions and symbols; its declared type omits that.
	const json = JSON.stringify(value) as string | undefined;
	if (json === undefined) return value;
	const plain = JSON.parse(json) as unknown;
	redactInPlace(list, plain);
	return plain;
}
