/**
 * @fileoverview
 * This file defines the `CloudinaryImageColumn` component, which is used to
 * render the value of a `CloudinaryImage` field in a list view.
 */
import PropTypes from 'prop-types';

import React from 'react';
import CloudinaryImageSummary from '../../components/columns/CloudinaryImageSummary';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `CloudinaryImageColumn` component.
 * @extends React.Component
 */
class CloudinaryImageColumn extends React.Component {
    static displayName = 'CloudinaryImageColumn';

    static propTypes = {
		col: PropTypes.object,
		data: PropTypes.object,
	};

    /**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
    renderValue = () => {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !Object.keys(value).length) return;

		return (
			<ItemsTableValue field={this.props.col.type}>
				<CloudinaryImageSummary label="dimensions" image={value} secure={this.props.col.field.secure} />
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

export default CloudinaryImageColumn;
