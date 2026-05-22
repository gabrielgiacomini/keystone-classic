// Ambient stub for the untyped `keystone-utils` package.
// Typed signatures are inferred from node_modules/keystone-utils/lib/index.js
// and verified against call-site usage in the codebase.
declare module 'keystone-utils' {
	// Recursively binds method properties of `obj` to `scope` and returns a
	// new object where every leaf function is bound to `scope`.
	// The constraint is `Record<string, unknown>` on the object variant — the
	// top-level call site always passes an object tree, never a bare function.
	export function bindMethods<T extends Record<string, unknown>>(obj: T, scope: object): { [K in keyof T]: T[K] };

	// Truncates a string to `len` characters, optionally appending `suffix`.
	export function cropString(s: string, len: number, suffix?: string | boolean, preserveWords?: boolean): string;

	// Defers a function invocation via `process.nextTick`. Returns void.
	export function defer<TArgs extends unknown[]>(fn: (...args: TArgs) => void, ...args: TArgs): void;

	// Lowercases the first character of a string.
	export function downcase(s: string): string;

	// Encodes HTML entities in a string.
	export function encodeHTMLEntities(s: string): string;

	// Escapes special regex characters in a string.
	export function escapeRegExp(s: string): string;

	// Returns true if `value` is an array.
	export function isArray(value: unknown): value is unknown[];

	// Returns true if `value` looks like a valid e-mail address.
	export function isEmail(value: string): boolean;

	// Returns true if `value` is a function.
	export function isFunction(value: unknown): value is (...args: unknown[]) => unknown;

	// Returns true if `value` is a plain object (not an array, date, etc.).
	// Not a narrowing predicate: call sites access arbitrary properties on
	// `any`-typed values after the check, so narrowing to Record would widen
	// those accesses to `unknown`.
	export function isObject(value: unknown): boolean;

	// Returns true if `value` is a string.
	export function isString(value: unknown): value is string;

	// Returns true if `value` looks like a valid MongoDB ObjectId (12 or 24 hex chars).
	export function isValidObjectId(value: string): boolean;

	// Converts a camelCase/underscore key to a human-readable label.
	export function keyToLabel(key: string): string;

	// Converts a key to a URL path segment, optionally pluralising the last word.
	export function keyToPath(key: string, plural?: boolean): string;

	// Converts a key to a headlessCamelCase property name, optionally pluralising.
	export function keyToProperty(key: string, plural?: boolean): string;

	// Parses a human-friendly number string (e.g. "1,432" or "$12.50") to a float.
	export function number(value: string | number): number;

	// Merges `ops` into `defaults` by reference and returns the merged object.
	export function options<T extends Record<string, unknown>>(defaults: T, ops?: Partial<T> & Record<string, unknown>): T;

	// Creates a lookup map from an array of objects keyed by each item's `value` property.
	// Overload 1 — map items to themselves (or a cloned copy): optionsMap(arr, clone?)
	// Overload 2 — map items to a property path: optionsMap(arr, keyPath, valuePath?, clone?)
	export function optionsMap(arr: Record<string, unknown>[], clone?: boolean): Record<string, unknown>;
	export function optionsMap(arr: Record<string, unknown>[], keyPath: string, valuePath?: string, clone?: boolean): Record<string, unknown>;

	// With 1 arg: pluralises the word. With 2-3 args: formats count against a
	// singular/plural template (replaces '*' with count).
	export function plural(count: string | number | object): string;
	export function plural(count: string | number | object, sn: string, pl?: string): string;

	// Generates a random alphanumeric string of the given length or length range.
	export function randomString(length?: number | [number, number], chars?: string): string;

	// Converts a string to its singular form.
	export function singular(s: string): string;

	// Generates a URL-safe slug from a string.
	export function slug(str: string, sep?: string, options?: { locale?: string } & Record<string, unknown>): string;

	// Converts plain text to HTML (encodes entities and converts newlines to <br>).
	export function textToHTML(s: string): string;

	const _default: {
		bindMethods: typeof bindMethods;
		cropString: typeof cropString;
		defer: typeof defer;
		downcase: typeof downcase;
		encodeHTMLEntities: typeof encodeHTMLEntities;
		escapeRegExp: typeof escapeRegExp;
		isArray: typeof isArray;
		isEmail: typeof isEmail;
		isFunction: typeof isFunction;
		isObject: typeof isObject;
		isString: typeof isString;
		isValidObjectId: typeof isValidObjectId;
		keyToLabel: typeof keyToLabel;
		keyToPath: typeof keyToPath;
		keyToProperty: typeof keyToProperty;
		number: typeof number;
		options: typeof options;
		optionsMap: typeof optionsMap;
		plural: typeof plural;
		randomString: typeof randomString;
		singular: typeof singular;
		slug: typeof slug;
		textToHTML: typeof textToHTML;
		[key: string]: (...args: unknown[]) => unknown;
	};
	export default _default;
	export = _default;
}
