import * as moment from "moment";

/**
 * Filter options for text-based fields (Text, Textarea, HTML, etc.).
 * @see /fields/types/text/TextType.js - Text field filtering implementation
 */
export interface KSAdminUiFilterForTextField {
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
 * Filter options for Number fields.
 * @see /fields/types/number/NumberType.js - Number field filtering implementation
 */
export interface KSAdminUiFilterForNumberField {
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
 * Filter options for Boolean fields.
 * @see /fields/types/boolean/BooleanType.js - Boolean field filtering implementation
 */
export interface KSAdminUiFilterForBooleanField {
	/**
	 * If truthy or 'true', filters for `true` values.
	 * Otherwise filters for `false` or `null`/`undefined` values.
	 */
	value?: boolean | string;
}

/**
 * Filter options for Select fields.
 * @see /fields/types/select/SelectType.js - Select field filtering implementation
 */
export interface KSAdminUiFilterForSelectField {
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
 * Filter options for Date and DateTime fields.
 * @see /fields/types/date/DateType.js - Date field filtering implementation
 * @see /fields/types/datetime/DatetimeType.js - DateTime field filtering implementation
 */
export interface KSAdminUiFilterForDateAndDateTimeFields {
	/**
	 * Filter mode.
	 * - 'between': Matches dates between 'after' and 'before'.
	 * - 'after': Matches dates after the value.
	 * - 'before': Matches dates before the value.
	 * Default: exact match for the day
	 */
	mode?: "between" | "after" | "before" | string;
	/** The date value(s) to filter by. */
	value?: string | Date | moment.Moment;
	/** Start date for 'between' mode. */
	after?: string | Date | moment.Moment;
	/** End date for 'between' mode. */
	before?: string | Date | moment.Moment;
	/**
	 * Invert the filter logic.
	 * Default: false
	 */
	inverted?: boolean;
}

/**
 * Filter options for DateArray fields.
 * @see /fields/types/datearray/DateArrayType.js - DateArray field filtering implementation
 */
export interface KSAdminUiFilterForDateArrayField {
	/**
	 * Filter mode.
	 * - 'between': Matches dates between 'after' and 'before'.
	 * - 'after': Matches dates after the value.
	 * - 'before': Matches dates before the value.
	 * Default: exact match for the day
	 */
	mode?: "between" | "after" | "before" | string;
	/**
	 * Presence mode.
	 * - 'none': No dates match the filter.
	 * - 'some': At least one date matches the filter.
	 * Default: 'some'
	 */
	presence?: "none" | "some";
	/** The date value(s) to filter by. */
	value?: string | Date | moment.Moment;
	/** Start date for 'between' mode. */
	after?: string | Date | moment.Moment;
	/** End date for 'between' mode. */
	before?: string | Date | moment.Moment;
}
