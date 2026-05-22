/**
 * @file Hand-authored TypeScript declaration for fields/types/cloudinaryimages/CloudinaryImagesField.mjs.
 *
 * The runtime implementation lives in CloudinaryImagesField.mjs which is intentionally
 * left unmodified. This declaration sidecar provides fully-typed props for
 * consumers of the CloudinaryImagesField component.
 *
 * Recipe D: stateful field with Cloudinary upload callbacks typed via type guards.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 9
 */

import type React from 'react';
import type { FieldPath } from '../branded.mjs';
import type { CloudinaryImageValue } from '../cloudinaryimage/CloudinaryImageField.mjs';

/**
 * Type guard for a valid CloudinaryImageValue at the API data boundary.
 * Narrows `unknown` to `CloudinaryImageValue` — used when checking API responses
 * for a single image within the images array.
 *
 * @param x - The value to check.
 * @returns Whether the value is a CloudinaryImageValue.
 */
export function isCloudinaryImageValue(x: unknown): x is CloudinaryImageValue;

/**
 * Props for the CloudinaryImagesField component.
 *
 * - `path` uses the branded `FieldPath` type.
 * - `value` is the server-side array of Cloudinary image values (may be empty array if no images).
 * - `secure` forces HTTPS Cloudinary URLs.
 */
export interface CloudinaryImagesFieldProps {
	/** Whether the field should be collapsed when no images are set. */
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
	 * Current server-side array of Cloudinary image values.
	 * Empty array if no images are set.
	 */
	value?: CloudinaryImageValue[];
	/** onChange handler called when the images selection changes. */
	onChange?: (change: { value: CloudinaryImageValue[] }) => void;
}

/**
 * Internal state of the CloudinaryImagesField component.
 *
 * Documented for reference — TypeScript consumers care about props, not
 * internal state. The multi-upload lifecycle (thumbnails, queued/deleted
 * tracking, lightbox) lives here.
 */
export interface CloudinaryImagesFieldState {
	/**
	 * Array of rendered thumbnail React elements.
	 * Each element wraps a single CloudinaryImageValue or a queued local File.
	 * The component uses cloneElement to toggle isDeleted/isQueued props on thumbnails.
	 */
	thumbnails: React.ReactElement[];
	/**
	 * Unique form input name for the hidden file input.
	 * Changes on each upload cycle to force React to remount the input
	 * (necessary to reset the file browser after a completed upload).
	 */
	uploadFieldPath: string;
	/** Whether the full-size image lightbox is visible. */
	lightboxIsVisible?: boolean;
	/** Index of the currently open image in the lightbox. */
	lightboxImageIndex?: number | null;
}

/** The CloudinaryImagesField component — a multi-image Cloudinary upload field for the legacy admin UI. */
declare const CloudinaryImagesField: React.ComponentClass<CloudinaryImagesFieldProps>;
export default CloudinaryImagesField;
