/**
 * @file
 * This file defines the `EmailColumn` component, which is used to render the
 * value of an `Email` field in a list view.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `EmailColumn` component.
 * @augments React.Component
 */
const EmailColumn = createReactClass({
	displayName: 'EmailColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	/**
	 * Renders the value of the field as a mailto link, or nothing if the field has no value.
	 * @returns {React.Element|undefined} The rendered value, or `undefined` if the field is empty.
	 */
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return;

		return (
			<ItemsTableValue to={'mailto:' + value} padded exterior field={this.props.col.type}>
				{value}
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

export default EmailColumn;
