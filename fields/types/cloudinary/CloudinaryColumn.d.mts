/**
 * @file Hand-authored TypeScript declaration for fields/types/cloudinary/CloudinaryColumn.mjs.
 * CloudinaryColumn is a functional router that delegates to CloudinaryImageColumn
 * or CloudinaryImagesColumn based on whether the value is an array.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Props accepted by the CloudinaryColumn router component. */
export interface CloudinaryColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Routes to CloudinaryImageColumn or CloudinaryImagesColumn based on value type. */
declare const CloudinaryColumn: React.FC<CloudinaryColumnProps>;

export default CloudinaryColumn;
