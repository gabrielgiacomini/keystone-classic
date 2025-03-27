// Type definitions for KeystoneJS v4 ... fields/types/html/HtmlType.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: ... fields/types/html/HtmlType.js

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as moment from 'moment'; // Requires @types/moment
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
declare class SelectField extends Field { /* ... */ }
declare class DateTimeField extends Field { /* ... */ }
declare class DateField extends Field { /* ... */ }
declare class HtmlField extends Field { /* ... */ } // Html Field definition
declare class TextTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class NumberTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class TextareaTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class BooleanTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class SelectTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class DateTimeTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class DateTypeConstructor extends FieldTypeConstructor { /* ... */ }
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
interface TextFilter { /* ... */ } // Needed by Html/Textarea
// ...

// --- Number Field Specific Types --- (Previously Defined)
// ...

// --- Textarea Field Specific Types --- (Previously Defined)
// ...

// --- Boolean Field Specific Types --- (Previously Defined)
// ...

// --- Select Field Specific Types --- (Previously Defined)
// ...

// --- Date & DateTime Field Specific Types --- (Previously Defined)
interface DateFilter { /* ... */ }
// ...


// --- Html Field Specific Types ---

/** Options specific to the Html field type. */
interface HtmlFieldOptions extends FieldOptions {
    /** Enable the WYSIWYG editor (TinyMCE). @default false */
    wysiwyg?: boolean;
    /** Height of the editor area in pixels. @default 180 */
    height?: number;
    /** Minimum length allowed (validation logic inherited from Text). */
    min?: number;
    /** Maximum length allowed (validation logic inherited from Text). */
    max?: number;
    /** Ensure type is specifically Html. */
    type: HtmlTypeConstructor;
}

/**
 * Represents an instance of the Html field type.
 * Stores HTML content as a string. Optionally uses a WYSIWYG editor.
 * Inherits validation and filtering from TextType.
 * @see fields/types/html/HtmlType.js
 */
interface HtmlField extends Field {
    // Properties set in constructor specific to HtmlType
    _nativeType: StringConstructor;
    _defaultSize: 'full';
    /** Whether the WYSIWYG editor is enabled. */
    wysiwyg: boolean;
    /** Height of the editor area in pixels. */
    height: number;
    _properties: string[]; // ['wysiwyg', 'height']
    options: HtmlFieldOptions;

    // Methods explicitly borrowed from TextType prototype
    /** Inherited from TextType: Validates input string length based on min/max options. */
    validateInput(data: any, callback: (valid: boolean) => void): void;
    /** Inherited from TextType: Validates required text input. */
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void;
    /** Inherited from TextType: Adds text-specific filtering logic. */
    addFilterToQuery(filter: TextFilter): Record<string, any>;

    // Note: Does NOT inherit format() or crop() from TextType.
    // Uses base Field.format() which returns the raw value.
}

/** Constructor for the Html field type. */
interface HtmlTypeConstructor extends FieldTypeConstructor {
    new (list: List, path: string, options: HtmlFieldOptions): HtmlField;
    prototype: HtmlField;
    properName: 'Html';
}


// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
    constructor(key: string, options?: ListOptions);
    /* ... */
    fields: Record<string, Field>; // Holds instances like ..., HtmlField
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
            Select?: SelectTypeConstructor;
            Datetime?: DateTimeTypeConstructor;
            Date?: DateTypeConstructor;
            /** Field for storing HTML content. Optionally uses a WYSIWYG editor. */
            Html?: HtmlTypeConstructor;
            Relationship?: FieldTypeConstructor; // @todo Define
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

- Use `Types.Html` for rich text content.
- Set `wysiwyg: true` to enable the TinyMCE editor in the Admin UI.
- Configure the editor height with the `height` option.
- Validation (`min`/`max` length) and filtering behave like the `Text` type.
- The default `format` method returns the raw HTML string.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const Page = new keystone.List('Page');

Page.add({
    title: { type: Types.Text, required: true },
    content: { type: Types.Html, wysiwyg: true, height: 400 },
    sidebarHtml: { type: Types.Html, height: 200 } // Plain HTML textarea, no WYSIWYG
});

Page.register();

// Example (assuming a 'page' document instance)
// let page: any; // Assume 'page' is a fetched Mongoose document
// const rawHtmlContent = page._.content.format(); // Gets the raw HTML string
// console.log(rawHtmlContent);