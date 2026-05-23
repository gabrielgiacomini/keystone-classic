/**
 * @file
 * This file defines the `BooleanFilter` component, which is used to filter
 * `Boolean` fields in the KeystoneJS Admin UI.
 *
 * It provides a segmented control to filter by whether the value is checked or
 * not.
 */
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { SegmentedControl } from '../../../admin/client-legacy/App/elemental';

const VALUE_OPTIONS = [
	{ label: 'Is Checked', value: true },
	{ label: 'Is NOT Checked', value: false },
];

/**
 * Returns the default value for the filter.
 * @returns {object} The default value.
 */
function getDefaultValue () {
	return {
		value: true,
	};
}

/**
 * The `BooleanFilter` component.
 * @augments React.Component
 */
const BooleanFilter = createReactClass({
	propTypes: {
		filter: PropTypes.shape({
			value: PropTypes.bool,
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

export default BooleanFilter;
