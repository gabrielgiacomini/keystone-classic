/**
 * Helpers that keep secret field values out of anything Keystone serializes
 * to a client.
 *
 * A field is secret when it is a Password-type field (its stored hash) or when
 * it was declared with the `secret: true` field option (reset keys, API tokens
 * and the like, on any field type). Detection is by the field's `type` or its
 * explicit option, never by its name.
 */

/** The parts of a Keystone list these helpers read; duck-typed so stubs work in tests. */
export interface SecretAwareList {
	fields?: Record<string, unknown>;
	/** Path the list's display name is read from, when the list has one. */
	namePath?: string;
	/** The field behind {@link SecretAwareList.namePath}, when it is a registered field. */
	nameField?: unknown;
}

interface FieldLike {
	type?: unknown;
	secret?: unknown;
	options?: { secret?: unknown } | null;
	/** Extra document paths the field type registers (`<path>Label`, `<path>_hash`, ...). */
	paths?: unknown;
	refList?: SecretAwareList;
}

function fieldAt(list: SecretAwareList | null | undefined, path: string): FieldLike | undefined {
	const fields = list?.fields;
	if (!fields || !Object.prototype.hasOwnProperty.call(fields, path)) return undefined;
	const field = fields[path];
	return field && typeof field === 'object' ? field as FieldLike : undefined;
}

function fieldTypeIs(field: FieldLike | undefined, type: string): boolean {
	return typeof field?.type === 'string' && field.type.toLowerCase() === type;
}

/**
 * Whether a field object was declared with the `secret` field option.
 *
 * Reads both the field's `options.secret` and its `secret` property, so it
 * works for real field instances, legacy third-party field types and stubs.
 * Any truthy value counts, so a JavaScript `secret: 1` fails closed.
 *
 * @param field - A field instance (or anything else, which is never secret).
 * @returns `true` when the field opted in with `secret`.
 */
export function hasSecretOption(field: unknown): boolean {
	if (field === null || typeof field !== 'object') return false;
	const candidate = field as FieldLike;
	return Boolean(candidate.secret) || Boolean(candidate.options?.secret);
}

function isSecret(field: FieldLike | undefined): boolean {
	return fieldTypeIs(field, 'password') || hasSecretOption(field);
}

/**
 * Whether a field object holds a secret: a Password-type field or a field
 * declared with `secret: true`.
 *
 * @param field - A field instance (or anything else, which is never secret).
 * @returns `true` when the field's stored value must never reach a client.
 */
export function isSecretFieldObject(field: unknown): boolean {
	if (field === null || typeof field !== 'object') return false;
	return isSecret(field as FieldLike);
}

/**
 * Whether `path` on the list is a Password-type field.
 *
 * @param list - The list to inspect, if known.
 * @param path - Field path to inspect.
 * @returns `true` when the path is a Password-type field.
 */
export function isPasswordField(list: SecretAwareList | null | undefined, path: string): boolean {
	return fieldTypeIs(fieldAt(list, path), 'password');
}

/**
 * Paths of every Password-type field on the list.
 *
 * @param list - The list to inspect, if known.
 * @returns The Password-type field paths (empty when there are none).
 */
export function getPasswordFieldPaths(list: SecretAwareList | null | undefined): string[] {
	return Object.keys(list?.fields ?? {}).filter((path) => isPasswordField(list, path));
}

/**
 * Whether `path` on the list is a field declared with `secret: true`.
 *
 * Such a field is left out of admin API and export output altogether, whereas
 * a Password-type field still reports whether a value is set.
 *
 * @param list - The list to inspect, if known.
 * @param path - Field path to inspect.
 * @returns `true` when the field opted in with `secret`.
 */
export function isSecretOptionField(list: SecretAwareList | null | undefined, path: string): boolean {
	return hasSecretOption(fieldAt(list, path));
}

/**
 * Whether `path` on the list holds a secret: a Password-type field or a field
 * declared with `secret: true`.
 *
 * @param list - The list to inspect, if known.
 * @param path - Field path to inspect.
 * @returns `true` when the stored value must never be serialized to a client.
 */
export function isSecretField(list: SecretAwareList | null | undefined, path: string): boolean {
	return isSecret(fieldAt(list, path));
}

/**
 * Paths of every secret field on the list (Password-type or `secret: true`).
 *
 * @param list - The list to inspect, if known.
 * @returns The secret field paths (empty when there are none).
 */
export function getSecretFieldPaths(list: SecretAwareList | null | undefined): string[] {
	return Object.keys(list?.fields ?? {}).filter((path) => isSecretField(list, path));
}

/**
 * Document paths that are derived from a secret field rather than being the
 * field itself: the extra paths a field type registers in `field.paths`, such
 * as Select's `<path>Label` / `<path>Data` virtuals (which reveal the stored
 * choice) or Password's `<path>_hash`.
 *
 * @param list - The list to inspect, if known.
 * @returns The derived paths of every secret field (empty when there are none).
 */
export function getSecretDerivedPaths(list: SecretAwareList | null | undefined): string[] {
	const derived: string[] = [];
	for (const path of getSecretFieldPaths(list)) {
		const paths = fieldAt(list, path)?.paths;
		if (paths === null || typeof paths !== 'object') continue;
		for (const value of Object.values(paths)) {
			if (typeof value === 'string' && value && value !== path && !derived.includes(value)) derived.push(value);
		}
	}
	return derived;
}

function isAtOrUnder(path: string, base: string): boolean {
	return path === base || path.startsWith(base + '.');
}

/**
 * Whether the list's display name (`list.getDocumentName`) is read from a
 * secret field, or from a path derived from one. Such a name must not be
 * serialized to a client.
 *
 * @param list - The list to inspect, if known.
 * @returns `true` when the document name would reveal a secret value.
 */
export function hasSecretNameField(list: SecretAwareList | null | undefined): boolean {
	if (!list) return false;
	if (isSecretFieldObject(list.nameField)) return true;
	const namePath = list.namePath;
	if (typeof namePath !== 'string' || !namePath) return false;
	return [...getSecretFieldPaths(list), ...getSecretDerivedPaths(list)].some((secretPath) => isAtOrUnder(namePath, secretPath));
}

/**
 * The display name of a document of `list` for client-facing output, or
 * `undefined` when the list's name is read from a secret field.
 *
 * @param list - The list the document belongs to.
 * @param doc - The document to name.
 * @returns The name, or `undefined` when it must not be serialized.
 */
export function getClientSafeDocumentName<Doc>(
	list: (SecretAwareList & { getDocumentName(doc: Doc): string }) | null | undefined,
	doc: Doc
): string | undefined {
	if (!list || hasSecretNameField(list)) return undefined;
	return list.getDocumentName(doc);
}

/** The parts of a MongoDB duplicate-key (E11000) error these helpers read. */
interface DuplicateKeyErrorLike {
	code?: unknown;
	keyPattern?: unknown;
	keyValue?: unknown;
}

/**
 * Builds the client-safe detail for a MongoDB duplicate-key (E11000) error
 * that involves a secret field. The driver's own message (`errmsg`, `message`,
 * `keyValue`) echoes the conflicting value, which for a unique secret field is
 * the stored secret of another document.
 *
 * @param list - The list the document being saved belongs to.
 * @param err - The error thrown by the save.
 * @returns A message naming the path(s) but never the value, or `undefined`
 *   when the error is not a duplicate-key error or involves no secret field.
 */
export function getRedactedDuplicateKeyDetail(list: SecretAwareList | null | undefined, err: unknown): string | undefined {
	if (err === null || typeof err !== 'object') return undefined;
	const candidate = err as DuplicateKeyErrorLike;
	if (candidate.code !== 11000) return undefined;
	const secretPaths = [...getSecretFieldPaths(list), ...getSecretDerivedPaths(list)];
	if (!secretPaths.length) return undefined;
	const keySource = [candidate.keyPattern, candidate.keyValue].find((value) => value !== null && typeof value === 'object');
	const keys = keySource ? Object.keys(keySource) : [];
	// Without key information the index cannot be attributed, so fail closed.
	if (!keys.length) return 'Duplicate value already exists';
	const involvesSecret = keys.some((key) => secretPaths.some((secretPath) => isAtOrUnder(key, secretPath) || isAtOrUnder(secretPath, key)));
	return involvesSecret ? 'Duplicate ' + keys.join(', ') + ' value already exists' : undefined;
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
 * a secret field value or a raw related document.
 *
 * Used to vet caller-supplied paths that are not registered fields before they
 * are resolved with `item.get(path)`: such a path can address a secret field
 * through a sub-path (`password.x`), through a parent path (`profile` when
 * `profile.pin` is secret, which would return the whole nested object), or
 * reach into a populated relationship (`author.password`, `editors.0`,
 * `editors.password`, or `meta` when `meta.author` is a relationship).
 *
 * @param list - The list the path is resolved against.
 * @param path - Caller-supplied dotted path.
 * @returns `true` when the path must not be resolved for a client.
 */
export function isSensitivePath(list: SecretAwareList | null | undefined, path: string): boolean {
	const segments = path.split('.');
	for (let i = 1; i <= segments.length; i++) {
		const field = fieldAt(list, segments.slice(0, i).join('.'));
		if (!field) continue;
		if (isSecret(field)) return true;
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
	// Paths derived from a secret field (Select's `<path>Label`, ...) reveal its value too.
	if (getSecretDerivedPaths(list).some((derived) => isAtOrUnder(path, derived) || isAtOrUnder(derived, path))) return true;
	// A parent of a nested secret or relationship field returns the whole nested object.
	const prefix = path + '.';
	return Object.keys(list?.fields ?? {}).some((fieldPath) => {
		if (!fieldPath.startsWith(prefix)) return false;
		const nested = fieldAt(list, fieldPath);
		return isSecret(nested) || fieldTypeIs(nested, 'relationship');
	});
}

/**
 * Whether the value read from `path` on an item of `list` is, contains or is
 * derived from a secret field value (Password-type or `secret: true`).
 *
 * Unlike {@link isSensitivePath}, a path that only names a relationship
 * (`author`) is not refused: its value is the related id. A path that goes on
 * into the related document (`author.recovery`) is vetted against the related
 * list, and refused when that list is not known.
 *
 * Used to vet paths that Keystone copies into another stored value, such as
 * the `from` paths of the `autokey` list option.
 *
 * @param list - The list the path is resolved against.
 * @param path - Dotted document path.
 * @returns `true` when the value must not be copied anywhere a client can read.
 */
export function isSecretValuePath(list: SecretAwareList | null | undefined, path: string): boolean {
	const segments = path.split('.');
	for (let i = 1; i <= segments.length; i++) {
		const field = fieldAt(list, segments.slice(0, i).join('.'));
		if (!field) continue;
		if (isSecret(field)) return true;
		if (fieldTypeIs(field, 'relationship')) {
			const rest = segments.slice(i).filter((segment) => !/^\d+$/.test(segment));
			// The relationship itself holds ids only.
			if (!rest.length) return false;
			// Without a known related list the remainder cannot be vetted, so refuse it.
			if (!field.refList) return true;
			return isSecretValuePath(field.refList, rest.join('.'));
		}
	}
	if (getSecretDerivedPaths(list).some((derived) => isAtOrUnder(path, derived) || isAtOrUnder(derived, path))) return true;
	// A parent of a nested secret field holds the secret inside the nested object.
	const prefix = path + '.';
	return Object.keys(list?.fields ?? {}).some((fieldPath) => fieldPath.startsWith(prefix) && isSecret(fieldAt(list, fieldPath)));
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
 * How many levels of populated relationships below a document are redacted.
 * A related document found deeper than this is not serialized at all: it is
 * replaced by its id. A hard limit, so a document that (through its
 * relationships) contains itself cannot recurse without end.
 */
export const SECRET_REDACTION_MAX_DEPTH = 8;

/**
 * Converts a document of `list` into a plain object with every secret field
 * (Password-type or `secret: true`) removed. Use it wherever a whole document (rather than `list.getData`)
 * is about to be serialized, e.g. populated relationship values.
 *
 * Relationships that are themselves populated are followed into their related
 * lists, and those in turn, so a secret field is removed at every populated
 * level, down to {@link SECRET_REDACTION_MAX_DEPTH} levels below `doc`.
 * A related document deeper than that is replaced by its id.
 *
 * @param list - The list the document belongs to.
 * @param doc - A hydrated Mongoose document or a plain object.
 * @returns A plain copy without secret fields.
 */
export function withoutSecretFields(list: SecretAwareList | null | undefined, doc: unknown): Record<string, unknown> {
	const plain = isHydratedDocument(doc)
		? doc.toObject() as Record<string, unknown>
		: structuredCloneSafe(doc);
	redactInPlace(list, plain, 0);
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

/**
 * Whether a value is a plain object: what `toObject()` and `JSON.parse`
 * build, unlike an ObjectId, a Date or a Buffer.
 * @param value - Value to inspect.
 * @returns `true` for a plain object (not an array).
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value) as unknown;
	return proto === Object.prototype || proto === null;
}

/**
 * What stands in for a related document that lies past the depth limit.
 * @param value - A related document, an id, or an array of either.
 * @returns The document's id (`null` when it has none); an id as it is.
 */
function idOnly(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(idOnly);
	if (!isPlainObject(value)) return value;
	return value['_id'] ?? value['id'] ?? null;
}

function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
	const segments = path.split('.');
	let current: unknown = target;
	for (let i = 0; i < segments.length - 1; i++) {
		if (current === null || typeof current !== 'object') return;
		current = (current as Record<string, unknown>)[segments[i] ?? ''];
	}
	if (current !== null && typeof current === 'object') {
		(current as Record<string, unknown>)[segments[segments.length - 1] ?? ''] = value;
	}
}

/**
 * Removes the secret paths of `list` from a plain value in place, then does
 * the same for every populated relationship against its related list.
 *
 * The paths to remove and the relationships to follow are worked out once per
 * call and reused for every element of an array. Nothing is kept between
 * calls, so a field added to the list later is seen by the next call.
 * @param list - The list `value` belongs to.
 * @param value - A plain object, or an array of them (anything else is left alone).
 * @param depth - How many populated levels `value` lies below the starting document.
 */
function redactInPlace(list: SecretAwareList | null | undefined, value: unknown, depth: number): void {
	const entries = Array.isArray(value) ? value : [value];
	if (!entries.some(isPlainObject)) return;
	const secretPaths = [...getSecretFieldPaths(list), ...getSecretDerivedPaths(list)];
	const relationshipPaths = Object.keys(list?.fields ?? {}).filter((path) => fieldTypeIs(fieldAt(list, path), 'relationship'));
	for (const target of entries) {
		if (Array.isArray(target)) {
			redactInPlace(list, target, depth);
			continue;
		}
		if (!isPlainObject(target)) continue;
		for (const path of secretPaths) deletePath(target, path);
		// Populated relationships carry whole related documents: redact those against their own list.
		for (const path of relationshipPaths) {
			const related = getPath(target, path);
			if (!Array.isArray(related) && !isPlainObject(related)) continue;
			if (depth >= SECRET_REDACTION_MAX_DEPTH) {
				// Too deep to vouch for: keep the id(s), drop the document(s).
				setPath(target, path, idOnly(related));
			} else {
				redactInPlace(fieldAt(list, path)?.refList, related, depth + 1);
			}
		}
	}
}

/**
 * Returns the JSON form of `value` (what `res.json` would send) with every
 * secret field of `list` (Password-type or `secret: true`) removed, following populated relationships
 * into their related lists at every populated level, down to
 * {@link SECRET_REDACTION_MAX_DEPTH} levels below `value` (a related document
 * deeper than that is replaced by its id). Accepts a document, a plain object or an array of
 * either; anything else is returned as it would serialize.
 *
 * Unlike {@link withoutSecretFields} this serializes through `toJSON`, so
 * the response keeps the exact shape the document would otherwise have had.
 *
 * @param list - The list the value belongs to.
 * @param value - A hydrated document, plain object, array, or primitive.
 * @returns A JSON-safe copy without secret fields.
 */
export function toJSONWithoutSecretFields(list: SecretAwareList | null | undefined, value: unknown): unknown {
	// JUSTIFIED: JSON.stringify returns undefined for undefined, functions and symbols; its declared type omits that.
	const json = JSON.stringify(value) as string | undefined;
	if (json === undefined) return value;
	const plain = JSON.parse(json) as unknown;
	redactInPlace(list, plain, 0);
	return plain;
}
