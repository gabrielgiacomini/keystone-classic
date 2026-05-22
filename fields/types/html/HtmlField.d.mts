/**
 * @file Hand-authored TypeScript declaration for fields/types/html/HtmlField.mjs.
 *
 * The runtime implementation lives in HtmlField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the HtmlField component.
 *
 * Recipe C/D: stateful field with editor state — tracks TinyMCE WYSIWYG
 * editor activation, focus state, and a stable DOM element id for the editor.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 8
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * TinyMCE WYSIWYG configuration options passed as the `wysiwyg` prop.
 *
 * All fields are optional — unset options fall back to Keystone defaults.
 * This is a partial projection; TinyMCE accepts many more options via
 * `additionalOptions`.
 */
export interface HtmlFieldWysiwygOptions {
	/** Whether to enable the image upload plugin. */
	enableImages?: boolean;
	/** Whether to enable Cloudinary image uploads. */
	enableCloudinaryUploads?: boolean;
	/** Whether to enable S3 image uploads. */
	enableS3Uploads?: boolean;
	/** Whether to override the default toolbar entirely. */
	overrideToolbar?: boolean;
	/** Comma-separated list of additional toolbar buttons. */
	additionalButtons?: string;
	/** Comma-separated list of additional TinyMCE plugins. */
	additionalPlugins?: string;
	/** URL to an external CSS file to import into the editor (importcss plugin). */
	importcss?: string;
	/** Whether to show the TinyMCE menu bar. */
	menubar?: boolean;
	/** TinyMCE skin name. */
	skin?: string;
	/** Additional raw TinyMCE options merged in last. */
	additionalOptions?: Record<string, unknown>;
}

/**
 * Props for the HtmlField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `wysiwyg` enables the TinyMCE WYSIWYG editor when truthy.
 * - `value` is the raw HTML string managed by the field.
 */
export interface HtmlFieldProps {
	/** Whether the field should be collapsed when empty. */
	collapse?: boolean;
	/** Dependency map for conditional rendering (`dependsOn` feature). */
	dependsOn?: Record<string, unknown>;
	/** All current form values — used for `dependsOn` evaluation. */
	values?: Record<string, unknown>;
	/** Height of the editor/textarea in pixels. */
	height?: number;
	/** Human-readable label for the field. */
	label?: string;
	/** The field's mode — 'edit' or 'view'. */
	mode?: 'edit' | 'view';
	/**
	 * Called whenever the HTML content changes.
	 * `value` is the raw HTML string from the editor or textarea.
	 */
	onChange: (change: { path: FieldPath; value: string }) => void;
	/** The field's path within the list document. Branded as FieldPath. */
	path: FieldPath;
	/** Current HTML content value. */
	value?: string;
	/**
	 * TinyMCE WYSIWYG options. When falsy, a plain textarea is rendered.
	 * When truthy, the TinyMCE editor is initialised with these options.
	 */
	wysiwyg?: HtmlFieldWysiwygOptions | boolean;
}

/**
 * Internal state of the HtmlField component.
 *
 * Documented for reference — TypeScript consumers care about props, not
 * internal state. The TinyMCE lifecycle flags and stable DOM id live here.
 */
export interface HtmlFieldState {
	/** Stable DOM element id passed to TinyMCE as its `selector` target. */
	id: string;
	/** Whether the editor currently has keyboard focus. */
	isFocused: boolean;
	/** Whether the TinyMCE instance has been initialised and is active. */
	wysiwygActive: boolean;
}

/** The HtmlField component — a WYSIWYG/HTML textarea field for the legacy admin UI. */
declare const HtmlField: React.ComponentClass<HtmlFieldProps>;
export default HtmlField;
