/**
 * @file Hand-authored TypeScript declaration for fields/types/relationship/RelationshipColumn.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Props accepted by the RelationshipColumn list-view cell component. */
export interface RelationshipColumnProps {
	/** Column descriptor from the Keystone list definition (includes field, path, type). */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a relationship field value (linked item name(s)) in the list view. */
declare const RelationshipColumn: React.ComponentClass<RelationshipColumnProps>;

export default RelationshipColumn;
