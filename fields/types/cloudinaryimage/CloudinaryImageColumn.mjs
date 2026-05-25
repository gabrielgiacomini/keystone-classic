/**
 * @file
 * This file defines the `CloudinaryImageColumn` component, which is used to
 * render the value of a `CloudinaryImage` field in a list view.
 */
import React from 'react';
import CloudinaryImageSummary from '../../components/columns/CloudinaryImageSummary.mjs';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `CloudinaryImageColumn` component.
 * @augments React.Component
 */
function CloudinaryImageColumn({ col, data }) {
	const value = data.fields[col.path];
	const renderedValue = value && Object.keys(value).length ? React.createElement(
		ItemsTableValue,
		{ field: col.type },
		React.createElement(CloudinaryImageSummary, { label: 'dimensions', image: value, secure: col.field.secure }),
	) : null;

	return React.createElement(ItemsTableCell, null, renderedValue);
}


export default CloudinaryImageColumn;
