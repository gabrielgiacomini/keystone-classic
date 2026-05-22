import React from 'react';

/** Props accepted by the GeoPointColumn list-view cell component. */
export interface GeoPointColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a geo-point field value as "lat, lng" in the list view. */
declare const GeoPointColumn: React.ComponentClass<GeoPointColumnProps>;

export default GeoPointColumn;
