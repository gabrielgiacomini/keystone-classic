/**
 * @file
 * This file defines the `TextColumn` component, which is used to render the
 * value of a `Text` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `TextColumn` component.
 * @augments React.Component
 */
function TextColumn({ col, data, linkTo }) {
	// cropping text is important for textarea, which uses this column
	const rawValue = data.fields[col.path];
	const value = rawValue ? rawValue.slice(0, 100) : null;
	const empty = !value && linkTo ? true : false;
	const className = col.field.monospace ? 'ItemList__value--monospace' : undefined;

	return React.createElement(
		ItemsTableCell,
		{
			'data-list-row-edit': linkTo ? true : undefined,
			'data-item-id': linkTo ? data.id : undefined,
		},
		React.createElement(ItemsTableValue, {
			className,
			to: linkTo,
			empty,
			padded: true,
			interior: true,
			field: col.type,
		}, value),
	);
}


export default TextColumn;
