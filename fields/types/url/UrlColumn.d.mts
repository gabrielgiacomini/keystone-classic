import React from 'react';

/** Props accepted by the UrlColumn list-view cell component. */
export interface UrlColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders a URL field value as a hyperlink in the list view. */
declare const UrlColumn: React.ComponentClass<UrlColumnProps>;

export default UrlColumn;
