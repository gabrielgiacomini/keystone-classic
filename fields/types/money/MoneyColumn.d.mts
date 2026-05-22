/**
 * @file Hand-authored TypeScript declaration for fields/types/money/MoneyColumn.mjs.
 *
 * MoneyColumn re-exports NumberColumn at runtime. Typed here directly since
 * NumberColumn.d.mts will be added in Phase 5.
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

/** The MoneyColumn component. */
declare const MoneyColumn: React.ComponentClass<ColumnProps>;
export default MoneyColumn;
