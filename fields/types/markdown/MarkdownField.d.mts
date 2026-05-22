/**
 * @file Hand-authored TypeScript declaration for fields/types/markdown/MarkdownField.mjs.
 *
 * The runtime implementation lives in MarkdownField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the MarkdownField component.
 *
 * MarkdownField renders a textarea-based markdown editor, optionally with a
 * WYSIWYG toolbar (bootstrap-markdown). The field value is an object with a
 * `.md` string property. Props derived from this.props usage throughout the source.
 *
 * See: CONTRIBUTING_TYPED_FIELDS.md — Recipe C — Field via Field.create
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 7
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * The shape of the markdown field value — an object containing the raw markdown string.
 */
export interface MarkdownValue {
	/** The raw markdown source string. */
	md?: string;
}

/**
 * Toolbar customisation options passed to the bootstrap-markdown editor.
 */
export interface MarkdownToolbarOptions {
	/** Button names (or comma-separated string) to hide from the toolbar. */
	hiddenButtons?: string | string[];
}

/**
 * Props for the MarkdownField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is a `MarkdownValue` object (not a plain string).
 * - `paths` carries the sub-field path for the raw markdown input (`paths.md`).
 * - `toolbarOptions` configures hidden buttons in the WYSIWYG toolbar.
 */
export interface MarkdownFieldProps {
	/** Whether to collapse the field when it has no value. */
	collapse?: boolean;
	/** Explicit height for the editor (CSS value or number of pixels). */
	height?: number | string;
	/** Human-readable label displayed next to the editor. */
	label: string;
	/** Called whenever the markdown value changes. */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Sub-field paths — `paths.md` is the textarea name attribute. */
	paths: { md: string };
	/** Toolbar customisation options passed to the WYSIWYG editor. */
	toolbarOptions: MarkdownToolbarOptions;
	/** Current markdown value object. */
	value?: MarkdownValue;
	/** When true, activates the bootstrap-markdown WYSIWYG toolbar. */
	wysiwyg?: boolean;
}

/** The MarkdownField component — a markdown editor field for the legacy admin UI. */
declare const MarkdownField: React.ComponentClass<MarkdownFieldProps>;
export default MarkdownField;
