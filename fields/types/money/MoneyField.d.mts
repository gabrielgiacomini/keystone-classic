/**
 * @file Hand-authored TypeScript declaration for fields/types/money/MoneyField.mjs.
 *
 * The runtime implementation lives in MoneyField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the MoneyField component.
 *
 * MoneyField filters out non-currency characters before calling onChange.
 * The value is a string or number per the runtime propTypes declaration.
 * Props derived from propTypes and this.props usage in the source.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the MoneyField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is string or number per the runtime propTypes (oneOfType).
 * - `onChange` is required per the runtime propTypes.
 */
export interface MoneyFieldProps {
	/** Human-readable label displayed next to the input. */
	label: string;
	/** Called whenever the money value changes. Required. */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. Required. */
	path: FieldPath;
	/** Current money value (string or number). */
	value?: string | number;
}

/** The MoneyField component — a currency input field for the legacy admin UI. */
declare const MoneyField: React.ComponentClass<MoneyFieldProps>;
export default MoneyField;
