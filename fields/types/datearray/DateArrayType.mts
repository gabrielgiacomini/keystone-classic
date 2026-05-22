import { FieldType } from '../Type.mjs';
import type { KeystoneList, FieldOptionsBase, MongooseDocument } from '../Type.mjs';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
import { defer } from '../../../lib/utils/async.mjs';
import addPresenceToQuery from '../../utils/addPresenceToQuery.mjs';
import DateType from '../date/DateType.mjs';
import type { KSAdminUiFilterForDateAndDateTimeFields } from '../date/DateType.mjs';

class DateArrayType extends FieldType<KeystoneFieldOptionsForDateArrayType, Date[]> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'DateArray';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'datearray';

	declare _nativeType: [DateConstructor];
	declare _defaultSize: 'medium';
	declare _underscoreMethods: string[];
	declare _properties: string[];

	/** dayjs format string for parsing input. */
	parseFormatString: string;
	/** dayjs format string for display, or `false` to disable. */
	formatString: string | false;
	/** Separator between formatted dates. */
	separator: string;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForDateArrayType) {
		super(list, path, options);
		this.parseFormatString = options.parseFormat ?? 'YYYY-MM-DD';
		this.formatString = (options.format === false) ? false : (options.format ?? 'Do MMM YYYY');
		if (this.formatString && typeof this.formatString !== 'string') {
			throw new Error('FieldType.DateArray: options.format must be a string.');
		}
		this.separator = options.separator ?? ' | ';
	}

	override format(item: MongooseDocument, format?: string, separator?: string): string {
		let value = item.get(this.path) as (Date | string)[];
		if (format || this.formatString) {
			const fmt = format ?? this.formatString;
			value = value.map((d) => dayjs(d).format(fmt || undefined) as unknown as string);
		}
		return (value as string[]).join(separator ?? this.separator);
	}

	override validateInput(data: Record<string, unknown>, callback: (result: boolean) => void): void {
		let value = this.getValueFromData(data);
		let result = true;
		if (value !== undefined && value !== null && value !== '') {
			if (!Array.isArray(value)) value = [value];
			for (const val of value as unknown[]) {
				const currentValue: Dayjs = typeof val === 'number'
					? dayjs(val)
					: dayjs(val as string | Date, this.parseFormatString, true);
				if (!currentValue.isValid()) { result = false; break; }
			}
		}
		defer(callback, result);
	}

	override validateRequiredInput(item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = false;
		if (value === undefined) {
			if ((item.get(this.path) as (Date | string)[] | undefined)?.length) result = true;
		}
		if (typeof value === 'string' || typeof value === 'number') {
			if (dayjs(value).isValid()) result = true;
		} else if (Array.isArray(value)) {
			let invalidContent = false;
			for (const val of value as unknown[]) {
				const currentValue: Dayjs = typeof val === 'number'
					? dayjs(val)
					: dayjs(val as string | Date, this.parseFormatString, true);
				if (!currentValue.isValid()) { invalidContent = true; break; }
			}
			if (!invalidContent) result = true;
		}
		defer(callback, result);
	}

	addFilterToQuery(filter: KSAdminUiFilterForDateArrayField): Record<string, unknown> {
		const dateTypeFilter: KSAdminUiFilterForDateAndDateTimeFields = filter;
		const dateTypeAddFilterToQuery = DateType.prototype.addFilterToQuery.bind(this as unknown as InstanceType<typeof DateType>);
		const query = dateTypeAddFilterToQuery(dateTypeFilter);
		if (query[this.path]) {
			query[this.path] = addPresenceToQuery(filter.presence ?? 'some', query[this.path] as Record<string, unknown>);
		}
		return query;
	}

	override inputIsValid(data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		let value = this.getValueFromData(data);
		const parseFormatString = this.parseFormatString;
		if (typeof value === 'string') {
			if (!dayjs(value, parseFormatString, true).isValid()) return false;
			value = [value];
		}
		if (required) {
			if (value === undefined && (item?.get(this.path) as (Date | string)[] | undefined)?.length) return true;
			if (value === undefined || !Array.isArray(value)) return false;
			if (Array.isArray(value) && !(value as unknown[]).length) return false;
		}
		if (Array.isArray(value)) {
			const filtered = (value as unknown[]).filter((date: unknown) => (date as string).trim() !== '');
			if (required && !filtered.length) return false;
			if (filtered.some((dateValue: unknown) => !dayjs(dateValue as string, parseFormatString, true).isValid())) return false;
		}
		return (value === undefined || Array.isArray(value));
	}

	override updateItem(item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		let value = this.getValueFromData(data);
		if (Array.isArray(value)) {
			value = (value as unknown[]).filter((date: unknown) => dayjs(date as string | Date).isValid());
		}
		value ??= [];
		if (typeof value === 'string') {
			if (dayjs(value).isValid()) value = [value];
		}
		if (Array.isArray(value)) item.set(this.path, value);
		process.nextTick(callback);
	}
}
DateArrayType.prototype._nativeType = [Date];
DateArrayType.prototype._defaultSize = 'medium';
DateArrayType.prototype._underscoreMethods = ['format'];
DateArrayType.prototype._properties = ['formatString'];

export default DateArrayType;

// ---------------------------------------------------------------------------
// Public-facing type exports for the DateArray field type
// ---------------------------------------------------------------------------

/**
 * Date-like inputs for DateArray admin filters (ISO strings, `Date`, or Dayjs).
 * @see fields/types/date/DateType.mts — `KSAdminUiDateFilterValue` (equivalent shape)
 */
export type KSAdminUiDateArrayFilterValue = string | Date | Dayjs;

/** Filter options for DateArray field queries. */
export interface KSAdminUiFilterForDateArrayField {
	/**
	 * Filter mode (string labels from the Admin UI):
	 * - 'on': Exact match for the selected calendar day (default in the legacy filter UI).
	 * - 'between': Matches dates between `after` and `before`.
	 * - 'after': Matches dates after `value`'s day window.
	 * - 'before': Matches dates before `value`'s day window.
	 */
	mode?: string;
	/**
	 * Presence mode:
	 * - 'none': No dates in the array match the filter.
	 * - 'some': At least one date in the array matches.
	 * Default: 'some'
	 */
	presence?: 'none' | 'some';
	/** The date value to filter by. */
	value?: KSAdminUiDateArrayFilterValue;
	/** Start date for 'between' mode. */
	after?: KSAdminUiDateArrayFilterValue;
	/** End date for 'between' mode. */
	before?: KSAdminUiDateArrayFilterValue;
}

/** Options accepted by the DateArray field constructor. */
export interface KeystoneFieldOptionsForDateArrayType extends FieldOptionsBase {
	/** dayjs format string for output, or false to disable. Default: 'Do MMM YYYY' */
	format?: string | false;
	/** dayjs format string for parsing input. Default: 'YYYY-MM-DD' */
	parseFormat?: string;
	/** Separator between formatted dates. Default: ' | ' */
	separator?: string;
	/** Reserved for field registry use — binds this options bag to the DateArray type. */
	type?: unknown;
}

/**
 * Shape of a DateArray field instance.
 * Exported for backward compatibility with consumers that import this name.
 */
export type KeystoneFieldForDateArrayType = DateArrayType;

/**
 * Constructor type for the DateArray field type.
 */
export type KeystoneTypeConstructorForDateArrayType = new(list: KeystoneList, path: string, options: KeystoneFieldOptionsForDateArrayType) => DateArrayType;
