// Type definitions for KeystoneJS v4 index.js, lib/core/options.js, lib/list.js, lib/list/add.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: index.js, lib/core/options.js, lib/list.js, lib/list/add.js

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
// declare module './lib/list/addFiltersToQuery' { function addFiltersToQuery(...): any; export = addFiltersToQuery; }
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
// declare class FieldType { constructor(list: List, path: string, options: FieldOptions); /* ... */ } // @todo Define FieldType base class from fields/types/Type.js

// --- Interfaces & Types ---

/**
 * Options object used to define a field within a List.
 * Passed as values in the object argument to `list.add()`.
 * @see lib/list/add.js
 */
interface FieldOptions {
	/**
	 * The field type constructor (e.g., Keystone.Field.Types.Text).
	 * @todo Replace `any` with a FieldType constructor type.
	 */
	type: any; // FieldType;
	/** Display label for the field in the Admin UI. Defaults based on path. */
	label?: string;
	/** Show this field on the create form. Defaults to false unless required. */
	initial?: boolean;
	/** Field must have a value. */
	required?: boolean;
	/** Create a MongoDB index for this field. */
	index?: boolean;
	/** Field value must be unique. */
	unique?: boolean;
	/** Help text displayed beneath the field in the Admin UI. */
	note?: string;
	/** Control field visibility in the Admin UI based on other field values. */
	dependsOn?: Record<string, any>;
	/** Prevent editing the field in the Admin UI. */
	noedit?: boolean;
	/** If true, the field does not persist to the database. */
	virtual?: boolean;
	/** Default value for the field. */
	default?: any;
	/** Mongoose schema options for this field path. */
	schema?: Record<string, any>;

	// Allow field-type specific options
	[key: string]: any;
}

/**
 * Represents an object defining one or more fields, potentially nested.
 * Used as an argument type for `list.add()`.
 * @see lib/list/add.js
 */
type FieldDefinition = Record<
	string,
	FieldOptions | /* FieldType */ any | FieldDefinition
>;

/**
 * Represents an object defining a heading in the Admin UI form.
 * Used as an argument type for `list.add()`.
 * @see lib/list/add.js
 */
interface HeadingDefinition {
	/** The text of the heading. */
	heading: string;
	/** Control heading visibility in the Admin UI based on other field values. */
	dependsOn?: Record<string, any>;
	// Allow other custom options if needed
	[key: string]: any;
}

/** Basic interface representing a Keystone Field instance within a List. */
interface Field {
	/* ... (definition remains the same as before) ... */
}

// --- UI Element Types ---

interface FieldUIElement {
	type: "field";
	field: Field;
}

interface HeadingUIElement {
	type: "heading";
	heading: string;
	options: HeadingDefinition | Record<string, any>; // Keep options flexible
}

interface IndentUIElement {
	type: "indent";
}

interface OutdentUIElement {
	type: "outdent";
}

/** Represents an element in the Admin UI form structure. */
type UIElement =
	| FieldUIElement
	| HeadingUIElement
	| IndentUIElement
	| OutdentUIElement;

/** Options for configuring a Keystone List. */
interface ListOptions {
	/* ... (definition remains the same as before) ... */
}

/** Defines the mapping between special list properties and field paths. */
interface ListMappings {
	/* ... (definition remains the same as before) ... */
}

/** Interface defining common KeystoneJS configuration options. */
interface KeystoneOptions {
	/* ... (definition remains the same as before) ... */
}

// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
	/** Creates a new List instance. */
	constructor(key: string, options?: ListOptions);

	keystone: Keystone;
	options: ListOptions;
	key: string;
	path: string;
	schema: mongoose.Schema;
	/** Array of raw definitions passed to `list.add()`. */
	schemaFields: Array<string | FieldDefinition | HeadingDefinition>;
	/** Ordered array of Admin UI elements (fields, virtuals, headings). */
	uiElements: UIElement[];
	underscoreMethods: Record<string, Function>;
	fields: Record<string, Field>;
	fieldsArray: Field[];
	fieldTypes: Record<string, any>; // @todo Use FieldType constructor type
	relationshipFields: Field[]; // @todo Use RelationshipField[] type
	relationships: Record<
		string,
		{ ref: string; refPath: string; path: string; list: List; field: Field }
	>; // @todo Refine RelationshipDefinition

	mappings: ListMappings;
	model: mongoose.Model<any>; // @todo Define Mongoose Document type

	_searchFields?: Field[];
	_defaultColumns?: Array<{
		path: string;
		field?: Field;
		type?: string;
		label?: string;
		options?: any;
	}>;

	// --- Getters ---
	readonly label: string;
	readonly singular: string;
	readonly plural: string;
	readonly namePath: string;
	readonly nameField: Field | undefined;
	readonly nameIsVirtual: boolean;
	readonly nameFieldIsFormHeader: boolean;
	readonly nameIsInitial: boolean;
	readonly initialFields: Field[];

	// --- Getter/Setters ---
	searchFields: string | string[];
	defaultSort: string;
	defaultColumns: string | string[];

	// --- Methods ---

	/**
	 * Adds one or more fields, headings, or UI structure elements to the list.
	 * Arguments can be:
	 * - A string: Treated as a heading label.
	 * - '>>>': Indents subsequent fields in the Admin UI form.
	 * - '<<<': Outdents subsequent fields in the Admin UI form.
	 * - An object with a `heading` property: Defines a heading with options.
	 * - An object defining fields: Keys are field paths, values are field options (including `type`). Supports nested paths.
	 *
	 * @param defs One or more definitions to add.
	 * @returns The List instance, for chaining.
	 * @see lib/list/add.js
	 * @example
	 * User.add(
	 * { name: { type: Types.Name, required: true, index: true } },
	 * 'Details', // Simple heading
	 * { heading: 'Contact Info', dependsOn: { isContactable: true } }, // Heading with options
	 * { email: { type: Types.Email, initial: true, required: true } },
	 * '>>>', // Indent
	 * { phone: { type: Types.Text } },
	 * '<<<', // Outdent
	 * { address: { // Nested structure (Mixed type by default unless specified)
	 * street1: { type: Types.Text },
	 * suburb: { type: Types.Text }
	 * }}
	 * );
	 */
	add(...defs: Array<string | FieldDefinition | HeadingDefinition>): List;

	addFiltersToQuery: (query: any, filters: Record<string, any>) => any; // @todo Define signature from lib/list/addFiltersToQuery.js
	addSearchToQuery: (query: any, search: string) => any; // @todo Define signature from lib/list/addSearchToQuery.js
	automap: (options?: Record<string, boolean>) => List; // @todo Define signature from lib/list/automap.js
	apiForGet: (
		item: any,
		select?: string,
		expandRelationshipFields?: boolean
	) => any; // @todo Define signature from lib/list/apiForGet.js
	expandColumns: (
		cols: string | string[]
	) => Array<{
		path: string;
		field?: Field;
		type?: string;
		label?: string;
		options?: any;
	}>; // @todo Define signature from lib/list/expandColumns.js
	expandPaths: (paths: string | string[]) => Field[]; // @todo Define signature from lib/list/expandPaths.js
	expandSort: (sort: string) => Record<string, 1 | -1>; // @todo Define signature from lib/list/expandSort.js
	/** Retrieves a Field instance by its path. */
	field: (path: string, options?: FieldOptions) => Field | undefined; // Signature slightly adjusted based on add.js usage @todo Define signature from lib/list/field.js
	get: (key: keyof ListOptions | string) => any; // @todo Define signature from lib/list/set.js
	set: (key: keyof ListOptions | string, value: any) => ListOptions; // @todo Define signature from lib/list/set.js
	getAdminURL: (doc?: any | string) => string; // @todo Define signature from lib/list/getAdminURL.js
	getCSVData: (
		options: any,
		user: any,
		callback: (err: any, csvData: string) => void
	) => void; // @todo Define signature from lib/list/getCSVData.js
	getData: (
		item: any,
		fields?: string | string[],
		expandRelationshipFields?: boolean
	) => any; // @todo Define signature from lib/list/getData.js
	getDocumentName: (doc: any, escapeHtml?: boolean) => string; // @todo Define signature from lib/list/getDocumentName.js
	getOptions: (optionsSet: string, rest?: any) => any; // @todo Define signature from lib/list/getOptions.js
	getPages: (
		query: any,
		options: {
			/*...*/
		},
		callback: (
			err: any,
			pages: {
				/*...*/
			}
		) => void
	) => void; // @todo Define signature from lib/list/getPages.js
	getSearchFilters: (search: string) => Record<string, any>; // @todo Define signature from lib/list/getSearchFilters.js
	getUniqueValue: (
		path: string,
		value: string | number,
		filters?: any,
		callback?: (err: any, uniqueValue: string | number) => void
	) => Promise<string | number>; // @todo Define signature from lib/list/getUniqueValue.js
	/** Checks if a path is reserved by the list or Mongoose. */
	isReserved: (path: string) => boolean; // @todo Define signature from lib/list/isReserved.js
	map: (path: keyof ListMappings | string, mappedPath: string) => void; // @todo Define signature from lib/list/map.js
	paginate: (
		options: {
			/*...*/
		},
		callback: (
			err: any,
			results: {
				/*...*/
			}
		) => void
	) => void; // @todo Define signature from lib/list/paginate.js
	processFilters: (
		filters: string | Record<string, any>
	) => Record<string, any>; // @todo Define signature from lib/list/processFilters.js
	/** Registers the list with Keystone. */
	register: () => List; // @todo Define signature from lib/list/register.js
	relationship: (def: {
		ref: string;
		refPath: string;
		path: string;
		config?: any;
	}) => void; // @todo Define signature from lib/list/relationship.js
	selectColumns: (
		query: any,
		columns: Array<{ path: string; field?: Field }>
	) => void; // @todo Define signature from lib/list/selectColumns.js
	updateItem: (
		item: any,
		data: any,
		options: { files?: any; user?: any },
		callback: (err: any, item: any) => void
	) => void; // @todo Define signature from lib/list/updateItem.js
	underscoreMethod: (path: string, fn: Function) => List; // @todo Define signature from lib/list/underscoreMethod.js
	buildSearchTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any> | void; // @todo Define signature from lib/list/buildSearchTextIndex.js
	declaresTextIndex: () => boolean; // @todo Define signature from lib/list/declaresTextIndex.js
	ensureTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any>; // @todo Define signature from lib/list/ensureTextIndex.js
}

/** Represents a KeystoneJS v4 application instance. */
declare class Keystone {
	/* ... (Keystone definition remains the same, referencing the updated List type) ... */

	/** Base class for Keystone Fields. */
	Field: {
		/** Map of available Field Type constructors. */
		Types: Record<string, any>; // @todo Define FieldTypes map with specific Type constructors
	} & any; // @todo Define Field base class type from fields/types/Type.js

	/** The Keystone List class constructor. */
	List: typeof List;

	/* ... */
}

/** The singleton Keystone instance. */
declare const keystone: Keystone;
export = keystone;

/*
Usage Instructions: (Remain largely the same, example in `List.add` updated)

1.  **Installation:** (Ensure you have these)
    ```bash
    npm install --save-dev @types/express @types/mongoose @types/node @types/lodash
    ```

2.  **Import and Define Lists:**
    ```typescript
    import * as keystone from 'keystone';
    import { Types } from 'keystone'; // Placeholder for actual Field Types

    const Post = new keystone.List('Post', {
        map: { name: 'title' },
        autokey: { path: 'slug', from: 'title', unique: true },
    });

    Post.add(
        { title: { type: Types.Text, required: true } },
        'Content', // Heading
        { content: { type: Types.Html, wysiwyg: true, height: 400 } },
        'Meta',    // Another heading
        { categories: { type: Types.Relationship, ref: 'PostCategory', many: true } },
        '>>>',     // Indent
        { publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } } },
        '<<<',     // Outdent
        { state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true } }
    );

    Post.defaultColumns = 'title, state|20%, categories|20%, publishedDate|20%';
    Post.register();
    ```

3.  **Typing Issues & TODOs:**
    - The `FieldOptions.type` still uses `any`. This is the most critical part to refine once `fields/types/Type.js` and specific field type files are processed.
    - Signatures for most methods on `List` are still placeholders needing definition from their specific files (e.g., `lib/list/field.js`, `lib/list/register.js`).
    - The `Field` interface itself is still basic.
*/
