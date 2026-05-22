import React from 'react';

/** Props accepted by the DateColumn list-view cell component. */
export interface DateColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
	/** Optional link target — when present, the cell is rendered as an edit link. */
	linkTo?: string;
}

/** Renders a date or datetime field value (formatted with moment.js) in the list view. */
declare const DateColumn: React.ComponentClass<DateColumnProps>;

export default DateColumn;
