/**
 * @file Hand-authored TypeScript declaration for fields/types/textarray/TextArrayColumn.mjs.
 *
 * TextArrayColumn re-exports ArrayColumn at runtime. Typed here directly since
 * ArrayColumn.d.mts will be added in Phase 5.
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

/** The TextArrayColumn component. */
declare const TextArrayColumn: React.ComponentClass<ColumnProps>;
export default TextArrayColumn;
