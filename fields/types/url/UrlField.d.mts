/**
 * @file Hand-authored TypeScript declaration for fields/types/url/UrlField.mjs.
 *
 * The runtime implementation lives in UrlField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the UrlField component.
 *
 * UrlField renders a URL input with an optional image thumbnail (when
 * `thumb` is true). Props derived from this.props usage in the source.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the UrlField component.
 *
 * - `path` uses the branded `FieldPath` type to prevent confusion with
 *   list paths or arbitrary strings.
 * - `thumb` enables an image thumbnail rendered from the URL value.
 */
export interface UrlFieldProps {
	/** Human-readable label displayed next to the input. */
	label: string;
	/** Called whenever the URL value changes. */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** When true, renders an <img> thumbnail using the current value as src. */
	thumb?: boolean;
	/** Current URL string value of the field. */
	value?: string;
}

/** The UrlField component — a URL input field with optional thumbnail for the legacy admin UI. */
declare const UrlField: React.ComponentClass<UrlFieldProps>;
export default UrlField;
