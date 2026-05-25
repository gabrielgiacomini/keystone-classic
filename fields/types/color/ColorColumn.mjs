/**
 * @file
 * This file defines the `ColorColumn` component, which is used to render the
 * value of a `Color` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `ColorColumn` component.
 * @augments React.Component
 */
function ColorColumn({ col, data }) {
	const value = data.fields[col.path];
	let renderedValue = null;
	if (value) {
		const colorBoxStyle = {
			backgroundColor: value,
			borderRadius: 3,
			display: 'inline-block',
			height: 18,
			marginRight: 10,
			verticalAlign: 'middle',
			width: 18,
		};

		renderedValue = React.createElement(
			ItemsTableValue,
			{ truncate: false, field: col.type },
			React.createElement(
				'div',
				{ style: { lineHeight: '18px' } },
				React.createElement('span', { style: colorBoxStyle }),
				React.createElement('span', { style: { display: 'inline-block', verticalAlign: 'middle' } }, value),
			),
		);
	}

	return React.createElement(ItemsTableCell, null, renderedValue);
}


export default ColorColumn;
