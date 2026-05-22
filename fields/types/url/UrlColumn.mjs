/**
 * @file
 * This file defines the `UrlColumn` component, which is used to render the
 * value of a `Url` field in a list view.
 */
import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `UrlColumn` component.
 * @augments React.Component
 */
const UrlColumn = React.createClass({
	displayName: 'UrlColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	/**
	 * Renders the value of the field, or nothing if the field has no value.
	 * @returns {React.Element|undefined} The rendered value, or undefined when the field is empty.
	 */
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return;

		// if the value doesn't start with a prototcol, assume http for the href
		let href = value;
		if (href && !/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + value;
		}

		// strip the protocol from the link if it's http(s)
		const label = value.replace(/^https?\:\/\//i, '');

		return (
			<ItemsTableValue to={href} padded exterior field={this.props.col.type}>
				{label}
			</ItemsTableValue>
		);
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

export default UrlColumn;
