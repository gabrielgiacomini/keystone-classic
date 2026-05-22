/**
 * @file Hand-authored TypeScript declaration for fields/types/datetime/DatetimeColumn.mjs.
 *
 * DatetimeColumn re-exports DateColumn at runtime. Typed here directly since
 * DateColumn.d.mts will be added in Phase 5.
 *
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 4 (Recipe A)
 */
import type React from 'react';

/** Column Props component. */
export interface ColumnProps {
  col: Record<string, unknown>;
  data: Record<string, unknown>;
  linkTo?: string;
}

/** The DatetimeColumn component. */
declare const DatetimeColumn: React.ComponentClass<ColumnProps>;
export default DatetimeColumn;
