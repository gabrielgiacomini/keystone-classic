/**
 * @file Hand-authored TypeScript declaration for fields/types/cloudinaryimage/CloudinaryImageColumn.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Props accepted by the CloudinaryImageColumn list-view cell component. */
export interface CloudinaryImageColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a Cloudinary image field value (image summary with dimensions) in the list view. */
declare const CloudinaryImageColumn: React.ComponentClass<CloudinaryImageColumnProps>;

export default CloudinaryImageColumn;
