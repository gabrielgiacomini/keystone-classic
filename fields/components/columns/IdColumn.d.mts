/**
 * @file Hand-authored declaration for fields/components/columns/IdColumn.mjs
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Phase 11
 */
import type React from 'react';

export interface IdColumnProps {
	/** Column descriptor object (must have `path` and `type` properties). */
	col: { path: string; type: string; [key: string]: unknown };
	/** Row data object (must have an `id` field). */
	data: { id: string; [key: string]: unknown };
	/** Keystone list descriptor (must have a `path` property). */
	list: { path: string; [key: string]: unknown };
}

declare const IdColumn: React.ComponentClass<IdColumnProps>;
export default IdColumn;
