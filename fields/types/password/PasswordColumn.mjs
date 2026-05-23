/**
 * @file
 * This file defines the `PasswordColumn` component, which is used to render
 * the value of a `Password` field in a list view.
 *
 * It displays '********' if a password is set, and an empty string otherwise.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `PasswordColumn` component.
 * @augments React.Component
 */
const PasswordColumn = createReactClass({
	displayName: 'PasswordColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
	},
	/**
	 * Renders the value of the field.
	 * @returns {string} The rendered value.
	 */
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		return value ? '********' : '';
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default PasswordColumn;
