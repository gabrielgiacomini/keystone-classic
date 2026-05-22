/**
 * @file Hand-authored declaration for fields/components/columns/InvalidColumn.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface InvalidColumnProps {
	/** Column descriptor object (must have a `type` property). */
	col: { type: string; [key: string]: unknown };
}

declare const InvalidColumn: React.ComponentClass<InvalidColumnProps>;
export default InvalidColumn;
