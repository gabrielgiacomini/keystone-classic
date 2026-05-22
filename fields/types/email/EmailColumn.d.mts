import React from 'react';

/** Props accepted by the EmailColumn list-view cell component. */
export interface EmailColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders an email field value as a mailto link in the list view. */
declare const EmailColumn: React.ComponentClass<EmailColumnProps>;

export default EmailColumn;
