/**
 * @file Hand-authored TypeScript declaration for fields/types/select/SelectField.mjs.
 *
 * The runtime implementation lives in SelectField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the SelectField component.
 *
 * SelectField renders a react-select dropdown. The `ops` array drives both the
 * dropdown options and value display. `numeric` controls whether option values
 * are coerced to numbers. Props derived from this.props usage throughout source.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * A single option entry in the select dropdown.
 */
export interface SelectOption {
	/** The display label shown in the dropdown. */
	label: string;
	/** The underlying value — string normally, number when `numeric` is true. */
	value: string | number;
}

/**
 * Props for the SelectField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `ops` provides the option list for the react-select dropdown.
 * - `numeric` coerces string option values to numbers before calling onChange.
 */
export interface SelectFieldProps {
	/** Human-readable label displayed next to the select. */
	label: string;
	/** When true, option values are coerced to numbers. */
	numeric?: boolean;
	/** Called whenever the selected value changes. */
	onChange: (change: { path: FieldPath; value: string | number | undefined }) => void;
	/** The available options for the dropdown. */
	ops: SelectOption[];
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current selected value (string or number). */
	value?: string | number;
}

/** The SelectField component — a dropdown select field for the legacy admin UI. */
declare const SelectField: React.ComponentClass<SelectFieldProps>;
export default SelectField;
