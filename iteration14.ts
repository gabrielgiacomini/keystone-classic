// Type definitions for KeystoneJS v4 ... fields/types/date/DateType.js
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: ... fields/types/date/DateType.js

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
declare class DateField extends Field { /* ... */ } // Date Field definition
declare class TextTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class NumberTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class TextareaTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class BooleanTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class SelectTypeConstructor extends FieldTypeConstructor { /* ... */ }
declare class DateTimeTypeConstructor extends FieldTypeConstructor { /* ... */ }
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
interface TextFilter { /* ... */ } // Needed by Textarea
// ...

// --- Number Field Specific Types --- (Previously Defined)
// ...

// --- Textarea Field Specific Types --- (Previously Defined)
// ...

// --- Boolean Field Specific Types --- (Previously Defined)
// ...

// --- Select Field Specific Types --- (Previously Defined)
// ...


// --- Date & DateTime Field Specific Types ---

/** Filter definition for Date and DateTime field types used in `addFilterToQuery`. */
interface DateFilter {
    /**
     * Filter mode.
     * 'between': Matches dates within the range specified by `after` and `before`.
     * 'after': Matches dates after `value`.
     * 'before': Matches dates before `value`.
     * If mode is omitted, matches dates on the same day as `value`.
     */
    mode?: 'between' | 'after' | 'before' | string; // Default is 'on' day
    /** The date value (as string, Date, or Moment) for 'on', 'after', 'before' modes. */
    value?: string | Date | moment.Moment;
    /** The start date (as string, Date, or Moment) for 'between' mode. */
    after?: string | Date | moment.Moment;
    /** The end date (as string, Date, or Moment) for 'between' mode. */
    before?: string | Date | moment.Moment;
    /** Invert the filter logic (e.g., NOT between, NOT after). */
    inverted?: boolean;
}

/** Options specific to the Date field type. */
interface DateFieldOptions extends FieldOptions {
    /** Moment.js format string for output, or `false` to disable. @default 'Do MMM YYYY' */
    format?: string | false;
    /** Moment.js format string for parsing input. @default 'YYYY-MM-DD' */
    inputFormat?: string; // Used internally to set parseFormatString
    /** Range of years for date picker (e.g., `[2000, 2030]` or `10` for +/- 10 years). */
    yearRange?: number | number[]; // @todo Verify exact format if possible
    /** Treat date as UTC. @default false */
    utc?: boolean;
    /** Show 'Today' button in date picker. @default true */
    todayButton?: boolean;
    /** UTC offset (minutes) for correcting potentially corrupted UTC dates on retrieval. @default Server's offset */
    timezoneUtcOffsetMinutes?: number;
    /** Ensure type is Date. */
    type: DateTypeConstructor | DateConstructor;
}

/** Options specific to the DateTime field type. */
interface DateTimeFieldOptions extends FieldOptions {
    /** Moment.js format string for output, or `false` to disable. @default 'YYYY-MM-DD h:mm:ss a' */
    format?: string | false;
    /** Moment.js format string(s) for parsing input. @default Various standard formats */
    parseFormat?: string | string[];
    /** Treat date/time as UTC. @default false */
    utc?: boolean;
    /** Ensure type is Datetime or Date. */
    type: DateTimeTypeConstructor | DateConstructor;
}

/** Represents an instance of the Date field type. */
interface DateField extends Field {
    // Properties set in constructor specific to DateType
    _nativeType: DateConstructor;
    _underscoreMethods: string[]; // ['format', 'moment', 'parse']
    _fixedSize: 'medium';
    _properties: string[]; // ['formatString', 'yearRange', 'isUTC', 'inputFormat', 'todayButton']
    /** Moment.js format string used for parsing input. */
    parseFormatString: string | string[]; // Default 'YYYY-MM-DD'
    /** Moment.js format string for output, or false. */
    formatString?: string | false;
    /** Year range option for date picker. */
    yearRange?: number | number[];
    /** Whether to treat the date as UTC. */
    isUTC: boolean;
    /** Whether the date picker shows the 'Today' button. */
    todayButton: boolean;
    /** UTC offset used for potential date correction. */
    timezoneUtcOffsetMinutes: number;
    options: DateFieldOptions;

    // Borrowed from TextType
    /** Inherited from TextType: Validates required input (presence of value). */
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void;

    // Overridden / Specific methods
    /** Adds date-specific filtering logic to a Mongoose query. */
    addFilterToQuery(filter: DateFilter): Record<string, any>;
    /** Formats the field's value using moment.js. Exposed as `item._.path.format(...)`. */
    format(item: any, format?: string): string; // Underscore method
    /** Returns the field's value as a moment.js object. Exposed as `item._.path.moment()`. */
    moment(item: any): moment.Moment | null; // Underscore method
    /** Parses input using moment.js. Exposed as `item._.path.parse(...)`. */
    parse(value: any, format?: string | string[], strict?: boolean): moment.Moment; // Underscore method
    /** Validates that the input can be parsed into a valid date by moment.js. */
    validateInput(data: any, callback: (valid: boolean) => void): void; // Overridden
    /** Retrieves the date value, applying correction logic for potentially corrupted UTC dates. */
    getData(item: any): Date | null; // Overridden
    /** (Deprecated) Synchronously checks if the input is a valid date. */
    inputIsValid(data: any, required?: boolean, item?: any): boolean; // Deprecated
    /** Updates the item's value with a parsed Date object, or null if input is empty/invalid. */
    updateItem(item: any, data: any, callback: (err?: Error) => void): void; // Overridden
}

/** Represents an instance of the DateTime field type. */
interface DateTimeField extends Field {
    // Properties set in constructor specific to DateTimeType
    _nativeType: DateConstructor;
    _underscoreMethods: string[]; // ['format', 'moment', 'parse'] (borrowed)
    _fixedSize: 'full';
    _properties: string[]; // ['formatString', 'isUTC']
    typeDescription: string;
    parseFormatString: string | string[];
    formatString?: string | false;
    isUTC: boolean;
    options: DateTimeFieldOptions;
    paths: { date: string; time: string; tzOffset: string; };

    // --- Methods Borrowed from DateType ---
    /** Formats the field's value using moment.js. Exposed as `item._.path.format(...)`. */
    format: (item: any, format?: string) => string; // Underscore method
    /** Returns the field's value as a moment.js object. Exposed as `item._.path.moment()`. */
    moment: (item: any) => moment.Moment | null; // Underscore method
    /** Parses input using moment.js. Exposed as `item._.path.parse(...)`. */
    parse: (value: any, format?: string | string[], strict?: boolean) => moment.Moment; // Underscore method
    /** Adds date-based filtering logic to a Mongoose query. */
    addFilterToQuery: (filter: DateFilter) => Record<string, any>;

    // --- Methods Specific to DateTimeType ---
    getInputFromData(data: any): string | any;
    validateInput(data: any, callback: (valid: boolean) => void): void; // Overridden
    validateRequiredInput(item: any, data: any, callback: (valid: boolean) => void): void; // Overridden
    updateItem(item: any, data: any, callback: (err?: Error) => void): void; // Overridden
    inputIsValid(data: any, required?: boolean, item?: any): boolean; // Deprecated
}

/** Constructor for the Date field type. */
interface DateTypeConstructor extends FieldTypeConstructor {
    new (list: List, path: string, options: DateFieldOptions): DateField;
    prototype: DateField;
    properName: 'Date';
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
    fields: Record<string, Field>; // Holds instances like ..., DateField, DateTimeField
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
            /** Field for storing combined date and time. Uses moment.js. Borrows from Date type. */
            Datetime?: DateTimeTypeConstructor;
            /** Field for storing date only. Uses moment.js. */
            Date?: DateTypeConstructor;
            Html?: FieldTypeConstructor; // @todo Define
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

- Use `Types.Date` for date-only values.
- Control output formatting with the `format` option (using Moment.js tokens, default 'Do MMM YYYY').
- Input parsing uses `inputFormat` (default 'YYYY-MM-DD').
- Set `utc: true` to handle dates in UTC.
- Options like `yearRange`, `todayButton` configure the date picker UI.
- Underscore methods `format`, `moment`, `parse` are available.

```typescript
import * as keystone from 'keystone';
import { Types } from 'keystone';

const Task = new keystone.List('Task');

Task.add({
    description: { type: Types.Text, required: true },
    dueDate: { type: Types.Date, index: true, format: 'YYYY-MM-DD', inputFormat: 'DD/MM/YYYY' }, // Custom formats
    completedAt: { type: Types.Date, utc: true } // UTC date
});

Task.register();

// Example accessing underscore method (assuming a 'task' document instance)
// let task: any; // Assume 'task' is a fetched Mongoose document
// const formattedDue = task._.dueDate.format('MMMM D, YYYY');
// const dueMoment = task._.dueDate.moment();
// if (dueMoment && dueMoment.isValid() && dueMoment.isBefore(Date.now())) {
//     console.log('Task is overdue!');
// }