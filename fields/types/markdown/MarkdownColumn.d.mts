import React from 'react';

/** Props accepted by the MarkdownColumn list-view cell component. */
export interface MarkdownColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a markdown field value (up to 100 characters of raw markdown) in the list view. */
declare const MarkdownColumn: React.ComponentClass<MarkdownColumnProps>;

export default MarkdownColumn;
