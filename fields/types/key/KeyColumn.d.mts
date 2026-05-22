/**
 * @file Hand-authored TypeScript declaration for fields/types/key/KeyColumn.mjs.
 *
 * KeyColumn re-exports TextColumn at runtime. Typed here directly since
 * TextColumn.d.mts will be added in Phase 5.
 *
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 4 (Recipe A)
 */
import type React from 'react';

/** Props shared by all list-view column components. */
export interface ColumnProps {
  col: Record<string, unknown>;
  data: Record<string, unknown>;
  linkTo?: string;
}

declare const KeyColumn: React.ComponentClass<ColumnProps>;
export default KeyColumn;
