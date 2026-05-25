/**
 * @file
 * This file defines the `LocationColumn` component, which is used to render
 * the value of a `Location` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const SUB_FIELDS = ['street1', 'suburb', 'state', 'postcode', 'country'];

/**
 * The `LocationColumn` component.
 * @augments React.Component
 */
function LocationColumn({ col, data }) {
	const value = data.fields[col.path];
	const output = value && Object.keys(value).length
		? SUB_FIELDS.filter(i => value[i]).map(i => value[i])
		: [];
	const renderedValue = output.length ? React.createElement(
		ItemsTableValue,
		{ field: col.type, title: output.join(', ') },
		output.join(', '),
	) : null;

	return React.createElement(ItemsTableCell, null, renderedValue);
}


export default LocationColumn;
