import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

function ArrayColumn({ col, data }) {
	const value = data.fields[col.path];
	const renderedValue = value && value.length ? value.join(', ') : null;

	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(ItemsTableValue, { field: col.type }, renderedValue),
	);
}


export default ArrayColumn;
