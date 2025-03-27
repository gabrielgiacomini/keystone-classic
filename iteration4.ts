// Type definitions for KeystoneJS v4 index.js, lib/core/options.js, lib/list.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: index.js, lib/core/options.js, lib/list.js

import * as express from "express";
import * as mongoose from "mongoose";
import { Hook } from "grappling-hook"; // @todo: Check if @types/grappling-hook exists or define basic type

// --- Dependencies ---
// @todo: Add types for cloudinary if needed: npm install --save-dev @types/cloudinary
// import * as cloudinary from 'cloudinary';
// import * as utils from 'keystone-utils'; // @todo Get/Define types for keystone-utils

/**
 * @todo Define more specific types for imported modules instead of 'any' or Function.
 */
// ... (other module declarations) ...
// declare module './lib/list/add' { function add(...args: any[]): List; export = add; }
// ... etc. for all ./list/* modules ...

// --- Forward Declarations ---
declare class Keystone {
	/* ... */
}
declare class List {
	/* ... */
}
declare class Field {
	/* ... */
} // Base Field definition needed for List

// --- Interfaces ---

/**
 * Basic interface representing a Keystone Field instance within a List.
 * Specific field types might extend this.
 * @todo Refine with common Field properties and methods (e.g., `validateInput`, `updateItem`, `getData`).
 * @see fields/types/Type.js
 */
interface Field {
	path: string;
	type: string; // The field type name (e.g., 'text', 'relationship')
	label: string;
	list: List; // Reference to the parent list
	options: Record<string, any> & {
		initial?: boolean;
		required?: boolean;
		note?: string;
		dependsOn?: Record<string, any>;
		[key: string]: any;
	}; // Field-specific options
	schema: mongoose.Schema.Types.Mixed | any; // @todo Type schema part added by the field
	__options?: Record<string, any>; // Internal storage for original options

	/** If true, the field is shown on the create form */
	initial?: boolean;
	/** If true, the field cannot be edited in the Admin UI */
	noedit?: boolean;
	/** If true, the field is required */
	required?: boolean;
	/** If true, the field does not persist to the database */
	virtual?: boolean;
	/** Help text displayed beneath the field in the Admin UI */
	note?: string;
	/** Visibility dependencies for the Admin UI */
	dependsOn?: Record<string, any>;

	/** Adds the field path to a Mongoose query */
	addToQuery: (query: any, options?: any) => void; // @todo Define query and options type
	/** Formats the field value */
	format: (item: any) => any; // @todo Define item type (Mongoose document)
	/** Validates input data for the field */
	validateInput: (
		data: any,
		callback: (valid: boolean, message?: string) => void
	) => void; // @todo Define data type
	/** Updates the field value on an item */
	updateItem: (item: any, data: any, callback: (err?: Error) => void) => void; // @todo Define item and data types

	[key: string]: any; // Allow for type-specific properties/methods
}

/**
 * Options for configuring a Keystone List.
 * @see lib/list.js
 */
interface ListOptions {
	/** Mongoose schema options */
	schema?: mongoose.SchemaOptions;
	/** Prevent editing items through the Admin UI */
	noedit?: boolean;
	/** Prevent creating items through the Admin UI */
	nocreate?: boolean;
	/** Prevent deleting items through the Admin UI */
	nodelete?: boolean;
	/** ??? */
	autocreate?: boolean; // @todo Clarify purpose if known
	/** Enable drag-and-drop sorting in the Admin UI (adds sortOrder field) */
	sortable?: boolean;
	/** Hide the list from the main Admin UI navigation */
	hidden?: boolean;
	/** Enable automatic tracking fields (createdAt, createdBy, etc.) */
	track?:
		| boolean
		| {
				createdBy?: boolean | string;
				createdAt?: boolean | string;
				updatedBy?: boolean | string;
				updatedAt?: boolean | string;
		  };
	/** Inherit schema and options from another List instance */
	inherits?: List;
	/** Default number of items per page in the Admin UI list view */
	perPage?: number;
	/** Fields to search by default. Can be comma-separated string or array. Supports related paths. */
	searchFields?: string | string[];
	/** Use MongoDB text index for searching (requires defining the index). */
	searchUsesTextIndex?: boolean;
	/** Default sort field/path. Use '-' prefix for descending. Defaults to 'sortOrder' if sortable, otherwise namePath. */
	defaultSort?: string;
	/** Default columns to display in the Admin UI list view. Comma-separated string or array. */
	defaultColumns?: string | string[];
	/** Map special list properties (name, createdBy, etc.) to field paths */
	map?: Partial<ListMappings>;
	/** Plural label for the list (e.g., "Users"). Defaults based on key. */
	label?: string;
	/** Singular label for the list (e.g., "User"). Defaults based on label. */
	singular?: string;
	/** Plural label for the list (e.g., "Users"). Defaults based on singular. */
	plural?: string;
	/** URL path for the list in the Admin UI (e.g., "users"). Defaults based on key. */
	path?: string;

	/** Hook executed before saving a new item */
	pre?: {
		save?: (this: mongoose.Document, next: (err?: Error) => void) => void;
	}; // @todo Add other pre/post hooks

	[key: string]: any; // Allow custom options
}

/**
 * Defines the mapping between special list properties and field paths.
 * @see lib/list.js
 */
interface ListMappings {
	name: string | null;
	createdBy: string | null;
	createdOn: string | null;
	modifiedBy: string | null;
	modifiedOn: string | null;
}

/**
 * Interface defining common KeystoneJS configuration options.
 * Allows arbitrary keys for custom options.
 * @see lib/core/options.js
 */
interface KeystoneOptions {
	name?: string;
	brand?: string;
	"admin path"?: string;
	compress?: boolean;
	headless?: boolean;
	logger?: string | boolean | ((...args: any[]) => void);
	"auto update"?: boolean;
	"model prefix"?: string | null;
	"module root"?: string;
	"frame guard"?: "deny" | "sameorigin" | boolean;
	"cache admin bundles"?: boolean;
	"handle uploads"?: boolean;
	env?: string;
	port?: string | number;
	host?: string;
	listen?: string;
	ssl?: boolean | "only";
	"ssl port"?: string | number;
	"ssl host"?: string;
	"ssl key"?: string;
	"ssl cert"?: string;
	"cookie secret"?: string;
	"cookie signin"?: boolean;
	"embedly api key"?: string;
	"mandrill api key"?: string;
	"mandrill username"?: string;
	"google api key"?: string;
	"google server api key"?: string;
	"ga property"?: string;
	"ga domain"?: string;
	"chartbeat property"?: string;
	"chartbeat domain"?: string;
	"allowed ip ranges"?: string | string[];
	"s3 config"?: Record<string, any> | boolean; // @todo Define S3 config type
	"azurefile config"?: Record<string, any> | boolean; // @todo Define Azure config type
	"cloudinary config"?: Record<string, any> | string | boolean; // @todo Define Cloudinary config type (@types/cloudinary)
	mongoose?: typeof mongoose;
	mongo?: string;
	session?: boolean | Record<string, any>;
	auth?: boolean | List | string; // Auth List instance, key, or boolean
	"user model"?: string;
	app?: express.Express;
	"session store"?: any; // @todo Define session store type
	nav?: Record<string, string | string[]>;
	"pre:static"?: express.RequestHandler | express.RequestHandler[];
	"pre:bodyparser"?: express.RequestHandler | express.RequestHandler[];
	"pre:session"?: express.RequestHandler | express.RequestHandler[];
	"pre:logger"?: express.RequestHandler | express.RequestHandler[];
	"pre:admin"?: express.RequestHandler | express.RequestHandler[];
	"pre:adminroutes"?: express.RequestHandler | express.RequestHandler[];
	"pre:routes"?: express.RequestHandler | express.RequestHandler[];
	"pre:render"?: express.RequestHandler | express.RequestHandler[];
	routes?: (app: express.Application) => void;
	"trust proxy"?: boolean;
	letsencrypt?:
		| boolean
		| {
				email: string;
				domains: string[];
				approveDomains?: boolean | Function;
				server?: string;
		  }; // @todo Refine letsencrypt type
	"signin logo"?: string | [string, number];
	"signin url"?: string;
	"signout url"?: string;
	[key: string]: any;
}

// --- Classes ---

/**
 * Represents a Keystone Data List used to configure a MongoDB collection
 * and manage data within it via the Admin UI and APIs.
 * @see lib/list.js
 */
declare class List {
	/**
	 * Creates a new List instance.
	 * @param key The unique key for the list (e.g., 'User', 'PostCategory'). Used to generate paths and labels.
	 * @param options Configuration options for the list.
	 */
	constructor(key: string, options?: ListOptions);

	/** Reference to the Keystone instance. */
	keystone: Keystone;
	/** Merged configuration options for the list. */
	options: ListOptions;
	/** The unique key for the list. */
	key: string;
	/** URL path for the list in the Admin UI (e.g., 'users'). */
	path: string;
	/** The Mongoose schema associated with this list. */
	schema: mongoose.Schema;
	/** Array of raw field definitions passed to the Mongoose schema. */
	schemaFields: any[]; // @todo Define schema field structure if needed
	/** Ordered array of Admin UI elements (fields, virtuals, headings). */
	uiElements: Array<{
		type: "field" | "virtual" | "heading";
		field?: Field;
		virtual?: any;
		heading?: string;
		options?: any;
	}>; // @todo Refine UI element types
	/** Map of custom methods added to Mongoose documents via `list.underscoreMethod()`. */
	underscoreMethods: Record<string, Function>;
	/** Map of Field instances associated with the list, keyed by path. */
	fields: Record<string, Field>;
	/** Array of Field instances associated with the list. */
	fieldsArray: Field[];
	/** Map of Field Type constructors used in this list. */
	fieldTypes: Record<string, any>; // @todo Use FieldType constructor type when defined
	/** Array of relationship Field instances in this list. */
	relationshipFields: Field[]; // @todo Use RelationshipField[] type when defined
	/** Map of relationship definitions defined on this list. */
	relationships: Record<
		string,
		{ ref: string; refPath: string; path: string; list: List; field: Field }
	>; // @todo Refine RelationshipDefinition type

	/** Field path mapping for special list properties. */
	mappings: ListMappings;

	/** The compiled Mongoose Model for this list. Available after `list.register()`. */
	model: mongoose.Model<any>; // @todo Define Mongoose Document type based on fields

	_searchFields?: Field[]; // Cache for expanded search fields
	_defaultColumns?: Array<{
		path: string;
		field?: Field;
		type?: string;
		label?: string;
		options?: any;
	}>; // Cache for expanded default columns

	// --- Getters ---
	/** The display label for the list (e.g., "Users"). */
	readonly label: string;
	/** The singular display label for the list (e.g., "User"). */
	readonly singular: string;
	/** The plural display label for the list (e.g., "Users"). */
	readonly plural: string;
	/** The path of the field used as the item name (defaults to '_id'). */
	readonly namePath: string;
	/** The Field instance used as the item name. */
	readonly nameField: Field | undefined;
	/** Whether the name field is a virtual. */
	readonly nameIsVirtual: boolean;
	/** Whether the name field type allows it to be used as the Admin UI form header. */
	readonly nameFieldIsFormHeader: boolean;
	/** Whether the name field is not marked as `initial: false`. */
	readonly nameIsInitial: boolean;
	/** Array of fields marked as `initial: true`. */
	readonly initialFields: Field[];

	// --- Getter/Setters ---
	/** Gets or sets the fields used for Admin UI searching. Updates internal cache. */
	searchFields: string | string[];
	/** Gets or sets the default sort path for the Admin UI. */
	defaultSort: string;
	/** Gets or sets the default columns for the Admin UI list view. Updates internal cache. */
	defaultColumns: string | string[];

	// --- Methods ---

	/**
	 * Adds one or more fields or UI headings to the list.
	 * @see lib/list/add.js
	 * @todo Define precise signatures for field definitions and headings.
	 * @example
	 * List.add({ name: { type: Types.Name, required: true, index: true } });
	 * List.add('Content', { content: { type: Types.Html, wysiwyg: true } });
	 */
	add: (...args: any[]) => List; // typeof import('./list/add');

	/**
	 * Adds filters to a Mongoose query based on a filter object.
	 * @see lib/list/addFiltersToQuery.js
	 * @todo Define query and filter types.
	 */
	addFiltersToQuery: (query: any, filters: Record<string, any>) => any; // typeof import('./list/addFiltersToQuery');

	/**
	 * Adds search terms to a Mongoose query.
	 * @see lib/list/addSearchToQuery.js
	 * @todo Define query and search types.
	 */
	addSearchToQuery: (query: any, search: string) => any; // typeof import('./list/addSearchToQuery');

	/**
	 * Automatically maps fields based on common names (name, slug, etc.) if not already mapped.
	 * @see lib/list/automap.js
	 * @param options Optionally specify which fields to map (e.g., { name: true, slug: false }).
	 */
	automap: (options?: Record<string, boolean>) => List; // typeof import('./list/automap');

	/**
	 * Generates the API response structure for a GET request.
	 * @see lib/list/apiForGet.js
	 * @todo Define item and options types.
	 */
	apiForGet: (
		item: any,
		select?: string,
		expandRelationshipFields?: boolean
	) => any; // typeof import('./list/apiForGet');

	/**
	 * Expands a comma-separated string or array of column paths into a structured array for the Admin UI.
	 * @see lib/list/expandColumns.js
	 * @todo Define return type structure.
	 */
	expandColumns: (cols: string | string[]) => Array<{
		path: string;
		field?: Field;
		type?: string;
		label?: string;
		options?: any;
	}>; // typeof import('./list/expandColumns');

	/**
	 * Expands a comma-separated string or array of paths into an array of Field instances.
	 * @see lib/list/expandPaths.js
	 */
	expandPaths: (paths: string | string[]) => Field[]; // typeof import('./list/expandPaths');

	/**
	 * Expands a sort string (e.g., 'name -date') into a Mongoose sort object.
	 * @see lib/list/expandSort.js
	 */
	expandSort: (sort: string) => Record<string, 1 | -1>; // typeof import('./list/expandSort');

	/**
	 * Retrieves a Field instance by its path.
	 * @see lib/list/field.js
	 */
	field: (path: string) => Field | undefined; // typeof import('./list/field');

	/**
	 * Gets a list option value.
	 * @see lib/list/set.js
	 */
	get: (key: keyof ListOptions | string) => any; // typeof import('./list/set');

	/**
	 * Sets a list option value.
	 * @see lib/list/set.js
	 * @returns The updated options object.
	 */
	set: (key: keyof ListOptions | string, value: any) => ListOptions; // typeof import('./list/set');

	/**
	 * Generates the Admin UI URL for the list or a specific item.
	 * @see lib/list/getAdminURL.js
	 * @param doc Optional Mongoose document or ID.
	 */
	getAdminURL: (doc?: any | string) => string; // typeof import('./list/getAdminURL');

	/**
	 * Retrieves data for CSV export.
	 * @see lib/list/getCSVData.js
	 * @todo Define options and user types.
	 */
	getCSVData: (
		options: any,
		user: any,
		callback: (err: any, csvData: string) => void
	) => void; // typeof import('./list/getCSVData');

	/**
	 * Retrieves item data, populating relationship fields if specified.
	 * @see lib/list/getData.js
	 * @todo Define item and options types.
	 */
	getData: (
		item: any,
		fields?: string | string[],
		expandRelationshipFields?: boolean
	) => any; // typeof import('./list/getData');

	/**
	 * Returns the name/identifier of a document. Uses the namePath.
	 * @see lib/list/getDocumentName.js
	 * @param doc The Mongoose document.
	 * @param escapeHtml Whether to HTML-escape the name.
	 */
	getDocumentName: (doc: any, escapeHtml?: boolean) => string; // typeof import('./list/getDocumentName');

	/**
	 * Retrieves list options, filtered by a specific set. (e.g., 'api', 'initial')
	 * @see lib/list/getOptions.js
	 * @todo Define optionsSet type and return structure.
	 */
	getOptions: (optionsSet: string, rest?: any) => any; // typeof import('./list/getOptions');

	/**
	 * Calculates pagination details for a query.
	 * @see lib/list/getPages.js
	 * @todo Define query and options types.
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
	) => void; // typeof import('./list/getPages');

	/**
	 * Builds filter objects for a search query.
	 * @see lib/list/getSearchFilters.js
	 */
	getSearchFilters: (search: string) => Record<string, any>; // typeof import('./list/getSearchFilters');

	/**
	 * Generates a unique value for a field path based on the input value. Appends numbers if needed.
	 * @see lib/list/getUniqueValue.js
	 * @todo Define filters type.
	 */
	getUniqueValue: (
		path: string,
		value: string | number,
		filters?: any,
		callback?: (err: any, uniqueValue: string | number) => void
	) => Promise<string | number>; // typeof import('./list/getUniqueValue');

	/**
	 * Checks if a path is reserved by the list or Mongoose.
	 * @see lib/list/isReserved.js
	 */
	isReserved: (path: string) => boolean; // typeof import('./list/isReserved');

	/**
	 * Maps a special list property (e.g., 'name') to a field path.
	 * @see lib/list/map.js
	 */
	map: (path: keyof ListMappings | string, mappedPath: string) => void; // typeof import('./list/map');

	/**
	 * Paginates a Mongoose query.
	 * @see lib/list/paginate.js
	 * @todo Define options type.
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
	) => void; // typeof import('./list/paginate');

	/**
	 * Processes filter strings or objects into a Mongoose query object.
	 * @see lib/list/processFilters.js
	 * @todo Refine filter types.
	 */
	processFilters: (
		filters: string | Record<string, any>
	) => Record<string, any>; // typeof import('./list/processFilters');

	/**
	 * Registers the list with Keystone, finalizing the schema and compiling the Mongoose model.
	 * Must be called after adding all fields and before starting Keystone.
	 * @see lib/list/register.js
	 */
	register: () => List; // typeof import('./list/register');

	/**
	 * Defines a relationship to another list. Usually called internally by the Relationship field type.
	 * @see lib/list/relationship.js
	 * @todo Refine definition type.
	 */
	relationship: (def: {
		ref: string;
		refPath: string;
		path: string;
		config?: any;
	}) => void; // typeof import('./list/relationship');

	/**
	 * Selects specific columns (fields) for a Mongoose query projection.
	 * @see lib/list/selectColumns.js
	 * @todo Define query and columns types.
	 */
	selectColumns: (
		query: any,
		columns: Array<{ path: string; field?: Field }>
	) => void; // typeof import('./list/selectColumns');

	/**
	 * Updates an item with new data using the UpdateHandler.
	 * @see lib/list/updateItem.js
	 * @todo Define item, data, and options types.
	 */
	updateItem: (
		item: any,
		data: any,
		options: { files?: any; user?: any },
		callback: (err: any, item: any) => void
	) => void; // typeof import('./list/updateItem');

	/**
	 * Adds a method to the underscore methods collection, which are mixed into the Mongoose model prototype.
	 * @see lib/list/underscoreMethod.js
	 */
	underscoreMethod: (path: string, fn: Function) => List; // typeof import('./list/underscoreMethod');

	/**
	 * Builds the MongoDB text index if `searchUsesTextIndex` is true and the index doesn't exist.
	 * @see lib/list/buildSearchTextIndex.js
	 */
	buildSearchTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any> | void; // typeof import('./list/buildSearchTextIndex');

	/**
	 * Checks if the list schema declares a text index.
	 * @see lib/list/declaresTextIndex.js
	 */
	declaresTextIndex: () => boolean; // typeof import('./list/declaresTextIndex');

	/**
	 * Ensures the MongoDB text index exists if `searchUsesTextIndex` is true.
	 * @see lib/list/ensureTextIndex.js
	 */
	ensureTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any>; // typeof import('./list/ensureTextIndex');
}

/**
 * Represents a KeystoneJS v4 application instance.
 * @see index.js
 */
declare class Keystone {
	/** Initializes a new Keystone instance. */
	constructor();

	callHook: Hook["callHook"];
	addHook: Hook["addHook"];

	/** Map of registered List instances by key. */
	lists: Record<string, List>;
	fieldTypes: Record<string, any>; // @todo Replace 'any' with defined FieldType constructor
	paths: Record<string, any>; // @todo Define structure
	_options: KeystoneOptions;
	_redirects: Record<
		string,
		string | { from: string; to: string; status?: number }
	>; // @todo Define structure

	express: typeof express;
	mongoose: typeof mongoose;

	middleware: {
		api: any; // @todo Define specific type
		cors: any; // @todo Define specific type
	};

	app?: express.Express;
	nav?: {
		/* ... @todo Define NavItem type properly ... */
	};

	// --- Options Management ---
	set<K extends keyof KeystoneOptions>(key: K, value: KeystoneOptions[K]): this;
	set(key: string, value: any): this;
	options(options: Partial<KeystoneOptions>): KeystoneOptions;
	options(): KeystoneOptions;
	get<K extends keyof KeystoneOptions>(key: K): KeystoneOptions[K];
	get(key: string): any;
	getPath(
		key: keyof KeystoneOptions | string,
		defaultValue?: string
	): string | undefined;
	expandPath(pathValue: string): string;

	// --- Core Methods ---
	prefixModel: (key: string) => string;
	createItems: any; // @todo Define signature from lib/core/createItems.js
	createRouter: typeof express.Router;
	/** Retrieves lists that haven't been associated with a navigation section. */
	getOrphanedLists: () => List[];
	importer: (moduleRoot: string) => (dirname: string) => Record<string, any>;
	init: any; // @todo Define signature from lib/core/init.js
	initDatabaseConfig: any; // @todo Define signature from lib/core/initDatabaseConfig.js
	initExpressApp: any; // @todo Define signature from lib/core/initExpressApp.js
	initExpressSession: any; // @todo Define signature from lib/core/initExpressSession.js
	initNav: any; // @todo Define signature from lib/core/initNav.js
	/** Retrieves a registered List by its key. */
	list: (key: string) => List | undefined;
	openDatabaseConnection: (
		options?: mongoose.ConnectOptions & { uri?: string },
		callback?: (err?: any) => void
	) => this;
	closeDatabaseConnection: (callback?: (err?: any) => void) => void;
	populateRelated: any; // @todo Define signature from lib/core/populateRelated.js
	redirect: (
		from: string | Record<string, string | number>,
		to?: string,
		status?: number
	) => void;
	start: (
		options?: Record<string, any> | ((err?: any) => void),
		callback?: (err?: any) => void
	) => void; // @todo Refine signature
	wrapHTMLError: any; // @todo Define signature from lib/core/wrapHTMLError.js
	createKeystoneHash: any; // @todo Define signature from lib/core/createKeystoneHash.js

	applyUpdates(callback: (err?: any) => void): void;
	import(dirname: string): Record<string, any>;

	console: { err(type: string, msg: string): void };

	// --- Exposed Modules/Classes ---
	Admin: { Server: any }; // @todo Define Admin.Server type
	Email: any; // @todo Define Email class type
	/** Base class for Keystone Fields. */
	Field: { Types: Record<string, any> /* @todo Define FieldTypes map */ } & any; // @todo Define Field base class type
	Keystone: typeof Keystone;
	/** The Keystone List class constructor. */
	List: typeof List;
	Storage: any; // @todo Define Storage class type
	View: any; // @todo Define View class type
	content: any; // @todo Define content module type
	security: { csrf: any }; // @todo Define csrf module type
	utils: any; // @todo Define keystone-utils type
	session: any; // @todo Define session module type
	version: string;

	// Deprecated
	/** @deprecated Use `keystone.set('routes', fn)` instead. */
	routes: () => never;
}

/** The singleton Keystone instance. */
declare const keystone: Keystone;
export = keystone;

/*
Usage Instructions:

1.  **Installation:** (Ensure you have these)
    ```bash
    npm install --save-dev @types/express @types/mongoose @types/node @types/lodash
    # or
    yarn add --dev @types/express @types/mongoose @types/node @types/lodash
    ```

2.  **Import and Define Lists:**
    ```typescript
    import * as keystone from 'keystone';
    import * as mongoose from 'mongoose'; // Often needed for Schema options/hooks
    import { Types } from 'keystone'; // Assuming Field.Types is typed eventually

    // Basic List Definition
    const User = new keystone.List('User', {
        // List options
        map: { name: 'name' }, // Map the 'name' field for display
        singular: 'User',
        plural: 'Users',
        autokey: { path: 'slug', from: 'name', unique: true }, // Requires autokey plugin definition
        sortable: true,
    });

    // Add Fields (example using placeholder Types)
    User.add({
        name: { type: Types.Name, required: true, index: true },
        email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
        password: { type: Types.Password, initial: true, required: true },
    }, 'Permissions', { // Add a heading
        isAdmin: { type: Types.Boolean, label: 'Can access Keystone', index: true },
    });

    // Define default columns for Admin UI
    User.defaultColumns = 'name, email, isAdmin';

    // Register the list
    User.register();

    // Access list properties/methods
    console.log(`Registered list: ${User.label} (${User.path})`);
    const nameField = User.field('name');
    if (nameField) {
        console.log(`Name field label: ${nameField.label}`);
    }

    // Configure Keystone
    keystone.set('user model', 'User');
    // ... other keystone.set calls ...

    keystone.start();
    ```

3.  **Typing Issues & TODOs:**
    - The `Field` interface is basic; it needs refinement based on `fields/types/Type.js`.
    - The `Types` import in the example assumes `keystone.Field.Types` will be properly typed later.
    - Signatures for methods like `add`, `addFiltersToQuery`, `paginate`, etc., are still placeholders (`any` or basic functions) and need definition based on their respective files in `lib/list/`.
    - The Mongoose `Document` type for `List.model` should ideally be generated based on the added fields for full type safety, which is complex.
    - Plugin effects (like `autokey`, `track`) are not explicitly typed on the options/list instance yet.
*/
