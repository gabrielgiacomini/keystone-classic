/**
 * @fileoverview
 * This file defines the `CloudinaryImageColumn` component, which is used to
 * render the value of a `CloudinaryImage` field in a list view.
 */
import React from 'react';
import CloudinaryImageSummary from '../../components/columns/CloudinaryImageSummary';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `CloudinaryImageColumn` component.
 * @extends React.Component
 */
var CloudinaryImageColumn = React.createClass({
	displayName: 'CloudinaryImageColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue: function () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !Object.keys(value).length) return;

		return (
			<ItemsTableValue field={this.props.col.type}>
				<CloudinaryImageSummary label="dimensions" image={value} secure={this.props.col.field.secure} />
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

module.exports = CloudinaryImageColumn;
