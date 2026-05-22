/**
 * @file Hand-authored TypeScript declaration for fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Props accepted by the CloudinaryImagesColumn list-view cell component. */
export interface CloudinaryImagesColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a Cloudinary images field value (up to 3 thumbnails + overflow count) in the list view. */
declare const CloudinaryImagesColumn: React.ComponentClass<CloudinaryImagesColumnProps>;

export default CloudinaryImagesColumn;
