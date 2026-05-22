/**
 * Shared type helpers for field-type unit tests.
 *
 * These types match the duck-typed shapes that `test/unit/field-filters.mts`
 * and `test/unit/field-types.mts` pass to `initList`, `testFilters`, and
 * `testFieldType` exported functions.  They are intentionally minimal — they
 * only describe the surface that each test actually touches.
 */

/**
 * Virtual field helper methods accessible via `testItem._.<fieldName>`.
 * Each field returns a helper object with format, moment, crop, etc.
 * All members are optional since different field types expose different helpers.
 */
export interface TestVirtualField {
	/** Format the field value as a string. */
	format?(...args: unknown[]): unknown;
	/** Return a dayjs object for date/datetime fields. */
	moment?(...args: unknown[]): { format(str?: string): string; isDayjs?: boolean; toDate(): Date };
	/** Crop text to N characters. */
	crop?(n: number, append?: string, preserveWords?: boolean): string;
	/** Return a gravatar URL for email fields. */
	gravatarUrl?(...args: unknown[]): string;
	/** Return km distance from coordinates for location fields. */
	kmFrom?(coords: unknown[]): number;
	/** Return miles distance from coordinates for location fields. */
	milesFrom?(coords: unknown[]): number;
}

/**
 * The virtuals namespace on test document instances (`testItem._`).
 * Maps field names to their virtual helper objects.
 */
export type TestVirtuals = { [fieldName: string]: TestVirtualField };

/** Minimal document shape returned by model queries in filter tests. */
export interface TestDoc extends Record<string, unknown> {}

/** Minimal field instance shape covering the methods called by field type tests. */
export interface TestField {
	/** Validate and update the item from data, calling callback when done. */
	updateItem(item: unknown, data: Record<string, unknown>, callback: (err?: unknown) => void): void;
	/** Validate input data for this field, calling callback with a boolean result. */
	validateInput(data: Record<string, unknown>, callback: (result: unknown) => void): void;
	/** Validate that a required field has a value, calling callback with boolean. */
	validateRequiredInput(item: unknown, data: Record<string, unknown>, callback: (result: unknown) => void): void;
	/** Returns whether the input value is valid for this field type. */
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: unknown): boolean;
	/** Convert filters to a MongoDB query fragment. */
	addFilterToQuery(filter: Record<string, unknown>): Record<string, unknown>;
	/** Get the display/stored value from a document. */
	getData(item: unknown): unknown;
	/** Get the formatted string value from a document. */
	format(item: unknown): string;
	/** Parse a raw value. */
	parse(value: unknown): unknown;
	/** Generate a key value from data. */
	generateKey(item: unknown): unknown;
	/** Get the input value from data. */
	getInputFromData(data: Record<string, unknown>): unknown;
	/** Clone the field options. */
	cloneOps(): unknown;
	/** Ops list for this field type. */
	ops: unknown[];
	/** Cloudinary-specific: remove image from multi-image field. */
	removeImage(item: unknown, publicId: string, action: string, callback: (err?: unknown) => void): void;
	/** Cloudinary-specific: get the upload folder path. */
	getFolder(item?: unknown): string;
	/** Code-specific: the configured lang value. */
	lang: string;
	/** Code-specific: merged codemirror editor config. */
	editor: Record<string, unknown>;
	/** Code-specific: raw codemirror option value. */
	codemirror: Record<string, unknown>;
	/** UTCDate-specific: forced timezone offset in minutes. */
	timezoneUtcOffsetMinutes: number;
	/** Allow any other runtime properties. */
	[key: string]: unknown;
}

/** Minimal List shape passed to `initList` and `testFieldType`. */
export interface TestList {
	key: string;
	path: string;
	schema: import('mongoose').Schema;
	model: import('mongoose').Model<Record<string, unknown>>;
	fields: Record<string, TestField>;
	fieldsArray: unknown[];
	options: Record<string, unknown>;
	add(fields: unknown): void;
	register(): void;
	addFiltersToQuery(filters: Record<string, unknown>): Record<string, unknown>;
	/** Keystone instance (available on List instances at runtime). */
	keystone: {
		set(key: string, value: unknown): unknown;
		get(key: string): unknown;
	};
}

/**
 * Filter runner function passed to `testFilters`.
 * Accepts a filter spec object, an optional property name, an optional
 * "stringify values" flag, and a results callback.
 */
export type TestFilterFn = (
	filters: Record<string, unknown>,
	prop: string | ((results: TestDoc[]) => void),
	stringifyOrCb?: boolean | ((results: TestDoc[]) => void),
	callback?: (results: TestDoc[]) => void,
) => void;
