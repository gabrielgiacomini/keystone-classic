/**
 * @file
 * This file defines the `DateColumn` component, which is used to render the
 * value of a `Date` or `Datetime` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';
import { formatDateByFormat } from '../../utils/date.mjs';

/**
 * The `DateColumn` component.
 * @augments React.Component
 */
function DateColumn({ col, data, linkTo }) {
	const rawValue = data.fields[col.path];
	const format = col.type === 'datetime' ? 'MMMM Do YYYY, h:mm:ss a' : 'MMMM Do YYYY';
	const value = rawValue ? formatDateByFormat(rawValue, format, { utc: col.field.isUTC }) : null;
	const empty = !value && linkTo ? true : false;

	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(ItemsTableValue, { field: col.type, to: linkTo, empty }, value),
	);
}


export default DateColumn;
