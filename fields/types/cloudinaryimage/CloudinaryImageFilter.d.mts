/**
 * @file Hand-authored TypeScript declaration for fields/types/cloudinaryimage/CloudinaryImageFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** The filter value shape for the CloudinaryImageFilter. */
export interface CloudinaryImageFilterValue {
	/** Whether an image is set (true) or not set (false). */
	exists: boolean;
}

/** Props accepted by the CloudinaryImageFilter component. */
export interface CloudinaryImageFilterProps {
	/** The current filter value. */
	filter: CloudinaryImageFilterValue;
	/** Callback invoked when the filter value changes. */
	onChange: (value: CloudinaryImageFilterValue) => void;
}

/** Renders a segmented control to filter by whether a Cloudinary image is set. */
declare const CloudinaryImageFilter: React.ComponentClass<CloudinaryImageFilterProps> & {
	getDefaultValue: () => CloudinaryImageFilterValue;
};

export default CloudinaryImageFilter;
