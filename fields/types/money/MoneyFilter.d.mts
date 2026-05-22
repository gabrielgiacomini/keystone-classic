/**
 * @file Hand-authored TypeScript declaration for fields/types/money/MoneyFilter.mjs.
 * MoneyFilter re-exports NumberFilter at runtime.
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

/** The MoneyFilter component. */
declare const MoneyFilter: React.ComponentClass<FilterProps>;
export default MoneyFilter;
