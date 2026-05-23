/**
 * @file
 * This file defines the `BooleanColumn` component, which is used to render the
 * value of a `Boolean` field in a list view.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Checkbox from '../../components/Checkbox.mjs';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `BooleanColumn` component.
 * @augments React.Component
 */
const BooleanColumn = createReactClass({
	displayName: 'BooleanColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
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
