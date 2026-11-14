/** The part of a Mongoose model `canCastId` reads. Stubs without a schema are accepted. */
type IdCastTarget = {
	schema?: {
		path?(name: string): unknown;
	};
};

/**
 * Tells whether `id` can be cast to the `_id` type of a model (ObjectId,
 * String, Number, ...). A lookup by an id that cannot be cast can never match
 * a document, so callers answer "not found" instead of running a query that
 * would reject with a Mongoose `CastError` (and surface as a 500).
 *
 * A plain object or an array is never an id: it is reported as not castable
 * before the schema type is asked, since the schema type casts some of them.
 *
 * For every other value the check is the schema type's own `cast`, so it
 * agrees with what `Model.findById(id)` would do: a 12-character string is a
 * valid ObjectId, `'42'` is a valid Number, and so on. Class instances such as
 * an `ObjectId` are left to that cast.
 *
 * `null` and `undefined` are reported as castable: they are "no id", which the
 * query itself answers with no document. So is any other id when the model exposes
 * no `_id` schema type to ask.
 *
 * @param model - The Mongoose model whose `_id` type decides (`list.model`).
 * @param id - The candidate id, typically from a URL, a request body or a session.
 * @returns `false` only when casting `id` to the `_id` type fails.
 */
export default function canCastId(model: unknown, id: unknown): boolean {
	if (id === null || id === undefined) return true;
	if (typeof id === 'object' && isPlainObjectOrArray(id)) return false;
	const schema = (model as IdCastTarget | null | undefined)?.schema;
	const idType = typeof schema?.path === 'function'
		? schema.path('_id') as { cast?(value: unknown): unknown } | undefined
		: undefined;
	if (typeof idType?.cast !== 'function') return true;
	try {
		idType.cast(id);
		return true;
	} catch (err: unknown) {
		if ((err as { name?: unknown } | null)?.name === 'CastError') return false;
		throw err;
	}
}

/**
 * Tells arrays and plain objects (built by a literal or by a JSON or
 * query-string parser) apart from class instances.
 *
 * @param value - The object to classify.
 * @returns `true` for an array or an object whose prototype is `Object.prototype` or `null`.
 */
function isPlainObjectOrArray(value: object): boolean {
	if (Array.isArray(value)) return true;
	const proto: unknown = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
