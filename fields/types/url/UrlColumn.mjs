/**
 * @file
 * This file defines the `UrlColumn` component, which is used to render the
 * value of a `Url` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `UrlColumn` component.
 * @augments React.Component
 */
function UrlColumn({ col, data }) {
	const value = data.fields[col.path];
	let renderedValue = null;

	if (value) {
		// if the value doesn't start with a prototcol, assume http for the href
		let href = value;
		if (href && !/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + value;
		}

		// strip the protocol from the link if it's http(s)
		const label = value.replace(/^https?\:\/\//i, '');

		renderedValue = React.createElement(ItemsTableValue, {
			to: href,
			padded: true,
			exterior: true,
			field: col.type,
		}, label);
	}

	return React.createElement(ItemsTableCell, null, renderedValue);
}


export default UrlColumn;
