/**
 * @fileoverview
 * This file defines the `EmailColumn` component, which is used to render the
 * value of an `Email` field in a list view.
 */
import PropTypes from 'prop-types';

import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `EmailColumn` component.
 * @extends React.Component
 */
class EmailColumn extends React.Component {
    static displayName = 'EmailColumn';

    static propTypes = {
		col: PropTypes.object,
		data: PropTypes.object,
	};

    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
    renderValue = () => {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return;

		return (
			<ItemsTableValue to={'mailto:' + value} padded exterior field={this.props.col.type}>
				{value}
			</ItemsTableValue>
		);
	};

    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
    render() {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	}
}

export default EmailColumn;
