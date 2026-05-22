import { FieldType } from '../Type.mjs';
import type { KeystoneList, KeystoneDocument, KeystoneField, KeystoneTypeConstructor, MongooseDocument, FieldOptionsBase } from '../Type.mjs';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
import { defer } from '../../../lib/utils/async.mjs';
import TextType from '../text/TextType.mjs';

/** Input types accepted by DateType field operations. */
type DateFieldInput = Date | string | undefined;
/** Types that can be passed to dayjs() for date parsing. */
type DateParseInput = string | Date | Dayjs;
/** Types accepted by the parse() method. */
type DateParseValue = string | number | Date | Dayjs;

function formatUnknownFieldValue(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
	if (value instanceof Date) return value.toString();
	return Object.prototype.toString.call(value);
}

class DateType extends FieldType<KeystoneFieldOptionsForDateType, DateFieldInput> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Date';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'date';

	declare _nativeType: DateConstructor;
	declare _underscoreMethods: string[];
	declare _fixedSize: 'medium';
	declare _properties: string[];

	/** dayjs format string for parsing input values. */
	parseFormatString: string;
	/** dayjs format string for display, or `false` when disabled. */
	formatString: string | false;
	/** Optional year range for the date picker (e.g. `[2000, 2030]` or `10`). */
	yearRange: number | number[] | undefined;
	/** Whether to interpret dates as UTC. */
	isUTC: boolean;
	/** Whether to show the "Today" button in the date picker. */
	todayButton: boolean;
	/** UTC offset in minutes for correcting potentially corrupted UTC dates. */
	timezoneUtcOffsetMinutes: number;

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForDateType) {
		super(list, path, options);
		this.parseFormatString = options.inputFormat ?? 'YYYY-MM-DD';
		this.formatString = (options.format === false) ? false : (options.format ?? 'Do MMM YYYY');
		this.yearRange = options.yearRange;
		this.isUTC = options.utc ?? false;
		this.todayButton = (options.todayButton !== undefined) ? options.todayButton : true;
		this.timezoneUtcOffsetMinutes = options.timezoneUtcOffsetMinutes ?? dayjs().utcOffset();
		if (this.formatString && typeof this.formatString !== 'string') {
			throw new Error('FieldType.Date: options.format must be a string.');
		}
	}

	addFilterToQuery (filter: KSAdminUiFilterForDateAndDateTimeFields): Record<string, unknown> {
		const query: Record<string, unknown> = {};
		if (filter.mode === 'between') {
			if (filter.after && filter.before) {
				const after = dayjs(filter.after as DateParseInput);
				const before = dayjs(filter.before as DateParseInput);
				if (after.isValid() && before.isValid()) {
					query[this.path] = {
						$gte: after.startOf('day').toDate(),
						$lte: before.endOf('day').toDate(),
					};
				}
			}
		} else if (filter.value) {
			const d = dayjs(filter.value as DateParseInput);
			const start = d.startOf('day').toDate();
			const end = d.endOf('day').toDate();
			if (d.isValid()) {
				if (filter.mode === 'after') {
					query[this.path] = { $gt: end };
				} else if (filter.mode === 'before') {
					query[this.path] = { $lt: start };
				} else {
					query[this.path] = { $gte: start, $lte: end };
				}
			}
		}
		if (filter.inverted) {
			query[this.path] = { $not: query[this.path] };
		}
		return query;
	}

	override format (item: MongooseDocument, format?: string): string {
		if (format || this.formatString) {
			return item.get(this.path) ? this.moment(item).format(format || this.formatString || undefined) : '';
		} else {
			const raw = item.get(this.path);
			return formatUnknownFieldValue(raw);
		}
	}

	moment (item: MongooseDocument): Dayjs {
		const m = dayjs(item.get(this.path) as DateParseInput);
		if (this.isUTC) return m.utc();
		return m;
	}

	parse (value: DateParseValue, format?: string, strict?: boolean): Dayjs {
		if (typeof value === 'number' || value instanceof Date) {
			return this.isUTC ? dayjs.utc(value) : dayjs(value);
		} else if (dayjs.isDayjs(value)) {
			// Already a dayjs object — extract the JS Date so we don't confuse customParseFormat
			return this.isUTC ? dayjs.utc(value.toDate()) : dayjs(value.toDate());
		} else {
			const fmt = format ?? this.parseFormatString;
			return this.isUTC ? dayjs.utc(value, fmt, strict) : dayjs(value, fmt, strict);
		}
	}

	override validateInput (data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getValueFromData(data);
		let result = true;
		if (value) {
			result = this.parse(value as string | number | Date | Dayjs).isValid();
		}
		defer(callback, result);
	}

	override getData (item: MongooseDocument): Date {
		const value = item.get(this.path);
		const dayjsDate = this.isUTC ? dayjs.utc(value as DateParseInput) : dayjs(value as DateParseInput);
		if (this.isUTC) {
			if (dayjsDate.format('HH:mm:ss:SSS') !== '00:00:00:000') {
				const adjustedDate = dayjs.utc(dayjsDate.toDate());
				const adjusted = adjustedDate.add(this.timezoneUtcOffsetMinutes, 'minute').add(1, 'hour');
				const timeAsNumber = Number(adjusted.format('HHmmssSSS'));
				if (timeAsNumber >= 0 && timeAsNumber <= 20000000) {
					return adjusted.startOf('day').toDate();
				} else {
					return dayjsDate.toDate();
				}
			}
		}
		return dayjsDate.toDate();
	}

	override inputIsValid (data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		if (!(this.path in data) && item?.get(this.path)) return true;
		const newValue = dayjs(data[this.path] as string | undefined, this.parseFormatString);
		if (required && (!newValue.isValid())) {
			return false;
		} else if (data[this.path] && !newValue.isValid()) {
			return false;
		} else {
			return true;
		}
	}

	override updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const value = this.getValueFromData(data);
		if (value !== null && value !== '') {
			const newValue = this.parse(value as string | number | Date | Dayjs);
			if (newValue.isValid() && (!item.get(this.path) || !newValue.isSame(item.get(this.path) as DateParseInput | undefined))) {
				item.set(this.path, newValue.toDate());
			}
		} else {
			item.set(this.path, null);
		}
		process.nextTick(callback);
	}

	/**
	 * Validates that a non-empty value is present.
	 * Assigned from TextType.prototype at the bottom of this file.
	 */
	declare validateRequiredInput: (item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void) => void;
}
DateType.prototype._nativeType = Date;
DateType.prototype._underscoreMethods = ['format', 'moment', 'parse'];
DateType.prototype._fixedSize = 'medium';
DateType.prototype._properties = ['formatString', 'yearRange', 'isUTC', 'inputFormat', 'todayButton'];
// eslint-disable-next-line @typescript-eslint/unbound-method
DateType.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

export default DateType;

// ---------------------------------------------------------------------------
// Public type exports (B1d)
// ---------------------------------------------------------------------------

/**
 * Date-like inputs accepted by Date / DateTime admin filters (ISO strings, Date, or Dayjs).
 * @see fields/types/date/DateType.mjs — `addFilterToQuery` reads `value`, `after`, and `before`
 */
export type KSAdminUiDateFilterValue = string | Date | Dayjs;

/**
 * Filter options for Date and DateTime field queries.
 * Shared by DateType, DateTimeType, and re-exported from DateTimeType.
 */
export interface KSAdminUiFilterForDateAndDateTimeFields {
	/**
	 * Filter mode:
	 * - 'between': Matches dates between 'after' and 'before'.
	 * - 'after': Matches dates after the value.
	 * - 'before': Matches dates before the value.
	 * Default: exact match for the day.
	 */
	mode?: string;
	/** The date value to filter by. */
	value?: KSAdminUiDateFilterValue;
	/** Start date for 'between' mode. */
	after?: KSAdminUiDateFilterValue;
	/** End date for 'between' mode. */
	before?: KSAdminUiDateFilterValue;
	/** Invert the filter logic. Default: false */
	inverted?: boolean;
}

/** Options accepted by the Date field constructor. */
export interface KeystoneFieldOptionsForDateType extends FieldOptionsBase {
	/** Reserved for field registry use — binds this options bag to the Date type. */
	type?: unknown;
	/** dayjs format string for output, or false to disable. Default: 'Do MMM YYYY' */
	format?: string | false;
	/** dayjs format string for parsing input. Default: 'YYYY-MM-DD' */
	inputFormat?: string;
	/** Year range for date picker. Default: 10 (+/- 10 years) */
	yearRange?: number | number[];
	/** Treat date as UTC. Default: false */
	utc?: boolean;
	/** Show 'Today' button in date picker. Default: true */
	todayButton?: boolean;
	/** UTC offset (minutes) for correcting potentially corrupted UTC dates. */
	timezoneUtcOffsetMinutes?: number;
}

/** Shape of a Date field instance. */
export interface KeystoneFieldForDateType extends KeystoneField {
	_nativeType: DateConstructor;
	_underscoreMethods: string[];
	_fixedSize: 'medium';
	_properties: string[];
	parseFormatString: string;
	formatString?: string | false;
	yearRange?: number | number[];
	isUTC: boolean;
	todayButton: boolean;
	timezoneUtcOffsetMinutes: number;
	options: KeystoneFieldOptionsForDateType;
	validateRequiredInput(item: KeystoneDocument, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	addFilterToQuery(filter: KSAdminUiFilterForDateAndDateTimeFields): Record<string, unknown>;
	format(item: KeystoneDocument, format?: string): string;
	moment(item: KeystoneDocument): Dayjs | null;
	parse(value: unknown, format?: string | string[], strict?: boolean): Dayjs;
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	getData(item: KeystoneDocument): Date | null;
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: KeystoneDocument): boolean;
	updateItem(item: KeystoneDocument, data: Record<string, unknown>, callback: (err?: Error) => void): void;
}

/** Constructor type for Date fields. */
export interface KeystoneTypeConstructorForDateType extends KeystoneTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneFieldOptionsForDateType
	): KeystoneFieldForDateType;
	prototype: KeystoneFieldForDateType;
	properName: 'Date';
}
