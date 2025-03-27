// Type definitions for KeystoneJS v4 ... fields/types/boolean/BooleanType.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: ... fields/types/boolean/BooleanType.js

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
declare class BooleanField extends Field { /* ... */ } // Boolean Field definition
declare class TextTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class NumberTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class TextareaTypeConstructor extends FieldTypeConstructor { /* ... */ }
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
// interface TextField extends Field { /* ... */ }
// interface TextTypeConstructor extends FieldTypeConstructor { /* ... */ }

// --- Number Field Specific Types --- (Previously Defined)
interface NumberFieldOptions extends FieldOptions { /* ... */ }
interface NumberFilter { /* ... */ }
// interface NumberField extends Field { /* ... */ }
// interface NumberTypeConstructor extends FieldTypeConstructor { /* ... */ }

// --- Textarea Field Specific Types --- (Previously Defined)
interface TextareaFieldOptions extends FieldOptions { /* ... */ }
// interface TextareaField extends Field { /* ... */ } // Uses TextFilter
// interface TextareaTypeConstructor extends FieldTypeConstructor { /* ... */ }


// --- Boolean Field Specific Types ---

/** Options specific to the Boolean field type. */
interface BooleanFieldOptions extends FieldOptions {
    /** Indent the checkbox in the Admin UI form. @default false */
    indent?: boolean;
    /** Set default value. @default false */
    default?: boolean;
    /** Ensure type is specifically Boolean. */
    type: BooleanTypeConstructor | BooleanConstructor;
}

/** Filter definition for the Boolean field type used in `addFilterToQuery`. */
interface BooleanFilter {
    /** If truthy or 'true', filters for `true` values. Otherwise filters for `false` or `null`/`undefined`. */
    value?: boolean | string;
    // Note: inverted is not used by the core implementation
}

/**
 * Represents an instance of the Boolean field type.
 * Typically rendered as a checkbox.
 * @see fields/types/boolean/BooleanType.js
 */
interface BooleanField extends Field {
    // Properties set in constructor specific to BooleanType
    _nativeType: BooleanConstructor;
    _properties: string[]; // ['indent']
    _fixedSize: 'full';
    /** Whether the field is indented in the Admin UI. */
    indent: boolean;
    options: BooleanFieldOptions;
    /** Default values for the Boolean type. */
    defaults: { default: boolean };

    // Overridden methods
    /** Validates that the input is suitable for a boolean value (boolean, string, number, null, undefined). */
    validateInput(data: any, callback: (valid: boolean) => void): void;
    /** Validates required input. Considers truthy values or non-'false' strings as valid. */
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void;
    /** Updates the item, coercing input to `true` or `false`. Sets only if the value changes. */
    updateItem(item: any, data: any, callback: (err?: Error) => void): void;
    /** (Deprecated) Synchronously checks required input. */
    inputIsValid(data: any, required?: boolean): boolean;

    // New / Implemented methods
    /**
     * Adds boolean-specific filtering logic to a Mongoose query.
     * Filters for `true` or `{$ne: true}` (false or null/undefined) based on the filter value.
     * @param filter The filter definition.
     * @returns A Mongoose query condition object.
     */
    addFilterToQuery(filter: BooleanFilter): Record<string, any>;
}

/** Constructor for the Boolean field type. */
interface BooleanTypeConstructor extends FieldTypeConstructor {
    new (list: List, path: string, options: BooleanFieldOptions): BooleanField;
    prototype: BooleanField;
    properName: 'Boolean';
}


// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
    constructor(key: string, options?: ListOptions);
    /* ... (List properties & methods remain the same) ... */
    fields: Record<string, Field>; // Holds instances like ..., BooleanField
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
            /** Standard boolean field (checkbox). */
            Boolean?: BooleanTypeConstructor;
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

- Use `Types.Boolean` for true/false values, rendered as a checkbox.
- The `default` option is `false`.
- The `indent` option controls visual indentation in the Admin UI form.
- `required: true` typically means the box must be checked.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const User = new keystone.List('User');

User.add({
    name: { type: Types.Name, required: true },
    email: { type: Types.Email, required: true, unique: true },
    // ... other fields ...
}, 'Permissions', {
    isAdmin: { type: Types.Boolean, default: false, index: true },
    // Use indent to visually group related checkboxes
    canEditContent: { type: Types.Boolean, default: false, indent: true, dependsOn: { isAdmin: false } },
    canEditSettings: { type: Types.Boolean, default: false, indent: true, dependsOn: { isAdmin: false } },
}, 'Preferences', {
    receiveNewsletter: { type: Types.Boolean, default: true }
});

User.register();