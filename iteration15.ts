// Type definitions for KeystoneJS v4
// Project: https://github.com/keystonejs/keystone-0.3
// Definitions by: Gabriel Giacomini <https://github.com/GabrielGiacomini>
// Based on the code in: index.js, lib/core/options.js, lib/list.js, lib/list/add.js, lib/list/field.js,
// fields/types/Type.js, fields/types/text/TextType.js, fields/types/number/NumberType.js,
// fields/types/textarea/TextareaType.js, fields/types/boolean/BooleanType.js, fields/types/select/SelectType.js,
// fields/types/datetime/DateTimeType.js, fields/types/date/DateType.js, fields/types/html/HtmlType.js

import * as express from "express";
import * as mongoose from "mongoose";
import * as moment from "moment"; // Requires @types/moment
import { Hook } from "grappling-hook"; // @todo: Check if @types/grappling-hook exists or define basic type
// @ts-ignore // Assume numeral is available globally or via require
import * as numeral from "numeral"; // @todo: Needs @types/numeral

// --- Dependencies & Placeholders ---
// import * as utils from 'keystone-utils'; // @todo Get/Define types for keystone-utils
// declare class Path { constructor(path: string); get(obj: any, subpath?: string): any; } // @todo Define Path class from lib/path.js
// @todo Add types for external dependencies: @types/lodash, @types/marked, @types/object-assign, asyncdi?

/**
 * @todo Define more specific types for imported modules instead of 'any' or Function.
 */
// declare module './lib/core/importer' { const importer: any; export default importer; }
// declare module './lib/middleware/api' { function api(keystone: Keystone): any; export = api; }
// declare module './lib/middleware/cors' { function cors(keystone: Keystone): any; export = cors; }
// declare module './lib/core/createItems' { const createItems: any; export = createItems; }
// declare module './lib/core/createRouter' { const createRouter: any; export = createRouter; }
// ... etc for core and list methods ...

// --- Forward Declarations ---
declare class Keystone {
	/* ... */
}
declare class List {
	/* ... */
}
declare class Field {
	/* ... */
} // Base Field definition
declare class TextField extends Field {
	/* ... */
}
declare class NumberField extends Field {
	/* ... */
}
declare class TextareaField extends Field {
	/* ... */
}
declare class BooleanField extends Field {
	/* ... */
}
declare class SelectField extends Field {
	/* ... */
}
declare class DateTimeField extends Field {
	/* ... */
}
declare class DateField extends Field {
	/* ... */
}
declare class HtmlField extends Field {
	/* ... */
}
declare class TextTypeConstructor extends FieldTypeConstructor {
	/* ... */
}
declare class NumberTypeConstructor extends FieldTypeConstructor {
	/* ... */
}
declare class TextareaTypeConstructor extends FieldTypeConstructor {
	/* ... */
}
declare class BooleanTypeConstructor extends FieldTypeConstructor {
	/* ... */
}
declare class SelectTypeConstructor extends FieldTypeConstructor {
	/* ... */
}
declare class DateTimeTypeConstructor extends FieldTypeConstructor {
	/* ... */
}
declare class DateTypeConstructor extends FieldTypeConstructor {
	/* ... */
}
declare class HtmlTypeConstructor extends FieldTypeConstructor {
	/* ... */
}
// ... other field types as they are defined ...

// --- Base Field & List Interfaces ---

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
	type:
		| FieldTypeConstructor
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| DateConstructor;
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
	width?: "small" | "medium" | "large" | "full";
	/** Width of the field in the Admin UI form. */
	size?: "small" | "medium" | "large" | "full";
	/** Watch other fields and update this field's value based on changes. */
	watch?:
		| boolean
		| string
		| string[]
		| Record<string, any>
		| ((item: any) => boolean);
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
type FieldDefinition = Record<
	string,
	| FieldOptions
	| FieldTypeConstructor
	| StringConstructor
	| NumberConstructor
	| BooleanConstructor
	| DateConstructor
	| FieldDefinition
>;

/** Represents an object defining a heading in the Admin UI form. */
interface HeadingDefinition {
	/** The text of the heading. */
	heading: string;
	/** Control heading visibility in the Admin UI based on other field values. */
	dependsOn?: Record<string, any>;
	[key: string]: any;
}

/** Base interface representing a Keystone Field instance within a List. */
interface Field {
	/** Reference to the parent List instance. */
	list: List;
	/** The field's path (e.g., 'name', 'address.street'). */
	path: string;
	/** Internal Path object for handling nested paths. @internal @todo Define Path */
	_path: any;
	/** The field type name (e.g., 'text', 'relationship'). */
	type: string;
	/** The final, merged options for this field instance. */
	options: FieldOptions; // Should be overridden by specific field option types
	/** Display label for the field. */
	label: string;
	/** Description of the field type (e.g., 'Text', 'Boolean'). */
	typeDescription: string;
	/** Default options specific to the field type. @internal */
	defaults?: Partial<FieldOptions>;
	/** The Mongoose schema definition for this field. */
	schema: mongoose.SchemaDefinition[keyof mongoose.SchemaDefinition];

	// Internal properties used by base class or inherited by subclasses
	/** @internal */ _properties?: string[];
	/** @internal */ _fixedSize?: "small" | "medium" | "large" | "full";
	/** @internal */ _defaultSize?: "small" | "medium" | "large" | "full";
	/** @internal */ _nativeType?: any; // Mongoose type constructor
	/** @internal */ _underscoreMethods?: Array<
		string | { fn: string; as: string }
	>;
	/** @internal */ __options?: Record<string, any> & {
		hasFilterMethod?: boolean;
		defaultValue?: any;
	};
	/** @internal */ __size?: "small" | "medium" | "large" | "full";

	// --- Getters ---
	readonly size: "small" | "medium" | "large" | "full";
	readonly initial: boolean;
	readonly required: boolean | ((this: any) => boolean);
	readonly note: string; // HTML note
	readonly col: any; // @todo Define col type
	readonly noedit: boolean;
	readonly nocol: boolean;
	readonly nosort: boolean;
	readonly collapse: boolean;
	readonly hidden: boolean;
	readonly dependsOn: Record<string, any> | false;

	// --- Core Methods ---
	getOptions(): Record<string, any>;
	/** @internal */ getSize(): "small" | "medium" | "large" | "full";
	getDefaultValue(): any;
	getData(item: any): any;
	/** @internal */ getPreSaveWatcher(): (next: (err?: Error) => void) => void;
	addToSchema(schema: mongoose.Schema): void;
	/** @internal */ bindUnderscoreMethods(): void;
	/** @internal */ underscoreMethod(
		path: string,
		fn: (this: any, ...args: any[]) => any
	): void;
	format(item: any): any; // Often overridden
	isModified(item: any): boolean; // Often overridden
	validateInput(
		data: any,
		callback: (valid: boolean, message?: string) => void
	): void; // Often overridden
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean, message?: string) => void
	): void; // Often overridden
	/** @deprecated */ inputIsValid(
		data: any,
		required?: boolean,
		item?: any
	): boolean; // Often overridden
	updateItem(item: any, data: any, callback: (err?: Error) => void): void; // Often overridden
	getValueFromData(data: any, subpath?: string): any;
	select?: (query: any, options?: any) => void; // Optional base, implemented by some types
	populate?: (query: any, options?: any) => void; // Optional base, implemented by some types
	addFilterToQuery?: (query: any, filter: any) => void; // Optional base, implemented by some types

	// Allow for type-specific properties/methods from subclasses
	[key: string]: any;
}

/** Represents an element in the Admin UI form structure. */
interface FieldUIElement {
	type: "field";
	field: Field;
}
interface HeadingUIElement {
	type: "heading";
	heading: string;
	options: HeadingDefinition | Record<string, any>;
}
interface IndentUIElement {
	type: "indent";
}
interface OutdentUIElement {
	type: "outdent";
}
type UIElement =
	| FieldUIElement
	| HeadingUIElement
	| IndentUIElement
	| OutdentUIElement;

/** Options for configuring a Keystone List. */
interface ListOptions {
	schema?: mongoose.SchemaOptions;
	noedit?: boolean;
	nocreate?: boolean;
	nodelete?: boolean;
	autocreate?: boolean; // @todo Clarify purpose
	sortable?: boolean;
	hidden?: boolean;
	track?:
		| boolean
		| {
				createdBy?: boolean | string;
				createdAt?: boolean | string;
				updatedBy?: boolean | string;
				updatedAt?: boolean | string;
		  };
	inherits?: List;
	perPage?: number;
	searchFields?: string | string[];
	searchUsesTextIndex?: boolean;
	defaultSort?: string;
	defaultColumns?: string | string[];
	map?: Partial<ListMappings>;
	label?: string;
	singular?: string;
	plural?: string;
	path?: string;
	pre?: {
		save?: (this: mongoose.Document, next: (err?: Error) => void) => void;
	}; // @todo Add other hooks
	[key: string]: any;
}

/** Defines the mapping between special list properties and field paths. */
interface ListMappings {
	name: string | null;
	createdBy: string | null;
	createdOn: string | null;
	modifiedBy: string | null;
	modifiedOn: string | null;
}

// --- Specific Field Type Interfaces ---

// Text
interface TextFilter {
	mode?: "exactly" | "beginsWith" | "endsWith" | string;
	value?: string;
	caseSensitive?: boolean;
	inverted?: boolean;
}
interface TextFieldOptions extends FieldOptions {
	min?: number;
	max?: number;
	monospace?: boolean;
	type: TextTypeConstructor | StringConstructor;
}
interface TextField extends Field {
	_nativeType: StringConstructor;
	_properties: string[];
	_underscoreMethods: string[];
	options: TextFieldOptions;
	validateInput(data: any, callback: (valid: boolean) => void): void;
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;
	addFilterToQuery(filter: TextFilter): Record<string, any>;
	crop(
		item: any,
		length: number,
		append?: string,
		preserveWords?: boolean
	): string;
}
interface TextTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: TextFieldOptions): TextField;
	prototype: TextField;
	properName: "Text";
}

// Number
interface NumberFilter {
	mode?: "equals" | "between" | "gt" | "lt" | string;
	value?: number | string | { min?: number | string; max?: number | string };
	inverted?: boolean;
}
interface NumberFieldOptions extends FieldOptions {
	format?: string | false;
	type: NumberTypeConstructor | NumberConstructor;
}
interface NumberField extends Field {
	_nativeType: NumberConstructor;
	_fixedSize: "small";
	_underscoreMethods: string[];
	options: NumberFieldOptions;
	formatString?: string | false;
	validateInput(data: any, callback: (valid: boolean) => void): void;
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;
	inputIsValid(data: any, required?: boolean, item?: any): boolean;
	addFilterToQuery(filter: NumberFilter): Record<string, any>;
	format(item: any, format?: string): string;
}
interface NumberTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: NumberFieldOptions): NumberField;
	prototype: NumberField;
	properName: "Number";
}

// Textarea
interface TextareaFieldOptions extends FieldOptions {
	height?: number;
	min?: number;
	max?: number;
	type: TextareaTypeConstructor;
}
interface TextareaField extends Field {
	_nativeType: StringConstructor;
	_underscoreMethods: string[];
	height: number;
	multiline: true;
	_properties: string[];
	options: TextareaFieldOptions;
	validateInput(data: any, callback: (valid: boolean) => void): void;
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;
	addFilterToQuery(filter: TextFilter): Record<string, any>;
	crop(
		item: any,
		length: number,
		append?: string,
		preserveWords?: boolean
	): string;
	format(item: any): string;
}
interface TextareaTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: TextareaFieldOptions): TextareaField;
	prototype: TextareaField;
	properName: "Textarea";
}

// Boolean
interface BooleanFilter {
	value?: boolean | string;
}
interface BooleanFieldOptions extends FieldOptions {
	indent?: boolean;
	default?: boolean;
	type: BooleanTypeConstructor | BooleanConstructor;
}
interface BooleanField extends Field {
	_nativeType: BooleanConstructor;
	_properties: string[];
	_fixedSize: "full";
	indent: boolean;
	options: BooleanFieldOptions;
	defaults: { default: boolean };
	validateInput(data: any, callback: (valid: boolean) => void): void;
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;
	inputIsValid(data: any, required?: boolean): boolean;
	addFilterToQuery(filter: BooleanFilter): Record<string, any>;
}
interface BooleanTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: BooleanFieldOptions): BooleanField;
	prototype: BooleanField;
	properName: "Boolean";
}

// Select
interface SelectOption {
	value: string | number;
	label: string;
	[key: string]: any;
}
interface SelectFieldOptions extends FieldOptions {
	options: string | Array<string | number | SelectOption>;
	numeric?: boolean;
	emptyOption?: boolean;
	ui?: string;
	dataPath?: string;
	labelPath?: string;
	optionsPath?: string;
	optionsMapPath?: string;
	type: SelectTypeConstructor;
}
interface SelectFilter {
	value?: string | number | Array<string | number>;
	inverted?: boolean;
}
interface SelectField extends Field {
	ui: string;
	numeric: boolean;
	_nativeType: StringConstructor | NumberConstructor;
	_underscoreMethods: string[];
	_properties: string[];
	ops: SelectOption[];
	emptyOption: boolean;
	map: Record<string | number, SelectOption>;
	labels: Record<string | number, string>;
	values: Array<string | number>;
	options: SelectFieldOptions;
	paths: { data: string; label: string; options: string; map: string };
	addToSchema(schema: mongoose.Schema): void;
	pluck(item: any, property: keyof SelectOption | string, _default?: any): any;
	cloneOps(): SelectOption[];
	cloneMap(): Record<string | number, SelectOption>;
	addFilterToQuery(filter: SelectFilter): Record<string, any>;
	validateInput(data: any, callback: (valid: boolean) => void): void;
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;
	inputIsValid(data: any, required?: boolean, item?: any): boolean;
	format(item: any): string;
}
interface SelectTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: SelectFieldOptions): SelectField;
	prototype: SelectField;
	properName: "Select";
}

// Date & DateTime
interface DateFilter {
	mode?: "between" | "after" | "before" | string;
	value?: string | Date | moment.Moment;
	after?: string | Date | moment.Moment;
	before?: string | Date | moment.Moment;
	inverted?: boolean;
}
interface DateFieldOptions extends FieldOptions {
	format?: string | false;
	inputFormat?: string;
	yearRange?: number | number[];
	utc?: boolean;
	todayButton?: boolean;
	timezoneUtcOffsetMinutes?: number;
	type: DateTypeConstructor | DateConstructor;
}
interface DateTimeFieldOptions extends FieldOptions {
	format?: string | false;
	parseFormat?: string | string[];
	utc?: boolean;
	type: DateTimeTypeConstructor | DateConstructor;
}
interface DateField extends Field {
	_nativeType: DateConstructor;
	_underscoreMethods: string[];
	_fixedSize: "medium";
	_properties: string[];
	parseFormatString: string | string[];
	formatString?: string | false;
	yearRange?: number | number[];
	isUTC: boolean;
	todayButton: boolean;
	timezoneUtcOffsetMinutes: number;
	options: DateFieldOptions;
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;
	addFilterToQuery(filter: DateFilter): Record<string, any>;
	format(item: any, format?: string): string;
	moment(item: any): moment.Moment | null;
	parse(
		value: any,
		format?: string | string[],
		strict?: boolean
	): moment.Moment;
	validateInput(data: any, callback: (valid: boolean) => void): void;
	getData(item: any): Date | null;
	inputIsValid(data: any, required?: boolean, item?: any): boolean;
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;
}
interface DateTimeField extends Field {
	_nativeType: DateConstructor;
	_underscoreMethods: string[];
	_fixedSize: "full";
	_properties: string[];
	typeDescription: string;
	parseFormatString: string | string[];
	formatString?: string | false;
	isUTC: boolean;
	options: DateTimeFieldOptions;
	paths: { date: string; time: string; tzOffset: string };
	format: (item: any, format?: string) => string;
	moment: (item: any) => moment.Moment | null;
	parse: (
		value: any,
		format?: string | string[],
		strict?: boolean
	) => moment.Moment;
	addFilterToQuery: (filter: DateFilter) => Record<string, any>;
	getInputFromData(data: any): string | any;
	validateInput(data: any, callback: (valid: boolean) => void): void;
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;
	inputIsValid(data: any, required?: boolean, item?: any): boolean;
}
interface DateTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: DateFieldOptions): DateField;
	prototype: DateField;
	properName: "Date";
}
interface DateTimeTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: DateTimeFieldOptions): DateTimeField;
	prototype: DateTimeField;
	properName: "Datetime";
}

// Html
interface HtmlFieldOptions extends FieldOptions {
	wysiwyg?: boolean;
	height?: number;
	min?: number;
	max?: number;
	type: HtmlTypeConstructor;
}
interface HtmlField extends Field {
	_nativeType: StringConstructor;
	_defaultSize: "full";
	wysiwyg: boolean;
	height: number;
	_properties: string[];
	options: HtmlFieldOptions;
	validateInput(data: any, callback: (valid: boolean) => void): void;
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;
	addFilterToQuery(filter: TextFilter): Record<string, any>;
}
interface HtmlTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: HtmlFieldOptions): HtmlField;
	prototype: HtmlField;
	properName: "Html";
}

// --- Keystone & List Classes ---

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
	fields: Record<string, Field>; // Holds instances of Field or its subclasses
	fieldsArray: Field[];
	fieldTypes: Record<string, string | boolean>; // Map of Type JS name -> properName or true
	relationshipFields: Field[]; // @todo Use RelationshipField[] type when defined
	relationships: Record<
		string,
		{ ref: string; refPath: string; path: string; list: List; field: Field }
	>; // @todo Refine RelationshipDefinition

	mappings: ListMappings;
	model: mongoose.Model<any>; // @todo Define Mongoose Document type

	// Internal caches
	/** @internal */ _searchFields?: Field[];
	/** @internal */ _defaultColumns?: Array<{
		path: string;
		field?: Field;
		type?: string;
		label?: string;
		options?: any;
	}>;

	// --- Getters ---
	readonly label: string;
	readonly singular: string;
	readonly plural: string;
	readonly namePath: string;
	readonly nameField: Field | undefined;
	readonly nameIsVirtual: boolean;
	readonly nameFieldIsFormHeader: boolean;
	readonly nameIsInitial: boolean;
	readonly initialFields: Field[];

	// --- Getter/Setters ---
	searchFields: string | string[];
	defaultSort: string;
	defaultColumns: string | string[];

	// --- Methods ---
	add(...defs: Array<string | FieldDefinition | HeadingDefinition>): List;
	field(path: string): Field | undefined;
	field(path: string, options: FieldOptions): Field;
	field(
		path: string,
		constructor:
			| FieldTypeConstructor
			| StringConstructor
			| NumberConstructor
			| BooleanConstructor
			| DateConstructor
	): Field;

	// --- Placeholder methods needing definition from lib/list/* ---
	/** @todo Define signature from lib/list/addFiltersToQuery.js */ addFiltersToQuery: (
		query: any,
		filters: Record<string, any>
	) => any;
	/** @todo Define signature from lib/list/addSearchToQuery.js */ addSearchToQuery: (
		query: any,
		search: string
	) => any;
	/** @todo Define signature from lib/list/automap.js */ automap: (
		options?: Record<string, boolean>
	) => List;
	/** @todo Define signature from lib/list/apiForGet.js */ apiForGet: (
		item: any,
		select?: string,
		expandRelationshipFields?: boolean
	) => any;
	/** @todo Define signature from lib/list/expandColumns.js */ expandColumns: (
		cols: string | string[]
	) => Array<{
		path: string;
		field?: Field;
		type?: string;
		label?: string;
		options?: any;
	}>;
	/** @todo Define signature from lib/list/expandPaths.js */ expandPaths: (
		paths: string | string[]
	) => Field[];
	/** @todo Define signature from lib/list/expandSort.js */ expandSort: (
		sort: string
	) => Record<string, 1 | -1>;
	/** @todo Define signature from lib/list/set.js */ get: (
		key: keyof ListOptions | string
	) => any;
	/** @todo Define signature from lib/list/set.js */ set: (
		key: keyof ListOptions | string,
		value: any
	) => ListOptions;
	/** @todo Define signature from lib/list/getAdminURL.js */ getAdminURL: (
		doc?: any | string
	) => string;
	/** @todo Define signature from lib/list/getCSVData.js */ getCSVData: (
		options: any,
		user: any,
		callback: (err: any, csvData: string) => void
	) => void;
	/** @todo Define signature from lib/list/getData.js */ getData: (
		item: any,
		fields?: string | string[],
		expandRelationshipFields?: boolean
	) => any;
	/** @todo Define signature from lib/list/getDocumentName.js */ getDocumentName: (
		doc: any,
		escapeHtml?: boolean
	) => string;
	/** @todo Define signature from lib/list/getOptions.js */ getOptions: (
		optionsSet: string,
		rest?: any
	) => any;
	/** @todo Define signature from lib/list/getPages.js */ getPages: (
		query: any,
		options: { page?: number | string; perPage?: number; maxPages?: number },
		callback: (
			err: any,
			pages: {
				total: number;
				currentPage: number;
				totalPages: number;
				pages: number[];
				previous: number | false;
				next: number | false;
				first: number;
				last: number;
			}
		) => void
	) => void;
	/** @todo Define signature from lib/list/getSearchFilters.js */ getSearchFilters: (
		search: string
	) => Record<string, any>;
	/** @todo Define signature from lib/list/getUniqueValue.js */ getUniqueValue: (
		path: string,
		value: string | number,
		filters?: any,
		callback?: (err: any, uniqueValue: string | number) => void
	) => Promise<string | number>;
	/** @todo Define signature from lib/list/isReserved.js */ isReserved: (
		path: string
	) => boolean;
	/** @todo Define signature from lib/list/map.js */ map: (
		path: keyof ListMappings | string,
		mappedPath: string
	) => void;
	/** @todo Define signature from lib/list/paginate.js */ paginate: (
		options: {
			query?: any;
			page?: number | string;
			perPage?: number;
			maxPages?: number;
			filters?: Record<string, any>;
		},
		callback: (
			err: any,
			results: {
				total: number;
				results: any[];
				currentPage: number;
				totalPages: number;
				pages: number[];
				previous: number | false;
				next: number | false;
				first: number;
				last: number;
			}
		) => void
	) => void;
	/** @todo Define signature from lib/list/processFilters.js */ processFilters: (
		filters: string | Record<string, any>
	) => Record<string, any>;
	/** @todo Define signature from lib/list/register.js */ register: () => List;
	/** @todo Define signature from lib/list/relationship.js */ relationship: (def: {
		ref: string;
		refPath: string;
		path: string;
		config?: any;
	}) => void;
	/** @todo Define signature from lib/list/selectColumns.js */ selectColumns: (
		query: any,
		columns: Array<{ path: string; field?: Field }>
	) => void;
	/** @todo Define signature from lib/list/updateItem.js */ updateItem: (
		item: any,
		data: any,
		options: { files?: any; user?: any },
		callback: (err: any, item: any) => void
	) => void;
	/** @todo Define signature from lib/list/underscoreMethod.js */ underscoreMethod: (
		path: string,
		fn: Function
	) => List;
	/** @todo Define signature from lib/list/buildSearchTextIndex.js */ buildSearchTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any> | void;
	/** @todo Define signature from lib/list/declaresTextIndex.js */ declaresTextIndex: () => boolean;
	/** @todo Define signature from lib/list/ensureTextIndex.js */ ensureTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any>;
}

/** Interface defining common KeystoneJS configuration options. */
interface KeystoneOptions {
	name?: string;
	brand?: string;
	"admin path"?: string;
	compress?: boolean;
	headless?: boolean;
	logger?: string | boolean | ((...args: any[]) => void);
	"auto update"?: boolean;
	"model prefix"?: string | null;
	"module root"?: string;
	"frame guard"?: "deny" | "sameorigin" | boolean;
	"cache admin bundles"?: boolean;
	"handle uploads"?: boolean;
	env?: string;
	port?: string | number;
	host?: string;
	listen?: string;
	ssl?: boolean | "only";
	"ssl port"?: string | number;
	"ssl host"?: string;
	"ssl key"?: string;
	"ssl cert"?: string;
	"cookie secret"?: string;
	"cookie signin"?: boolean;
	"embedly api key"?: string;
	"mandrill api key"?: string;
	"mandrill username"?: string;
	"google api key"?: string;
	"google server api key"?: string;
	"ga property"?: string;
	"ga domain"?: string;
	"chartbeat property"?: string;
	"chartbeat domain"?: string;
	"allowed ip ranges"?: string | string[];
	"s3 config"?: Record<string, any> | boolean; // @todo Define S3 config type
	"azurefile config"?: Record<string, any> | boolean; // @todo Define Azure config type
	"cloudinary config"?: Record<string, any> | string | boolean; // @todo Define Cloudinary config type (@types/cloudinary)
	mongoose?: typeof mongoose;
	mongo?: string;
	session?: boolean | Record<string, any>;
	auth?: boolean | List | string; // Auth List instance, key, or boolean
	"user model"?: string;
	app?: express.Express;
	"session store"?: any; // @todo Define session store type
	nav?: Record<string, string | string[]>;
	"pre:static"?: express.RequestHandler | express.RequestHandler[];
	"pre:bodyparser"?: express.RequestHandler | express.RequestHandler[];
	"pre:session"?: express.RequestHandler | express.RequestHandler[];
	"pre:logger"?: express.RequestHandler | express.RequestHandler[];
	"pre:admin"?: express.RequestHandler | express.RequestHandler[];
	"pre:adminroutes"?: express.RequestHandler | express.RequestHandler[];
	"pre:routes"?: express.RequestHandler | express.RequestHandler[];
	"pre:render"?: express.RequestHandler | express.RequestHandler[];
	routes?: (app: express.Application) => void;
	"trust proxy"?: boolean;
	letsencrypt?:
		| boolean
		| {
				email: string;
				domains: string[];
				approveDomains?: boolean | Function;
				server?: string;
		  }; // @todo Refine letsencrypt type
	"signin logo"?: string | [string, number];
	"signin url"?: string;
	"signout url"?: string;
	[key: string]: any;
}

/** Represents a KeystoneJS v4 application instance. */
declare class Keystone {
	constructor();

	callHook: Hook["callHook"];
	addHook: Hook["addHook"];

	lists: Record<string, List>;
	fieldTypes: Record<string, any>; // @todo Replace 'any' with defined FieldType constructor
	paths: Record<string, any>; // @todo Define structure
	_options: KeystoneOptions;
	_redirects: Record<
		string,
		string | { from: string; to: string; status?: number }
	>; // @todo Define structure

	express: typeof express;
	mongoose: typeof mongoose;

	middleware: {
		/** @todo Define specific type */ api: any;
		/** @todo Define specific type */ cors: any;
	};

	app?: express.Express;
	/** @todo Define NavItem type properly */ nav?: any;

	// --- Options Management ---
	set<K extends keyof KeystoneOptions>(key: K, value: KeystoneOptions[K]): this;
	set(key: string, value: any): this;
	options(options: Partial<KeystoneOptions>): KeystoneOptions;
	options(): KeystoneOptions;
	get<K extends keyof KeystoneOptions>(key: K): KeystoneOptions[K];
	get(key: string): any;
	getPath(
		key: keyof KeystoneOptions | string,
		defaultValue?: string
	): string | undefined;
	expandPath(pathValue: string): string;

	// --- Core Methods ---
	prefixModel: (key: string) => string;
	/** @todo Define signature from lib/core/createItems.js */ createItems: any;
	createRouter: typeof express.Router;
	getOrphanedLists: () => List[];
	importer: (moduleRoot: string) => (dirname: string) => Record<string, any>;
	/** @todo Define signature from lib/core/init.js */ init: any;
	/** @todo Define signature from lib/core/initDatabaseConfig.js */ initDatabaseConfig: any;
	/** @todo Define signature from lib/core/initExpressApp.js */ initExpressApp: any;
	/** @todo Define signature from lib/core/initExpressSession.js */ initExpressSession: any;
	/** @todo Define signature from lib/core/initNav.js */ initNav: any;
	list: (key: string) => List | undefined;
	openDatabaseConnection: (
		options?: mongoose.ConnectOptions & { uri?: string },
		callback?: (err?: any) => void
	) => this;
	closeDatabaseConnection: (callback?: (err?: any) => void) => void;
	/** @todo Define signature from lib/core/populateRelated.js */ populateRelated: any;
	/** @todo Define signature from lib/core/redirect.js */ redirect: (
		from: string | Record<string, string | number>,
		to?: string,
		status?: number
	) => void;
	/** @todo Refine signature from lib/core/start.js */ start: (
		options?: Record<string, any> | ((err?: any) => void),
		callback?: (err?: any) => void
	) => void;
	/** @todo Define signature from lib/core/wrapHTMLError.js */ wrapHTMLError: any;
	/** @todo Define signature from lib/core/createKeystoneHash.js */ createKeystoneHash: any;

	applyUpdates(callback: (err?: any) => void): void;
	import(dirname: string): Record<string, any>;

	console: { err(type: string, msg: string): void };

	// --- Exposed Modules/Classes ---
	/** @todo Define Admin.Server type */ Admin: { Server: any };
	/** @todo Define Email class type */ Email: any;
	Field: FieldTypeConstructor & {
		Types: {
			Text?: TextTypeConstructor;
			Number?: NumberTypeConstructor;
			Textarea?: TextareaTypeConstructor;
			Boolean?: BooleanTypeConstructor;
			Select?: SelectTypeConstructor;
			Datetime?: DateTimeTypeConstructor;
			Date?: DateTypeConstructor;
			Html?: HtmlTypeConstructor;
			Relationship?: FieldTypeConstructor; // @todo Define
			Name?: FieldTypeConstructor; // @todo Define
			Email?: FieldTypeConstructor; // @todo Define
			Password?: FieldTypeConstructor; // @todo Define
			Money?: FieldTypeConstructor; // @todo Define
			// ... other core types ...
			[key: string]: FieldTypeConstructor | undefined;
		};
	};
	Keystone: typeof Keystone;
	List: typeof List;
	/** @todo Define Storage class type */ Storage: any;
	/** @todo Define View class type */ View: any;
	/** @todo Define content module type */ content: any;
	/** @todo Define csrf module type */ security: { csrf: any };
	/** @todo Define keystone-utils type */ utils: any;
	/** @todo Define session module type */ session: any;
	version: string;

	// Deprecated
	/** @deprecated Use `keystone.set('routes', fn)` instead. */
	routes: () => never;
}

/** The singleton Keystone instance. */
declare const keystone: Keystone;
export = keystone;

/*
Overall Usage Instructions:

1.  **Installation:**
    ```bash
    npm install --save-dev @types/express @types/mongoose @types/node @types/moment @types/numeral @types/lodash @types/marked
    # or
    yarn add --dev @types/express @types/mongoose @types/node @types/moment @types/numeral @types/lodash @types/marked
    ```
    *Note:* You might need other types like `@types/grappling-hook`.

2.  **Import Keystone:**
    ```typescript
    import * as keystone from 'keystone';
    import { Types } from 'keystone'; // Access field types via Types map

    // Configure Keystone
    keystone.set('name', 'My Project');
    // ... other settings ...

    // Define Lists
    const User = new keystone.List('User');
    User.add({
        name: { type: Types.Name, required: true }, // Assumes Types.Name is defined later
        email: { type: Types.Email, initial: true, required: true, unique: true }, // Assumes Types.Email defined later
        dob: { type: Types.Date },
        isAdmin: { type: Types.Boolean },
        bio: { type: Types.Html, wysiwyg: true },
        status: { type: Types.Select, options: 'active, inactive' }
    });
    User.register();

    keystone.start();
    ```

Overall Typing Issues & TODOs:
- **Many Field Types Missing:** Definitions are still needed for core types like Relationship, Name, Email, Password, Money, File types (LocalFile, S3, Azure, Cloudinary), GeoPoint, Location, Embedly, Code, Color, Url, Key, and Array types.
- **List Method Signatures:** Most methods on the `List.prototype` (e.g., `paginate`, `register`, `updateItem`, `getCSVData`) are still placeholders (`any` or basic signatures) and need full definition based on their source files in `lib/list/`.
- **Core Method Signatures:** Methods on `Keystone.prototype` (e.g., `init`, `start`, `populateRelated`, `createItems`) are also placeholders.
- **Utility/Module Types:** Types for internal modules (`lib/path`, `lib/content`, `lib/email`, `lib/session`, etc.) and external dependencies (`keystone-utils`) are missing.
- **Mongoose Document Typing:** Ideally, `List.model` would be typed with a specific Mongoose Document interface based on the fields added to the list, providing strong typing for document instances (e.g., `item` arguments). This is complex.
- **Plugin Effects:** Types don't currently reflect changes made by schema plugins (e.g., `track`, `autokey`).
*/
