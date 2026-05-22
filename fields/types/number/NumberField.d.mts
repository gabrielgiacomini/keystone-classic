/**
 * @file Hand-authored TypeScript declaration for fields/types/number/NumberField.mjs.
 *
 * The runtime implementation lives in NumberField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the NumberField component.
 *
 * NumberField validates input with a numeric regex before calling onChange.
 * The value is passed as a string (from the input element) to preserve partial
 * entry (e.g. '-', '1.'). Props derived from this.props usage in source.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the NumberField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is a string (the raw input value) to support partial numeric entry.
 * - `onChange` value is also a string for the same reason.
 */
export interface NumberFieldProps {
	/** Human-readable label displayed next to the input. */
	label: string;
	/** Called whenever the numeric value changes (value is a string from the input). */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current numeric value as a string (preserves partial entry like '-' or '1.'). */
	value?: string | number;
}

/** The NumberField component — a numeric text input field for the legacy admin UI. */
declare const NumberField: React.ComponentClass<NumberFieldProps>;
export default NumberField;
