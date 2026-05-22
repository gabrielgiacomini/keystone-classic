/**
 * @file Hand-authored TypeScript declaration for fields/types/boolean/BooleanField.mjs.
 *
 * The runtime implementation lives in BooleanField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the BooleanField component.
 *
 * This file is the canonical Phase 3 reference example for Recipe C conversions.
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 3
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the BooleanField component.
 *
 * - `path` uses the branded `FieldPath` type to prevent confusion with
 *   list paths or arbitrary strings.
 * - `onChange` receives a typed change object so callers know exactly what
 *   shape to expect.
 * - `indent`, `label`, and `value` match the propTypes declared in the
 *   runtime source verbatim.
 */
export interface BooleanFieldProps {
	/** Offsets the label to align with indented form fields. */
	indent?: boolean;
	/** Human-readable label displayed next to the checkbox. */
	label: string;
	/** Called whenever the checkbox value changes. Required. */
	onChange: (change: { path: FieldPath; value: boolean }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current boolean value of the field. */
	value?: boolean;
}

/** The BooleanField component — a checkbox-based boolean field for the legacy admin UI. */
declare const BooleanField: React.ComponentClass<BooleanFieldProps>;
export default BooleanField;
