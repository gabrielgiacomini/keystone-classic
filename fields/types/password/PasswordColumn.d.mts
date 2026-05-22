import React from 'react';

/** Props accepted by the PasswordColumn list-view cell component. */
export interface PasswordColumnProps {
	/** Column descriptor from the Keystone list definition. */
	col: Record<string, unknown>;
	/** Row data object containing field values keyed by field path. */
	data: Record<string, unknown>;
}

/** Renders '********' if a password is set, or an empty string, in the list view. */
declare const PasswordColumn: React.ComponentClass<PasswordColumnProps>;

export default PasswordColumn;
