/**
 * @fileoverview
 * This file defines the `BooleanColumn` component, which is used to render the
 * value of a `Boolean` field in a list view.
 */
import PropTypes from 'prop-types';

import React from 'react';
import Checkbox from '../../components/Checkbox';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `BooleanColumn` component.
 * @extends React.Component
 */
class BooleanColumn extends React.Component {
    static displayName = 'BooleanColumn';

    static propTypes = {
		col: PropTypes.object,
		data: PropTypes.object,
	};

    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
    renderValue = () => {
		return (
			<ItemsTableValue truncate={false} field={this.props.col.type}>
				<Checkbox readonly checked={this.props.data.fields[this.props.col.path]} />
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

export default BooleanColumn;
