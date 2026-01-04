/**
 * @fileoverview
 * This file defines the `NumberColumn` component, which is used to render the
 * value of a `Number` or `Money` field in a list view.
 */
import PropTypes from 'prop-types';

import React from 'react';
import numeral from 'numeral';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `NumberColumn` component.
 * @extends React.Component
 */
class NumberColumn extends React.Component {
    static displayName = 'NumberColumn';

    static propTypes = {
		col: PropTypes.object,
		data: PropTypes.object,
	};

    /**
	 * Renders the value of the field.
	 * @returns {string} The formatted value.
	 */
    renderValue = () => {
		const value = this.props.data.fields[this.props.col.path];
		if (value === undefined || isNaN(value)) return null;

		const formattedValue = (this.props.col.type === 'money') ? numeral(value).format('$0,0.00') : value;

		return formattedValue;
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

export default NumberColumn;
