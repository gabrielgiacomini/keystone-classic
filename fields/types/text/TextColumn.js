/**
 * @fileoverview
 * This file defines the `TextColumn` component, which is used to render the
 * value of a `Text` field in a list view.
 */
import PropTypes from 'prop-types';

import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `TextColumn` component.
 * @extends React.Component
 */
class TextColumn extends React.Component {
    static displayName = 'TextColumn';

    static propTypes = {
		col: PropTypes.object,
		data: PropTypes.object,
		linkTo: PropTypes.string,
	};

    /**
	 * Renders the value of the field.
	 * @returns {string} The value of the field.
	 */
    getValue = () => {
		// cropping text is important for textarea, which uses this column
		const value = this.props.data.fields[this.props.col.path];
		return value ? value.substr(0, 100) : null;
	};

    /**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
    render() {
		const value = this.getValue();
		const empty = !value && this.props.linkTo ? true : false;
		const className = this.props.col.field.monospace ? 'ItemList__value--monospace' : undefined;
		return (
			<ItemsTableCell>
				<ItemsTableValue className={className} to={this.props.linkTo} empty={empty} padded interior field={this.props.col.type}>
					{value}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
}

export default TextColumn;
