/**
 * @file
 * This file defines the `BooleanColumn` component, which is used to render the
 * value of a `Boolean` field in a list view.
 */
import React from 'react';
import Checkbox from '../../components/Checkbox.mjs';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `BooleanColumn` component.
 * @augments React.Component
 */
function BooleanColumn({ col, data }) {
	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(
			ItemsTableValue,
			{ truncate: false, field: col.type },
			React.createElement(Checkbox, { readonly: true, checked: data.fields[col.path] }),
		),
	);
}


export default BooleanColumn;
