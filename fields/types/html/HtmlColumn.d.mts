/**
 * @file Hand-authored TypeScript declaration for fields/types/html/HtmlColumn.mjs.
 *
 * HtmlColumn re-exports TextColumn at runtime. Typed here directly since
 * TextColumn.d.mts will be added in Phase 5.
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

/** The HtmlColumn component. */
declare const HtmlColumn: React.ComponentClass<ColumnProps>;
export default HtmlColumn;
