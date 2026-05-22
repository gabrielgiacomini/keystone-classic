import React from 'react';

/** Props accepted by the SelectColumn list-view cell component. */
export interface SelectColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
	/** Optional link target — when present, the cell is rendered as an edit link. */
	linkTo?: string;
}

/** Renders a select field value (the option label) in the list view. */
declare const SelectColumn: React.ComponentClass<SelectColumnProps>;

export default SelectColumn;
