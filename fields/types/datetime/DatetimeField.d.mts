/**
 * @file Hand-authored TypeScript declaration for fields/types/datetime/DatetimeField.mjs.
 *
 * The runtime implementation lives in DatetimeField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the DatetimeField component.
 *
 * Recipe C/D: stateful field — tracks date/time/timezone offset in local state
 * and derives a combined ISO 8601 value on change.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 8
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * The sub-path descriptors for the datetime field's composite inputs.
 * Each sub-field has its own form input name.
 */
export interface DatetimeFieldPaths {
	/** Form input name path for the date sub-field. */
	date: FieldPath;
	/** Form input name path for the time sub-field. */
	time: FieldPath;
	/** Form input name path for the timezone offset sub-field. */
	tzOffset: FieldPath;
}

/**
 * Props for the DatetimeField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `paths` is the composite sub-paths for date/time/tz inputs.
 * - `value` is an ISO 8601 datetime string (or null/undefined if empty).
 */
export interface DatetimeFieldProps {
	/** Dependency map for conditional rendering (`dependsOn` feature). */
	dependsOn?: Record<string, unknown>;
	/** All current form values — used for `dependsOn` evaluation. */
	values?: Record<string, unknown>;
	/** A moment.js format string for displaying the value in read-only mode. */
	formatString?: string;
	/** Whether to use UTC instead of local time. */
	isUTC?: boolean;
	/** Human-readable label for the field. */
	label?: string;
	/** The field's mode — 'edit' or 'view'. */
	mode?: 'edit' | 'view';
	/** Optional help note displayed beneath the field. */
	note?: string;
	/**
	 * Called whenever the datetime value changes.
	 * `value` is an ISO 8601 string (e.g. '2024-01-15T13:30:00.000Z') or null
	 * if the combined date+time does not form a valid datetime.
	 */
	onChange: (change: { path: FieldPath; value: string | null }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Sub-paths for the date, time, and tzOffset form inputs. */
	paths: DatetimeFieldPaths;
	/** Current value as an ISO 8601 datetime string (or null/undefined if empty). */
	value?: string | null;
}

/**
 * Internal state of the DatetimeField component.
 *
 * Documented for reference — TypeScript consumers care about props, not
 * internal state. The split date/time/tz offset strings live here and are
 * recombined into an ISO value on every `onChange` call.
 */
export interface DatetimeFieldState {
	/** The current date portion as a formatted string (e.g. '2024-01-15'). */
	dateValue: string | undefined | false;
	/** The current time portion as a formatted string (e.g. '1:30:00 pm'). */
	timeValue: string | undefined | false;
	/** The current timezone offset as a formatted string (e.g. '+10:00'). */
	tzOffsetValue: string;
}

/** The DatetimeField component — a date+time picker field for the legacy admin UI. */
declare const DatetimeField: React.ComponentClass<DatetimeFieldProps>;
export default DatetimeField;
