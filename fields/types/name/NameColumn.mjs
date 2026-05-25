/**
 * @file
 * This file defines the `NameColumn` component, which is used to render the
 * value of a `Name` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';
import displayName from '../../../lib/utils/displayName.mjs';

/**
 * The `NameColumn` component.
 * @augments React.Component
 */
function NameColumn({ col, data, linkTo }) {
	const value = data.fields[col.path];
	const renderedValue = !value || (!value.first && !value.last)
		? '(no name)'
		: displayName(value.first, value.last);

	return React.createElement(
		ItemsTableCell,
		{
			'data-list-row-edit': linkTo ? true : undefined,
			'data-item-id': linkTo ? data.id : undefined,
		},
		React.createElement(ItemsTableValue, {
			to: linkTo,
			padded: true,
			interior: true,
			field: col.type,
		}, renderedValue),
	);
}


export default NameColumn;
