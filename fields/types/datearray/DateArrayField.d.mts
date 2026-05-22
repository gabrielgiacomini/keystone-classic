/**
 * @file Hand-authored TypeScript declaration for fields/types/datearray/DateArrayField.mjs.
 *
 * The runtime implementation lives in DateArrayField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the DateArrayField component.
 *
 * DateArrayField uses the ArrayFieldMixin (via `mixins: [ArrayFieldMixin]`) to
 * manage a list of date values. It adds `formatString` and `inputFormat` props
 * (with moment.js format defaults), along with `processInputValue`, `formatValue`,
 * and `getInputComponent` methods that customise the ArrayField mixin's rendering
 * to use a DateInput component.
 *
 * Inside the Field.create spec, `this` is typed as:
 *   WithArrayField<DateArrayFieldProps, {}>
 * which expands to FieldThis<DateArrayFieldProps, ArrayFieldState> with all
 * ArrayField methods (addItem, removeItem, updateItem, valueChanged, etc.)
 * available on `this`.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 10
 * See: fields/mixins/ArrayField.d.mts — WithArrayField<P,S>
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the DateArrayField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is an array of date strings managed by the ArrayField mixin.
 * - `onChange` receives the updated array as an array of date strings.
 * - `formatString` controls how values are displayed in read-only mode
 *   (defaults to `'Do MMM YYYY'`).
 * - `inputFormat` controls the expected moment.js format for each DateInput
 *   widget (defaults to `'YYYY-MM-DD'`).
 * - `collapse` controls whether the field starts collapsed (via Collapse mixin).
 * - `label` is the human-readable label displayed next to the input.
 */
export interface DateArrayFieldProps {
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current array of date strings, each formatted as `inputFormat`. */
	value?: string[];
	/** Called whenever the array value changes. */
	onChange: (change: { path: FieldPath; value: string[] }) => void;
	/**
	 * moment.js format string for the display (read-only) view.
	 * Defaults to `'Do MMM YYYY'`.
	 */
	formatString?: string;
	/**
	 * moment.js format string used by each DateInput widget and for parsing.
	 * Defaults to `'YYYY-MM-DD'`.
	 */
	inputFormat?: string;
	/** When true, the field renders in a collapsed state initially. */
	collapse?: boolean;
	/** Human-readable label displayed next to the field. */
	label?: string;
}

/**
 * The DateArrayField component — a dynamic list of date picker inputs for the
 * legacy admin UI, powered by the ArrayField mixin. Each item renders a
 * DateInput component and supports moment.js format customisation via
 * `formatString` and `inputFormat` props.
 */
declare const DateArrayField: React.ComponentClass<DateArrayFieldProps>;
export default DateArrayField;
