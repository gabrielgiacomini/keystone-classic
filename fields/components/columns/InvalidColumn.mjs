import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

function InvalidColumn({ col }) {
	return React.createElement(
		ItemsTableCell,
		null,
		React.createElement(ItemsTableValue, { field: col.type }, '(Invalid Type: ', col.type, ')'),
	);
}


export default InvalidColumn;
