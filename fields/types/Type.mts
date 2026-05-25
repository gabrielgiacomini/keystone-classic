/**
 * @file
 * Defines the abstract `FieldType` base class extended by every concrete
 * KeystoneJS field type.
 *
 * Source imports use `.mjs` specifiers so the emitted `dist` runtime can load
 * directly, but this `.mts` file is the single source for both behaviour and
 * type information.
 *
 * Concrete bundled field types now extend the named `FieldType` class. The
 * default export remains a legacy-callable bridge so external field types that
 * still use `util.inherits(ChildType, FieldType)` can migrate independently.
 */
import type { Schema, Document as MongooseDoc } from 'mongoose';
import type { PathConstructor } from '../../lib/path.mjs';
import { marked } from 'marked';
import Path from '../../lib/path.mjs';
import { defer } from '../../lib/utils/async.mjs';
import { keyToLabel } from '../../lib/utils/string.mjs';
import evalDependsOn from '../utils/evalDependsOn.mjs';
import definePrototypeGetters from '../utils/definePrototypeGetters.mjs';
import __debug_factory from 'debug';

const debug = __debug_factory('keystone:fields:types:Type');

const FN_ARGS = /^function\s*[^(]*\(\s*([^)]*)\)/m;
function isObjectLike(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object';
}

function callWithCallback (fn: (this: MongooseDocument, callback?: (err: unknown, val?: unknown) => void) => unknown, context: MongooseDocument, callback: (err: unknown, val?: unknown) => void): void {
	const params = (FN_ARGS.exec(Function.prototype.toString.call(fn))?.[1] ?? '').split(',').map((s: string) => s.trim()).filter(Boolean);
	if (params.at(-1) === 'callback') {
		fn.call(context, callback);
	} else {
		try { callback(null, fn.call(context)); } catch (e) { callback(e); }
	}
}

/**
 * Minimal interface for a Mongoose document as used by field methods.
 * Concrete field types interact with the document via `get`, `set`,
 * `isModified`, and `toObject`.
 */
export interface MongooseDocument {
	get(path: string): unknown;
	set(path: string, value: unknown): void;
	isModified(path: string): boolean;
	toObject(): Record<string, unknown>;
}

/** Minimal Mongoose virtual builder surface used by field registration. */
export interface KeystoneSchemaVirtualLike {
	get(fn: (this: MongooseDocument, ...args: unknown[]) => unknown): unknown;
	set(fn: (this: MongooseDocument, value: unknown) => unknown): unknown;
}

/** Minimal Mongoose schema surface required by the base field type. */
export interface KeystoneSchemaLike {
	add(...args: unknown[]): unknown;
	path(...args: unknown[]): unknown;
	pre(...args: unknown[]): unknown;
	virtual(...args: unknown[]): KeystoneSchemaVirtualLike;
	methods: Record<string, unknown>;
}

/**
 * Minimal interface for a Keystone List instance as seen by FieldType.
 * The full List class is in `lib/list.mjs`; this subset covers only what
 * FieldType's constructor and methods actually call.
 */
export interface KeystoneList {
	key: string;
	schema: KeystoneSchemaLike;
	mappings: { name: string | null };
	get(key: string): unknown;
	automap(field: FieldType): void;
	underscoreMethod(path: string, fn: (this: MongooseDocument, ...args: unknown[]) => unknown): void;
}

/**
 * Validated size keyword for a field's UI footprint. Concrete field types
 * may set `_fixedSize` / `_defaultSize` to one of these values, and end-user
 * options may pass `size` directly.
 */
export type FieldSize = 'small' | 'medium' | 'large' | 'full';

/** Shared option keys accepted by Keystone field constructors. */
export interface FieldOptionsBase {
	path?: string;
	paths?: Record<string, string>;
	type?: unknown;
	label?: string;
	note?: string;
	size?: FieldSize;
	initial?: boolean;
	required?: boolean | (() => boolean);
	col?: boolean;
	noedit?: boolean;
	nocol?: boolean;
	nosort?: boolean;
	indent?: boolean;
	hidden?: boolean;
	collapse?: boolean;
	dependsOn?: Record<string, unknown>;
	autoCleanup?: boolean;
	thumb?: boolean;
	default?: unknown;
	value?: unknown;
	watch?: boolean | string | string[] | Record<string, unknown> | ((this: MongooseDocument) => boolean);
	typeDescription?: string;
	[key: string]: unknown;
}

const DEFAULT_OPTION_KEYS = [
	'path', 'paths', 'type', 'label', 'note', 'size', 'initial', 'required',
	'col', 'noedit', 'nocol', 'nosort', 'indent', 'hidden', 'collapse',
	'dependsOn', 'autoCleanup', 'thumb',
];

/** Shape of an underscore method descriptor used in `_underscoreMethods`. */
interface UnderscoreMethodDescriptor {
	fn: string;
	as: string;
}

/**
 * Abstract base class for every KeystoneJS field type.
 *
 * Bundled subclasses now use `class extends FieldType`. The default export
 * keeps the older prototypal pattern working for third-party field types during
 * their own migration.
 *
 * @template TServerOptions Shape of the `options` bag this field accepts.
 *                          Subclasses narrow this to their specific options.
 * @template TValue         Stored value type (lives on the Mongoose doc).
 */
abstract class FieldType<
	TServerOptions extends FieldOptionsBase = FieldOptionsBase,
	TValue = unknown,
> {
	// Typed members for the core Keystone contract.
	declare list: KeystoneList;
	declare path: string;
	declare _path: InstanceType<PathConstructor>;
	declare type: string;
	declare options: TServerOptions;
	declare label: string;
	declare typeDescription: string;
	// Optional internal flags that concrete subclasses set in their
	// constructors. Declared (not initialised) so the base class body can
	// reference them without TS2568, while subclass constructors continue to
	// assign them at runtime.
	declare _underscoreMethods?: (string | UnderscoreMethodDescriptor)[];
	declare _properties?: string[];
	declare _nativeType?: unknown;
	declare _fixedSize?: FieldSize;
	declare _defaultSize?: FieldSize;
	// Lazy/derived prototype-getter targets (filled by `definePrototypeGetters`
	// at the bottom of this file). `declare` keeps TS aware of them without
	// emitting field initialisers that would shadow the prototype getters.
	declare size: string;
	declare initial: boolean;
	declare required: boolean | (() => boolean);
	declare note: string;
	declare col: boolean;
	declare noedit: boolean;
	declare nocol: boolean;
	declare nosort: boolean;
	declare collapse: boolean;
	declare hidden: boolean;
	declare dependsOn: Record<string, unknown> | false;

	/**
	 * Field Constructor
	 *
	 * Mirrors the legacy `function Field()` body exactly so subclasses
	 * relying on `util.inherits` see no behavioural change.
	 *
	 * @param list The Keystone List instance this field belongs to.
	 * @param path The dot-separated path of the field on the list schema.
	 * @param options The field configuration options.
	 */
	constructor (list: KeystoneList, path: string, options: TServerOptions) {
		this.list = list;
		this._path = new Path(path);
		this.path = path;

		const ctor = this.constructor as typeof FieldType & { typeName?: string; name: string };
		const constructorName = ctor.typeName ?? ctor.name;
		this.type = constructorName.endsWith('_') ? constructorName.slice(0, -1) : constructorName;
		this.options = {
			...((this as Record<string, unknown>).defaults as Record<string, unknown> | undefined),
			...options,
		} as TServerOptions; // TODO(strict-types): `defaults` is set by subclasses, not declared on base
		this.label = options.label || keyToLabel(this.path);
		this.typeDescription = options.typeDescription || this.typeDescription || this.type;

		list.automap(this);

		if (this.options.required
			&& this.options.initial === undefined
			&& this.options.default === undefined
			&& !this.options.value
			&& !list.get('nocreate')
			&& this.path !== list.mappings.name
		) {
			console.error('\nError: Invalid Configuration\n\n'
				+ 'Field (' + list.key + '.' + path + ') is required but not initial, and has no default or generated value.\n'
				+ 'Please provide a default, remove the required setting, or set initial: false to override this error.\n');
			process.exit(1);
		}

		if (this.options.dependsOn && this.options.required === true) {
			const opts = this.options;
			this.options.required = function (this: MongooseDocument) {
				debug('validate dependsOn required', evalDependsOn(opts.dependsOn, this.toObject()));
				return evalDependsOn(opts.dependsOn, this.toObject());
			};
		}

		this.addToSchema(list.schema as Schema);

		if (this.options.watch) {
			list.schema.pre('save', this.getPreSaveWatcher());
		}

		let note: string | null = null;
		const noteOption: string | undefined = this.options.note;
		Object.defineProperty(this, 'note', {
			get: function () {
				note ??= noteOption ? marked(noteOption) as string : '';
				return note;
			},
		});
	}

	/** Cached result of {@link FieldType#getOptions}. Set on first call and reused. */
	declare private __options?: Record<string, unknown>;

	/**
	 * Gets the options for the Field, as used by the React components.
	 * @returns The field options object.
	 */
	getOptions (): Record<string, unknown> {
		if (!this.__options) {
			const cache: Record<string, unknown> = {};
			this.__options = cache;
			let optionKeys = DEFAULT_OPTION_KEYS;
			if (Array.isArray(this._properties)) {
				optionKeys = optionKeys.concat(this._properties);
			}
			const self = this as Record<string, unknown>;
			optionKeys.forEach((key: string) => {
				if (self[key]) {
					cache[key] = self[key];
				} else if ((this.options as Record<string, unknown>)[key]) {
					cache[key] = (this.options as Record<string, unknown>)[key];
				}
			});
			const selfAny = self as { getProperties?: () => Record<string, unknown>; addFilterToQuery?: unknown };
			if (selfAny.getProperties) {
				Object.assign(this.__options, selfAny.getProperties());
			}
			this.__options.hasFilterMethod = selfAny.addFilterToQuery ? true : false;
			this.__options.defaultValue = this.getDefaultValue();
		}
		return this.__options;
	}

	/** Cached size string, set lazily by {@link FieldType#getSize}. */
	declare private __size?: string;

	/**
	 * Validates and returns the size of the field.
	 * Defaults to deprecated 'width' option.
	 */
	getSize (): string {
		if (!this.__size) {
			let size = this._fixedSize || this.options.size || (this.options as Record<string, unknown>).width;
			if (size !== 'small' && size !== 'medium' && size !== 'large' && size !== 'full') {
				size = this._defaultSize || 'full';
			}
			this.__size = size as string;
		}
		return this.__size;
	}

	/**
	 * Gets default value for the field, based on the option or default for the type.
	 */
	getDefaultValue (): unknown {
		return typeof this.options.default !== 'undefined' ? this.options.default : '';
	}

	/**
	 * Gets the field's data from an Item, as used by the React components.
	 * @param item The Mongoose document to read the value from.
	 * @param item.get Method to retrieve a value at a given path from the document.
	 */
	getData (item: { get: (p: string) => unknown }): TValue {
		return item.get(this.path) as TValue;
	}

	/**
	 * Builds and returns the pre-save hook function that watches for changes
	 * and applies the configured value method.
	 */
	getPreSaveWatcher (): (this: MongooseDocument, next: () => void) => void {
		const field = this;
		let applyValue: ((item: MongooseDocument) => boolean) | undefined;

		if (this.options.watch === true) {
			applyValue = function () { return true; };
		} else {
			if (typeof this.options.watch === 'string') {
				this.options.watch = this.options.watch.split(' ');
			}
			if (typeof this.options.watch === 'function') {
				applyValue = this.options.watch;
			} else if (Array.isArray(this.options.watch)) {
				const watchPaths = this.options.watch;
				applyValue = function (item: MongooseDocument) {
					let pass = false;
					watchPaths.forEach(function (path: string) {
						if (item.isModified(path)) pass = true;
					});
					return pass;
				};
			} else if (isObjectLike(this.options.watch)) {
				const watchMap = this.options.watch;
				applyValue = function (item: MongooseDocument) {
					let pass = false;
					Object.entries(watchMap).forEach(function ([path, value]) {
						if (item.isModified(path) && item.get(path) === value) pass = true;
					});
					return pass;
				};
			}
		}

		if (!applyValue) {
			const watch = this.options.watch;
			const watchDesc =
				typeof watch === 'function'
					? '[Function]'
					: typeof watch === 'object'
						? JSON.stringify(watch)
						: String(watch);
			console.error('\nError: Invalid Configuration\n\n'
				+ 'Invalid watch value (' + watchDesc + ') provided for ' + this.list.key + '.' + this.path + ' (' + this.type + ')');
			process.exit(1);
		}

		const resolvedApplyValue = applyValue;
		return function (this: MongooseDocument, next: () => void) {
			if (!resolvedApplyValue(this)) {
				return next();
			}
			callWithCallback(field.options.value as (this: MongooseDocument, callback?: (err: unknown, val?: unknown) => void) => unknown, this, function (this: MongooseDocument, err: unknown, val: unknown) {
				if (err) {
					console.error(
						'\nError: '
							+ 'Watch set with value method for ' + field.list.key + '.' + field.path + ' (' + field.type + ') throws error:',
						err,
					);
				} else {
					this.set(field.path, val);
				}
				next();
			}.bind(this));
		};
	}

	/**
	 * Default method to register the field on the List's Mongoose Schema.
	 * Overridden by some fieldType Classes.
	 * @param schema The Mongoose Schema to add the field path to.
	 */
	addToSchema (schema: Schema): void {
		const ops = (this._nativeType) ? { ...this.options, type: this._nativeType } : this.options;
		schema.path(this.path, ops);
		this.bindUnderscoreMethods();
	}

	/**
	 * Binds the methods specified by the _underscoreMethods property.
	 * Must be called by the field type's `addToSchema` method.
	 * Always includes the `update` method.
	 */
	bindUnderscoreMethods (): void {
		const field = this;
		const fieldAsRecord = field as Record<string, unknown>;
		(this._underscoreMethods ?? []).concat({ fn: 'updateItem', as: 'update' }).forEach(function (method: string | UnderscoreMethodDescriptor) {
			let descriptor: UnderscoreMethodDescriptor;
			if (typeof method === 'string') {
				descriptor = { fn: method, as: method };
			} else {
				descriptor = method;
			}
			if (typeof fieldAsRecord[descriptor.fn] !== 'function') {
				throw new Error('Invalid underscore method (' + descriptor.fn + ') applied to ' + field.list.key + '.' + field.path + ' (' + field.type + ')');
			}
			field.underscoreMethod(descriptor.as, function (this: MongooseDocument, ...args: unknown[]) {
				return (fieldAsRecord[descriptor.fn] as (...a: unknown[]) => unknown).apply(field, [this, ...args]);
			});
		});
	}

	/**
	 * Adds a method to the underscoreMethods collection on the field's list,
	 * with a path prefix to match this field's path and bound to the document.
	 * @param path Method path relative to this field.
	 * @param fn Function to bind to the document-level underscore path.
	 */
	underscoreMethod (path: string, fn: (...args: unknown[]) => unknown): void {
		this.list.underscoreMethod(this.path + '.' + path, function (this: MongooseDocument, ...args: unknown[]) {
			return fn.apply(this, args);
		});
	}

	/**
	 * Default method to format the field value for display.
	 * Overridden by some fieldType Classes.
	 * @param item Mongoose document containing this field's value.
	 */
	format (item: MongooseDocument): unknown {
		const value = item.get(this.path);
		if (value === undefined) return '';
		return value;
	}

	/**
	 * Default method to detect whether the field has been modified in an item.
	 * Overridden by some fieldType Classes.
	 * @param item Mongoose document containing this field's value.
	 */
	isModified (item: MongooseDocument): boolean {
		return item.isModified(this.path);
	}

	/**
	 * Checks whether a provided value for the field is in a valid format.
	 * Overridden by some fieldType Classes.
	 * @param data Submitted data keyed by field path.
	 * @param callback Receives whether the input is valid.
	 */
	validateInput (data: Record<string, unknown>, callback: (valid: boolean) => void): void {
		defer(callback, this.inputIsValid(data));
	}

	/**
	 * Validates that a value for this field has been provided in a data
	 * object, taking into account existing data in an item.
	 * Overridden by some fieldType Classes.
	 * @param item Existing document used for fallback required checks.
	 * @param data Submitted data keyed by field path.
	 * @param callback Receives whether required input is valid.
	 */
	validateRequiredInput (item: MongooseDocument, data: Record<string, unknown>, callback: (valid: boolean) => void): void {
		defer(callback, this.inputIsValid(data, true, item));
	}

	/**
	 * Validates that a value for this field has been provided in a data object.
	 * Overridden by some fieldType Classes.
	 *
	 * Not a reliable public API; use validateInput, which is async, instead.
	 * This method has been deprecated.
	 * @param data Submitted data keyed by field path.
	 * @param required Whether the field should be treated as required.
	 * @param item Existing document used for fallback required checks.
	 */
	inputIsValid (data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		if (!required) return true;
		const value = this.getValueFromData(data);
		if (value === undefined && item?.get(this.path)) return true;
		if (typeof data[this.path] === 'string') {
			return (data[this.path] as string).trim() ? true : false;
		} else {
			return (data[this.path]) ? true : false;
		}
	}

	/**
	 * Updates the value for this field in the item from a data object.
	 * Overridden by some fieldType Classes.
	 * @param item Document to update.
	 * @param data Submitted data keyed by field path.
	 * @param callback Called after the field update has been applied.
	 */
	updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const value = this.getValueFromData(data);
		// This is a deliberate type coercion so that numbers from forms play nice
		if (value !== undefined && value != item.get(this.path)) {  // eslint-disable-line eqeqeq
			item.set(this.path, value);
		}
		process.nextTick(callback);
	}

	/**
	 * Retrieves the value from an object, whether the path is nested or
	 * flattened.
	 * @param data Data object to read from.
	 * @param subpath Optional subpath under this field path.
	 */
	getValueFromData (data: Record<string, unknown>, subpath?: string): unknown {
		return this._path.get(data, subpath);
	}
}

// Lazy prototype getters — kept here (vs. as `get` accessors on the class) so
// the runtime shape matches the historical Field.prototype layout. Concrete
// subclasses and third-party legacy prototypes inherit these getters
// identically to the pre-class implementation.
definePrototypeGetters(FieldType, {
	size: function (this: FieldType) { return this.getSize(); },
	initial: function (this: FieldType) { return this.options.initial || false; },
	required: function (this: FieldType) { return this.options.required || false; },
	note: function (this: FieldType) { return this.options.note || ''; },
	col: function (this: FieldType) { return this.options.col || false; },
	noedit: function (this: FieldType) { return this.options.noedit || false; },
	nocol: function (this: FieldType) { return this.options.nocol || false; },
	nosort: function (this: FieldType) { return this.options.nosort || false; },
	collapse: function (this: FieldType) { return this.options.collapse || false; },
	hidden: function (this: FieldType) { return this.options.hidden || false; },
	dependsOn: function (this: FieldType) { return this.options.dependsOn ?? false; },
});

/**
 * Legacy-callable default export for third-party field types that still use
 * `util.inherits(child, FieldType)` plus `child.super_.call(...)`.
 *
 * Native class constructors cannot be invoked with `.call(this, ...)`, so this
 * bridge constructs the class with the concrete child as `newTarget`, then
 * copies the initialized own descriptors back onto the legacy `this`. Own
 * properties assigned by the child before `super_.call(...)` are temporarily
 * exposed on the child prototype so base-constructor hooks such as
 * `addToSchema()` can still see `_nativeType` and `_underscoreMethods`.
 * @param list List that owns the field.
 * @param path Field path being registered.
 * @param options Field constructor options.
 */
function FieldTypeDefault(this: FieldType, list: KeystoneList, path: string, options: FieldOptionsBase): void {
	// Access .constructor via Object type — all objects have it on the prototype.
	const ctorValue = (this as object).constructor;
	const ctor = typeof ctorValue === 'function'
		? ctorValue as typeof FieldType
		: FieldType;
	const proto = ctor.prototype as unknown as Record<string, unknown>;
	const childDescriptors = Object.getOwnPropertyDescriptors(this);
	const restore = new Map<string, PropertyDescriptor | undefined>();

	for (const [key, descriptor] of Object.entries(childDescriptors)) {
		if (!restore.has(key)) {
			restore.set(key, Object.getOwnPropertyDescriptor(proto, key));
		}
		Object.defineProperty(proto, key, descriptor);
	}

	try {
		const instance: FieldType = Reflect.construct(FieldType, [list, path, options], ctor) as FieldType;
		Object.defineProperties(instance, childDescriptors);
		Object.defineProperties(this, Object.getOwnPropertyDescriptors(instance));
	} finally {
		for (const [key, descriptor] of restore) {
			if (descriptor) {
				Object.defineProperty(proto, key, descriptor);
			} else {
				Reflect.deleteProperty(proto, key);
			}
		}
	}
}

FieldTypeDefault.prototype = FieldType.prototype;
Object.setPrototypeOf(FieldTypeDefault, FieldType);

export default FieldTypeDefault;
export { FieldType };

// ---------------------------------------------------------------------------
// Public-facing type aliases — re-exported from index.mts so that consumers
// of the package can reference these names without importing from the internal
// fields/ sub-path.
// ---------------------------------------------------------------------------

/**
 * A Keystone document: a Mongoose Document merged with the fields of the list.
 * @template T Shape of the list's fields. Defaults to `Record<string, unknown>`.
 */
export type KeystoneDocument<T extends object = object> = MongooseDoc & T;

/**
 * Options bag accepted by every Keystone field type constructor.
 * This is a direct alias of {@link FieldOptionsBase}, the interface used by
 * the {@link FieldType} base class internally.
 */
export type KeystoneFieldOptions = FieldOptionsBase;

/**
 * A Keystone field instance — an alias for the {@link FieldType} base class.
 * @template TServerOptions Shape of the field's options bag (extends {@link FieldOptionsBase}).
 * @template TValue         The stored value type on the Mongoose document.
 */
export type KeystoneField<
	TServerOptions extends FieldOptionsBase = FieldOptionsBase,
	TValue = unknown,
> = FieldType<TServerOptions, TValue>;

/**
 * Constructor interface for a Keystone field type (e.g. `Types.Text`).
 * Matches the shape of every concrete field-type class that extends
 * {@link FieldType}.
 */
export interface KeystoneTypeConstructor {
	/** Creates an instance of the field type. */
	new(list: KeystoneList, path: string, options: FieldOptionsBase): FieldType;
	/** The prototype holds methods shared by field instances of this type. */
	prototype: FieldType;
	/** Canonical name of the field type (e.g., 'Text', 'Relationship'). */
	properName?: string;
	/** Stable technical field type name used by Keystone internals (e.g., 'text'). */
	typeName?: string;
	/** Technical name (often the JS class name, e.g., 'TextType'). */
	name?: string;
}
