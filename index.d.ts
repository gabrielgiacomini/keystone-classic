// Type definitions for KeystoneJS v4
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/gabrielgiacomini>
// Based on the code in: index.js, lib/core/options.js, lib/list.js, lib/list/add.js, lib/list/field.js,
// fields/types/Type.js, fields/types/text/TextType.js, fields/types/number/NumberType.js,
// fields/types/textarea/TextareaType.js, fields/types/boolean/BooleanType.js, fields/types/select/SelectType.js,
// fields/types/datetime/DateTimeType.js, fields/types/date/DateType.js, fields/types/html/HtmlType.js

import * as express from "express";
import * as mongoose from "mongoose";
import * as moment from "moment"; // Requires @types/moment
import { Hook } from "grappling-hook"; // @todo: Check if @types/grappling-hook exists or define basic type
import * as numeral from "numeral"; // @todo: Needs @types/numeral

/**
 * Represents the constructor for a Keystone Field Type (e.g., `Types.Text`).
 * @see ./fields/types/Type.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/Type.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/Type.js}
 */
export interface KeystoneFieldTypeConstructor {
	/** Creates an instance of the field type. */
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneFieldOptions
	): KeystoneField;
	/** The prototype holds methods shared by field instances of this type. */
	prototype: KeystoneField;
	/** Canonical name of the field type (e.g., 'Text', 'Relationship'). Used internally. */
	properName?: string;
	/** Technical name (often JS class name, e.g., 'TextType'). Used for `list.fieldTypes`. */
	name?: string; // JS constructor name
}

/**
 * Options object used to define a field within a List.
 * @see ./fields/types/Type.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/Type.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/Type.js}
 */
export interface KeystoneFieldOptions {
	/**
	 * The field type constructor (e.g., `keystone.Field.Types.Text`)
	 * or a native JS constructor (`String`, `Number`, `Boolean`, `Date`)
	 * which will be mapped to a default Keystone type.
	 */
	type:
		| KeystoneFieldTypeConstructor
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| DateConstructor;
	/**
	 * Display label for the field in the Admin UI.
	 * Defaults to a formatted version of the field path if not provided.
	 */
	label?: string;
	/**
	 * Custom description for the field type (optional).
	 * Displayed in the Admin UI in certain contexts.
	 */
	typeDescription?: string;
	/**
	 * Show this field on the create form.
	 * Required fields are set to initial by default.
	 */
	initial?: boolean;
	/**
	 * Field must have a value. Can be a boolean or a function for conditional requirement.
	 * When using a function, `this` context is the Mongoose document.
	 */
	required?: boolean | ((this: any) => boolean);
	/**
	 * Create a MongoDB index for this field.
	 * Improves query performance on this field.
	 */
	index?: boolean;
	/**
	 * Field value must be unique across all documents in the collection.
	 * Creates a MongoDB unique index.
	 */
	unique?: boolean;
	/**
	 * Help text (markdown) displayed beneath the field in the Admin UI.
	 * Also sourced from `list.get('notes')[path]` if not provided.
	 */
	note?: string;
	/**
	 * Control field visibility in the Admin UI based on other field values.
	 * Example: `{ status: 'published' }` - only show when status is 'published'
	 */
	dependsOn?: Record<string, any>;
	/**
	 * Prevent editing the field in the Admin UI.
	 * The field will be displayed but not editable.
	 */
	noedit?: boolean;
	/**
	 * If true, the field does not persist to the database.
	 * Useful for computed fields.
	 */
	virtual?: boolean;
	/**
	 * Default value for the field.
	 * Applied when creating new documents if no value is provided.
	 */
	default?: any;
	/**
	 * Mongoose schema options for this field path.
	 * Passed directly to the Mongoose schema.
	 */
	schema?: Record<string, any>;
	/**
	 * Deprecated: Use `size` instead.
	 * Width of the field in the Admin UI form.
	 */
	width?: "small" | "medium" | "large" | "full";
	/**
	 * Width of the field in the Admin UI form.
	 * Controls the horizontal space the field occupies.
	 */
	size?: "small" | "medium" | "large" | "full";
	/**
	 * Watch other fields and update this field's value based on changes.
	 * Can be boolean, field name, array of field names, or a condition object.
	 */
	watch?:
		| boolean
		| string
		| string[]
		| Record<string, any>
		| ((item: any) => boolean);
	/**
	 * Function to generate the value for watched fields.
	 * `this` context is the Mongoose document.
	 */
	value?: (this: any, callback: (err: any, value: any) => void) => void;
	/**
	 * Mongoose schema column definition (rarely used directly).
	 * Only required if you need to define a custom schema type.
	 */
	col?: any; // @todo Define col type if possible
	/**
	 * Exclude from Admin UI list view columns.
	 * Field won't appear in the default column list.
	 */
	nocol?: boolean;
	/**
	 * Disable sorting by this field in the Admin UI list view.
	 * Field won't be sortable in list view.
	 */
	nosort?: boolean;
	/**
	 * Indent the field in the Admin UI form.
	 * Provides visual grouping.
	 */
	indent?: boolean;
	/**
	 * Collapse the field in the Admin UI form by default.
	 * User must expand to see the field.
	 */
	collapse?: boolean;
	/**
	 * Hide the field from the Admin UI entirely.
	 * Field won't be visible in either form or list views.
	 */
	hidden?: boolean;
	/**
	 * Auto cleanup settings (e.g., for relationship fields).
	 * Controls what happens when referenced documents are deleted.
	 */
	autoCleanup?: boolean; // @todo Check usage
	/**
	 * Thumbnail option (likely for file/image fields).
	 * Enables thumbnail rendering in list view for image fields.
	 */
	thumb?: boolean; // @todo Check usage

	// Allow field-type specific options
	[key: string]: any;
}

/**
 * Represents an object defining one or more fields, potentially nested.
 * @see ./fields/types/Type.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/Type.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/Type.js}
 */
export type KeystoneFieldDefinition = {
	[key: string]:
		| KeystoneFieldOptions
		| KeystoneFieldTypeConstructor
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| DateConstructor
		| KeystoneFieldDefinition;
};

/**
 * Represents an object defining a heading in the Admin UI form.
 * @see ./fields/types/Type.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/Type.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/Type.js}
 */
export interface KeystoneHeadingDefinition {
	/** The text of the heading. */
	heading: string;
	/** Control heading visibility in the Admin UI based on other field values. */
	dependsOn?: Record<string, any>;
	[key: string]: any;
}

/**
 * Base interface representing a Keystone Field instance within a List.
 * @see ./fields/types/Type.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/Type.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/Type.js}
 */
export interface KeystoneField {
	/** Reference to the parent List instance. */
	list: KeystoneList;
	/** The field's path (e.g., 'name', 'address.street'). */
	path: string;
	/** Internal Path object for handling nested paths. @internal @todo Define Path */
	_path: any;
	/** The field type name (e.g., 'text', 'relationship'). Set by the Field Type constructor. */
	type: string;
	/** The final, merged options for this field instance. */
	options: KeystoneFieldOptions; // Should be overridden by specific field option types
	/** Display label for the field. */
	label: string;
	/** Description of the field type (e.g., 'Text', 'Boolean'). */
	typeDescription: string;
	/** Default options specific to the field type. @internal */
	defaults?: Partial<KeystoneFieldOptions>;
	/** The Mongoose schema definition for this field. */
	schema: mongoose.SchemaDefinition[keyof mongoose.SchemaDefinition];

	// Internal properties used by base class or inherited by subclasses
	/**
	 * Properties specific to the field type, used for generating Admin UI options.
	 * Defined by subclasses. @internal
	 */
	_properties?: string[];
	/**
	 * Fixed size for the field type (overrides options).
	 * Defined by subclasses. @internal
	 */
	_fixedSize?: "small" | "medium" | "large" | "full";
	/**
	 * Default size for the field type if not specified.
	 * Defined by subclasses. @internal
	 */
	_defaultSize?: "small" | "medium" | "large" | "full";
	/**
	 * The underlying Mongoose type constructor (e.g., String, Number, mongoose.Schema.Types.ObjectId).
	 * Defined by subclasses. @internal
	 */
	_nativeType?: any; // Mongoose type constructor
	/**
	 * Underscore methods to bind to the document prototype.
	 * Defined by subclasses. @internal
	 */
	_underscoreMethods?: Array<string | { fn: string; as: string }>;
	/**
	 * Cached options object for the Admin UI.
	 * @internal
	 */
	__options?: Record<string, any> & {
		hasFilterMethod?: boolean;
		defaultValue?: any;
	};
	/**
	 * Cached size value.
	 * @internal
	 */
	__size?: "small" | "medium" | "large" | "full";

	// --- Getters ---
	/** Calculated size of the field ('small', 'medium', 'large', 'full'). */
	readonly size: "small" | "medium" | "large" | "full";
	/** Whether the field is shown on the creation form. */
	readonly initial: boolean;
	/** Whether the field is required. Can be a boolean or a function. */
	readonly required: boolean | ((this: any) => boolean);
	/** The field's help note (HTML). */
	readonly note: string; // HTML note
	/** Mongoose schema column definition. */
	readonly col: any; // @todo Define col type
	/** Whether the field is editable in the Admin UI. */
	readonly noedit: boolean;
	/** Whether the field is excluded from Admin UI columns. */
	readonly nocol: boolean;
	/** Whether the field is sortable in the Admin UI. */
	readonly nosort: boolean;
	/** Whether the field is collapsed by default in the Admin UI. */
	readonly collapse: boolean;
	/** Whether the field is hidden in the Admin UI. */
	readonly hidden: boolean;
	/** The field's visibility dependencies. */
	readonly dependsOn: Record<string, any> | false;

	// --- Core Methods ---
	/**
	 * Returns the options object used by the Admin UI React components.
	 * @returns {Record<string, any>} Options object for the Admin UI.
	 */
	getOptions(): Record<string, any>;

	/**
	 * Calculates the size of the field.
	 * @returns {'small' | 'medium' | 'large' | 'full'} Field size.
	 * @internal Should use the `size` getter externally.
	 */
	getSize(): "small" | "medium" | "large" | "full";

	/**
	 * Gets the default value for the field.
	 * @returns {any} Default value for the field.
	 */
	getDefaultValue(): any;

	/**
	 * Gets the field's data from a Mongoose document.
	 * @param item The Mongoose document.
	 * @returns {any} Field value.
	 */
	getData(item: any): any;

	/**
	 * Generates the Mongoose pre-save hook function for watched fields.
	 * @returns {Function} Mongoose pre-save middleware.
	 * @internal Used by the Field constructor.
	 */
	getPreSaveWatcher(): (next: (err?: Error) => void) => void;

	/**
	 * Adds the field to the List's Mongoose Schema.
	 * Typically overridden by specific field types.
	 * @param schema The Mongoose schema.
	 */
	addToSchema(schema: mongoose.Schema): void;

	/**
	 * Binds underscore methods (from `_underscoreMethods` and `updateItem`) to the list's schema.
	 * @internal Called by `addToSchema`.
	 */
	bindUnderscoreMethods(): void;

	/**
	 * Helper to register an underscore method on the list, prefixed with the field path.
	 * @param path The method name (without field path prefix).
	 * @param fn The method implementation. `this` context is the Mongoose document.
	 * @internal
	 */
	underscoreMethod(path: string, fn: (this: any, ...args: any[]) => any): void;

	/**
	 * Formats the field's value for display.
	 * Often overridden by specific field types.
	 * @param item The Mongoose document.
	 * @returns {string | any} Formatted value.
	 */
	format(item: any): any; // Often overridden

	/**
	 * Detects whether the field has been modified in an item.
	 * @param item The Mongoose document.
	 * @returns {boolean} True if modified.
	 */
	isModified(item: any): boolean; // Often overridden

	/**
	 * Asynchronously validates provided input data for the field.
	 * Often overridden by specific field types.
	 * @param data The input data object.
	 * @param callback Receives `(isValid: boolean, message?: string)`.
	 */
	validateInput(
		data: any,
		callback: (valid: boolean, message?: string) => void
	): void; // Often overridden

	/**
	 * Asynchronously validates that required input has been provided for the field.
	 * Takes into account existing data in the item.
	 * Often overridden by specific field types.
	 * @param item The Mongoose document (for checking existing data).
	 * @param data The input data object.
	 * @param callback Receives `(isValid: boolean, message?: string)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean, message?: string) => void
	): void; // Often overridden

	/**
	 * (Deprecated) Synchronously checks if input data for the field is valid.
	 * Prefer the async `validateInput` and `validateRequiredInput` methods.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 * @param data Input data.
	 * @param required Is input required?
	 * @param item Optional Mongoose document for context.
	 * @returns {boolean} Validity state.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean; // Often overridden

	/**
	 * Updates the field's value in an item based on input data.
	 * Often overridden by specific field types.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void; // Often overridden

	/**
	 * Retrieves the field's value from a data object, handling nested paths.
	 * @param data The data object.
	 * @param subpath Optional subpath within the field.
	 * @returns {any} The value.
	 */
	getValueFromData(data: any, subpath?: string): any;

	/**
	 * Adds the field path to a Mongoose query projection.
	 * Used by `List.selectColumns`. Can be overridden.
	 * @param query The Mongoose query.
	 * @param options Options for selection.
	 */
	select?: (query: any, options?: any) => void; // Optional base, implemented by some types

	/**
	 * Adds population options to a Mongoose query for this field (e.g., for Relationships).
	 * Can be overridden.
	 * @param query The Mongoose query.
	 * @param options Population options.
	 */
	populate?: (query: any, options?: any) => void; // Optional base, implemented by some types

	/**
	 * Adds filters to a Mongoose query based on this field. Implemented by fields supporting filtering.
	 * @param query The Mongoose query.
	 * @param filter Filter oAdminUiFieldReactptions specific to the field type.
	 */
	addFilterToQuery?: (query: any, filter: any) => void; // Optional base, implemented by some types

	// Allow for type-specific properties/methods from subclasses
	[key: string]: any;
}

/**
 * Represents an element in the Admin UI form structure.
 * @see ./fields/types/Field.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/Field.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/Field.js}
 */

export interface KeystoneFieldUIElement {
	type: "field";
	field: KeystoneField;
}
export interface KeystoneHeadingUIElement {
	type: "heading";
	heading: string;
	options: KeystoneHeadingDefinition | Record<string, any>;
}
export interface KeystoneIndentUIElement {
	type: "indent";
}
export interface KeystoneOutdentUIElement {
	type: "outdent";
}
export type KeystoneUIElement =
	| KeystoneFieldUIElement
	| KeystoneHeadingUIElement
	| KeystoneIndentUIElement
	| KeystoneOutdentUIElement;

/**
 * Options for configuring a Keystone List.
 * @see ./lib/list.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list.js}
 */
export interface KeystoneListOptions {
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
	inherits?: KeystoneList;
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
		save?: (this: mongoose.Document, next: (err?: Error) => void) => void;
	}; // @todo Add other pre/post hooks

	/**
	 * Allow any other custom options.
	 * These will be accessible via list.get()
	 */
	[key: string]: any;
}

/**
 * Defines the mapping between special list properties and field paths.
 * @see ./lib/list.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list.js}
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

// --- Specific Field Type Interfaces ---

// Text
/**
 * Filter oAdminUiFieldReactptions for Text field queries.
 * @see ./fields/types/text/TextType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/text/TextType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/text/TextType.js}
 */
export interface KeystoneAdminUiTextFieldReactFilter {
	/**
	 * Filter mAdminUFieldReactiode. Defaults to 'contains' if omitted.
	 * - 'exactly': Exact string match
	 * - 'beginsWith': String starts with value
	 * - 'endsWith': String ends with value
	 * - 'contains': String contains value (default)
	 */
	mode?: "exactly" | "beginsWith" | "endsWith" | string;
	/** The string value to filter by. */
	value?: string;
	/**
	 * Perform a case-sensitive match.
	 * Default: false (case-insensitive)
	 */
	caseSensitive?: boolean;
	/**
	 * Invert the filter logic (e.g., NOT exactly, NOT beginsWith).
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Options specific to Text fields.
 * @see ./fields/types/text/TextType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/text/TextType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/text/TextType.js}
 */
export interface KeystoneTextFieldOptions extends KeystoneFieldOptions {
	/** Minimum length allowed. Validates on save. */
	min?: number;
	/** Maximum length allowed. Validates on save. */
	max?: number;
	/** Render input using a monospace font in Admin UI. */
	monospace?: boolean;
	/** Ensure type is specifically Text or String. */
	type: KeystoneTextTypeConstructor | StringConstructor;
}

/**
 * Interface for Text field instances.
 * @see ./fields/types/text/TextType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/text/TextType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/text/TextType.js}
 */
export interface KeystoneTextField extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Properties exposed to Admin UI (includes 'monospace'). */
	_properties: string[];
	/** Underscore methods added to documents (includes 'crop'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: KeystoneTextFieldOptions;

	/**
	 * Validates input string length based on min/max options.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required text input. Checks for non-empty strings.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds text-specific filtering logic to a Mongoose query.
	 * Supports 'exactly', 'beginsWith', 'endsWith', 'contains' (default) modes,
	 * case sensitivity, and inversion.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiTextFieldReactFilter
	): Record<string, any>;

	/**
	 * Crops the field's string value from an item to the specified length.
	 * Exposed as `item._.fieldPath.crop(...)`.
	 * @param item The Mongoose document.
	 * @param length The target length.
	 * @param append String to append if cropped (defaults to '...').
	 * @param preserveWords If true, doesn't cut words in half.
	 * @returns The cropped string.
	 */
	crop(
		item: any,
		length: number,
		append?: string,
		preserveWords?: boolean
	): string;
}

/**
 * Constructor for Text field type.
 * @see ./fields/types/text/TextType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/text/TextType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/text/TextType.js}
 */
export interface KeystoneTextTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneTextFieldOptions
	): KeystoneTextField;
	prototype: KeystoneTextField;
	properName: "Text";
}

// Number
/**
 * Filter oAdminUiFieldReactptions for Number field queries.
 * @see ./fields/types/number/NumberType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/number/NumberType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/number/NumberType.js}
 */
export interface KeystoneAdminUiNumberFieldReactFilter {
	/**
	 * Filter mAdminUFieldReactiode.
	 * - 'equals': Matches exact value or empty/null if value is empty.
	 * - 'between': Matches values within the range specified in `value.min` and `value.max`.
	 * - 'gt': Matches values greater than `value`.
	 * - 'lt': Matches values less than `value`.
	 * Default: 'equals'
	 */
	mode?: "equals" | "between" | "gt" | "lt" | string;
	/**
	 * The value(s) to filter by.
	 * - For 'equals', 'gt', 'lt': A single number or string convertible to a number.
	 * - For 'between': An object `{ min?: number | string, max?: number | string }`.
	 * - For 'equals' mode with an empty value: Matches empty/null values.
	 */
	value?: number | string | { min?: number | string; max?: number | string };
	/**
	 * Invert the filter logic (`$ne` for equals, `$nin` for arrays).
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Options specific to Number fields.
 * @see ./fields/types/number/NumberType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/number/NumberType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/number/NumberType.js}
 */
export interface KeystoneNumberFieldOptions extends KeystoneFieldOptions {
	/**
	 * Numeral.js format string (e.g., '0,0.00', '$0,0.00') or `false` to disable formatting.
	 * See http://numeraljs.com/ for format options.
	 * Default: '0,0[.][000000000000]'
	 */
	format?: string | false;
	/** Ensure type is specifically Number. */
	type: KeystoneNumberTypeConstructor | NumberConstructor;
}

/**
 * Interface for Number field instances.
 * @see ./fields/types/number/NumberType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/number/NumberType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/number/NumberType.js}
 */
export interface KeystoneNumberField extends KeystoneField {
	/** The native JavaScript type constructor (Number). */
	_nativeType: NumberConstructor;
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "small";
	/** Underscore methods added to documents (includes 'format'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: KeystoneNumberFieldOptions;
	/** The numeral.js format string to use, or false if formatting is disabled. */
	formatString?: string | false;

	/**
	 * Validates that the input is a valid number or can be converted to one. Empty strings are considered valid.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required number input. Checks for the presence of a numeric value.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Updates the item with a valid number value, or null if the input is invalid.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

	/**
	 * (Deprecated) Synchronously checks if input data for the field is a valid number.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Adds number-specific filtering logic to a Mongoose query.
	 * Supports 'equals', 'between', 'gt', 'lt' modes, and inversion.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiNumberFieldReactFilter
	): Record<string, any>;

	/**
	 * Formats the field's numeric value using numeral.js.
	 * Exposed as `item._.fieldPath.format(...)`.
	 * @param item The Mongoose document.
	 * @param format Optional numeral.js format string (overrides field option).
	 * @returns The formatted string, or an empty string for non-numeric values (except 0).
	 */
	format(item: any, format?: string): string;
}

/**
 * Constructor for Number field type.
 * @see ./fields/types/number/NumberType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/number/NumberType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/number/NumberType.js}
 */
export interface KeystoneNumberTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneNumberFieldOptions
	): KeystoneNumberField;
	prototype: KeystoneNumberField;
	properName: "Number";
}

// Textarea
/**
 * Options specific to Textarea fields.
 * @see ./fields/types/textarea/TextareaType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/textarea/TextareaType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/textarea/TextareaType.js}
 */
export interface KeystoneTextareaFieldOptions extends KeystoneFieldOptions {
	/**
	 * Height of the textarea in pixels.
	 * Default: 90
	 */
	height?: number;
	/** Minimum length allowed. Validates on save. */
	min?: number;
	/** Maximum length allowed. Validates on save. */
	max?: number;
	/** Ensure type is specifically Textarea. */
	type: KeystoneTextareaTypeConstructor;
}

/**
 * Interface for Textarea field instances.
 * @see ./fields/types/textarea/TextareaType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/textarea/TextareaType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/textarea/TextareaType.js}
 */
export interface KeystoneTextareaField extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Underscore methods added to documents (includes 'format', 'crop'). */
	_underscoreMethods: string[];
	/** Height of the textarea in pixels. */
	height: number;
	/** Always true for Textarea fields. */
	multiline: true;
	/** Properties exposed to Admin UI (includes 'height', 'multiline'). */
	_properties: string[];
	/** Field-specific options. */
	options: KeystoneTextareaFieldOptions;

	/**
	 * Validates input string length based on min/max options.
	 * Inherited from TextType.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required text input.
	 * Inherited from TextType.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds text-specific filtering logic to a Mongoose query.
	 * Inherited from TextType.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiTextFieldReactFilter
	): Record<string, any>;

	/**
	 * Crops the field's string value from an item to the specified length.
	 * Inherited from TextType.
	 * Exposed as `item._.fieldPath.crop(...)`.
	 * @param item The Mongoose document.
	 * @param length The target length.
	 * @param append String to append if cropped (defaults to '...').
	 * @param preserveWords If true, doesn't cut words in half.
	 * @returns The cropped string.
	 */
	crop(
		item: any,
		length: number,
		append?: string,
		preserveWords?: boolean
	): string;

	/**
	 * Formats the field's value, converting newlines to <br> tags.
	 * Exposed as `item._.fieldPath.format()`.
	 * @param item The Mongoose document.
	 * @returns The formatted HTML string.
	 */
	format(item: any): string;
}

/**
 * Constructor for Textarea field type.
 * @see ./fields/types/textarea/TextareaType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/textarea/TextareaType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/textarea/TextareaType.js}
 */
export interface KeystoneTextareaTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneTextareaFieldOptions
	): KeystoneTextareaField;
	prototype: KeystoneTextareaField;
	properName: "Textarea";
}

// Boolean
/**
 * Filter oAdminUiFieldReactptions for Boolean field queries.
 */
export interface KeystoneAdminUiBooleanFieldReactFilter {
	/**
	 * If truthy or 'true', filters for `true` values.
	 * Otherwise filters for `false` or `null`/`undefined` values.
	 */
	value?: boolean | string;
}

/**
 * Options specific to Boolean fields.
 * @see ./fields/types/boolean/BooleanType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/boolean/BooleanType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/boolean/BooleanType.js}
 */
export interface KeystoneBooleanFieldOptions extends KeystoneFieldOptions {
	/**
	 * Indent the checkbox in the Admin UI form.
	 * Default: false
	 */
	indent?: boolean;
	/**
	 * Default value for the field.
	 * Default: false
	 */
	default?: boolean;
	/** Ensure type is specifically Boolean. */
	type: KeystoneBooleanTypeConstructor | BooleanConstructor;
}

/**
 * Interface for Boolean field instances.
 * @see ./fields/types/boolean/BooleanType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/boolean/BooleanType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/boolean/BooleanType.js}
 */
export interface KeystoneBooleanField extends KeystoneField {
	/** The native JavaScript type constructor (Boolean). */
	_nativeType: BooleanConstructor;
	/** Properties exposed to Admin UI (includes 'indent'). */
	_properties: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "full";
	/** Whether the field is indented in the Admin UI. */
	indent: boolean;
	/** Field-specific options. */
	options: KeystoneBooleanFieldOptions;
	/** Default values for the Boolean type. */
	defaults: { default: boolean };

	/**
	 * Validates that the input is valid for a boolean value (boolean, string, number, null, undefined).
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required input. Considers truthy values or non-'false' strings as valid.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Updates the item, coercing input to `true` or `false`. Sets only if the value changes.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

	/**
	 * (Deprecated) Synchronously checks input for a boolean value.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean): boolean;

	/**
	 * Adds boolean-specific filtering logic to a Mongoose query.
	 * Filters for `true` or `{$ne: true}` (false or null/undefined) based on the filter value.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiBooleanFieldReactFilter
	): Record<string, any>;
}

/**
 * Constructor for Boolean field type.
 * @see ./fields/types/boolean/BooleanType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/boolean/BooleanType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/boolean/BooleanType.js}
 */
export interface KeystoneBooleanTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneBooleanFieldOptions
	): KeystoneBooleanField;
	prototype: KeystoneBooleanField;
	properName: "Boolean";
}

// Select
/**
 * Represents a selectable option for Select fields.
 * @see ./fields/types/select/SelectType.js
 */
export interface KeystoneSelectOption {
	/** The raw value stored in the database. */
	value: string | number;
	/** The human-readable label displayed in the UI. */
	label: string;
	/** Allow for additional custom properties. */
	[key: string]: any;
}

/**
 * Options specific to Select fields.
 * @see ./fields/types/select/SelectType.js
 */
export interface KeystoneSelectFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically Select */
	type: KeystoneSelectTypeConstructor;
	/**
	 * Defines the available choices. Can be:
	 * - A comma-separated string (e.g., 'draft,published,archived').
	 * - An array of strings or numbers (e.g., ['draft', 'published'], [1, 2, 3]).
	 * - An array of objects `{ value: string | number, label: string }`.
	 */
	options: string | Array<string | number | KeystoneSelectOption>;
	/**
	 * Store the selected value as a Number instead of a String.
	 * Default: false
	 */
	numeric?: boolean;
	/**
	 * Include a blank/empty option in the UI.
	 * Default: true
	 */
	emptyOption?: boolean;
	/**
	 * Admin UI rendering style.
	 * Default: 'select'
	 */
	ui?: string; // 'select' or 'radio'
	/**
	 * Path for the 'data' virtual property.
	 * Default: path + 'Data'
	 */
	dataPath?: string;
	/**
	 * Path for the 'label' virtual property.
	 * Default: path + 'Label'
	 */
	labelPath?: string;
	/**
	 * Path for the 'options' virtual property.
	 * Default: path + 'Options'
	 */
	optionsPath?: string;
	/**
	 * Path for the 'map' virtual property.
	 * Default: path + 'OptionsMap'
	 */
	optionsMapPath?: string;
}

/**
 * Filter oAdminUiFieldReactptions for Select field queries.
 * @see ./fields/types/select/SelectType.js
 */
export interface KeystoneAdminUiSelectFieldReactFilter {
	/**
	 * The value(s) to filter by.
	 * - Single value: Matches documents with exactly this value.
	 * - Array of values: Matches documents with any of these values.
	 */
	value?: string | number | Array<string | number>;
	/**
	 * Invert the filter logic (NOT equals, or NOT IN array).
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Interface for Select field instances.
 * @see ./fields/types/select/SelectType.js
 */
export interface KeystoneSelectField extends Omit<KeystoneField, "options"> {
	/** Admin UI rendering style ('select' or 'radio'). */
	ui: string;
	/** Whether the value is stored as a Number. */
	numeric: boolean;
	/** The native JavaScript type constructor (String or Number). */
	_nativeType: StringConstructor | NumberConstructor;
	/** Underscore methods added to documents (includes 'format', 'pluck'). */
	_underscoreMethods: ["format", "pluck"];
	/** Properties exposed to Admin UI (includes 'ops', 'numeric'). */
	_properties: ["ops", "numeric"];
	/** Array of processed option objects with value and label properties. */
	ops: KeystoneSelectOption[];
	/** Whether an empty option is included in the UI. */
	emptyOption: boolean;
	/** Map of value to option object. */
	map: Record<string | number, KeystoneSelectOption>;
	/** Map of value to option label string. */
	labels: Record<string | number, string>;
	/** Array of valid enum values for the schema path. */
	values: Array<string | number>;
	/** Field-specific options. */
	options: KeystoneSelectFieldOptions;
	/** Paths for virtual properties added to the schema. */
	paths: {
		/** Path to the virtual property returning the full selected option object. */
		data: string;
		/** Path to the virtual property returning the label of the selected option. */
		label: string;
		/** Path to the virtual property returning the raw options array. */
		options: string;
		/** Path to the virtual property returning the value-to-option map. */
		map: string;
	};

	/**
	 * Adds the enum path and virtuals to the schema.
	 * Overrides the base Field.addToSchema method.
	 * @param schema The Mongoose schema.
	 */
	addToSchema(schema: mongoose.Schema): void;

	/**
	 * Retrieves a property from the selected option object for an item.
	 * Exposed as `item._.fieldPath.pluck(propertyName, defaultValue)`.
	 * @param item The Mongoose document.
	 * @param property The key of the property to retrieve from the selected option object (e.g., 'label', 'value').
	 * @param _default Default value if the option is not found or doesn't have the property.
	 * @returns The value of the property from the selected option object, or the default value.
	 */
	pluck(
		item: any,
		property: keyof KeystoneSelectOption | string,
		_default?: any
	): any;

	/**
	 * Returns a shallow clone of the options array.
	 * @returns Array of cloned option objects.
	 */
	cloneOps(): KeystoneSelectOption[];

	/**
	 * Returns a shallow clone of the options map.
	 * @returns Map of value to cloned option object.
	 */
	cloneMap(): Record<string | number, KeystoneSelectOption>;

	/**
	 * Adds filtering conditions to a Mongoose query.
	 * @param filter Filter oAdminUiFieldReactptions with value(s) and inversion flag.
	 * @returns MongoDB query conditions object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiSelectFieldReactFilter
	): Record<string, any>;

	/**
	 * Validates that the input value is one of the predefined options or empty/null/undefined.
	 * @param data Input data object.
	 * @param callback Receives whether input is valid.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates that a non-empty, valid option is selected if required.
	 * @param item The Mongoose document.
	 * @param data Input data object.
	 * @param callback Receives whether input is valid.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Formats the field value.
	 * @param item The Mongoose document.
	 * @returns The label of the selected option or empty string.
	 */
	format(item: any): string;
}

/**
 * Constructor for Select field type.
 * @see ./fields/types/select/SelectType.js
 */
export interface KeystoneSelectTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneSelectFieldOptions
	): KeystoneSelectField;
	prototype: KeystoneSelectField;
	properName: "Select";
}

// Date & DateTime
/**
 * Filter oAdminUiFieldReactptions for Date and DateTime field queries.
 */
export interface KeystoneAdminUiDateFieldReactFilter {
	/**
	 * Filter mAdminUFieldReactiode.
	 * - 'between': Matches dates within the range specified by `after` and `before`.
	 * - 'after': Matches dates after `value`.
	 * - 'before': Matches dates before `value`.
	 * Default: matches dates on the same day as `value` if mode is omitted.
	 */
	mode?: "between" | "after" | "before" | string;
	/** The date value (as string, Date, or Moment) for basic comparisons. */
	value?: string | Date | moment.Moment;
	/** The start date (as string, Date, or Moment) for 'between' mode. */
	after?: string | Date | moment.Moment;
	/** The end date (as string, Date, or Moment) for 'between' mode. */
	before?: string | Date | moment.Moment;
	/**
	 * Invert the filter logic (e.g., NOT between, NOT after).
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Options specific to Date fields.
 * @see ./fields/types/date/DateType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/date/DateType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/date/DateType.js}
 */
export interface KeystoneDateFieldOptions extends KeystoneFieldOptions {
	/**
	 * Moment.js format string used for output formatting, or `false` to disable formatting.
	 * Default: 'Do MMM YYYY'
	 * @see ./https://momentjs.com/docs/#/displaying/format/
	 */
	format?: string | false;
	/**
	 * Moment.js format string for parsing input.
	 * Default: 'YYYY-MM-DD'
	 */
	inputFormat?: string;
	/**
	 * Range of years for date picker (e.g., `[2000, 2030]` or `10` for +/- 10 years from current).
	 * Default: 10 (+/- 10 years)
	 */
	yearRange?: number | number[];
	/**
	 * Treat date as UTC.
	 * Default: false
	 */
	utc?: boolean;
	/**
	 * Show 'Today' button in date picker.
	 * Default: true
	 */
	todayButton?: boolean;
	/**
	 * UTC offset (minutes) for correcting potentially corrupted UTC dates on retrieval.
	 * Default: Server's timezone offset.
	 */
	timezoneUtcOffsetMinutes?: number;
	/** Ensure type is Date. */
	type: KeystoneDateTypeConstructor | DateConstructor;
}

/**
 * Options specific to DateTime fields.
 * @see ./fields/types/datetime/DateTimeType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/datetime/DateTimeType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/datetime/DateTimeType.js}
 */
export interface KeystoneDateTimeFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically DateTime */
	type: KeystoneDateTimeTypeConstructor | DateConstructor;
	/**
	 * Moment.js format string for output, or `false` to disable formatting.
	 * Default: 'YYYY-MM-DD h:mm:ss a'
	 */
	format?: string | false;
	/**
	 * Moment.js format string(s) for parsing input.
	 * Default: Various standard formats including ISO 8601.
	 */
	parseFormat?: string | string[];
	/**
	 * Treat date/time as UTC.
	 * Default: false
	 */
	utc?: boolean;
}

/**
 * Interface for Date field instances.
 * @see ./fields/types/date/DateType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/date/DateType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/date/DateType.js}
 */
export interface KeystoneDateField extends KeystoneField {
	/** The native JavaScript type constructor (Date). */
	_nativeType: DateConstructor;
	/** Underscore methods added to documents (includes 'format', 'moment', 'parse'). */
	_underscoreMethods: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "medium";
	/** Properties exposed to Admin UI. */
	_properties: string[];
	/** Moment.js format string used for parsing input. */
	parseFormatString: string | string[];
	/** Moment.js format string for output, or false to disable. */
	formatString?: string | false;
	/** Year range option for date picker. */
	yearRange?: number | number[];
	/** Whether to treat the date as UTC. */
	isUTC: boolean;
	/** Whether the date picker shows the 'Today' button. */
	todayButton: boolean;
	/** UTC offset used for potential date correction. */
	timezoneUtcOffsetMinutes: number;
	/** Field-specific options. */
	options: KeystoneDateFieldOptions;

	/**
	 * Validates that required input has been provided (presence of a date value).
	 * Inherited from TextType.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds date-specific filtering logic to a Mongoose query.
	 * Supports date range filtering with 'between', 'after', 'before' modes.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiDateFieldReactFilter
	): Record<string, any>;

	/**
	 * Formats the field's date value using moment.js.
	 * Exposed as `item._.fieldPath.format(formatString)`.
	 * @param item The Mongoose document.
	 * @param format Optional moment.js format string (overrides field option).
	 * @returns Formatted date string or empty string if no valid date.
	 */
	format(item: any, format?: string): string;

	/**
	 * Returns the field's value as a moment.js object.
	 * Takes the `isUTC` option into account.
	 * Exposed as `item._.fieldPath.moment()`.
	 * @param item The Mongoose document.
	 * @returns A moment object or null if no date.
	 */
	moment(item: any): moment.Moment | null;

	/**
	 * Parses input using moment.js with the field's `parseFormatString`.
	 * Exposed as `item._.fieldPath.parse(value, formatString, strict)`.
	 * @param value The value to parse.
	 * @param format Optional format string(s) to override field option.
	 * @param strict Whether to use strict parsing.
	 * @returns A moment object (may be invalid).
	 */
	parse(
		value: any,
		format?: string | string[],
		strict?: boolean
	): moment.Moment;

	/**
	 * Validates that the input can be parsed into a valid date by moment.js.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Retrieves the date value, applying correction logic for potentially corrupted UTC dates.
	 * @param item The Mongoose document.
	 * @returns The Date object or null.
	 */
	getData(item: any): Date | null;

	/**
	 * (Deprecated) Synchronously checks if the input is a valid date.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Updates the item's value with a parsed Date object, or null if input is empty/invalid.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;
}

/**
 * Interface for DateTime field instances.
 * @see ./fields/types/datetime/DateTimeType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/datetime/DateTimeType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/datetime/DateTimeType.js}
 */
export interface KeystoneDateTimeField extends Omit<KeystoneField, "options"> {
	/** The native JavaScript type constructor (Date). */
	_nativeType: DateConstructor;
	/** Underscore methods added to documents (includes 'format', 'moment', 'parse'). */
	_underscoreMethods: ["format", "moment", "parse"];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "full";
	/** Properties exposed to Admin UI (includes 'formatString', 'isUTC'). */
	_properties: ["formatString", "isUTC"];
	/** Custom type description for the Admin UI. */
	typeDescription: string;
	/** Moment.js format string(s) for parsing input. */
	parseFormatString: string | string[];
	/** Moment.js format string for output, or false to disable. */
	formatString?: string | false;
	/** Whether to treat the date/time as UTC. */
	isUTC: boolean;
	/** Field-specific options. */
	options: KeystoneDateTimeFieldOptions;
	/** Paths for the sub-fields used in the Admin UI. */
	paths: {
		/** Path for the date part input. */
		date: string;
		/** Path for the time part input. */
		time: string;
		/** Path for the timezone offset input. */
		tzOffset: string;
	};

	/**
	 * Gets the value from a data object; may be simple or a pair of fields.
	 * @param data The input data object.
	 * @returns The combined date/time value.
	 */
	getInputFromData(data: any): string | any;

	/**
	 * Validates that required input has been provided.
	 * @param item The Mongoose document.
	 * @param data Input data object.
	 * @param callback Receives whether input is valid.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Validates that the input is a valid date/time.
	 * @param data Input data object.
	 * @param callback Receives whether input is valid.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * (Deprecated) Checks that a valid date/time has been provided.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Updates the field's value in the item from a data object.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt.
	 */
	updateItem(item: any, data: any, callback: () => void): void;

	/**
	 * Formats the field's date/time value using moment.js.
	 * Inherited from DateType.
	 * @param item The Mongoose document.
	 * @param format Optional moment.js format string.
	 * @returns Formatted date/time string.
	 */
	format(item: any, format?: string): string;

	/**
	 * Returns the field's value as a moment.js object.
	 * Inherited from DateType.
	 * @param item The Mongoose document.
	 * @returns A moment object or null.
	 */
	moment(item: any): moment.Moment | null;

	/**
	 * Parses input using moment.js.
	 * Inherited from DateType.
	 * @param value The value to parse.
	 * @param format Optional format string(s).
	 * @param strict Whether to use strict parsing.
	 * @returns A moment object.
	 */
	parse(
		value: any,
		format?: string | string[],
		strict?: boolean
	): moment.Moment;

	/**
	 * Adds date-based filtering logic to a Mongoose query.
	 * Inherited from DateType.
	 * @param filter The filter definition.
	 * @returns MongoDB query conditions object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiDateFieldReactFilter
	): Record<string, any>;
}

/**
 * Constructor for Date field type.
 * @see ./fields/types/date/DateType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/date/DateType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/date/DateType.js}
 */
export interface KeystoneDateTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneDateFieldOptions
	): KeystoneDateField;
	prototype: KeystoneDateField;
	properName: "Date";
}

/**
 * Constructor for DateTime field type.
 * @see ./fields/types/datetime/DateTimeType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/datetime/DateTimeType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/datetime/DateTimeType.js}
 */
export interface KeystoneDateTimeTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneDateTimeFieldOptions
	): KeystoneDateTimeField;
	prototype: KeystoneDateTimeField;
	properName: "Datetime";
}

// Html
/**
 * Options specific to Html fields.
 * @see ./fields/types/html/HtmlType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/html/HtmlType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/html/HtmlType.js}
 */
export interface KeystoneHtmlFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically Html */
	type: KeystoneHtmlTypeConstructor;
	/** Whether to use WYSIWYG editor. */
	wysiwyg?: boolean;
	/** Height of the editor in pixels. */
	height?: number;
	/** Minimum length of HTML content. */
	min?: number;
	/** Maximum length of HTML content. */
	max?: number;
}

/**
 * Interface for Html field instances.
 * @see ./fields/types/html/HtmlType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/html/HtmlType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/html/HtmlType.js}
 */
export interface KeystoneHtmlField extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Default size for the field in the Admin UI. */
	_defaultSize: "full";
	/** Properties exposed to Admin UI. */
	_properties: string[];
	/** Field-specific options. */
	options: KeystoneHtmlFieldOptions;
}

/**
 * Constructor for Html field type.
 * @see ./fields/types/html/HtmlType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/html/HtmlType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/html/HtmlType.js}
 */
export interface KeystoneHtmlTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneHtmlFieldOptions
	): KeystoneHtmlField;
	prototype: KeystoneHtmlField;
	properName: "Html";
}

/**
 * Options specific to HTML fields.
 * @see ./fields/types/html/HtmlType.js
 */
export interface KeystoneHtmlFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically HTML */
	type: KeystoneHtmlTypeConstructor;
	/**
	 * Enable TinyMCE WYSIWYG editor instead of simple textarea.
	 * Default: false
	 */
	wysiwyg?: boolean;
	/**
	 * Height of the editor in pixels.
	 * Default: 180
	 */
	height?: number;
	/** Minimum length allowed. Validates on save. */
	min?: number;
	/** Maximum length allowed. Validates on save. */
	max?: number;
}

/**
 * Interface for HTML field instances.
 * @see ./fields/types/html/HtmlType.js
 */
export interface KeystoneHtmlField extends Omit<KeystoneField, "options"> {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Default size for the field in the Admin UI. */
	_defaultSize: "full";
	/** Whether to use the TinyMCE WYSIWYG editor. */
	wysiwyg: boolean;
	/** Height of the editor in pixels. */
	height: number;
	/** Properties exposed to Admin UI (includes 'wysiwyg', 'height'). */
	//CHECK LATER _properties: Array<"wysiwyg" | "height">;
	_properties: string[];
	/** Field-specific options. */
	options: KeystoneHtmlFieldOptions;

	/**
	 * Validates input HTML length based on min/max options.
	 * Similar to TextType validation.
	 * @param data Input data.
	 * @param callback Receives whether input is valid.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required HTML input. Checks for non-empty strings.
	 * Similar to TextType validation.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives whether input is valid.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds text-specific filtering logic to a Mongoose query.
	 * Similar to TextType filtering.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiTextFieldReactFilter
	): Record<string, any>;
}

/**
 * Constructor for HTML field type.
 * @see ./fields/types/html/HtmlType.js
 */
export interface KeystoneHtmlTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneHtmlFieldOptions
	): KeystoneHtmlField;
	prototype: KeystoneHtmlField;
	properName: "Html";
}

// ... existing code ...

// --- Keystone & List Classes ---

/**
 * Represents a Keystone Data List.
 * @see ./lib/list.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list.js}
 */
declare class KeystoneList {
	/**
	 * Creates a new List instance.
	 * @param key The unique key for the list (e.g., 'User', 'PostCategory'). Used to generate paths and labels.
	 * @param options Configuration options for the list.
	 */
	constructor(key: string, options?: KeystoneListOptions);

	/** Reference to the Keystone instance. */
	keystone: Keystone;
	/** Merged configuration options for the list. */
	options: KeystoneListOptions;
	/** The unique key for the list. Used as identifier and to generate labels. */
	key: string;
	/** URL path for the list in the Admin UI (e.g., 'users'). */
	path: string;
	/** The Mongoose schema associated with this list. */
	schema: mongoose.Schema;
	/** Array of raw field/heading definitions added to the schema. */
	schemaFields: Array<
		string | KeystoneFieldDefinition | KeystoneHeadingDefinition
	>;
	/** Ordered array of UI elements (fields, headings, indents) for Admin UI forms. */
	uiElements: KeystoneUIElement[];
	/** Map of custom methods added to the Mongoose documents via `list.underscoreMethod()`. */
	underscoreMethods: Record<string, Function>;
	/** Map of Field instances associated with the list, keyed by path. */
	fields: Record<string, KeystoneField>; // Holds instances of Field or its subclasses
	/** Array of all Field instances associated with the list. */
	fieldsArray: KeystoneField[];
	/** Map of field type constructors used in this list. */
	fieldTypes: Record<string, string | boolean>; // Map of Type JS name -> properName or true
	/** Array of all relationship Field instances in this list. */
	relationshipFields: KeystoneField[]; // @todo Use RelationshipField[] type when defined
	/** Map of relationship definitions defined on this list. */
	relationships: Record<
		string,
		{
			ref: string;
			refPath: string;
			path: string;
			list: KeystoneList;
			field: KeystoneField;
		}
	>; // @todo Refine RelationshipDefinition

	/** Map of special list properties to field paths */
	mappings: KeystoneListMappings;
	/** The compiled Mongoose Model for this list. Available after `list.register()`. */
	model: mongoose.Model<any>; // @todo Define Mongoose Document type

	// Internal caches
	/** @internal Cache for expanded search fields. */
	_searchFields?: KeystoneField[];
	/** @internal Cache for expanded default columns. */
	_defaultColumns?: Array<{
		path: string;
		field?: KeystoneField;
		type?: string;
		label?: string;
		options?: any;
	}>;

	// --- Getters ---
	/** The display label for the list (e.g., "Users"). */
	readonly label: string;
	/** The singular display label for the list (e.g., "User"). */
	readonly singular: string;
	/** The plural display label for the list (e.g., "Users"). */
	readonly plural: string;
	/** The path of the field used as the item name/title. */
	readonly namePath: string;
	/** The Field instance used as the item name/title. */
	readonly nameField: KeystoneField | undefined;
	/** Whether the name field is a virtual field. */
	readonly nameIsVirtual: boolean;
	/** Whether the name field type is compatible as an Admin UI form header. */
	readonly nameFieldIsFormHeader: boolean;
	/** Whether the name field is available on the create form. */
	readonly nameIsInitial: boolean;
	/** Array of fields marked as initial (shown on the create form). */
	readonly initialFields: KeystoneField[];

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
	 * Multiple parameters allow for organizing fields under headings.
	 *
	 * @example
	 * // Add fields without headings
	 * List.add({
	 *   name: { type: Types.Text, required: true },
	 *   email: { type: Types.Email, required: true }
	 * });
	 *
	 * @example
	 * // Add fields with headings
	 * List.add(
	 *   { name: { type: Types.Text } },
	 *   'Contact Details',
	 *   { email: { type: Types.Email }, phone: { type: Types.Text } }
	 * );
	 */
	add(
		...defs: Array<string | KeystoneFieldDefinition | KeystoneHeadingDefinition>
	): KeystoneList;

	/**
	 * Retrieves a Field instance by its path, or creates a new field if options are provided.
	 * @param path The field path.
	 * @returns The Field instance or undefined if not found.
	 */
	field(path: string): KeystoneField | undefined;

	/**
	 * Creates a new field with the specified options.
	 * @param path The field path.
	 * @param options Configuration options for the field.
	 * @returns The newly created Field instance.
	 */
	field(path: string, options: KeystoneFieldOptions): KeystoneField;

	/**
	 * Creates a new field with the specified type constructor.
	 * @param path The field path.
	 * @param constructor Field type constructor (e.g., Types.Text).
	 * @returns The newly created Field instance.
	 */
	field(
		path: string,
		constructor:
			| KeystoneFieldTypeConstructor
			| StringConstructor
			| NumberConstructor
			| BooleanConstructor
			| DateConstructor
	): KeystoneField;

	/**
	 * Adds filters to a Mongoose query based on filter conditions.
	 * @param query The Mongoose query object to modify.
	 * @param filters Filter cAdminUiondFieldReactitions to apply.
	 * @returns The modified query object.
	 */
	addFiltersToQuery: (query: any, filters: Record<string, any>) => any;

	/**
	 * Adds search terms to a Mongoose query.
	 * Searches across fields defined in searchFields.
	 * @param query The Mongoose query object to modify.
	 * @param search The search string.
	 * @returns The modified query object.
	 */
	addSearchToQuery: (query: any, search: string) => any;

	/**
	 * Automatically maps fields based on common names if not already mapped.
	 * For example, maps 'name' to field with path 'name' if not explicitly mapped.
	 * @param options Optionally specify which fields to map or exclude.
	 * @returns The List instance for chaining.
	 */
	automap: (options?: Record<string, boolean>) => KeystoneList;

	/**
	 * Generates API response data for an item, optionally expanding relationship fields.
	 * @param item The mongoose document.
	 * @param select Fields to include in response.
	 * @param expandRelationshipFields Whether to expand relationship fields.
	 * @returns Formatted object with item data.
	 */
	apiForGet: (
		item: any,
		select?: string,
		expandRelationshipFields?: boolean
	) => any;

	/**
	 * Expands column specifications into a structured array for the Admin UI.
	 * @param cols Column specification string (comma-separated) or array.
	 * @returns Array of column objects for display in the Admin UI.
	 */
	expandColumns: (cols: string | string[]) => Array<{
		path: string;
		field?: KeystoneField;
		type?: string;
		label?: string;
		options?: any;
	}>;

	/**
	 * Expands a comma-separated string or array of paths into Field instances.
	 * @param paths Field paths as string (comma-separated) or array.
	 * @returns Array of Field instances.
	 */
	expandPaths: (paths: string | string[]) => KeystoneField[];

	/**
	 * Expands a sort string into a MongoDB sort object.
	 * @param sort Sort specification string (e.g., "-createdAt name").
	 * @returns MongoDB sort object (e.g., { createdAt: -1, name: 1 }).
	 */
	expandSort: (sort: string) => Record<string, 1 | -1>;

	/**
	 * Gets a list option value.
	 * @param key Option key to retrieve.
	 * @returns Option value or undefined.
	 */
	get: (key: keyof KeystoneListOptions | string) => any;

	/**
	 * Sets a list option value.
	 * @param key Option key to set.
	 * @param value Value to set.
	 * @returns The updated options object.
	 */
	set: (
		key: keyof KeystoneListOptions | string,
		value: any
	) => KeystoneListOptions;

	/**
	 * Generates the Admin UI URL for the list or a specific item.
	 * @param doc Optional mongoose document or ID string.
	 * @returns Admin UI URL.
	 */
	getAdminURL: (doc?: any | string) => string;

	/**
	 * Generates CSV data for list items.
	 * @param options Options for CSV generation.
	 * @param user Current user for access control.
	 * @param callback Receives the generated CSV string.
	 */
	getCSVData: (
		options: any,
		user: any,
		callback: (err: any, csvData: string) => void
	) => void;

	/**
	 * Retrieves data for an item, optionally expanding relationship fields.
	 * @param item The mongoose document.
	 * @param fields Fields to include (comma-separated string or array).
	 * @param expandRelationshipFields Whether to expand relationship fields.
	 * @returns Object with item data.
	 */
	getData: (
		item: any,
		fields?: string | string[],
		expandRelationshipFields?: boolean
	) => any;

	/**
	 * Returns the display name of a document.
	 * Uses the path defined by namePath.
	 * @param doc The mongoose document.
	 * @param escapeHtml Whether to HTML-escape the name.
	 * @returns The document's display name.
	 */
	getDocumentName: (doc: any, escapeHtml?: boolean) => string;

	/**
	 * Retrieves list options filtered by option set.
	 * @param optionsSet Option set name (e.g., 'api', 'form').
	 * @param rest Additional options to include.
	 * @returns Filtered options object.
	 */
	getOptions: (optionsSet: string, rest?: any) => any;

	/**
	 * Calculates pagination data for a query.
	 * @param query Mongoose query object.
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
	 * Builds MongoDB filter objects from a search query string.
	 * @param search Search query string.
	 * @returns MongoDB filter conditions.
	 */
	getSearchFilters: (search: string) => Record<string, any>;

	/**
	 * Generates a unique value for a field based on input, appending numbers if needed.
	 * @param path Field path to make unique.
	 * @param value Base value to start with.
	 * @param filters Additional filters to apply.
	 * @param callback Optional callback for the unique value.
	 * @returns Promise resolving to the unique value.
	 */
	getUniqueValue: (
		path: string,
		value: string | number,
		filters?: any,
		callback?: (err: any, uniqueValue: string | number) => void
	) => Promise<string | number>;

	/**
	 * Checks if a path is reserved by the list or Mongoose.
	 * @param path Field path to check.
	 * @returns Whether the path is reserved.
	 */
	isReserved: (path: string) => boolean;

	/**
	 * Maps a special list property to a field path.
	 * @param path Special property name (e.g., 'name', 'createdAt').
	 * @param mappedPath Field path to map to.
	 */
	map: (path: keyof KeystoneListMappings | string, mappedPath: string) => void;

	/**
	 * Paginates a query with filters.
	 * @param options Pagination and filter options.
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
	 * Processes filter strings or objects into MongoDB query conditions.
	 * @param filters Filter sAdminUipecifiFieldReactcation string or object.
	 * @returns MongoDB query conditions.
	 */
	processFilters: (
		filters: string | Record<string, any>
	) => Record<string, any>;

	/**
	 * Registers the list with Keystone, finalizing the schema and creating the Mongoose model.
	 * Must be called after adding all fields and before using the list's model.
	 * @returns The List instance for chaining.
	 */
	register: () => KeystoneList;

	/**
	 * Defines a relationship to another list.
	 * Usually called internally by relationship fields.
	 * @param def Relationship definition.
	 */
	relationship: (def: {
		ref: string;
		refPath: string;
		path: string;
		config?: any;
	}) => void;

	/**
	 * Selects specific columns for a Mongoose query projection.
	 * @param query Mongoose query to modify.
	 * @param columns Columns to select.
	 */
	selectColumns: (
		query: any,
		columns: Array<{ path: string; field?: KeystoneField }>
	) => void;

	/**
	 * Updates an item with new data using UpdateHandler.
	 * @param item Mongoose document to update.
	 * @param data Update data.
	 * @param options Update options.
	 * @param callback Receives the updated item.
	 */
	updateItem: (
		item: any,
		data: any,
		options: { files?: any; user?: any },
		callback: (err: any, item: any) => void
	) => void;

	/**
	 * Adds a method to the Mongoose document instances prefixed with the field path.
	 * @param path Method name (without underscore).
	 * @param fn Method implementation.
	 * @returns The List instance for chaining.
	 */
	underscoreMethod: (path: string, fn: Function) => KeystoneList;

	/**
	 * Builds MongoDB text index for this list if configured.
	 * @param callback Optional callback for completion.
	 * @returns Promise if no callback provided.
	 */
	buildSearchTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any> | void;

	/**
	 * Checks if this list's schema declares a text index.
	 * @returns Whether the schema has a text index.
	 */
	declaresTextIndex: () => boolean;

	/**
	 * Ensures MongoDB text index exists if searchUsesTextIndex is enabled.
	 * @param callback Optional callback for completion.
	 * @returns Promise resolving when index is created.
	 */
	ensureTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any>;
}

/**
 * Interface defining common KeystoneJS configuration options.
 * @see ./lib/core/options.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/options.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/options.js}
 */
export interface KeystoneOptions {
	/** Name of the project/application. Displayed in the Admin UI. */
	name?: string;
	/** Brand text to display at the top of the Admin UI signin page. */
	brand?: string;
	/**
	 * Path to the Admin UI.
	 * Default: '/keystone'
	 */
	"admin path"?: string;
	/**
	 * Enable HTTP compression.
	 * Default: true
	 */
	compress?: boolean;
	/**
	 * Run without Admin UI (API only).
	 * Default: false
	 */
	headless?: boolean;
	/**
	 * Logging configuration (true, false, or a function).
	 * Default: console.log
	 */
	logger?: string | boolean | ((...args: any[]) => void);
	/**
	 * Auto-create/update lists from schema changes.
	 * Default: process.env.NODE_ENV !== 'production'
	 */
	"auto update"?: boolean;
	/**
	 * Prefix for all MongoDB collection names.
	 * Default: '' (empty string)
	 */
	"model prefix"?: string | null;
	/**
	 * Path to the root of the consuming module/project.
	 * Default: based on module location
	 */
	"module root"?: string;
	/**
	 * X-Frame-Options protection for clickjacking.
	 * Default: 'sameorigin'
	 */
	"frame guard"?: "deny" | "sameorigin" | boolean;
	/**
	 * Cache Admin UI bundles in production.
	 * Default: true
	 */
	"cache admin bundles"?: boolean;
	/**
	 * Enable file upload handling.
	 * Default: true
	 */
	"handle uploads"?: boolean;
	/**
	 * Environment name (usually 'development', 'production').
	 * Default: process.env.NODE_ENV
	 */
	env?: string;
	/**
	 * HTTP port to listen on.
	 * Default: process.env.PORT || 3000
	 */
	port?: string | number;
	/**
	 * Host to bind the server to.
	 * Default: process.env.HOST || '0.0.0.0'
	 */
	host?: string;
	/**
	 * Specific IP/Host to listen on (overrides host/port).
	 * Default: undefined
	 */
	listen?: string;
	/**
	 * Enable HTTPS. 'only' forces HTTPS and redirects HTTP.
	 * Default: false
	 */
	ssl?: boolean | "only";
	/**
	 * HTTPS port (only used if ssl is enabled).
	 * Default: 3001
	 */
	"ssl port"?: string | number;
	/**
	 * Host to bind the HTTPS server to.
	 * Default: value of 'host'
	 */
	"ssl host"?: string;
	/**
	 * Path to SSL key file or the key itself.
	 * Required if ssl is enabled.
	 */
	"ssl key"?: string;
	/**
	 * Path to SSL certificate file or the cert itself.
	 * Required if ssl is enabled.
	 */
	"ssl cert"?: string;
	/**
	 * Secret used for signing cookies.
	 * Required for session support.
	 */
	"cookie secret"?: string;
	/**
	 * Enable signin cookies (for persistent sessions).
	 * Default: true in development
	 */
	"cookie signin"?: boolean;
	/**
	 * Embedly API key for oEmbed support.
	 */
	"embedly api key"?: string;
	/**
	 * Mandrill API key for email sending.
	 */
	"mandrill api key"?: string;
	/**
	 * Mandrill username for email sending.
	 */
	"mandrill username"?: string;
	/**
	 * Google API Browser key.
	 */
	"google api key"?: string;
	/**
	 * Google API Server key.
	 */
	"google server api key"?: string;
	/**
	 * Google Analytics property ID.
	 */
	"ga property"?: string;
	/**
	 * Google Analytics domain.
	 */
	"ga domain"?: string;
	/**
	 * Chartbeat property ID.
	 */
	"chartbeat property"?: string;
	/**
	 * Chartbeat domain.
	 */
	"chartbeat domain"?: string;
	/**
	 * Whitelist IP ranges for Admin UI access.
	 */
	"allowed ip ranges"?: string | string[];
	/**
	 * Amazon S3 configuration.
	 * Can be a config object, or true to use environment variables.
	 */
	"s3 config"?: Record<string, any> | boolean;
	/**
	 * Azure Storage configuration.
	 * Can be a config object, or true to use environment variables.
	 */
	"azurefile config"?: Record<string, any> | boolean;
	/**
	 * Cloudinary configuration.
	 * Can be a config object, URL string, or true to use environment variables.
	 */
	"cloudinary config"?: Record<string, any> | string | boolean;
	/**
	 * Mongoose instance to use.
	 * Default: internal Mongoose instance
	 */
	mongoose?: typeof mongoose;
	/**
	 * MongoDB connection URI.
	 * Default: 'mongodb://localhost/keystone-db'
	 */
	mongo?: string;
	/**
	 * Session configuration.
	 * true enables default MongoDB session store.
	 */
	session?: boolean | Record<string, any>;
	/**
	 * Enable authentication.
	 * true requires 'user model' and 'cookie secret'.
	 */
	auth?: boolean | KeystoneList | string;
	/**
	 * Key of the list to use for authentication.
	 * Default: 'User'
	 */
	"user model"?: string;
	/**
	 * Custom Express app instance.
	 * Use if you need to customize Express before Keystone initialization.
	 */
	app?: express.Express;
	/**
	 * Express session store instance.
	 * Default: Connects-Mongo based on MongoDB connection.
	 */
	"session store"?: any;
	/**
	 * Navigation structure for Admin UI.
	 * Maps section names to lists or arrays of lists.
	 */
	nav?: Record<string, string | string[]>;
	/**
	 * Middleware executed before static assets handling.
	 */
	"pre:static"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before body parser.
	 */
	"pre:bodyparser"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before session handling.
	 */
	"pre:session"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before logger.
	 */
	"pre:logger"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before Admin UI.
	 */
	"pre:admin"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before Admin UI routes.
	 */
	"pre:adminroutes"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before application routes.
	 */
	"pre:routes"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before rendering views.
	 */
	"pre:render"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Custom route handler function.
	 * @param app The Express application instance.
	 */
	routes?: (app: express.Application) => void;
	/**
	 * Trust proxy headers (X-Forwarded-For, etc).
	 * Default: true
	 */
	"trust proxy"?: boolean;
	/**
	 * Let's Encrypt configuration for auto-SSL.
	 * Default: false
	 */
	letsencrypt?:
		| boolean
		| {
				/** Email address for Let's Encrypt registration. */
				email: string;
				/** Domain names to secure. */
				domains: string[];
				/** Domain approval logic or flag. */
				approveDomains?: boolean | Function;
				/** Let's Encrypt server (production or staging). */
				server?: string;
		  };
	/**
	 * Logo for Admin UI signin page.
	 * String URL or [URL, height] array.
	 * Default: false
	 */
	"signin logo"?: string | [string, number];
	/**
	 * Custom URL for signin page.
	 * Default: false
	 */
	"signin url"?: string;
	/**
	 * Custom URL for signout page.
	 * Default: false
	 */
	"signout url"?: string;

	/**
	 * Allow any other custom options.
	 * Additional options will be accessible via keystone.get().
	 */
	[key: string]: any;
}

/**
 * Represents a KeystoneJS v4 application instance.
 * @see ./https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/index.js
 */
declare class Keystone {
	/** Initializes a new Keystone instance. */
	constructor();

	/** Method to call hooks registered with grappling-hook. */
	callHook: Hook["callHook"];
	/** Method to register hooks with grappling-hook. */
	addHook: Hook["addHook"];

	/** Map of all registered List instances, keyed by list key. */
	lists: Record<string, KeystoneList>;
	/** Map of registered field types. @todo Replace 'any' with defined FieldType constructor. */
	fieldTypes: Record<string, any>;
	/** Map of paths for custom view templates. @todo Define structure. */
	paths: Record<string, any>;
	/** Internal storage for configuration options set via keystone.set(). */
	_options: KeystoneOptions;
	/** Map of defined URL redirects. */
	_redirects: Record<
		string,
		string | { from: string; to: string; status?: number }
	>;

	/** Express.js library instance. */
	express: express.Express;
	/** Mongoose library instance. */
	mongoose: typeof mongoose;

	/** Built-in middleware handlers. */
	middleware: {
		/** API middleware for serving JSON data. */
		api: any;
		/** CORS middleware for cross-origin requests. */
		cors: any;
	};

	/** The Express application instance (available after init). */
	app?: express.Express;
	/** Navigation structure for the Admin UI (available after initNav). */
	nav?: {
		sections: Array<{
			label: string;
			key: string;
			lists: Array<{ key: string; path: string; label: string; options: any }>;
		}>;
		by: {
			list: Record<
				string,
				{ key: string; path: string; label: string; options: any }
			>;
		};
	};

	// --- Options Management ---
	/**
	 * Sets a configuration option.
	 * @param key Option key to set.
	 * @param value Value to set.
	 * @returns The Keystone instance for chaining.
	 */
	set<K extends keyof KeystoneOptions>(key: K, value: KeystoneOptions[K]): this;
	set(key: string, value: any): this;

	/**
	 * Get or set multiple options at once.
	 * @param options Object of options to set.
	 * @returns Current options object.
	 */
	options(options: Partial<KeystoneOptions>): KeystoneOptions;

	/**
	 * Get the current options object.
	 * @returns Current options object.
	 */
	options(): KeystoneOptions;

	/**
	 * Gets a configuration option value.
	 * @param key Option key to retrieve.
	 * @returns Option value.
	 */
	get<K extends keyof KeystoneOptions>(key: K): KeystoneOptions[K];
	get(key: string): any;

	/**
	 * Gets a path-based configuration option, applying path resolution.
	 * @param key Path option key to retrieve.
	 * @param defaultValue Default value if not set.
	 * @returns Resolved path value.
	 */
	getPath(
		key: keyof KeystoneOptions | string,
		defaultValue?: string
	): string | undefined;

	/**
	 * Expands a relative path using the module root.
	 * @param pathValue Relative path to expand.
	 * @returns Absolute path.
	 */
	expandPath(pathValue: string): string;

	// --- Core Methods ---
	/**
	 * Prefixes a model name with the configured model prefix.
	 * @param key Model name to prefix.
	 * @returns Prefixed model name.
	 */
	prefixModel: (key: string) => string;

	/**
	 * Creates multiple items across lists.
	 * @todo Define signature from lib/core/createItems.js
	 */
	createItems: any;

	/**
	 * Creates an Express router instance.
	 * Same as express.Router() but maintained for legacy compatibility.
	 */
	createRouter: typeof express.Router;

	/**
	 * Retrieves lists that aren't part of the Admin UI navigation.
	 * @returns Array of orphaned List instances.
	 */
	getOrphanedLists: () => KeystoneList[];

	/**
	 * Creates an importer function for a specific module root.
	 * @param moduleRoot Path to the module root.
	 * @returns Importer function that loads modules relative to the root.
	 */
	importer: (moduleRoot: string) => (dirname: string) => Record<string, any>;

	/**
	 * Initializes Keystone, setting up database, express, and admin UI.
	 * @todo Define signature from lib/core/init.js
	 */
	init: any;

	/**
	 * Initializes the database configuration.
	 * @todo Define signature from lib/core/initDatabaseConfig.js
	 */
	initDatabaseConfig: any;

	/**
	 * Initializes the Express application.
	 * @todo Define signature from lib/core/initExpressApp.js
	 */
	initExpressApp: any;

	/**
	 * Initializes the Express session handling.
	 * @todo Define signature from lib/core/initExpressSession.js
	 */
	initExpressSession: any;

	/**
	 * Initializes the Admin UI navigation structure.
	 * @todo Define signature from lib/core/initNav.js
	 */
	initNav: any;

	/**
	 * Retrieves a registered List by its key.
	 * @param key List key.
	 * @returns The List instance or undefined if not found.
	 */
	list: (key: string) => KeystoneList | undefined;

	/**
	 * Opens a connection to the MongoDB database.
	 * @param options Connection options.
	 * @param callback Callback for connection result.
	 * @returns The Keystone instance for chaining.
	 */
	openDatabaseConnection: (
		options?: mongoose.ConnectOptions & { uri?: string },
		callback?: (err?: any) => void
	) => this;

	/**
	 * Closes the current MongoDB connection.
	 * @param callback Callback for when connection is closed.
	 */
	closeDatabaseConnection: (callback?: (err?: any) => void) => void;

	/**
	 * Populates relationship fields in a document.
	 * @todo Define signature from lib/core/populateRelated.js
	 */
	populateRelated: any;

	/**
	 * Registers URL redirects.
	 * @param from Source URL or object mapping sources to destinations.
	 * @param to Destination URL (if from is a string).
	 * @param status HTTP status code (default: 302).
	 */
	redirect: (
		from: string | Record<string, string | number>,
		to?: string,
		status?: number
	) => void;

	/**
	 * Starts the Keystone server.
	 * @param options Start options or callback.
	 * @param callback Callback when server is started.
	 */
	start: (
		options?: Record<string, any> | ((err?: any) => void),
		callback?: (err?: any) => void
	) => void;

	/**
	 * Wraps an error in HTML for browser display.
	 * @todo Define signature from lib/core/wrapHTMLError.js
	 */
	wrapHTMLError: any;

	/**
	 * Creates a Keystone-specific hash.
	 * @todo Define signature from lib/core/createKeystoneHash.js
	 */
	createKeystoneHash: any;

	/**
	 * Applies updates to the Keystone application.
	 * @param callback Callback for when updates are applied.
	 */
	applyUpdates(callback: (err?: any) => void): void;

	/**
	 * Imports modules from a directory relative to the module root.
	 * @param dirname Directory to import from.
	 * @returns Object mapping filenames to loaded modules.
	 */
	import(dirname: string): Record<string, any>;

	/** Utility for logging configuration errors. */
	console: { err(type: string, msg: string): void };

	// --- Exposed Modules/Classes ---
	/** Admin UI server and utilities. */
	Admin: { Server: any };
	/** Email sending utilities. */
	Email: any;
	/** Field type base constructor and type collection. */
	Field: KeystoneFieldTypeConstructor & {
		Types: {
			/** Standard text field. */
			Text?: KeystoneTextTypeConstructor;
			/** Numeric field with formatting options. */
			Number?: KeystoneNumberTypeConstructor;
			/** Multi-line text field. */
			Textarea?: KeystoneTextareaTypeConstructor;
			/** Boolean/checkbox field. */
			Boolean?: KeystoneBooleanTypeConstructor;
			/** Single-select dropdown/radio field. */
			Select?: KeystoneSelectTypeConstructor;
			/** Combined date and time field. */
			Datetime?: KeystoneDateTimeTypeConstructor;
			/** Date-only field. */
			Date?: KeystoneDateTypeConstructor;
			/** Rich text WYSIWYG editor field. */
			Html?: KeystoneHtmlTypeConstructor;
			/** Relationship to other list items. */
			Relationship?: KeystoneFieldTypeConstructor;
			/** Name field (first/last name). */
			Name?: KeystoneFieldTypeConstructor;
			/** Email field with validation. */
			Email?: KeystoneFieldTypeConstructor;
			/** Password field with encryption. */
			Password?: KeystoneFieldTypeConstructor;
			/** Currency field with formatting. */
			Money?: KeystoneFieldTypeConstructor;
			// ... other core types ...
			[key: string]: KeystoneFieldTypeConstructor | undefined;
		};
	};
	/** Reference to the Keystone constructor. */
	Keystone: typeof Keystone;
	/** Reference to the List constructor. */
	List: typeof KeystoneList;
	/** Storage adapters for file uploads. */
	Storage: any;
	/** Template rendering utilities. */
	View: any;
	/** Content rendering utilities. */
	content: any;
	/** Security utilities including CSRF protection. */
	security: { csrf: any };
	/** General utilities for string manipulation, etc. */
	utils: any;
	/** Session management utilities. */
	session: any;
	/** Keystone version string. */
	version: string;

	// Deprecated methods
	/**
	 * @deprecated Use `keystone.set('routes', fn)` instead.
	 * Originally used to define routes directly on the Keystone instance.
	 */
	routes: () => never;
}

/**
 * Options specific to URL fields.
 * @see ./fields/types/url/UrlType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/url/UrlType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/url/UrlType.js}
 */
export interface KeystoneUrlFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically URL */
	type: KeystoneUrlTypeConstructor | StringConstructor;
}

/**
 * Interface for URL field instances.
 * @see ./fields/types/url/UrlType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/url/UrlType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/url/UrlType.js}
 */
export interface KeystoneUrlField extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Field-specific options. */
	options: KeystoneUrlFieldOptions;
}

/**
 * Constructor for URL field type.
 * @see ./fields/types/url/UrlType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/url/UrlType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/url/UrlType.js}
 */
export interface KeystoneUrlTypeConstructor
	extends KeystoneFieldTypeConstructor {
	/** Creates a new URL field instance. */
	new (
		list: KeystoneList,
		path: string,
		options?: KeystoneUrlFieldOptions
	): KeystoneUrlField;
}

// Key
/**
 * Options specific to Key fields.
 * @see ./fields/types/key/KeyType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/key/KeyType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/key/KeyType.js}
 */
export interface KeystoneKeyFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically Key */
	type: KeystoneKeyTypeConstructor | StringConstructor;
	/** Character used to separate words in the key. Defaults to '-'. */
	separator?: string;
}

/**
 * Interface for Key field instances.
 * @see ./fields/types/key/KeyType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/key/KeyType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/key/KeyType.js}
 */
export interface KeystoneKeyField extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Field-specific options. */
	options: KeystoneKeyFieldOptions;
}

/**
 * Constructor for Key field type.
 * @see ./fields/types/key/KeyType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/key/KeyType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/key/KeyType.js}
 */
export interface KeystoneKeyTypeConstructor
	extends KeystoneFieldTypeConstructor {
	/** Creates a new Key field instance. */
	new (
		list: KeystoneList,
		path: string,
		options?: KeystoneKeyFieldOptions
	): KeystoneKeyField;
}

// Color
/**
 * Options specific to Color fields.
 * @see ./fields/types/color/ColorType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/color/ColorType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/color/ColorType.js}
 */
export interface KeystoneColorFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically Color */
	type: KeystoneColorTypeConstructor | StringConstructor;
}

/**
 * Interface for Color field instances.
 * @see ./fields/types/color/ColorType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/color/ColorType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/color/ColorType.js}
 */
export interface KeystoneColorField extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Field-specific options. */
	options: KeystoneColorFieldOptions;
}

/**
 * Constructor for Color field type.
 * @see ./fields/types/color/ColorType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/color/ColorType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/color/ColorType.js}
 */
export interface KeystoneColorTypeConstructor
	extends KeystoneFieldTypeConstructor {
	/** Creates a new Color field instance. */
	new (
		list: KeystoneList,
		path: string,
		options?: KeystoneColorFieldOptions
	): KeystoneColorField;
}

// Name
/**
 * Options specific to Name fields.
 * @see ./fields/types/name/NameType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/name/NameType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/name/NameType.js}
 */
export interface KeystoneNameFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically Name */
	type: KeystoneNameTypeConstructor;
	/** Default value for the name field. */
	default?: { first: string; last: string };
}

/**
 * Interface for Name field instances.
 * @see ./fields/types/name/NameType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/name/NameType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/name/NameType.js}
 */
export interface KeystoneNameField extends KeystoneField {
	/** The native JavaScript type constructor (Object). */
	_nativeType: ObjectConstructor;
	/** Field-specific options. */
	options: KeystoneNameFieldOptions;
}

/**
 * Constructor for Name field type.
 * @see ./fields/types/name/NameType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/name/NameType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/name/NameType.js}
 */
export interface KeystoneNameTypeConstructor
	extends KeystoneFieldTypeConstructor {
	/** Creates a new Name field instance. */
	new (
		list: KeystoneList,
		path: string,
		options?: KeystoneNameFieldOptions
	): KeystoneNameField;
}

// Money
/**
 * Options specific to Money fields.
 * @see ./fields/types/money/MoneyType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/money/MoneyType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/money/MoneyType.js}
 */
export interface KeystoneMoneyFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically Money */
	type: KeystoneMoneyTypeConstructor | NumberConstructor;
	/** Format string for displaying the money value. Defaults to '$0,0.00'. */
	format?: string;
}

/**
 * Interface for Money field instances.
 * @see ./fields/types/money/MoneyType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/money/MoneyType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/money/MoneyType.js}
 */
export interface KeystoneMoneyField extends KeystoneField {
	/** The native JavaScript type constructor (Number). */
	_nativeType: NumberConstructor;
	/** Field-specific options. */
	options: KeystoneMoneyFieldOptions;
	/** Format string for displaying the money value. */
	_formatString: string;
}

/**
 * Constructor for Money field type.
 * @see ./fields/types/money/MoneyType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/money/MoneyType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/money/MoneyType.js}
 */
export interface KeystoneMoneyTypeConstructor
	extends KeystoneFieldTypeConstructor {
	/** Creates a new Money field instance. */
	new (
		list: KeystoneList,
		path: string,
		options?: KeystoneMoneyFieldOptions
	): KeystoneMoneyField;
}

// Email
/**
 * Options specific to Email fields.
 * @see ./fields/types/email/EmailType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/email/EmailType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/email/EmailType.js}
 */
export interface KeystoneEmailFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically Email */
	type: KeystoneEmailTypeConstructor | StringConstructor;
}

/**
 * Interface for Email field instances.
 * @see ./fields/types/email/EmailType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/email/EmailType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/email/EmailType.js}
 */
export interface KeystoneEmailField extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Field-specific options. */
	options: KeystoneEmailFieldOptions;
	/** Description of the field type. */
	typeDescription: string;
}

/**
 * Constructor for Email field type.
 * @see ./fields/types/email/EmailType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/email/EmailType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/email/EmailType.js}
 */
export interface KeystoneEmailTypeConstructor
	extends KeystoneFieldTypeConstructor {
	/** Creates a new Email field instance. */
	new (
		list: KeystoneList,
		path: string,
		options?: KeystoneEmailFieldOptions
	): KeystoneEmailField;
}

// --- Middleware Types ---

/**
 * CORS middleware for Keystone
 * @see ./lib/middleware/cors.js
 * @todo Define signature from lib/middleware/cors.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/middleware/cors.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/middleware/cors.js}
 *
 */

/**
 * API middleware for Keystone
 * @see ./lib/middleware/api.js
 * @todo Define signature from lib/middleware/api.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/middleware/api.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/middleware/api.js}
 *
 */

/**
 * Language middleware for Keystone
 * @see ./lib/middleware/language.js
 * @todo Define signature from lib/middleware/language.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/middleware/language.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/middleware/language.js}
 *
 */

// --- Core Types ---

/**
 * Safe require utility
 * @see ./lib/safeRequire.js
 * @todo Define signature from lib/safeRequire.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/safeRequire.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/safeRequire.js}
 *
 */

/**
 * Updates system for Keystone
 * @see ./lib/updates.js
 * @todo Define signature from lib/updates.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/updates.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/updates.js}
 *
 */

/**
 * Database connection management
 * @see ./lib/core/closeDatabaseConnection.js
 * @todo Define signature from lib/core/closeDatabaseConnection.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/closeDatabaseConnection.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/closeDatabaseConnection.js}
 *
 */

/**
 * URL redirection system
 * @see ./lib/core/redirect.js
 * @todo Define signature from lib/core/redirect.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/redirect.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/redirect.js}
 *
 */

/**
 * Server startup
 * @see ./lib/core/start.js
 * @todo Define signature from lib/core/start.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/start.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/start.js}
 *
 */

/**
 * Database configuration
 * @see ./lib/core/initDatabaseConfig.js
 * @todo Define signature from lib/core/initDatabaseConfig.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/initDatabaseConfig.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/initDatabaseConfig.js}
 *
 */

/**
 * Express app initialization
 * @see ./lib/core/initExpressApp.js
 * @todo Define signature from lib/core/initExpressApp.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/initExpressApp.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/initExpressApp.js}
 *
 */

/**
 * Item creation system
 * @see ./lib/core/createItems.js
 * @todo Define signature from lib/core/createItems.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/createItems.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/createItems.js}
 *
 */

/**
 * Database connection opening
 * @see ./lib/core/openDatabaseConnection.js
 * @todo Define signature from lib/core/openDatabaseConnection.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/openDatabaseConnection.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/openDatabaseConnection.js}
 *
 */

/**
 * Options management
 * @see ./lib/core/options.js
 * @todo Define signature from lib/core/options.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/options.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/options.js}
 *
 */

/**
 * Navigation initialization
 * @see ./lib/core/initNav.js
 * @todo Define signature from lib/core/initNav.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/initNav.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/initNav.js}
 *
 */

/**
 * Module importer
 * @see ./lib/core/importer.js
 * @todo Define signature from lib/core/importer.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/importer.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/importer.js}
 *
 */

/**
 * List management
 * @see ./lib/core/list.js
 * @todo Define signature from lib/core/list.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/list.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/list.js}
 *
 */

/**
 * Core initialization
 * @see ./lib/core/init.js
 * @todo Define signature from lib/core/init.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/init.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/init.js}
 *
 */

/**
 * Related item population
 * @see ./lib/core/populateRelated.js
 * @todo Define signature from lib/core/populateRelated.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/populateRelated.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/populateRelated.js}
 *
 */

/**
 * Router creation
 * @see ./lib/core/createRouter.js
 * @todo Define signature from lib/core/createRouter.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/createRouter.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/createRouter.js}
 *
 */

/**
 * HTML error wrapper
 * @see ./lib/core/wrapHTMLError.js
 * @todo Define signature from lib/core/wrapHTMLError.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/wrapHTMLError.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/wrapHTMLError.js}
 *
 */

/**
 * Hash creation
 * @see ./lib/core/createKeystoneHash.js
 * @todo Define signature from lib/core/createKeystoneHash.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/createKeystoneHash.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/createKeystoneHash.js}
 *
 */

/**
 * Express session initialization
 * @see ./lib/core/initExpressSession.js
 * @todo Define signature from lib/core/initExpressSession.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/initExpressSession.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/initExpressSession.js}
 *
 */

/**
 * Orphaned list detection
 * @see ./lib/core/getOrphanedLists.js
 * @todo Define signature from lib/core/getOrphanedLists.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/core/getOrphanedLists.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/core/getOrphanedLists.js}
 *
 */

// --- Security Types ---

/**
 * Frame guard middleware
 * @see ./lib/security/frameGuard.js
 * @todo Define signature from lib/security/frameGuard.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/security/frameGuard.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/security/frameGuard.js}
 *
 */

/**
 * IP range restriction
 * @see ./lib/security/ipRangeRestrict.js
 * @todo Define signature from lib/security/ipRangeRestrict.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/security/ipRangeRestrict.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/security/ipRangeRestrict.js}
 *
 */

/**
 * CSRF protection
 * @see ./lib/security/csrf.js
 * @todo Define signature from lib/security/csrf.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/security/csrf.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/security/csrf.js}
 *
 */

/**
 * Excel value escaping
 * @see ./lib/security/escapeValueForExcel.js
 * @todo Define signature from lib/security/escapeValueForExcel.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/security/escapeValueForExcel.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/security/escapeValueForExcel.js}
 *
 */

// --- Schema Plugin Types ---

/**
 * Sortable plugin
 * @see ./lib/schemaPlugins/sortable.js
 * @todo Define signature from lib/schemaPlugins/sortable.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/schemaPlugins/sortable.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/schemaPlugins/sortable.js}
 *
 */

/**
 * Transform plugin
 * @see ./lib/schemaPlugins/options/transform.js
 * @todo Define signature from lib/schemaPlugins/options/transform.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/schemaPlugins/options/transform.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/schemaPlugins/options/transform.js}
 *
 */

/**
 * Tracking plugin
 * @see ./lib/schemaPlugins/track.js
 * @todo Define signature from lib/schemaPlugins/track.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/schemaPlugins/track.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/schemaPlugins/track.js}
 *
 */

/**
 * Related item methods
 * @see ./lib/schemaPlugins/methods/getRelated.js
 * @todo Define signature from lib/schemaPlugins/methods/getRelated.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/schemaPlugins/methods/getRelated.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/schemaPlugins/methods/getRelated.js}
 *
 */

/**
 * Related item population methods
 * @see ./lib/schemaPlugins/methods/populateRelated.js
 * @todo Define signature from lib/schemaPlugins/methods/populateRelated.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/schemaPlugins/methods/populateRelated.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/schemaPlugins/methods/populateRelated.js}
 *
 */

/**
 * Autokey plugin
 * @see ./lib/schemaPlugins/autokey.js
 * @todo Define signature from lib/schemaPlugins/autokey.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/schemaPlugins/autokey.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/schemaPlugins/autokey.js}
 *
 */

/**
 * History plugin
 * @see ./lib/schemaPlugins/history.js
 * @todo Define signature from lib/schemaPlugins/history.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/schemaPlugins/history.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/schemaPlugins/history.js}
 *
 */

// --- Content Types ---

/**
 * HTML content type
 * @see ./lib/content/types/html.js
 * @todo Define signature from lib/content/types/html.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/content/types/html.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/content/types/html.js}
 *
 */

/**
 * Content type index
 * @see ./lib/content/types/index.js
 * @todo Define signature from lib/content/types/index.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/content/types/index.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/content/types/index.js}
 *
 */

/**
 * Text content type
 * @see ./lib/content/types/text.js
 * @todo Define signature from lib/content/types/text.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/content/types/text.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/content/types/text.js}
 *
 */

/**
 * Base content type
 * @see ./lib/content/type.js
 * @todo Define signature from lib/content/type.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/content/type.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/content/type.js}
 *
 */

/**
 * Content page
 * @see ./lib/content/page.js
 * @todo Define signature from lib/content/page.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/content/page.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/content/page.js}
 *
 */

/**
 * Content index
 * @see ./lib/content/index.js
 * @todo Define signature from lib/content/index.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/content/index.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/content/index.js}
 *
 */

// --- Field Types ---

/**
 * Field types index
 * @see ./lib/fieldTypes.js
 * @todo Define signature from lib/fieldTypes.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/fieldTypes.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/fieldTypes.js}
 *
 */

// --- List Types ---

/**
 * List implementation
 * @see ./lib/list.js
 * @todo Define signature from lib/list.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list.js}
 *
 */

// --- Storage Types ---

/**
 * Storage system
 * @see ./lib/storage/index.js
 * @todo Define signature from lib/storage/index.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/storage/index.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/storage/index.js}
 *
 */

/**
 * File system storage adapter
 * @see ./lib/storage/adapters/fs/index.js
 * @todo Define signature from lib/storage/adapters/fs/index.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/storage/adapters/fs/index.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/storage/adapters/fs/index.js}
 *
 */

// --- Upload Types ---

/**
 * Upload handling
 * @see ./lib/uploads.js
 * @todo Define signature from lib/uploads.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/uploads.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/uploads.js}
 *
 */

// --- List Method Types ---

/**
 * Document name getter
 * @see ./lib/list/getDocumentName.js
 * @todo Define signature from lib/list/getDocumentName.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/getDocumentName.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/getDocumentName.js}
 *
 */

/**
 * Column expansion
 * @see ./lib/list/expandColumns.js
 * @todo Define signature from lib/list/expandColumns.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/expandColumns.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/expandColumns.js}
 *
 */

/**
 * Query filter addition
 * @see ./lib/list/addFiltersToQuery.js
 * @todo Define signature from lib/list/addFiltersToQuery.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/addFiltersToQuery.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/addFiltersToQuery.js}
 *
 */

/**
 * Data retrieval
 * @see ./lib/list/getData.js
 * @todo Define signature from lib/list/getData.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/getData.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/getData.js}
 *
 */

/**
 * Filter pAdminUiFieldReactessing
 * @see ./lib/list/processFilters.js
 * @todo Define signature from lib/list/processFilters.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/processFilters.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/processFilters.js}
 *
 */

/**
 * Search query addition
 * @see ./lib/list/addSearchToQuery.js
 * @todo Define signature from lib/list/addSearchToQuery.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/addSearchToQuery.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/addSearchToQuery.js}
 *
 */

/**
 * Field management
 * @see ./lib/list/field.js
 * @todo Define signature from lib/list/field.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/field.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/field.js}
 *
 */

/**
 * Options retrieval
 * @see ./lib/list/getOptions.js
 * @todo Define signature from lib/list/getOptions.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/getOptions.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/getOptions.js}
 *
 */

/**
 * Pagination
 * @see ./lib/list/paginate.js
 * @todo Define signature from lib/list/paginate.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/paginate.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/paginate.js}
 *
 */

/**
 * API response generation
 * @see ./lib/list/apiForGet.js
 * @todo Define signature from lib/list/apiForGet.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/apiForGet.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/apiForGet.js}
 *
 */

/**
 * Relationship management
 * @see ./lib/list/relationship.js
 * @todo Define signature from lib/list/relationship.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/relationship.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/relationship.js}
 *
 */

/**
 * List registration
 * @see ./lib/list/register.js
 * @todo Define signature from lib/list/register.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/register.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/register.js}
 *
 */

/**
 * Admin URL generation
 * @see ./lib/list/getAdminURL.js
 * @todo Define signature from lib/list/getAdminURL.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/getAdminURL.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/getAdminURL.js}
 *
 */

/**
 * Underscore method addition
 * @see ./lib/list/underscoreMethod.js
 * @todo Define signature from lib/list/underscoreMethod.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/underscoreMethod.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/underscoreMethod.js}
 *
 */

/**
 * Field addition
 * @see ./lib/list/add.js
 * @todo Define signature from lib/list/add.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/add.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/add.js}
 *
 */

/**
 * Text index management
 * @see ./lib/list/ensureTextIndex.js
 * @todo Define signature from lib/list/ensureTextIndex.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/ensureTextIndex.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/ensureTextIndex.js}
 *
 */

/**
 * Sort expansion
 * @see ./lib/list/expandSort.js
 * @todo Define signature from lib/list/expandSort.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/expandSort.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/expandSort.js}
 *
 */

/**
 * Option setting
 * @see ./lib/list/set.js
 * @todo Define signature from lib/list/set.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/set.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/set.js}
 *
 */

/**
 * CSV data generation
 * @see ./lib/list/getCSVData.js
 * @todo Define signature from lib/list/getCSVData.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/getCSVData.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/getCSVData.js}
 *
 */

/**
 * Automatic field mapping
 * @see ./lib/list/automap.js
 * @todo Define signature from lib/list/automap.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/automap.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/automap.js}
 *
 */

/**
 * Search filter generation
 * @see ./lib/list/getSearchFilters.js
 * @todo Define signature from lib/list/getSearchFilters.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/getSearchFilters.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/getSearchFilters.js}
 *
 */

/**
 * Text index declaration check
 * @see ./lib/list/declaresTextIndex.js
 * @todo Define signature from lib/list/declaresTextIndex.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/declaresTextIndex.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/declaresTextIndex.js}
 *
 */

/**
 * Column selection
 * @see ./lib/list/selectColumns.js
 * @todo Define signature from lib/list/selectColumns.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/selectColumns.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/selectColumns.js}
 *
 */

/**
 * Reserved path check
 * @see ./lib/list/isReserved.js
 * @todo Define signature from lib/list/isReserved.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/isReserved.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/isReserved.js}
 *
 */

/**
 * Page calculation
 * @see ./lib/list/getPages.js
 * @todo Define signature from lib/list/getPages.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/getPages.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/getPages.js}
 *
 */

/**
 * Path expansion
 * @see ./lib/list/expandPaths.js
 * @todo Define signature from lib/list/expandPaths.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/expandPaths.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/expandPaths.js}
 *
 */

/**
 * Item updating
 * @see ./lib/list/updateItem.js
 * @todo Define signature from lib/list/updateItem.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/updateItem.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/updateItem.js}
 *
 */

/**
 * Field mapping
 * @see ./lib/list/map.js
 * @todo Define signature from lib/list/map.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/map.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/map.js}
 *
 */

/**
 * Text index building
 * @see ./lib/list/buildSearchTextIndex.js
 * @todo Define signature from lib/list/buildSearchTextIndex.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/buildSearchTextIndex.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/buildSearchTextIndex.js}
 *
 */

/**
 * Unique value generation
 * @see ./lib/list/getUniqueValue.js
 * @todo Define signature from lib/list/getUniqueValue.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/list/getUniqueValue.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/list/getUniqueValue.js}
 *
 */

// --- Utility Types ---

/**
 * Path handling
 * @see ./lib/path.js
 * @todo Define signature from lib/path.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/path.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/path.js}
 *
 */

/**
 * View rendering
 * @see ./lib/view.js
 * @todo Define signature from lib/view.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/view.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/view.js}
 *
 */

/**
 * Schema plugins
 * @see ./lib/schemaPlugins.js
 * @todo Define signature from lib/schemaPlugins.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/schemaPlugins.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/schemaPlugins.js}
 *
 */

/**
 * Email handling
 * @see ./lib/email.js
 * @todo Define signature from lib/email.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/lib/email.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/lib/email.js}
 *
 */

/**
 * Password Type
 * @see ./fields/types/password/PasswordType.js
 * @todo Define signature from fields/types/password/PasswordType.js
 *
 * @todo Define signature from fields/types/password/PasswordType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/password/PasswordType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/password/PasswordType.js}
 *
 */

/**
 * TextArray Type
 * @see ./fields/types/textarray/TextArrayType.js
 * @todo Define signature from fields/types/textarray/TextArrayType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/textarray/TextArrayType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/textarray/TextArrayType.js}
 *
 */

/**
 * File Type
 * @see ./fields/types/file/FileType.js
 * @todo Define signature from fields/types/file/FileType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/file/FileType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/file/FileType.js}
 *
 */

// ... Add more field type declarations as needed ...

// --- Field Mixins ---

/**
 * Array field mixin
 * @see ./fields/mixins/ArrayField.js
 * @todo Define signature from fields/mixins/ArrayField.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/mixins/ArrayField.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/mixins/ArrayField.js}
 *
 */

// --- Field Explorer ---

/**
 * Field explorer server
 * @see ./fields/explorer/server.js
 * @todo Define signature from fields/explorer/server.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/explorer/server.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/explorer/server.js}
 *
 */

// --- Field Utilities ---

/**
 * Query presence addition
 * @see ./fields/utils/addPresenceToQuery.js
 * @todo Define signature from fields/utils/addPresenceToQuery.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/utils/addPresenceToQuery.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/utils/addPresenceToQuery.js}
 *
 */

/**
 * Prototype getter definition
 * @see ./fields/utils/definePrototypeGetters.js
 * @todo Define signature from fields/utils/definePrototypeGetters.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/utils/definePrototypeGetters.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/utils/definePrototypeGetters.js}
 *
 */

/**
 * Function binding
 * @see ./fields/utils/bindFunctions.js
 * @todo Define signature from fields/utils/bindFunctions.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/utils/bindFunctions.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/utils/bindFunctions.js}
 *
 */

/**
 * Dependency evaluation
 * @see ./fields/utils/evalDependsOn.js
 * @todo Define signature from fields/utils/evalDependsOn.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/utils/evalDependsOn.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/utils/evalDependsOn.js}
 *
 */

/**
 * Options specific to Password fields.
 * @see ./fields/types/password/PasswordType.js
 */
export interface KeystonePasswordFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically Password */
	type: KeystonePasswordTypeConstructor;
	/** Minimum password length. Default: 8 */
	min?: number;
	/** Maximum password length. Default: 72 */
	max?: number;
	/** BCrypt work factor. Default: 10 */
	workFactor?: number;
	/** Whether to reject common passwords. Default: true */
	rejectCommon?: boolean;
	/** Path for the confirm field. Default: path + '_confirm' */
	confirmPath?: string;
	/** Path for the hash field. Default: path + '_hash' */
	hashPath?: string;
	/** Password complexity requirements */
	complexity?: {
		/** Require at least one digit */
		digitChar?: boolean;
		/** Require at least one special character */
		spChar?: boolean;
		/** Only allow ASCII characters */
		asciiChar?: boolean;
		/** Require at least one lowercase character */
		lowChar?: boolean;
		/** Require at least one uppercase character */
		upperChar?: boolean;
	};
}

/**
 * Interface for Password field instances.
 * @see ./fields/types/password/PasswordType.js
 */
export interface KeystonePasswordField extends KeystoneField {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Underscore methods added to documents (includes 'format', 'compare'). */
	_underscoreMethods: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "full";
	/** Field-specific options. */
	options: KeystonePasswordFieldOptions;
	/** Paths for virtual fields */
	paths: {
		/** Path for password confirmation field */
		confirm: string;
		/** Path for password hash field */
		hash: string;
	};

	/**
	 * Compares a candidate password with the stored hash.
	 * @param item The Mongoose document.
	 * @param candidate The password to check.
	 * @param callback Receives (err: Error | null, isMatch: boolean).
	 */
	compare(
		item: any,
		candidate: string,
		callback: (err: Error | null, isMatch: boolean) => void
	): void;

	/**
	 * Formats the password as a random number of asterisks.
	 * @param item The Mongoose document.
	 * @returns A string of random-length asterisks.
	 */
	format(item: any): string;

	/**
	 * Validates the password against complexity requirements.
	 * @param data Input data.
	 * @param callback Receives (isValid: boolean, message: string).
	 */
	validateInput(
		data: any,
		callback: (isValid: boolean, message: string) => void
	): void;

	/**
	 * Validation method for password requirements.
	 */
	validate(
		pass: string,
		confirm: string | undefined,
		min: number,
		max: number,
		complexity: KeystonePasswordFieldOptions["complexity"],
		rejectCommon: boolean
	): { result: boolean; detail: string };
}

/**
 * Constructor for Password field type.
 * @see ./fields/types/password/PasswordType.js
 */
export interface KeystonePasswordTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystonePasswordFieldOptions
	): KeystonePasswordField;
	prototype: KeystonePasswordField;
	properName: "Password";
	/** Static validation method */
	validate(
		pass: string,
		confirm: string | undefined,
		min: number,
		max: number,
		complexity: KeystonePasswordFieldOptions["complexity"],
		rejectCommon: boolean
	): { result: boolean; detail: string };
}

/**
 * Options specific to Relationship fields.
 * @see ./fields/types/relationship/RelationshipType.js
 */
export interface KeystoneRelationshipFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically Relationship */
	type: KeystoneRelationshipTypeConstructor;
	/** The List key to relate to (required) */
	ref: string;
	/** Whether this is a many-to-many relationship */
	many?: boolean;
	/** Filters to apply to the reference list */
	filters?: Record<string, any>;
	/** Whether to allow creating related items inline */
	createInline?: boolean;
	/** Path for the refList virtual. Default: path + 'RefList' */
	refListPath?: string;
}

/**
 * Interface for Relationship field instances.
 * @see ./fields/types/relationship/RelationshipType.js
 */
export interface KeystoneRelationshipField extends KeystoneField {
	/** Whether this is a many-to-many relationship */
	many: boolean;
	/** Filters to apply to the reference list */
	filters: Record<string, any>;
	/** Whether to allow creating related items inline */
	createInline: boolean;
	/** Default size for the field in the Admin UI */
	_defaultSize: "full";
	/** The native Mongoose type (ObjectId) */
	_nativeType: typeof mongoose.Schema.Types.ObjectId;
	/** Underscore methods added to documents */
	_underscoreMethods: string[];
	/** Properties exposed to Admin UI */
	_properties: string[];
	/** Field-specific options */
	options: KeystoneRelationshipFieldOptions;
	/** Paths for virtual fields */
	paths: {
		/** Path for the refList virtual */
		refList: string;
	};

	/**
	 * Gets properties to pass to the React field component.
	 * @returns Properties object with refList info.
	 */
	getProperties(): {
		refList: {
			singular: string;
			plural: string;
			path: string;
			key: string;
		};
	};

	/**
	 * Gets expanded data for related items.
	 * @param item The Mongoose document.
	 * @returns Array of objects with id and name for many relationships, or single object for one-to-one.
	 */
	getExpandedData(
		item: any
	):
		| Array<{ id: string; name: string }>
		| { id: string; name: string }
		| undefined;

	/**
	 * Formats the field value as a string.
	 * @param item The Mongoose document.
	 * @returns Comma-separated IDs for many relationships, or single ID for one-to-one.
	 */
	format(item: any): string;
}

/**
 * Constructor for Relationship field type.
 * @see ./fields/types/relationship/RelationshipType.js
 */
export interface KeystoneRelationshipTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneRelationshipFieldOptions
	): KeystoneRelationshipField;
	prototype: KeystoneRelationshipField;
	properName: "Relationship";
}

/**
 * Storage adapter interface for File fields.
 */
export interface KeystoneFileStorage {
	/** Schema for storing file data */
	schema: Record<string, any>;
	/** Uploads a file and returns file data */
	uploadFile(
		file: { path: string },
		callback: (err: Error | null, result?: any) => void
	): void;
	/** Removes a stored file */
	removeFile(file: any): void;
}

/**
 * Options specific to File fields.
 * @see ./fields/types/file/FileType.js
 */
export interface KeystoneFileFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically File */
	type: KeystoneFileTypeConstructor;
	/** Storage adapter for handling file uploads (required) */
	storage: KeystoneFileStorage;
}

/**
 * Interface for File field instances.
 * @see ./fields/types/file/FileType.js
 */
export interface KeystoneFileField extends Omit<KeystoneField, "options"> {
	/** Underscore methods added to documents */
	_underscoreMethods: ["format", "upload", "remove", "reset"];
	/** Fixed size for the field in the Admin UI */
	_fixedSize: "full";
	/** Storage adapter instance */
	storage: KeystoneFileStorage;
	/** Field-specific options */
	options: KeystoneFileFieldOptions;
	/** Paths for file data fields from storage schema */
	paths: Record<string, string>;

	/**
	 * Uploads a new file.
	 * @param item The Mongoose document.
	 * @param file The uploaded file object.
	 * @param callback Receives (err: Error | null, result?: any).
	 */
	upload(
		item: any,
		file: { path: string },
		callback: (err: Error | null, result?: any) => void
	): void;

	/**
	 * Resets the field value.
	 * @param item The Mongoose document.
	 */
	reset(item: any): void;

	/**
	 * Deletes the stored file and resets the field value.
	 * @param item The Mongoose document.
	 */
	remove(item: any): void;

	/**
	 * Formats the field value.
	 * @param item The Mongoose document.
	 * @returns The filename or empty string.
	 */
	format(item: any): string;

	/**
	 * Detects whether the field has been modified.
	 * @param item The Mongoose document.
	 * @returns Whether any file data paths have been modified.
	 */
	isModified(item: any): boolean;
}

/**
 * Constructor for File field type.
 * @see ./fields/types/file/FileType.js
 */
export interface KeystoneFileTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneFileFieldOptions
	): KeystoneFileField;
	prototype: KeystoneFileField;
	properName: "File";
}

/**
 * Options specific to TextArray fields.
 * @see ./fields/types/textarray/TextArrayType.js
 */
export interface KeystoneTextArrayFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically TextArray */
	type: KeystoneTextArrayTypeConstructor;
	/** Separator used when formatting array values. Default: ' | ' */
	separator?: string;
}

/**
 * Interface for TextArray field instances.
 * @see ./fields/types/textarray/TextArrayType.js
 */
export interface KeystoneTextArrayField extends KeystoneField {
	/** The native JavaScript type constructor (Array of String) */
	_nativeType: [StringConstructor];
	/** Underscore methods added to documents */
	_underscoreMethods: string[];
	/** Separator used when formatting array values */
	separator: string;
	/** Field-specific options */
	options: KeystoneTextArrayFieldOptions;

	/**
	 * Formats the array value as a string.
	 * @param item The Mongoose document.
	 * @param separator Optional separator to override the default.
	 * @returns The joined string.
	 */
	format(item: any, separator?: string): string;
}

/**
 * Constructor for TextArray field type.
 * @see ./fields/types/textarray/TextArrayType.js
 */
export interface KeystoneTextArrayTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneTextArrayFieldOptions
	): KeystoneTextArrayField;
	prototype: KeystoneTextArrayField;
	properName: "TextArray";
}

/**
 * Options specific to NumberArray fields.
 * @see ./fields/types/numberarray/NumberArrayType.js
 */
export interface KeystoneNumberArrayFieldOptions extends KeystoneFieldOptions {
	/** Ensure type is specifically NumberArray */
	type: KeystoneNumberArrayTypeConstructor;
	/** Numeral.js format string or false to disable formatting. Default: '0,0[.][000000000000]' */
	format?: string | false;
	/** Separator used when formatting array values. Default: ' | ' */
	separator?: string;
}

/**
 * Interface for NumberArray field instances.
 * @see ./fields/types/numberarray/NumberArrayType.js
 */
export interface KeystoneNumberArrayField extends KeystoneField {
	/** The native JavaScript type constructor (Array of Number) */
	_nativeType: [NumberConstructor];
	/** Underscore methods added to documents */
	_underscoreMethods: string[];
	/** Numeral.js format string or false if formatting disabled */
	_formatString: string | false;
	/** Default size for the field in the Admin UI */
	_defaultSize: "small";
	/** Separator used when formatting array values */
	separator: string;
	/** Field-specific options */
	options: KeystoneNumberArrayFieldOptions;

	/**
	 * Formats the array value as a string.
	 * @param item The Mongoose document.
	 * @param format Optional format string to override the default.
	 * @param separator Optional separator to override the default.
	 * @returns The formatted string.
	 */
	format(item: any, format?: string, separator?: string): string;
}

/**
 * Constructor for NumberArray field type.
 * @see ./fields/types/numberarray/NumberArrayType.js
 */
export interface KeystoneNumberArrayTypeConstructor
	extends KeystoneFieldTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneNumberArrayFieldOptions
	): KeystoneNumberArrayField;
	prototype: KeystoneNumberArrayField;
	properName: "NumberArray";
}

/**
 * Options specific to Location fields.
 * @see ./fields/types/location/LocationType.js
 */
export interface KeystoneLocationFieldOptions
	extends Omit<KeystoneFieldOptions, "type" | "required"> {
	/** Ensure type is specifically Location */
	type: KeystoneLocationTypeConstructor;
	/** Enable Google Maps API integration for geocoding */
	enableImprove?: boolean;
	/** Default values for location fields */
	defaults?: {
		number?: string;
		name?: string;
		street1?: string;
		street2?: string;
		suburb?: string;
		state?: string;
		postcode?: string;
		country?: string;
	};
	/** Required location fields (defaults to ['street1', 'suburb']) */
	required?: string[] | string;
}

/**
 * Interface for Location field instances.
 * @see ./fields/types/location/LocationType.js
 */
export interface KeystoneLocationField extends Omit<KeystoneField, "options"> {
	/** Underscore methods added to documents */
	_underscoreMethods: string[];
	/** Fixed size for the field in the Admin UI */
	_fixedSize: "full";
	/** Properties exposed to Admin UI */
	_properties: string[];
	/** Whether Google Maps API integration is enabled */
	enableMapsAPI: boolean;
	/** Required location fields */
	requiredPaths: string[];
	/** Field-specific options */
	options: KeystoneLocationFieldOptions;
	/** Paths for location fields and virtuals */
	paths: {
		number: string;
		name: string;
		street1: string;
		street2: string;
		suburb: string;
		state: string;
		postcode: string;
		country: string;
		geo: string;
		geo_lat: string;
		geo_lng: string;
		serialised: string;
		improve: string;
		overwrite: string;
	};

	/**
	 * Formats selected location fields as a string.
	 * @param item The Mongoose document.
	 * @param values Optional space-separated list of fields to include.
	 * @param delimiter Optional delimiter (default: ', ').
	 * @returns The formatted location string.
	 */
	format(item: any, values?: string, delimiter?: string): string;

	/**
	 * Performs a Google Maps geocoding lookup.
	 * @param item The Mongoose document.
	 * @param region Optional region bias.
	 * @param callback Receives (err: Error | null, location?: any, result?: any).
	 */
	googleLookup(
		item: any,
		region: string,
		callback: (err: Error | null, location?: any, result?: any) => void
	): void;

	/**
	 * Calculates the distance in kilometers from this location to another point.
	 * @param item The Mongoose document.
	 * @param point The other point [latitude, longitude].
	 * @returns The distance in kilometers.
	 */
	kmFrom(item: any, point: [number, number]): number;

	/**
	 * Calculates the distance in miles from this location to another point.
	 * @param item The Mongoose document.
	 * @param point The other point [latitude, longitude].
	 * @returns The distance in miles.
	 */
	milesFrom(item: any, point: [number, number]): number;

	/**
	 * Detects whether the field has been modified.
	 * @param item The Mongoose document.
	 * @returns Whether any location fields have been modified.
	 */
	isModified(item: any): boolean;
}

/**
 * Constructor for Location field type.
 * @see ./fields/types/location/LocationType.js
 */
export interface KeystoneLocationTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneLocationFieldOptions
	): KeystoneLocationField;
	prototype: KeystoneLocationField;
	properName: "Location";
}

/**
 * Options specific to GeoPoint fields.
 * @see ./fields/types/geopoint/GeoPointType.js
 */
export interface KeystoneGeoPointFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically GeoPoint */
	type: KeystoneGeoPointTypeConstructor;
}

/**
 * Interface for GeoPoint field instances.
 * @see ./fields/types/geopoint/GeoPointType.js
 */
export interface KeystoneGeoPointField extends Omit<KeystoneField, "options"> {
	/** Fixed size for the field in the Admin UI */
	_fixedSize: "medium";
	/** Field-specific options */
	options: KeystoneGeoPointFieldOptions;

	/**
	 * Gets the field's data from an Item.
	 * @param item The Mongoose document.
	 * @returns Array of [longitude, latitude] or empty array.
	 */
	getData(item: any): number[];

	/**
	 * Formats the field value as "latitude, longitude".
	 * @param item The Mongoose document.
	 * @returns Formatted coordinates or null.
	 */
	format(item: any): string | null;

	/**
	 * Adds geospatial query filters.
	 * @param filter Filter oAdminUiFieldReactptions with center point and distance.
	 * @returns MongoDB query conditions.
	 */
	addFilterToQuery(filter: {
		lat?: number;
		lon?: number;
		distance?: {
			mode: "max" | "min";
			value: number;
		};
	}): Record<string, any>;
}

/**
 * Constructor for GeoPoint field type.
 * @see ./fields/types/geopoint/GeoPointType.js
 */
export interface KeystoneGeoPointTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneGeoPointFieldOptions
	): KeystoneGeoPointField;
	prototype: KeystoneGeoPointField;
	properName: "GeoPoint";
}

/**
 * Options specific to Code fields.
 * @see ./fields/types/code/CodeType.js
 */
export interface KeystoneCodeFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically Code */
	type: KeystoneCodeTypeConstructor;
	/** Height of the code editor in pixels. Default: 180 */
	height?: number;
	/** Programming language for syntax highlighting */
	lang?: string;
	/** Alternative to lang */
	language?: string;
	/** CodeMirror editor options */
	codemirror?: Record<string, any>;
}

/**
 * Interface for Code field instances.
 * @see ./fields/types/code/CodeType.js
 */
export interface KeystoneCodeField extends Omit<KeystoneField, "options"> {
	/** The native JavaScript type constructor (String) */
	_nativeType: StringConstructor;
	/** Default size for the field in the Admin UI */
	_defaultSize: "full";
	/** Height of the code editor in pixels */
	height: number;
	/** Programming language for syntax highlighting */
	lang: string;
	/** Properties exposed to Admin UI */
	_properties: string[];
	/** CodeMirror editor options */
	codemirror: Record<string, any>;
	/** Combined editor options */
	editor: Record<string, any>;
	/** Field-specific options */
	options: KeystoneCodeFieldOptions;
}

/**
 * Constructor for Code field type.
 * @see ./fields/types/code/CodeType.js
 */
export interface KeystoneCodeTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneCodeFieldOptions
	): KeystoneCodeField;
	prototype: KeystoneCodeField;
	properName: "Code";
}

/**
 * Options specific to Embedly fields.
 * @see ./fields/types/embedly/EmbedlyType.js
 */
export interface KeystoneEmbedlyFieldOptions
	extends Omit<KeystoneFieldOptions, "type" | "initial"> {
	/** Ensure type is specifically Embedly */
	type: KeystoneEmbedlyTypeConstructor;
	/** Path to the field containing the URL to expand (required) */
	from: string;
	/** Additional options to pass to the Embedly API */
	options?: Record<string, any>;
}

/**
 * Interface for Embedly field instances.
 * @see ./fields/types/embedly/EmbedlyType.js
 */
export interface KeystoneEmbedlyField extends Omit<KeystoneField, "options"> {
	/** Underscore methods added to documents */
	_underscoreMethods: string[];
	/** Fixed size for the field in the Admin UI */
	_fixedSize: "full";
	/** Path to the field containing the URL to expand */
	fromPath: string;
	/** Additional options to pass to the Embedly API */
	embedlyOptions: Record<string, any>;
	/** Field-specific options */
	options: KeystoneEmbedlyFieldOptions;
	/** Paths for embedly data fields */
	paths: {
		exists: string;
		type: string;
		title: string;
		url: string;
		width: string;
		height: string;
		version: string;
		description: string;
		html: string;
		authorName: string;
		authorUrl: string;
		providerName: string;
		providerUrl: string;
		thumbnailUrl: string;
		thumbnailWidth: string;
		thumbnailHeight: string;
	};

	/**
	 * Resets the field value to default state.
	 * @param item The Mongoose document.
	 */
	reset(item: any): void;

	/**
	 * Formats the field value (returns HTML).
	 * @param item The Mongoose document.
	 * @returns The embedded HTML.
	 */
	format(item: any): string;

	/**
	 * Gets the field's data from an Item.
	 * @param item The Mongoose document.
	 * @returns The embedly data object.
	 */
	getData(item: any): Record<string, any>;

	/**
	 * Detects whether the field has been modified.
	 * @param item The Mongoose document.
	 * @returns Whether the URL has changed.
	 */
	isModified(item: any): boolean;
}

/**
 * Constructor for Embedly field type.
 * @see ./fields/types/embedly/EmbedlyType.js
 */
export interface KeystoneEmbedlyTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneEmbedlyFieldOptions
	): KeystoneEmbedlyField;
	prototype: KeystoneEmbedlyField;
	properName: "Embedly";
}

/**
 * Options specific to CloudinaryImage fields.
 * @see ./fields/types/cloudinaryimage/CloudinaryImageType.js
 */
export interface KeystoneCloudinaryImageFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically CloudinaryImage */
	type: KeystoneCloudinaryImageTypeConstructor;
	/** Custom folder for storing images */
	folder?: string;
	/** Use original filename as public_id */
	filenameAsPublicID?: boolean;
	/** Function to generate custom filenames */
	generateFilename?: (file: { originalname: string }) => string | undefined;
	/** Behavior when file exists: 'overwrite' or 'retry'. Default: 'overwrite' */
	whenExists?: "overwrite" | "retry";
	/** Number of retry attempts. Default: 3 */
	retryAttempts?: number;
	/** Whether to automatically cleanup old images */
	autoCleanup?: boolean;
	/** Prefix for select field */
	selectPrefix?: string;
}

/**
 * Interface for CloudinaryImage field instances.
 * @see ./fields/types/cloudinaryimage/CloudinaryImageType.js
 */
export interface KeystoneCloudinaryImageField
	extends Omit<KeystoneField, "options"> {
	/** Underscore methods added to documents */
	_underscoreMethods: string[];
	/** Fixed size for the field in the Admin UI */
	_fixedSize: "full";
	/** Properties exposed to Admin UI */
	_properties: string[];
	/** Field-specific options */
	options: KeystoneCloudinaryImageFieldOptions;
	/** Paths for cloudinary data fields */
	paths: {
		public_id: string;
		version: string;
		signature: string;
		format: string;
		resource_type: string;
		url: string;
		width: string;
		height: string;
		secure_url: string;
		exists: string;
		folder: string;
		select: string;
	};

	/**
	 * Gets the folder for images in this field.
	 * @returns The cloudinary folder path.
	 */
	getFolder(): string | null;
}

/**
 * Constructor for CloudinaryImage field type.
 * @see ./fields/types/cloudinaryimage/CloudinaryImageType.js
 */
export interface KeystoneCloudinaryImageTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneCloudinaryImageFieldOptions
	): KeystoneCloudinaryImageField;
	prototype: KeystoneCloudinaryImageField;
	properName: "CloudinaryImage";
}

/**
 * Options specific to CloudinaryImages fields.
 * @see ./fields/types/cloudinaryimages/CloudinaryImagesType.js
 */
export interface KeystoneCloudinaryImagesFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically CloudinaryImages */
	type: KeystoneCloudinaryImagesTypeConstructor;
	/** Custom folder for storing images */
	folder?: string;
	/** Use original filename as public_id */
	filenameAsPublicID?: boolean;
	/** Function to generate custom filenames */
	generateFilename?: (file: { originalname: string }) => string | undefined;
	/** Whether to automatically cleanup old images */
	autoCleanup?: boolean;
	/** Prefix for select field */
	selectPrefix?: string;
}

/**
 * Interface for CloudinaryImages field instances.
 * @see ./fields/types/cloudinaryimages/CloudinaryImagesType.js
 */
export interface KeystoneCloudinaryImagesField
	extends Omit<KeystoneField, "options"> {
	/** Underscore methods added to documents */
	_underscoreMethods: ["format"];
	/** Fixed size for the field in the Admin UI */
	_fixedSize: "full";
	/** Properties exposed to Admin UI */
	_properties: [
		"select",
		"selectPrefix",
		"autoCleanup",
		"publicID",
		"folder",
		"filenameAsPublicID"
	];
	/** Field-specific options */
	options: KeystoneCloudinaryImagesFieldOptions;

	/**
	 * Formats the field value
	 * @param item The Mongoose document
	 * @returns Comma-separated string of image URLs
	 */
	format(item: any): string;

	/**
	 * Gets the field's data from an Item
	 * @param item The Mongoose document
	 * @returns Array of image objects
	 */
	getData(item: any): Array<{
		public_id: string;
		version: number;
		signature: string;
		format: string;
		resource_type: string;
		url: string;
		width: number;
		height: number;
		secure_url: string;
	}>;

	/**
	 * Gets the folder for images in this field
	 * @returns The cloudinary folder path
	 */
	getFolder(): string | null;

	/**
	 * Removes an image from the array
	 * @param item The Mongoose document
	 * @param id The index or public_id of the image to remove
	 * @param method 'remove' or 'delete' - delete will also remove from Cloudinary
	 * @param callback Optional callback function
	 */
	removeImage(
		item: any,
		id: number | string,
		method: "remove" | "delete",
		callback?: (err?: Error) => void
	): void;
}

/**
 * Constructor for CloudinaryImages field type.
 * @see ./fields/types/cloudinaryimages/CloudinaryImagesType.js
 */
export interface KeystoneCloudinaryImagesTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneCloudinaryImagesFieldOptions
	): KeystoneCloudinaryImagesField;
	prototype: KeystoneCloudinaryImagesField;
	properName: "CloudinaryImages";
}

/**
 * Options specific to DateArray fields.
 * @see ./fields/types/datearray/DateArrayType.js
 */
export interface KeystoneDateArrayFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically DateArray */
	type: KeystoneDateArrayTypeConstructor;
	/** Format string for parsing input dates. Default: 'YYYY-MM-DD' */
	parseFormat?: string;
	/** Format string for displaying dates, or false to disable formatting. Default: 'Do MMM YYYY' */
	format?: string | false;
	/** Separator for joining multiple dates in display. Default: ' | ' */
	separator?: string;
}

/**
 * Interface for DateArray field instances.
 * @see ./fields/types/datearray/DateArrayType.js
 */
export interface KeystoneDateArrayField extends Omit<KeystoneField, "options"> {
	/** The native JavaScript type constructor (Array of Dates). */
	_nativeType: [DateConstructor];
	/** Default size for the field in the Admin UI */
	_defaultSize: "medium";
	/** Underscore methods added to documents */
	_underscoreMethods: string[];
	/** Properties exposed to Admin UI */
	_properties: string[];
	/** Format string for parsing input dates */
	parseFormatString: string;
	/** Format string for displaying dates */
	formatString: string | false;
	/** Separator for joining multiple dates in display */
	separator: string;
	/** Field-specific options */
	options: KeystoneDateArrayFieldOptions;

	/**
	 * Formats the field value
	 * @param item The Mongoose document
	 * @param format Optional format string to override field option
	 * @param separator Optional separator to override field option
	 * @returns Formatted date string
	 */
	format(item: any, format?: string, separator?: string): string;

	/**
	 * Validates that the input can be parsed into valid dates
	 * @param data Input data
	 * @param callback Receives whether input is valid
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates that required input has been provided
	 * @param item The Mongoose document
	 * @param data Input data
	 * @param callback Receives whether input is valid
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds date-based filtering logic to a Mongoose query
	 * @param filter Filter oAdminUiFieldReactptions with mode and presence
	 * @returns MongoDB query conditions
	 */
	addFilterToQuery(filter: {
		mode?: "on" | "after" | "before" | "between";
		presence?: "none" | "some";
		value?: string | Date;
		after?: string | Date;
		before?: string | Date;
	}): Record<string, any>;
}

/**
 * Constructor for DateArray field type.
 * @see ./fields/types/datearray/DateArrayType.js
 */
export interface KeystoneDateArrayTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneDateArrayFieldOptions
	): KeystoneDateArrayField;
	prototype: KeystoneDateArrayField;
	properName: "DateArray";
}

/**
 * Filter oAdminUiFieldReactptions for Date field queries.
 * @see ./fields/types/date/DateType.js
 */
export interface KeystoneAdminUiDateFieldReactFilter {
	/**
	 * Filter mAdminUFieldReactiode.
	 * - 'between': Matches dates between 'after' and 'before'.
	 * - 'after': Matches dates after the value.
	 * - 'before': Matches dates before the value.
	 * Default: exact match for the day
	 */
	mode?: "between" | "after" | "before" | string;
	/** The date value(s) to filter by. */
	value?: string | Date;
	/** Start date for 'between' mode. */
	after?: string | Date;
	/** End date for 'between' mode. */
	before?: string | Date;
	/**
	 * Invert the filter logic.
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Options specific to Date fields.
 * @see ./fields/types/date/DateType.js
 */
export interface KeystoneDateFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically Date */
	type: KeystoneDateTypeConstructor | DateConstructor;
	/**
	 * Moment.js format string for output, or `false` to disable formatting.
	 * Default: 'Do MMM YYYY'
	 */
	format?: string | false;
	/**
	 * Moment.js format string for parsing input.
	 * Default: 'YYYY-MM-DD'
	 */
	inputFormat?: string;
	/**
	 * Range of years for date picker (e.g., [2000, 2030] or 10 for +/- 10 years).
	 * Default: 10 (+/- 10 years)
	 */
	yearRange?: number | number[];
	/**
	 * Treat date as UTC.
	 * Default: false
	 */
	utc?: boolean;
	/**
	 * Show 'Today' button in date picker.
	 * Default: true
	 */
	todayButton?: boolean;
	/**
	 * UTC offset (minutes) for correcting potentially corrupted UTC dates on retrieval.
	 * Default: Server's timezone offset
	 */
	timezoneUtcOffsetMinutes?: number;
}

/**
 * Interface for Date field instances.
 * @see ./fields/types/date/DateType.js
 */
export interface KeystoneDateField extends Omit<KeystoneField, "options"> {
	/** The native JavaScript type constructor (Date). */
	_nativeType: DateConstructor;
	/** Underscore methods added to documents (includes 'format', 'moment', 'parse'). */
	// _underscoreMethods: Array<"format" | "moment" | "parse">;
	_underscoreMethods: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "medium";
	/** Properties exposed to Admin UI (includes 'formatString', 'yearRange', 'isUTC', 'inputFormat', 'todayButton'). */
	//CHECK LATER _properties: Array<
	//CHECK LATER 	"formatString" | "yearRange" | "isUTC" | "inputFormat" | "todayButton"
	//CHECK LATER >;
	_properties: string[];
	/** Moment.js format string for parsing input. */
	parseFormatString: string | string[];
	/** Moment.js format string for output, or false to disable. */
	formatString?: string | false;
	/** Year range option for date picker. */
	yearRange?: number | number[];
	/** Whether to treat the date as UTC. */
	isUTC: boolean;
	/** Whether the date picker shows the 'Today' button. */
	todayButton: boolean;
	/** UTC offset used for potential date correction. */
	timezoneUtcOffsetMinutes: number;
	/** Field-specific options. */
	options: KeystoneDateFieldOptions;

	/**
	 * Validates that required input has been provided.
	 * Inherited from TextType.
	 * @param item The Mongoose document.
	 * @param data Input data object.
	 * @param callback Receives whether input is valid.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds date-specific filtering logic to a Mongoose query.
	 * Supports date range filtering with 'between', 'after', 'before' modes.
	 * @param filter The filter definition.
	 * @returns MongoDB query conditions object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiDateFieldReactFilter
	): Record<string, any>;

	/**
	 * Validates that required input has been provided.
	 * @param item The Mongoose document.
	 * @param data Input data.
	 * @param callback Receives whether input is valid.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds date-based filtering logic to a Mongoose query.
	 * @param filter Filter oAdminUiFieldReactptions with mode and presence.
	 * @returns MongoDB query conditions.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiDateFieldReactFilter
	): Record<string, any>;

	/**
	 * (Deprecated) Checks that a valid array of dates has been provided.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Updates the field's value in the item from a data object.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt.
	 */
	updateItem(item: any, data: any, callback: () => void): void;
}

/**
 * Interface for DateTime field instances.
 * @see ./fields/types/datetime/DateTimeType.js
 *
 * Sources:
 * - File path: lib/content/types/text.js
 * - Raw Source Code: {@link https://raw.githubusercontent.com/keystonejs/keystone-classic/refs/heads/master/fields/types/datetime/DateTimeType.js}
 * - GitHub page: {@link https://github.com/keystonejs/keystone-classic/blob/master/fields/types/datetime/DateTimeType.js}
 */
export interface KeystoneDateTimeField extends Omit<KeystoneField, "options"> {
	/** The native JavaScript type constructor (Date). */
	_nativeType: DateConstructor;
	/** Underscore methods added to documents (includes 'format', 'moment', 'parse'). */
	_underscoreMethods: ["format", "moment", "parse"];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "full";
	/** Properties exposed to Admin UI (includes 'formatString', 'isUTC'). */
	_properties: ["formatString", "isUTC"];
	/** Custom type description for the Admin UI. */
	typeDescription: string;
	/** Moment.js format string(s) for parsing input. */
	parseFormatString: string | string[];
	/** Moment.js format string for output, or false to disable. */
	formatString?: string | false;
	/** Whether to treat the date/time as UTC. */
	isUTC: boolean;
	/** Field-specific options. */
	options: KeystoneDateTimeFieldOptions;
	/** Paths for the sub-fields used in the Admin UI. */
	paths: {
		/** Path for the date part input. */
		date: string;
		/** Path for the time part input. */
		time: string;
		/** Path for the timezone offset input. */
		tzOffset: string;
	};

	/**
	 * Gets the value from a data object; may be simple or a pair of fields.
	 * @param data The input data object.
	 * @returns The combined date/time value.
	 */
	getInputFromData(data: any): string | any;

	/**
	 * Validates that required input has been provided.
	 * @param item The Mongoose document.
	 * @param data Input data object.
	 * @param callback Receives whether input is valid.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Validates that the input is a valid date/time.
	 * @param data Input data object.
	 * @param callback Receives whether input is valid.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * (Deprecated) Checks that a valid date/time has been provided.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Updates the field's value in the item from a data object.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt.
	 */
	updateItem(item: any, data: any, callback: () => void): void;

	/**
	 * Formats the field's date/time value using moment.js.
	 * Inherited from DateType.
	 * @param item The Mongoose document.
	 * @param format Optional moment.js format string.
	 * @returns Formatted date/time string.
	 */
	format(item: any, format?: string): string;

	/**
	 * Returns the field's value as a moment.js object.
	 * Inherited from DateType.
	 * @param item The Mongoose document.
	 * @returns A moment object or null.
	 */
	moment(item: any): moment.Moment | null;

	/**
	 * Parses input using moment.js.
	 * Inherited from DateType.
	 * @param value The value to parse.
	 * @param format Optional format string(s).
	 * @param strict Whether to use strict parsing.
	 * @returns A moment object.
	 */
	parse(
		value: any,
		format?: string | string[],
		strict?: boolean
	): moment.Moment;

	/**
	 * Adds date-based filtering logic to a Mongoose query.
	 * Inherited from DateType.
	 * @param filter The filter definition.
	 * @returns MongoDB query conditions object.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiDateFieldReactFilter
	): Record<string, any>;
}

/**
 * Filter oAdminUiFieldReactptions for DateArray field queries.
 * @see ./fields/types/datearray/DateArrayType.js
 */
export interface KeystoneAdminUiDateArrayFieldReactFilter {
	/**
	 * Filter mAdminUFieldReactiode.
	 * - 'between': Matches dates between 'after' and 'before'.
	 * - 'after': Matches dates after the value.
	 * - 'before': Matches dates before the value.
	 * Default: exact match for the day
	 */
	mode?: "between" | "after" | "before" | string;
	/**
	 * Presence mode.
	 * - 'none': No dates match the filter.
	 * - 'some': At least one date matches the filter.
	 * Default: 'some'
	 */
	presence?: "none" | "some";
	/** The date value(s) to filter by. */
	value?: string | Date | moment.Moment;
	/** Start date for 'between' mode. */
	after?: string | Date | moment.Moment;
	/** End date for 'between' mode. */
	before?: string | Date | moment.Moment;
}

/**
 * Options specific to DateArray fields.
 * @see ./fields/types/datearray/DateArrayType.js
 */
export interface KeystoneDateArrayFieldOptions
	extends Omit<KeystoneFieldOptions, "type"> {
	/** Ensure type is specifically DateArray */
	type: KeystoneDateArrayTypeConstructor;
	/**
	 * Moment.js format string for parsing input dates.
	 * Default: 'YYYY-MM-DD'
	 */
	parseFormat?: string;
	/**
	 * Moment.js format string for displaying dates, or false to disable formatting.
	 * Default: 'Do MMM YYYY'
	 */
	format?: string | false;
	/**
	 * Separator for joining multiple dates in display.
	 * Default: ' | '
	 */
	separator?: string;
}

/**
 * Interface for DateArray field instances.
 * @see ./fields/types/datearray/DateArrayType.js
 */
export interface KeystoneDateArrayField extends Omit<KeystoneField, "options"> {
	/** The native JavaScript type constructor (Array of Dates). */
	_nativeType: [DateConstructor];
	/** Default size for the field in the Admin UI. */
	_defaultSize: "medium";
	/** Underscore methods added to documents (includes 'format'). */
	_underscoreMethods: string[];
	/** Properties exposed to Admin UI (includes 'formatString'). */
	_properties: string[];
	/** Format string for parsing input dates. */
	parseFormatString: string;
	/** Format string for displaying dates, or false to disable. */
	formatString: string | false;
	/** Separator for joining multiple dates in display. */
	separator: string;
	/** Field-specific options. */
	options: KeystoneDateArrayFieldOptions;

	/**
	 * Formats the field value.
	 * @param item The Mongoose document.
	 * @param format Optional format string to override field option.
	 * @param separator Optional separator to override field option.
	 * @returns Formatted date string.
	 */
	format(item: any, format?: string, separator?: string): string;

	/**
	 * Validates that the input can be parsed into valid dates.
	 * @param data Input data.
	 * @param callback Receives whether input is valid.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates that required input has been provided.
	 * @param item The Mongoose document.
	 * @param data Input data.
	 * @param callback Receives whether input is valid.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds date-based filtering logic to a Mongoose query.
	 * @param filter Filter oAdminUiFieldReactptions with mode and presence.
	 * @returns MongoDB query conditions.
	 */
	addFilterToQuery(
		filter: KeystoneAdminUiDateArrayFieldReactFilter
	): Record<string, any>;

	/**
	 * (Deprecated) Checks that a valid array of dates has been provided.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Updates the field's value in the item from a data object.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt.
	 */
	updateItem(item: any, data: any, callback: () => void): void;
}

/**
 * Constructor for DateArray field type.
 * @see ./fields/types/datearray/DateArrayType.js
 */
export interface KeystoneDateArrayTypeConstructor
	extends Omit<KeystoneFieldTypeConstructor, "prototype"> {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneDateArrayFieldOptions
	): KeystoneDateArrayField;
	prototype: KeystoneDateArrayField;
	properName: "DateArray";
}

// ... existing code ...
