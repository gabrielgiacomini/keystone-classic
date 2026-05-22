import React from 'react';

/** Props accepted by the NumberColumn list-view cell component. */
export interface NumberColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a number or money field value (formatted with numeral.js) in the list view. */
declare const NumberColumn: React.ComponentClass<NumberColumnProps>;

export default NumberColumn;
