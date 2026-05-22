/**
 * @file Hand-authored declaration for fields/components/columns/ArrayColumn.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface ArrayColumnProps {
	/** Column descriptor object (must have `path` and `type` properties). */
	col: { path: string; type: string; [key: string]: unknown };
	/** Row data object (must have a `fields` map keyed by field path). */
	data: { fields: Record<string, unknown>; [key: string]: unknown };
}

declare const ArrayColumn: React.ComponentClass<ArrayColumnProps>;
export default ArrayColumn;
