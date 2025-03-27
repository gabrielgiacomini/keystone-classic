// Type definitions for KeystoneJS v4 ... fields/types/textarea/TextareaType.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: ... fields/types/textarea/TextareaType.js

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
declare class TextField extends Field { /* ... */ } // Text Field definition
declare class NumberField extends Field { /* ... */ } // Number Field definition
declare class TextareaField extends Field { /* ... */ } // Textarea Field definition
declare class TextTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class NumberTypeConstructor extends FieldTypeConstructor { /* ... */ }
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
interface TextFieldOptions extends FieldOptions { /* ... */ }
interface TextFilter { /* ... */ }
// interface TextField extends Field { /* ... */ } // Already defined
// interface TextTypeConstructor extends FieldTypeConstructor { /* ... */ } // Already defined

// --- Number Field Specific Types --- (Previously Defined)
interface NumberFieldOptions extends FieldOptions { /* ... */ }
interface NumberFilter { /* ... */ }
// interface NumberField extends Field { /* ... */ } // Already defined
// interface NumberTypeConstructor extends FieldTypeConstructor { /* ... */ } // Already defined


// --- Textarea Field Specific Types ---

/** Options specific to the Textarea field type. */
interface TextareaFieldOptions extends FieldOptions {
    /** Height of the textarea in pixels. @default 90 */
    height?: number;
    /** Minimum length allowed (validation logic inherited from Text). */
    min?: number;
    /** Maximum length allowed (validation logic inherited from Text). */
    max?: number;
    /** Ensure type is specifically Textarea. */
    type: TextareaTypeConstructor;
}

/**
 * Represents an instance of the Textarea field type.
 * Inherits behavior from TextType for validation, filtering, and cropping.
 * @see fields/types/textarea/TextareaType.js
 */
interface TextareaField extends Field {
    // Properties set in constructor specific to TextareaType
    _nativeType: StringConstructor;
    _underscoreMethods: string[]; // ['format', 'crop']
    /** Height of the textarea in pixels. */
    height: number;
    /** Always true for Textarea fields. */
    multiline: true;
    _properties: string[]; // ['height', 'multiline']
    options: TextareaFieldOptions;

    // Methods explicitly borrowed from TextType prototype
    /** Inherited from TextType: Validates input string length based on min/max options. */
    validateInput(data: any, callback: (valid: boolean) => void): void;
    /** Inherited from TextType: Validates required text input. */
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void;
    /** Inherited from TextType: Adds text-specific filtering logic. */
    addFilterToQuery(filter: TextFilter): Record<string, any>;
    /** Inherited from TextType: Crops the field's string value. Exposed as `item._.path.crop(...)`. */
    crop(item: any, length: number, append?: string, preserveWords?: boolean): string;

    // Overridden method specific to TextareaType
    /**
     * Formats the field's value using `utils.textToHTML` (converts newlines to <br>).
     * Exposed as `item._.path.format(...)`.
     * @param item The Mongoose document.
     * @returns The formatted HTML string.
     */
    format(item: any): string;
}

/** Constructor for the Textarea field type. */
interface TextareaTypeConstructor extends FieldTypeConstructor {
    new (list: List, path: string, options: TextareaFieldOptions): TextareaField;
    prototype: TextareaField;
    properName: 'Textarea';
}


// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
    constructor(key: string, options?: ListOptions);
    /* ... (List properties & methods remain the same) ... */
    fields: Record<string, Field>; // Holds instances like TextField, NumberField, TextareaField etc.
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
            /** Multi-line text field. Similar to Text but with default newline formatting. */
            Textarea?: TextareaTypeConstructor;
            Boolean?: FieldTypeConstructor; // @todo Define
            Datetime?: FieldTypeConstructor; // @todo Define
            Html?: FieldTypeConstructor; // @todo Define
            Relationship?: FieldTypeConstructor; // @todo Define
            Select?: FieldTypeConstructor; // @todo Define
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

- Use `Types.Textarea` for multi-line text input.
- You can set the `height` option.
- Formatting (`item._.path.format()`) converts newlines to `<br>` tags.
- Validation and filtering behave like the `Text` type.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const Comment = new keystone.List('Comment');

Comment.add({
    author: { type: Types.Text, required: true },
    commentBody: { type: Types.Textarea, required: true, height: 150, max: 2000 }
});

Comment.register();

// Example accessing underscore method (assuming a 'comment' document instance)
// let comment: any; // Assume 'comment' is a fetched Mongoose document
// const formattedBody = comment._.commentBody.format(); // Converts newlines to <br>
// console.log(formattedBody);