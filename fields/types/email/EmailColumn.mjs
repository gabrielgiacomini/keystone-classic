/**
 * @file
 * This file defines the `EmailColumn` component, which is used to render the
 * value of an `Email` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `EmailColumn` component.
 * @augments React.Component
 */
function EmailColumn({ col, data }) {
	const value = data.fields[col.path];

	return React.createElement(
		ItemsTableCell,
		null,
		value ? React.createElement(ItemsTableValue, {
			to: 'mailto:' + value,
			padded: true,
			exterior: true,
			field: col.type,
		}, value) : null,
	);
}


export default EmailColumn;
