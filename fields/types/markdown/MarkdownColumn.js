/**
 * @fileoverview
 * This file defines the `MarkdownColumn` component, which is used to render the
 * value of a `Markdown` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

/**
 * The `MarkdownColumn` component.
 * @extends React.Component
 */
var MarkdownColumn = React.createClass({
	displayName: 'MarkdownColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	/**
	 * Renders the value of the field.
	 * @returns {string} The value of the field.
	 */
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		return (value && Object.keys(value).length) ? value.md.substr(0, 100) : null;
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = MarkdownColumn;
