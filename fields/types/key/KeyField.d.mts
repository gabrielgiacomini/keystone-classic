/**
 * @file Hand-authored TypeScript declaration for fields/types/key/KeyField.mjs.
 *
 * The runtime implementation lives in KeyField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the KeyField component.
 *
 * KeyField is a minimal wrapper around Field.create — no custom propTypes
 * or render methods. It inherits all base Field behaviour.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the KeyField component.
 *
 * - `path` uses the branded `FieldPath` type to prevent confusion with
 *   list paths or arbitrary strings.
 * - `onChange` receives a typed change object so callers know exactly what
 *   shape to expect.
 */
export interface KeyFieldProps {
	/** Human-readable label displayed next to the input. */
	label: string;
	/** Called whenever the key value changes. */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current key string value of the field. */
	value?: string;
}

/** The KeyField component — a key/slug text input field for the legacy admin UI. */
declare const KeyField: React.ComponentClass<KeyFieldProps>;
export default KeyField;
