// Type definitions for KeystoneJS v4 ... fields/types/number/NumberType.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: ... fields/types/number/NumberType.js

import * as express from 'express';
import * as mongoose from 'mongoose';
import { Hook } from 'grappling-hook';
// @ts-ignore // Assume numeral is available globally or via require
import * as numeral from 'numeral'; // @todo: Needs @types/numeral: npm install --save-dev @types/numeral

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
declare class NumberField extends Field { /* ... */ } // Number Field definition
declare class TextTypeConstructor extends FieldTypeConstructor { /* ... */ } // From previous step
declare class TextField extends Field { /* ... */ } // From previous step
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


// --- Number Field Specific Types ---

/** Options specific to the Number field type. */
interface NumberFieldOptions extends FieldOptions {
    /**
     * Numeral.js format string (e.g., '0,0.00', '$0,0.00') or `false` to disable formatting.
     * @default '0,0[.][000000000000]'
     * @see http://numeraljs.com/
     */
    format?: string | false;
    /** Ensure type is specifically Number. */
    type: NumberTypeConstructor | NumberConstructor;
}

/** Filter definition for the Number field type used in `addFilterToQuery`. */
interface NumberFilter {
    /**
     * Filter mode.
     * 'equals': Matches exact value or empty/null if value is empty.
     * 'between': Matches values within the range specified in `value.min` and `value.max`.
     * 'gt': Matches values greater than `value`.
     * 'lt': Matches values less than `value`.
     * If mode is omitted, 'equals' is assumed.
     */
    mode?: 'equals' | 'between' | 'gt' | 'lt' | string;
    /**
     * The value(s) to filter by.
     * - For 'equals', 'gt', 'lt': A single number or string convertible to a number.
     * - For 'between': An object `{ min: number | string, max: number | string }`.
     * - For 'equals' mode with an empty value: Matches empty/null values.
     */
    value?: number | string | { min?: number | string; max?: number | string; };
    /** Invert the filter logic (e.g., NOT equals, NOT between). */
    inverted?: boolean;
}

/**
 * Represents an instance of the Number field type.
 * @see fields/types/number/NumberType.js
 */
interface NumberField extends Field {
    // Properties set in constructor specific to NumberType
    _nativeType: NumberConstructor;
    _fixedSize: 'small';
    _underscoreMethods: string[]; // ['format']
    options: NumberFieldOptions;
    /** The numeral.js format string to use, or false if formatting is disabled. */
    formatString?: string | false;

    // Overridden methods
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
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void;
    /**
     * Updates the item with a valid number value, or null if the input is invalid.
     * @param item The Mongoose document to update.
     * @param data The input data object.
     * @param callback Called after update attempt. Receives `(error?: Error)`.
     */
    updateItem(item: any, data: any, callback: (err?: Error) => void): void;
    /**
     * (Deprecated) Synchronously checks if input data for the field is a valid number.
     * @deprecated Use validateInput or validateRequiredInput instead.
     */
    inputIsValid(data: any, required?: boolean, item?: any): boolean;

    // New / Implemented methods
    /**
     * Adds number-specific filtering logic to a Mongoose query.
     * Supports 'equals', 'between', 'gt', 'lt' modes, and inversion.
     * @param filter The filter definition.
     * @returns A Mongoose query condition object.
     */
    addFilterToQuery(filter: NumberFilter): Record<string, any>;
    /**
     * Formats the field's numeric value using numeral.js.
     * Exposed as `item._.path.format(...)`.
     * @param item The Mongoose document.
     * @param format Optional numeral.js format string (overrides field option).
     * @returns The formatted string, or an empty string for non-numeric values (except 0).
     */
    format(item: any, format?: string): string;
}

/** Constructor for the Number field type. */
interface NumberTypeConstructor extends FieldTypeConstructor {
    new (list: List, path: string, options: NumberFieldOptions): NumberField;
    prototype: NumberField;
    properName: 'Number';
}


// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
    constructor(key: string, options?: ListOptions);
    /* ... (List properties & methods remain the same) ... */
    fields: Record<string, Field>; // Holds instances of Field or its subclasses (like NumberField)
    /* ... */
}

/** Represents a KeystoneJS v4 application instance. */
declare class Keystone {
    constructor();
    /* ... */
    Field: FieldTypeConstructor & {
        Types: {
            Text?: TextTypeConstructor;
            /** Standard number field. Uses numeral.js for formatting. */
            Number?: NumberTypeConstructor;
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
            Textarea?: FieldTypeConstructor; // @todo Define
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

- When defining a Number field, you can use the `format` option to control display.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const Product = new keystone.List('Product');

Product.add({
    name: { type: Types.Text, required: true },
    price: { type: Types.Number, required: true, format: '$0,0.00' }, // Using format option
    stockLevel: { type: Types.Number, default: 0, format: '0,0' },
    rating: { type: Types.Number, format: false } // Disable formatting
});

Product.register();

// Example accessing underscore method (assuming a 'product' document instance)
// let product: any; // Assume 'product' is a fetched Mongoose document
// const formattedPrice = product._.price.format(); // Uses format: '$0,0.00'
// const specificFormat = product._.stockLevel.format('0'); // Override format
// console.log(formattedPrice, specificFormat);