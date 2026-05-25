/**
 * @file
 * This file defines the `RelationshipColumn` component, which is used to render
 * the value of a `Relationship` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const moreIndicatorStyle = {
	color: '#bbb',
	fontSize: '.8rem',
	fontWeight: 500,
	marginLeft: 8,
};

/**
 * The `RelationshipColumn` component.
 * @augments React.Component
 */
function renderMany(col, value) {
	if (!value || !value.length) return null;
	const refList = col.field.refList;
	const items = [];
	for (let i = 0; i < 3; i++) {
		if (!value[i]) break;
		if (i) {
			items.push(React.createElement('span', { key: 'comma' + i }, ', '));
		}
		items.push(
			React.createElement(
				ItemsTableValue,
				{
					interior: true,
					truncate: false,
					key: 'anchor' + i,
					to: Keystone.adminLegacyPath + '/' + refList.path + '/' + value[i].id,
				},
				value[i].name,
			),
		);
	}
	if (value.length > 3) {
		items.push(React.createElement('span', { key: 'more', style: moreIndicatorStyle }, '[...', value.length - 3, ' more]'));
	}
	return React.createElement(ItemsTableValue, { field: col.type }, items);
}

function renderValue(col, value) {
	if (!value) return null;
	const refList = col.field.refList;
	return React.createElement(
		ItemsTableValue,
		{
			to: Keystone.adminLegacyPath + '/' + refList.path + '/' + value.id,
			padded: true,
			interior: true,
			field: col.type,
		},
		value.name,
	);
}

function RelationshipColumn({ col, data }) {
	const value = data.fields[col.path];
	const many = col.field.many;
	return React.createElement(ItemsTableCell, null, many ? renderMany(col, value) : renderValue(col, value));
}


export default RelationshipColumn;
