/**
 * @file
 * This file defines the `SelectColumn` component, which is used to render the
 * value of a `Select` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `SelectColumn` component.
 * @augments React.Component
 */
function SelectColumn({ col, data, linkTo }) {
	const selectedValue = data.fields[col.path];
	const option = col.field.ops.filter(i => i.value === selectedValue)[0];
	const value = option ? option.label : null;
	const empty = !value && linkTo ? true : false;

	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(ItemsTableValue, { field: col.type, to: linkTo, empty }, value),
	);
}


export default SelectColumn;
