/**
 * @file Hand-authored declaration for fields/components/ImageThumbnail.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface ImageThumbnailProps {
	/** The thumbnail image or content rendered inside the wrapper. */
	children?: React.ReactNode;
	/** Additional CSS class names forwarded to the wrapper element. */
	className?: string;
	/** Element type or React component used to render the wrapper. Defaults to `'span'`; pass `'a'` to activate hover/focus styles. */
	component?: React.ElementType;
	/** Overlay mask variant to display on the thumbnail. */
	mask?: 'loading' | 'remove' | 'upload';
	[key: string]: unknown;
}

declare const ImageThumbnail: React.FC<ImageThumbnailProps>;
export default ImageThumbnail;
