/**
 * @file
 * This file defines the `BooleanColumn` component, which is used to render the
 * value of a `Boolean` field in a list view.
 */
import React from 'react';
import Checkbox from '../../components/Checkbox.mjs';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `BooleanColumn` component.
 * @augments React.Component
 */
const BooleanColumn = React.createClass({
	displayName: 'BooleanColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		return (
			<ItemsTableValue truncate={false} field={this.props.col.type}>
				<Checkbox readonly checked={this.props.data.fields[this.props.col.path]} />
			</ItemsTableValue>
		);
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

export default BooleanColumn;
