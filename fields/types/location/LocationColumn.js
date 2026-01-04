/**
 * @fileoverview
 * This file defines the `LocationColumn` component, which is used to render
 * the value of a `Location` field in a list view.
 */
import PropTypes from 'prop-types';

import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const SUB_FIELDS = ['street1', 'suburb', 'state', 'postcode', 'country'];

/**
 * The `LocationColumn` component.
 * @extends React.Component
 */
class LocationColumn extends React.Component {
    static displayName = 'LocationColumn';

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
		if (!value || !Object.keys(value).length) return null;

		const output = [];

		SUB_FIELDS.map((i) => {
			if (value[i]) {
				output.push(value[i]);
			}
		});
		return (
			<ItemsTableValue field={this.props.col.type} title={output.join(', ')}>
				{output.join(', ')}
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

export default LocationColumn;
