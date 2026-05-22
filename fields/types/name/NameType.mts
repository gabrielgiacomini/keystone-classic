import { FieldType } from '../Type.mjs';
import type { FieldOptionsBase, MongooseDocument, KeystoneList } from '../Type.mjs';
import displayName from '../../../lib/utils/displayName.mjs';
import { defer } from '../../../lib/utils/async.mjs';
import { escapeRegExp } from '../../../lib/utils/regexp.mjs';
import type { Schema } from 'mongoose';

/**
 * Shape of the name object stored on a document and passed via form data.
 */
export interface NameValue {
	first?: string | null;
	last?: string | null;
}

function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && (typeof value === 'object' || typeof value === 'function');
}

/**
 * Possible shapes returned from {@link NameFieldInstance.getInputFromData}.
 */
type NameInputFromData = null | string | NameValue | undefined;

/**
 * Filter descriptor passed from the admin UI for name field queries.
 */
export interface NameFilter {
	mode?: 'exactly' | 'beginsWith' | 'endsWith';
	value: string;
	inverted?: boolean;
	caseSensitive?: boolean;
}

/**
 * Sort options accepted by `getSortString`.
 */
interface SortOptions {
	invert?: boolean;
}

/**
 * Describes the `this` context available inside `name_` prototype methods.
 * The instance is shaped by the `FieldType` base constructor plus the
 * `addToSchema` method defined below.
 */
interface NameFieldInstance {
	path: string;
	paths: {
		first: string;
		last: string;
		full: string;
	};
	_fixedSize: string;
	bindUnderscoreMethods(): void;
	getInputFromData(data: Record<string, unknown>): NameInputFromData;
	getValueFromData(data: Record<string, unknown>, subpath?: string): unknown;
	get(path: string): unknown;
}

/**
 * Stores a person's name as nested `first` / `last` sub-fields, with a
 * virtual `full` field that combines them. Handles CJK name ordering (via
 * `displayName`). Accepts a flat `full` string or a `{ first, last }` object
 * from form submissions.
 *
 * @param list The Keystone List this field belongs to.
 * @param path The dot-separated field path on the schema.
 * @param options Field configuration passed through to `FieldType`.
 */
class NameType extends FieldType<KeystoneFieldOptionsForNameType, NameValue> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Name';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'name';

	declare _fixedSize: 'full';

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForNameType) {
		options.default = { first: '', last: '' };
		super(list, path, options);
	}

	/**
	 * Registers `first`, `last`, and `full` (virtual) sub-fields on the Mongoose
	 * schema and binds underscore methods.
	 * @param schema The Mongoose Schema to extend.
	 */
	override addToSchema (this: NameFieldInstance, schema: Schema): void {
		const paths = this.paths = {
			first: this.path + '.first',
			last: this.path + '.last',
			full: this.path + '.full',
		};
		(schema as Schema & { nested: Record<string, boolean> }).nested[this.path] = true;
		schema.add({ first: String, last: String }, this.path + '.');
		schema.virtual(paths.full).get(function (this: MongooseDocument) {
			return displayName(this.get(paths.first) as string, this.get(paths.last) as string);
		});
		schema.virtual(paths.full).set(function (this: MongooseDocument, value: unknown) {
			if (typeof value !== 'string') {
				this.set(paths.first, undefined);
				this.set(paths.last, undefined);
				return;
			}
			const split = value.split(' ');
			this.set(paths.first, split.shift());
			this.set(paths.last, split.join(' ') || undefined);
		});
		this.bindUnderscoreMethods();
	}

	/**
	 * Returns a Mongoose sort string for this field.
	 * @param options Pass `{ invert: true }` to sort descending.
	 * @returns A space-separated Mongoose sort expression (e.g. `'name.first name.last'`).
	 */
	getSortString (this: NameFieldInstance, options: SortOptions): string {
		if (options.invert) {
			return '-' + this.paths.first + ' -' + this.paths.last;
		}
		return this.paths.first + ' ' + this.paths.last;
	}

	/**
	 * Builds a Mongoose query condition that searches across both `first` and
	 * `last` sub-fields. Supports the same filter modes as the Text field.
	 * @param filter Filter descriptor from the admin UI.
	 * @returns Mongoose condition object (may use `$or` for non-inverted matches).
	 */
	addFilterToQuery (this: NameFieldInstance, filter: NameFilter): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		if (filter.mode === 'exactly' && !filter.value) {
			query[this.paths.first] = query[this.paths.last] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
			return query;
		}
		let value: string | RegExp = escapeRegExp(filter.value);
		if (filter.mode === 'beginsWith') {
			value = '^' + value;
		} else if (filter.mode === 'endsWith') {
			value = value + '$';
		} else if (filter.mode === 'exactly') {
			value = '^' + value + '$';
		}
		value = new RegExp(value, filter.caseSensitive ? '' : 'i');
		if (filter.inverted) {
			query[this.paths.first] = query[this.paths.last] = { $not: value };
		} else {
			const first: Record<string, unknown> = {}; first[this.paths.first] = value;
			const last: Record<string, unknown> = {}; last[this.paths.last] = value;
			query.$or = [first, last];
		}
		return query;
	}

	override format (this: NameFieldInstance, item: MongooseDocument): string {
		return item.get(this.paths.full) as string;
	}

	/**
	 * Extracts the name value from a submitted data object, normalising flat
	 * (`name_first`, `name.first`) and nested (`name: { first, last }`) formats.
	 * @param data The submitted data object.
	 * @returns `null`, a full-name string, a `{ first, last }` object, or another value from the data payload (including `undefined`).
	 */
	getInputFromData (this: NameFieldInstance, data: Record<string, unknown>): NameInputFromData {
		if (data[this.path] === null) {
			return null;
		}
		let first = this.getValueFromData(data, '_first');
		if (first === undefined) first = this.getValueFromData(data, '.first');
		let last = this.getValueFromData(data, '_last');
		if (last === undefined) last = this.getValueFromData(data, '.last');
		if (first !== undefined || last !== undefined) {
			return { first: first as string | null | undefined, last: last as string | null | undefined };
		}
		return (this.getValueFromData(data) || this.getValueFromData(data, '.full')) as NameInputFromData;
	}

	/**
	 * Validates that the submitted value is a string, `null`, `undefined`, or an
	 * object with string/null `first`/`last` properties.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	override validateInput (this: NameFieldInstance, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getInputFromData(data);
		const result = value === undefined
			|| value === null
			|| typeof value === 'string'
			|| (typeof value === 'object' && (
				typeof value.first === 'string'
				|| value.first === null
				|| typeof value.last === 'string'
				|| value.last === null
			));
		defer(callback, result);
	}

	/**
	 * Validates that a non-empty name value is present in `data` or already on
	 * `item`. Returns `false` when the explicit value `null` is submitted.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when a required name is present.
	 */
	override validateRequiredInput (this: NameFieldInstance, item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getInputFromData(data);
		let result: boolean;
		if (value === null) {
			result = false;
		} else {
			const nameVal = value;
			result = (
				typeof nameVal === 'string' && nameVal.length > 0
				|| typeof nameVal === 'object' && (
					typeof nameVal.first === 'string' && nameVal.first.length > 0
					|| typeof nameVal.last === 'string' && nameVal.last.length > 0)
				|| (item.get(this.paths.full)
					|| item.get(this.paths.first)
					|| item.get(this.paths.last))
						&& (nameVal === undefined
						|| (typeof nameVal === 'object'
							&& nameVal.first === undefined
							&& nameVal.last === undefined))
			) ? true : false;
		}
		defer(callback, result);
	}

	/**
	 * Synchronous validity check. When `required`, the submitted data (or the
	 * existing `item` value) must contain a non-empty first, last, or full name.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @param item The existing document checked as a fallback.
	 * @returns `true` when the input is acceptable.
	 */
	override inputIsValid (this: NameFieldInstance, data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		if (!(this.path in data || this.paths.first in data || this.paths.last in data || this.paths.full in data) && item?.get(this.paths.full)) return true;
		if (!required) return true;
		if (isObject(data[this.path])) {
			const nameData = data[this.path] as NameValue;
			return (nameData.first || nameData.last) ? true : false;
		} else {
			return (data[this.paths.full] || data[this.paths.first] || data[this.paths.last]) ? true : false;
		}
	}

	/**
	 * Returns `true` if either the `first` or `last` sub-field has been modified
	 * on the document.
	 * @param item The Mongoose document to check.
	 */
	override isModified (this: NameFieldInstance, item: MongooseDocument): boolean {
		return item.isModified(this.paths.first) || item.isModified(this.paths.last);
	}

	/**
	 * Writes the submitted name value to the document. Accepts a full-name string
	 * (sets via the `full` virtual) or a `{ first, last }` object.
	 * @param item The Mongoose document to update.
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	override updateItem (this: NameFieldInstance, item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const paths = this.paths;
		const value = this.getInputFromData(data);
		if (typeof value === 'string' || value === null) {
			item.set(paths.full, value);
		} else if (typeof value === 'object') {
			const nameVal = value;
			if (typeof nameVal.first === 'string' || nameVal.first === null) {
				item.set(paths.first, nameVal.first);
			}
			if (typeof nameVal.last === 'string' || nameVal.last === null) {
				item.set(paths.last, nameVal.last);
			}
		}
		process.nextTick(callback);
	}
}
NameType.prototype._fixedSize = 'full';

export default NameType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Name field type (B1e)
// ---------------------------------------------------------------------------

/**
 * Options bag for the Name field type constructor.
 */
export interface KeystoneFieldOptionsForNameType extends FieldOptionsBase {
	/** Reserved for field registry use — binds this options bag to the Name type. */
	type?: unknown;
}

/**
 * Shape of a Name field instance (the object returned by `new name_(...)`).
 * Stores a person's name as `first` / `last` sub-fields with a virtual `full`.
 */
export interface KeystoneFieldForNameType {
	/** Fixed Admin UI column size ('full'). */
	_fixedSize: string;
	/** Sub-field paths for first, last, and virtual full. */
	paths: {
		first: string;
		last: string;
		full: string;
	};
	/** Field-specific options. */
	options: KeystoneFieldOptionsForNameType;
	/** The dot-separated field path on the schema. */
	path: string;
	/**
	 * Returns a Mongoose sort string for this field.
	 * @param options Sort options (pass `{ invert: true }` for descending order).
	 * @param options.invert When true, prefixes each path with `-` for descending sort (Mongoose convention).
	 */
	getSortString(options: { invert?: boolean }): string;
	/**
	 * Builds a Mongoose query condition searching across first and last sub-fields.
	 * @param filter Filter descriptor from the Admin UI.
	 */
	addFilterToQuery(filter: NameFilter): Record<string, unknown>;
	/**
	 * Returns the formatted full name from the document.
	 * @param item The document containing the name value.
	 * @param item.get Method to retrieve a value at a given path from the document.
	 */
	format(item: { get(path: string): unknown }): string;
	/**
	 * Validates the submitted name value (string, null, undefined, or `{first, last}` object).
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Validates that a non-empty name value is present.
	 * @param item The existing document being updated.
	 * @param item.get Method to retrieve a value at a given path from the document.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the required value is present.
	 */
	validateRequiredInput(item: { get(path: string): unknown }, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Synchronous validity check.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @param item The existing document checked as a fallback.
	 * @param item.get Method to retrieve a value at a given path from the document.
	 */
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: { get(path: string): unknown }): boolean;
	/**
	 * Returns `true` if either the first or last sub-field has been modified.
	 * @param item The Mongoose document to check.
	 * @param item.isModified Returns whether the field at the given path was modified.
	 */
	isModified(item: { isModified(path: string): boolean }): boolean;
	/**
	 * Writes the submitted name value to the document.
	 * @param item The Mongoose document to update.
	 * @param item.get Method to retrieve a value at a given path from the document.
	 * @param item.set Assigns a value at a dotted path (see implementation).
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	updateItem(item: { get(path: string): unknown; set(path: string, value: unknown): void }, data: Record<string, unknown>, callback: () => void): void;
}

/**
 * Constructor type for the Name field type.
 */
export type KeystoneTypeConstructorForNameType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForNameType) => KeystoneFieldForNameType;
