/**
 * @file Hand-authored TypeScript declaration for fields/types/boolean/BooleanFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe B)
 */
import type React from 'react';

/** Boolean Filter Props component. */
export interface BooleanFilterProps {
  /** The current filter value. */
  filter: {
    value: boolean;
  };
  /** Callback invoked when the filter value changes. */
  onChange: (value: { value: boolean }) => void;
}

/** The BooleanFilter component. */
declare const BooleanFilter: React.ComponentClass<BooleanFilterProps>;
export default BooleanFilter;
