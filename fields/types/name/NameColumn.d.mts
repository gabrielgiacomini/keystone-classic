import React from 'react';

/** Props accepted by the NameColumn list-view cell component. */
export interface NameColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
	/** Optional link target — when present, the cell is rendered as an edit link. */
	linkTo?: string;
}

/** Renders a name field value (first + last) in the list view. */
declare const NameColumn: React.ComponentClass<NameColumnProps>;

export default NameColumn;
