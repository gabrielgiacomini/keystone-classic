import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

function IdColumn({ col, data, list }) {
	const value = data.id;

	return React.createElement(
		ItemsTableCell,
		null,
		value ? React.createElement(
			ItemsTableValue,
			{
				padded: true,
				interior: true,
				title: value,
				to: Keystone.adminLegacyPath + '/' + list.path + '/' + value,
				field: col.type,
			},
			value,
		) : null,
	);
}


export default IdColumn;
