/**
 * @file
 * This file defines the `FileColumn` component, which is used to render the
 * value of a `File` field in a list view.
 */
import React from 'react';

import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `FileColumn` component.
 * @augments React.Component
 */
function LocalFileColumn({ col, data }) {
	const value = data.fields[col.path];
	const href = value && value.url ? value.url : null;
	const label = value && value.filename ? value.filename : null;
	return React.createElement(
		ItemsTableCell,
		{ href, padded: true, interior: true, field: col.type },
		React.createElement(ItemsTableValue, null, label),
	);
}

export default LocalFileColumn;
