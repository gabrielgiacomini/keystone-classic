/**
 * @file Hand-authored TypeScript declaration for fields/types/number/NumberFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe B)
 */
import type React from 'react';

/** Number Filter Value component. */
/** Value shape for the NumberFilter component. */
export interface NumberFilterValue {
  mode: 'equals' | 'gt' | 'lt' | 'between';
  value: string | { min: string; max: string };
}

/** Number Filter Props component. */
/** Props for the NumberFilter component. */
export interface NumberFilterProps {
  /** The current filter value. */
  filter: NumberFilterValue;
  /** The field metadata (used for label in placeholder text). */
  field: { label: string; [key: string]: unknown };
  /** Callback invoked when the filter value changes. */
  onChange: (value: NumberFilterValue) => void;
}

/** The NumberFilter component. */
declare const NumberFilter: React.ComponentClass<NumberFilterProps>;
export default NumberFilter;
