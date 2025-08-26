/**
 * @fileoverview
 * This file defines the `EmbedlyColumn` component, which is used to render the
 * value of an `Embedly` field in a list view.
 */
var React = require('react');

/**
 * The `EmbedlyColumn` component.
 * @extends React.Component
 */
var EmbedlyColumn = React.createClass({
	/**
	 * Renders the value of the field.
	 * @returns {React.Element} The rendered value.
	 */
	renderValue: function () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;
		return <a href={value.url} target="_blank">{value.url}</a>;
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render: function () {
		return (
			<td>
				<div className="ItemList__value">{this.renderValue()}</div>
			</td>
		);
	},
});

module.exports = EmbedlyColumn;
