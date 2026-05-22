/**
 * @file Hand-authored TypeScript declaration for fields/types/datearray/DateArrayFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 6 (Recipe B)
 */
import type React from 'react';

/** Date Array Filter Value component. */
/** Value shape for the DateArrayFilter component. */
export interface DateArrayFilterValue {
  mode: 'on' | 'after' | 'before' | 'between';
  presence: 'some' | 'none';
  /** ISO date string or Date for single-date modes. */
  value: string | Date;
  /** ISO date string or Date for the "from" bound in between mode. */
  after: string | Date;
  /** ISO date string or Date for the "to" bound in between mode. */
  before: string | Date;
}

/** Date Array Filter Props component. */
/** Props for the DateArrayFilter component. */
export interface DateArrayFilterProps {
  /** The current filter value. */
  filter: DateArrayFilterValue;
  /** The field metadata (used for label in placeholder text). */
  field: { label: string; [key: string]: unknown };
  /** Date display format string (moment.js format). Defaults to 'DD-MM-YYYY'. */
  format?: string;
  /** Callback invoked when the filter value changes. */
  onChange: (value: DateArrayFilterValue) => void;
}

/** The DateArrayFilter component. */
declare const DateArrayFilter: React.ComponentClass<DateArrayFilterProps>;
export default DateArrayFilter;
