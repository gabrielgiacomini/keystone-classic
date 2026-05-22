import React from 'react';

/** Props accepted by the BooleanColumn list-view cell component. */
export interface BooleanColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a boolean field value as a readonly checkbox in the list view. */
declare const BooleanColumn: React.ComponentClass<BooleanColumnProps>;

export default BooleanColumn;
