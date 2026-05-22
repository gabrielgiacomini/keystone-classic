/**
 * @file Hand-authored TypeScript declaration for fields/types/file/FileField.mjs.
 *
 * The runtime implementation lives in FileField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the FileField component.
 *
 * Recipe C/D: stateful field with upload state and type guards at the
 * file-input data boundary.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 8
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * The server-side file value shape as returned by the API.
 * Only `filename` is required — other fields are present but not used in UI.
 */
export interface FileValue {
	/** Name of the uploaded file on disk / in storage. */
	filename: string;
	/** Public URL to access the file, if available. */
	url?: string;
	/** MIME type of the file. */
	filetype?: string;
	/** Original filename as provided by the browser. */
	originalname?: string;
	/** Storage path. */
	path?: string;
	/** File size in bytes. */
	size?: number;
}

/**
 * Type guard for a valid FileValue at the API data boundary.
 * Narrows `unknown` to `FileValue` — used when checking API responses.
 *
 * @param x - The value to check.
 * @returns Whether the value is a FileValue.
 */
export function isFileValue(x: unknown): x is FileValue {
	return (
		typeof x === 'object' &&
		x !== null &&
		typeof (x as { filename: unknown }).filename === 'string'
	);
}

/**
 * The pending action state for a file field — controls the hidden form input
 * that tells the server what to do with the file on save.
 */
export type FileAction = 'delete' | 'reset' | null;

/**
 * Props for the FileField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is the server-side file value (may be empty object `{}` if no file).
 * - `autoCleanup` controls whether removing a file also deletes it from storage.
 */
export interface FileFieldProps {
	/**
	 * Whether removing a file should also delete it from storage (default: false).
	 * When true, clicking Remove triggers a 'delete' action on save.
	 * Alt+click inverts this: alt+remove → 'reset' (keep on disk), normal remove → 'delete'.
	 */
	autoCleanup?: boolean;
	/** Whether the field should be collapsed when no file is set. */
	collapse?: boolean;
	/** Human-readable label for the field. */
	label?: string;
	/** The field's mode — 'edit' or 'view'. */
	mode?: 'edit' | 'view';
	/** Optional help note displayed beneath the field. */
	note?: string;
	/** The field's path within the list document. Branded as FieldPath. Required. */
	path: FieldPath;
	/** Whether to show an image thumbnail preview for image files. */
	thumb?: boolean;
	/**
	 * Current server-side file value.
	 * May be an empty object `{}` if no file is set.
	 */
	value?: FileValue | Record<string, never>;
}

/**
 * Internal state of the FileField component.
 *
 * Documented for reference — TypeScript consumers care about props, not
 * internal state. The upload lifecycle (file selection, remove/undo, action)
 * lives here.
 */
export interface FileFieldState {
	/**
	 * The pending server action on save.
	 * - `'delete'` — delete the file from storage.
	 * - `'reset'` — remove from the document but keep the file on disk.
	 * - `null` — no special action (new upload handled separately via uploadFieldPath).
	 */
	action: FileAction;
	/** Whether the existing file is marked for removal. */
	removeExisting: boolean;
	/**
	 * Unique form input name for the hidden file input.
	 * Changes on each upload cycle to force React to remount the input
	 * (necessary to reset the file browser after a cancelled upload).
	 */
	uploadFieldPath: string;
	/**
	 * The File object selected by the user via the file browser.
	 * `null` until the user selects a file; reset to null after save/cancel.
	 */
	userSelectedFile: File | null;
}

/** The FileField component — a file upload field for the legacy admin UI. */
declare const FileField: React.ComponentClass<FileFieldProps>;
export default FileField;
