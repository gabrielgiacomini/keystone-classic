// Type definitions for KeystoneJS v4 ... fields/types/datetime/DateTimeType.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: ... fields/types/datetime/DateTimeType.js

import * as express from 'express';
import * as mongoose from 'mongoose';
import * as moment from 'moment'; // Requires @types/moment
import { Hook } from 'grappling-hook';
// @ts-ignore // Assume numeral is available
import * as numeral from 'numeral'; // @todo: Needs @types/numeral

// --- Dependencies & Placeholders ---
// import * as utils from 'keystone-utils'; // @todo Get/Define types for keystone-utils
// declare class Path { constructor(path: string); get(obj: any, subpath?: string): any; } // @todo Define Path class from lib/path.js
// @todo Define DateType/DateField interfaces from fields/types/date/DateType.js
// @todo Define DateFilter interface used by DateType.prototype.addFilterToQuery
declare class DateField extends Field { /* ... */ }
// declare class DateTypeConstructor extends FieldTypeConstructor { /* ... */ }
// interface DateFilter { /* ... */ }
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
declare class DateTimeField extends Field { /* ... */ } // DateTime Field definition
declare class TextTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class NumberTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class TextareaTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class BooleanTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class SelectTypeConstructor extends FieldTypeConstructor { /* ... */ }
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
// ... (Needs TextFilter)

// --- Number Field Specific Types --- (Previously Defined)
// ...

// --- Textarea Field Specific Types --- (Previously Defined)
// ... (Needs TextFilter)

// --- Boolean Field Specific Types --- (Previously Defined)
// ...

// --- Select Field Specific Types --- (Previously Defined)
// ...


// --- DateTime Field Specific Types ---

/** Options specific to the DateTime field type. */
interface DateTimeFieldOptions extends FieldOptions {
    /**
     * Moment.js format string used for output formatting, or `false` to disable formatting.
     * @default 'YYYY-MM-DD h:mm:ss a'
     * @see https://momentjs.com/docs/#/displaying/format/
     */
    format?: string | false;
    /**
     * Moment.js format string or array of formats used for parsing string input.
     * @default ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', ..., moment.ISO_8601]
     * @see https://momentjs.com/docs/#/parsing/string-formats/
     */
    parseFormat?: string | string[];
    /**
     * Interpret and display the date/time in UTC.
     * @default false
     */
    utc?: boolean;
    /** Ensure type is specifically Datetime or Date. */
    type: DateTimeTypeConstructor | DateConstructor;
}

/**
 * Represents an instance of the DateTime field type.
 * Stores a JavaScript Date object. Uses moment.js for parsing, formatting, and validation.
 * @see fields/types/datetime/DateTimeType.js
 */
interface DateTimeField extends Field {
    // Properties set in constructor specific to DateTimeType
    _nativeType: DateConstructor;
    _underscoreMethods: string[]; // ['format', 'moment', 'parse'] (borrowed)
    _fixedSize: 'full';
    _properties: string[]; // ['formatString', 'isUTC']
    /** Description override for the type. */
    typeDescription: string;
    /** Moment.js format(s) used for parsing input. */
    parseFormatString: string | string[];
    /** Moment.js format string for output, or false. */
    formatString?: string | false;
    /** Whether to treat the date as UTC. */
    isUTC: boolean;
    options: DateTimeFieldOptions;
    /** Paths for the sub-fields used in the Admin UI. */
    paths: {
        date: string;
        time: string;
        tzOffset: string;
    };

    // --- Methods Borrowed from DateType ---
    // @todo Define these methods fully when DateType is processed.

    /**
     * Formats the field's value using moment.js.
     * Exposed as `item._.path.format(formatString)`.
     * (Borrowed from DateType)
     * @param item The Mongoose document.
     * @param format Optional Moment.js format string (overrides field option).
     * @returns Formatted date string or empty string.
     */
    format: (item: any, format?: string) => string; // Underscore method

    /**
     * Returns the field's value as a moment.js object.
     * Takes the `isUTC` option into account.
     * Exposed as `item._.path.moment()`.
     * (Borrowed from DateType)
     * @param item The Mongoose document.
     * @returns A moment object or null.
     */
    moment: (item: any) => moment.Moment | null; // Underscore method

    /**
     * Parses input using moment.js with the field's `parseFormatString`.
     * Exposed as `item._.path.parse(value, formatString, strict)`.
     * (Borrowed from DateType)
     * @param value The value to parse.
     * @param format Optional format string(s) to override field option.
     * @param strict Whether to use strict parsing.
     * @returns A moment object (may be invalid).
     */
    parse: (value: any, format?: string | string[], strict?: boolean) => moment.Moment; // Underscore method

    /**
     * Adds date-based filtering logic to a Mongoose query.
     * (Borrowed from DateType)
     * @param filter The filter definition (@todo Define DateFilter).
     * @returns A Mongoose query condition object.
     */
    addFilterToQuery: (filter: any /* DateFilter */) => Record<string, any>; // @todo Use DateFilter

    // --- Methods Specific to DateTimeType ---

    /**
     * Gets the combined input value from date, time, and tzOffset fields in the data object,
     * or falls back to the main path value.
     * @param data The input data object.
     * @returns The combined date/time string or the original value.
     */
    getInputFromData(data: any): string | any;

    /** Validates that the input can be parsed into a valid date/time by moment.js. Allows empty values. */
    validateInput(data: any, callback: (valid: boolean) => void): void; // Overridden
    /** Validates that a date/time value is present if required. */
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void; // Overridden
    /** Updates the item's value with a parsed Date object, or null if input is empty/invalid. */
    updateItem(item: any, data: any, callback: (err?: Error) => void): void; // Overridden
    /** (Deprecated) Synchronously checks if the input is a valid date/time. */
    inputIsValid(data: any, required?: boolean, item?: any): boolean; // Deprecated
}

/** Constructor for the DateTime field type. */
interface DateTimeTypeConstructor extends FieldTypeConstructor {
    new (list: List, path: string, options: DateTimeFieldOptions): DateTimeField;
    prototype: DateTimeField;
    properName: 'Datetime';
}


// --- Classes ---

/** Represents a Keystone Data List. */
declare class List {
    constructor(key: string, options?: ListOptions);
    /* ... */
    fields: Record<string, Field>; // Holds instances like ..., DateTimeField
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
            /** Field for storing combined date and time. Uses moment.js. */
            Datetime?: DateTimeTypeConstructor;
            Html?: FieldTypeConstructor; // @todo Define
            Relationship?: FieldTypeConstructor; // @todo Define
            /** Field for storing date only. Uses moment.js. */
            Date?: FieldTypeConstructor; // @todo Define (DateTime borrows from this)
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

- Use `Types.Datetime` for date and time values.
- Control output formatting with the `format` option (using Moment.js tokens).
- Input parsing uses `parseFormat` or defaults.
- Set `utc: true` to handle dates in UTC.
- Underscore methods `format`, `moment`, `parse` are available (inherited from Date type).

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const Event = new keystone.List('Event');

Event.add({
    name: { type: Types.Text, required: true },
    startTime: { type: Types.Datetime, required: true, default: Date.now, index: true },
    endTime: { type: Types.Datetime, required: true, index: true },
    publishedAt: { type: Types.Datetime, format: 'Do MMM YYYY HH:mm', utc: true } // Custom format, UTC
});

Event.register();

// Example accessing underscore method (assuming an 'event' document instance)
// let event: any; // Assume 'event' is a fetched Mongoose document
// const formattedStart = event._.startTime.format('DD/MM/YYYY h:mm A'); // Custom format on the fly
// const startMoment = event._.startTime.moment(); // Get moment object
// if (startMoment && startMoment.isValid()) {
//    console.log('Event starts on:', startMoment.toString());
// }
// const parsedTime = event._.startTime.parse('2025-03-27 10:00:00 AM'); // Parse a string