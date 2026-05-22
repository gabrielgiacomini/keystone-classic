/**
 * @file Hand-authored TypeScript declaration for fields/types/name/NameField.mjs.
 *
 * The runtime implementation lives in NameField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the NameField component.
 *
 * NameField renders two text inputs (first + last name). The value is an
 * object with optional `first` and `last` string properties. `paths` carries
 * the sub-field names for form submission. Props derived from propTypes and
 * this.props usage throughout the source.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * The shape of the name field value — separate first and last name strings.
 */
export interface NameValue {
	/** The first (given) name. */
	first?: string;
	/** The last (family) name. */
	last?: string;
}

/**
 * Props for the NameField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is a `NameValue` object (not a flat string).
 * - `paths` carries the sub-field paths for the first/last inputs.
 * - `autoFocus` is passed through to the first-name input.
 */
export interface NameFieldProps {
	/** When true, focuses the first-name input on mount. */
	autoFocus?: boolean;
	/** Human-readable label displayed next to the name inputs. */
	label: string;
	/** Called whenever either name input changes. Required. */
	onChange: (change: { path: FieldPath; value: NameValue }) => void;
	/** The field's path within the list document. Branded as FieldPath. Required. */
	path: FieldPath;
	/** Sub-field paths for the first and last name form inputs. Required. */
	paths: { first: string; last: string };
	/** Current name value object. Required (defaults to empty object). */
	value: NameValue;
}

/** The NameField component — a first/last name pair of inputs for the legacy admin UI. */
declare const NameField: React.ComponentClass<NameFieldProps>;
export default NameField;
