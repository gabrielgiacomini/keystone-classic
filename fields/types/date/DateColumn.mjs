/**
 * @file
 * This file defines the `DateColumn` component, which is used to render the
 * value of a `Date` or `Datetime` field in a list view.
 */
import React from 'react';
import moment from 'moment';
import ItemsTableCell from '../../components/ItemsTableCell.mjs';
import ItemsTableValue from '../../components/ItemsTableValue.mjs';

/**
 * The `DateColumn` component.
 * @augments React.Component
 */
const DateColumn = React.createClass({
	displayName: 'DateColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		linkTo: React.PropTypes.string,
	},
	/**
	 * Converts a value to a moment object.
	 * @param {string|Date|number} value The value to convert.
	 * @returns {moment.Moment} The moment object.
	 */
	toMoment (value) {
		if (this.props.col.field.isUTC) {
			return moment.utc(value);
		} else {
			return moment(value);
		}
	},
	/**
	 * Gets the value of the field.
	 * @returns {string} The formatted value.
	 */
	getValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return null;

		const format = (this.props.col.type === 'datetime') ? 'MMMM Do YYYY, h:mm:ss a' : 'MMMM Do YYYY';
		return this.toMoment(value).format(format);
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		const value = this.getValue();
		const empty = !value && this.props.linkTo ? true : false;
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type} to={this.props.linkTo} empty={empty}>
					{value}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export default DateColumn;
