/**
 * @file Hand-authored TypeScript declaration for fields/types/textarea/TextareaFilter.mjs.
 * TextareaFilter re-exports TextFilter at runtime.
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

/** The TextareaFilter component. */
declare const TextareaFilter: React.ComponentClass<FilterProps>;
export default TextareaFilter;
