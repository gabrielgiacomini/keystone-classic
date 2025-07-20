/**
 * @fileoverview
 * This file defines the `BooleanFilter` component, which is used to filter
 * `Boolean` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether the value is checked or
 * not.
 */
import React from 'react';
import { SegmentedControl } from '../../../admin/client/App/elemental';

const VALUE_OPTIONS = [
	{ label: 'Is Checked', value: true },
	{ label: 'Is NOT Checked', value: false },
];

/**
 * Returns the default value for the filter.
 * @returns {Object} The default value.
 */
function getDefaultValue () {
	return {
		value: true,
	};
}

/**
 * The `BooleanFilter` component.
 * @extends React.Component
 */
var BooleanFilter = React.createClass({
	propTypes: {
		filter: React.PropTypes.shape({
			value: React.PropTypes.bool,
		}),
	},
	statics: {
		getDefaultValue: getDefaultValue,
	},
	getDefaultProps () {
		return {
			filter: getDefaultValue(),
		};
	},
	/**
	 * Handles a change in the filter's value.
	 * @param {boolean} value The new value.
	 */
	updateValue (value) {
		this.props.onChange({ value });
	},
	/**
	 * Renders the component.
	 * @returns {React.Element} The rendered component.
	 */
	render () {
		return <SegmentedControl equalWidthSegments options={VALUE_OPTIONS} value={this.props.filter.value} onChange={this.updateValue} />;
	},
});

module.exports = BooleanFilter;
