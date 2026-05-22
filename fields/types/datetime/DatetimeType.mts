import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);
import DateType from '../date/DateType.mjs';
import type { KSAdminUiFilterForDateAndDateTimeFields } from '../date/DateType.mjs';
import { FieldType } from '../Type.mjs';
import type { KeystoneList, KeystoneDocument, KeystoneField, KeystoneTypeConstructor, MongooseDocument, FieldOptionsBase } from '../Type.mjs';
import { defer } from '../../../lib/utils/async.mjs';

const parseFormats = ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m', 'YYYY-MM-DD h:mm:s a Z'];

function formatInputValue(value: unknown): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
	if (value instanceof Date) return value.toString();
	if (dayjs.isDayjs(value)) return value.format('YYYY-MM-DD H:m:s');
	return Object.prototype.toString.call(value);
}

/**
 * Try parsing a value against a format in strict mode.
 * dayjs strict mode rejects leading zeros for `h`/`H`/`m`/`s` tokens.
 * Moment accepted them, so we also try the padded variants (`hh`, `HH`, `mm`, `ss`).
 */
function tryStrictParse(value: string, fmt: string): Dayjs {
	let d = dayjs(value, fmt, true);
	if (d.isValid()) return d;
	const altFmt = fmt.replace(/\bh\b/g, 'hh').replace(/\bH\b/g, 'HH').replace(/\bm\b/g, 'mm').replace(/\bs\b/g, 'ss');
	if (altFmt !== fmt) {
		d = dayjs(value, altFmt, true);
		if (d.isValid()) return d;
	}
	return dayjs(value, fmt, true); // return the invalid result
}

function parseWithFormats(value: string, formats: string[]): Dayjs {
	for (const fmt of formats) {
		const d = tryStrictParse(value, fmt);
		if (d.isValid()) return d;
	}
	return dayjs(value); // fallback: ISO parsing
}

class DatetimeType extends FieldType<KeystoneFieldOptionsForDateTimeType, Date | string | null | undefined> {
	/** Human-readable type name used by the Admin UI. */
	static readonly properName = 'Datetime';
	/** Technical type name used by Keystone internals. */
	static readonly typeName = 'datetime';

	declare _nativeType: DateConstructor;
	declare _underscoreMethods: string[];
	declare _fixedSize: 'full';
	declare _properties: string[];

	/** dayjs format string(s) for parsing input values. */
	parseFormatString: string | string[];
	/** dayjs format string for display, or `false` when disabled. */
	formatString: string | false;
	/** Whether to interpret dates as UTC. */
	isUTC: boolean;
	/** Sub-path map for date/time/tzOffset input fields. */
	paths: {
		date: string;
		time: string;
		tzOffset: string;
	};

	constructor(list: KeystoneList, path: string, options: KeystoneFieldOptionsForDateTimeType) {
		super(list, path, options);
		this.parseFormatString = options.parseFormat ?? parseFormats;
		this.formatString = (options.format === false) ? false : (options.format ?? 'YYYY-MM-DD h:mm:ss a');
		this.isUTC = options.utc ?? false;
		if (this.formatString && typeof this.formatString !== 'string') {
			throw new Error('FieldType.DateTime: options.format must be a string.');
		}
		this.paths = {
			date: this.path + '_date',
			time: this.path + '_time',
			tzOffset: this.path + '_tzOffset',
		};
	}

	getInputFromData (data: Record<string, unknown>): string | null | undefined {
		const dateValue = this.getValueFromData(data, '_date');
		const timeValue = this.getValueFromData(data, '_time');
		const tzOffsetValue = this.getValueFromData(data, '_tzOffset');
		if (dateValue && timeValue) {
			let combined = formatInputValue(dateValue) + ' ' + formatInputValue(timeValue);
			if (typeof tzOffsetValue !== 'undefined') {
				combined += ' ' + formatInputValue(tzOffsetValue);
			}
			return combined;
		}
		const v = this.getValueFromData(data);
		if (v === null) return null;
		return v !== undefined ? formatInputValue(v) : undefined;
	}

	override validateRequiredInput (item: MongooseDocument, data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getInputFromData(data);
		let result = !!value;
		if (value === undefined && item.get(this.path)) {
			result = true;
		}
		defer(callback, result);
	}

	override validateInput (data: Record<string, unknown>, callback: (result: boolean) => void): void {
		const value = this.getInputFromData(data);
		let result = true;
		if (value) {
			const fmt = this.parseFormatString;
			if (Array.isArray(fmt)) {
				result = parseWithFormats(value, fmt).isValid();
			} else {
				result = tryStrictParse(value, fmt).isValid();
			}
		}
		defer(callback, result);
	}

	override inputIsValid (data: Record<string, unknown>, required?: boolean, item?: MongooseDocument): boolean {
		if (!(this.path in data && !(this.paths.date in data && this.paths.time in data)) && item?.get(this.path)) return true;
		const inputVal = this.getInputFromData(data);
		const newValue = inputVal ? parseWithFormats(inputVal, parseFormats) : dayjs(inputVal);
		if (required && !newValue.isValid()) {
			return false;
		} else if (this.getInputFromData(data) && !newValue.isValid()) {
			return false;
		} else {
			return true;
		}
	}

	override updateItem (item: MongooseDocument, data: Record<string, unknown>, callback: () => void): void {
		const value = this.getInputFromData(data);
		if (value !== undefined) {
			if (value !== '' && value !== null) {
				const fmt = this.parseFormatString;
				const newValue = Array.isArray(fmt)
					? parseWithFormats(value, fmt)
					: tryStrictParse(value, fmt);
				if (!item.get(this.path) || !newValue.isSame(item.get(this.path) as string | Date | Dayjs | undefined)) {
					item.set(this.path, newValue.toDate());
				}
			} else {
				item.set(this.path, null);
			}
		}
		process.nextTick(callback);
	}

	/**
	 * Formats the date value for display.
	 * Assigned from DateType.prototype at the bottom of this file.
	 */
	declare format: (item: MongooseDocument, format?: string) => string;
	/**
	 * Returns a dayjs object for the stored date value.
	 * Assigned from DateType.prototype at the bottom of this file.
	 */
	declare moment: (item: MongooseDocument) => Dayjs;
	/**
	 * Parses a raw value into a dayjs object.
	 * Assigned from DateType.prototype at the bottom of this file.
	 */
	declare parse: (value: string | number | Date | Dayjs, format?: string, strict?: boolean) => Dayjs;
	/**
	 * Converts a filter descriptor into a Mongoose query condition.
	 * Assigned from DateType.prototype at the bottom of this file.
	 */
	declare addFilterToQuery: (filter: KSAdminUiFilterForDateAndDateTimeFields) => Record<string, unknown>;
}
DatetimeType.prototype._nativeType = Date;
DatetimeType.prototype._underscoreMethods = ['format', 'moment', 'parse'];
DatetimeType.prototype._fixedSize = 'full';
DatetimeType.prototype._properties = ['formatString', 'isUTC'];
// eslint-disable-next-line @typescript-eslint/unbound-method
DatetimeType.prototype.format = DateType.prototype.format;
// eslint-disable-next-line @typescript-eslint/unbound-method
DatetimeType.prototype.moment = DateType.prototype.moment;
// eslint-disable-next-line @typescript-eslint/unbound-method
DatetimeType.prototype.parse = DateType.prototype.parse;
// eslint-disable-next-line @typescript-eslint/unbound-method
DatetimeType.prototype.addFilterToQuery = DateType.prototype.addFilterToQuery;

export default DatetimeType;

// ---------------------------------------------------------------------------
// Public type exports (B1d)
// ---------------------------------------------------------------------------

/** Re-export shared Date/DateTime filter type (defined in DateType). */
export type { KSAdminUiFilterForDateAndDateTimeFields } from '../date/DateType.mjs';

/** Options accepted by the DateTime field constructor. */
export interface KeystoneFieldOptionsForDateTimeType extends FieldOptionsBase {
	/** Reserved for field registry use — binds this options bag to the DateTime type. */
	type?: unknown;
	/** dayjs format string for output, or false to disable. Default: 'YYYY-MM-DD h:mm:ss a' */
	format?: string | false;
	/** dayjs format string(s) for parsing input. */
	parseFormat?: string | string[];
	/** Treat date/time as UTC. Default: false */
	utc?: boolean;
}

/** Shape of a DateTime field instance. */
export interface KeystoneFieldForDateTimeType extends KeystoneField {
	_nativeType: DateConstructor;
	_underscoreMethods: string[];
	_fixedSize: 'full';
	_properties: string[];
	typeDescription: string;
	parseFormatString: string | string[];
	formatString?: string | false;
	isUTC: boolean;
	options: KeystoneFieldOptionsForDateTimeType;
	paths: {
		date: string;
		time: string;
		tzOffset: string;
	};
	format(item: KeystoneDocument, format?: string): string;
	moment(item: KeystoneDocument): Dayjs | null;
	parse(value: unknown, format?: string | string[], strict?: boolean): Dayjs;
	addFilterToQuery(filter: KSAdminUiFilterForDateAndDateTimeFields): Record<string, unknown>;
	getInputFromData(data: Record<string, unknown>): string | undefined;
	validateRequiredInput(item: KeystoneDocument, data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	validateInput(data: Record<string, unknown>, callback: (valid: boolean) => void): void;
	inputIsValid(data: Record<string, unknown>, required?: boolean, item?: KeystoneDocument): boolean;
	updateItem(item: KeystoneDocument, data: Record<string, unknown>, callback: (err?: Error) => void): void;
}

/** Constructor type for DateTime fields. */
export interface KeystoneTypeConstructorForDateTimeType extends KeystoneTypeConstructor {
	new (
		list: KeystoneList,
		path: string,
		options: KeystoneFieldOptionsForDateTimeType
	): KeystoneFieldForDateTimeType;
	prototype: KeystoneFieldForDateTimeType;
	properName: 'Datetime';
}
