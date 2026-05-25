/**
 * @file
 * This file defines the `CloudinaryImagesColumn` component, which is used to
 * render the value of a `CloudinaryImages` field in a list view.
 */
import React from 'react';
import CloudinaryImageSummary from '../../components/columns/CloudinaryImageSummary.mjs';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const moreIndicatorStyle = {
	color: '#888',
	fontSize: '.8rem',
};

/**
 * The `CloudinaryImagesColumn` component.
 * @augments React.Component
 */
function renderMany(col, value) {
	if (!value || !value.length) return null;
	const items = [];
	for (let i = 0; i < 3; i++) {
		if (!value[i]) break;
		items.push(React.createElement(CloudinaryImageSummary, { key: 'image' + i, image: value[i], secure: col.field.secure }));
	}
	if (value.length > 3) {
		items.push(React.createElement('span', { key: 'more', style: moreIndicatorStyle }, '[...', value.length - 3, ' more]'));
	}
	return items;
}

function renderValue(col, value) {
	if (!value || !Object.keys(value).length) return null;
	return React.createElement(CloudinaryImageSummary, { image: value, secure: col.field.secure });
}

function CloudinaryImagesColumn({ col, data }) {
	const value = data.fields[col.path];
	const many = value.length > 1;

	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(ItemsTableValue, { field: col.type }, many ? renderMany(col, value) : renderValue(col, value[0])),
	);
}


export default CloudinaryImagesColumn;
