/**
 * @file Hand-authored TypeScript declaration for fields/types/textarea/TextareaField.mjs.
 *
 * The runtime implementation lives in TextareaField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the TextareaField component.
 *
 * TextareaField renders a multiline textarea. Props derived from this.props
 * usage in renderField() and renderValue() (height, style, path, value).
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the TextareaField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `height` and `style` control the textarea dimensions/appearance.
 */
export interface TextareaFieldProps {
	/** Explicit height for the textarea (CSS value or number of pixels). */
	height?: number | string;
	/** Human-readable label displayed next to the textarea. */
	label: string;
	/** Called whenever the textarea value changes. */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Additional inline styles merged into the textarea's style object. */
	style?: React.CSSProperties;
	/** Current multi-line string value of the field. */
	value?: string;
}

/** The TextareaField component — a multiline text input field for the legacy admin UI. */
declare const TextareaField: React.ComponentClass<TextareaFieldProps>;
export default TextareaField;
