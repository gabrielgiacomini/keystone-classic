/**
 * @file Hand-authored TypeScript declaration for fields/types/relationship/RelationshipFilter.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** The filter value shape for the RelationshipFilter. */
export interface RelationshipFilterValue {
	/** Whether to invert the filter (NOT linked to). */
	inverted: boolean;
	/** Array of selected related item IDs. */
	value: string[];
}

/** The field descriptor shape expected by RelationshipFilter. */
export interface RelationshipFilterField {
	/** Display label for the field. */
	label?: string;
	/** The related list descriptor (must have `path` and optional `filters`). */
	refList: Record<string, unknown>;
	/** Optional filters to apply to the related list query. */
	filters?: Record<string, string>;
}

/** Props accepted by the RelationshipFilter component. */
export interface RelationshipFilterProps {
	/** The current filter value. */
	filter: RelationshipFilterValue;
	/** The field descriptor. */
	field: RelationshipFilterField;
	/** Callback invoked when the filter value changes. */
	onChange: (value: RelationshipFilterValue) => void;
	/** Callback invoked when the popout height changes (for popout container resizing). */
	onHeightChange?: (height: number) => void;
}

/** Renders a search input + selected/result lists for filtering relationship fields. */
declare const RelationshipFilter: React.ComponentClass<RelationshipFilterProps> & {
	getDefaultValue: () => RelationshipFilterValue;
};

export default RelationshipFilter;
