/**
 * @file Hand-authored TypeScript declaration for fields/types/numberarray/NumberArrayField.mjs.
 *
 * The runtime implementation lives in NumberArrayField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the NumberArrayField component.
 *
 * NumberArrayField uses the ArrayFieldMixin (via `mixins: [ArrayFieldMixin]`) to
 * manage a list of numeric values. It adds an `isValid` method that validates
 * each input against a numeric regex, but no additional state beyond the mixin.
 *
 * Inside the Field.create spec, `this` is typed as:
 *   WithArrayField<NumberArrayFieldProps, {}>
 * which expands to FieldThis<NumberArrayFieldProps, ArrayFieldState> with all
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
 * Props for the NumberArrayField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is an array of numbers managed by the ArrayField mixin.
 * - `onChange` receives the updated array as an array of numbers.
 * - `collapse` controls whether the field starts collapsed (via Collapse mixin).
 * - `label` is the human-readable label displayed next to the input.
 */
export interface NumberArrayFieldProps {
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current array of numeric values. */
	value?: number[];
	/** Called whenever the array value changes. */
	onChange: (change: { path: FieldPath; value: number[] }) => void;
	/** When true, the field renders in a collapsed state initially. */
	collapse?: boolean;
	/** Human-readable label displayed next to the field. */
	label?: string;
}

/**
 * The NumberArrayField component — a dynamic list of numeric inputs for the
 * legacy admin UI, powered by the ArrayField mixin. Each input is validated
 * against a numeric regex via the internal `isValid` method.
 */
declare const NumberArrayField: React.ComponentClass<NumberArrayFieldProps>;
export default NumberArrayField;
