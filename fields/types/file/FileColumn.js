/**
 * @fileoverview
 * This file defines the `FileColumn` component, which is used to render the
 * value of a `File` field in a list view.
 */
import React from 'react';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `FileColumn` component.
 * @extends React.Component
 */
class LocalFileColumn extends React.Component {
    /**
	 * Renders the value of the field.
	 * @returns {string} The name of the file.
	 */
    renderValue = () => {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !value.filename) return;
		return value.filename;
	};

    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
    render() {
		var value = this.props.data.fields[this.props.col.path];
		var href = value && value.url ? value.url : null;
		var label = value && value.filename ? value.filename : null;
		return (
			<ItemsTableCell href={href} padded interior field={this.props.col.type}>
				<ItemsTableValue>{label}</ItemsTableValue>
			</ItemsTableCell>
		);
	}
}

export default LocalFileColumn;
