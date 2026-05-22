/**
 * @file Hand-authored TypeScript declaration for fields/types/numberarray/NumberArrayFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe B)
 */
import type React from 'react';

/** Number Array Filter Value component. */
/** Value shape for the NumberArrayFilter component. */
export interface NumberArrayFilterValue {
  mode: 'equals' | 'gt' | 'lt' | 'between';
  presence: 'some' | 'none';
  /** Single value for non-between modes; min/max object for between mode. */
  value: string | number | { min: string | number; max: string | number };
}

/** Number Array Filter Props component. */
/** Props for the NumberArrayFilter component. */
export interface NumberArrayFilterProps {
  /** The current filter value. */
  filter: NumberArrayFilterValue;
  /** Callback invoked when the filter value changes. */
  onChange: (value: NumberArrayFilterValue) => void;
}

/** The NumberArrayFilter component. */
declare const NumberArrayFilter: React.ComponentClass<NumberArrayFilterProps>;
export default NumberArrayFilter;
