/**
 * @file Hand-authored TypeScript declaration for fields/types/color/ColorField.mjs.
 *
 * The runtime implementation lives in ColorField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the ColorField component.
 *
 * Recipe C/D: stateful field — tracks color picker visibility state.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 8
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * Props for the ColorField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is the CSS hex color string (e.g. '#ff0000').
 * - `onChange` receives a typed change object with the new hex color value.
 */
export interface ColorFieldProps {
	/** Human-readable label for the field. */
	label?: string;
	/**
	 * Called whenever the color value changes.
	 * The value is a CSS hex color string (e.g. '#ff0000').
	 */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current hex color value of the field (e.g. '#ff0000'). */
	value?: string;
}

/**
 * Internal state of the ColorField component.
 *
 * Documented for reference — TypeScript consumers care about props, not
 * internal state. The color picker visibility toggle lives here.
 */
export interface ColorFieldState {
	/** Whether the color picker popover is visible. */
	displayColorPicker: boolean;
}

/** The ColorField component — a color picker field for the legacy admin UI. */
declare const ColorField: React.ComponentClass<ColorFieldProps>;
export default ColorField;
