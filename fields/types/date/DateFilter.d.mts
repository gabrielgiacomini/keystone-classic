/**
 * @file Hand-authored TypeScript declaration for fields/types/date/DateFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe B)
 */
import type React from 'react';

/** Date Filter Value component. */
/** Value shape for the DateFilter component. */
export interface DateFilterValue {
  mode: 'on' | 'after' | 'before' | 'between';
  inverted: boolean;
  /** ISO date string or Date for single-date modes. */
  value: string | Date;
  /** ISO date string or Date for the "from" bound in between mode. */
  after: string | Date;
  /** ISO date string or Date for the "to" bound in between mode. */
  before: string | Date;
}

/** Date Filter Props component. */
/** Props for the DateFilter component. */
export interface DateFilterProps {
  /** The current filter value. */
  filter: DateFilterValue;
  /** The field metadata (used for label in placeholder text). */
  field: { label: string; [key: string]: unknown };
  /** Date display format string (moment.js format). Defaults to 'DD-MM-YYYY'. */
  format?: string;
  /** Callback invoked when the filter value changes. */
  onChange: (value: DateFilterValue) => void;
}

/** The DateFilter component. */
declare const DateFilter: React.ComponentClass<DateFilterProps>;
export default DateFilter;
