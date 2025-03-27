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

// /** Options object used to define a field within a List. */
// interface FieldOptions {
// 	/** The field type constructor or a native JS constructor. */
// 	type:
// 		| FieldTypeConstructor
// 		| StringConstructor
// 		| NumberConstructor
// 		| BooleanConstructor
// 		| DateConstructor;
// 	/** Display label for the field in the Admin UI. */
// 	label?: string;
// 	/** Custom description for the field type (optional). */
// 	typeDescription?: string;
// 	/** Show this field on the create form. */
// 	initial?: boolean;
// 	/** Field must have a value. Can be a boolean or a function for conditional requirement. */
// 	required?: boolean | ((this: any) => boolean); // `this` context is the Mongoose document
// 	/** Create a MongoDB index for this field. */
// 	index?: boolean;
// 	/** Field value must be unique. */
// 	unique?: boolean;
// 	/** Help text (markdown) displayed beneath the field. */
// 	note?: string;
// 	/** Control field visibility in the Admin UI based on other field values. */
// 	dependsOn?: Record<string, any>;
// 	/** Prevent editing the field in the Admin UI. */
// 	noedit?: boolean;
// 	/** If true, the field does not persist to the database. */
// 	virtual?: boolean;
// 	/** Default value for the field. */
// 	default?: any;
// 	/** Mongoose schema options for this field path. */
// 	schema?: Record<string, any>;
// 	/** Deprecated: Use `size`. */
// 	width?: "small" | "medium" | "large" | "full";
// 	/** Width of the field in the Admin UI form. */
// 	size?: "small" | "medium" | "large" | "full";
// 	/** Watch other fields and update this field's value based on changes. */
// 	watch?:
// 		| boolean
// 		| string
// 		| string[]
// 		| Record<string, any>
// 		| ((item: any) => boolean);
// 	/** Function to generate the value for watched fields. `this` context is the Mongoose document. */
// 	value?: (this: any, callback: (err: any, value: any) => void) => void;
// 	/** Mongoose schema column definition (rarely used directly). */
// 	col?: any; // @todo Define col type if possible
// 	/** Exclude from Admin UI list view columns. */
// 	nocol?: boolean;
// 	/** Disable sorting by this field in the Admin UI list view. */
// 	nosort?: boolean;
// 	/** Indent the field in the Admin UI form. */
// 	indent?: boolean;
// 	/** Collapse the field in the Admin UI form by default. */
// 	collapse?: boolean;
// 	/** Hide the field from the Admin UI entirely. */
// 	hidden?: boolean;
// 	/** Auto cleanup settings (e.g., for relationship fields). */
// 	autoCleanup?: boolean; // @todo Check usage
// 	/** Thumbnail option (likely for file/image fields). */
// 	thumb?: boolean; // @todo Check usage

// 	// Allow field-type specific options
// 	[key: string]: any;
// }

// /** Base interface representing a Keystone Field instance within a List. */
// interface Field {
// 	/** Reference to the parent List instance. */
// 	list: List;
// 	/** The field's path (e.g., 'name', 'address.street'). */
// 	path: string;
// 	/** Internal Path object for handling nested paths. @internal @todo Define Path */
// 	_path: any;
// 	/** The field type name (e.g., 'text', 'relationship'). */
// 	type: string;
// 	/** The final, merged options for this field instance. */
// 	options: FieldOptions; // Should be overridden by specific field option types
// 	/** Display label for the field. */
// 	label: string;
// 	/** Description of the field type (e.g., 'Text', 'Boolean'). */
// 	typeDescription: string;
// 	/** Default options specific to the field type. @internal */
// 	defaults?: Partial<FieldOptions>;
// 	/** The Mongoose schema definition for this field. */
// 	schema: mongoose.SchemaDefinition[keyof mongoose.SchemaDefinition];

// 	// Internal properties used by base class or inherited by subclasses
// 	/** @internal */ _properties?: string[];
// 	/** @internal */ _fixedSize?: "small" | "medium" | "large" | "full";
// 	/** @internal */ _defaultSize?: "small" | "medium" | "large" | "full";
// 	/** @internal */ _nativeType?: any; // Mongoose type constructor
// 	/** @internal */ _underscoreMethods?: Array<
// 		string | { fn: string; as: string }
// 	>;
// 	/** @internal */ __options?: Record<string, any> & {
// 		hasFilterMethod?: boolean;
// 		defaultValue?: any;
// 	};
// 	/** @internal */ __size?: "small" | "medium" | "large" | "full";

// 	// --- Getters ---
// 	readonly size: "small" | "medium" | "large" | "full";
// 	readonly initial: boolean;
// 	readonly required: boolean | ((this: any) => boolean);
// 	readonly note: string; // HTML note
// 	readonly col: any; // @todo Define col type
// 	readonly noedit: boolean;
// 	readonly nocol: boolean;
// 	readonly nosort: boolean;
// 	readonly collapse: boolean;
// 	readonly hidden: boolean;
// 	readonly dependsOn: Record<string, any> | false;

// 	// --- Core Methods ---
// 	getOptions(): Record<string, any>;
// 	/** @internal */ getSize(): "small" | "medium" | "large" | "full";
// 	getDefaultValue(): any;
// 	getData(item: any): any;
// 	/** @internal */ getPreSaveWatcher(): (next: (err?: Error) => void) => void;
// 	addToSchema(schema: mongoose.Schema): void;
// 	/** @internal */ bindUnderscoreMethods(): void;
// 	/** @internal */ underscoreMethod(
// 		path: string,
// 		fn: (this: any, ...args: any[]) => any
// 	): void;
// 	format(item: any): any; // Often overridden
// 	isModified(item: any): boolean; // Often overridden
// 	validateInput(
// 		data: any,
// 		callback: (valid: boolean, message?: string) => void
// 	): void; // Often overridden
// 	validateRequiredInput(
// 		item: any,
// 		data: any,
// 		callback: (valid: boolean, message?: string) => void
// 	): void; // Often overridden
// 	/** @deprecated */ inputIsValid(
// 		data: any,
// 		required?: boolean,
// 		item?: any
// 	): boolean; // Often overridden
// 	updateItem(item: any, data: any, callback: (err?: Error) => void): void; // Often overridden
// 	getValueFromData(data: any, subpath?: string): any;
// 	select?: (query: any, options?: any) => void; // Optional base, implemented by some types
// 	populate?: (query: any, options?: any) => void; // Optional base, implemented by some types
// 	addFilterToQuery?: (query: any, filter: any) => void; // Optional base, implemented by some types

// 	// Allow for type-specific properties/methods from subclasses
// 	[key: string]: any;
// }

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

// // Select
// interface SelectOption {
// 	value: string | number;
// 	label: string;
// 	[key: string]: any;
// }
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

// /** Represents a Keystone Data List. */
// declare class List {
// 	constructor(key: string, options?: ListOptions);

// 	keystone: Keystone;
// 	options: ListOptions;
// 	key: string;
// 	path: string;
// 	schema: mongoose.Schema;
// 	schemaFields: Array<string | FieldDefinition | HeadingDefinition>;
// 	uiElements: UIElement[];
// 	underscoreMethods: Record<string, Function>;
// 	fields: Record<string, Field>; // Holds instances of Field or its subclasses
// 	fieldsArray: Field[];
// 	fieldTypes: Record<string, string | boolean>; // Map of Type JS name -> properName or true
// 	relationshipFields: Field[]; // @todo Use RelationshipField[] type when defined
// 	relationships: Record<
// 		string,
// 		{ ref: string; refPath: string; path: string; list: List; field: Field }
// 	>; // @todo Refine RelationshipDefinition

// 	mappings: ListMappings;
// 	model: mongoose.Model<any>; // @todo Define Mongoose Document type

// 	// Internal caches
// 	/** @internal */ _searchFields?: Field[];
// 	/** @internal */ _defaultColumns?: Array<{
// 		path: string;
// 		field?: Field;
// 		type?: string;
// 		label?: string;
// 		options?: any;
// 	}>;

// 	// --- Getters ---
// 	readonly label: string;
// 	readonly singular: string;
// 	readonly plural: string;
// 	readonly namePath: string;
// 	readonly nameField: Field | undefined;
// 	readonly nameIsVirtual: boolean;
// 	readonly nameFieldIsFormHeader: boolean;
// 	readonly nameIsInitial: boolean;
// 	readonly initialFields: Field[];

// 	// --- Getter/Setters ---
// 	searchFields: string | string[];
// 	defaultSort: string;
// 	defaultColumns: string | string[];

// 	// --- Methods ---
// 	add(...defs: Array<string | FieldDefinition | HeadingDefinition>): List;
// 	field(path: string): Field | undefined;
// 	field(path: string, options: FieldOptions): Field;
// 	field(
// 		path: string,
// 		constructor:
// 			| FieldTypeConstructor
// 			| StringConstructor
// 			| NumberConstructor
// 			| BooleanConstructor
// 			| DateConstructor
// 	): Field;

// 	// --- Placeholder methods needing definition from lib/list/* ---
// 	/** @todo Define signature from lib/list/addFiltersToQuery.js */ addFiltersToQuery: (
// 		query: any,
// 		filters: Record<string, any>
// 	) => any;
// 	/** @todo Define signature from lib/list/addSearchToQuery.js */ addSearchToQuery: (
// 		query: any,
// 		search: string
// 	) => any;
// 	/** @todo Define signature from lib/list/automap.js */ automap: (
// 		options?: Record<string, boolean>
// 	) => List;
// 	/** @todo Define signature from lib/list/apiForGet.js */ apiForGet: (
// 		item: any,
// 		select?: string,
// 		expandRelationshipFields?: boolean
// 	) => any;
// 	/** @todo Define signature from lib/list/expandColumns.js */ expandColumns: (
// 		cols: string | string[]
// 	) => Array<{
// 		path: string;
// 		field?: Field;
// 		type?: string;
// 		label?: string;
// 		options?: any;
// 	}>;
// 	/** @todo Define signature from lib/list/expandPaths.js */ expandPaths: (
// 		paths: string | string[]
// 	) => Field[];
// 	/** @todo Define signature from lib/list/expandSort.js */ expandSort: (
// 		sort: string
// 	) => Record<string, 1 | -1>;
// 	/** @todo Define signature from lib/list/set.js */ get: (
// 		key: keyof ListOptions | string
// 	) => any;
// 	/** @todo Define signature from lib/list/set.js */ set: (
// 		key: keyof ListOptions | string,
// 		value: any
// 	) => ListOptions;
// 	/** @todo Define signature from lib/list/getAdminURL.js */ getAdminURL: (
// 		doc?: any | string
// 	) => string;
// 	/** @todo Define signature from lib/list/getCSVData.js */ getCSVData: (
// 		options: any,
// 		user: any,
// 		callback: (err: any, csvData: string) => void
// 	) => void;
// 	/** @todo Define signature from lib/list/getData.js */ getData: (
// 		item: any,
// 		fields?: string | string[],
// 		expandRelationshipFields?: boolean
// 	) => any;
// 	/** @todo Define signature from lib/list/getDocumentName.js */ getDocumentName: (
// 		doc: any,
// 		escapeHtml?: boolean
// 	) => string;
// 	/** @todo Define signature from lib/list/getOptions.js */ getOptions: (
// 		optionsSet: string,
// 		rest?: any
// 	) => any;
// 	/** @todo Define signature from lib/list/getPages.js */ getPages: (
// 		query: any,
// 		options: { page?: number | string; perPage?: number; maxPages?: number },
// 		callback: (
// 			err: any,
// 			pages: {
// 				total: number;
// 				currentPage: number;
// 				totalPages: number;
// 				pages: number[];
// 				previous: number | false;
// 				next: number | false;
// 				first: number;
// 				last: number;
// 			}
// 		) => void
// 	) => void;
// 	/** @todo Define signature from lib/list/getSearchFilters.js */ getSearchFilters: (
// 		search: string
// 	) => Record<string, any>;
// 	/** @todo Define signature from lib/list/getUniqueValue.js */ getUniqueValue: (
// 		path: string,
// 		value: string | number,
// 		filters?: any,
// 		callback?: (err: any, uniqueValue: string | number) => void
// 	) => Promise<string | number>;
// 	/** @todo Define signature from lib/list/isReserved.js */ isReserved: (
// 		path: string
// 	) => boolean;
// 	/** @todo Define signature from lib/list/map.js */ map: (
// 		path: keyof ListMappings | string,
// 		mappedPath: string
// 	) => void;
// 	/** @todo Define signature from lib/list/paginate.js */ paginate: (
// 		options: {
// 			query?: any;
// 			page?: number | string;
// 			perPage?: number;
// 			maxPages?: number;
// 			filters?: Record<string, any>;
// 		},
// 		callback: (
// 			err: any,
// 			results: {
// 				total: number;
// 				results: any[];
// 				currentPage: number;
// 				totalPages: number;
// 				pages: number[];
// 				previous: number | false;
// 				next: number | false;
// 				first: number;
// 				last: number;
// 			}
// 		) => void
// 	) => void;
// 	/** @todo Define signature from lib/list/processFilters.js */ processFilters: (
// 		filters: string | Record<string, any>
// 	) => Record<string, any>;
// 	/** @todo Define signature from lib/list/register.js */ register: () => List;
// 	/** @todo Define signature from lib/list/relationship.js */ relationship: (def: {
// 		ref: string;
// 		refPath: string;
// 		path: string;
// 		config?: any;
// 	}) => void;
// 	/** @todo Define signature from lib/list/selectColumns.js */ selectColumns: (
// 		query: any,
// 		columns: Array<{ path: string; field?: Field }>
// 	) => void;
// 	/** @todo Define signature from lib/list/updateItem.js */ updateItem: (
// 		item: any,
// 		data: any,
// 		options: { files?: any; user?: any },
// 		callback: (err: any, item: any) => void
// 	) => void;
// 	/** @todo Define signature from lib/list/underscoreMethod.js */ underscoreMethod: (
// 		path: string,
// 		fn: Function
// 	) => List;
// 	/** @todo Define signature from lib/list/buildSearchTextIndex.js */ buildSearchTextIndex: (
// 		callback?: (err: any, results?: any) => void
// 	) => Promise<any> | void;
// 	/** @todo Define signature from lib/list/declaresTextIndex.js */ declaresTextIndex: () => boolean;
// 	/** @todo Define signature from lib/list/ensureTextIndex.js */ ensureTextIndex: (
// 		callback?: (err: any, results?: any) => void
// 	) => Promise<any>;
// }

// /** Interface defining common KeystoneJS configuration options. */
// interface KeystoneOptions {
// 	name?: string;
// 	brand?: string;
// 	"admin path"?: string;
// 	compress?: boolean;
// 	headless?: boolean;
// 	logger?: string | boolean | ((...args: any[]) => void);
// 	"auto update"?: boolean;
// 	"model prefix"?: string | null;
// 	"module root"?: string;
// 	"frame guard"?: "deny" | "sameorigin" | boolean;
// 	"cache admin bundles"?: boolean;
// 	"handle uploads"?: boolean;
// 	env?: string;
// 	port?: string | number;
// 	host?: string;
// 	listen?: string;
// 	ssl?: boolean | "only";
// 	"ssl port"?: string | number;
// 	"ssl host"?: string;
// 	"ssl key"?: string;
// 	"ssl cert"?: string;
// 	"cookie secret"?: string;
// 	"cookie signin"?: boolean;
// 	"embedly api key"?: string;
// 	"mandrill api key"?: string;
// 	"mandrill username"?: string;
// 	"google api key"?: string;
// 	"google server api key"?: string;
// 	"ga property"?: string;
// 	"ga domain"?: string;
// 	"chartbeat property"?: string;
// 	"chartbeat domain"?: string;
// 	"allowed ip ranges"?: string | string[];
// 	"s3 config"?: Record<string, any> | boolean; // @todo Define S3 config type
// 	"azurefile config"?: Record<string, any> | boolean; // @todo Define Azure config type
// 	"cloudinary config"?: Record<string, any> | string | boolean; // @todo Define Cloudinary config type (@types/cloudinary)
// 	mongoose?: typeof mongoose;
// 	mongo?: string;
// 	session?: boolean | Record<string, any>;
// 	auth?: boolean | List | string; // Auth List instance, key, or boolean
// 	"user model"?: string;
// 	app?: express.Express;
// 	"session store"?: any; // @todo Define session store type
// 	nav?: Record<string, string | string[]>;
// 	"pre:static"?: express.RequestHandler | express.RequestHandler[];
// 	"pre:bodyparser"?: express.RequestHandler | express.RequestHandler[];
// 	"pre:session"?: express.RequestHandler | express.RequestHandler[];
// 	"pre:logger"?: express.RequestHandler | express.RequestHandler[];
// 	"pre:admin"?: express.RequestHandler | express.RequestHandler[];
// 	"pre:adminroutes"?: express.RequestHandler | express.RequestHandler[];
// 	"pre:routes"?: express.RequestHandler | express.RequestHandler[];
// 	"pre:render"?: express.RequestHandler | express.RequestHandler[];
// 	routes?: (app: express.Application) => void;
// 	"trust proxy"?: boolean;
// 	letsencrypt?:
// 		| boolean
// 		| {
// 				email: string;
// 				domains: string[];
// 				approveDomains?: boolean | Function;
// 				server?: string;
// 		  }; // @todo Refine letsencrypt type
// 	"signin logo"?: string | [string, number];
// 	"signin url"?: string;
// 	"signout url"?: string;
// 	[key: string]: any;
// }

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
	/**
	 * The field type constructor (e.g., `keystone.Field.Types.Text`)
	 * or a native JS constructor (`String`, `Number`, `Boolean`, `Date`)
	 * which will be mapped to a default Keystone type.
	 */
	type:
		| FieldTypeConstructor
		| StringConstructor
		| NumberConstructor
		| BooleanConstructor
		| DateConstructor;
	/**
	 * Display label for the field in the Admin UI.
	 * Defaults to a formatted version of the field path if not provided.
	 */
	label?: string;
	/**
	 * Custom description for the field type (optional).
	 * Displayed in the Admin UI in certain contexts.
	 */
	typeDescription?: string;
	/**
	 * Show this field on the create form.
	 * Required fields are set to initial by default.
	 */
	initial?: boolean;
	/**
	 * Field must have a value. Can be a boolean or a function for conditional requirement.
	 * When using a function, `this` context is the Mongoose document.
	 */
	required?: boolean | ((this: any) => boolean);
	/**
	 * Create a MongoDB index for this field.
	 * Improves query performance on this field.
	 */
	index?: boolean;
	/**
	 * Field value must be unique across all documents in the collection.
	 * Creates a MongoDB unique index.
	 */
	unique?: boolean;
	/**
	 * Help text (markdown) displayed beneath the field in the Admin UI.
	 * Also sourced from `list.get('notes')[path]` if not provided.
	 */
	note?: string;
	/**
	 * Control field visibility in the Admin UI based on other field values.
	 * Example: `{ status: 'published' }` - only show when status is 'published'
	 */
	dependsOn?: Record<string, any>;
	/**
	 * Prevent editing the field in the Admin UI.
	 * The field will be displayed but not editable.
	 */
	noedit?: boolean;
	/**
	 * If true, the field does not persist to the database.
	 * Useful for computed fields.
	 */
	virtual?: boolean;
	/**
	 * Default value for the field.
	 * Applied when creating new documents if no value is provided.
	 */
	default?: any;
	/**
	 * Mongoose schema options for this field path.
	 * Passed directly to the Mongoose schema.
	 */
	schema?: Record<string, any>;
	/**
	 * Deprecated: Use `size` instead.
	 * Width of the field in the Admin UI form.
	 */
	width?: "small" | "medium" | "large" | "full";
	/**
	 * Width of the field in the Admin UI form.
	 * Controls the horizontal space the field occupies.
	 */
	size?: "small" | "medium" | "large" | "full";
	/**
	 * Watch other fields and update this field's value based on changes.
	 * Can be boolean, field name, array of field names, or a condition object.
	 */
	watch?:
		| boolean
		| string
		| string[]
		| Record<string, any>
		| ((item: any) => boolean);
	/**
	 * Function to generate the value for watched fields.
	 * `this` context is the Mongoose document.
	 */
	value?: (this: any, callback: (err: any, value: any) => void) => void;
	/**
	 * Mongoose schema column definition (rarely used directly).
	 * Only required if you need to define a custom schema type.
	 */
	col?: any; // @todo Define col type if possible
	/**
	 * Exclude from Admin UI list view columns.
	 * Field won't appear in the default column list.
	 */
	nocol?: boolean;
	/**
	 * Disable sorting by this field in the Admin UI list view.
	 * Field won't be sortable in list view.
	 */
	nosort?: boolean;
	/**
	 * Indent the field in the Admin UI form.
	 * Provides visual grouping.
	 */
	indent?: boolean;
	/**
	 * Collapse the field in the Admin UI form by default.
	 * User must expand to see the field.
	 */
	collapse?: boolean;
	/**
	 * Hide the field from the Admin UI entirely.
	 * Field won't be visible in either form or list views.
	 */
	hidden?: boolean;
	/**
	 * Auto cleanup settings (e.g., for relationship fields).
	 * Controls what happens when referenced documents are deleted.
	 */
	autoCleanup?: boolean; // @todo Check usage
	/**
	 * Thumbnail option (likely for file/image fields).
	 * Enables thumbnail rendering in list view for image fields.
	 */
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
	/** The field type name (e.g., 'text', 'relationship'). Set by the Field Type constructor. */
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
	/**
	 * Properties specific to the field type, used for generating Admin UI options.
	 * Defined by subclasses. @internal
	 */
	_properties?: string[];
	/**
	 * Fixed size for the field type (overrides options).
	 * Defined by subclasses. @internal
	 */
	_fixedSize?: "small" | "medium" | "large" | "full";
	/**
	 * Default size for the field type if not specified.
	 * Defined by subclasses. @internal
	 */
	_defaultSize?: "small" | "medium" | "large" | "full";
	/**
	 * The underlying Mongoose type constructor (e.g., String, Number, mongoose.Schema.Types.ObjectId).
	 * Defined by subclasses. @internal
	 */
	_nativeType?: any; // Mongoose type constructor
	/**
	 * Underscore methods to bind to the document prototype.
	 * Defined by subclasses. @internal
	 */
	_underscoreMethods?: Array<string | { fn: string; as: string }>;
	/**
	 * Cached options object for the Admin UI.
	 * @internal
	 */
	__options?: Record<string, any> & {
		hasFilterMethod?: boolean;
		defaultValue?: any;
	};
	/**
	 * Cached size value.
	 * @internal
	 */
	__size?: "small" | "medium" | "large" | "full";

	// --- Getters ---
	/** Calculated size of the field ('small', 'medium', 'large', 'full'). */
	readonly size: "small" | "medium" | "large" | "full";
	/** Whether the field is shown on the creation form. */
	readonly initial: boolean;
	/** Whether the field is required. Can be a boolean or a function. */
	readonly required: boolean | ((this: any) => boolean);
	/** The field's help note (HTML). */
	readonly note: string; // HTML note
	/** Mongoose schema column definition. */
	readonly col: any; // @todo Define col type
	/** Whether the field is editable in the Admin UI. */
	readonly noedit: boolean;
	/** Whether the field is excluded from Admin UI columns. */
	readonly nocol: boolean;
	/** Whether the field is sortable in the Admin UI. */
	readonly nosort: boolean;
	/** Whether the field is collapsed by default in the Admin UI. */
	readonly collapse: boolean;
	/** Whether the field is hidden in the Admin UI. */
	readonly hidden: boolean;
	/** The field's visibility dependencies. */
	readonly dependsOn: Record<string, any> | false;

	// --- Core Methods ---
	/**
	 * Returns the options object used by the Admin UI React components.
	 * @returns {Record<string, any>} Options object for the Admin UI.
	 */
	getOptions(): Record<string, any>;

	/**
	 * Calculates the size of the field.
	 * @returns {'small' | 'medium' | 'large' | 'full'} Field size.
	 * @internal Should use the `size` getter externally.
	 */
	getSize(): "small" | "medium" | "large" | "full";

	/**
	 * Gets the default value for the field.
	 * @returns {any} Default value for the field.
	 */
	getDefaultValue(): any;

	/**
	 * Gets the field's data from a Mongoose document.
	 * @param item The Mongoose document.
	 * @returns {any} Field value.
	 */
	getData(item: any): any;

	/**
	 * Generates the Mongoose pre-save hook function for watched fields.
	 * @returns {Function} Mongoose pre-save middleware.
	 * @internal Used by the Field constructor.
	 */
	getPreSaveWatcher(): (next: (err?: Error) => void) => void;

	/**
	 * Adds the field to the List's Mongoose Schema.
	 * Typically overridden by specific field types.
	 * @param schema The Mongoose schema.
	 */
	addToSchema(schema: mongoose.Schema): void;

	/**
	 * Binds underscore methods (from `_underscoreMethods` and `updateItem`) to the list's schema.
	 * @internal Called by `addToSchema`.
	 */
	bindUnderscoreMethods(): void;

	/**
	 * Helper to register an underscore method on the list, prefixed with the field path.
	 * @param path The method name (without field path prefix).
	 * @param fn The method implementation. `this` context is the Mongoose document.
	 * @internal
	 */
	underscoreMethod(path: string, fn: (this: any, ...args: any[]) => any): void;

	/**
	 * Formats the field's value for display.
	 * Often overridden by specific field types.
	 * @param item The Mongoose document.
	 * @returns {string | any} Formatted value.
	 */
	format(item: any): any; // Often overridden

	/**
	 * Detects whether the field has been modified in an item.
	 * @param item The Mongoose document.
	 * @returns {boolean} True if modified.
	 */
	isModified(item: any): boolean; // Often overridden

	/**
	 * Asynchronously validates provided input data for the field.
	 * Often overridden by specific field types.
	 * @param data The input data object.
	 * @param callback Receives `(isValid: boolean, message?: string)`.
	 */
	validateInput(
		data: any,
		callback: (valid: boolean, message?: string) => void
	): void; // Often overridden

	/**
	 * Asynchronously validates that required input has been provided for the field.
	 * Takes into account existing data in the item.
	 * Often overridden by specific field types.
	 * @param item The Mongoose document (for checking existing data).
	 * @param data The input data object.
	 * @param callback Receives `(isValid: boolean, message?: string)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean, message?: string) => void
	): void; // Often overridden

	/**
	 * (Deprecated) Synchronously checks if input data for the field is valid.
	 * Prefer the async `validateInput` and `validateRequiredInput` methods.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 * @param data Input data.
	 * @param required Is input required?
	 * @param item Optional Mongoose document for context.
	 * @returns {boolean} Validity state.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean; // Often overridden

	/**
	 * Updates the field's value in an item based on input data.
	 * Often overridden by specific field types.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void; // Often overridden

	/**
	 * Retrieves the field's value from a data object, handling nested paths.
	 * @param data The data object.
	 * @param subpath Optional subpath within the field.
	 * @returns {any} The value.
	 */
	getValueFromData(data: any, subpath?: string): any;

	/**
	 * Adds the field path to a Mongoose query projection.
	 * Used by `List.selectColumns`. Can be overridden.
	 * @param query The Mongoose query.
	 * @param options Options for selection.
	 */
	select?: (query: any, options?: any) => void; // Optional base, implemented by some types

	/**
	 * Adds population options to a Mongoose query for this field (e.g., for Relationships).
	 * Can be overridden.
	 * @param query The Mongoose query.
	 * @param options Population options.
	 */
	populate?: (query: any, options?: any) => void; // Optional base, implemented by some types

	/**
	 * Adds filters to a Mongoose query based on this field. Implemented by fields supporting filtering.
	 * @param query The Mongoose query.
	 * @param filter Filter options specific to the field type.
	 */
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
	/**
	 * Mongoose schema options applied to the underlying schema.
	 * Pass options directly to the Mongoose schema.
	 */
	schema?: mongoose.SchemaOptions;
	/**
	 * Prevent editing items through the Admin UI.
	 * Items will be read-only in the Admin UI.
	 */
	noedit?: boolean;
	/**
	 * Prevent creating items through the Admin UI.
	 * The "Create" button will be hidden.
	 */
	nocreate?: boolean;
	/**
	 * Prevent deleting items through the Admin UI.
	 * The "Delete" button will be hidden.
	 */
	nodelete?: boolean;
	/**
	 * Automatically create an empty item when the list is registered.
	 * Useful for singleton lists (e.g., site settings).
	 */
	autocreate?: boolean;
	/**
	 * Enable drag-and-drop sorting in the Admin UI.
	 * Adds a sortOrder field to the schema.
	 */
	sortable?: boolean;
	/**
	 * Hide the list from the main Admin UI navigation.
	 * The list will still be accessible via direct URL.
	 */
	hidden?: boolean;
	/**
	 * Enable automatic tracking fields (createdAt, createdBy, updatedAt, updatedBy).
	 * Set to true to enable all fields, or configure individually.
	 */
	track?:
		| boolean
		| {
				/** Track who created the document (references the User model) */
				createdBy?: boolean | string;
				/** Track when the document was created */
				createdAt?: boolean | string;
				/** Track who last updated the document (references the User model) */
				updatedBy?: boolean | string;
				/** Track when the document was last updated */
				updatedAt?: boolean | string;
		  };
	/**
	 * Inherit schema and options from another List instance.
	 * The parent list's fields will be included in this list.
	 */
	inherits?: List;
	/**
	 * Default number of items per page in the Admin UI list view.
	 * Controls pagination in the list view.
	 */
	perPage?: number;
	/**
	 * Fields to search by default. Can be comma-separated string or array.
	 * Supports related fields with dot notation (e.g., 'author.name').
	 */
	searchFields?: string | string[];
	/**
	 * Use MongoDB text index for searching.
	 * Requires defining a text index on the collection.
	 */
	searchUsesTextIndex?: boolean;
	/**
	 * Default sort field/path. Use '-' prefix for descending.
	 * Defaults to 'sortOrder' if sortable, otherwise namePath.
	 */
	defaultSort?: string;
	/**
	 * Default columns to display in the Admin UI list view.
	 * Comma-separated string or array of field paths.
	 */
	defaultColumns?: string | string[];
	/**
	 * Map special list properties (name, createdBy, etc.) to field paths.
	 * Used to customize which fields represent key functionality.
	 */
	map?: Partial<ListMappings>;
	/**
	 * Plural label for the list (e.g., "Users").
	 * Defaults based on the list key.
	 */
	label?: string;
	/**
	 * Singular label for the list (e.g., "User").
	 * Defaults based on label or list key.
	 */
	singular?: string;
	/**
	 * Plural label for the list (e.g., "Users").
	 * Defaults based on singular form.
	 */
	plural?: string;
	/**
	 * URL path for the list in the Admin UI (e.g., "users").
	 * Defaults based on list key.
	 */
	path?: string;
	/**
	 * Mongoose schema hooks.
	 * Define pre and post hooks for mongoose operations.
	 */
	pre?: {
		/** Hook executed before saving a document */
		save?: (this: mongoose.Document, next: (err?: Error) => void) => void;
	}; // @todo Add other pre/post hooks

	/**
	 * Allow any other custom options.
	 * These will be accessible via list.get()
	 */
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
/**
 * Filter options for Text field queries.
 */
interface TextFilter {
	/**
	 * Filter mode. Defaults to 'contains' if omitted.
	 * - 'exactly': Exact string match
	 * - 'beginsWith': String starts with value
	 * - 'endsWith': String ends with value
	 * - 'contains': String contains value (default)
	 */
	mode?: "exactly" | "beginsWith" | "endsWith" | string;
	/** The string value to filter by. */
	value?: string;
	/**
	 * Perform a case-sensitive match.
	 * Default: false (case-insensitive)
	 */
	caseSensitive?: boolean;
	/**
	 * Invert the filter logic (e.g., NOT exactly, NOT beginsWith).
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Options specific to Text fields.
 */
interface TextFieldOptions extends FieldOptions {
	/** Minimum length allowed. Validates on save. */
	min?: number;
	/** Maximum length allowed. Validates on save. */
	max?: number;
	/** Render input using a monospace font in Admin UI. */
	monospace?: boolean;
	/** Ensure type is specifically Text or String. */
	type: TextTypeConstructor | StringConstructor;
}

/**
 * Interface for Text field instances.
 */
interface TextField extends Field {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Properties exposed to Admin UI (includes 'monospace'). */
	_properties: string[];
	/** Underscore methods added to documents (includes 'crop'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: TextFieldOptions;

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
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds text-specific filtering logic to a Mongoose query.
	 * Supports 'exactly', 'beginsWith', 'endsWith', 'contains' (default) modes,
	 * case sensitivity, and inversion.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: TextFilter): Record<string, any>;

	/**
	 * Crops the field's string value from an item to the specified length.
	 * Exposed as `item._.fieldPath.crop(...)`.
	 * @param item The Mongoose document.
	 * @param length The target length.
	 * @param append String to append if cropped (defaults to '...').
	 * @param preserveWords If true, doesn't cut words in half.
	 * @returns The cropped string.
	 */
	crop(
		item: any,
		length: number,
		append?: string,
		preserveWords?: boolean
	): string;
}

/**
 * Constructor for Text field type.
 */
interface TextTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: TextFieldOptions): TextField;
	prototype: TextField;
	properName: "Text";
}

// Number
/**
 * Filter options for Number field queries.
 */
interface NumberFilter {
	/**
	 * Filter mode.
	 * - 'equals': Matches exact value or empty/null if value is empty.
	 * - 'between': Matches values within the range specified in `value.min` and `value.max`.
	 * - 'gt': Matches values greater than `value`.
	 * - 'lt': Matches values less than `value`.
	 * Default: 'equals'
	 */
	mode?: "equals" | "between" | "gt" | "lt" | string;
	/**
	 * The value(s) to filter by.
	 * - For 'equals', 'gt', 'lt': A single number or string convertible to a number.
	 * - For 'between': An object `{ min?: number | string, max?: number | string }`.
	 * - For 'equals' mode with an empty value: Matches empty/null values.
	 */
	value?: number | string | { min?: number | string; max?: number | string };
	/**
	 * Invert the filter logic (`$ne` for equals, `$nin` for arrays).
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Options specific to Number fields.
 */
interface NumberFieldOptions extends FieldOptions {
	/**
	 * Numeral.js format string (e.g., '0,0.00', '$0,0.00') or `false` to disable formatting.
	 * See http://numeraljs.com/ for format options.
	 * Default: '0,0[.][000000000000]'
	 */
	format?: string | false;
	/** Ensure type is specifically Number. */
	type: NumberTypeConstructor | NumberConstructor;
}

/**
 * Interface for Number field instances.
 */
interface NumberField extends Field {
	/** The native JavaScript type constructor (Number). */
	_nativeType: NumberConstructor;
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "small";
	/** Underscore methods added to documents (includes 'format'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: NumberFieldOptions;
	/** The numeral.js format string to use, or false if formatting is disabled. */
	formatString?: string | false;

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
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Updates the item with a valid number value, or null if the input is invalid.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

	/**
	 * (Deprecated) Synchronously checks if input data for the field is a valid number.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Adds number-specific filtering logic to a Mongoose query.
	 * Supports 'equals', 'between', 'gt', 'lt' modes, and inversion.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: NumberFilter): Record<string, any>;

	/**
	 * Formats the field's numeric value using numeral.js.
	 * Exposed as `item._.fieldPath.format(...)`.
	 * @param item The Mongoose document.
	 * @param format Optional numeral.js format string (overrides field option).
	 * @returns The formatted string, or an empty string for non-numeric values (except 0).
	 */
	format(item: any, format?: string): string;
}

/**
 * Constructor for Number field type.
 */
interface NumberTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: NumberFieldOptions): NumberField;
	prototype: NumberField;
	properName: "Number";
}

// Textarea
/**
 * Options specific to Textarea fields.
 */
interface TextareaFieldOptions extends FieldOptions {
	/**
	 * Height of the textarea in pixels.
	 * Default: 90
	 */
	height?: number;
	/** Minimum length allowed. Validates on save. */
	min?: number;
	/** Maximum length allowed. Validates on save. */
	max?: number;
	/** Ensure type is specifically Textarea. */
	type: TextareaTypeConstructor;
}

/**
 * Interface for Textarea field instances.
 */
interface TextareaField extends Field {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Underscore methods added to documents (includes 'format', 'crop'). */
	_underscoreMethods: string[];
	/** Height of the textarea in pixels. */
	height: number;
	/** Always true for Textarea fields. */
	multiline: true;
	/** Properties exposed to Admin UI (includes 'height', 'multiline'). */
	_properties: string[];
	/** Field-specific options. */
	options: TextareaFieldOptions;

	/**
	 * Validates input string length based on min/max options.
	 * Inherited from TextType.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required text input.
	 * Inherited from TextType.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds text-specific filtering logic to a Mongoose query.
	 * Inherited from TextType.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: TextFilter): Record<string, any>;

	/**
	 * Crops the field's string value from an item to the specified length.
	 * Inherited from TextType.
	 * Exposed as `item._.fieldPath.crop(...)`.
	 * @param item The Mongoose document.
	 * @param length The target length.
	 * @param append String to append if cropped (defaults to '...').
	 * @param preserveWords If true, doesn't cut words in half.
	 * @returns The cropped string.
	 */
	crop(
		item: any,
		length: number,
		append?: string,
		preserveWords?: boolean
	): string;

	/**
	 * Formats the field's value, converting newlines to <br> tags.
	 * Exposed as `item._.fieldPath.format()`.
	 * @param item The Mongoose document.
	 * @returns The formatted HTML string.
	 */
	format(item: any): string;
}

/**
 * Constructor for Textarea field type.
 */
interface TextareaTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: TextareaFieldOptions): TextareaField;
	prototype: TextareaField;
	properName: "Textarea";
}

// Boolean
/**
 * Filter options for Boolean field queries.
 */
interface BooleanFilter {
	/**
	 * If truthy or 'true', filters for `true` values.
	 * Otherwise filters for `false` or `null`/`undefined` values.
	 */
	value?: boolean | string;
}

/**
 * Options specific to Boolean fields.
 */
interface BooleanFieldOptions extends FieldOptions {
	/**
	 * Indent the checkbox in the Admin UI form.
	 * Default: false
	 */
	indent?: boolean;
	/**
	 * Default value for the field.
	 * Default: false
	 */
	default?: boolean;
	/** Ensure type is specifically Boolean. */
	type: BooleanTypeConstructor | BooleanConstructor;
}

/**
 * Interface for Boolean field instances.
 */
interface BooleanField extends Field {
	/** The native JavaScript type constructor (Boolean). */
	_nativeType: BooleanConstructor;
	/** Properties exposed to Admin UI (includes 'indent'). */
	_properties: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "full";
	/** Whether the field is indented in the Admin UI. */
	indent: boolean;
	/** Field-specific options. */
	options: BooleanFieldOptions;
	/** Default values for the Boolean type. */
	defaults: { default: boolean };

	/**
	 * Validates that the input is valid for a boolean value (boolean, string, number, null, undefined).
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required input. Considers truthy values or non-'false' strings as valid.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Updates the item, coercing input to `true` or `false`. Sets only if the value changes.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

	/**
	 * (Deprecated) Synchronously checks input for a boolean value.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean): boolean;

	/**
	 * Adds boolean-specific filtering logic to a Mongoose query.
	 * Filters for `true` or `{$ne: true}` (false or null/undefined) based on the filter value.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: BooleanFilter): Record<string, any>;
}

/**
 * Constructor for Boolean field type.
 */
interface BooleanTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: BooleanFieldOptions): BooleanField;
	prototype: BooleanField;
	properName: "Boolean";
}

// Select
/**
 * Represents a selectable option for Select fields.
 */
interface SelectOption {
	/** The raw value stored in the database. */
	value: string | number;
	/** The human-readable label displayed in the UI. */
	label: string;
	/** Allow for additional custom properties. */
	[key: string]: any;
}

/**
 * Options specific to Select fields.
 */
interface SelectFieldOptions extends FieldOptions {
	/**
	 * Defines the available choices. Can be:
	 * - A comma-separated string (e.g., 'draft,published,archived').
	 * - An array of strings or numbers (e.g., ['draft', 'published'], [1, 2, 3]).
	 * - An array of objects `{ value: string | number, label: string }`.
	 */
	options: string | Array<string | number | SelectOption>;
	/**
	 * Store the selected value as a Number instead of a String.
	 * Default: false
	 */
	numeric?: boolean;
	/**
	 * Include a blank/empty option in the UI.
	 * Default: true
	 */
	emptyOption?: boolean;
	/**
	 * Admin UI rendering style.
	 * Default: 'select'
	 */
	ui?: string; // 'select' or 'radio'
	/**
	 * Path for the 'data' virtual property.
	 * Default: path + 'Data'
	 */
	dataPath?: string;
	/**
	 * Path for the 'label' virtual property.
	 * Default: path + 'Label'
	 */
	labelPath?: string;
	/**
	 * Path for the 'options' virtual property.
	 * Default: path + 'Options'
	 */
	optionsPath?: string;
	/**
	 * Path for the 'map' virtual property.
	 * Default: path + 'OptionsMap'
	 */
	optionsMapPath?: string;
	/** Ensure type is specifically Select. */
	type: SelectTypeConstructor;
}

/**
 * Filter options for Select field queries.
 */
interface SelectFilter {
	/**
	 * The value(s) to filter by.
	 * - Single value: Matches documents with exactly this value.
	 * - Array of values: Matches documents with any of these values.
	 */
	value?: string | number | Array<string | number>;
	/**
	 * Invert the filter logic (NOT equals, or NOT IN array).
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Interface for Select field instances.
 */
interface SelectField extends Field {
	/** Admin UI rendering style ('select' or 'radio'). */
	ui: string;
	/** Whether the value is stored as a Number. */
	numeric: boolean;
	/** The native JavaScript type constructor (String or Number). */
	_nativeType: StringConstructor | NumberConstructor;
	/** Underscore methods added to documents (includes 'format', 'pluck'). */
	_underscoreMethods: string[];
	/** Properties exposed to Admin UI (includes 'ops', 'numeric'). */
	_properties: string[];
	/** Array of processed option objects with value and label properties. */
	ops: SelectOption[];
	/** Whether an empty option is included in the UI. */
	emptyOption: boolean;
	/** Map of value to option object. */
	map: Record<string | number, SelectOption>;
	/** Map of value to option label string. */
	labels: Record<string | number, string>;
	/** Array of valid enum values for the schema path. */
	values: Array<string | number>;
	/** Field-specific options. */
	options: SelectFieldOptions;
	/** Paths for virtual properties added to the schema. */
	paths: {
		/** Path to the virtual property returning the full selected option object. */
		data: string;
		/** Path to the virtual property returning the label of the selected option. */
		label: string;
		/** Path to the virtual property returning the raw options array. */
		options: string;
		/** Path to the virtual property returning the value-to-option map. */
		map: string;
	};

	/**
	 * Adds the enum path and virtuals to the schema.
	 * Overrides the base Field.addToSchema method.
	 * @param schema The Mongoose schema.
	 */
	addToSchema(schema: mongoose.Schema): void;

	/**
	 * Retrieves a property from the selected option object for an item.
	 * Exposed as `item._.fieldPath.pluck(propertyName, defaultValue)`.
	 * @param item The Mongoose document.
	 * @param property The key of the property to retrieve from the selected option object (e.g., 'label', 'value').
	 * @param _default Default value if the option is not found or doesn't have the property.
	 * @returns The value of the property from the selected option object, or the default value.
	 */
	pluck(item: any, property: keyof SelectOption | string, _default?: any): any;

	/** Returns a shallow clone of the processed `ops` array. */
	cloneOps(): SelectOption[];

	/** Returns a shallow clone of the value-to-option `map` object. */
	cloneMap(): Record<string | number, SelectOption>;

	/**
	 * Adds select-specific filtering logic to a Mongoose query.
	 * Handles single/multiple values, inversion, and empty value matching.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: SelectFilter): Record<string, any>;

	/**
	 * Validates that the input value is one of the predefined options or empty/null/undefined.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates that a non-empty, valid option is selected if required.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * (Deprecated) Synchronously checks if the input value is a valid option.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Returns the label of the selected option for an item.
	 * Exposed as `item._.fieldPath.format()`.
	 * @param item The Mongoose document.
	 * @returns The label string, or an empty string if no value or not found.
	 */
	format(item: any): string;
}

/**
 * Constructor for Select field type.
 */
interface SelectTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: SelectFieldOptions): SelectField;
	prototype: SelectField;
	properName: "Select";
}

// Date & DateTime
/**
 * Filter options for Date and DateTime field queries.
 */
interface DateFilter {
	/**
	 * Filter mode.
	 * - 'between': Matches dates within the range specified by `after` and `before`.
	 * - 'after': Matches dates after `value`.
	 * - 'before': Matches dates before `value`.
	 * Default: matches dates on the same day as `value` if mode is omitted.
	 */
	mode?: "between" | "after" | "before" | string;
	/** The date value (as string, Date, or Moment) for basic comparisons. */
	value?: string | Date | moment.Moment;
	/** The start date (as string, Date, or Moment) for 'between' mode. */
	after?: string | Date | moment.Moment;
	/** The end date (as string, Date, or Moment) for 'between' mode. */
	before?: string | Date | moment.Moment;
	/**
	 * Invert the filter logic (e.g., NOT between, NOT after).
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Options specific to Date fields.
 */
interface DateFieldOptions extends FieldOptions {
	/**
	 * Moment.js format string used for output formatting, or `false` to disable formatting.
	 * Default: 'Do MMM YYYY'
	 * @see https://momentjs.com/docs/#/displaying/format/
	 */
	format?: string | false;
	/**
	 * Moment.js format string for parsing input.
	 * Default: 'YYYY-MM-DD'
	 */
	inputFormat?: string;
	/**
	 * Range of years for date picker (e.g., `[2000, 2030]` or `10` for +/- 10 years from current).
	 * Default: 10 (+/- 10 years)
	 */
	yearRange?: number | number[];
	/**
	 * Treat date as UTC.
	 * Default: false
	 */
	utc?: boolean;
	/**
	 * Show 'Today' button in date picker.
	 * Default: true
	 */
	todayButton?: boolean;
	/**
	 * UTC offset (minutes) for correcting potentially corrupted UTC dates on retrieval.
	 * Default: Server's timezone offset.
	 */
	timezoneUtcOffsetMinutes?: number;
	/** Ensure type is Date. */
	type: DateTypeConstructor | DateConstructor;
}

/**
 * Options specific to DateTime fields.
 */
interface DateTimeFieldOptions extends FieldOptions {
	/**
	 * Moment.js format string for output, or `false` to disable formatting.
	 * Default: 'YYYY-MM-DD h:mm:ss a'
	 */
	format?: string | false;
	/**
	 * Moment.js format string(s) for parsing input.
	 * Default: Various standard formats including ISO 8601.
	 */
	parseFormat?: string | string[];
	/**
	 * Treat date/time as UTC.
	 * Default: false
	 */
	utc?: boolean;
	/** Ensure type is Datetime or Date. */
	type: DateTimeTypeConstructor | DateConstructor;
}

/**
 * Interface for Date field instances.
 */
interface DateField extends Field {
	/** The native JavaScript type constructor (Date). */
	_nativeType: DateConstructor;
	/** Underscore methods added to documents (includes 'format', 'moment', 'parse'). */
	_underscoreMethods: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "medium";
	/** Properties exposed to Admin UI. */
	_properties: string[];
	/** Moment.js format string used for parsing input. */
	parseFormatString: string | string[];
	/** Moment.js format string for output, or false to disable. */
	formatString?: string | false;
	/** Year range option for date picker. */
	yearRange?: number | number[];
	/** Whether to treat the date as UTC. */
	isUTC: boolean;
	/** Whether the date picker shows the 'Today' button. */
	todayButton: boolean;
	/** UTC offset used for potential date correction. */
	timezoneUtcOffsetMinutes: number;
	/** Field-specific options. */
	options: DateFieldOptions;

	/**
	 * Validates that required input has been provided (presence of a date value).
	 * Inherited from TextType.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds date-specific filtering logic to a Mongoose query.
	 * Supports date range filtering with 'between', 'after', 'before' modes.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: DateFilter): Record<string, any>;

	/**
	 * Formats the field's date value using moment.js.
	 * Exposed as `item._.fieldPath.format(formatString)`.
	 * @param item The Mongoose document.
	 * @param format Optional moment.js format string (overrides field option).
	 * @returns Formatted date string or empty string if no valid date.
	 */
	format(item: any, format?: string): string;

	/**
	 * Returns the field's value as a moment.js object.
	 * Takes the `isUTC` option into account.
	 * Exposed as `item._.fieldPath.moment()`.
	 * @param item The Mongoose document.
	 * @returns A moment object or null if no date.
	 */
	moment(item: any): moment.Moment | null;

	/**
	 * Parses input using moment.js with the field's `parseFormatString`.
	 * Exposed as `item._.fieldPath.parse(value, formatString, strict)`.
	 * @param value The value to parse.
	 * @param format Optional format string(s) to override field option.
	 * @param strict Whether to use strict parsing.
	 * @returns A moment object (may be invalid).
	 */
	parse(
		value: any,
		format?: string | string[],
		strict?: boolean
	): moment.Moment;

	/**
	 * Validates that the input can be parsed into a valid date by moment.js.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Retrieves the date value, applying correction logic for potentially corrupted UTC dates.
	 * @param item The Mongoose document.
	 * @returns The Date object or null.
	 */
	getData(item: any): Date | null;

	/**
	 * (Deprecated) Synchronously checks if the input is a valid date.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;

	/**
	 * Updates the item's value with a parsed Date object, or null if input is empty/invalid.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;
}

/**
 * Interface for DateTime field instances.
 */
interface DateTimeField extends Field {
	/** The native JavaScript type constructor (Date). */
	_nativeType: DateConstructor;
	/** Underscore methods added to documents (borrowed from DateType). */
	_underscoreMethods: string[];
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: "full";
	/** Properties exposed to Admin UI. */
	_properties: string[];
	/** Custom type description for the Admin UI. */
	typeDescription: string;
	/** Moment.js format string(s) for parsing input. */
	parseFormatString: string | string[];
	/** Moment.js format string for output, or false to disable. */
	formatString?: string | false;
	/** Whether to treat the date/time as UTC. */
	isUTC: boolean;
	/** Field-specific options. */
	options: DateTimeFieldOptions;
	/** Paths for the sub-fields used in the Admin UI. */
	paths: {
		/** Path for the date part input. */
		date: string;
		/** Path for the time part input. */
		time: string;
		/** Path for the timezone offset input. */
		tzOffset: string;
	};

	/**
	 * Formats the field's date/time value using moment.js.
	 * Inherited from DateType.
	 * @param item The Mongoose document.
	 * @param format Optional moment.js format string.
	 * @returns Formatted date/time string.
	 */
	format: (item: any, format?: string) => string;

	/**
	 * Returns the field's value as a moment.js object.
	 * Inherited from DateType.
	 * @param item The Mongoose document.
	 * @returns A moment object or null.
	 */
	moment: (item: any) => moment.Moment | null;

	/**
	 * Parses input using moment.js.
	 * Inherited from DateType.
	 * @param value The value to parse.
	 * @param format Optional format string(s).
	 * @param strict Whether to use strict parsing.
	 * @returns A moment object.
	 */
	parse: (
		value: any,
		format?: string | string[],
		strict?: boolean
	) => moment.Moment;

	/**
	 * Adds date-based filtering logic to a Mongoose query.
	 * Inherited from DateType.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery: (filter: DateFilter) => Record<string, any>;

	/**
	 * Gets the combined input value from date, time, and tzOffset fields in the data object,
	 * or falls back to the main path value.
	 * @param data The input data object.
	 * @returns The combined date/time string or the original value.
	 */
	getInputFromData(data: any): string | any;

	/**
	 * Validates that the input can be parsed into a valid date/time by moment.js.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates that a date/time value is present if required.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Updates the item's value with a parsed Date object, or null if input is empty/invalid.
	 * @param item The Mongoose document to update.
	 * @param data The input data object.
	 * @param callback Called after update attempt. Receives `(error?: Error)`.
	 */
	updateItem(item: any, data: any, callback: (err?: Error) => void): void;

	/**
	 * (Deprecated) Synchronously checks if the input is a valid date/time.
	 * @param data Input data.
	 * @param required Whether the field is required.
	 * @param item Optional Mongoose document for context.
	 * @returns Whether the input is valid.
	 * @deprecated Use validateInput or validateRequiredInput instead.
	 */
	inputIsValid(data: any, required?: boolean, item?: any): boolean;
}

/**
 * Constructor for Date field type.
 */
interface DateTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: DateFieldOptions): DateField;
	prototype: DateField;
	properName: "Date";
}

/**
 * Constructor for DateTime field type.
 */
interface DateTimeTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: DateTimeFieldOptions): DateTimeField;
	prototype: DateTimeField;
	properName: "Datetime";
}

// Html
/**
 * Options specific to Html fields.
 */
interface HtmlFieldOptions extends FieldOptions {
	/**
	 * Enable TinyMCE WYSIWYG editor instead of simple textarea.
	 * Default: false
	 */
	wysiwyg?: boolean;
	/**
	 * Height of the editor in pixels.
	 * Default: 180
	 */
	height?: number;
	/** Minimum length allowed. Validates on save. */
	min?: number;
	/** Maximum length allowed. Validates on save. */
	max?: number;
	/** Ensure type is Html. */
	type: HtmlTypeConstructor;
}

/**
 * Interface for Html field instances.
 */
interface HtmlField extends Field {
	/** The native JavaScript type constructor (String). */
	_nativeType: StringConstructor;
	/** Default size for the field in the Admin UI. */
	_defaultSize: "full";
	/** Whether to use the TinyMCE WYSIWYG editor. */
	wysiwyg: boolean;
	/** Height of the editor in pixels. */
	height: number;
	/** Properties exposed to Admin UI. */
	_properties: string[];
	/** Field-specific options. */
	options: HtmlFieldOptions;

	/**
	 * Validates input HTML length based on min/max options.
	 * Similar to TextType validation.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateInput(data: any, callback: (valid: boolean) => void): void;

	/**
	 * Validates required HTML input. Checks for non-empty strings.
	 * Similar to TextType validation.
	 * @param item Existing item data.
	 * @param data Input data.
	 * @param callback Receives `(isValid: boolean)`.
	 */
	validateRequiredInput(
		item: any,
		data: any,
		callback: (valid: boolean) => void
	): void;

	/**
	 * Adds text-specific filtering logic to a Mongoose query.
	 * Similar to TextType filtering.
	 * @param filter The filter definition.
	 * @returns A Mongoose query condition object.
	 */
	addFilterToQuery(filter: TextFilter): Record<string, any>;
}

/**
 * Constructor for Html field type.
 */
interface HtmlTypeConstructor extends FieldTypeConstructor {
	new (list: List, path: string, options: HtmlFieldOptions): HtmlField;
	prototype: HtmlField;
	properName: "Html";
}

// --- Keystone & List Classes ---

/** Represents a Keystone Data List. */
declare class List {
	/**
	 * Creates a new List instance.
	 * @param key The unique key for the list (e.g., 'User', 'PostCategory'). Used to generate paths and labels.
	 * @param options Configuration options for the list.
	 */
	constructor(key: string, options?: ListOptions);

	/** Reference to the Keystone instance. */
	keystone: Keystone;
	/** Merged configuration options for the list. */
	options: ListOptions;
	/** The unique key for the list. Used as identifier and to generate labels. */
	key: string;
	/** URL path for the list in the Admin UI (e.g., 'users'). */
	path: string;
	/** The Mongoose schema associated with this list. */
	schema: mongoose.Schema;
	/** Array of raw field/heading definitions added to the schema. */
	schemaFields: Array<string | FieldDefinition | HeadingDefinition>;
	/** Ordered array of UI elements (fields, headings, indents) for Admin UI forms. */
	uiElements: UIElement[];
	/** Map of custom methods added to the Mongoose documents via `list.underscoreMethod()`. */
	underscoreMethods: Record<string, Function>;
	/** Map of Field instances associated with the list, keyed by path. */
	fields: Record<string, Field>; // Holds instances of Field or its subclasses
	/** Array of all Field instances associated with the list. */
	fieldsArray: Field[];
	/** Map of field type constructors used in this list. */
	fieldTypes: Record<string, string | boolean>; // Map of Type JS name -> properName or true
	/** Array of all relationship Field instances in this list. */
	relationshipFields: Field[]; // @todo Use RelationshipField[] type when defined
	/** Map of relationship definitions defined on this list. */
	relationships: Record<
		string,
		{ ref: string; refPath: string; path: string; list: List; field: Field }
	>; // @todo Refine RelationshipDefinition

	/** Field path mapping for special list properties (name, timestamps, etc.). */
	mappings: ListMappings;
	/** The compiled Mongoose Model for this list. Available after `list.register()`. */
	model: mongoose.Model<any>; // @todo Define Mongoose Document type

	// Internal caches
	/** @internal Cache for expanded search fields. */
	_searchFields?: Field[];
	/** @internal Cache for expanded default columns. */
	_defaultColumns?: Array<{
		path: string;
		field?: Field;
		type?: string;
		label?: string;
		options?: any;
	}>;

	// --- Getters ---
	/** The display label for the list (e.g., "Users"). */
	readonly label: string;
	/** The singular display label for the list (e.g., "User"). */
	readonly singular: string;
	/** The plural display label for the list (e.g., "Users"). */
	readonly plural: string;
	/** The path of the field used as the item name/title. */
	readonly namePath: string;
	/** The Field instance used as the item name/title. */
	readonly nameField: Field | undefined;
	/** Whether the name field is a virtual field. */
	readonly nameIsVirtual: boolean;
	/** Whether the name field type is compatible as an Admin UI form header. */
	readonly nameFieldIsFormHeader: boolean;
	/** Whether the name field is available on the create form. */
	readonly nameIsInitial: boolean;
	/** Array of fields marked as initial (shown on the create form). */
	readonly initialFields: Field[];

	// --- Getter/Setters ---
	/** Gets or sets the fields used for Admin UI searching. Updates internal cache. */
	searchFields: string | string[];
	/** Gets or sets the default sort path for the Admin UI. */
	defaultSort: string;
	/** Gets or sets the default columns for the Admin UI list view. Updates internal cache. */
	defaultColumns: string | string[];

	// --- Methods ---
	/**
	 * Adds one or more fields or UI headings to the list.
	 * Multiple parameters allow for organizing fields under headings.
	 *
	 * @example
	 * // Add fields without headings
	 * List.add({
	 *   name: { type: Types.Text, required: true },
	 *   email: { type: Types.Email, required: true }
	 * });
	 *
	 * @example
	 * // Add fields with headings
	 * List.add(
	 *   { name: { type: Types.Text } },
	 *   'Contact Details',
	 *   { email: { type: Types.Email }, phone: { type: Types.Text } }
	 * );
	 */
	add(...defs: Array<string | FieldDefinition | HeadingDefinition>): List;

	/**
	 * Retrieves a Field instance by its path, or creates a new field if options are provided.
	 * @param path The field path.
	 * @returns The Field instance or undefined if not found.
	 */
	field(path: string): Field | undefined;

	/**
	 * Creates a new field with the specified options.
	 * @param path The field path.
	 * @param options Configuration options for the field.
	 * @returns The newly created Field instance.
	 */
	field(path: string, options: FieldOptions): Field;

	/**
	 * Creates a new field with the specified type constructor.
	 * @param path The field path.
	 * @param constructor Field type constructor (e.g., Types.Text).
	 * @returns The newly created Field instance.
	 */
	field(
		path: string,
		constructor:
			| FieldTypeConstructor
			| StringConstructor
			| NumberConstructor
			| BooleanConstructor
			| DateConstructor
	): Field;

	/**
	 * Adds filters to a Mongoose query based on filter conditions.
	 * @param query The Mongoose query object to modify.
	 * @param filters Filter conditions to apply.
	 * @returns The modified query object.
	 */
	addFiltersToQuery: (query: any, filters: Record<string, any>) => any;

	/**
	 * Adds search terms to a Mongoose query.
	 * Searches across fields defined in searchFields.
	 * @param query The Mongoose query object to modify.
	 * @param search The search string.
	 * @returns The modified query object.
	 */
	addSearchToQuery: (query: any, search: string) => any;

	/**
	 * Automatically maps fields based on common names if not already mapped.
	 * For example, maps 'name' to field with path 'name' if not explicitly mapped.
	 * @param options Optionally specify which fields to map or exclude.
	 * @returns The List instance for chaining.
	 */
	automap: (options?: Record<string, boolean>) => List;

	/**
	 * Generates API response data for an item, optionally expanding relationship fields.
	 * @param item The mongoose document.
	 * @param select Fields to include in response.
	 * @param expandRelationshipFields Whether to expand relationship fields.
	 * @returns Formatted object with item data.
	 */
	apiForGet: (
		item: any,
		select?: string,
		expandRelationshipFields?: boolean
	) => any;

	/**
	 * Expands column specifications into a structured array for the Admin UI.
	 * @param cols Column specification string (comma-separated) or array.
	 * @returns Array of column objects for display in the Admin UI.
	 */
	expandColumns: (cols: string | string[]) => Array<{
		path: string;
		field?: Field;
		type?: string;
		label?: string;
		options?: any;
	}>;

	/**
	 * Expands a comma-separated string or array of paths into Field instances.
	 * @param paths Field paths as string (comma-separated) or array.
	 * @returns Array of Field instances.
	 */
	expandPaths: (paths: string | string[]) => Field[];

	/**
	 * Expands a sort string into a MongoDB sort object.
	 * @param sort Sort specification string (e.g., "-createdAt name").
	 * @returns MongoDB sort object (e.g., { createdAt: -1, name: 1 }).
	 */
	expandSort: (sort: string) => Record<string, 1 | -1>;

	/**
	 * Gets a list option value.
	 * @param key Option key to retrieve.
	 * @returns Option value or undefined.
	 */
	get: (key: keyof ListOptions | string) => any;

	/**
	 * Sets a list option value.
	 * @param key Option key to set.
	 * @param value Value to set.
	 * @returns The updated options object.
	 */
	set: (key: keyof ListOptions | string, value: any) => ListOptions;

	/**
	 * Generates the Admin UI URL for the list or a specific item.
	 * @param doc Optional mongoose document or ID string.
	 * @returns Admin UI URL.
	 */
	getAdminURL: (doc?: any | string) => string;

	/**
	 * Generates CSV data for list items.
	 * @param options Options for CSV generation.
	 * @param user Current user for access control.
	 * @param callback Receives the generated CSV string.
	 */
	getCSVData: (
		options: any,
		user: any,
		callback: (err: any, csvData: string) => void
	) => void;

	/**
	 * Retrieves data for an item, optionally expanding relationship fields.
	 * @param item The mongoose document.
	 * @param fields Fields to include (comma-separated string or array).
	 * @param expandRelationshipFields Whether to expand relationship fields.
	 * @returns Object with item data.
	 */
	getData: (
		item: any,
		fields?: string | string[],
		expandRelationshipFields?: boolean
	) => any;

	/**
	 * Returns the display name of a document.
	 * Uses the path defined by namePath.
	 * @param doc The mongoose document.
	 * @param escapeHtml Whether to HTML-escape the name.
	 * @returns The document's display name.
	 */
	getDocumentName: (doc: any, escapeHtml?: boolean) => string;

	/**
	 * Retrieves list options filtered by option set.
	 * @param optionsSet Option set name (e.g., 'api', 'form').
	 * @param rest Additional options to include.
	 * @returns Filtered options object.
	 */
	getOptions: (optionsSet: string, rest?: any) => any;

	/**
	 * Calculates pagination data for a query.
	 * @param query Mongoose query object.
	 * @param options Pagination options.
	 * @param callback Receives pagination data.
	 */
	getPages: (
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

	/**
	 * Builds MongoDB filter objects from a search query string.
	 * @param search Search query string.
	 * @returns MongoDB filter conditions.
	 */
	getSearchFilters: (search: string) => Record<string, any>;

	/**
	 * Generates a unique value for a field based on input, appending numbers if needed.
	 * @param path Field path to make unique.
	 * @param value Base value to start with.
	 * @param filters Additional filters to apply.
	 * @param callback Optional callback for the unique value.
	 * @returns Promise resolving to the unique value.
	 */
	getUniqueValue: (
		path: string,
		value: string | number,
		filters?: any,
		callback?: (err: any, uniqueValue: string | number) => void
	) => Promise<string | number>;

	/**
	 * Checks if a path is reserved by the list or Mongoose.
	 * @param path Field path to check.
	 * @returns Whether the path is reserved.
	 */
	isReserved: (path: string) => boolean;

	/**
	 * Maps a special list property to a field path.
	 * @param path Special property name (e.g., 'name', 'createdAt').
	 * @param mappedPath Field path to map to.
	 */
	map: (path: keyof ListMappings | string, mappedPath: string) => void;

	/**
	 * Paginates a query with filters.
	 * @param options Pagination and filter options.
	 * @param callback Receives paginated results.
	 */
	paginate: (
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

	/**
	 * Processes filter strings or objects into MongoDB query conditions.
	 * @param filters Filter specification string or object.
	 * @returns MongoDB query conditions.
	 */
	processFilters: (
		filters: string | Record<string, any>
	) => Record<string, any>;

	/**
	 * Registers the list with Keystone, finalizing the schema and creating the Mongoose model.
	 * Must be called after adding all fields and before using the list's model.
	 * @returns The List instance for chaining.
	 */
	register: () => List;

	/**
	 * Defines a relationship to another list.
	 * Usually called internally by relationship fields.
	 * @param def Relationship definition.
	 */
	relationship: (def: {
		ref: string;
		refPath: string;
		path: string;
		config?: any;
	}) => void;

	/**
	 * Selects specific columns for a Mongoose query projection.
	 * @param query Mongoose query to modify.
	 * @param columns Columns to select.
	 */
	selectColumns: (
		query: any,
		columns: Array<{ path: string; field?: Field }>
	) => void;

	/**
	 * Updates an item with new data using UpdateHandler.
	 * @param item Mongoose document to update.
	 * @param data Update data.
	 * @param options Update options.
	 * @param callback Receives the updated item.
	 */
	updateItem: (
		item: any,
		data: any,
		options: { files?: any; user?: any },
		callback: (err: any, item: any) => void
	) => void;

	/**
	 * Adds a method to the Mongoose document instances prefixed with the field path.
	 * @param path Method name (without underscore).
	 * @param fn Method implementation.
	 * @returns The List instance for chaining.
	 */
	underscoreMethod: (path: string, fn: Function) => List;

	/**
	 * Builds MongoDB text index for this list if configured.
	 * @param callback Optional callback for completion.
	 * @returns Promise if no callback provided.
	 */
	buildSearchTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any> | void;

	/**
	 * Checks if this list's schema declares a text index.
	 * @returns Whether the schema has a text index.
	 */
	declaresTextIndex: () => boolean;

	/**
	 * Ensures MongoDB text index exists if searchUsesTextIndex is enabled.
	 * @param callback Optional callback for completion.
	 * @returns Promise resolving when index is created.
	 */
	ensureTextIndex: (
		callback?: (err: any, results?: any) => void
	) => Promise<any>;
}

/** Interface defining common KeystoneJS configuration options. */
interface KeystoneOptions {
	/** Name of the project/application. Displayed in the Admin UI. */
	name?: string;
	/** Brand text to display at the top of the Admin UI signin page. */
	brand?: string;
	/**
	 * Path to the Admin UI.
	 * Default: '/keystone'
	 */
	"admin path"?: string;
	/**
	 * Enable HTTP compression.
	 * Default: true
	 */
	compress?: boolean;
	/**
	 * Run without Admin UI (API only).
	 * Default: false
	 */
	headless?: boolean;
	/**
	 * Logging configuration (true, false, or a function).
	 * Default: console.log
	 */
	logger?: string | boolean | ((...args: any[]) => void);
	/**
	 * Auto-create/update lists from schema changes.
	 * Default: process.env.NODE_ENV !== 'production'
	 */
	"auto update"?: boolean;
	/**
	 * Prefix for all MongoDB collection names.
	 * Default: '' (empty string)
	 */
	"model prefix"?: string | null;
	/**
	 * Path to the root of the consuming module/project.
	 * Default: based on module location
	 */
	"module root"?: string;
	/**
	 * X-Frame-Options protection for clickjacking.
	 * Default: 'sameorigin'
	 */
	"frame guard"?: "deny" | "sameorigin" | boolean;
	/**
	 * Cache Admin UI bundles in production.
	 * Default: true
	 */
	"cache admin bundles"?: boolean;
	/**
	 * Enable file upload handling.
	 * Default: true
	 */
	"handle uploads"?: boolean;
	/**
	 * Environment name (usually 'development', 'production').
	 * Default: process.env.NODE_ENV
	 */
	env?: string;
	/**
	 * HTTP port to listen on.
	 * Default: process.env.PORT || 3000
	 */
	port?: string | number;
	/**
	 * Host to bind the server to.
	 * Default: process.env.HOST || '0.0.0.0'
	 */
	host?: string;
	/**
	 * Specific IP/Host to listen on (overrides host/port).
	 * Default: undefined
	 */
	listen?: string;
	/**
	 * Enable HTTPS. 'only' forces HTTPS and redirects HTTP.
	 * Default: false
	 */
	ssl?: boolean | "only";
	/**
	 * HTTPS port (only used if ssl is enabled).
	 * Default: 3001
	 */
	"ssl port"?: string | number;
	/**
	 * Host to bind the HTTPS server to.
	 * Default: value of 'host'
	 */
	"ssl host"?: string;
	/**
	 * Path to SSL key file or the key itself.
	 * Required if ssl is enabled.
	 */
	"ssl key"?: string;
	/**
	 * Path to SSL certificate file or the cert itself.
	 * Required if ssl is enabled.
	 */
	"ssl cert"?: string;
	/**
	 * Secret used for signing cookies.
	 * Required for session support.
	 */
	"cookie secret"?: string;
	/**
	 * Enable signin cookies (for persistent sessions).
	 * Default: true in development
	 */
	"cookie signin"?: boolean;
	/**
	 * Embedly API key for oEmbed support.
	 */
	"embedly api key"?: string;
	/**
	 * Mandrill API key for email sending.
	 */
	"mandrill api key"?: string;
	/**
	 * Mandrill username for email sending.
	 */
	"mandrill username"?: string;
	/**
	 * Google API Browser key.
	 */
	"google api key"?: string;
	/**
	 * Google API Server key.
	 */
	"google server api key"?: string;
	/**
	 * Google Analytics property ID.
	 */
	"ga property"?: string;
	/**
	 * Google Analytics domain.
	 */
	"ga domain"?: string;
	/**
	 * Chartbeat property ID.
	 */
	"chartbeat property"?: string;
	/**
	 * Chartbeat domain.
	 */
	"chartbeat domain"?: string;
	/**
	 * Whitelist IP ranges for Admin UI access.
	 */
	"allowed ip ranges"?: string | string[];
	/**
	 * Amazon S3 configuration.
	 * Can be a config object, or true to use environment variables.
	 */
	"s3 config"?: Record<string, any> | boolean;
	/**
	 * Azure Storage configuration.
	 * Can be a config object, or true to use environment variables.
	 */
	"azurefile config"?: Record<string, any> | boolean;
	/**
	 * Cloudinary configuration.
	 * Can be a config object, URL string, or true to use environment variables.
	 */
	"cloudinary config"?: Record<string, any> | string | boolean;
	/**
	 * Mongoose instance to use.
	 * Default: internal Mongoose instance
	 */
	mongoose?: typeof mongoose;
	/**
	 * MongoDB connection URI.
	 * Default: 'mongodb://localhost/keystone-db'
	 */
	mongo?: string;
	/**
	 * Session configuration.
	 * true enables default MongoDB session store.
	 */
	session?: boolean | Record<string, any>;
	/**
	 * Enable authentication.
	 * true requires 'user model' and 'cookie secret'.
	 */
	auth?: boolean | List | string;
	/**
	 * Key of the list to use for authentication.
	 * Default: 'User'
	 */
	"user model"?: string;
	/**
	 * Custom Express app instance.
	 * Use if you need to customize Express before Keystone initialization.
	 */
	app?: express.Express;
	/**
	 * Express session store instance.
	 * Default: Connects-Mongo based on MongoDB connection.
	 */
	"session store"?: any;
	/**
	 * Navigation structure for Admin UI.
	 * Maps section names to lists or arrays of lists.
	 */
	nav?: Record<string, string | string[]>;
	/**
	 * Middleware executed before static assets handling.
	 */
	"pre:static"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before body parser.
	 */
	"pre:bodyparser"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before session handling.
	 */
	"pre:session"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before logger.
	 */
	"pre:logger"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before Admin UI.
	 */
	"pre:admin"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before Admin UI routes.
	 */
	"pre:adminroutes"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before application routes.
	 */
	"pre:routes"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Middleware executed before rendering views.
	 */
	"pre:render"?: express.RequestHandler | express.RequestHandler[];
	/**
	 * Custom route handler function.
	 * @param app The Express application instance.
	 */
	routes?: (app: express.Application) => void;
	/**
	 * Trust proxy headers (X-Forwarded-For, etc).
	 * Default: true
	 */
	"trust proxy"?: boolean;
	/**
	 * Let's Encrypt configuration for auto-SSL.
	 * Default: false
	 */
	letsencrypt?:
		| boolean
		| {
				/** Email address for Let's Encrypt registration. */
				email: string;
				/** Domain names to secure. */
				domains: string[];
				/** Domain approval logic or flag. */
				approveDomains?: boolean | Function;
				/** Let's Encrypt server (production or staging). */
				server?: string;
		  };
	/**
	 * Logo for Admin UI signin page.
	 * String URL or [URL, height] array.
	 * Default: false
	 */
	"signin logo"?: string | [string, number];
	/**
	 * Custom URL for signin page.
	 * Default: false
	 */
	"signin url"?: string;
	/**
	 * Custom URL for signout page.
	 * Default: false
	 */
	"signout url"?: string;

	/**
	 * Allow any other custom options.
	 * Additional options will be accessible via keystone.get().
	 */
	[key: string]: any;
}

/** Represents a KeystoneJS v4 application instance. */
declare class Keystone {
	/** Initializes a new Keystone instance. */
	constructor();

	/** Method to call hooks registered with grappling-hook. */
	callHook: Hook["callHook"];
	/** Method to register hooks with grappling-hook. */
	addHook: Hook["addHook"];

	/** Map of all registered List instances, keyed by list key. */
	lists: Record<string, List>;
	/** Map of registered field types. @todo Replace 'any' with defined FieldType constructor. */
	fieldTypes: Record<string, any>;
	/** Map of paths for custom view templates. @todo Define structure. */
	paths: Record<string, any>;
	/** Internal storage for configuration options set via keystone.set(). */
	_options: KeystoneOptions;
	/** Map of defined URL redirects. */
	_redirects: Record<
		string,
		string | { from: string; to: string; status?: number }
	>;

	/** Express.js library instance. */
	express: typeof express;
	/** Mongoose library instance. */
	mongoose: typeof mongoose;

	/** Built-in middleware handlers. */
	middleware: {
		/** API middleware for serving JSON data. */
		api: any;
		/** CORS middleware for cross-origin requests. */
		cors: any;
	};

	/** The Express application instance (available after init). */
	app?: express.Express;
	/** Navigation structure for the Admin UI (available after initNav). */
	nav?: {
		sections: Array<{
			label: string;
			key: string;
			lists: Array<{ key: string; path: string; label: string; options: any }>;
		}>;
		by: {
			list: Record<
				string,
				{ key: string; path: string; label: string; options: any }
			>;
		};
	};

	// --- Options Management ---
	/**
	 * Sets a configuration option.
	 * @param key Option key to set.
	 * @param value Value to set.
	 * @returns The Keystone instance for chaining.
	 */
	set<K extends keyof KeystoneOptions>(key: K, value: KeystoneOptions[K]): this;
	set(key: string, value: any): this;

	/**
	 * Get or set multiple options at once.
	 * @param options Object of options to set.
	 * @returns Current options object.
	 */
	options(options: Partial<KeystoneOptions>): KeystoneOptions;

	/**
	 * Get the current options object.
	 * @returns Current options object.
	 */
	options(): KeystoneOptions;

	/**
	 * Gets a configuration option value.
	 * @param key Option key to retrieve.
	 * @returns Option value.
	 */
	get<K extends keyof KeystoneOptions>(key: K): KeystoneOptions[K];
	get(key: string): any;

	/**
	 * Gets a path-based configuration option, applying path resolution.
	 * @param key Path option key to retrieve.
	 * @param defaultValue Default value if not set.
	 * @returns Resolved path value.
	 */
	getPath(
		key: keyof KeystoneOptions | string,
		defaultValue?: string
	): string | undefined;

	/**
	 * Expands a relative path using the module root.
	 * @param pathValue Relative path to expand.
	 * @returns Absolute path.
	 */
	expandPath(pathValue: string): string;

	// --- Core Methods ---
	/**
	 * Prefixes a model name with the configured model prefix.
	 * @param key Model name to prefix.
	 * @returns Prefixed model name.
	 */
	prefixModel: (key: string) => string;

	/**
	 * Creates multiple items across lists.
	 * @todo Define signature from lib/core/createItems.js
	 */
	createItems: any;

	/**
	 * Creates an Express router instance.
	 * Same as express.Router() but maintained for legacy compatibility.
	 */
	createRouter: typeof express.Router;

	/**
	 * Retrieves lists that aren't part of the Admin UI navigation.
	 * @returns Array of orphaned List instances.
	 */
	getOrphanedLists: () => List[];

	/**
	 * Creates an importer function for a specific module root.
	 * @param moduleRoot Path to the module root.
	 * @returns Importer function that loads modules relative to the root.
	 */
	importer: (moduleRoot: string) => (dirname: string) => Record<string, any>;

	/**
	 * Initializes Keystone, setting up database, express, and admin UI.
	 * @todo Define signature from lib/core/init.js
	 */
	init: any;

	/**
	 * Initializes the database configuration.
	 * @todo Define signature from lib/core/initDatabaseConfig.js
	 */
	initDatabaseConfig: any;

	/**
	 * Initializes the Express application.
	 * @todo Define signature from lib/core/initExpressApp.js
	 */
	initExpressApp: any;

	/**
	 * Initializes the Express session handling.
	 * @todo Define signature from lib/core/initExpressSession.js
	 */
	initExpressSession: any;

	/**
	 * Initializes the Admin UI navigation structure.
	 * @todo Define signature from lib/core/initNav.js
	 */
	initNav: any;

	/**
	 * Retrieves a registered List by its key.
	 * @param key List key.
	 * @returns The List instance or undefined if not found.
	 */
	list: (key: string) => List | undefined;

	/**
	 * Opens a connection to the MongoDB database.
	 * @param options Connection options.
	 * @param callback Callback for connection result.
	 * @returns The Keystone instance for chaining.
	 */
	openDatabaseConnection: (
		options?: mongoose.ConnectOptions & { uri?: string },
		callback?: (err?: any) => void
	) => this;

	/**
	 * Closes the current MongoDB connection.
	 * @param callback Callback for when connection is closed.
	 */
	closeDatabaseConnection: (callback?: (err?: any) => void) => void;

	/**
	 * Populates relationship fields in a document.
	 * @todo Define signature from lib/core/populateRelated.js
	 */
	populateRelated: any;

	/**
	 * Registers URL redirects.
	 * @param from Source URL or object mapping sources to destinations.
	 * @param to Destination URL (if from is a string).
	 * @param status HTTP status code (default: 302).
	 */
	redirect: (
		from: string | Record<string, string | number>,
		to?: string,
		status?: number
	) => void;

	/**
	 * Starts the Keystone server.
	 * @param options Start options or callback.
	 * @param callback Callback when server is started.
	 */
	start: (
		options?: Record<string, any> | ((err?: any) => void),
		callback?: (err?: any) => void
	) => void;

	/**
	 * Wraps an error in HTML for browser display.
	 * @todo Define signature from lib/core/wrapHTMLError.js
	 */
	wrapHTMLError: any;

	/**
	 * Creates a Keystone-specific hash.
	 * @todo Define signature from lib/core/createKeystoneHash.js
	 */
	createKeystoneHash: any;

	/**
	 * Applies updates to the Keystone application.
	 * @param callback Callback for when updates are applied.
	 */
	applyUpdates(callback: (err?: any) => void): void;

	/**
	 * Imports modules from a directory relative to the module root.
	 * @param dirname Directory to import from.
	 * @returns Object mapping filenames to loaded modules.
	 */
	import(dirname: string): Record<string, any>;

	/** Utility for logging configuration errors. */
	console: { err(type: string, msg: string): void };

	// --- Exposed Modules/Classes ---
	/** Admin UI server and utilities. */
	Admin: { Server: any };
	/** Email sending utilities. */
	Email: any;
	/** Field type base constructor and type collection. */
	Field: FieldTypeConstructor & {
		Types: {
			/** Standard text field. */
			Text?: TextTypeConstructor;
			/** Numeric field with formatting options. */
			Number?: NumberTypeConstructor;
			/** Multi-line text field. */
			Textarea?: TextareaTypeConstructor;
			/** Boolean/checkbox field. */
			Boolean?: BooleanTypeConstructor;
			/** Single-select dropdown/radio field. */
			Select?: SelectTypeConstructor;
			/** Combined date and time field. */
			Datetime?: DateTimeTypeConstructor;
			/** Date-only field. */
			Date?: DateTypeConstructor;
			/** Rich text WYSIWYG editor field. */
			Html?: HtmlTypeConstructor;
			/** Relationship to other list items. */
			Relationship?: FieldTypeConstructor;
			/** Name field (first/last name). */
			Name?: FieldTypeConstructor;
			/** Email field with validation. */
			Email?: FieldTypeConstructor;
			/** Password field with encryption. */
			Password?: FieldTypeConstructor;
			/** Currency field with formatting. */
			Money?: FieldTypeConstructor;
			// ... other core types ...
			[key: string]: FieldTypeConstructor | undefined;
		};
	};
	/** Reference to the Keystone constructor. */
	Keystone: typeof Keystone;
	/** Reference to the List constructor. */
	List: typeof List;
	/** Storage adapters for file uploads. */
	Storage: any;
	/** Template rendering utilities. */
	View: any;
	/** Content rendering utilities. */
	content: any;
	/** Security utilities including CSRF protection. */
	security: { csrf: any };
	/** General utilities for string manipulation, etc. */
	utils: any;
	/** Session management utilities. */
	session: any;
	/** Keystone version string. */
	version: string;

	// Deprecated methods
	/**
	 * @deprecated Use `keystone.set('routes', fn)` instead.
	 * Originally used to define routes directly on the Keystone instance.
	 */
	routes: () => never;
}

/** The singleton Keystone instance. */
declare const keystone: Keystone;
export = keystone;

/*
Usage Instructions:

1.  **Installation:**
    ```bash
    npm install --save-dev @types/express @types/mongoose @types/node @types/moment @types/numeral @types/lodash @types/marked
    # or
    yarn add --dev @types/express @types/mongoose @types/node @types/moment @types/numeral @types/lodash @types/marked
    ```
    *Note:* You might need other types like `@types/grappling-hook` depending on your usage.

2.  **Basic Usage:**
    ```typescript
    import * as keystone from 'keystone';
    
    // Configure Keystone
    keystone.set('name', 'My Project');
    keystone.set('user model', 'User');
    keystone.set('mongo', 'mongodb://localhost/my-project');
    keystone.set('admin path', 'admin');
    
    // Define Lists
    const User = new keystone.List('User', {
      track: true, // Adds createdAt, createdBy, updatedAt, updatedBy
      autokey: { path: 'slug', from: 'name', unique: true } // Requires keystone-list-plugins
    });
    
    User.add({
      name: { type: keystone.Field.Types.Text, required: true, index: true },
      email: { type: keystone.Field.Types.Email, initial: true, required: true, unique: true },
      password: { type: keystone.Field.Types.Password, initial: true },
      isAdmin: { type: keystone.Field.Types.Boolean, default: false }
    });
    
    User.defaultColumns = 'name, email, isAdmin';
    User.register();
    
    // Start the application
    keystone.start();
    ```

3.  **Accessing List Methods:**
    ```typescript
    const Post = keystone.list('Post');
    
    // Using the updateItem method
    Post.updateItem(existingPost, { title: 'New Title' }, { user: req.user }, function(err, post) {
      if (err) return handleError(err);
      console.log(`Updated post: ${post.title}`);
    });
    
    // Using the expandColumns method
    const columns = Post.expandColumns('title,status,author');
    console.log(columns); // Array of column objects
    ```

4.  **Accessing Field Methods:**
    ```typescript
    const titleField = Post.field('title');
    if (titleField) {
      // Get Admin UI options
      const uiOptions = titleField.getOptions();
      
      // Format a value
      const formattedTitle = titleField.format(post);
      console.log(`Formatted title: ${formattedTitle}`);
    }
    ```

5.  **Creating a Custom Field Type:**
    ```typescript
    // Extending an existing field type
    keystone.Field.Types.MyText = keystone.Field.Types.Text.extend({
      getOptions: function() {
        const options = keystone.Field.Types.Text.prototype.getOptions.call(this);
        options.myCustomOption = this.options.myCustomOption || false;
        return options;
      }
    });
    ```

6. **Using TypeScript Types for Existing Documents:**
   ```typescript
   // Define a custom interface for your User model
   interface UserDocument extends mongoose.Document {
     name: string;
     email: string;
     password: { hash: string };
     isAdmin: boolean;
     createdAt: Date;
     createdBy?: UserDocument;
   }
   
   // Use the type with the model
   const User = keystone.list('User');
   const userModel = User.model as mongoose.Model<UserDocument>;
   
   // Now you have type safety
   userModel.findOne({ email: 'example@example.com' }, (err, user) => {
     if (user) {
       console.log(user.name); // Properly typed as string
       console.log(user.isAdmin); // Properly typed as boolean
     }
   });
   ```

Type Definition Notes:
- This type definition focuses on core Keystone v4 functionality, but might not cover all plugins/extensions.
- Some field types like Relationship, Name, Email, Password, Money, File types, etc. still need proper type definitions.
- List method signatures (paginate, register, updateItem, etc.) may need refinement based on actual implementation.
- Many core Keystone methods (init, start, populateRelated) still have placeholder signatures.
- Consider creating your own custom typings for specific models in your application for better type safety.
- The Mongoose Document typing for List.model currently uses 'any' - ideally it would be a specific interface based on the fields.
*/
