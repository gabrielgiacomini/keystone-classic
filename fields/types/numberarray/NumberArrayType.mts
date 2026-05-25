import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import addPresenceToQuery from '../../utils/addPresenceToQuery.mjs';
import { defer } from '../../../lib/utils/async.mjs';
import { number } from '../../../lib/utils/number.mjs';
import { formatNumber } from '../../../lib/utils/numberFormat.mjs';

class NumberArrayType extends FieldType<KeystoneFieldOptionsForNumberArrayType, number[]> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'NumberArray';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'numberarray';

	declare _nativeType: [NumberConstructor];
	declare _underscoreMethods: string[];
	declare _defaultSize: 'small';

	/** Numeral.js format string, or `false` to skip formatting. */
	_formatString: string | false;
	/** Separator string used when joining array values for display. */
	separator: string;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForNumberArrayType) {
		super(list, path, options);
		this._formatString = (options.format === false) ? false : (options.format ?? '0,0[.][000000000000]');
		if (this._formatString && typeof this._formatString !== 'string') {
			throw new Error('FieldType.NumberArray: options.format must be a string.');
		}
		this.separator = options.separator ?? ' | ';
	}

	override format(item: MongooseDocument, format?: string, separator?: string): string {
		let value = item.get(this.path) as Array<number | string>;
		if (format || this._formatString) {
			const fmt = format ?? this._formatString;
			value = value.map((n) => typeof n === 'number' ? formatNumber(n, fmt) : n);
		}
		return value.join(separator ?? this.separator);
	}

	override validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void {
		let value = this.getValueFromData(data);
		let result = true;
		if (value !== undefined && value !== '' && value !== null) {
			if (!Array.isArray(value)) value = [value];
			for (const rawVal of value as unknown[]) {
				const parsed: number = typeof rawVal === 'string' || typeof rawVal === 'number'
					? number(rawVal)
					: NaN;
				if (Number.isNaN(parsed)) { result = false; break; }
			}
		}
		defer(callback, result);
	}

	override validateRequiredInput(item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = false;
		if (value === undefined) {
			if ((item.get(this.path) as number[] | undefined)?.length) result = true;
		}
		if (typeof value === 'string' && value !== '') {
			result = true;
		} else if (Array.isArray(value)) {
			let invalidContent = false;
			for (const rawVal of value as unknown[]) {
				const parsed: number = typeof rawVal === 'string' || typeof rawVal === 'number'
					? number(rawVal)
					: NaN;
				if (Number.isNaN(parsed)) { invalidContent = true; break; }
			}
			if (!invalidContent) result = true;
		}
		defer(callback, result);
	}

	addFilterToQuery(filter: KSAdminUiFilterForNumberArrayField): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		const presence = filter.presence ?? 'some';
		if (filter.value === undefined || filter.value === null || filter.value === '') {
			query[this.path] = presence === 'some' ? { $size: 0 } : { $not: { $size: 0 } };
			return query;
		}
		if (filter.mode === 'between') {
			const rangeVal = filter.value as { min?: unknown; max?: unknown };
			const rawMin = rangeVal.min;
			const rawMax = rangeVal.max;
			const min = (typeof rawMin === 'string' || typeof rawMin === 'number') ? number(rawMin) : NaN;
			const max = (typeof rawMax === 'string' || typeof rawMax === 'number') ? number(rawMax) : NaN;
			if (!isNaN(min) && !isNaN(max)) {
				query[this.path] = addPresenceToQuery(presence, { $gte: min, $lte: max });
			}
			return query;
		}
		const rawVal = filter.value;
		const value = (typeof rawVal === 'string' || typeof rawVal === 'number') ? number(rawVal) : NaN;
		if (!isNaN(value)) {
			if (filter.mode === 'gt') {
				query[this.path] = addPresenceToQuery(presence, { $gt: value });
			} else if (filter.mode === 'lt') {
				query[this.path] = addPresenceToQuery(presence, { $lt: value });
			} else {
				query[this.path] = addPresenceToQuery(presence, { $eq: value });
			}
		}
		return query;
	}

	override inputIsValid(data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		const value = this.getValueFromData(data);
		if (required) {
			if (value === undefined && (item?.get(this.path) as number[] | undefined)?.length) return true;
			if (value === undefined || !Array.isArray(value) || (typeof value !== 'string') && (typeof value !== 'number')) return false;
			if ((value as unknown[]).length === 0) return false;
		}
		if (typeof value === 'string') {
			if (!isValidNumber(value)) return false;
		}
		if (Array.isArray(value)) {
			for (const num of value as unknown[]) {
				if (!isValidNumber(num)) return false;
			}
		}
		return (value === undefined || Array.isArray(value) || (typeof value === 'string') || (typeof value === 'number'));
	}

	override updateItem(item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		let value = this.getValueFromData(data);
		if (value === undefined || value === null || value === '') value = [];
		if (!Array.isArray(value)) value = [value];
		const normalized = (value as unknown[]).map(function (num: unknown) {
			if (typeof num === 'number') return num;
			if (typeof num === 'string') return number(num);
			return NaN;
		}).filter(function (num: unknown) {
			return !Number.isNaN(num as number);
		}) as number[];
		item.set(this.path, normalized);
		process.nextTick(callback);
	}
}
NumberArrayType.prototype._nativeType = [Number];
NumberArrayType.prototype._underscoreMethods = ['format'];
NumberArrayType.prototype._defaultSize = 'small';

function isValidNumber(value: unknown): boolean {
	if (typeof value !== 'string' && typeof value !== 'number') return false;
	return !Number.isNaN(number(value));
}

export default NumberArrayType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the NumberArray field type
// ---------------------------------------------------------------------------

/**
 * Admin-UI filter descriptor accepted by `NumberArrayType.prototype.addFilterToQuery`.
 */
export interface KSAdminUiFilterForNumberArrayField {
	/** Filter mode: 'gt', 'lt', 'between', or exact match (default). */
	mode?: string;
	/** The filter value (scalar or `{ min, max }` for 'between' mode). */
	value?: unknown;
	/** Presence mode: 'some' or 'none'. Default: 'some'. */
	presence?: string;
}

/**
 * Options bag for the NumberArray field type constructor.
 */
export interface KeystoneFieldOptionsForNumberArrayType extends FieldOptionsBase {
	/**
	 * Numeral.js format string used when displaying values.
	 * Pass `false` to skip formatting entirely.
	 * Default: `'0,0[.][000000000000]'`.
	 */
	format?: string | false;
	/** Separator string used when joining array values for display. Default: ' | '. */
	separator?: string;
	/** Reserved for field registry use — binds this options bag to the NumberArray type. */
	type?: unknown;
}

/**
 * Shape of a NumberArray field instance.
 * Exported for backward compatibility with consumers that import this name.
 */
export type KeystoneFieldForNumberArrayType = NumberArrayType;

/**
 * Constructor type for the NumberArray field type.
 */
export type KeystoneTypeConstructorForNumberArrayType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForNumberArrayType) => NumberArrayType;
