/**
 * @file
 * This file defines the `MarkdownColumn` component, which is used to render the
 * value of a `Markdown` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `MarkdownColumn` component.
 * @augments React.Component
 */
function MarkdownColumn({ col, data }) {
	const value = data.fields[col.path];
	const renderedValue = (value && Object.keys(value).length) ? value.md.slice(0, 100) : null;

	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(ItemsTableValue, { field: col.type }, renderedValue),
	);
}


export default MarkdownColumn;
