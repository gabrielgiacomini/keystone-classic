/**
 * @file Hand-authored TypeScript declaration for fields/types/location/LocationColumn.mjs.
 * See: .roadmap/legacy-admin-typing/00-GOAL.md — Audit pass (Recipe B)
 */
import type React from 'react';

/** Props accepted by the LocationColumn list-view cell component. */
export interface LocationColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a location field value (comma-joined address sub-fields) in the list view. */
declare const LocationColumn: React.ComponentClass<LocationColumnProps>;

export default LocationColumn;
