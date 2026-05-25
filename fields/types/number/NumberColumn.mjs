/**
 * @file
 * This file defines the `NumberColumn` component, which is used to render the
 * value of a `Number` or `Money` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';
import { formatNumber } from '../../../lib/utils/numberFormat.mjs';

/**
 * The `NumberColumn` component.
 * @augments React.Component
 */
function NumberColumn({ col, data }) {
	const value = data.fields[col.path];
	const renderedValue = value === undefined || isNaN(value)
		? null
		: (col.type === 'money' ? formatNumber(value, '$0,0.00') : value);

	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(ItemsTableValue, { field: col.type }, renderedValue),
	);
}


export default NumberColumn;
