/**
 * @file Hand-authored declaration for fields/components/columns/CloudinaryImageSummary.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface CloudinaryImageData {
	/** Image width in pixels. */
	width?: number;
	/** Image height in pixels. */
	height?: number;
	/** Cloudinary public ID (without extension). */
	public_id?: string;
	/** Image format extension (e.g. `'jpg'`). */
	format?: string;
	/** HTTP URL for the image. */
	url?: string;
	/** HTTPS URL for the image. */
	secure_url?: string;
	[key: string]: unknown;
}

export interface CloudinaryImageSummaryProps {
	/** Cloudinary image metadata object. */
	image: CloudinaryImageData;
	/** Optional label variant to display alongside the thumbnail. */
	label?: 'dimensions' | 'publicId';
	/** When true, uses `secure_url` instead of `url` for the thumbnail. */
	secure?: boolean;
}

declare const CloudinaryImageSummary: React.ComponentClass<CloudinaryImageSummaryProps>;
export default CloudinaryImageSummary;
