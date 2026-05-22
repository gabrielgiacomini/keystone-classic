/**
 * @file
 * This file defines the `NameColumn` component, which is used to render the
 * value of a `Name` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';
import displayName from '../../../lib/utils/displayName.mjs';

/**
 * The `NameColumn` component.
 * @augments React.Component
 */
const NameColumn = React.createClass({
	displayName: 'NameColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		linkTo: React.PropTypes.string,
	},
	/**
	 * Renders the value of the field.
	 * @returns {(string|React.Element)} The rendered value.
	 */
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || (!value.first && !value.last)) return '(no name)';
		return displayName(value.first, value.last);
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<ItemsTableCell
				data-list-row-edit={this.props.linkTo ? true : undefined}
				data-item-id={this.props.linkTo ? this.props.data.id : undefined}
			>
				<ItemsTableValue
					to={this.props.linkTo}
					padded
					interior
					field={this.props.col.type}
				>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default NameColumn;
