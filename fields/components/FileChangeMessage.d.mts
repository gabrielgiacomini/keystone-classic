/**
 * @file Hand-authored declaration for fields/components/FileChangeMessage.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface FileChangeMessageProps {
	/** Colour variant controlling the tinted appearance. Defaults to `'default'`. */
	color?: 'danger' | 'default' | 'success';
	/** Additional inline styles merged with the defaults. */
	style?: React.CSSProperties;
	[key: string]: unknown;
}

declare const FileChangeMessage: React.FC<FileChangeMessageProps>;
export default FileChangeMessage;
