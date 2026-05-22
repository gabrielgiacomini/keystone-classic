/**
 * @file
 * This file defines the `CloudinaryImagesColumn` component, which is used to
 * render the value of a `CloudinaryImages` field in a list view.
 */
import React from 'react';
import CloudinaryImageSummary from '../../components/columns/CloudinaryImageSummary.mjs';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const moreIndicatorStyle = {
	color: '#888',
	fontSize: '.8rem',
};

/**
 * The `CloudinaryImagesColumn` component.
 * @augments React.Component
 */
const CloudinaryImagesColumn = React.createClass({
	displayName: 'CloudinaryImagesColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	/**
	 * Renders the values of a many-to-many relationship.
	 * @param {Array} value The array of related items.
	 * @returns {Array|undefined} An array of thumbnail elements, or undefined if the value is empty.
	 */
	renderMany (value) {
		if (!value || !value.length) return;
		const items = [];
		for (let i = 0; i < 3; i++) {
			if (!value[i]) break;
			items.push(<CloudinaryImageSummary key={'image' + i} image={value[i]} secure={this.props.col.field.secure} />);
		}
		if (value.length > 3) {
			items.push(<span key="more" style={moreIndicatorStyle}>[...{value.length - 3} more]</span>);
		}
		return items;
	},
	/**
	 * Renders the value of a one-to-many relationship.
	 * @param {object} value The related item.
	 * @returns {React.Element|undefined} The rendered value, or undefined if the value is empty.
	 */
	renderValue (value) {
		if (!value || !Object.keys(value).length) return;

		return <CloudinaryImageSummary image={value} secure={this.props.col.field.secure} />;

	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const value = this.props.data.fields[this.props.col.path];
		const many = value.length > 1;

		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{many ? this.renderMany(value) : this.renderValue(value[0])}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default CloudinaryImagesColumn;
