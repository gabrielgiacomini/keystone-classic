// Type definitions for KeystoneJS v4 ... fields/types/text/TextType.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: ... fields/types/text/TextType.js

import * as express from 'express';
import * as mongoose from 'mongoose';
import { Hook } from 'grappling-hook';

// --- Dependencies & Placeholders ---
// import * as utils from 'keystone-utils'; // @todo Get/Define types for keystone-utils
// declare class Path { constructor(path: string); get(obj: any, subpath?: string): any; } // @todo Define Path class from lib/path.js
// @todo Add types for dependencies: @types/lodash, @types/marked, @types/object-assign, asyncdi?

/**
 * @todo Define more specific types for imported modules instead of 'any' or Function.
 */
// ... (module declarations) ...

// --- Forward Declarations ---
declare class Keystone { /* ... */ }
declare class List { /* ... */ }
declare class Field { /* ... */ } // Base Field definition
declare class TextField extends Field { /* ... */ } // Text Field definition

// --- Base Interfaces & Types --- (Previously Defined)

/** Represents the constructor for a Keystone Field Type */
interface FieldTypeConstructor { /* ... */ }
/** Options object used to define a field within a List. */
interface FieldOptions { /* ... */ }
/** Represents an object defining one or more fields, potentially nested. */
type FieldDefinition = Record<string, FieldOptions | FieldTypeConstructor | StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor | FieldDefinition>;
/** Represents an object defining a heading in the Admin UI form. */
interface HeadingDefinition { /* ... */ }
/** Base interface representing a Keystone Field instance within a List. */
interface Field { /* ... */ }
/** Represents an element in the Admin UI form structure. */
type UIElement = /* ... */;
/** Options for configuring a Keystone List. */
interface ListOptions { /* ... */ }
/** Defines the mapping between special list properties and field paths. */
interface ListMappings { /* ... */ }
/** Interface defining common KeystoneJS configuration options. */
interface KeystoneOptions { /* ... */ }


// --- Text Field Specific Types ---

/** Options specific to the Text field type. */
interface TextFieldOptions extends FieldOptions {
    /** Minimum length allowed. */
    min?: number;
    /** Maximum length allowed. */
    max?: number;
    /** Render input using a monospace font in Admin UI. */
    monospace?: boolean;
    /** Ensure type is specifically Text or String. */
    type: TextTypeConstructor | StringConstructor;
}

/** Filter definition for the Text field type used in `addFilterToQuery`. */
interface TextFilter {
    /** Filter mode. Defaults to 'contains' if omitted. */
    mode?: 'exactly' | 'beginsWith' | 'endsWith' | string;
    /** The string value to filter by. */
    value?: string;
    /** Perform a case-sensitive match. Defaults to false (case-insensitive). */
    caseSensitive?: boolean;
    /** Invert the filter logic (e.g., NOT exactly, NOT beginsWith). */
    inverted?: boolean;
}

/**
 * Represents an instance of the Text field type.
 * @see fields/types/text/TextType.js
 */
interface TextField extends Field {
    // Properties set in constructor specific to TextType
    _nativeType: StringConstructor;
    _properties: string[]; // ['monospace']
    _underscoreMethods: string[]; // ['crop']
    options: TextFieldOptions; // Use the specific options interface

    // Overridden methods
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
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void;

    /**
     * Adds text-specific filtering logic to a Mongoose query.
     * Supports 'exactly', 'beginsWith', 'endsWith', 'contains' (default) modes,
     * case sensitivity, and inversion.
     * @param filter The filter definition.
     * @returns A Mongoose query condition object.
     */
    addFilterToQuery(filter: TextFilter): Record<string, any>;

    // New methods (exposed via underscore methods)
    /**
     * Crops the field's string value from an item to the specified length.
     * Exposed as `item._.path.crop(...)`.
     * @param item The Mongoose document.
     * @param length The target length.
     * @param append String to append if cropped (defaults to '...').
     * @param preserveWords If true, doesn't cut words in half.
     * @returns The cropped string.
     */
    crop(item: any, length: number, append?: string, preserveWords?: boolean): string;
}

/** Constructor for the Text field type. */
interface TextTypeConstructor extends FieldTypeConstructor {
    new (list: List, path: string, options: TextFieldOptions): TextField;
    prototype: TextField;
    properName: 'Text';
}


// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
    constructor(key: string, options?: ListOptions);
    /* ... (List properties & methods remain the same) ... */
    fields: Record<string, Field>; // Holds instances of Field or its subclasses (like TextField)
    /* ... */
}

/** Represents a KeystoneJS v4 application instance. */
declare class Keystone {
    constructor();
    /* ... */
    Field: FieldTypeConstructor & {
        Types: {
            /** Standard text field. */
            Text?: TextTypeConstructor;
            Number?: FieldTypeConstructor; // @todo Define
            Boolean?: FieldTypeConstructor; // @todo Define
            Datetime?: FieldTypeConstructor; // @todo Define
            Html?: FieldTypeConstructor; // @todo Define
            Relationship?: FieldTypeConstructor; // @todo Define
            Select?: FieldTypeConstructor; // @todo Define
            Date?: FieldTypeConstructor; // @todo Define
            Name?: FieldTypeConstructor; // @todo Define
            Email?: FieldTypeConstructor; // @todo Define
            Password?: FieldTypeConstructor; // @todo Define
            Money?: FieldTypeConstructor; // @todo Define (from fields/types/money/MoneyType.js)
            Textarea?: FieldTypeConstructor; // @todo Define (from fields/types/textarea/TextareaType.js)
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

- When defining a Text field, you can now use the specific options like `min`, `max`, `monospace`.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const Article = new keystone.List('Article');

Article.add({
    title: { type: Types.Text, required: true, max: 200, index: true },
    slug: { type: Types.Text, unique: true, index: true, note: 'Auto-generated if left blank' }, // Example placeholder
    shortDescription: { type: Types.Text, max: 500 },
    codeSnippet: { type: Types.Text, monospace: true } // Use monospace option
});

Article.register();

// Example accessing underscore method (assuming an 'article' document instance)
// let article: any; // Assume 'article' is a fetched Mongoose document
// const croppedTitle = article._.title.crop(50);
// console.log(croppedTitle);