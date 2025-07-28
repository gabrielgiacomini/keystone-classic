import * as mongoose from "mongoose";
import * as express from "express";
import {
	KeystoneDocument,
	KeystoneListSchema,
	KeystoneGroupFields,
	KeystoneGroupHeading,
} from "./core";
import { KeystoneField, KeystoneFieldOptions } from "./field";
import { KSAdminUIElement } from "./ui";

/**
 * Mappings for special list properties to field paths.
 * @see /lib/list/list.js - List mappings implementation
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
 * Configuration options for Keystone lists.
 * @see /lib/list/list.js - List options implementation
 */
export interface KeystoneListOptions<
	T extends KeystoneDocument = KeystoneDocument
> {
	/**
	 * Mongoose schema options applied to the underlying schema.
	 * Pass options directly to the Mongoose schema.
	 */
	schema?: mongoose.SchemaOptions;
	/**
	 * Prevent editing items through the Admin UI.
	 * Items will be read-only in the Admin UI.
	 */
	noedit?: boolean;
	/**
	 * Prevent creating items through the Admin UI.
	 * The "Create" button will be hidden.
	 */
	nocreate?: boolean;
	/**
	 * Prevent deleting items through the Admin UI.
	 * The "Delete" button will be hidden.
	 */
	nodelete?: boolean;
	/**
	 * Automatically create an empty item when the list is registered.
	 * Useful for singleton lists (e.g., site settings).
	 */
	autocreate?: boolean;
	/**
	 * Enable drag-and-drop sorting in the Admin UI.
	 * Adds a sortOrder field to the schema.
	 */
	sortable?: boolean;
	/**
	 * Hide the list from the main Admin UI navigation.
	 * The list will still be accessible via direct URL.
	 */
	hidden?: boolean;
	/**
	 * Enable automatic tracking fields (createdAt, createdBy, updatedAt, updatedBy).
	 * Set to true to enable all fields, or configure individually.
	 */
	track?:
		| boolean
		| {
				/** Track who created the document (references the User model) */
				createdBy?: boolean | string;
				/** Track when the document was created */
				createdAt?: boolean | string;
				/** Track who last updated the document (references the User model) */
				updatedBy?: boolean | string;
				/** Track when the document was last updated */
				updatedAt?: boolean | string;
		  };
	/**
	 * Inherit schema and options from another List instance.
	 * The parent list's fields will be included in this list.
	 */
	inherits?: KeystoneList<T>;
	/**
	 * Default number of items per page in the Admin UI list view.
	 * Controls pagination in the list view.
	 */
	perPage?: number;
	/**
	 * Fields to search by default. Can be comma-separated string or array.
	 * Supports related fields with dot notation (e.g., 'author.name').
	 */
	searchFields?: string | string[];
	/**
	 * Use MongoDB text index for searching.
	 * Requires defining a text index on the collection.
	 */
	searchUsesTextIndex?: boolean;
	/**
	 * Default sort field/path. Use '-' prefix for descending.
	 * Defaults to 'sortOrder' if sortable, otherwise namePath.
	 */
	defaultSort?: string;
	/**
	 * Default columns to display in the Admin UI list view.
	 * Comma-separated string or array of field paths.
	 */
	defaultColumns?: string | string[];
	/**
	 * Map special list properties (name, createdBy, etc.) to field paths.
	 * Used to customize which fields represent key functionality.
	 */
	map?: Partial<KeystoneListMappings>;
	/**
	 * Plural label for the list (e.g., "Users").
	 * Defaults based on the list key.
	 */
	label?: string;
	/**
	 * Singular label for the list (e.g., "User").
	 * Defaults based on label or list key.
	 */
	singular?: string;
	/**
	 * Plural label for the list (e.g., "Users").
	 * Defaults based on singular form.
	 */
	plural?: string;
	/**
	 * URL path for the list in the Admin UI (e.g., "users").
	 * Defaults based on list key.
	 */
	path?: string;
	/**
	 * Mongoose schema hooks.
	 * Define pre and post hooks for mongoose operations.
	 */
	pre?: {
		/** Hook executed before saving a document */
		save?: (this: T, next: (err?: Error) => void) => void;
	};

	/**
	 * Allow any other custom options.
	 * These will be accessible via list.get()
	 */
	[key: string]: any;
}

/**
 * Constructor interface for KeystoneList.
 * @see /lib/list/list.js - List constructor implementation
 */
export interface KeystoneListConstructor
	extends KeystoneList<KeystoneDocument> {
	/**
	 * Constructor function for creating new KeystoneList instances.
	 *
	 * @template T The document type for type assertion (extends KeystoneDocument)
	 * @param key The unique key/name for the list
	 * @param options Configuration options for the list
	 * @returns A new KeystoneList instance
	 *
	 * @example
	 * ```typescript
	 * // Standard usage (backward compatible)
	 * const Posts = new keystone.List('Post', {
	 *   fields: { title: { type: String } }
	 * });
	 *
	 * // Generic type assertion for typed schema methods
	 * interface PostDoc extends KeystoneDocument {
	 *   title: string;
	 *   slug: string;
	 * }
	 *
	 * const Posts = new keystone.List<PostDoc>('Post', {
	 *   fields: { title: { type: String }, slug: { type: String } }
	 * });
	 *
	 * // Now schema methods have proper 'this' typing
	 * Posts.schema.methods.generateSlug = function() {
	 *   this.slug = this.title.toLowerCase(); // TypeScript knows these properties exist
	 * };
	 * ```
	 */
	new <T extends KeystoneDocument = KeystoneDocument>(
		key: string,
		options?: KeystoneListOptions<T>
	): KeystoneList<T>;

	/**
	 * Function constructor (also supports generic type assertion).
	 * Enables usage without 'new' keyword.
	 * @template T The document type for type assertion (extends KeystoneDocument)
	 * @param key The unique key/name for the list
	 * @param options Configuration options for the list
	 * @returns A new KeystoneList instance
	 */
	<T extends KeystoneDocument = KeystoneDocument>(
		key: string,
		options?: KeystoneListOptions<T>
	): KeystoneList<T>;
}

/**
 * Main Keystone List class.
 * @see /lib/list/list.js - List implementation
 */
export class KeystoneList<T extends KeystoneDocument = KeystoneDocument> {
	/** Reference to the Keystone instance that owns this list. */
	keystone: Keystone;
	/** Configuration options for this list. */
	options: KeystoneListOptions<T>;
	/** The unique key/name for this list. */
	key: string;
	/** The URL path for this list in the Admin UI. */
	path: string;
	/** The Mongoose schema for this list. */
	schema: KeystoneListSchema<T>;
	/** Array of field definitions and UI elements as provided in constructor. */
	schemaFields: Array<string | KeystoneGroupFields | KeystoneGroupHeading>;
	/** Array of processed Admin UI elements for rendering forms. */
	uiElements: KSAdminUIElement[];
	/** Map of underscore methods added to the document prototype. */
	underscoreMethods: Record<string, Function>;
	/** Map of field path to KeystoneField instances. */
	fields: Record<string, KeystoneField>;
	/** Array of all field instances in registration order. */
	fieldsArray: KeystoneField[];
	/** Map of field type names to their properName or true for generic types. */
	fieldTypes: Record<string, string | boolean>;
	/** Array of relationship field instances. */
	relationshipFields: KeystoneField[];
	/** Map of relationship definitions. */
	relationships: Record<
		string,
		{
			ref: string;
			refPath: string;
			path: string;
			list: KeystoneList<any>;
			field: KeystoneField;
		}
	>;
	/** Field path mappings for special list functionality. */
	mappings: KeystoneListMappings;
	/** The Mongoose model for this list. */
	model: mongoose.Model<T>;

	/** Cached array of search fields. @internal */
	_searchFields?: KeystoneField[];
	/** Cached array of default columns. @internal */
	_defaultColumns?: Array<{
		path: string;
		field?: KeystoneField;
		type?: string;
		label?: string;
		options?: any;
	}>;

	// --- Getters ---
	/** Display label for the list (plural form). */
	readonly label: string;
	/** Singular label for the list. */
	readonly singular: string;
	/** Plural label for the list. */
	readonly plural: string;
	/** Path to the field used for document names. */
	readonly namePath: string;
	/** Field instance used for document names. */
	readonly nameField: KeystoneField | undefined;
	/** Whether the name field is virtual. */
	readonly nameIsVirtual: boolean;
	/** Whether the name field should be used as the form header. */
	readonly nameFieldIsFormHeader: boolean;
	/** Whether the name field is shown on the initial form. */
	readonly nameIsInitial: boolean;
	/** Array of fields shown on the create/initial form. */
	readonly initialFields: KeystoneField[];

	// --- Configurable Properties ---
	/** Fields to search by default. */
	searchFields: string | string[];
	/** Default sort order for queries. */
	defaultSort: string;
	/** Default columns to display in list view. */
	defaultColumns: string | string[];

	// --- Methods ---
	/**
	 * Adds filters to a Mongoose query based on the provided filter object.
	 * @param query The Mongoose query to modify.
	 * @param filters Object containing field-specific filter definitions.
	 * @returns The modified query.
	 */
	addFiltersToQuery: (query: any, filters: Record<string, any>) => any;

	/**
	 * Adds search functionality to a Mongoose query.
	 * @param query The Mongoose query to modify.
	 * @param search The search string.
	 * @returns The modified query.
	 */
	addSearchToQuery: (query: any, search: string) => any;

	/**
	 * Automatically maps common field names to list functionality.
	 * @param options Optional mapping configuration.
	 * @returns This list instance for chaining.
	 */
	automap: (options?: Record<string, boolean>) => KeystoneList<T>;

	/**
	 * Returns API-formatted data for an item.
	 * @param item The document to format.
	 * @param select Optional field selection.
	 * @param expandRelationshipFields Whether to expand relationship data.
	 * @returns Formatted API data.
	 */
	apiForGet: (
		item: any,
		select?: string,
		expandRelationshipFields?: boolean
	) => any;

	/**
	 * Expands column definitions from simple strings to detailed objects.
	 * @param cols Column definitions (string or array).
	 * @returns Array of expanded column definitions.
	 */
	expandColumns: (cols: string | string[]) => Array<{
		path: string;
		field?: KeystoneField;
		type?: string;
		label?: string;
		options?: any;
	}>;

	/**
	 * Expands field paths to KeystoneField instances.
	 * @param paths Field paths (string or array).
	 * @returns Array of KeystoneField instances.
	 */
	expandPaths: (paths: string | string[]) => KeystoneField[];

	/**
	 * Converts sort string to Mongoose sort object.
	 * @param sort Sort string (e.g., 'name', '-createdAt').
	 * @returns Mongoose sort object.
	 */
	expandSort: (sort: string) => Record<string, 1 | -1>;

	/**
	 * Gets a configuration option value.
	 * @param key The option key.
	 * @returns The option value.
	 */
	get: (key: keyof KeystoneListOptions | string) => any;

	/**
	 * Sets a configuration option value.
	 * @param key The option key.
	 * @param value The option value.
	 * @returns The updated options object.
	 */
	set: (
		key: keyof KeystoneListOptions | string,
		value: any
	) => KeystoneListOptions;

	/**
	 * Gets the Admin UI URL for this list or a specific document.
	 * @param doc Optional document or document ID.
	 * @returns The Admin UI URL.
	 */
	getAdminURL: (doc?: any | string) => string;

	/**
	 * Generates CSV data for list items.
	 * @param options CSV generation options.
	 * @param user Current user context.
	 * @param callback Receives error and CSV data.
	 */
	getCSVData: (
		options: any,
		user: any,
		callback: (err: any, csvData: string) => void
	) => void;

	/**
	 * Gets formatted data for an item.
	 * @param item The document.
	 * @param fields Optional field selection.
	 * @param expandRelationshipFields Whether to expand relationships.
	 * @returns Formatted data object.
	 */
	getData: (
		item: any,
		fields?: string | string[],
		expandRelationshipFields?: boolean
	) => any;

	/**
	 * Gets the display name for a document.
	 * @param doc The document.
	 * @param escapeHtml Whether to escape HTML in the name.
	 * @returns The display name.
	 */
	getDocumentName: (doc: T, escapeHtml?: boolean) => string;

	/**
	 * Gets options for a specific option set.
	 * @param optionsSet The name of the option set.
	 * @param rest Additional parameters.
	 * @returns The options object.
	 */
	getOptions: (optionsSet: string, rest?: any) => any;

	/**
	 * Calculates pagination information for a query.
	 * @param query The Mongoose query.
	 * @param options Pagination options.
	 * @param callback Receives pagination data.
	 */
	getPages: (
		query: any,
		options: { page?: number | string; perPage?: number; maxPages?: number },
		callback: (
			err: any,
			pages: {
				total: number;
				currentPage: number;
				totalPages: number;
				pages: number[];
				previous: number | false;
				next: number | false;
				first: number;
				last: number;
			}
		) => void
	) => void;

	/**
	 * Converts search string to filter object.
	 * @param search The search string.
	 * @returns Filter object for search.
	 */
	getSearchFilters: (search: string) => Record<string, any>;

	/**
	 * Generates a unique value for a field.
	 * @param path The field path.
	 * @param value The base value.
	 * @param filters Optional additional filters.
	 * @param callback Optional callback function.
	 * @returns Promise resolving to unique value.
	 */
	getUniqueValue: (
		path: string,
		value: string | number,
		filters?: any,
		callback?: (err: any, uniqueValue: string | number) => void
	) => Promise<string | number>;

	/**
	 * Checks if a path is reserved and cannot be used as a field name.
	 * @param path The path to check.
	 * @returns Whether the path is reserved.
	 */
	isReserved: (path: string) => boolean;

	/**
	 * Maps a special list property to a field path.
	 * @param path The property key.
	 * @param mappedPath The field path to map to.
	 */
	map: (path: keyof KeystoneListMappings | string, mappedPath: string) => void;

	/**
	 * Paginates query results.
	 * @param options Pagination and query options.
	 * @param callback Receives paginated results.
	 */
	paginate: (
		options: {
			query?: any;
			page?: number | string;
			perPage?: number;
			maxPages?: number;
			filters?: Record<string, any>;
		},
		callback: (
			err: any,
			results: {
				total: number;
				results: any[];
				currentPage: number;
				totalPages: number;
				pages: number[];
				previous: number | false;
				next: number | false;
				first: number;
				last: number;
			}
		) => void
	) => void;

	/**
	 * Processes filter strings and objects into standardized filter objects.
	 * @param filters Filter input (string or object).
	 * @returns Processed filter object.
	 */
	processFilters: (
		filters: string | Record<string, any>
	) => Record<string, any>;

	/**
	 * Registers the list with Keystone and creates the Mongoose model.
	 * @returns This list instance.
	 */
	register: () => KeystoneList<T>;

	/**
	 * Defines a relationship between this list and another.
	 * @param def Relationship definition.
	 */
	relationship: (def: {
		ref: string;
		refPath: string;
		path: string;
		config?: any;
	}) => void;

	/**
	 * Adds field projections to a Mongoose query.
	 * @param query The Mongoose query.
	 * @param columns Array of column definitions.
	 */
	selectColumns: (
		query: any,
		columns: Array<{ path: string; field?: KeystoneField }>
	) => void;

	/**
	 * Updates an item with provided data.
	 * @param item The document to update.
	 * @param data The update data.
	 * @param options Update options including files and user context.
	 * @param callback Receives error and updated item.
	 */
	updateItem: (
		item: T,
		data: any,
		options: { files?: any; user?: any },
		callback: (err: any, item: T) => void
	) => void;

	/**
	 * Adds an underscore method to the document prototype.
	 * @param path The method name.
	 * @param fn The method implementation.
	 * @returns This list instance.
	 */
	underscoreMethod: (path: string, fn: Function) => KeystoneList<T>;

	/**
	 * Builds MongoDB text search index for this list.
	 * @param callback Optional callback.
	 * @returns Promise if no callback provided.
	 */
	buildSearchTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any> | void;

	/**
	 * Checks if the list declares a text index.
	 * @returns Whether the list has text index configuration.
	 */
	declaresTextIndex: () => boolean;

	/**
	 * Ensures MongoDB text index exists for this list.
	 * @param callback Optional callback.
	 * @returns Promise resolving to index results.
	 */
	ensureTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any>;
}

// Forward declaration for Keystone class to avoid circular dependency
export interface Keystone {}
