/**
 * @file Hand-authored TypeScript declaration for fields/types/file/FileColumn.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Props accepted by the FileColumn list-view cell component. */
export interface FileColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a file field value (filename, linked to the file URL) in the list view. */
declare const LocalFileColumn: React.ComponentClass<FileColumnProps>;

export default LocalFileColumn;
