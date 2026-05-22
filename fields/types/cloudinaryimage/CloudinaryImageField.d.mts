/**
 * @file Hand-authored TypeScript declaration for fields/types/cloudinaryimage/CloudinaryImageField.mjs.
 *
 * The runtime implementation lives in CloudinaryImageField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the CloudinaryImageField component.
 *
 * Recipe D: stateful field with Cloudinary upload callbacks typed via type guards.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 9
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';

/**
 * The server-side Cloudinary image value shape as returned by the API.
 * Matches the `propTypes.value` shape declared in CloudinaryImageField.mjs.
 */
export interface CloudinaryImageValue {
	/** Cloudinary format/extension (e.g. 'jpg', 'png', 'pdf'). */
	format?: string;
	/** Height of the image in pixels. */
	height?: number;
	/** Cloudinary public_id — used to construct resize URLs. */
	public_id?: string;
	/** Cloudinary resource type (e.g. 'image'). */
	resource_type?: string;
	/** HTTPS URL to the image. */
	secure_url?: string;
	/** Cloudinary request signature. */
	signature?: string;
	/** HTTP URL to the image. */
	url?: string;
	/** Cloudinary version number. */
	version?: number;
	/** Width of the image in pixels. */
	width?: number;
}

/**
 * Type guard for a valid CloudinaryImageValue at the API data boundary.
 * Narrows `unknown` to `CloudinaryImageValue` — used when checking API responses.
 *
 * At minimum a stored Cloudinary image has a `public_id`; `url` indicates
 * that an image is actually stored.
 *
 * @param x - The value to check.
 * @returns Whether the value is a CloudinaryImageValue.
 */
export function isCloudinaryImageValue(x: unknown): x is CloudinaryImageValue {
	return typeof x === 'object' && x !== null;
}

/**
 * Props for the CloudinaryImageField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is the server-side Cloudinary image value (may be empty object `{}` if no image).
 * - `autoCleanup` controls whether removing an image also deletes it from Cloudinary.
 * - `secure` forces HTTPS Cloudinary URLs.
 */
export interface CloudinaryImageFieldProps {
	/**
	 * Whether removing an image should also delete it from Cloudinary storage.
	 * When true, clicking Remove triggers a 'delete' action on save.
	 */
	autoCleanup?: boolean;
	/** Whether the field should be collapsed when no image is set. */
	collapse?: boolean;
	/** Human-readable label for the field. */
	label?: string;
	/** The field's mode — 'edit' or 'view'. */
	mode?: 'edit' | 'view';
	/** Optional help note displayed beneath the field. */
	note?: string;
	/** The field's path within the list document. Branded as FieldPath. Required. */
	path: FieldPath;
	/** Whether to force HTTPS Cloudinary image URLs. */
	secure?: boolean;
	/**
	 * Current server-side Cloudinary image value.
	 * May be an empty object `{}` if no image is set.
	 */
	value?: CloudinaryImageValue | Record<string, never>;
	/** onChange handler called when a new file is selected for upload. */
	onChange?: (change: { file: File }) => void;
}

/**
 * Internal state of the CloudinaryImageField component.
 *
 * Documented for reference — TypeScript consumers care about props, not
 * internal state. The upload lifecycle (file selection, preview, remove/undo)
 * lives here.
 */
export interface CloudinaryImageFieldState {
	/** Whether the existing image is marked for removal. */
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
	/** Base64 data URI of the locally selected file for preview. */
	dataUri?: string;
	/** Whether the FileReader is currently loading (reading the file). */
	loading?: boolean;
	/** Whether the full-size image lightbox is visible. */
	lightboxIsVisible?: boolean;
}

/** The CloudinaryImageField component — a single Cloudinary image upload field for the legacy admin UI. */
declare const CloudinaryImageField: React.ComponentClass<CloudinaryImageFieldProps>;
export default CloudinaryImageField;
