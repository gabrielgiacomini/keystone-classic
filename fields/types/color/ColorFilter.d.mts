/**
 * @file Hand-authored TypeScript declaration for fields/types/color/ColorFilter.mjs.
 * ColorFilter re-exports TextFilter at runtime.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe A)
 */
import type React from 'react';

/** Filter Props component. */
export interface FilterProps {
  filter: Record<string, unknown>;
  field: Record<string, unknown>;
  filterString?: string;
  onChange: (value: unknown) => void;
}

/** The ColorFilter component. */
declare const ColorFilter: React.ComponentClass<FilterProps>;
export default ColorFilter;
