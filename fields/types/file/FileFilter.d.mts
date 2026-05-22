/**
 * @file Hand-authored TypeScript declaration for fields/types/file/FileFilter.mjs.
 * FileFilter re-exports CloudinaryImageFilter at runtime.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe A)
 */
import type React from 'react';

/** Filter Props component. */
export interface FilterProps {
  filter: Record<string, unknown>;
  field: Record<string, unknown>;
  filterString?: string;
  onChange: (value: unknown) => void;
}

/** The FileFilter component. */
declare const FileFilter: React.ComponentClass<FilterProps>;
export default FileFilter;
