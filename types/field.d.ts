import * as mongoose from "mongoose";
import {
	KeystoneDocument,
	KeystoneTypeConstructor,
	KeystoneList,
} from "./core";

/**
 * Base configuration options for all Keystone field types.
 * @see /fields/types/Type.js - Base field type implementation
 */
export interface KeystoneFieldOptions {
	/**
	 * The field type constructor (e.g., `keystone.Field.Types.Text`)
	 * or a native JS constructor (`String`, `Number`, `Boolean`, `Date`)
	 * which will be mapped to a default Keystone type.
	 */
	type:
		| KeystoneTypeConstructor
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
	required?: boolean | ((this: any) => boolean) | string | string[];
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
	col?: any;
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
	autoCleanup?: boolean;
	/**
	 * Thumbnail option (likely for file/image fields).
	 * Enables thumbnail rendering in list view for image fields.
	 */
	thumb?: boolean;

	// Allow field-type specific options
	[key: string]: any;
}

/**
 * Base interface for all Keystone field instances.
 * @see /fields/types/Type.js - Base field type implementation
 */
export interface KeystoneField {
	/** Reference to the parent List instance. */
	list: KeystoneList<any>;
	/** The field's path (e.g., 'name', 'address.street'). */
	path: string;
	/** Internal Path object for handling nested paths. @internal */
	_path: any;
	/** The field type name (e.g., 'text', 'relationship'). Set by the Field Type constructor. */
	type: string;
	/** The final, merged options for this field instance. */
	options: KeystoneFieldOptions;
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
	_nativeType?: any;
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
	readonly note: string;
	/** Mongoose schema column definition. */
	readonly col: any;
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
	format(item: any): any;

	/**
	 * Detects whether the field has been modified in an item.
	 * @param item The Mongoose document.
	 * @returns {boolean} True if modified.
	 */
	isModified(item: any): boolean;

	/**
	 * Asynchronously validates provided input data for the field.
	 * Often overridden by specific field types.
	 * @param data The input data object.
	 * @param callback Receives `(isValid: boolean, message?: string)`.
	 */
	validateInput(
		data: any,
		callback: (valid: boolean, message?: string) => void
	): void;

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
	): void;

	/**
	 * (Deprecated) Synchronously checks if input data for the field is valid.
	 * Prefer the async `validateInput` and `validateRequiredInput` methods.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 * @param data Input data.
	 * @param required Is input required?
	 * @param item Optional Mongoose document for context.
	 * @returns {boolean} Validity state.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Updates the field's value in an item based on input data.
	 * Often overridden by specific field types.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

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
	select?: (query: any, options?: any) => void;

	/**
	 * Adds population options to a Mongoose query for this field (e.g., for Relationships).
	 * Can be overridden.
	 * @param query The Mongoose query.
	 * @param options Population options.
	 */
	populate?: (query: any, options?: any) => void;

	/**
	 * Adds filters to a Mongoose query based on this field. Implemented by fields supporting filtering.
	 * @param query The Mongoose query.
	 * @param filter Filter options specific to the field type.
	 */
	addFilterToQuery?: (query: any, filter: any) => void;

	// Allow for type-specific properties/methods from subclasses
	[key: string]: any;
}
