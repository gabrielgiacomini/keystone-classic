/**
 * @file Hand-authored TypeScript declaration for fields/types/cloudinary/CloudinaryField.mjs.
 * CloudinaryField is a functional router that delegates to CloudinaryImageField
 * or CloudinaryImagesField based on whether the value prop is an array.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Props accepted by the CloudinaryField router component. */
export interface CloudinaryFieldProps {
	/** The field value — an array means CloudinaryImages, an object means CloudinaryImage. */
	value: Record<string, unknown> | Array<Record<string, unknown>>;
	/** All other field props forwarded to the delegated component. */
	[key: string]: unknown;
}

/** Routes to CloudinaryImageField or CloudinaryImagesField based on value type. */
declare const CloudinaryField: React.FC<CloudinaryFieldProps> & {
	displayName: string;
	type: string;
	getDefaultValue: (field: Record<string, unknown>) => Record<string, unknown> | Array<unknown>;
};

export default CloudinaryField;
