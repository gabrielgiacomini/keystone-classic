/**
 * @fileoverview
 * This file defines the `ColorColumn` component, which is used to render the
 * value of a `Color` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `ColorColumn` component.
 * @extends React.Component
 */
var ColorColumn = React.createClass({
	displayName: 'ColorColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return null;

		const colorBoxStyle = {
			backgroundColor: value,
			borderRadius: 3,
			display: 'inline-block',
			height: 18,
			marginRight: 10,
			verticalAlign: 'middle',
			width: 18,
		};

		return (
			<ItemsTableValue truncate={false} field={this.props.col.type}>
				<div style={{ lineHeight: '18px' }}>
					<span style={colorBoxStyle} />
					<span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{value}</span>
				</div>
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

export default ColorColumn;
