/**
 * @file Hand-authored TypeScript declaration for fields/types/textarray/TextArrayField.mjs.
 *
 * The runtime implementation lives in TextArrayField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the TextArrayField component.
 *
 * TextArrayField uses the ArrayFieldMixin (via `mixins: [ArrayFieldMixin]`) to
 * manage a list of text (string) values. It adds no state or methods beyond
 * what the mixin provides.
 *
 * Inside the Field.create spec, `this` is typed as:
 *   WithArrayField<TextArrayFieldProps, {}>
 * which expands to FieldThis<TextArrayFieldProps, ArrayFieldState> with all
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
 * Props for the TextArrayField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is an array of strings managed by the ArrayField mixin.
 * - `onChange` receives the updated array as an array of strings.
 * - `collapse` controls whether the field starts collapsed (via Collapse mixin).
 * - `label` is the human-readable label displayed next to the input.
 */
export interface TextArrayFieldProps {
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current array of string values. */
	value?: string[];
	/** Called whenever the array value changes. */
	onChange: (change: { path: FieldPath; value: string[] }) => void;
	/** When true, the field renders in a collapsed state initially. */
	collapse?: boolean;
	/** Human-readable label displayed next to the field. */
	label?: string;
}

/**
 * The TextArrayField component — a dynamic list of text inputs for the legacy
 * admin UI, powered by the ArrayField mixin.
 */
declare const TextArrayField: React.ComponentClass<TextArrayFieldProps>;
export default TextArrayField;
