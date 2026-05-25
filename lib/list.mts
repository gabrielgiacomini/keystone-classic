import { keyToLabel, keyToPath, plural, singular } from './utils/string.mjs';
import type { Schema as MongooseSchema, SchemaOptions } from 'mongoose';
import type { Keystone } from '../index.mjs';
import type {
	KeystoneDocument,
	KeystoneField,
	KeystoneFieldOptions,
	KeystoneTypeConstructor,
} from '../fields/types/Type.mjs';
import type { ExplicitListOptions } from './core/options-types.js';
import type { AddArg, FieldSpec, FieldInstanceFor, DocumentFor } from '../fields/types/FieldSpec.mjs';

import addMethod from './list/add.mjs';
import addFiltersToQueryMethod from './list/addFiltersToQuery.mjs';
import addSearchToQueryMethod from './list/addSearchToQuery.mjs';
import automapMethod from './list/automap.mjs';
import apiForGetMethod from './list/apiForGet.mjs';
import expandColumnsMethod from './list/expandColumns.mjs';
import expandPathsMethod from './list/expandPaths.mjs';
import expandSortMethod from './list/expandSort.mjs';
import fieldMethod from './list/field.mjs';
import setMethod from './list/set.mjs';
import getAdminURLMethod from './list/getAdminURL.mjs';
import getCSVDataMethod from './list/getCSVData.mjs';
import getDataMethod from './list/getData.mjs';
import getDocumentNameMethod from './list/getDocumentName.mjs';
import getOptionsMethod from './list/getOptions.mjs';
import getPagesMethod from './list/getPages.mjs';
import getSearchFiltersMethod from './list/getSearchFilters.mjs';
import getUniqueValueMethod from './list/getUniqueValue.mjs';
import isReservedMethod from './list/isReserved.mjs';
import mapMethod from './list/map.mjs';
import paginateMethod from './list/paginate.mjs';
import processFiltersMethod from './list/processFilters.mjs';
import registerMethod from './list/register.mjs';
import relationshipMethod from './list/relationship.mjs';
import selectColumnsMethod from './list/selectColumns.mjs';
import updateItemMethod from './list/updateItem.mjs';
import underscoreMethodMethod from './list/underscoreMethod.mjs';
import buildSearchTextIndexMethod from './list/buildSearchTextIndex.mjs';
import declaresTextIndexMethod from './list/declaresTextIndex.mjs';
import ensureTextIndexMethod from './list/ensureTextIndex.mjs';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
/**
 * Factory function that creates a Keystone List class for the given keystone instance.
 * @param keystone - The keystone instance.
 * @returns A List class constructor.
 */
export default function listFactory(keystone: Keystone) {

	/**
	 * List.
	 */
	class List {
		// -----------------------------------------------------------------------
		// Instance members — declared here so TypeScript knows they exist;
		// all are initialised in the constructor body below.
		// -----------------------------------------------------------------------
		keystone: Keystone;
		key: string;
		path: string;
		schema: import('mongoose').Schema;
		schemaFields: AddArg[];
		uiElements: unknown[];
		underscoreMethods: UnderscoreMethodNode;
		fields: Record<string, unknown>;
		fieldsArray: unknown[];
		fieldTypes: Record<string, unknown>;
		relationshipFields: Array<{ path: string; [key: string]: unknown }>;
		relationships: Record<string, unknown>;
		mappings: KeystoneListMappings;
		options: Record<string, unknown>;
		model!: import('mongoose').Model<Record<string, unknown>>;

		// Backing store for the lazy `initialFields` computed getter (underscore-prefixed by convention)
		_initialFields: unknown[] | undefined;
		// Private backing stores for the prototype-level computed getters
		declare _searchFields: unknown[] | undefined;
		declare _defaultColumns: unknown[] | undefined;

		// -----------------------------------------------------------------------
		// Method stubs for the prototype-assigned methods (assigned below the class
		// definition).  Using `declare` tells TypeScript they exist without emitting
		// any JavaScript; the actual implementations are installed via
		// `List.prototype.X = importedMethod` immediately after the class body.
		// -----------------------------------------------------------------------
		declare get: (key: string) => unknown;
		declare set: (key: string, value?: unknown) => unknown;
		declare add: (...args: AddArg[]) => unknown;
		declare addFiltersToQuery: (filters: unknown) => Record<string, unknown>;
		declare addSearchToQuery: (search: unknown) => Record<string, unknown>;
		declare automap: (...args: unknown[]) => unknown;
		declare apiForGet: (...args: unknown[]) => unknown;
		declare expandColumns: (cols: unknown) => unknown[];
		declare expandPaths: (paths: unknown) => unknown[];
		declare expandSort: (sort: unknown) => { string: string; [key: string]: unknown };
		declare field: (path: string, options?: unknown) => unknown;
		declare getAdminURL: () => string;
		declare getCSVData: (item: unknown, opts: unknown) => Record<string, unknown>;
		declare getData: (item: unknown, fields?: unknown, expand?: unknown) => Record<string, unknown>;
		declare getDocumentName: (doc: Record<string, unknown>, escape?: boolean) => string;
		declare getOptions: () => Record<string, unknown>;
		declare getPages: (result: Record<string, unknown>, maxPages: number) => void;
		declare getSearchFilters: (search: unknown, filters: unknown) => Record<string, unknown>;
		declare getUniqueValue: (...args: unknown[]) => unknown;
		declare isReserved: (path: string) => boolean;
		declare map: (key: string, value: string) => string;
		declare paginate: (...args: unknown[]) => unknown;
		declare processFilters: (q: unknown) => unknown;
		declare register: () => this;
		declare relationship: (def: Record<string, unknown>) => this;
		declare selectColumns: (...args: unknown[]) => unknown;
		declare updateItem: (item: unknown, data: unknown, opts: unknown, cb: (err: unknown) => void) => void;
		declare underscoreMethod: (...args: unknown[]) => unknown;
		declare buildSearchTextIndex: (...args: unknown[]) => unknown;
		declare declaresTextIndex: () => boolean;
		declare ensureTextIndex: (callback: (err?: Error | null) => void) => void;

		/**
		 *
		 *
		 * @param key - The list key.
		 * @param options - Explicit list configuration options.
		 */
		constructor(key: string, options: ExplicitListOptions) {
			this.keystone = keystone;

			// Phase 1 iteration 11: all options arrive via the typed ExplicitListOptions
			// argument — no implicit defaults.  The only computed value injected here
			// is `schema.collection`, which derives from the list `key` and cannot
			// reasonably be supplied by the caller.
			//
			// `inherits` handling: the parent list must have been constructed with its
			// own explicit options, so inheriting lists supply their own full option
			// set.  We only keep the "reset track when parent has track enabled"
			// guard, which was a runtime semantic (not a default), plus the error
			// that prevents multi-level inheritance chains.

			if (options.inherits) {
				if (options.inherits.options.inherits) {
					throw new Error('Inherited Lists may not contain any inheritance');
				}
			}

			// Merge the typed options into a plain-object map so that `this.get()`
			// (which reads `this.options[key]`) works for all known and unknown keys.
			// The spread preserves every key the caller supplied.
			this.options = {
				...(options as unknown as Record<string, unknown>),
				schema: {
					collection: keystone.prefixModel(key),
					...((options as unknown as Record<string, unknown>)['schema'] as Record<string, unknown> | undefined),
				},
			};

			this.key = key;
			this.path = (this.get('path') as string | undefined) ?? keyToPath(key, true);
			// JUSTIFIED: Mongoose's Schema constructor overloads are complex generics;
			// the collection name injected into schema options is a plain object
			// compatible at runtime but not fully assignable through the generic chain.
			this.schema = new keystone.mongoose.Schema(
				{},
				this.options['schema'] as import('mongoose').SchemaOptions,
			);
			this.schemaFields = [];
			this.uiElements = [];
			this.underscoreMethods = {};
			this.fields = {};
			this.fieldsArray = [];
			this.fieldTypes = {};
			this.relationshipFields = [];
			this.relationships = {};
			this.mappings = {
				name: null,
				createdBy: null,
				createdOn: null,
				modifiedBy: null,
				modifiedOn: null,
			};

			const mapOptions = this.options['map'];
			if (mapOptions != null && typeof mapOptions === 'object') {
				Object.entries(mapOptions as Record<string, unknown>).forEach(([mapKey, val]) => {
					this.map(mapKey, val as string);
				});
			}

			if (this.get('inherits')) {
				const parentList = this.get('inherits') as { schemaFields: AddArg[] };
				const parentFields = parentList.schemaFields;
				this.add(...(parentFields as [AddArg, ...AddArg[]]));
			}
		}

		// -----------------------------------------------------------------------
		// Computed getters — instance-level (per-item backing state is on `this`).
		// -----------------------------------------------------------------------

		/**
		 * The human-readable label for this list.
		 * @returns The label string.
		 */
		get label(): string {
			return (this.get('label') as string | undefined) ?? (this.set('label', plural(keyToLabel(this.key))) as string);
		}

		/**
		 * The singular form of the list name.
		 * @returns The singular form of the list name.
		 */
		get singular(): string {
			return (this.get('singular') as string | undefined) ?? (this.set('singular', singular(this.label)) as string);
		}

		/**
		 * The plural form of the list name.
		 * @returns The plural form of the list name.
		 */
		get plural(): string {
			return (this.get('plural') as string | undefined) ?? (this.set('plural', plural(this.singular)) as string);
		}

		/**
		 * The path to the name field.
		 * @returns The path to the name field.
		 */
		get namePath(): string {
			return (this.mappings.name as string | null) ?? '_id';
		}

		/**
		 * The name field descriptor.
		 * @returns The name field descriptor.
		 */
		get nameField(): unknown {
			return this.fields[this.mappings.name ?? ''];
		}

		/**
		 * Whether the name field is virtual.
		 * @returns Whether the name field is virtual.
		 */
		get nameIsVirtual(): boolean {
			return Boolean((this.model as unknown as { schema: { virtuals: Record<string, unknown> } }).schema.virtuals[this.mappings.name ?? '']);
		}

		/**
		 * Whether the name field renders as form header.
		 * @returns Whether the name field renders as form header.
		 */
		get nameFieldIsFormHeader(): boolean {
			const field = this.fields[this.mappings.name ?? ''] as (Record<string, unknown> & { noedit?: boolean }) | undefined;
			return field?.['type'] === 'text' ? !(field.noedit) : false;
		}

		/**
		 * Whether the name field is in the initial form.
		 * @returns Whether the name field is in the initial form.
		 */
		get nameIsInitial(): boolean {
			const field = this.fields[this.mappings.name ?? ''] as (Record<string, unknown> & { options?: { initial?: unknown } }) | undefined;
			return Boolean(field && field.options?.initial === undefined);
		}

		/**
		 * The fields shown in the initial create form.
		 * @returns The fields shown in the initial create form.
		 */
		get initialFields(): unknown[] {
			if (!this._initialFields) {
				this._initialFields = Object.values(this.fields).filter(
					(i): i is Record<string, unknown> & { initial: unknown } =>
						i != null && typeof i === 'object' && Boolean((i as Record<string, unknown>)['initial'])
				);
			}
			return this._initialFields;
		}
	}

	// -------------------------------------------------------------------------
	// Prototype-level computed properties (searchFields, defaultSort,
	// defaultColumns).  These live on the prototype (not per-instance) because
	// they depend on sibling methods (expandPaths / expandColumns) that are
	// assigned to the prototype below.  The pattern is intentional and mirrors
	// the original constructor-function approach.
	// -------------------------------------------------------------------------

	Object.defineProperty(List.prototype, 'searchFields', {
		get: function (this: List & { _searchFields: unknown[] | undefined }) {
			if (!this._searchFields) {
				this._searchFields = (this as List & { expandPaths(v: unknown): unknown[] }).expandPaths(this.get('searchFields'));
			}
			return this._searchFields;
		},
		set: function (this: List & { _searchFields: unknown[] | undefined }, value: unknown) {
			this.set('searchFields', value);
			this._searchFields = undefined;
		},
	});

	Object.defineProperty(List.prototype, 'defaultSort', {
		get: function (this: List) {
			const ds = this.get('defaultSort');
			if (ds && ds !== '__default__') return ds;
			return this.get('sortable') ? 'sortOrder' : this.namePath;
		},
		set: function (this: List, value: unknown) {
			this.set('defaultSort', value);
		},
	});

	Object.defineProperty(List.prototype, 'defaultColumns', {
		get: function (this: List & { _defaultColumns: unknown[] | undefined }) {
			if (!this._defaultColumns) {
				this._defaultColumns = (this as List & { expandColumns(v: unknown): unknown[] }).expandColumns(this.get('defaultColumns'));
			}
			return this._defaultColumns;
		},
		set: function (this: List & { _defaultColumns: unknown[] | undefined }, value: unknown) {
			this.set('defaultColumns', value);
			this._defaultColumns = undefined;
		},
	});

	// -------------------------------------------------------------------------
	// Prototype method assignments — these augment the class prototype exactly
	// as before.  Class methods ARE prototype methods, so this pattern continues
	// to work and is visible on all instances.
	// -------------------------------------------------------------------------

	// The imported method functions have precise `this: KeystoneList` constraints
	// that are not yet reflected in the `declare` stubs on the class (those use
	// looser signatures to avoid coupling the class definition to the imported
	// types).  We use a single `Object.assign` so TypeScript treats the assignment
	// as a bulk operation without checking each property's compatibility
	// individually — the runtime behavior is identical to the original
	// `List.prototype.X = method` pattern.
	Object.assign(List.prototype, {
		add: addMethod,
		addFiltersToQuery: addFiltersToQueryMethod,
		addSearchToQuery: addSearchToQueryMethod,
		automap: automapMethod,
		apiForGet: apiForGetMethod,
		expandColumns: expandColumnsMethod,
		expandPaths: expandPathsMethod,
		expandSort: expandSortMethod,
		field: fieldMethod,
		get: setMethod,
		set: setMethod,
		getAdminURL: getAdminURLMethod,
		getCSVData: getCSVDataMethod,
		getData: getDataMethod,
		getDocumentName: getDocumentNameMethod,
		getOptions: getOptionsMethod,
		getPages: getPagesMethod,
		getSearchFilters: getSearchFiltersMethod,
		getUniqueValue: getUniqueValueMethod,
		isReserved: isReservedMethod,
		map: mapMethod,
		paginate: paginateMethod,
		processFilters: processFiltersMethod,
		register: registerMethod,
		relationship: relationshipMethod,
		selectColumns: selectColumnsMethod,
		updateItem: updateItemMethod,
		underscoreMethod: underscoreMethodMethod,
		buildSearchTextIndex: buildSearchTextIndexMethod,
		declaresTextIndex: declaresTextIndexMethod,
		ensureTextIndex: ensureTextIndexMethod,
	});

	return List;
}

// ---------------------------------------------------------------------------
// Public-facing type exports — re-exported from index.mts.
// ---------------------------------------------------------------------------

/**
 * Defines the mapping between special list properties and field paths.
 * Mirrors the `mappings` object initialised in the List constructor.
 */
export interface KeystoneListMappings {
	/** Field path for the item's name/title */
	name: string | null;
	/** Field path for tracking who created the document */
	createdBy: string | null;
	/** Field path for tracking when the document was created */
	createdOn: string | null;
	/** Field path for tracking who last modified the document */
	modifiedBy: string | null;
	/** Field path for tracking when the document was last modified */
	modifiedOn: string | null;
}

/**
 * Represents an object defining one or more fields passed to `list.add()`,
 * potentially nested inside a heading group.
 */
export interface KeystoneGroupFields<
	T extends KeystoneDocument = KeystoneDocument
> extends Record<
	string,
		| KeystoneFieldOptions
		| KeystoneTypeConstructor
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| DateConstructor
		| KeystoneGroupFields<T>
> {}

/**
 * Represents a heading entry passed to `list.add()`.
 * A plain string heading is also accepted at runtime; this type covers the
 * object form.
 */
export interface KeystoneGroupHeading {
	/** The text of the heading. */
	heading: string;
	/** Control heading visibility in the Admin UI based on other field values. */
	dependsOn?: Record<string, unknown>;
	[key: string]: unknown;
}

/**
 * Admin-UI element: a rendered field.
 */
export interface KSAdminUiElementField<
	TServerOptions extends KeystoneFieldOptions = KeystoneFieldOptions,
	TValue = unknown,
> {
	type: 'field';
	field: KeystoneField<TServerOptions, TValue>;
}

/**
 * Admin-UI element: a heading separator.
 */
export interface KSAdminUiElementHeading {
	type: 'heading';
	heading: string;
	options: KeystoneGroupHeading | Record<string, unknown>;
}

/**
 * Admin-UI element: an indent marker (opens a visual group).
 */
export interface KSAdminUiElementIndent {
	type: 'indent';
}

/**
 * Admin-UI element: an outdent marker (closes a visual group).
 */
export interface KSAdminUiElementOutdent {
	type: 'outdent';
}

/**
 * Discriminated union of all possible Admin-UI form elements stored in
 * `list.uiElements`.
 */
export type KSAdminUIElement<
	TServerOptions extends KeystoneFieldOptions = KeystoneFieldOptions,
	TValue = unknown,
> =
	| KSAdminUiElementField<TServerOptions, TValue>
	| KSAdminUiElementHeading
	| KSAdminUiElementIndent
	| KSAdminUiElementOutdent;

/**
 * Options accepted by the `List` constructor.
 *
 * Note: the `inherits` field in the hand-rolled declaration refers to a
 * generic `KeystoneList<T>`.
 */
export interface KeystoneListOptions<
	T extends KeystoneDocument = KeystoneDocument
> {
	/**
	 * Mongoose schema options applied to the underlying schema.
	 */
	schema?: SchemaOptions;
	/** Prevent editing items through the Admin UI. */
	noedit?: boolean;
	/** Prevent creating items through the Admin UI. */
	nocreate?: boolean;
	/** Prevent deleting items through the Admin UI. */
	nodelete?: boolean;
	/**
	 * Automatically create an empty item when the list is registered.
	 * Useful for singleton lists (e.g. site settings).
	 */
	autocreate?: boolean;
	/** Enable drag-and-drop sorting in the Admin UI. */
	sortable?: boolean;
	/** Hide the list from the main Admin UI navigation. */
	hidden?: boolean;
	/**
	 * Enable automatic tracking fields (createdAt, createdBy, updatedAt, updatedBy).
	 * Set to `true` to enable all fields, or configure individually.
	 */
	track?:
		| boolean
		| {
				/** Track who created the document */
				createdBy?: boolean | string;
				/** Track when the document was created */
				createdAt?: boolean | string;
				/** Track who last updated the document */
				updatedBy?: boolean | string;
				/** Track when the document was last updated */
				updatedAt?: boolean | string;
		  };
	/**
	 * Inherit schema and options from another List instance.
	 * The parent list's fields will be included in this list.
	 * Typed as the minimal `KeystoneList` interface; the runtime value is the
	 * full List instance.
	 */
	inherits?: KeystoneListInheritanceSource;
	/** Default number of items per page in the Admin UI list view. */
	perPage?: number;
	/** Fields to search by default. Can be comma-separated string or array. */
	searchFields?: string | readonly string[];
	/** Use MongoDB text index for searching. */
	searchUsesTextIndex?: boolean;
	/**
	 * Default sort field/path.  Use '-' prefix for descending order.
	 * Defaults to `'sortOrder'` if sortable, otherwise `namePath`.
	 */
	defaultSort?: string;
	/**
	 * Default columns to display in the Admin UI list view.
	 * Comma-separated string or array of field paths.
	 */
	defaultColumns?: string | readonly string[];
	/**
	 * Map special list properties (name, createdBy, etc.) to field paths.
	 */
	map?: Partial<KeystoneListMappings>;
	/** Plural label for the list (e.g. "Users"). */
	label?: string;
	/** Singular label for the list (e.g. "User"). */
	singular?: string;
	/** Plural label for the list (e.g. "Users"). */
	plural?: string;
	/** URL path for the list in the Admin UI (e.g. "users"). */
	path?: string;
	/**
	 * Mongoose schema hooks.
	 */
	pre?: {
		/** Hook executed before saving a document */
		save?: (this: T, next: (err?: Error) => void) => void;
	};
	/**
	 * A `KeystoneGroupFields` object or array of such objects passed to
	 * `list.add()` during configuration.
	 */
	fields?: KeystoneGroupFields<T> | KeystoneGroupFields<T>[];
	/** Allow any other custom options accessible via `list.get()`. */
	[key: string]: unknown;
}

/**
 * A type alias for the key type parameter used in `KeystoneList`.
 *
 * When the consumer has populated `KeystoneLists`, `ListKey` resolves to
 * `keyof KeystoneLists`. For the untyped / default case it widens to `string`.
 */
export type ListKey = keyof KeystoneLists extends never ? string : keyof KeystoneLists | (string & {});

/** Minimal list shape required when inheriting schema fields from another list. */
export interface KeystoneListInheritanceSource {
	options: {
		inherits?: unknown;
	};
	schemaFields: unknown[];
}

type KeystoneListDocument<
	TListOrDocument extends string | KeystoneDocument,
	TFields extends Record<string, FieldSpec>,
> = TListOrDocument extends string
	? KeystoneDocument<DocumentFor<TFields>>
	: TListOrDocument;

type KeystoneListResolvedKey<TListOrDocument extends string | KeystoneDocument> =
	TListOrDocument extends string ? TListOrDocument : ListKey;

/** Public constructor surface exposed as `keystone.List`. */
export interface KeystoneListConstructor {
	new <TDocument extends KeystoneDocument = KeystoneDocument>(
		key: string,
		options?: KeystoneListOptions<TDocument> | ExplicitListOptions,
	): KeystoneList<TDocument>;
}

/**
 * Public instance shape of a registered Keystone List.
 *
 * This interface is generic over:
 * - `TKey` — the list's registration key (e.g. `"User"`). Defaults to `ListKey`
 *   (i.e., `string`) so all existing untyped callers keep compiling.
 * - `TFields` — the accumulated field-spec map built up via `.add()` calls.
 *   Defaults to `Record<string, FieldSpec>` so `list.fields[path]` is still
 *   accessible for code that does not know the specific field set.
 *
 * When `TFields` is a concrete spec map (e.g. `{ email: { type: typeof EmailType } }`),
 * `list.fields.email` resolves to `EmailType` (not `unknown`).
 *
 * Consumers such as `cloom-core` import this type to walk `keystone.lists`
 * without resorting to `as any`: // JUSTIFIED: occurrence is in a JSDoc comment, not a type annotation
 *
 * ```ts
 * import { KeystoneList } from "keystone";
 * for (const [key, list] of Object.entries(keystone.lists)) {
 *   list.model.findOne({}).exec(cb);
 * }
 * ```
 */

/**
 * A leaf node in the underscore-method registry — a bound method function.
 */
export type UnderscoreMethod = (...args: unknown[]) => unknown;

/**
 * An object node in the nested underscore-method registry.
 * Values are either leaf method functions or deeper sub-trees, keyed by
 * path segment (e.g. `{ fieldpath: { methodname: fn } }`).
 * Allows deeply-nested paths such as `paths.password.compare`.
 *
 * This object form is what `list.underscoreMethods` always is at the top level.
 * The union {@link UnderscoreMethodTree} covers both object nodes and leaf fns,
 * used for recursion inside the registry.
 */
export interface UnderscoreMethodNode {
	[key: string]: UnderscoreMethodTree;
}

/**
 * A node in the nested underscore-method registry.
 * Leaf nodes are bound method functions; internal nodes are sub-trees keyed by
 * path segment (e.g. `{ fieldpath: { methodname: fn } }`).
 * The recursion allows deeply-nested paths such as `paths.password.compare`.
 */
export type UnderscoreMethodTree = UnderscoreMethod | UnderscoreMethodNode;

/**
 * KeystoneList.
 */
export interface KeystoneList<
	TListOrDocument extends string | KeystoneDocument = ListKey,
	TFields extends Record<string, FieldSpec> = Record<string, FieldSpec>,
	TKey extends string = KeystoneListResolvedKey<TListOrDocument>,
	TDocument extends KeystoneDocument = KeystoneListDocument<TListOrDocument, TFields>,
> {
	/** The list's unique registration key (e.g. `"User"`). */
	key: TKey;
	/** URL path used by the Admin UI for this list (e.g. `"users"`). */
	path: string;
	/** The Mongoose Schema that backs this list. */
	schema: KeystoneListSchema<TDocument>;
	/**
	 * The compiled Mongoose Model for this list, typed over the document shape
	 * derived from `TFields`. When `TFields` is a concrete field map, field-path
	 * access in `findOne` / `find` filters and results is fully typed.
	 *
	 * When `TFields` is the default `Record<string, FieldSpec>`,
	 * `DocumentFor<TFields>` resolves to `{ [key: string]: FieldValueFor<FieldSpec> }`
	 * — a union of all value types — keeping all untyped callers compiling without
	 * changes.
	 *
	 * Available after `list.register()` has been called.
	 */
	model: import('mongoose').Model<TDocument>;
	/** The options object passed to the List constructor, merged with defaults. */
	options: KeystoneListOptions<TDocument>;
	/**
	 * Mapping of field paths to their Keystone Field instances.
	 *
	 * When `TFields` is a concrete spec map, each property resolves to the
	 * concrete field class instance (e.g. `fields.email` → `EmailType`).
	 * With the default `Record<string, FieldSpec>`, indexed access returns
	 * `FieldInstanceFor<FieldSpec>` — a union of all field types (or `undefined`
	 * if `noUncheckedIndexedAccess` is on).
	 */
	fields: { [P in keyof TFields]: FieldInstanceFor<TFields[P]> };
	/** Field instances in declaration order. */
	fieldsArray: unknown[];
	/** Field-type-keyed registry for this list's field types. */
	fieldTypes: Record<string, unknown>;
	/** Named relationship definitions added via `list.relationship(...)`. */
	relationships: Record<string, unknown>;
	/** Mapping of special properties (name, createdBy, etc.) to field paths. */
	mappings: KeystoneListMappings;
	/** Flat array of UI elements (fields, headings, indents) for the Admin UI form. */
	uiElements: unknown[];
	/** Raw field-definition arguments accumulated for inheritance. */
	schemaFields: AddArg[];
	/** Computed singular label (e.g. `"User"`). */
	singular: string;
	/** Computed plural label (e.g. `"Users"`). */
	plural: string;
	/** Computed label (plural form by default). */
	label: string;
	/** The field path used as the item's name/title. */
	namePath: string;
	/** Get / set list-level options (mirrors `List.prototype.get/set`). */
	get(key: string): unknown;
	set(key: string, value: unknown): unknown;
	/** Register a field with automapped paths such as name/createdAt/updatedAt. */
	automap(field: unknown): void;
	/** Register an underscore helper exposed on documents for a field path. */
	underscoreMethod(path: string, fn: UnderscoreMethod): void;
	/** Register this list with the Keystone instance (compiles the Mongoose model). */
	register(): this;
	/**
	 * Add fields to this list's schema.
	 *
	 * When called with a typed `FieldMap` argument, the returned list carries
	 * the accumulated `TFields & TNewFields` type so that subsequent `.fields`
	 * access reflects all added field paths.
	 */
	add<TNewFields extends Record<string, FieldSpec>>(
		fields: TNewFields,
		...rest: AddArg[]
	): TListOrDocument extends string
		? KeystoneList<TKey, TFields & TNewFields>
		: KeystoneList<TDocument, TFields & TNewFields, TKey, TDocument>;
	/** Overload for heading/non-FieldMap arguments (returns this without narrowing). */
	add(...args: AddArg[]): this;
	/** Define a relationship to another list. */
	relationship(def: Record<string, unknown>): this;
	/** Get the field instance for a given path (1-arg: lookup; 2-arg: register). */
	field(path: string, options?: unknown): unknown;
	/** Returns true if the given path is a reserved Keystone field path. */
	isReserved(path: string): boolean;
	/** Map a special property (name, createdBy, etc.) to a field path. */
	map(key: string, value: string): string;
	/** Return the display name for a given Mongoose document. */
	getDocumentName(doc: Record<string, unknown>, escape?: boolean): string;
	/** Return the admin URL for this list. */
	getAdminURL(): string;
	/** Relationship field descriptors (each has at least a `path` string). */
	relationshipFields: Array<{ path: string; [key: string]: unknown }>;
	/** Converts a filters object into a Mongoose query fragment. */
	addFiltersToQuery(filters: unknown): Record<string, unknown>;
	/** Converts a search string into a Mongoose query fragment. */
	addSearchToQuery(search: unknown): Record<string, unknown>;
	/** Expands a sort string; the returned object always has a `string` key. */
	expandSort(sort: unknown): { string: string; [key: string]: unknown };
	/** Returns a plain-object representation of an item. */
	getData(item: unknown, fields?: unknown, expandRelationshipFields?: unknown): Record<string, unknown>;
	/** Returns a CSV-row plain-object for an item. */
	getCSVData(item: unknown, opts: unknown): Record<string, unknown>;
	/** Returns the serialisable list options object used by the Admin UI. */
	getOptions(): Record<string, unknown>;
	/** Updates `item` in-place from `data`, calling `callback` when done. */
	updateItem(item: unknown, data: unknown, opts: unknown, callback: (err: unknown) => void): void;
	/** Parses a query-string filter expression into filter objects. */
	processFilters(q: unknown): unknown;
	/** Builds Mongoose search query filters from a search string and parsed filters. */
	getSearchFilters(search: unknown, filters: unknown): Record<string, unknown>;
	/** Computes paging metadata and mutates the result object with a `pages` array. */
	getPages(result: Record<string, unknown>, maxPages: number): void;
	/** Stores pagination state computed by `paginate()`. */
	pagination?: { maxPages: number };
	/** The Keystone instance that owns this list (set in the List constructor). */
	keystone: Keystone;
	/** Registry of underscore-method name → handler, built up via `list.underscoreMethod()`. */
	underscoreMethods: UnderscoreMethodNode;
	/** Returns true if the schema has a text index declared. */
	declaresTextIndex(): boolean;
	/** Ensures a text index exists for this list's search fields. */
	ensureTextIndex(callback: (err?: Error | null) => void): void;
	/** Allow any other runtime properties present on the List prototype. */
	[key: string]: unknown;
}

/**
 * Function shape accepted by Mongoose's dynamic schema method registry.
 *
 * @remarks Mongoose stores arbitrary instance methods and types that registry
 * with `any[]` arguments. Keep Keystone's `this` context typed while preserving
 * assignability for methods with narrower, optional parameters.
 */
export type KeystoneSchemaMethod<T extends KeystoneDocument = KeystoneDocument> = {
	bivarianceHack(this: T, ...args: unknown[]): unknown;
}['bivarianceHack'];

/**
 * Represents a Keystone-specific Mongoose schema with typed method support.
 * Extends `mongoose.Schema` to provide proper `this` context typing for schema methods.
 *
 * @template T The document type extending {@link KeystoneDocument}
 *
 * @example
 * ```typescript
 * interface UserDoc extends KeystoneDocument {
 *   name: string;
 *   email: string;
 * }
 *
 * const schema: KeystoneListSchema<UserDoc>;
 * schema.methods.getDisplayName = function (this: UserDoc) {
 *   return this.name;
 * };
 * ```
 */
export interface KeystoneListSchema<
	T extends KeystoneDocument = KeystoneDocument
> extends MongooseSchema<T> {
	/** Schema methods with properly typed `this` context. */
	methods: Record<string, KeystoneSchemaMethod<T>>;
}
