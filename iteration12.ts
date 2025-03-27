// Type definitions for KeystoneJS v4 ... fields/types/select/SelectType.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: ... fields/types/select/SelectType.js

import * as express from 'express';
import * as mongoose from 'mongoose';
import { Hook } from 'grappling-hook';
// @ts-ignore // Assume numeral is available
import * as numeral from 'numeral'; // @todo: Needs @types/numeral

// --- Dependencies & Placeholders ---
// import * as utils from 'keystone-utils'; // @todo Get/Define types for keystone-utils
// declare class Path { constructor(path: string); get(obj: any, subpath?: string): any; } // @todo Define Path class from lib/path.js
// @todo Add types for other dependencies: @types/lodash, @types/marked, @types/object-assign, asyncdi?

/**
 * @todo Define more specific types for imported modules instead of 'any' or Function.
 */
// ... (module declarations) ...

// --- Forward Declarations ---
declare class Keystone { /* ... */ }
declare class List { /* ... */ }
declare class Field { /* ... */ } // Base Field definition
declare class TextField extends Field { /* ... */ }
declare class NumberField extends Field { /* ... */ }
declare class TextareaField extends Field { /* ... */ }
declare class BooleanField extends Field { /* ... */ }
declare class SelectField extends Field { /* ... */ } // Select Field definition
declare class TextTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class NumberTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class TextareaTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class BooleanTypeConstructor extends FieldTypeConstructor { /* ... */ }
// ... other field types as they are defined ...

// --- Base Interfaces & Types --- (Previously Defined)
interface FieldTypeConstructor { /* ... */ }
interface FieldOptions { /* ... */ }
type FieldDefinition = /* ... */;
interface HeadingDefinition { /* ... */ }
interface Field { /* ... */ }
type UIElement = /* ... */;
interface ListOptions { /* ... */ }
interface ListMappings { /* ... */ }
interface KeystoneOptions { /* ... */ }

// --- Text Field Specific Types --- (Previously Defined)
// ...

// --- Number Field Specific Types --- (Previously Defined)
// ...

// --- Textarea Field Specific Types --- (Previously Defined)
// ... (Needs TextFilter definition available)
// interface TextFilter { /* ... */ }

// --- Boolean Field Specific Types --- (Previously Defined)
// ...


// --- Select Field Specific Types ---

/** Structure for a single option within a Select field. */
interface SelectOption {
    value: string | number;
    label: string;
    // Allow other custom properties if added to options
    [key: string]: any;
}

/** Options specific to the Select field type. */
interface SelectFieldOptions extends FieldOptions {
    /**
     * Defines the available choices. Can be:
     * - A comma-separated string (e.g., 'draft,published,archived').
     * - An array of strings or numbers (e.g., ['draft', 'published'], [1, 2, 3]).
     * - An array of objects `{ value: string | number, label: string }`.
     */
    options: string | Array<string | number | SelectOption>;
    /** Store the selected value as a Number instead of a String. @default false */
    numeric?: boolean;
    /** Include a blank option in the UI. @default true */
    emptyOption?: boolean;
    /** Admin UI rendering style (e.g., 'select', 'radio'). @default 'select' */
    ui?: string; // @todo Verify possible values ('select', 'radio'?)
    /** Path for the 'data' virtual property. @default path + 'Data' */
    dataPath?: string;
    /** Path for the 'label' virtual property. @default path + 'Label' */
    labelPath?: string;
    /** Path for the 'options' virtual property. @default path + 'Options' */
    optionsPath?: string;
    /** Path for the 'map' virtual property. @default path + 'OptionsMap' */
    optionsMapPath?: string;
    /** Ensure type is specifically Select. */
    type: SelectTypeConstructor;
}

/** Filter definition for the Select field type used in `addFilterToQuery`. */
interface SelectFilter {
    /** The value(s) to filter by. Can be a single value or an array for `$in`/`$nin`. */
    value?: string | number | Array<string | number>;
    /** Invert the filter logic (`$ne` for single value, `$nin` for array). */
    inverted?: boolean;
}

/**
 * Represents an instance of the Select field type.
 * Allows selection of a single value from a predefined list.
 * @see fields/types/select/SelectType.js
 */
interface SelectField extends Field {
    // Properties set in constructor specific to SelectType
    /** Admin UI rendering style. */
    ui: string;
    /** Whether the value is stored as a Number. */
    numeric: boolean;
    _nativeType: StringConstructor | NumberConstructor;
    _underscoreMethods: string[]; // ['format', 'pluck']
    _properties: string[]; // ['ops', 'numeric']
    /** Array of processed option objects `{ value, label }`. */
    ops: SelectOption[];
    /** Whether an empty option is included in the UI. */
    emptyOption: boolean;
    /** Map of value to option object `{ value, label }`. */
    map: Record<string | number, SelectOption>;
    /** Map of value to option label string. */
    labels: Record<string | number, string>;
    /** Array of valid enum values for the schema path. */
    values: Array<string | number>;
    options: SelectFieldOptions;
    /** Paths for virtual properties added to the schema. */
    paths: {
        /** Path to the virtual property returning the full selected option object. */
        data: string;
        /** Path to the virtual property returning the label of the selected option. */
        label: string;
        /** Path to the virtual property returning the raw options array (`ops`). */
        options: string;
        /** Path to the virtual property returning the value-to-option map (`map`). */
        map: string;
    };

    // Overridden methods
    /** Adds the enum path and virtuals to the schema. */
    addToSchema(schema: mongoose.Schema): void;
    /** Validates that the input value is one of the predefined options or empty/null/undefined. */
    validateInput(data: any, callback: (valid: boolean) => void): void;
    /** Validates that a non-empty, valid option is selected if required. */
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void;
    /** (Deprecated) Synchronously checks if the input value is a valid option. */
    inputIsValid(data: any, required?: boolean, item?: any): boolean;

    // New / Implemented methods
    /**
     * Adds select-specific filtering logic to a Mongoose query.
     * Handles single/multiple values, inversion, and empty value matching.
     * @param filter The filter definition.
     * @returns A Mongoose query condition object.
     */
    addFilterToQuery(filter: SelectFilter): Record<string, any>;

    /**
     * Returns the label of the selected option for an item.
     * Exposed as `item._.path.format()`.
     * @param item The Mongoose document.
     * @returns The label string, or an empty string if no value or not found.
     */
    format(item: any): string; // Underscore method

    /**
     * Retrieves a property from the selected option object for an item.
     * Exposed as `item._.path.pluck(propertyName, defaultValue)`.
     * @param item The Mongoose document.
     * @param property The key of the property to retrieve from the selected option object (e.g., 'label', 'value').
     * @param _default Default value if the option is not found or doesn't have the property.
     * @returns The value of the property from the selected option object, or the default value.
     */
    pluck(item: any, property: keyof SelectOption | string, _default?: any): any; // Underscore method

    /** Returns a shallow clone of the processed `ops` array. */
    cloneOps(): SelectOption[];
    /** Returns a shallow clone of the value-to-option `map` object. */
    cloneMap(): Record<string | number, SelectOption>;
}

/** Constructor for the Select field type. */
interface SelectTypeConstructor extends FieldTypeConstructor {
    new (list: List, path: string, options: SelectFieldOptions): SelectField;
    prototype: SelectField;
    properName: 'Select';
}


// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
    constructor(key: string, options?: ListOptions);
    /* ... */
    fields: Record<string, Field>; // Holds instances like ..., SelectField
    /* ... */
}

/** Represents a KeystoneJS v4 application instance. */
declare class Keystone {
    constructor();
    /* ... */
    Field: FieldTypeConstructor & {
        Types: {
            Text?: TextTypeConstructor;
            Number?: NumberTypeConstructor;
            Textarea?: TextareaTypeConstructor;
            Boolean?: BooleanTypeConstructor;
            /** Field for selecting a single value from a list of options. */
            Select?: SelectTypeConstructor;
            Datetime?: FieldTypeConstructor; // @todo Define
            Html?: FieldTypeConstructor; // @todo Define
            Relationship?: FieldTypeConstructor; // @todo Define
            Date?: FieldTypeConstructor; // @todo Define
            Name?: FieldTypeConstructor; // @todo Define
            Email?: FieldTypeConstructor; // @todo Define
            Password?: FieldTypeConstructor; // @todo Define
            Money?: FieldTypeConstructor; // @todo Define
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

- Use `Types.Select` for dropdowns or radio buttons where a user selects one option.
- Define choices using the `options` property (comma-separated string, array of strings/numbers, or array of `{ value, label }` objects).
- Use `numeric: true` to store values as numbers.
- Access the selected option's label via `item._.path.format()` or `item[virtualLabelPath]`.
- Access the full selected option object via `item[virtualDataPath]`.
- Use `item._.path.pluck('propertyName')` to get a specific property from the selected option object.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const Post = new keystone.List('Post');

Post.add({
    title: { type: Types.Text, required: true },
    state: {
        type: Types.Select,
        options: 'draft, published, archived', // String options
        default: 'draft',
        index: true
    },
    priority: {
        type: Types.Select,
        numeric: true, // Store as number
        options: [ // Array of objects
            { value: 1, label: 'Low' },
            { value: 2, label: 'Medium' },
            { value: 3, label: 'High' }
        ],
        default: 1
    }
});

Post.register();

// Example accessing virtuals and underscore methods (assuming a 'post' document instance)
// let post: any; // Assume 'post' is a fetched Mongoose document
// const stateLabel = post._.state.format(); // e.g., "Published"
// const stateData = post.stateData; // e.g., { value: 'published', label: 'Published' } (if virtual path is default)
// const priorityLabel = post._.priority.format(); // e.g., "Medium"
// const priorityValue = post.priority; // e.g., 2