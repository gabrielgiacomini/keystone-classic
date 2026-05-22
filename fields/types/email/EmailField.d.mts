/**
 * @file Hand-authored TypeScript declaration for fields/types/email/EmailField.mjs.
 *
 * The runtime implementation lives in EmailField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the EmailField component.
 *
 * EmailField renders an email <input type="email"> with a mailto: link for the
 * read-only value view. Props derived from propTypes and this.props usage.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the EmailField component.
 *
 * - `path` uses the branded `FieldPath` type to prevent confusion with
 *   list paths or arbitrary strings.
 * - `onChange` receives a typed change object so callers know exactly what
 *   shape to expect.
 * - `value` and `path` match the propTypes declared in the runtime source.
 */
export interface EmailFieldProps {
	/** Human-readable label displayed next to the input. */
	label: string;
	/** Called whenever the email value changes. */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. Required. */
	path: FieldPath;
	/** Current email string value of the field. */
	value?: string;
}

/** The EmailField component — an email address input field for the legacy admin UI. */
declare const EmailField: React.ComponentClass<EmailFieldProps>;
export default EmailField;
