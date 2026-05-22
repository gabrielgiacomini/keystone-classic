/**
 * @file Hand-authored TypeScript declaration for fields/types/code/CodeField.mjs.
 *
 * The runtime implementation lives in CodeField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the CodeField component.
 *
 * CodeField wraps a CodeMirror editor instance. Props derived from this.props
 * usage throughout the source (editor, height, path, value, onChange).
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * CodeMirror editor configuration options passed through to the editor instance.
 * Subset of the CodeMirror options object (everything except lineNumbers/readOnly,
 * which are set by the component itself).
 */
export interface CodeMirrorOptions {
	/** The CodeMirror mode to use (e.g. 'javascript', 'css', 'python'). */
	mode?: string;
	/** Tab size in spaces. */
	tabSize?: number;
	/** Whether to use soft tabs (spaces instead of tab characters). */
	indentWithTabs?: boolean;
	/** Theme name matching a bundled CodeMirror theme CSS. */
	theme?: string;
	/** Allow any additional CodeMirror options. */
	[key: string]: unknown;
}

/**
 * Props for the CodeField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `editor` options are passed to CodeMirror.fromTextArea().
 * - `height` controls the CodeMirror editor height via setSize().
 */
export interface CodeFieldProps {
	/** CodeMirror editor configuration options (merged with defaults). */
	editor?: CodeMirrorOptions;
	/** Height for the CodeMirror editor (pixels). */
	height?: number | string;
	/** Human-readable label displayed next to the editor. */
	label: string;
	/** Called whenever the code value changes. */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current code string value of the field. */
	value?: string;
}

/** The CodeField component — a CodeMirror-powered code editor field for the legacy admin UI. */
declare const CodeField: React.ComponentClass<CodeFieldProps>;
export default CodeField;
