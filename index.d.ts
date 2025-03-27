// Type definitions for KeystoneJS v4 ... fields/types/Type.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: index.js, lib/core/options.js, lib/list.js, lib/list/add.js, lib/list/field.js, fields/types/Type.js

import * as express from 'express';
import * as mongoose from 'mongoose';
import { Hook } from 'grappling-hook'; // @todo: Check if @types/grappling-hook exists or define basic type

// --- Dependencies & Placeholders ---
// import * as utils from 'keystone-utils'; // @todo Get/Define types for keystone-utils
// @todo Define Path class from lib/path.js
// declare class Path { constructor(path: string); get(obj: any, subpath?: string): any; }
// @todo Add types for dependencies: @types/lodash, @types/marked, @types/object-assign, asyncdi?

/**
 * @todo Define more specific types for imported modules instead of 'any' or Function.
 */
// ... (module declarations) ...

// --- Forward Declarations ---
declare class Keystone { /* ... */ }
declare class List { /* ... */ }
declare class Field { /* ... */ } // Base Field definition

// --- Interfaces & Types ---

/** Represents the constructor for a Keystone Field Type (e.g., `Types.Text`). */
interface FieldTypeConstructor {
    /** Creates an instance of the field type. */
    new (list: List, path: string, options: FieldOptions): Field;
    /** The prototype holds methods shared by field instances of this type. */
    prototype: Field;
    /** Canonical name of the field type (e.g., 'Text', 'Relationship'). Used internally. */
    properName?: string;
    /** Technical name (often JS class name, e.g., 'TextType'). Used for `list.fieldTypes`. */
    name?: string; // JS constructor name
}

/** Options object used to define a field within a List. */
interface FieldOptions {
    /** The field type constructor or a native JS constructor. */
    type: FieldTypeConstructor | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor;
    /** Display label for the field in the Admin UI. */
    label?: string;
    /** Custom description for the field type (optional). */
    typeDescription?: string;
    /** Show this field on the create form. */
    initial?: boolean;
    /** Field must have a value. Can be a boolean or a function for conditional requirement. */
    required?: boolean | ((this: any) => boolean); // `this` context is the Mongoose document
    /** Create a MongoDB index for this field. */
    index?: boolean;
    /** Field value must be unique. */
    unique?: boolean;
    /** Help text (markdown) displayed beneath the field. */
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
    /** Deprecated: Use `size`. */
    width?: 'small' | 'medium' | 'large' | 'full';
    /** Width of the field in the Admin UI form. */
    size?: 'small' | 'medium' | 'large' | 'full';
    /** Watch other fields and update this field's value based on changes. */
    watch?: boolean | string | string[] | Record<string, any> | ((item: any) => boolean);
    /** Function to generate the value for watched fields. `this` context is the Mongoose document. */
    value?: (this: any, callback: (err: any, value: any) => void) => void;
    /** Mongoose schema column definition (rarely used directly). */
    col?: any; // @todo Define col type if possible
    /** Exclude from Admin UI list view columns. */
    nocol?: boolean;
    /** Disable sorting by this field in the Admin UI list view. */
    nosort?: boolean;
    /** Indent the field in the Admin UI form. */
    indent?: boolean;
    /** Collapse the field in the Admin UI form by default. */
    collapse?: boolean;
    /** Hide the field from the Admin UI entirely. */
    hidden?: boolean;
    /** Auto cleanup settings (e.g., for relationship fields). */
    autoCleanup?: boolean; // @todo Check usage
    /** Thumbnail option (likely for file/image fields). */
    thumb?: boolean; // @todo Check usage

    // Allow field-type specific options
    [key: string]: any;
}

/** Represents an object defining one or more fields, potentially nested. */
type FieldDefinition = Record<string, FieldOptions | FieldTypeConstructor | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | FieldDefinition>;

/** Represents an object defining a heading in the Admin UI form. */
interface HeadingDefinition { /* ... (definition remains the same) ... */ }

/** Interface representing a Keystone Field instance within a List. Based on `fields/types/Type.js`. */
interface Field {
    /** Reference to the parent List instance. */
    list: List;
    /** The field's path (e.g., 'name', 'address.street'). */
    path: string;
    /** Internal Path object for handling nested paths. @internal */
    _path: any; // Path; // @todo Use Path type when defined
    /** The field type name (e.g., 'text', 'relationship'). Set by the Field Type constructor. */
    type: string;
    /** The final, merged options for this field instance. */
    options: FieldOptions;
    /** Display label for the field. */
    label: string;
    /** Description of the field type (e.g., 'Text', 'Boolean'). */
    typeDescription: string;
    /** Default options specific to the field type. Defined by subclasses. @internal */
    defaults?: Partial<FieldOptions>;
    /** The Mongoose schema definition for this field. */
    schema: mongoose.SchemaDefinition[keyof mongoose.SchemaDefinition]; // More specific than just 'any'

    /** Properties specific to the field type, used for generating Admin UI options. Defined by subclasses. @internal */
    _properties?: string[];
    /** Fixed size for the field type (overrides options). Defined by subclasses. @internal */
    _fixedSize?: 'small' | 'medium' | 'large' | 'full';
    /** Default size for the field type if not specified. Defined by subclasses. @internal */
    _defaultSize?: 'small' | 'medium' | 'large' | 'full';
    /** The underlying Mongoose type constructor (e.g., String, Number, mongoose.Schema.Types.ObjectId). Defined by subclasses. @internal */
    _nativeType?: any;
    /** Underscore methods to bind to the document prototype. Defined by subclasses. @internal */
    _underscoreMethods?: Array<string | { fn: string; as: string }>;

    /** Cached options object for the Admin UI. @internal */
    __options?: Record<string, any> & { hasFilterMethod?: boolean; defaultValue?: any };
    /** Cached size value. @internal */
    __size?: 'small' | 'medium' | 'large' | 'full';

    // --- Prototype Getters ---
    /** Calculated size of the field ('small', 'medium', 'large', 'full'). */
    readonly size: 'small' | 'medium' | 'large' | 'full';
    /** Whether the field is shown on the creation form. */
    readonly initial: boolean;
    /** Whether the field is required. Can be a boolean or a function. */
    readonly required: boolean | ((this: any) => boolean);
    /** The field's help note (HTML). */
    readonly note: string;
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
     * @returns {Record<string, any>} Options object.
     */
    getOptions(): Record<string, any>;

    /**
     * Calculates the size of the field.
     * @returns {'small' | 'medium' | 'large' | 'full'} Field size.
     * @internal Should use the `size` getter externally.
     */
    getSize(): 'small' | 'medium' | 'large' | 'full';

    /**
     * Gets the default value for the field.
     * @returns {any} Default value.
     */
    getDefaultValue(): any;

    /**
     * Gets the field's data from an item.
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
    validateInput(data: any, callback: (valid: boolean, message?: string) => void): void;

    /**
     * Asynchronously validates that required input has been provided for the field.
     * Takes into account existing data in the item.
     * Often overridden by specific field types.
     * @param item The Mongoose document (for checking existing data).
     * @param data The input data object.
     * @param callback Receives `(isValid: boolean, message?: string)`.
     */
    validateRequiredInput(item: any, data: any, callback: (valid: boolean, message?: string) => void): void;

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


// --- UI Element Types ---
/* ... (UIElement definitions remain the same) ... */

/** Options for configuring a Keystone List. */
interface ListOptions { /* ... (definition remains the same) ... */ }

/** Defines the mapping between special list properties and field paths. */
interface ListMappings { /* ... (definition remains the same) ... */ }

/** Interface defining common KeystoneJS configuration options. */
interface KeystoneOptions { /* ... (definition remains the same) ... */ }

// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
    constructor(key: string, options?: ListOptions);
    /* ... (List properties remain largely the same) ... */
    fields: Record<string, Field>; // Now uses the more detailed Field interface
    fieldsArray: Field[];
    fieldTypes: Record<string, string | boolean>;
    relationshipFields: Field[]; // Still potentially RelationshipField[] later
    /* ... (List getters remain the same) ... */
    /* ... (List methods remain the same, referencing the updated Field/FieldOptions) ... */
    field(path: string): Field | undefined;
    field(path: string, options: FieldOptions): Field;
    field(path: string, constructor: FieldTypeConstructor | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor): Field;
    /* ... */
}

/** Represents a KeystoneJS v4 application instance. */
declare class Keystone {
    constructor();
    /* ... */
    /** Base constructor/class for Keystone Fields. Includes the `Types` map. */
    Field: FieldTypeConstructor & {
        Types: {
            Text?: FieldTypeConstructor;
            Number?: FieldTypeConstructor;
            Boolean?: FieldTypeConstructor;
            Datetime?: FieldTypeConstructor;
            Html?: FieldTypeConstructor;
            Relationship?: FieldTypeConstructor;
            Select?: FieldTypeConstructor;
            Date?: FieldTypeConstructor;
            Name?: FieldTypeConstructor;
            Email?: FieldTypeConstructor;
            Password?: FieldTypeConstructor;
            // ... other core types ...
            [key: string]: FieldTypeConstructor | undefined;
        }
    };
    List: typeof List;
    /* ... */
}

/** The singleton Keystone instance. */
declare const keystone: Keystone;
export = keystone;

/*
Usage Instructions:

- You generally don't interact with the base `Field` class directly. You use specific field types from `keystone.Field.Types` when defining lists.
- The `Field` interface defined here serves as the base type for all field instances you might get from `list.field(path)`.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const Product = new keystone.List('Product');

Product.add({
    name: { type: Types.Text, required: true },
    price: { type: Types.Money, required: true, dependsOn: { available: true } },
    available: { type: Types.Boolean, default: true, initial: true },
    description: { type: Types.Textarea, note: 'Markdown is supported!' }
});

Product.register();

const priceField = Product.field('price');

if (priceField) {
    console.log(`Price field path: ${priceField.path}`);
    console.log(`Price label: ${priceField.label}`);
    console.log(`Price dependsOn:`, priceField.dependsOn);
    console.log(`Is price required?`, priceField.required); // Note: required might be a function here!

    // Accessing options used by Admin UI:
    const uiOptions = priceField.getOptions();
    console.log(`Admin UI options for price:`, uiOptions);
}

const descriptionField = Product.field('description');
if (descriptionField) {
    // Access the processed HTML note
    console.log(`Description note (HTML): ${descriptionField.note}`);
}