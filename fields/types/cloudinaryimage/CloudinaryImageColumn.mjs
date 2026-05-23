/**
 * @file
 * This file defines the `CloudinaryImageColumn` component, which is used to
 * render the value of a `CloudinaryImage` field in a list view.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import CloudinaryImageSummary from '../../components/columns/CloudinaryImageSummary.mjs';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `CloudinaryImageColumn` component.
 * @augments React.Component
 */
const CloudinaryImageColumn = createReactClass({
	displayName: 'CloudinaryImageColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	/**
	 * Renders the value of the field, or nothing if the field has no value.
	 * @returns {React.Element|undefined} The rendered value, or undefined if no image data is present.
	 */
	renderValue: function () {
		const value = this.props.data.fields[this.props.col.path];
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

export default CloudinaryImageColumn;
