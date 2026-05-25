import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import { defer } from '../../../lib/utils/async.mjs';
import { number } from '../../../lib/utils/number.mjs';
import { formatNumber } from '../../../lib/utils/numberFormat.mjs';

function formatUnknownFieldValue(value: unknown): string {
	if (value === null || value === undefined || value === false) return '';
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
	if (value instanceof Date) return value.toString();
	return Object.prototype.toString.call(value);
}

class NumberType extends FieldType<KeystoneFieldOptionsForNumberType, number> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Number';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'number';

	/** The numeral.js format string in use, or `false` when formatting is disabled. */
	formatString: string | false;

	declare _nativeType: NumberConstructor;
	declare _fixedSize: 'small';
	declare _underscoreMethods: string[];

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForNumberType) {
		super(list, path, options);
		this.formatString = (options.format === false) ? false : (options.format ?? '0,0[.][000000000000]');
		if (this.formatString && typeof this.formatString !== 'string') {
			throw new Error('FieldType.Number: options.format must be a string.');
		}
	}

	override validateInput (data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = value === undefined || typeof value === 'number' || value === null;
		if (typeof value === 'string') {
			if (value === '') {
				result = true;
			} else {
				const n = number(value);
				result = !isNaN(n);
			}
		}
		defer(callback, result);
	}

	override validateRequiredInput (item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = !!(value || typeof value === 'number');
		if (value === undefined && typeof item.get(this.path) === 'number') {
			result = true;
		}
		defer(callback, result);
	}

	addFilterToQuery (filter: KSAdminUiFilterForNumberField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		if (filter.mode === 'equals' && !filter.value) {
			query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
			return query;
		}
		if (filter.mode === 'between') {
			const rangeVal = filter.value as { min?: number | string; max?: number | string } | undefined;
			const min = number(rangeVal?.min ?? '');
			const max = number(rangeVal?.max ?? '');
			if (!isNaN(min) && !isNaN(max)) {
				if (filter.inverted) {
					const gte: Record<string, unknown> = {}; gte[this.path] = { $gt: max };
					const lte: Record<string, unknown> = {}; lte[this.path] = { $lt: min };
					query.$or = [gte, lte];
				} else {
					query[this.path] = { $gte: min, $lte: max };
				}
			}
			return query;
		}
		const numVal = filter.value;
		const value = number(typeof numVal === 'object' ? '' : (numVal ?? ''));
		if (!isNaN(value)) {
			if (filter.mode === 'gt') {
				query[this.path] = filter.inverted ? { $lt: value } : { $gt: value };
			} else if (filter.mode === 'lt') {
				query[this.path] = filter.inverted ? { $gt: value } : { $lt: value };
			} else {
				query[this.path] = filter.inverted ? { $ne: value } : value;
			}
		}
		return query;
	}

	override format (item: MongooseDocument, format?: string): string {
		const value = item.get(this.path);
		if (format || this.formatString) {
			return (typeof value === 'number') ? formatNumber(value, format ?? this.formatString) : '';
		} else {
			return formatUnknownFieldValue(value);
		}
	}

	override inputIsValid (data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		const value = this.getValueFromData(data);
		if (value === undefined && item && (item.get(this.path) || item.get(this.path) === 0)) {
			return true;
		}
		if (value !== undefined && value !== '') {
			const newValue = number(typeof value === 'string' || typeof value === 'number' ? value : '');
			return (!isNaN(newValue));
		} else {
			return (required) ? false : true;
		}
	}

	override updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const value = this.getValueFromData(data);
		if (value === undefined) {
			return process.nextTick(callback);
		}
		const newValue = number(typeof value === 'string' || typeof value === 'number' ? value : '');
		if (!isNaN(newValue)) {
			if (newValue !== item.get(this.path)) {
				item.set(this.path, newValue);
			}
		} else if (typeof item.get(this.path) === 'number') {
			item.set(this.path, null);
		}
		process.nextTick(callback);
	}
}
NumberType.prototype._nativeType = Number;
NumberType.prototype._fixedSize = 'small';
NumberType.prototype._underscoreMethods = ['format'];

export default NumberType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the Number field type (B1c)
// ---------------------------------------------------------------------------

/**
 * Admin-UI filter descriptor accepted by `NumberType.prototype.addFilterToQuery`.
 * Supports equals, range, greater-than, and less-than modes with optional inversion.
 */
export interface KSAdminUiFilterForNumberField {
	/**
	 * Filter mode.
	 * - 'equals': Matches exact value or empty/null if value is empty.
	 * - 'between': Matches values within the range in `value.min` / `value.max`.
	 * - 'gt': Matches values greater than `value`.
	 * - 'lt': Matches values less than `value`.
	 * Default: 'equals'.
	 */
	mode?: 'equals' | 'between' | 'gt' | 'lt';
	/**
	 * Value(s) to filter by.
	 * - For 'equals', 'gt', 'lt': a number or string convertible to a number.
	 * - For 'between': an object `{ min?, max? }`.
	 */
	value?: number | string | { min?: number | string; max?: number | string };
	/** Invert the filter logic. Default: false. */
	inverted?: boolean;
}

/**
 * Options bag for the Number field type constructor.
 */
export interface KeystoneFieldOptionsForNumberType extends FieldOptionsBase {
	/**
	 * A numeral.js format string (e.g. `'0,0.00'`) or `false` to disable
	 * formatting. Default: `'0,0[.][000000000000]'`.
	 */
	format?: string | false;
	/** Reserved for field registry use — binds this options bag to the Number type. */
	type?: unknown;
}

/**
 * Shape of a Number field instance (the object returned by `new number_(...)`).
 * Methods are inherited from the FieldType base class.
 */
export interface KeystoneFieldForNumberType {
	/** The native JavaScript type constructor (Number). */
	_nativeType: NumberConstructor;
	/** Fixed size for the field in the Admin UI. */
	_fixedSize: 'small';
	/** Underscore methods added to documents (includes 'format'). */
	_underscoreMethods: string[];
	/** Field-specific options. */
	options: KeystoneFieldOptionsForNumberType;
	/** The dot-separated field path on the schema. */
	path: string;
	/**
	 * The numeral.js format string in use, or `false` when formatting is
	 * disabled. Set from `options.format` during construction.
	 */
	formatString: string | false;
	/**
	 * Validates that the input is a valid number or can be converted to one.
	 * Empty strings are considered valid.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when valid.
	 */
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Validates that a numeric value is present.
	 * @param item The existing document being updated.
	 * @param data The submitted data object.
	 * @param callback Called with `true` when the required value is present.
	 */
	validateRequiredInput(item: Record<string, unknown>, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	/**
	 * Adds number-specific filtering logic to a Mongoose query.
	 * @param filter Filter descriptor from the Admin UI query.
	 * @returns Mongoose condition object keyed by the field path.
	 */
	addFilterToQuery(filter: KSAdminUiFilterForNumberField): Record<string, unknown>;
	/**
	 * Formats the field's numeric value using numeral.js.
	 * Exposed as the `_.format` underscore method.
	 * @param item The document containing the value.
	 * @param item.get Method to retrieve a value at a given path from the document.
	 * @param format Optional numeral.js format string (overrides field option).
	 * @returns The formatted string, or an empty string for non-numeric values (except 0).
	 */
	format(item: { get(path: string): unknown }, format?: string): string;
	/**
	 * (Deprecated) Synchronous validity check. Prefer `validateInput`.
	 * @param data The submitted data object.
	 * @param required Whether the field is required.
	 * @param item Optional existing document for context.
	 * @returns `true` when the input is acceptable.
	 */
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: Record<string, unknown>): boolean;
	/**
	 * Sets the field to a valid number (or `null`) on the document.
	 * @param item The Mongoose document to update.
	 * @param item.get Retrieves the current value at a dotted path (see implementation).
	 * @param item.set Assigns a value at a dotted path (see implementation).
	 * @param data The submitted data object.
	 * @param callback Called when the update is complete.
	 */
	updateItem(item: { get(path: string): unknown; set(path: string, value: unknown): void }, data: Record<string, unknown>, callback: () => void): void;
}

/**
 * Constructor type for the Number field type.
 */
export type KeystoneTypeConstructorForNumberType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForNumberType) => KeystoneFieldForNumberType;
