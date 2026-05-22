import React from 'react';

/** Props accepted by the TextColumn list-view cell component. */
export interface TextColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
	/** Optional link target — when present, the cell is rendered as an edit link. */
	linkTo?: string;
}

/** Renders a text field value (up to 100 characters) in the list view. */
declare const TextColumn: React.ComponentClass<TextColumnProps>;

export default TextColumn;
