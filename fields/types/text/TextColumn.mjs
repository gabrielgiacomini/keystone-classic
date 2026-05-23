/**
 * @file
 * This file defines the `TextColumn` component, which is used to render the
 * value of a `Text` field in a list view.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `TextColumn` component.
 * @augments React.Component
 */
const TextColumn = createReactClass({
	displayName: 'TextColumn',
	propTypes: {
		col: PropTypes.object,
		data: PropTypes.object,
		linkTo: PropTypes.string,
	},
	/**
	 * Renders the value of the field.
	 * @returns {string} The value of the field.
	 */
	getValue () {
		// cropping text is important for textarea, which uses this column
		const value = this.props.data.fields[this.props.col.path];
		return value ? value.slice(0, 100) : null;
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const value = this.getValue();
		const empty = !value && this.props.linkTo ? true : false;
		const className = this.props.col.field.monospace ? 'ItemList__value--monospace' : undefined;
		return (
			<ItemsTableCell
				data-list-row-edit={this.props.linkTo ? true : undefined}
				data-item-id={this.props.linkTo ? this.props.data.id : undefined}
			>
				<ItemsTableValue
					className={className}
					to={this.props.linkTo}
					empty={empty}
					padded
					interior
					field={this.props.col.type}
				>
					{value}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default TextColumn;
