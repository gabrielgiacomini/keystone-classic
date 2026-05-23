/**
 * @file
 * This file defines the `FileColumn` component, which is used to render the
 * value of a `File` field in a list view.
 */
import React from 'react';
import createReactClass from 'create-react-class';

import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `FileColumn` component.
 * @augments React.Component
 */
const LocalFileColumn = createReactClass({
	/**
	 * Returns the filename of the file, or undefined if no file is present.
	 * @returns {string|undefined} The name of the file, or undefined if not set.
	 */
	renderValue: function () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || !value.filename) return;
		return value.filename;
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render: function () {
		const value = this.props.data.fields[this.props.col.path];
		const href = value && value.url ? value.url : null;
		const label = value && value.filename ? value.filename : null;
		return (
			<ItemsTableCell href={href} padded interior field={this.props.col.type}>
				<ItemsTableValue>{label}</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default LocalFileColumn;
