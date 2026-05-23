/**
 * @file
 * This file defines the `RelationshipColumn` component, which is used to render
 * the value of a `Relationship` field in a list view.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

const moreIndicatorStyle = {
	color: '#bbb',
	fontSize: '.8rem',
	fontWeight: 500,
	marginLeft: 8,
};

/**
 * The `RelationshipColumn` component.
 * @augments React.Component
 */
const RelationshipColumn = createReactClass({
	displayName: 'RelationshipColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	/**
	 * Renders the values of a many-to-many relationship.
	 * @param {Array} value The array of related items.
	 * @returns {React.Element|undefined} The rendered values, or undefined if the array is empty.
	 */
	renderMany (value) {
		if (!value || !value.length) return;
		const refList = this.props.col.field.refList;
		const items = [];
		for (let i = 0; i < 3; i++) {
			if (!value[i]) break;
			if (i) {
				items.push(<span key={'comma' + i}>, </span>);
			}
			items.push(
				<ItemsTableValue interior truncate={false} key={'anchor' + i} to={Keystone.adminLegacyPath + '/' + refList.path + '/' + value[i].id}>
					{value[i].name}
				</ItemsTableValue>
			);
		}
		if (value.length > 3) {
			items.push(<span key="more" style={moreIndicatorStyle}>[...{value.length - 3} more]</span>);
		}
		return (
			<ItemsTableValue field={this.props.col.type}>
				{items}
			</ItemsTableValue>
		);
	},
	/**
	 * Renders the value of a one-to-many relationship.
	 * @param {object} value The related item.
	 * @returns {React.Element|undefined} The rendered value, or undefined if no value is provided.
	 */
	renderValue (value) {
		if (!value) return;
		const refList = this.props.col.field.refList;
		return (
			<ItemsTableValue to={Keystone.adminLegacyPath + '/' + refList.path + '/' + value.id} padded interior field={this.props.col.type}>
				{value.name}
			</ItemsTableValue>
		);
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const value = this.props.data.fields[this.props.col.path];
		const many = this.props.col.field.many;
		return (
			<ItemsTableCell>
				{many ? this.renderMany(value) : this.renderValue(value)}
			</ItemsTableCell>
		);
	},
});

export default RelationshipColumn;
