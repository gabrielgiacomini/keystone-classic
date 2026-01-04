/**
 * @fileoverview
 * This file defines the `GeoPointColumn` component, which is used to render
 * the value of a `GeoPoint` field in a list view.
 */
import PropTypes from 'prop-types';

import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `GeoPointColumn` component.
 * @extends React.Component
 */
class GeoPointColumn extends React.Component {
    static displayName = 'GeoPointColumn';

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
		if (!value || !value.length) return null;

		const formattedValue = `${value[1]}, ${value[0]}`;
		const formattedTitle = `Lat: ${value[1]} Lng: ${value[0]}`;

		return (
			<ItemsTableValue title={formattedTitle} field={this.props.col.type}>
				{formattedValue}
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

export default GeoPointColumn;
