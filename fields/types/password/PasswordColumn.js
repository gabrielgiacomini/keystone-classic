/**
 * @fileoverview
 * This file defines the `PasswordColumn` component, which is used to render
 * the value of a `Password` field in a list view.
 *
 * It displays '********' if a password is set, and an empty string otherwise.
 */
import PropTypes from 'prop-types';

import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `PasswordColumn` component.
 * @extends React.Component
 */
class PasswordColumn extends React.Component {
    static displayName = 'PasswordColumn';

    static propTypes = {
		col: PropTypes.object,
		data: PropTypes.object,
	};

    /**
	 * Renders the value of the field.
	 * @returns {string} The rendered value.
	 */
    renderValue = () => {
		const value = this.props.data.fields[this.props.col.path];
		return value ? '********' : '';
	};

    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
    render() {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
}

export default PasswordColumn;
