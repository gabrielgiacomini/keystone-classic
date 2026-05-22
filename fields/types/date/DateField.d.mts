/**
 * @file Hand-authored TypeScript declaration for fields/types/date/DateField.mjs.
 *
 * The runtime implementation lives in DateField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the DateField component.
 *
 * DateField renders a DateInput with an optional "Today" button. The value
 * is a date string in the configured `inputFormat` (default 'YYYY-MM-DD').
 * Props derived from propTypes and this.props usage throughout the source.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the DateField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is a date string formatted according to `inputFormat`.
 * - `formatString` controls how the value is displayed in read-only mode.
 * - `inputFormat` controls the expected format for the DateInput widget.
 * - `isUTC` switches moment parsing to UTC mode.
 * - `todayButton` shows a "Today" convenience button.
 */
export interface DateFieldProps {
	/**
	 * moment.js format string for the display (read-only) view.
	 * Defaults to 'Do MMM YYYY'.
	 */
	formatString?: string;
	/**
	 * moment.js format string used by the DateInput widget and for parsing.
	 * Defaults to 'YYYY-MM-DD'.
	 */
	inputFormat?: string;
	/** When true, parse/format the value in UTC. */
	isUTC?: boolean;
	/** Human-readable label displayed next to the date input. */
	label: string;
	/** An optional descriptive note shown below the field. */
	note?: string;
	/** Called whenever the date value changes. */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** When true, renders a "Today" button that fills the field with today's date. */
	todayButton?: boolean;
	/** Current date string value formatted as `inputFormat`. */
	value?: string;
}

/** The DateField component — a date picker field for the legacy admin UI. */
declare const DateField: React.ComponentClass<DateFieldProps>;
export default DateField;
