/**
 * @fileoverview
 * This file defines the `NameColumn` component, which is used to render the
 * value of a `Name` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';
import displayName from 'display-name';

/**
 * The `NameColumn` component.
 * @extends React.Component
 */
var NameColumn = React.createClass({
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
		var value = this.props.data.fields[this.props.col.path];
		if (!value || (!value.first && !value.last)) return '(no name)';
		return displayName(value.first, value.last);
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue to={this.props.linkTo} padded interior field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default NameColumn;
