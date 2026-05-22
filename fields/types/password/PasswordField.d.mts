/**
 * @file Hand-authored TypeScript declaration for fields/types/password/PasswordField.mjs.
 *
 * The runtime implementation lives in PasswordField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the PasswordField component.
 *
 * Recipe C/D: stateful field — tracks password/confirm input values and
 * whether the change-password UI is currently visible.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 8
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * The sub-path descriptors for the password field's composite inputs.
 * The field manages both a primary password input and a confirm input.
 */
export interface PasswordFieldPaths {
	/** Form input name path for the confirm password sub-field. */
	confirm: FieldPath;
}

/**
 * Props for the PasswordField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is truthy if a password is already set (the actual hash is never
 *   exposed to the UI — the field only renders 'Password Set' or empty).
 * - `mode` determines whether the change-UI is shown on mount ('create' mode).
 */
export interface PasswordFieldProps {
	/** Whether the field should be collapsed when no password is set. */
	collapse?: boolean;
	/** Human-readable label for the field. */
	label?: string;
	/**
	 * The field's mode.
	 * In 'create' mode the change-password UI is shown immediately on mount.
	 * In 'edit' mode a "Change Password" button is shown first.
	 */
	mode?: 'create' | 'edit';
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Sub-paths for the confirm password input. */
	paths: PasswordFieldPaths;
	/**
	 * Current value — truthy if a password is already set.
	 * The actual hash is never sent to the client; this is a boolean-ish indicator.
	 */
	value?: string | boolean | null;
}

/**
 * Internal state of the PasswordField component.
 *
 * Documented for reference — TypeScript consumers care about props, not
 * internal state. The in-progress password and UI visibility live here.
 */
export interface PasswordFieldState {
	/** The current value of the confirm password input. */
	confirm: string;
	/** The current value of the new password input. */
	password: string;
	/** Whether a password is currently set (derived from props.value on mount). */
	passwordIsSet: boolean;
	/** Whether the change-password UI (two inputs + cancel button) is visible. */
	showChangeUI: boolean;
}

/** The PasswordField component — a password-entry field for the legacy admin UI. */
declare const PasswordField: React.ComponentClass<PasswordFieldProps>;
export default PasswordField;
