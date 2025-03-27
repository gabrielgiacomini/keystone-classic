// Type definitions for KeystoneJS v4 ... lib/list/field.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: index.js, lib/core/options.js, lib/list.js, lib/list/add.js, lib/list/field.js

import * as express from 'express';
import * as mongoose from 'mongoose';
import { Hook } from 'grappling-hook'; // @todo: Check if @types/grappling-hook exists or define basic type

// --- Dependencies & Placeholders ---
// import * as utils from 'keystone-utils'; // @todo Get/Define types for keystone-utils
// @todo Define Keystone.Field base class from fields/types/Type.js
// @todo Define specific Field Types (TextType, NumberType etc.) from fields/types/*

/**
 * @todo Define more specific types for imported modules instead of 'any' or Function.
 */
// ... (module declarations) ...

// --- Forward Declarations ---
declare class Keystone { /* ... */ }
declare class List { /* ... */ }
declare class Field { /* ... */ } // Base Field definition needed

// --- Interfaces & Types ---

/**
 * Represents the constructor for a Keystone Field Type (e.g., `Types.Text`).
 * @todo Refine based on the actual base Field class (`fields/types/Type.js`).
 */
interface FieldTypeConstructor {
    /** Creates an instance of the field type. */
    new (list: List, path: string, options: FieldOptions): Field;
    /** The prototype holds methods shared by field instances of this type. */
    prototype: Field;
    /** Canonical name of the field type (e.g., 'Text', 'Relationship'). Used internally. */
    properName?: string;
    /** Technical name (often JS class name, e.g., 'TextType'). Used for `list.fieldTypes`. */
    name?: string;
}

/**
 * Options object used to define a field within a List.
 * @see lib/list/field.js
 * @see lib/list/add.js
 */
interface FieldOptions {
    /**
     * The field type constructor (e.g., `keystone.Field.Types.Text`) or a native JS constructor
     * (`String`, `Number`, `Boolean`, `Date`) which will be mapped to a default Keystone type.
     */
    type: FieldTypeConstructor | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor;
    label?: string;
    initial?: boolean;
    required?: boolean;
    index?: boolean;
    unique?: boolean;
    /** Help text displayed beneath the field in the Admin UI. Also sourced from `list.get('notes')[path]` if not provided. */
    note?: string;
    dependsOn?: Record<string, any>;
    /** Prevent editing the field in the Admin UI. Also inherited from `list.get('noedit')`. */
    noedit?: boolean;
    virtual?: boolean;
    default?: any;
    schema?: Record<string, any>;
    /** Special option for HTML field to enable TinyMCE. */
    wysiwyg?: boolean;
    // Allow field-type specific options
    [key: string]: any;
}

/** Represents an object defining one or more fields, potentially nested. */
type FieldDefinition = Record<string, FieldOptions | FieldTypeConstructor | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | FieldDefinition>;

/** Represents an object defining a heading in the Admin UI form. */
interface HeadingDefinition { /* ... (definition remains the same) ... */ }

/** Basic interface representing a Keystone Field instance within a List. */
interface Field {
    /** The path of the field (e.g., 'name', 'meta.title'). */
    path: string;
    /** The field type name (e.g., 'text', 'relationship'). Set by the Field Type constructor. */
    type: string;
    /** Display label for the field. */
    label: string;
    /** Reference to the parent list. */
    list: List;
    /** The final options object used to configure the field instance. */
    options: FieldOptions;
    /** The part of the Mongoose schema this field adds. */
    schema: mongoose.Schema.Types.Mixed | any; // @todo Type schema part added by the field
    /** Internal storage for original options. */
    __options?: Record<string, any>;

    initial?: boolean;
    noedit?: boolean;
    required?: boolean;
    virtual?: boolean;
    note?: string;
    dependsOn?: Record<string, any>;

    addToQuery: (query: any, options?: any) => void; // @todo Define query and options type
    format: (item: any) => any; // @todo Define item type (Mongoose document)
    validateInput: (data: any, callback: (valid: boolean, message?: string) => void) => void; // @todo Define data type
    updateItem: (item: any, data: any, callback: (err?: Error) => void) => void; // @todo Define item and data types

    /** Adds the field paths to a Mongoose selection object. */
    select?: string; // Common property, e.g., for virtuals needing underlying fields
    /** Adds field paths to the Mongoose query population. */
    populate?: any; // Common property, e.g., for relationships

    [key: string]: any; // Allow for type-specific properties/methods
}

// --- UI Element Types ---
interface FieldUIElement { type: 'field'; field: Field; }
interface HeadingUIElement { type: 'heading'; heading: string; options: HeadingDefinition | Record<string, any>; }
interface IndentUIElement { type: 'indent'; }
interface OutdentUIElement { type: 'outdent'; }
type UIElement = FieldUIElement | HeadingUIElement | IndentUIElement | OutdentUIElement;

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

    keystone: Keystone;
    options: ListOptions;
    key: string;
    path: string;
    schema: mongoose.Schema;
    schemaFields: Array<string | FieldDefinition | HeadingDefinition>;
    uiElements: UIElement[];
    underscoreMethods: Record<string, Function>;
    fields: Record<string, Field>;
    fieldsArray: Field[];
    /**
     * Map of Field Type JS names (e.g., 'TextType', 'wysiwyg') to their proper names (e.g., 'Text', true).
     * Used for client-side script loading optimizations.
     */
    fieldTypes: Record<string, string | boolean>;
    relationshipFields: Field[]; // @todo Use RelationshipField[] type
    relationships: Record<string, { ref: string; refPath: string; path: string; list: List; field: Field }>; // @todo Refine RelationshipDefinition

    mappings: ListMappings;
    model: mongoose.Model<any>; // @todo Define Mongoose Document type

    _searchFields?: Field[];
    _defaultColumns?: Array<{ path: string, field?: Field, type?: string, label?: string, options?: any }>;

    // --- Getters ---
    readonly label: string; /* ... */
    readonly singular: string; /* ... */
    readonly plural: string; /* ... */
    readonly namePath: string; /* ... */
    readonly nameField: Field | undefined; /* ... */
    readonly nameIsVirtual: boolean; /* ... */
    readonly nameFieldIsFormHeader: boolean; /* ... */
    readonly nameIsInitial: boolean; /* ... */
    readonly initialFields: Field[]; /* ... */

    // --- Getter/Setters ---
    searchFields: string | string[]; /* ... */
    defaultSort: string; /* ... */
    defaultColumns: string | string[]; /* ... */

    // --- Methods ---

    add(...defs: Array<string | FieldDefinition | HeadingDefinition>): List;

    /**
     * Retrieves the Field instance at the specified path.
     * @param path The path of the field to retrieve.
     * @returns The Field instance, or undefined if not found.
     * @see lib/list/field.js
     */
    field(path: string): Field | undefined;
    /**
     * Creates, configures, and registers a new Field instance at the specified path.
     * Called internally by `list.add()`.
     * @param path The path for the new field.
     * @param options The configuration options for the field, including the `type`.
     * @returns The newly created Field instance.
     * @throws Error if options are invalid or the type is unrecognized.
     * @see lib/list/field.js
     */
    field(path: string, options: FieldOptions): Field;
    /**
     * Creates, configures, and registers a new Field instance at the specified path using a constructor directly.
     * @param path The path for the new field.
     * @param constructor The Field Type constructor (e.g., `Types.Text`) or a native JS constructor.
     * @returns The newly created Field instance.
     * @throws Error if options are invalid or the type is unrecognized.
     * @see lib/list/field.js
     */
    field(path: string, constructor: FieldTypeConstructor | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor): Field;


    // ... other method signatures remain the same, with @todo comments ...
    addFiltersToQuery: (query: any, filters: Record<string, any>) => any;
    addSearchToQuery: (query: any, search: string) => any;
    automap: (options?: Record<string, boolean>) => List;
    apiForGet: (item: any, select?: string, expandRelationshipFields?: boolean) => any;
    expandColumns: (cols: string | string[]) => Array<{ path: string, field?: Field, type?: string, label?: string, options?: any }>;
    expandPaths: (paths: string | string[]) => Field[];
    expandSort: (sort: string) => Record<string, 1 | -1>;
    get: (key: keyof ListOptions | string) => any;
    set: (key: keyof ListOptions | string, value: any) => ListOptions;
    getAdminURL: (doc?: any | string) => string;
    getCSVData: (options: any, user: any, callback: (err: any, csvData: string) => void) => void;
    getData: (item: any, fields?: string | string[], expandRelationshipFields?: boolean) => any;
    getDocumentName: (doc: any, escapeHtml?: boolean) => string;
    getOptions: (optionsSet: string, rest?: any) => any;
    getPages: (query: any, options: { /*...*/ }, callback: (err: any, pages: { /*...*/ }) => void) => void;
    getSearchFilters: (search: string) => Record<string, any>;
    getUniqueValue: (path: string, value: string | number, filters?: any, callback?: (err: any, uniqueValue: string | number) => void) => Promise<string | number>;
    isReserved: (path: string) => boolean; // @todo Define signature from lib/list/isReserved.js
    map: (path: keyof ListMappings | string, mappedPath: string) => void;
    paginate: (options: { /*...*/ }, callback: (err: any, results: { /*...*/ }) => void) => void;
    processFilters: (filters: string | Record<string, any>) => Record<string, any>;
    register: () => List; // @todo Define signature from lib/list/register.js
    relationship: (def: { ref: string; refPath: string; path: string; config?: any; }) => void;
    selectColumns: (query: any, columns: Array<{ path: string, field?: Field }>) => void;
    updateItem: (item: any, data: any, options: { files?: any; user?: any; }, callback: (err: any, item: any) => void) => void;
    underscoreMethod: (path: string, fn: Function) => List;
    buildSearchTextIndex: (callback?: (err: any, results?: any) => void) => Promise<any> | void;
    declaresTextIndex: () => boolean;
    ensureTextIndex: (callback?: (err: any, results?: any) => void) => Promise<any>;
}

/** Represents a KeystoneJS v4 application instance. */
declare class Keystone {
    constructor();
    /* ... */
    lists: Record<string, List>;
    /**
     * Base constructor/class for Keystone Fields. Includes the `Types` map.
     * @todo Define fully based on `fields/types/Type.js`.
     */
    Field: FieldTypeConstructor & {
        /** Map of available Field Type constructors (e.g., `Types.Text`, `Types.Relationship`). */
        Types: {
            Text?: FieldTypeConstructor;
            Number?: FieldTypeConstructor;
            Boolean?: FieldTypeConstructor;
            Datetime?: FieldTypeConstructor;
            Html?: FieldTypeConstructor;
            Relationship?: FieldTypeConstructor;
            Select?: FieldTypeConstructor;
            Date?: FieldTypeConstructor; // Note: Native Date maps to Datetime by default
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
Usage Instructions: (Remain similar)

- The `field` method is primarily used internally by `add`. You typically don't call `list.field(path, options)` directly.
- You can use `list.field(path)` to *get* a reference to an already added field instance.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone'; // Placeholder

const User = new keystone.List('User');

User.add({
    name: { type: Types.Name, required: true },
    email: { type: String } // Uses native String, mapped to Types.Text internally
});

User.register();

// Get field instances after registration
const nameField = User.field('name');
const emailField = User.field('email');

if (nameField) {
    console.log(`Field Path: ${nameField.path}, Type: ${nameField.type}, Label: ${nameField.label}`);
}
if (emailField) {
    console.log(`Field Path: ${emailField.path}, Type: ${emailField.type}, Label: ${emailField.label}`);
    // Note: emailField.type will likely be 'text' due to the mapping
}