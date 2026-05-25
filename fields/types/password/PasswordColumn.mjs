/**
 * @file
 * This file defines the `PasswordColumn` component, which is used to render
 * the value of a `Password` field in a list view.
 *
 * It displays '********' if a password is set, and an empty string otherwise.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `PasswordColumn` component.
 * @augments React.Component
 */
function PasswordColumn({ col, data }) {
	const value = data.fields[col.path];
	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(ItemsTableValue, { field: col.type }, value ? '********' : ''),
	);
}


export default PasswordColumn;
