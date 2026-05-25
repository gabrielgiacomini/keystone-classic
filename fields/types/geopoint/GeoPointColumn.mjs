/**
 * @file
 * This file defines the `GeoPointColumn` component, which is used to render
 * the value of a `GeoPoint` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `GeoPointColumn` component.
 * @augments React.Component
 */
function GeoPointColumn({ col, data }) {
	const value = data.fields[col.path];
	let renderedValue = null;
	if (value && value.length) {
		const formattedValue = `${value[1]}, ${value[0]}`;
		const formattedTitle = `Lat: ${value[1]} Lng: ${value[0]}`;

		renderedValue = React.createElement(ItemsTableValue, { title: formattedTitle, field: col.type }, formattedValue);
	}

	return React.createElement(ItemsTableCell, null, renderedValue);
}


export default GeoPointColumn;
