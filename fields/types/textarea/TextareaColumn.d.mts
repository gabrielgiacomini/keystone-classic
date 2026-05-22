/**
 * @file Hand-authored TypeScript declaration for fields/types/textarea/TextareaColumn.mjs.
 *
 * TextareaColumn re-exports TextColumn at runtime. Typed here directly since
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

/** The TextareaColumn component. */
declare const TextareaColumn: React.ComponentClass<ColumnProps>;
export default TextareaColumn;
